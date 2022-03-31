import {
  GraphWidget,
  HorizontalAnnotation,
  IWidget,
} from "aws-cdk-lib/aws-cloudwatch";

import {
  BaseMonitoringProps,
  BooleanAxisFromZeroToOne,
  CountAxisFromZero,
  DefaultGraphWidgetHeight,
  DefaultSummaryWidgetHeight,
  HalfQuarterWidth,
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
  RedshiftClusterMetricFactory,
  RedshiftClusterMetricFactoryProps,
} from "./RedshiftClusterMetricFactory";

export interface RedshiftClusterMonitoringOptions extends BaseMonitoringProps {
  readonly addDiskSpaceUsageAlarm?: Record<string, UsageThreshold>;
  readonly addCpuUsageAlarm?: Record<string, UsageThreshold>;
}

export interface RedshiftClusterMonitoringProps
  extends RedshiftClusterMetricFactoryProps,
    RedshiftClusterMonitoringOptions {}

export class RedshiftClusterMonitoring extends Monitoring {
  protected readonly title: string;
  protected readonly url?: string;

  protected readonly usageAlarmFactory: UsageAlarmFactory;
  protected readonly usageAnnotations: HorizontalAnnotation[];

  protected readonly connectionsMetric: MetricWithAlarmSupport;
  protected readonly diskSpaceUsageMetric: MetricWithAlarmSupport;
  protected readonly cpuUsageMetric: MetricWithAlarmSupport;
  protected readonly shortQueryDurationMetric: MetricWithAlarmSupport;
  protected readonly mediumQueryDurationMetric: MetricWithAlarmSupport;
  protected readonly longQueryDurationMetric: MetricWithAlarmSupport;
  protected readonly readLatencyMetric: MetricWithAlarmSupport;
  protected readonly writeLatencyMetric: MetricWithAlarmSupport;

  protected readonly maintenanceModeMetric: MetricWithAlarmSupport;

  constructor(scope: MonitoringScope, props: RedshiftClusterMonitoringProps) {
    super(scope, props);

    const namingStrategy = new MonitoringNamingStrategy({
      ...props,
      fallbackConstructName: props.clusterIdentifier,
    });
    this.title = namingStrategy.resolveHumanReadableName();
    this.url = scope
      .createAwsConsoleUrlFactory()
      .getRedshiftClusterUrl(props.clusterIdentifier);
    const alarmFactory = this.createAlarmFactory(
      namingStrategy.resolveAlarmFriendlyName()
    );
    this.usageAlarmFactory = new UsageAlarmFactory(alarmFactory);
    this.usageAnnotations = [];

    const metricFactory = new RedshiftClusterMetricFactory(
      scope.createMetricFactory(),
      props
    );
    this.connectionsMetric = metricFactory.metricTotalConnectionCount();
    this.diskSpaceUsageMetric =
      metricFactory.metricAverageDiskSpaceUsageInPercent();
    this.cpuUsageMetric = metricFactory.metricAverageCpuUsageInPercent();
    this.shortQueryDurationMetric =
      metricFactory.metricShortQueryDurationP90InMillis();
    this.mediumQueryDurationMetric =
      metricFactory.metricMediumQueryDurationP90InMillis();
    this.longQueryDurationMetric =
      metricFactory.metricLongQueryDurationP90InMillis();
    this.readLatencyMetric = metricFactory.metricReadLatencyP90InMillis();
    this.writeLatencyMetric = metricFactory.metricWriteLatencyP90InMillis();
    this.maintenanceModeMetric = metricFactory.metricMaintenanceModeEnabled();

    for (const disambiguator in props.addDiskSpaceUsageAlarm) {
      const alarmProps = props.addDiskSpaceUsageAlarm[disambiguator];
      const createdAlarm = this.usageAlarmFactory.addMaxDiskUsagePercentAlarm(
        this.diskSpaceUsageMetric,
        alarmProps,
        disambiguator
      );
      this.usageAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }

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
      this.createCpuAndDiskUsageWidget(ThirdWidth, DefaultSummaryWidgetHeight),
      this.createConnectionsWidget(ThirdWidth, DefaultSummaryWidgetHeight),
      this.createQueryDurationWidget(ThirdWidth, DefaultSummaryWidgetHeight),
    ];
  }

  widgets(): IWidget[] {
    return [
      this.createTitleWidget(),
      this.createCpuAndDiskUsageWidget(QuarterWidth, DefaultGraphWidgetHeight),
      this.createConnectionsWidget(QuarterWidth, DefaultGraphWidgetHeight),
      this.createQueryDurationWidget(QuarterWidth, DefaultGraphWidgetHeight),
      this.createLatencyWidget(HalfQuarterWidth, DefaultGraphWidgetHeight),
      this.createMaintenanceWidget(HalfQuarterWidth, DefaultGraphWidgetHeight),
    ];
  }

  protected createTitleWidget() {
    return new MonitoringHeaderWidget({
      family: "Redshift Cluster",
      title: this.title,
      goToLinkUrl: this.url,
    });
  }

  protected createCpuAndDiskUsageWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "CPU/Disk Usage",
      left: [this.cpuUsageMetric, this.diskSpaceUsageMetric],
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

  protected createQueryDurationWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Query Duration",
      left: [
        this.shortQueryDurationMetric,
        this.mediumQueryDurationMetric,
        this.longQueryDurationMetric,
      ],
      leftYAxis: TimeAxisMillisFromZero,
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

  protected createMaintenanceWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Maintenance",
      left: [this.maintenanceModeMetric],
      leftYAxis: BooleanAxisFromZeroToOne,
    });
  }
}
