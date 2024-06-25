import {
  GraphWidget,
  HorizontalAnnotation,
  IWidget,
  Row,
} from "aws-cdk-lib/aws-cloudwatch";

import {
  OpenSearchClusterMetricFactory,
  OpenSearchClusterMetricFactoryProps,
} from "./OpenSearchClusterMetricFactory";
import {
  BaseMonitoringProps,
  CountAxisFromZero,
  DefaultGraphWidgetHeight,
  DefaultSummaryWidgetHeight,
  LatencyAlarmFactory,
  LatencyThreshold,
  LatencyType,
  MetricWithAlarmSupport,
  Monitoring,
  MonitoringScope,
  OpenSearchClusterAlarmFactory,
  OpenSearchClusterAutomatedSnapshotFailureThreshold,
  OpenSearchClusterIndexWritesBlockedThreshold,
  OpenSearchClusterNodesThreshold,
  OpenSearchClusterStatus,
  OpenSearchClusterStatusCustomization,
  OpenSearchKmsKeyErrorThreshold,
  OpenSearchKmsKeyInaccessibleThreshold,
  PercentageAxisFromZeroToHundred,
  QuarterWidth,
  RateAxisFromZero,
  ThirdWidth,
  TimeAxisMillisFromZero,
  UsageAlarmFactory,
  UsageThreshold,
} from "../../common";
import {
  MonitoringHeaderWidget,
  MonitoringNamingStrategy,
} from "../../dashboard";

export interface OpenSearchClusterMonitoringOptions
  extends BaseMonitoringProps {
  readonly addIndexingLatencyP50Alarm?: Record<string, LatencyThreshold>;
  readonly addIndexingLatencyP90Alarm?: Record<string, LatencyThreshold>;
  readonly addIndexingLatencyP99Alarm?: Record<string, LatencyThreshold>;
  readonly addSearchLatencyP50Alarm?: Record<string, LatencyThreshold>;
  readonly addSearchLatencyP90Alarm?: Record<string, LatencyThreshold>;
  readonly addSearchLatencyP99Alarm?: Record<string, LatencyThreshold>;

  readonly addClusterStatusAlarm?: Record<
    string,
    OpenSearchClusterStatusCustomization
  >;
  readonly addDiskSpaceUsageAlarm?: Record<string, UsageThreshold>;
  readonly addCpuSpaceUsageAlarm?: Record<string, UsageThreshold>;
  readonly addMasterCpuSpaceUsageAlarm?: Record<string, UsageThreshold>;
  readonly addJvmMemoryPressureAlarm?: Record<string, UsageThreshold>;
  readonly addMasterJvmMemoryPressureAlarm?: Record<string, UsageThreshold>;

  readonly addClusterIndexWritesBlockedAlarm?: Record<
    string,
    OpenSearchClusterIndexWritesBlockedThreshold
  >;
  readonly addClusterNodeCountAlarm?: Record<
    string,
    OpenSearchClusterNodesThreshold
  >;
  readonly addClusterAutomatedSnapshotFailureAlarm?: Record<
    string,
    OpenSearchClusterAutomatedSnapshotFailureThreshold
  >;

  readonly addKmsKeyErrorAlarm?: Record<string, OpenSearchKmsKeyErrorThreshold>;
  readonly addKmsKeyInaccessibleAlarm?: Record<
    string,
    OpenSearchKmsKeyInaccessibleThreshold
  >;
}

export interface OpenSearchClusterMonitoringProps
  extends OpenSearchClusterMetricFactoryProps,
    OpenSearchClusterMonitoringOptions {}

export class OpenSearchClusterMonitoring extends Monitoring {
  readonly title: string;
  readonly url?: string;

  readonly indexingLatencyAlarmFactory: LatencyAlarmFactory;
  readonly indexingLatencyAnnotations: HorizontalAnnotation[];
  readonly searchLatencyAlarmFactory: LatencyAlarmFactory;
  readonly searchLatencyAnnotations: HorizontalAnnotation[];
  readonly clusterAlarmFactory: OpenSearchClusterAlarmFactory;
  readonly clusterAnnotations: HorizontalAnnotation[];
  readonly nodeAnnotations: HorizontalAnnotation[];
  readonly usageAlarmFactory: UsageAlarmFactory;
  readonly usageAnnotations: HorizontalAnnotation[];
  readonly masterUsageAnnotations: HorizontalAnnotation[];

