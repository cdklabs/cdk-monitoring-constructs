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

const DefaultLatencyTypesToRender = [
  LatencyType.P50,
  LatencyType.P90,
  LatencyType.P99,
];

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

  readonly addSelectLatencyP50Alarm?: Record<string, LatencyThreshold>;
  readonly addSelectLatencyP70Alarm?: Record<string, LatencyThreshold>;
  readonly addSelectLatencyP90Alarm?: Record<string, LatencyThreshold>;
  readonly addSelectLatencyP95Alarm?: Record<string, LatencyThreshold>;
  readonly addSelectLatencyP99Alarm?: Record<string, LatencyThreshold>;
  readonly addSelectLatencyP999Alarm?: Record<string, LatencyThreshold>;
  readonly addSelectLatencyP9999Alarm?: Record<string, LatencyThreshold>;
  readonly addSelectLatencyP100Alarm?: Record<string, LatencyThreshold>;
  readonly addSelectLatencyAverageAlarm?: Record<string, LatencyThreshold>;

  readonly addInsertLatencyP50Alarm?: Record<string, LatencyThreshold>;
  readonly addInsertLatencyP70Alarm?: Record<string, LatencyThreshold>;
  readonly addInsertLatencyP90Alarm?: Record<string, LatencyThreshold>;
  readonly addInsertLatencyP95Alarm?: Record<string, LatencyThreshold>;
  readonly addInsertLatencyP99Alarm?: Record<string, LatencyThreshold>;
  readonly addInsertLatencyP999Alarm?: Record<string, LatencyThreshold>;
  readonly addInsertLatencyP9999Alarm?: Record<string, LatencyThreshold>;
  readonly addInsertLatencyP100Alarm?: Record<string, LatencyThreshold>;
  readonly addInsertLatencyAverageAlarm?: Record<string, LatencyThreshold>;

  readonly addUpdateLatencyP50Alarm?: Record<string, LatencyThreshold>;
  readonly addUpdateLatencyP70Alarm?: Record<string, LatencyThreshold>;
  readonly addUpdateLatencyP90Alarm?: Record<string, LatencyThreshold>;
  readonly addUpdateLatencyP95Alarm?: Record<string, LatencyThreshold>;
  readonly addUpdateLatencyP99Alarm?: Record<string, LatencyThreshold>;
  readonly addUpdateLatencyP999Alarm?: Record<string, LatencyThreshold>;
  readonly addUpdateLatencyP9999Alarm?: Record<string, LatencyThreshold>;
  readonly addUpdateLatencyP100Alarm?: Record<string, LatencyThreshold>;
  readonly addUpdateLatencyAverageAlarm?: Record<string, LatencyThreshold>;

  readonly addDeleteLatencyP50Alarm?: Record<string, LatencyThreshold>;
  readonly addDeleteLatencyP70Alarm?: Record<string, LatencyThreshold>;
  readonly addDeleteLatencyP90Alarm?: Record<string, LatencyThreshold>;
  readonly addDeleteLatencyP95Alarm?: Record<string, LatencyThreshold>;
  readonly addDeleteLatencyP99Alarm?: Record<string, LatencyThreshold>;
  readonly addDeleteLatencyP999Alarm?: Record<string, LatencyThreshold>;
  readonly addDeleteLatencyP9999Alarm?: Record<string, LatencyThreshold>;
  readonly addDeleteLatencyP100Alarm?: Record<string, LatencyThreshold>;
  readonly addDeleteLatencyAverageAlarm?: Record<string, LatencyThreshold>;

  readonly addCommitLatencyP50Alarm?: Record<string, LatencyThreshold>;
  readonly addCommitLatencyP70Alarm?: Record<string, LatencyThreshold>;
  readonly addCommitLatencyP90Alarm?: Record<string, LatencyThreshold>;
  readonly addCommitLatencyP95Alarm?: Record<string, LatencyThreshold>;
  readonly addCommitLatencyP99Alarm?: Record<string, LatencyThreshold>;
  readonly addCommitLatencyP999Alarm?: Record<string, LatencyThreshold>;
  readonly addCommitLatencyP9999Alarm?: Record<string, LatencyThreshold>;
  readonly addCommitLatencyP100Alarm?: Record<string, LatencyThreshold>;
  readonly addCommitLatencyAverageAlarm?: Record<string, LatencyThreshold>;

  /**
   * You can specify what latency types you want to be rendered in the dashboards.
   * Note: any latency type with an alarm will be also added automatically.
   * If the list is undefined, default values will be shown.
   * If the list is empty, only the latency types with an alarm will be shown (if any).
   * @default - p90 for all operation types
   */
  readonly latencyTypesToRender?: LatencyType[];
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
  readonly readLatencyAnnotations: HorizontalAnnotation[];
  readonly writeLatencyAnnotations: HorizontalAnnotation[];
  readonly iopsAnnotations: HorizontalAnnotation[];

  readonly connectionsMetric: MetricWithAlarmSupport;
  readonly diskSpaceUsageMetric: MetricWithAlarmSupport;
  readonly cpuUsageMetric: MetricWithAlarmSupport;
  readonly readIopsMetric: MetricWithAlarmSupport;
  readonly writeIopsMetric: MetricWithAlarmSupport;

  // keys are LatencyType, but JSII doesn't like non-string types
  readonly selectLatencyMetrics: Record<string, MetricWithAlarmSupport>;
  readonly insertLatencyMetrics: Record<string, MetricWithAlarmSupport>;
  readonly updateLatencyMetrics: Record<string, MetricWithAlarmSupport>;
  readonly deleteLatencyMetrics: Record<string, MetricWithAlarmSupport>;
  readonly commitLatencyMetrics: Record<string, MetricWithAlarmSupport>;
  readonly latencyTypesToRender: string[];

  constructor(scope: MonitoringScope, props: RdsClusterMonitoringProps) {
    super(scope, props);

    const metricFactory = new RdsClusterMetricFactory(
      scope.createMetricFactory(),
      props,
    );
    this.connectionsMetric = metricFactory.metricTotalConnectionCount();
    this.diskSpaceUsageMetric = metricFactory.metricDiskSpaceUsageInPercent();
    this.cpuUsageMetric = metricFactory.metricAverageCpuUsageInPercent();
    this.readIopsMetric = metricFactory.metricReadIOPS();
    this.writeIopsMetric = metricFactory.metricWriteIOPS();

    this.selectLatencyMetrics = {};
    this.insertLatencyMetrics = {};
    this.updateLatencyMetrics = {};
    this.deleteLatencyMetrics = {};
    this.commitLatencyMetrics = {};
    this.latencyTypesToRender = [
      ...(props.latencyTypesToRender ?? DefaultLatencyTypesToRender),
    ];

    Object.values(LatencyType).forEach((latencyType) => {
      this.selectLatencyMetrics[latencyType] =
        metricFactory.metricSelectLatencyInMillis(latencyType);
      this.insertLatencyMetrics[latencyType] =
        metricFactory.metricInsertLatencyInMillis(latencyType);
      this.updateLatencyMetrics[latencyType] =
        metricFactory.metricUpdateLatencyInMillis(latencyType);
      this.deleteLatencyMetrics[latencyType] =
        metricFactory.metricDeleteLatencyInMillis(latencyType);
      this.commitLatencyMetrics[latencyType] =
        metricFactory.metricCommitLatencyInMillis(latencyType);
    });

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
    this.readLatencyAnnotations = [];
    this.writeLatencyAnnotations = [];
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

    const selectLatencyAlarmDefinitions = {
      [LatencyType.P50]: props.addSelectLatencyP50Alarm,
      [LatencyType.P70]: props.addSelectLatencyP70Alarm,
      [LatencyType.P90]: props.addSelectLatencyP90Alarm,
      [LatencyType.P95]: props.addSelectLatencyP95Alarm,
      [LatencyType.P99]: props.addSelectLatencyP99Alarm,
      [LatencyType.P999]: props.addSelectLatencyP999Alarm,
      [LatencyType.P9999]: props.addSelectLatencyP9999Alarm,
      [LatencyType.P100]: props.addSelectLatencyP100Alarm,
      [LatencyType.AVERAGE]: props.addSelectLatencyAverageAlarm,
    };

    const insertLatencyAlarmDefinitions = {
      [LatencyType.P50]: props.addInsertLatencyP50Alarm,
      [LatencyType.P70]: props.addInsertLatencyP70Alarm,
      [LatencyType.P90]: props.addInsertLatencyP90Alarm,
      [LatencyType.P95]: props.addInsertLatencyP95Alarm,
      [LatencyType.P99]: props.addInsertLatencyP99Alarm,
      [LatencyType.P999]: props.addInsertLatencyP999Alarm,
      [LatencyType.P9999]: props.addInsertLatencyP9999Alarm,
      [LatencyType.P100]: props.addInsertLatencyP100Alarm,
      [LatencyType.AVERAGE]: props.addInsertLatencyAverageAlarm,
    };

    const updateLatencyAlarmDefinitions = {
      [LatencyType.P50]: props.addUpdateLatencyP50Alarm,
      [LatencyType.P70]: props.addUpdateLatencyP70Alarm,
      [LatencyType.P90]: props.addUpdateLatencyP90Alarm,
      [LatencyType.P95]: props.addUpdateLatencyP95Alarm,
      [LatencyType.P99]: props.addUpdateLatencyP99Alarm,
      [LatencyType.P999]: props.addUpdateLatencyP999Alarm,
      [LatencyType.P9999]: props.addUpdateLatencyP9999Alarm,
      [LatencyType.P100]: props.addUpdateLatencyP100Alarm,
      [LatencyType.AVERAGE]: props.addUpdateLatencyAverageAlarm,
    };

    const deleteLatencyAlarmDefinitions = {
      [LatencyType.P50]: props.addDeleteLatencyP50Alarm,
      [LatencyType.P70]: props.addDeleteLatencyP70Alarm,
      [LatencyType.P90]: props.addDeleteLatencyP90Alarm,
      [LatencyType.P95]: props.addDeleteLatencyP95Alarm,
      [LatencyType.P99]: props.addDeleteLatencyP99Alarm,
      [LatencyType.P999]: props.addDeleteLatencyP999Alarm,
      [LatencyType.P9999]: props.addDeleteLatencyP9999Alarm,
      [LatencyType.P100]: props.addDeleteLatencyP100Alarm,
      [LatencyType.AVERAGE]: props.addDeleteLatencyAverageAlarm,
    };

    const commitLatencyAlarmDefinitions = {
      [LatencyType.P50]: props.addCommitLatencyP50Alarm,
      [LatencyType.P70]: props.addCommitLatencyP70Alarm,
      [LatencyType.P90]: props.addCommitLatencyP90Alarm,
      [LatencyType.P95]: props.addCommitLatencyP95Alarm,
      [LatencyType.P99]: props.addCommitLatencyP99Alarm,
      [LatencyType.P999]: props.addCommitLatencyP999Alarm,
      [LatencyType.P9999]: props.addCommitLatencyP9999Alarm,
      [LatencyType.P100]: props.addCommitLatencyP100Alarm,
      [LatencyType.AVERAGE]: props.addCommitLatencyAverageAlarm,
    };

    for (const [latencyType, alarmDefinition] of Object.entries(
      selectLatencyAlarmDefinitions,
    )) {
      for (const disambiguator in alarmDefinition) {
        const alarmProps = alarmDefinition[disambiguator];
        const latencyTypeEnum = latencyType as LatencyType;
        const metric = this.selectLatencyMetrics[latencyTypeEnum];
        const createdAlarm = this.latencyAlarmFactory.addLatencyAlarm(
          metric,
          latencyTypeEnum,
          alarmProps,
          disambiguator,
          "Select",
        );
        this.readLatencyAnnotations.push(createdAlarm.annotation);
        this.latencyTypesToRender.push(latencyTypeEnum);
        this.addAlarm(createdAlarm);
      }
    }

    for (const [latencyType, alarmDefinition] of Object.entries(
      insertLatencyAlarmDefinitions,
    )) {
      for (const disambiguator in alarmDefinition) {
        const alarmProps = alarmDefinition[disambiguator];
        const latencyTypeEnum = latencyType as LatencyType;
        const metric = this.insertLatencyMetrics[latencyTypeEnum];
        const createdAlarm = this.latencyAlarmFactory.addLatencyAlarm(
          metric,
          latencyTypeEnum,
          alarmProps,
          disambiguator,
          "Insert",
        );
        this.writeLatencyAnnotations.push(createdAlarm.annotation);
        this.latencyTypesToRender.push(latencyTypeEnum);
        this.addAlarm(createdAlarm);
      }
    }

    for (const [latencyType, alarmDefinition] of Object.entries(
      updateLatencyAlarmDefinitions,
    )) {
      for (const disambiguator in alarmDefinition) {
        const alarmProps = alarmDefinition[disambiguator];
        const latencyTypeEnum = latencyType as LatencyType;
        const metric = this.updateLatencyMetrics[latencyTypeEnum];
        const createdAlarm = this.latencyAlarmFactory.addLatencyAlarm(
          metric,
          latencyTypeEnum,
          alarmProps,
          disambiguator,
          "Update",
        );
        this.writeLatencyAnnotations.push(createdAlarm.annotation);
        this.latencyTypesToRender.push(latencyTypeEnum);
        this.addAlarm(createdAlarm);
      }
    }

    for (const [latencyType, alarmDefinition] of Object.entries(
      deleteLatencyAlarmDefinitions,
    )) {
      for (const disambiguator in alarmDefinition) {
        const alarmProps = alarmDefinition[disambiguator];
        const latencyTypeEnum = latencyType as LatencyType;
        const metric = this.deleteLatencyMetrics[latencyTypeEnum];
        const createdAlarm = this.latencyAlarmFactory.addLatencyAlarm(
          metric,
          latencyTypeEnum,
          alarmProps,
          disambiguator,
          "Delete",
        );
        this.writeLatencyAnnotations.push(createdAlarm.annotation);
        this.latencyTypesToRender.push(latencyTypeEnum);
        this.addAlarm(createdAlarm);
      }
    }

    for (const [latencyType, alarmDefinition] of Object.entries(
      commitLatencyAlarmDefinitions,
    )) {
      for (const disambiguator in alarmDefinition) {
        const alarmProps = alarmDefinition[disambiguator];
        const latencyTypeEnum = latencyType as LatencyType;
        const metric = this.commitLatencyMetrics[latencyTypeEnum];
        const createdAlarm = this.latencyAlarmFactory.addLatencyAlarm(
          metric,
          latencyTypeEnum,
          alarmProps,
          disambiguator,
          "Commit",
        );
        this.writeLatencyAnnotations.push(createdAlarm.annotation);
        this.latencyTypesToRender.push(latencyTypeEnum);
        this.addAlarm(createdAlarm);
      }
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
    const left = Array.from(new Set(this.latencyTypesToRender))
      .sort()
      .reduce((metrics, type) => {
        metrics.push(
          this.selectLatencyMetrics[type],
          this.insertLatencyMetrics[type],
          this.updateLatencyMetrics[type],
          this.deleteLatencyMetrics[type],
          this.commitLatencyMetrics[type],
        );
        return metrics;
      }, [] as MetricWithAlarmSupport[]);

    return new GraphWidget({
      width,
      height,
      title: "Query Duration",
      left,
      leftYAxis: TimeAxisMillisFromZero,
      leftAnnotations: [
        ...this.readLatencyAnnotations,
        ...this.writeLatencyAnnotations,
      ],
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
