import {
  GraphWidget,
  HorizontalAnnotation,
  IWidget,
} from "aws-cdk-lib/aws-cloudwatch";

import {
  DynamoTableGlobalSecondaryIndexMetricFactory,
  DynamoTableGlobalSecondaryIndexMetricFactoryProps,
} from "./DynamoTableGlobalSecondaryIndexMetricFactory";
import {
  BaseMonitoringProps,
  CapacityType,
  CountAxisFromZero,
  DefaultGraphWidgetHeight,
  DefaultSummaryWidgetHeight,
  DynamoAlarmFactory,
  MetricWithAlarmSupport,
  Monitoring,
  MonitoringScope,
  ThirdWidth,
  ThrottledEventsThreshold,
} from "../../common";
import {
  MonitoringHeaderWidget,
  MonitoringNamingStrategy,
} from "../../dashboard";

export interface DynamoTableGlobalSecondaryIndexMonitoringProps
  extends DynamoTableGlobalSecondaryIndexMetricFactoryProps,
    BaseMonitoringProps {
  readonly addReadThrottledEventsCountAlarm?: Record<
    string,
    ThrottledEventsThreshold
  >;
  readonly addWriteThrottledEventsCountAlarm?: Record<
    string,
    ThrottledEventsThreshold
  >;
}

export class DynamoTableGlobalSecondaryIndexMonitoring extends Monitoring {
  protected readonly title: string;
  protected readonly tableUrl?: string;

  protected readonly provisionedReadUnitsMetric: MetricWithAlarmSupport;
  protected readonly provisionedWriteUnitsMetric: MetricWithAlarmSupport;
  protected readonly consumedReadUnitsMetric: MetricWithAlarmSupport;
  protected readonly consumedWriteUnitsMetric: MetricWithAlarmSupport;
  protected readonly indexConsumedWriteUnitsMetric: MetricWithAlarmSupport;
  protected readonly readThrottleCountMetric: MetricWithAlarmSupport;
  protected readonly writeThrottleCountMetric: MetricWithAlarmSupport;
  protected readonly indexThrottleCountMetric: MetricWithAlarmSupport;

  protected readonly gsiAlarmFactory: DynamoAlarmFactory;
  protected readonly throttledEventsAnnotations: HorizontalAnnotation[];

  constructor(
    scope: MonitoringScope,
    props: DynamoTableGlobalSecondaryIndexMonitoringProps
  ) {
    super(scope);

    const namingStrategy = new MonitoringNamingStrategy({
      ...props,
      fallbackConstructName: props.globalSecondaryIndexName,
    });

    this.title = namingStrategy.resolveHumanReadableName();
    this.tableUrl = scope
      .createAwsConsoleUrlFactory()
      .getDynamoTableUrl(props.table.tableName);

    const metricFactory = new DynamoTableGlobalSecondaryIndexMetricFactory(
      scope.createMetricFactory(),
      props
    );
    this.provisionedReadUnitsMetric =
      metricFactory.metricProvisionedReadCapacityUnits();
    this.provisionedWriteUnitsMetric =
      metricFactory.metricProvisionedWriteCapacityUnits();
    this.consumedReadUnitsMetric =
      metricFactory.metricConsumedReadCapacityUnits();
    this.consumedWriteUnitsMetric =
      metricFactory.metricConsumedWriteCapacityUnits();
    this.indexConsumedWriteUnitsMetric =
      metricFactory.metricIndexConsumedWriteUnitsMetric();
    this.readThrottleCountMetric =
      metricFactory.metricThrottledReadRequestCount();
    this.writeThrottleCountMetric =
      metricFactory.metricThrottledWriteRequestCount();
    this.indexThrottleCountMetric =
      metricFactory.metricThrottledIndexRequestCount();

    const alarmFactory = scope.createAlarmFactory(
      namingStrategy.resolveAlarmFriendlyName()
    );
    this.gsiAlarmFactory = new DynamoAlarmFactory(alarmFactory);
    this.throttledEventsAnnotations = [];

    for (const disambiguator in props.addReadThrottledEventsCountAlarm) {
      const alarmProps = props.addReadThrottledEventsCountAlarm[disambiguator];
      const createdAlarm = this.gsiAlarmFactory.addThrottledEventsAlarm(
        this.readThrottleCountMetric,
        CapacityType.READ,
        alarmProps,
        disambiguator
      );
      this.throttledEventsAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }
    for (const disambiguator in props.addWriteThrottledEventsCountAlarm) {
      const alarmProps = props.addWriteThrottledEventsCountAlarm[disambiguator];
      const createdAlarm = this.gsiAlarmFactory.addThrottledEventsAlarm(
        this.writeThrottleCountMetric,
        CapacityType.WRITE,
        alarmProps,
        disambiguator
      );
      this.throttledEventsAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }
  }

  summaryWidgets(): IWidget[] {
    return [
      this.createTitleWidget(),
      this.createReadCapacityWidget(ThirdWidth, DefaultSummaryWidgetHeight),
      this.createWriteCapacityWidget(ThirdWidth, DefaultSummaryWidgetHeight),
      this.createThrottlesWidget(ThirdWidth, DefaultSummaryWidgetHeight),
    ];
  }

  widgets(): IWidget[] {
    return [
      this.createTitleWidget(),
      this.createReadCapacityWidget(ThirdWidth, DefaultGraphWidgetHeight),
      this.createWriteCapacityWidget(ThirdWidth, DefaultGraphWidgetHeight),
      this.createThrottlesWidget(ThirdWidth, DefaultGraphWidgetHeight),
    ];
  }

  protected createTitleWidget() {
    return new MonitoringHeaderWidget({
      family: "Dynamo Table Global Secondary Index",
      title: this.title,
      goToLinkUrl: this.tableUrl,
    });
  }

  protected createReadCapacityWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Read Capacity",
      left: [this.consumedReadUnitsMetric, this.provisionedReadUnitsMetric],
      leftYAxis: CountAxisFromZero,
    });
  }

  protected createWriteCapacityWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Write Capacity",
      left: [
        this.consumedWriteUnitsMetric,
        this.provisionedWriteUnitsMetric,
        this.indexConsumedWriteUnitsMetric,
      ],
      leftYAxis: CountAxisFromZero,
    });
  }

  protected createThrottlesWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Throttles",
      left: [
        this.readThrottleCountMetric,
        this.writeThrottleCountMetric,
        this.indexThrottleCountMetric,
      ],
      leftYAxis: CountAxisFromZero,
      leftAnnotations: this.throttledEventsAnnotations,
    });
  }
}