  readonly tpsMetric: MetricWithAlarmSupport;
  readonly p50IndexingLatencyMetric: MetricWithAlarmSupport;
  readonly p90IndexingLatencyMetric: MetricWithAlarmSupport;
  readonly p99IndexingLatencyMetric: MetricWithAlarmSupport;
  readonly p50SearchLatencyMetric: MetricWithAlarmSupport;
  readonly p90SearchLatencyMetric: MetricWithAlarmSupport;
  readonly p99SearchLatencyMetric: MetricWithAlarmSupport;

  readonly clusterStatusRedMetric: MetricWithAlarmSupport;
  readonly clusterStatusYellowMetric: MetricWithAlarmSupport;

  readonly diskSpaceUsageMetric: MetricWithAlarmSupport;
  readonly cpuUsageMetric: MetricWithAlarmSupport;
  readonly masterCpuUsageMetric: MetricWithAlarmSupport;
  readonly jvmMemoryPressureMetric: MetricWithAlarmSupport;
  readonly masterJvmMemoryPressureMetric: MetricWithAlarmSupport;

  readonly indexWriteBlockedMetric: MetricWithAlarmSupport;
  readonly nodesMetric: MetricWithAlarmSupport;
  readonly automatedSnapshotFailureMetric: MetricWithAlarmSupport;
  readonly kmsKeyErrorMetric: MetricWithAlarmSupport;
  readonly kmsKeyInaccessibleMetric: MetricWithAlarmSupport;

