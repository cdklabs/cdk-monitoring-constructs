import {
  GraphWidget,
  HorizontalAnnotation,
  IWidget,
} from "aws-cdk-lib/aws-cloudwatch";

import {
  RdsClusterMetricFactory,
  RdsClusterMetricFactoryProps,
} from "./RdsClusterMetricFactory";
import {
  BaseMonitoringProps,
  ConnectionAlarmFactory,
  CountAxisFromZero,
  DefaultGraphWidgetHeight,
  DefaultSummaryWidgetHeight,
  HighConnectionCountThreshold,
  LatencyAlarmFactory,
  LatencyThreshold,
  LatencyType,
  LowConnectionCountThreshold,
  MaxUsageCountThreshold,
  MetricWithAlarmSupport,
  Monitoring,
  MonitoringScope,
  PercentageAxisFromZeroToHundred,
  QuarterWidth,
  TimeAxisMillisFromZero,
  UsageAlarmFactory,
  UsageThreshold,
} from "../../common";
import {
  MonitoringHeaderWidget,
  MonitoringNamingStrategy,
} from "../../dashboard";

export interface RdsClusterMonitoringOptions extends BaseMonitoringProps {
  readonly addDiskSpaceUsageAlarm?: Record<string, UsageThreshold>;
  readonly addCpuUsageAlarm?: Record<string, UsageThreshold>;
  readonly addMinConnectionCountAlarm?: Record<
    string,
    LowConnectionCountThreshold
  >;
  readonly addMaxConnectionCountAlarm?: Record<
    string,
    HighConnectionCountThreshold
  >;
  readonly addReadIOPSAlarm?: Record<string, MaxUsageCountThreshold>;
  readonly addWriteIOPSAlarm?: Record<string, MaxUsageCountThreshold>;
  readonly addSelectLatencyAlarm?: Record<string, LatencyThreshold>;
  readonly addInsertLatencyAlarm?: Record<string, LatencyThreshold>;
  readonly addUpdateLatencyAlarm?: Record<string, LatencyThreshold>;
  readonly addDeleteLatencyAlarm?: Record<string, LatencyThreshold>;
  readonly addCommitLatencyAlarm?: Record<string, LatencyThreshold>;
}

export interface RdsClusterMonitoringProps
  extends RdsClusterMetricFactoryProps,
    RdsClusterMonitoringOptions {}

export class RdsClusterMonitoring extends Monitoring {
  readonly title: string;
  readonly url?: string;

  readonly usageAlarmFactory: UsageAlarmFactory;
  readonly connectionAlarmFactory: ConnectionAlarmFactory;
  readonly latencyAlarmFactory: LatencyAlarmFactory;
  readonly usageAnnotations: HorizontalAnnotation[];
  readonly connectionAnnotations: HorizontalAnnotation[];
  readonly latencyAnnotations: HorizontalAnnotation[];
  readonly iopsAnnotations: HorizontalAnnotation[];

  readonly connectionsMetric: MetricWithAlarmSupport;
  readonly diskSpaceUsageMetric: MetricWithAlarmSupport;
  readonly cpuUsageMetric: MetricWithAlarmSupport;
  readonly selectLatencyMetric: MetricWithAlarmSupport;
  readonly insertLatencyMetric: MetricWithAlarmSupport;
  readonly updateLatencyMetric: MetricWithAlarmSupport;
  readonly deleteLatencyMetric: MetricWithAlarmSupport;
  readonly commitLatencyMetric: MetricWithAlarmSupport;
  readonly readIopsMetric: MetricWithAlarmSupport;
  readonly writeIopsMetric: MetricWithAlarmSupport;

