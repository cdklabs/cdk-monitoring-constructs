import {
  GraphWidget,
  HorizontalAnnotation,
  IWidget,
  LogQueryWidget,
} from "aws-cdk-lib/aws-cloudwatch";

import {
  CloudWatchLogsMetricFactory,
  CloudWatchLogsMetricFactoryProps,
} from "./CloudWatchLogsMetricFactory";
import {
  AlarmFactory,
  BaseMonitoringProps,
  CountAxisFromZero,
  DefaultGraphWidgetHeight,
  DefaultLogWidgetHeight,
  DefaultSummaryWidgetHeight,
  FullWidth,
  MaxUsageCountThreshold,
  MetricWithAlarmSupport,
  MinUsageCountThreshold,
  Monitoring,
  MonitoringScope,
  QuarterWidth,
  ThreeQuartersWidth,
  UsageAlarmFactory,
} from "../../common";
import {
  MonitoringHeaderWidget,
  MonitoringNamingStrategy,
} from "../../dashboard";

const DefaultLimit = 10;

export interface LogMonitoringProps
  extends BaseMonitoringProps,
    CloudWatchLogsMetricFactoryProps {
  /**
   * Widget title
   *
   * @default - auto-generated title based on the pattern and limit
   */
  readonly title?: string;

  /**
   * Pattern to search for, e.g. "ERROR"
   */
  readonly pattern?: string;

  /**
   * Maximum number of log messages to search for.
   *
   * @default - 10
   */
  readonly limit?: number;

  readonly addMinIncomingLogsAlarm?: Record<string, MinUsageCountThreshold>;
  readonly addMaxIncomingLogsAlarm?: Record<string, MaxUsageCountThreshold>;
}

/**
 * Monitors a CloudWatch log group for various patterns.
 */
export class LogMonitoring extends Monitoring {
  readonly logGroupName: string;
  readonly logGroupUrl?: string;

  readonly title?: string;

  readonly pattern?: string;
  readonly limit: number;

  readonly alarmFactory: AlarmFactory;
  readonly usageAlarmFactory: UsageAlarmFactory;
  readonly incomingLogEventsMetric: MetricWithAlarmSupport;

  readonly usageAnnotations: HorizontalAnnotation[];

  constructor(scope: MonitoringScope, props: LogMonitoringProps) {
    super(scope);

    this.logGroupName = props.logGroupName;
    this.logGroupUrl = scope
      .createAwsConsoleUrlFactory()
      .getCloudWatchLogGroupUrl(props.logGroupName);

    this.title = props.title;

    this.pattern = props.pattern;
    this.limit = props.limit ?? DefaultLimit;

    const namingStrategy = new MonitoringNamingStrategy({
      ...props,
      fallbackConstructName: this.logGroupName,
    });
    this.alarmFactory = this.createAlarmFactory(
      namingStrategy.resolveAlarmFriendlyName()
    );
    this.usageAlarmFactory = new UsageAlarmFactory(this.alarmFactory);

    this.usageAnnotations = [];

    const metricFactory = new CloudWatchLogsMetricFactory(
      scope.createMetricFactory(),
      props
    );
    this.incomingLogEventsMetric = metricFactory.metricIncomingLogEvents();

    for (const disambiguator in props.addMinIncomingLogsAlarm) {
      const alarmProps = props.addMinIncomingLogsAlarm[disambiguator];
      const createdAlarm = this.usageAlarmFactory.addMinUsageCountAlarm(
        this.incomingLogEventsMetric,
        alarmProps,
        disambiguator
      );
      this.usageAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }

    for (const disambiguator in props.addMaxIncomingLogsAlarm) {
      const alarmProps = props.addMaxIncomingLogsAlarm[disambiguator];
      const createdAlarm = this.usageAlarmFactory.addMaxCountAlarm(
        this.incomingLogEventsMetric,
        alarmProps,
        disambiguator
      );
      this.usageAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }

    props.useCreatedAlarms?.consume(this.createdAlarms());
  }

  summaryWidgets(): IWidget[] {
    return [
      this.createTitleWidget(),
      this.createIncomingLogsWidget(FullWidth, DefaultSummaryWidgetHeight),
    ];
  }

  widgets(): IWidget[] {
    if (this.pattern) {
      const height = this.resolveRecommendedHeight(this.limit);

      return [
        this.createTitleWidget(),

        // Log Query Results
        new LogQueryWidget({
          logGroupNames: [this.logGroupName],
          height,
          width: ThreeQuartersWidth,
          title: this.title ?? `Find ${this.pattern} (limit = ${this.limit})`,
          /**
           * https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax.html
           */
          queryLines: [
            "fields @timestamp, @logStream, @message",
            `filter @message like /${this.pattern}/`,
            "sort @timestamp desc",
            `limit ${this.limit}`,
          ],
        }),

        this.createIncomingLogsWidget(QuarterWidth, height),
      ];
    } else {
      return [
        this.createTitleWidget(),
        this.createIncomingLogsWidget(FullWidth, DefaultGraphWidgetHeight),
      ];
    }
  }

  createTitleWidget() {
    return new MonitoringHeaderWidget({
      family: "Log Group",
      title: this.logGroupName,
      goToLinkUrl: this.logGroupUrl,
    });
  }

  createIncomingLogsWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Incoming logs",
      left: [this.incomingLogEventsMetric],
      leftYAxis: CountAxisFromZero,
      leftAnnotations: this.usageAnnotations,
    });
  }

  protected resolveRecommendedHeight(numRows: number) {
    const heightPerLine = 1;
    const recommendedHeight = heightPerLine * numRows;
    return Math.max(recommendedHeight, DefaultLogWidgetHeight);
  }
}
