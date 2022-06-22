import {
  GraphWidget,
  HorizontalAnnotation,
  IWidget,
} from "aws-cdk-lib/aws-cloudwatch";
import {
  BaseMonitoringProps,
  CountAxisFromZero,
  DefaultGraphWidgetHeight,
  DefaultSummaryWidgetHeight,
  MetricWithAlarmSupport,
  Monitoring,
  MonitoringScope,
  PercentageAxisFromZeroToHundred,
  QuarterWidth,
  ThirdWidth,
  TimeAxisMillisFromZero,
  UsageAlarmFactory,
  UsageThreshold,
} from "../../common";
import {
  MonitoringHeaderWidget,
  MonitoringNamingStrategy,
} from "../../dashboard";
import {
  DocumentDbMetricFactory,
  DocumentDbMetricFactoryProps,
} from "./DocumentDbMetricFactory";

export interface DocumentDbMonitoringOptions extends BaseMonitoringProps {
  readonly addCpuUsageAlarm?: Record<string, UsageThreshold>;
}

export interface DocumentDbMonitoringProps
  extends DocumentDbMetricFactoryProps,
    DocumentDbMonitoringOptions {}

export class DocumentDbMonitoring extends Monitoring {
  protected readonly title: string;
  protected readonly url?: string;

  protected readonly usageAlarmFactory: UsageAlarmFactory;
  protected readonly usageAnnotations: HorizontalAnnotation[];

  protected readonly cpuUsageMetric: MetricWithAlarmSupport;
  protected readonly readLatencyMetric: MetricWithAlarmSupport;
  protected readonly writeLatencyMetric: MetricWithAlarmSupport;
  protected readonly connectionsMetric: MetricWithAlarmSupport;
  protected readonly cursorsMetric: MetricWithAlarmSupport;
  protected readonly transactionsMetric: MetricWithAlarmSupport;
  protected readonly throttledMetric: MetricWithAlarmSupport;

  constructor(scope: MonitoringScope, props: DocumentDbMonitoringProps) {
    super(scope, props);

    const namingStrategy = new MonitoringNamingStrategy({
      ...props,
      fallbackConstructName: props.clusterIdentifier,
    });
    this.title = namingStrategy.resolveHumanReadableName();
    this.url = scope
      .createAwsConsoleUrlFactory()
      .getDocumentDbClusterUrl(props.clusterIdentifier);
    const alarmFactory = this.createAlarmFactory(
      namingStrategy.resolveAlarmFriendlyName()
    );

    this.usageAlarmFactory = new UsageAlarmFactory(alarmFactory);
    this.usageAnnotations = [];

    const metricFactory = new DocumentDbMetricFactory(
      scope.createMetricFactory(),
      props
    );

    this.cpuUsageMetric = metricFactory.metricAverageCpuUsageInPercent();
    this.readLatencyMetric = metricFactory.metricAverageCpuUsageInPercent();
    this.writeLatencyMetric = metricFactory.metricAverageCpuUsageInPercent();
    this.connectionsMetric = metricFactory.metricMaxConnectionCount();
    this.cursorsMetric = metricFactory.metricMaxCursorCount();
    this.transactionsMetric = metricFactory.metricMaxTransactionOpenCount();
    this.throttledMetric =
      metricFactory.metricOperationsThrottledDueLowMemoryCount();

    for (const disambiguator in props.addCpuUsageAlarm) {
      const alarmProps = props.addCpuUsageAlarm[disambiguator];
      const createdAlarm = this.usageAlarmFactory.addMaxCpuUsagePercentAlarm(
        this.cpuUsageMetric,
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
      this.createResourceUsageWidget(ThirdWidth, DefaultSummaryWidgetHeight),
      this.createConnectionsWidget(ThirdWidth, DefaultSummaryWidgetHeight),
      this.createLatencyWidget(ThirdWidth, DefaultSummaryWidgetHeight),
    ];
  }

  widgets(): IWidget[] {
    return [
      this.createTitleWidget(),
      this.createResourceUsageWidget(QuarterWidth, DefaultGraphWidgetHeight),
      this.createConnectionsWidget(QuarterWidth, DefaultGraphWidgetHeight),
      this.createTransactionsWidget(QuarterWidth, DefaultGraphWidgetHeight),
      this.createLatencyWidget(QuarterWidth, DefaultGraphWidgetHeight),
    ];
  }

  protected createTitleWidget() {
    return new MonitoringHeaderWidget({
      family: "DocumentDB",
      title: this.title,
      goToLinkUrl: this.url,
    });
  }

  protected createResourceUsageWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "CPU Usage",
      left: [this.cpuUsageMetric],
      leftYAxis: PercentageAxisFromZeroToHundred,
      leftAnnotations: this.usageAnnotations,
    });
  }

  protected createConnectionsWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Connections",
      left: [this.connectionsMetric],
      leftYAxis: CountAxisFromZero,
    });
  }

  protected createTransactionsWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Transactions",
      left: [this.transactionsMetric, this.cursorsMetric],
      leftYAxis: CountAxisFromZero,
    });
  }

  protected createLatencyWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Latency",
      left: [this.readLatencyMetric, this.writeLatencyMetric],
      leftYAxis: TimeAxisMillisFromZero,
    });
  }
}
