import {
  ComparisonOperator,
  GraphWidget,
  HorizontalAnnotation,
  IWidget,
  TreatMissingData,
} from "aws-cdk-lib/aws-cloudwatch";

import {
  EfsMetricFactory,
  EfsMetricFactoryProps,
  EfsStorageClass,
} from "./EfsMetricFactory";
import {
  AlarmFactory,
  BaseMonitoringProps,
  CountAxisFromZero,
  DefaultGraphWidgetHeight,
  DefaultSummaryWidgetHeight,
  MetricWithAlarmSupport,
  Monitoring,
  MonitoringScope,
  PercentageAxisFromZeroToHundred,
  RateAxisFromZero,
  SizeAxisBytesFromZero,
  ThirdWidth,
  UsageThreshold,
} from "../../common";
import {
  MonitoringHeaderWidget,
  MonitoringNamingStrategy,
} from "../../dashboard";

export interface EfsMonitoringOptions extends BaseMonitoringProps {
  /**
   * Alarm when throughput utilization (metered vs. permitted throughput) exceeds a percentage.
   */
  readonly addThroughputUtilizationAlarm?: Record<string, UsageThreshold>;
  /**
   * Alarm when PercentIOLimit exceeds a percentage (General Purpose performance mode only).
   */
  readonly addIOLimitUtilizationAlarm?: Record<string, UsageThreshold>;
}

export interface EfsMonitoringProps
  extends EfsMetricFactoryProps,
    EfsMonitoringOptions {}

export class EfsMonitoring extends Monitoring {
  readonly title: string;
  readonly url?: string;

  readonly alarmFactory: AlarmFactory;
  readonly throughputAnnotations: HorizontalAnnotation[];
  readonly ioLimitAnnotations: HorizontalAnnotation[];

  readonly throughputUtilizationMetric: MetricWithAlarmSupport;
  readonly ioLimitUtilizationMetric: MetricWithAlarmSupport;
  readonly iopsMetrics: MetricWithAlarmSupport[];
  readonly throughputMetrics: MetricWithAlarmSupport[];
  readonly clientConnectionsMetric: MetricWithAlarmSupport;
  readonly storageBytesMetrics: MetricWithAlarmSupport[];

  constructor(scope: MonitoringScope, props: EfsMonitoringProps) {
    super(scope, props);

    const metricFactory = new EfsMetricFactory(
      scope.createMetricFactory(),
      props,
    );
    this.throughputUtilizationMetric =
      metricFactory.metricThroughputUtilizationPercent();
    this.ioLimitUtilizationMetric =
      metricFactory.metricIOLimitUtilizationPercent();
    this.iopsMetrics = [
      metricFactory.metricDataReadIops(),
      metricFactory.metricDataWriteIops(),
      metricFactory.metricMetadataIops(),
    ];
    this.throughputMetrics = [
      metricFactory.metricDataReadBytesPerSecond(),
      metricFactory.metricDataWriteBytesPerSecond(),
      metricFactory.metricMetadataBytesPerSecond(),
    ];
    this.clientConnectionsMetric = metricFactory.metricClientConnections();
    this.storageBytesMetrics = Object.values(EfsStorageClass).map((cls) =>
      metricFactory.metricStorageBytes(cls),
    );

    const namingStrategy = new MonitoringNamingStrategy({
      ...props,
      fallbackConstructName: metricFactory.fileSystemId,
      namedConstruct: props.fileSystem,
    });
    this.title = namingStrategy.resolveHumanReadableName();
    this.url = scope
      .createAwsConsoleUrlFactory()
      .getEfsFileSystemUrl(metricFactory.fileSystemId);
    this.alarmFactory = this.createAlarmFactory(
      namingStrategy.resolveAlarmFriendlyName(),
    );

    this.throughputAnnotations = this.addUsageAlarms(
      this.throughputUtilizationMetric,
      props.addThroughputUtilizationAlarm,
      "Throughput-Utilization",
      "The file system throughput utilization is too high.",
    );
    this.ioLimitAnnotations = this.addUsageAlarms(
      this.ioLimitUtilizationMetric,
      props.addIOLimitUtilizationAlarm,
      "IO-Limit-Utilization",
      "The file system is close to its General Purpose IO limit.",
    );

    props.useCreatedAlarms?.consume(this.createdAlarms());
  }

  summaryWidgets(): IWidget[] {
    return [
      this.createTitleWidget(),
      this.createThroughputUtilizationWidget(
        ThirdWidth,
        DefaultSummaryWidgetHeight,
      ),
      this.createIopsWidget(ThirdWidth, DefaultSummaryWidgetHeight),
      this.createStorageWidget(ThirdWidth, DefaultSummaryWidgetHeight),
    ];
  }

  widgets(): IWidget[] {
    return [
      this.createTitleWidget(),
      this.createThroughputUtilizationWidget(
        ThirdWidth,
        DefaultGraphWidgetHeight,
      ),
      this.createIopsWidget(ThirdWidth, DefaultGraphWidgetHeight),
      this.createThroughputWidget(ThirdWidth, DefaultGraphWidgetHeight),
      this.createIOLimitUtilizationWidget(ThirdWidth, DefaultGraphWidgetHeight),
      this.createClientConnectionsWidget(ThirdWidth, DefaultGraphWidgetHeight),
      this.createStorageWidget(ThirdWidth, DefaultGraphWidgetHeight),
    ];
  }

  createTitleWidget() {
    return new MonitoringHeaderWidget({
      family: "EFS File System",
      title: this.title,
      goToLinkUrl: this.url,
    });
  }

  createThroughputUtilizationWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Throughput utilization",
      left: [this.throughputUtilizationMetric],
      leftYAxis: PercentageAxisFromZeroToHundred,
      leftAnnotations: this.throughputAnnotations,
    });
  }

  createIopsWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "IOPS by type",
      left: this.iopsMetrics,
      leftYAxis: RateAxisFromZero,
    });
  }

  createThroughputWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Throughput by type (bytes/s)",
      left: this.throughputMetrics,
      leftYAxis: SizeAxisBytesFromZero,
    });
  }

  createIOLimitUtilizationWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "IOPS utilization",
      left: [this.ioLimitUtilizationMetric],
      leftYAxis: PercentageAxisFromZeroToHundred,
      leftAnnotations: this.ioLimitAnnotations,
    });
  }

  createClientConnectionsWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Client connections",
      left: [this.clientConnectionsMetric],
      leftYAxis: CountAxisFromZero,
    });
  }

  createStorageWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Storage",
      left: this.storageBytesMetrics,
      leftYAxis: SizeAxisBytesFromZero,
    });
  }

  private addUsageAlarms(
    metric: MetricWithAlarmSupport,
    thresholds: Record<string, UsageThreshold> | undefined,
    alarmNameSuffix: string,
    alarmDescription: string,
  ): HorizontalAnnotation[] {
    const annotations: HorizontalAnnotation[] = [];
    for (const disambiguator in thresholds) {
      const props = thresholds[disambiguator];
      const createdAlarm = this.alarmFactory.addAlarm(metric, {
        treatMissingData:
          props.treatMissingDataOverride ?? TreatMissingData.MISSING,
        comparisonOperator:
          props.comparisonOperatorOverride ??
          ComparisonOperator.GREATER_THAN_THRESHOLD,
        ...props,
        disambiguator,
        threshold: props.maxUsagePercent,
        alarmNameSuffix,
        alarmDescription,
      });
      annotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }
    return annotations;
  }
}