  constructor(scope: MonitoringScope, props: OpenSearchClusterMonitoringProps) {
    super(scope, props);

    const namingStrategy = new MonitoringNamingStrategy({
      ...props,
      namedConstruct: props.domain,
    });
    this.title = namingStrategy.resolveHumanReadableName();
    this.url = props.domain.domainName
      ? scope
          .createAwsConsoleUrlFactory()
          .getOpenSearchClusterUrl(props.domain.domainName)
      : undefined;

    const alarmPrefix = namingStrategy.resolveAlarmFriendlyName();
    const indexingAlarmPrefix = `${alarmPrefix}-Indexing`;
    const searchAlarmPrefix = `${alarmPrefix}-Search`;
    const clusterAlarmPrefix = `${alarmPrefix}-Cluster`;

    this.indexingLatencyAlarmFactory = new LatencyAlarmFactory(
      this.createAlarmFactory(indexingAlarmPrefix),
    );
    this.indexingLatencyAnnotations = [];
    this.searchLatencyAlarmFactory = new LatencyAlarmFactory(
      this.createAlarmFactory(searchAlarmPrefix),
    );
    this.searchLatencyAnnotations = [];
    this.clusterAlarmFactory = new OpenSearchClusterAlarmFactory(
      this.createAlarmFactory(clusterAlarmPrefix),
    );
    this.clusterAnnotations = [];
    this.nodeAnnotations = [];
    this.usageAlarmFactory = new UsageAlarmFactory(
      this.createAlarmFactory(alarmPrefix),
    );
    this.usageAnnotations = [];
    this.masterUsageAnnotations = [];

    const metricFactory = new OpenSearchClusterMetricFactory(
      scope.createMetricFactory(),
      props,
    );
    this.tpsMetric = metricFactory.metricTps();
    this.p50IndexingLatencyMetric =
      metricFactory.metricIndexingLatencyP50InMillis();
    this.p90IndexingLatencyMetric =
      metricFactory.metricIndexingLatencyP90InMillis();
    this.p99IndexingLatencyMetric =
      metricFactory.metricIndexingLatencyP99InMillis();
    this.p50SearchLatencyMetric =
      metricFactory.metricSearchLatencyP50InMillis();
    this.p90SearchLatencyMetric =
      metricFactory.metricSearchLatencyP90InMillis();
    this.p99SearchLatencyMetric =
      metricFactory.metricSearchLatencyP99InMillis();
    this.clusterStatusRedMetric = metricFactory.metricClusterStatusRed();
    this.clusterStatusYellowMetric = metricFactory.metricClusterStatusYellow();
    this.diskSpaceUsageMetric = metricFactory.metricDiskSpaceUsageInPercent();
    this.cpuUsageMetric = metricFactory.metricCpuUsage();
    this.masterCpuUsageMetric = metricFactory.metricMasterCpuUsage();
    this.jvmMemoryPressureMetric = metricFactory.metricJvmMemoryPressure();
    this.masterJvmMemoryPressureMetric =
      metricFactory.metricMasterJvmMemoryPressure();
    this.indexWriteBlockedMetric =
      metricFactory.metricClusterIndexWritesBlocked();
    this.nodesMetric = metricFactory.metricNodes();
    this.automatedSnapshotFailureMetric =
      metricFactory.metricAutomatedSnapshotFailure();
    this.kmsKeyErrorMetric = metricFactory.metricKmsKeyError();
    this.kmsKeyInaccessibleMetric = metricFactory.metricKmsKeyInaccessible();

    for (const disambiguator in props.addIndexingLatencyP50Alarm) {
      const alarmProps = props.addIndexingLatencyP50Alarm[disambiguator];
      const createdAlarm = this.indexingLatencyAlarmFactory.addLatencyAlarm(
        this.p50IndexingLatencyMetric,
        LatencyType.P50,
        alarmProps,
        disambiguator,
      );
      this.indexingLatencyAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }
    for (const disambiguator in props.addIndexingLatencyP90Alarm) {
      const alarmProps = props.addIndexingLatencyP90Alarm[disambiguator];
      const createdAlarm = this.indexingLatencyAlarmFactory.addLatencyAlarm(
        this.p90IndexingLatencyMetric,
        LatencyType.P90,
        alarmProps,
        disambiguator,
      );
      this.indexingLatencyAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }
    for (const disambiguator in props.addIndexingLatencyP99Alarm) {
      const alarmProps = props.addIndexingLatencyP99Alarm[disambiguator];
      const createdAlarm = this.indexingLatencyAlarmFactory.addLatencyAlarm(
        this.p99IndexingLatencyMetric,
        LatencyType.P99,
        alarmProps,
        disambiguator,
      );
      this.indexingLatencyAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }
    for (const disambiguator in props.addSearchLatencyP50Alarm) {
      const alarmProps = props.addSearchLatencyP50Alarm[disambiguator];
      const createdAlarm = this.searchLatencyAlarmFactory.addLatencyAlarm(
        this.p50SearchLatencyMetric,
        LatencyType.P50,
        alarmProps,
        disambiguator,
      );
      this.searchLatencyAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }
    for (const disambiguator in props.addSearchLatencyP90Alarm) {
      const alarmProps = props.addSearchLatencyP90Alarm[disambiguator];
      const createdAlarm = this.searchLatencyAlarmFactory.addLatencyAlarm(
        this.p90SearchLatencyMetric,
        LatencyType.P90,
        alarmProps,
        disambiguator,
      );
      this.searchLatencyAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }
    for (const disambiguator in props.addSearchLatencyP99Alarm) {
      const alarmProps = props.addSearchLatencyP99Alarm[disambiguator];
      const createdAlarm = this.searchLatencyAlarmFactory.addLatencyAlarm(
        this.p99SearchLatencyMetric,
        LatencyType.P99,
        alarmProps,
        disambiguator,
      );
      this.searchLatencyAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }
    for (const disambiguator in props.addClusterStatusAlarm) {
      const alarmProps = props.addClusterStatusAlarm[disambiguator];
      let createdAlarm;
      switch (alarmProps.status) {
        case OpenSearchClusterStatus.RED:
          createdAlarm = this.clusterAlarmFactory.addClusterStatusAlarm(
            this.clusterStatusRedMetric,
            alarmProps,
            disambiguator,
          );
          break;
        case OpenSearchClusterStatus.YELLOW:
          createdAlarm = this.clusterAlarmFactory.addClusterStatusAlarm(
            this.clusterStatusYellowMetric,
            alarmProps,
            disambiguator,
          );
          break;
        default:
          throw new Error(`Unknown cluster status: ${alarmProps.status}`);
      }
      this.addAlarm(createdAlarm);
    }
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
    for (const disambiguator in props.addCpuSpaceUsageAlarm) {
      const alarmProps = props.addCpuSpaceUsageAlarm[disambiguator];
      const createdAlarm = this.usageAlarmFactory.addMaxCpuUsagePercentAlarm(
        this.cpuUsageMetric,
        alarmProps,
        disambiguator,
      );
      this.usageAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }
    for (const disambiguator in props.addMasterCpuSpaceUsageAlarm) {
      const alarmProps = props.addMasterCpuSpaceUsageAlarm[disambiguator];
      const createdAlarm =
        this.usageAlarmFactory.addMaxMasterCpuUsagePercentAlarm(
          this.masterCpuUsageMetric,
          alarmProps,
          disambiguator,
        );
      this.masterUsageAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }
    for (const disambiguator in props.addJvmMemoryPressureAlarm) {
      const alarmProps = props.addJvmMemoryPressureAlarm[disambiguator];
      const createdAlarm = this.usageAlarmFactory.addMaxMemoryUsagePercentAlarm(
        this.jvmMemoryPressureMetric,
        alarmProps,
        disambiguator,
      );
      this.usageAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }
    for (const disambiguator in props.addMasterJvmMemoryPressureAlarm) {
      const alarmProps = props.addMasterJvmMemoryPressureAlarm[disambiguator];
      const createdAlarm =
        this.usageAlarmFactory.addMaxMasterMemoryUsagePercentAlarm(
          this.masterJvmMemoryPressureMetric,
          alarmProps,
          disambiguator,
        );
      this.masterUsageAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }
    for (const disambiguator in props.addClusterNodeCountAlarm) {
      const alarmProps = props.addClusterNodeCountAlarm[disambiguator];
      const createdAlarm = this.clusterAlarmFactory.addClusterNodeCountAlarm(
        this.nodesMetric,
        alarmProps,
        disambiguator,
      );
      this.nodeAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }
    for (const disambiguator in props.addClusterIndexWritesBlockedAlarm) {
      const alarmProps = props.addClusterIndexWritesBlockedAlarm[disambiguator];
      const createdAlarm =
        this.clusterAlarmFactory.addClusterIndexWritesBlockedAlarm(
          this.indexWriteBlockedMetric,
          alarmProps,
          disambiguator,
        );
      this.clusterAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }
    for (const disambiguator in props.addClusterAutomatedSnapshotFailureAlarm) {
      const alarmProps =
        props.addClusterAutomatedSnapshotFailureAlarm[disambiguator];
      const createdAlarm =
        this.clusterAlarmFactory.addAutomatedSnapshotFailureAlarm(
          this.automatedSnapshotFailureMetric,
          alarmProps,
          disambiguator,
        );
      this.clusterAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }
    for (const disambiguator in props.addKmsKeyErrorAlarm) {
      const alarmProps = props.addKmsKeyErrorAlarm[disambiguator];
      const createdAlarm = this.clusterAlarmFactory.addKmsKeyErrorAlarm(
        this.kmsKeyErrorMetric,
        alarmProps,
        disambiguator,
      );
      this.clusterAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }
    for (const disambiguator in props.addKmsKeyInaccessibleAlarm) {
      const alarmProps = props.addKmsKeyInaccessibleAlarm[disambiguator];
      const createdAlarm = this.clusterAlarmFactory.addKmsKeyInaccessibleAlarm(
        this.kmsKeyInaccessibleMetric,
        alarmProps,
        disambiguator,
      );
      this.clusterAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }

    props.useCreatedAlarms?.consume(this.createdAlarms());
  }

