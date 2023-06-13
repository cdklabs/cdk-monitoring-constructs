import {
  GraphWidget,
  HorizontalAnnotation,
  IWidget,
} from "aws-cdk-lib/aws-cloudwatch";

import {
  RedshiftClusterMetricFactory,
  RedshiftClusterMetricFactoryProps,
} from "./RedshiftClusterMetricFactory";
import {
  BaseMonitoringProps,
  BooleanAxisFromZeroToOne,
  CountAxisFromZero,
  ConnectionAlarmFactory,
  DefaultGraphWidgetHeight,
  DefaultSummaryWidgetHeight,
  DurationThreshold,
  HalfQuarterWidth,
  HighConnectionCountThreshold,
  LatencyAlarmFactory,
  LatencyType,
  LowConnectionCountThreshold,
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

export interface RedshiftClusterMonitoringOptions extends BaseMonitoringProps {
  readonly addDiskSpaceUsageAlarm?: Record<string, UsageThreshold>;
  readonly addCpuUsageAlarm?: Record<string, UsageThreshold>;
  readonly addMaxLongQueryDurationAlarm?: Record<string, DurationThreshold>;
  readonly addMinConnectionCountAlarm?: Record<
    string,
    LowConnectionCountThreshold
  >;
  readonly addMaxConnectionCountAlarm?: Record<
    string,
    HighConnectionCountThreshold
  >;
}

export interface RedshiftClusterMonitoringProps
  extends RedshiftClusterMetricFactoryProps,
    RedshiftClusterMonitoringOptions {}

export class RedshiftClusterMonitoring extends Monitoring {
  readonly title: string;
  readonly url?: string;

  readonly usageAlarmFactory: UsageAlarmFactory;
  readonly latencyAlarmFactory: LatencyAlarmFactory;
  readonly connectionAlarmFactory: ConnectionAlarmFactory;
  readonly queryDurationAnnotations: HorizontalAnnotation[];
  readonly connectionAnnotations: HorizontalAnnotation[];
  readonly usageAnnotations: HorizontalAnnotation[];

  readonly connectionsMetric: MetricWithAlarmSupport;
  readonly diskSpaceUsageMetric: MetricWithAlarmSupport;
  readonly cpuUsageMetric: MetricWithAlarmSupport;
  readonly shortQueryDurationMetric: MetricWithAlarmSupport;
  readonly mediumQueryDurationMetric: MetricWithAlarmSupport;
  readonly longQueryDurationMetric: MetricWithAlarmSupport;
  readonly readLatencyMetric: MetricWithAlarmSupport;
  readonly writeLatencyMetric: MetricWithAlarmSupport;

  readonly maintenanceModeMetric: MetricWithAlarmSupport;

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
    this.latencyAlarmFactory = new LatencyAlarmFactory(alarmFactory);
    this.connectionAlarmFactory = new ConnectionAlarmFactory(alarmFactory);
    this.queryDurationAnnotations = [];
    this.connectionAnnotations = [];
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

    for (const disambiguator in props.addMaxLongQueryDurationAlarm) {
      const alarmProps = props.addMaxLongQueryDurationAlarm[disambiguator];
      const createdAlarm = this.latencyAlarmFactory.addDurationAlarm(
        this.longQueryDurationMetric,
        LatencyType.P90,
        alarmProps,
        disambiguator
      );
      this.queryDurationAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }

    for (const disambiguator in props.addMinConnectionCountAlarm) {
      const alarmProps = props.addMinConnectionCountAlarm[disambiguator];
      const createdAlarm =
        this.connectionAlarmFactory.addMinConnectionCountAlarm(
          this.connectionsMetric,
          alarmProps,
          disambiguator
        );
      this.connectionAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }

    for (const disambiguator in props.addMaxConnectionCountAlarm) {
      const alarmProps = props.addMaxConnectionCountAlarm[disambiguator];
      const createdAlarm =
        this.connectionAlarmFactory.addMaxConnectionCountAlarm(
          this.connectionsMetric,
          alarmProps,
          disambiguator
        );
      this.connectionAnnotations.push(createdAlarm.annotation);
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

  createTitleWidget() {
    return new MonitoringHeaderWidget({
      family: "Redshift Cluster",
      title: this.title,
      goToLinkUrl: this.url,
    });
  }

  createCpuAndDiskUsageWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "CPU/Disk Usage",
      left: [this.cpuUsageMetric, this.diskSpaceUsageMetric],
      leftYAxis: PercentageAxisFromZeroToHundred,
      leftAnnotations: this.usageAnnotations,
    });
  }

  createConnectionsWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Connections",
      left: [this.connectionsMetric],
      leftYAxis: CountAxisFromZero,
      leftAnnotations: this.connectionAnnotations,
    });
  }

  createQueryDurationWidget(width: number, height: number) {
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
      leftAnnotations: this.queryDurationAnnotations,
    });
  }

  createLatencyWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Latency",
      left: [this.readLatencyMetric, this.writeLatencyMetric],
      leftYAxis: TimeAxisMillisFromZero,
    });
  }

  createMaintenanceWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Maintenance",
      left: [this.maintenanceModeMetric],
      leftYAxis: BooleanAxisFromZeroToOne,
    });
  }
}
