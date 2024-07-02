import {
  GraphWidget,
  HorizontalAnnotation,
  IWidget,
} from "aws-cdk-lib/aws-cloudwatch";

import {
  RdsInstanceMetricFactory,
  RdsInstanceMetricFactoryProps,
} from "./RdsInstanceMetricFactory";
import {
  BaseMonitoringProps,
  ConnectionAlarmFactory,
  CountAxisFromZero,
  DefaultGraphWidgetHeight,
  DefaultSummaryWidgetHeight,
  HalfWidth,
  HighConnectionCountThreshold,
  LatencyType,
  LowConnectionCountThreshold,
  MetricWithAlarmSupport,
  MinUsageCountThreshold,
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

export interface RdsInstanceMonitoringOptions extends BaseMonitoringProps {
  readonly addFreeStorageSpaceAlarm?: Record<string, MinUsageCountThreshold>;
  readonly addCpuUsageAlarm?: Record<string, UsageThreshold>;
  readonly addMinConnectionCountAlarm?: Record<
    string,
    LowConnectionCountThreshold
  >;
  readonly addMaxConnectionCountAlarm?: Record<
    string,
    HighConnectionCountThreshold
  >;
}

export interface RdsInstanceMonitoringProps
  extends RdsInstanceMetricFactoryProps,
    RdsInstanceMonitoringOptions {}

export class RdsInstanceMonitoring extends Monitoring {
  readonly title: string;
  readonly url?: string;

  readonly usageAlarmFactory: UsageAlarmFactory;
  readonly connectionAlarmFactory: ConnectionAlarmFactory;
  readonly usageAnnotations: HorizontalAnnotation[];
  readonly connectionAnnotations: HorizontalAnnotation[];

  readonly connectionsMetric: MetricWithAlarmSupport;
  readonly freeStorageSpaceMetric: MetricWithAlarmSupport;
  readonly freeableMemoryMetric: MetricWithAlarmSupport;
  readonly cpuUsageMetric: MetricWithAlarmSupport;
  readonly readLatencyMetric: MetricWithAlarmSupport;
  readonly readThroughputMetric: MetricWithAlarmSupport;
  readonly readIopsMetric: MetricWithAlarmSupport;
  readonly writeLatencyMetric: MetricWithAlarmSupport;
  readonly writeThroughputMetric: MetricWithAlarmSupport;
  readonly writeIopsMetric: MetricWithAlarmSupport;

  constructor(scope: MonitoringScope, props: RdsInstanceMonitoringProps) {
    super(scope, props);

    const metricFactory = new RdsInstanceMetricFactory(
      scope.createMetricFactory(),
      props,
    );
    this.connectionsMetric = metricFactory.metricTotalConnectionCount();
    this.freeStorageSpaceMetric = metricFactory.metricMaxFreeStorageSpace();
    this.freeableMemoryMetric = metricFactory.metricAverageFreeableMemory();
    this.cpuUsageMetric = metricFactory.metricAverageCpuUsageInPercent();
    this.readLatencyMetric = metricFactory.metricReadLatencyInMillis(
      LatencyType.P90,
    );
    this.readThroughputMetric = metricFactory.metricReadThroughput();
    this.readIopsMetric = metricFactory.metricReadIops();
    this.writeLatencyMetric = metricFactory.metricWriteLatencyInMillis(
      LatencyType.P90,
    );
    this.writeThroughputMetric = metricFactory.metricWriteThroughput();
    this.writeIopsMetric = metricFactory.metricWriteIops();

    const namingStrategy = new MonitoringNamingStrategy({
      ...props,
      fallbackConstructName: metricFactory.instanceIdentifier,
      namedConstruct: props.instance,
    });
    this.title = namingStrategy.resolveHumanReadableName();
    this.url = scope
      .createAwsConsoleUrlFactory()
      .getRdsInstanceUrl(metricFactory.instanceIdentifier);
    const alarmFactory = this.createAlarmFactory(
      namingStrategy.resolveAlarmFriendlyName(),
    );
    this.usageAlarmFactory = new UsageAlarmFactory(alarmFactory);
    this.connectionAlarmFactory = new ConnectionAlarmFactory(alarmFactory);

    this.usageAnnotations = [];
    this.connectionAnnotations = [];

    for (const disambiguator in props.addFreeStorageSpaceAlarm) {
      const alarmProps = props.addFreeStorageSpaceAlarm[disambiguator];
      const createdAlarm = this.usageAlarmFactory.addMinCountAlarm(
        this.freeStorageSpaceMetric,
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

  createTitleWidget() {
    return new MonitoringHeaderWidget({
      family: "RDS Instance",
      title: this.title,
      goToLinkUrl: this.url,
    });
  }

  createCpuAndDiskUsageWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "CPU/Disk Usage",
      left: [
        this.cpuUsageMetric,
        this.freeStorageSpaceMetric,
        this.freeableMemoryMetric,
      ],
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
        this.readLatencyMetric,
        this.readThroughputMetric,
        this.readIopsMetric,
        this.writeLatencyMetric,
        this.writeLatencyMetric,
        this.writeIopsMetric,
      ],
      leftYAxis: TimeAxisMillisFromZero,
    });
  }
}