  summaryWidgets(): IWidget[] {
    // TODO: separate into individual widget methods
    return [
      // Title
      new MonitoringHeaderWidget({
        family: "Elasticsearch Domain",
        title: this.title,
        goToLinkUrl: this.url,
      }),
      // Requests (TPS)
      new GraphWidget({
        width: QuarterWidth,
        height: DefaultSummaryWidgetHeight,
        title: "TPS",
        left: [this.tpsMetric],
        leftYAxis: RateAxisFromZero,
      }),
      // Indexing latency
      new GraphWidget({
        width: QuarterWidth,
        height: DefaultSummaryWidgetHeight,
        title: "Indexing Latency",
        left: [
          this.p50IndexingLatencyMetric,
          this.p90IndexingLatencyMetric,
          this.p99IndexingLatencyMetric,
        ],
        leftYAxis: TimeAxisMillisFromZero,
        leftAnnotations: this.indexingLatencyAnnotations,
      }),
      // Search latency
      new GraphWidget({
        width: QuarterWidth,
        height: DefaultSummaryWidgetHeight,
        title: "Search Latency",
        left: [
          this.p50SearchLatencyMetric,
          this.p90SearchLatencyMetric,
          this.p99SearchLatencyMetric,
        ],
        leftYAxis: TimeAxisMillisFromZero,
        leftAnnotations: this.searchLatencyAnnotations,
      }),
      // CPU, memory, and disk usage
      new GraphWidget({
        width: QuarterWidth,
        height: DefaultSummaryWidgetHeight,
        title: "CPU/Memory/Disk Usage",
        left: [
          this.cpuUsageMetric,
          this.masterCpuUsageMetric,
          this.jvmMemoryPressureMetric,
          this.masterJvmMemoryPressureMetric,
          this.diskSpaceUsageMetric,
        ],
        leftYAxis: PercentageAxisFromZeroToHundred,
        leftAnnotations: [
          ...this.usageAnnotations,
          ...this.masterUsageAnnotations,
        ],
      }),
    ];
  }

