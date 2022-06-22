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
  HalfWidth,
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
  RdsClusterMetricFactory,
  RdsClusterMetricFactoryProps,
} from "./RdsClusterMetricFactory";

export interface RdsClusterMonitoringOptions extends BaseMonitoringProps {
  readonly addDiskSpaceUsageAlarm?: Record<string, UsageThreshold>;
  readonly addCpuUsageAlarm?: Record<string, UsageThreshold>;
}

export interface RdsClusterMonitoringProps
  extends RdsClusterMetricFactoryProps,
    RdsClusterMonitoringOptions {}

export class RdsClusterMonitoring extends Monitoring {
  protected readonly title: string;
  protected readonly url?: string;

  protected readonly usageAlarmFactory: UsageAlarmFactory;
  protected readonly usageAnnotations: HorizontalAnnotation[];

  protected readonly connectionsMetric: MetricWithAlarmSupport;
  protected readonly diskSpaceUsageMetric: MetricWithAlarmSupport;
  protected readonly cpuUsageMetric: MetricWithAlarmSupport;
  protected readonly selectLatencyMetric: MetricWithAlarmSupport;
  protected readonly insertLatencyMetric: MetricWithAlarmSupport;
  protected readonly updateLatencyMetric: MetricWithAlarmSupport;
  protected readonly deleteLatencyMetric: MetricWithAlarmSupport;
  protected readonly commitLatencyMetric: MetricWithAlarmSupport;

  constructor(scope: MonitoringScope, props: RdsClusterMonitoringProps) {
    super(scope, props);

    const metricFactory = new RdsClusterMetricFactory(
      scope.createMetricFactory(),
      props
    );
    this.connectionsMetric = metricFactory.metricTotalConnectionCount();
    this.diskSpaceUsageMetric = metricFactory.metricDiskSpaceUsageInPercent();
    this.cpuUsageMetric = metricFactory.metricAverageCpuUsageInPercent();
    this.selectLatencyMetric = metricFactory.metricSelectLatencyP90InMillis();
    this.insertLatencyMetric = metricFactory.metricInsertLatencyP90InMillis();
    this.updateLatencyMetric = metricFactory.metricUpdateLatencyP90InMillis();
    this.deleteLatencyMetric = metricFactory.metricDeleteLatencyP90InMillis();
    this.commitLatencyMetric = metricFactory.metricCommitLatencyP90InMillis();

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
      namingStrategy.resolveAlarmFriendlyName()
    );
    this.usageAlarmFactory = new UsageAlarmFactory(alarmFactory);
    this.usageAnnotations = [];

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
      this.createLatencyWidget(ThirdWidth, DefaultSummaryWidgetHeight),
    ];
  }

  widgets(): IWidget[] {
    return [
      this.createTitleWidget(),
      this.createCpuAndDiskUsageWidget(QuarterWidth, DefaultGraphWidgetHeight),
      this.createConnectionsWidget(QuarterWidth, DefaultGraphWidgetHeight),
      this.createLatencyWidget(HalfWidth, DefaultGraphWidgetHeight),
    ];
  }

  protected createTitleWidget() {
    return new MonitoringHeaderWidget({
      family: "RDS Cluster",
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

  protected createLatencyWidget(width: number, height: number) {
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
    });
  }
}