  constructor(scope: MonitoringScope, props: RdsClusterMonitoringProps) {
    super(scope, props);

    const metricFactory = new RdsClusterMetricFactory(
      scope.createMetricFactory(),
      props,
    );
    this.connectionsMetric = metricFactory.metricTotalConnectionCount();
    this.diskSpaceUsageMetric = metricFactory.metricDiskSpaceUsageInPercent();
    this.cpuUsageMetric = metricFactory.metricAverageCpuUsageInPercent();
    this.selectLatencyMetric = metricFactory.metricSelectLatencyP90InMillis();
    this.insertLatencyMetric = metricFactory.metricInsertLatencyP90InMillis();
    this.updateLatencyMetric = metricFactory.metricUpdateLatencyP90InMillis();
    this.deleteLatencyMetric = metricFactory.metricDeleteLatencyP90InMillis();
    this.commitLatencyMetric = metricFactory.metricCommitLatencyP90InMillis();
    this.readIopsMetric = metricFactory.metricReadIOPS();
    this.writeIopsMetric = metricFactory.metricWriteIOPS();

    const namingStrategy = new MonitoringNamingStrategy({
      ...props,
      fallbackConstructName: metricFactory.clusterIdentifier,
      namedConstruct: props.cluster,
    });
    this.title = namingStrategy.resolveHumanReadableName();
    this.url = scope
      .createAwsConsoleUrlFactory()
      .getRdsClusterUrl(metricFactory.clusterIdentifier);
    const alarmFactory = this.createAlarmFactory(
      namingStrategy.resolveAlarmFriendlyName(),
    );
    this.usageAlarmFactory = new UsageAlarmFactory(alarmFactory);
    this.connectionAlarmFactory = new ConnectionAlarmFactory(alarmFactory);
    this.latencyAlarmFactory = new LatencyAlarmFactory(alarmFactory);

    this.usageAnnotations = [];
    this.connectionAnnotations = [];
    this.latencyAnnotations = [];
    this.iopsAnnotations = [];

    for (const disambiguator in props.addDiskSpaceUsageAlarm) {
      const alarmProps = props.addDiskSpaceUsageAlarm[disambiguator];
      const createdAlarm = this.usageAlarmFactory.addMaxDiskUsagePercentAlarm(
        this.diskSpaceUsageMetric,
        alarmProps,
        disambiguator,
      );
      this.usageAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }

    for (const disambiguator in props.addCpuUsageAlarm) {
      const alarmProps = props.addCpuUsageAlarm[disambiguator];
      const createdAlarm = this.usageAlarmFactory.addMaxCpuUsagePercentAlarm(
        this.cpuUsageMetric,
        alarmProps,
        disambiguator,
      );
      this.usageAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }

    for (const disambiguator in props.addMinConnectionCountAlarm) {
      const alarmProps = props.addMinConnectionCountAlarm[disambiguator];
      const createdAlarm =
        this.connectionAlarmFactory.addMinConnectionCountAlarm(
          this.connectionsMetric,
          alarmProps,
          disambiguator,
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
          disambiguator,
        );
      this.connectionAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }

    for (const disambiguator in props.addSelectLatencyAlarm) {
      const alarmProps = props.addSelectLatencyAlarm[disambiguator];
      const createdAlarm = this.latencyAlarmFactory.addLatencyAlarm(
        this.selectLatencyMetric,
        LatencyType.P90,
        alarmProps,
        disambiguator,
        "Select",
      );
      this.latencyAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }

    for (const disambiguator in props.addInsertLatencyAlarm) {
      const alarmProps = props.addInsertLatencyAlarm[disambiguator];
      const createdAlarm = this.latencyAlarmFactory.addLatencyAlarm(
        this.insertLatencyMetric,
        LatencyType.P90,
        alarmProps,
        disambiguator,
        "Insert",
      );
      this.latencyAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }

    for (const disambiguator in props.addUpdateLatencyAlarm) {
      const alarmProps = props.addUpdateLatencyAlarm[disambiguator];
      const createdAlarm = this.latencyAlarmFactory.addLatencyAlarm(
        this.updateLatencyMetric,
        LatencyType.P90,
        alarmProps,
        disambiguator,
        "Update",
      );
      this.latencyAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }

    for (const disambiguator in props.addDeleteLatencyAlarm) {
      const alarmProps = props.addDeleteLatencyAlarm[disambiguator];
      const createdAlarm = this.latencyAlarmFactory.addLatencyAlarm(
        this.deleteLatencyMetric,
        LatencyType.P90,
        alarmProps,
        disambiguator,
        "Delete",
      );
      this.latencyAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }

    for (const disambiguator in props.addCommitLatencyAlarm) {
      const alarmProps = props.addCommitLatencyAlarm[disambiguator];
      const createdAlarm = this.latencyAlarmFactory.addLatencyAlarm(
        this.commitLatencyMetric,
        LatencyType.P90,
        alarmProps,
        disambiguator,
        "Commit",
      );
      this.latencyAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }

    for (const disambiguator in props.addReadIOPSAlarm) {
      const alarmProps = props.addReadIOPSAlarm[disambiguator];
      const createdAlarm = this.usageAlarmFactory.addMaxReadIOPSAlarm(
        this.readIopsMetric,
        alarmProps,
        disambiguator,
      );
      this.usageAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }

    for (const disambiguator in props.addWriteIOPSAlarm) {
      const alarmProps = props.addWriteIOPSAlarm[disambiguator];
      const createdAlarm = this.usageAlarmFactory.addMaxWriteIOPSAlarm(
        this.writeIopsMetric,
        alarmProps,
        disambiguator,
      );
      this.usageAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }

    props.useCreatedAlarms?.consume(this.createdAlarms());
  }

  summaryWidgets(): IWidget[] {
    return [
      this.createTitleWidget(),
      this.createCpuAndDiskUsageWidget(
        QuarterWidth,
        DefaultSummaryWidgetHeight,
      ),
      this.createConnectionsWidget(QuarterWidth, DefaultSummaryWidgetHeight),
      this.createLatencyWidget(QuarterWidth, DefaultSummaryWidgetHeight),
      this.createIOPSWidget(QuarterWidth, DefaultSummaryWidgetHeight),
    ];
  }

  widgets(): IWidget[] {
    return [
      this.createTitleWidget(),
      this.createCpuAndDiskUsageWidget(QuarterWidth, DefaultGraphWidgetHeight),
      this.createConnectionsWidget(QuarterWidth, DefaultGraphWidgetHeight),
      this.createLatencyWidget(QuarterWidth, DefaultGraphWidgetHeight),
      this.createIOPSWidget(QuarterWidth, DefaultGraphWidgetHeight),
    ];
  }

  createTitleWidget() {
    return new MonitoringHeaderWidget({
      family: "RDS Cluster",
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

  createLatencyWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Query Duration",
      left: [
        this.selectLatencyMetric,
        this.insertLatencyMetric,
        this.updateLatencyMetric,
        this.deleteLatencyMetric,
        this.commitLatencyMetric,
      ],
      leftYAxis: TimeAxisMillisFromZero,
      leftAnnotations: this.latencyAnnotations,
    });
  }

  createIOPSWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "IOPS",
      left: [this.readIopsMetric, this.writeIopsMetric],
      leftYAxis: CountAxisFromZero,
      leftAnnotations: this.iopsAnnotations,
    });
  }
}