  widgets(): IWidget[] {
    // TODO: separate into individual widget methods
    return [
      // Title
      new MonitoringHeaderWidget({
        family: "Elasticsearch Domain",
        title: this.title,
        goToLinkUrl: this.url,
      }),
      new Row(
        // Requests (TPS)
        new GraphWidget({
          width: QuarterWidth,
          height: DefaultGraphWidgetHeight,
          title: "TPS",
          left: [this.tpsMetric],
          leftYAxis: RateAxisFromZero,
        }),
        // Indexing latency
        new GraphWidget({
          width: QuarterWidth,
          height: DefaultGraphWidgetHeight,
          title: "Indexing Latency",
          left: [
            this.p50IndexingLatencyMetric,
            this.p90IndexingLatencyMetric,
            this.p99IndexingLatencyMetric,
          ],
          leftAnnotations: this.indexingLatencyAnnotations,
        }),
        // Search latency
        new GraphWidget({
          width: QuarterWidth,
          height: DefaultGraphWidgetHeight,
          title: "Search Latency",
          left: [
            this.p50SearchLatencyMetric,
            this.p90SearchLatencyMetric,
            this.p99SearchLatencyMetric,
          ],
          leftAnnotations: this.searchLatencyAnnotations,
        }),
        // Node count
        new GraphWidget({
          width: QuarterWidth,
          height: DefaultGraphWidgetHeight,
          title: "Node Count",
          left: [this.nodesMetric],
          leftYAxis: CountAxisFromZero,
          leftAnnotations: this.nodeAnnotations,
        }),
      ),
      new Row(
        // CPU, memory, and disk usage
        new GraphWidget({
          width: ThirdWidth,
          height: DefaultGraphWidgetHeight,
          title: "CPU/Memory/Disk Usage",
          left: [
            this.cpuUsageMetric,
            this.jvmMemoryPressureMetric,
            this.diskSpaceUsageMetric,
          ],
          leftYAxis: PercentageAxisFromZeroToHundred,
          leftAnnotations: this.usageAnnotations,
        }),
        // Master CPU and memory
        new GraphWidget({
          width: ThirdWidth,
          height: DefaultGraphWidgetHeight,
          title: "Master CPU/Memory Usage",
          left: [this.masterCpuUsageMetric, this.masterJvmMemoryPressureMetric],
          leftYAxis: PercentageAxisFromZeroToHundred,
          leftAnnotations: this.masterUsageAnnotations,
        }),
        // Index/Snapshot/KMS Errors
        new GraphWidget({
          width: ThirdWidth,
          height: DefaultGraphWidgetHeight,
          title: "Index/Snapshot/KMS Errors",
          left: [
            this.indexWriteBlockedMetric,
            this.automatedSnapshotFailureMetric,
            this.kmsKeyErrorMetric,
            this.kmsKeyInaccessibleMetric,
          ],
          leftYAxis: CountAxisFromZero,
          leftAnnotations: this.clusterAnnotations,
        }),
      ),
    ];
  }
}
