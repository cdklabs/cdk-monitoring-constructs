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
  ElastiCacheAlarmFactory,
  MaxItemsCountThreshold,
  MaxUsedSwapMemoryThreshold,
  MetricWithAlarmSupport,
  MinFreeableMemoryThreshold,
  Monitoring,
  MonitoringScope,
  PercentageAxisFromZeroToHundred,
  QuarterWidth,
  SizeAxisBytesFromZero,
  ThirdWidth,
  UsageAlarmFactory,
  UsageThreshold,
  capitalizeFirstLetterOnly,
} from "../../common";
import {
  MonitoringHeaderWidget,
  MonitoringNamingStrategy,
} from "../../dashboard";
import {
  ElastiCacheClusterMetricFactory,
  ElastiCacheClusterMetricFactoryProps,
  ElastiCacheClusterType,
} from "./ElastiCacheClusterMetricFactory";

export interface ElastiCacheClusterMonitoringOptions
  extends BaseMonitoringProps {
  /**
   * Cluster type (needed, since each type has their own specific metrics)
   */
  readonly clusterType: ElastiCacheClusterType;

  /**
   * Add CPU usage alarm
   */
  readonly addCpuUsageAlarm?: Record<string, UsageThreshold>;

  /**
   * Add alarm on total number of items
   */
  readonly addMaxItemsCountAlarm?: Record<string, MaxItemsCountThreshold>;
  /**
   * Add alarm on number of evicted items
   */
  readonly addMaxEvictedItemsCountAlarm?: Record<
    string,
    MaxItemsCountThreshold
  >;

  /**
   * Add alarm on amount of freeable memory
   */
  readonly addMinFreeableMemoryAlarm?: Record<
    string,
    MinFreeableMemoryThreshold
  >;
  /**
   * Add alarm on amount of used swap memory
   */
  readonly addMaxUsedSwapMemoryAlarm?: Record<
    string,
    MaxUsedSwapMemoryThreshold
  >;
}

export interface ElastiCacheClusterMonitoringProps
  extends ElastiCacheClusterMetricFactoryProps,
    ElastiCacheClusterMonitoringOptions {}

export class ElastiCacheClusterMonitoring extends Monitoring {
  readonly title: string;
  readonly clusterUrl?: string;

  readonly connectionsMetric: MetricWithAlarmSupport;
  readonly cpuUsageMetric: MetricWithAlarmSupport;
  readonly freeableMemoryMetric: MetricWithAlarmSupport;
  readonly unusedMemoryMetric: MetricWithAlarmSupport;
  readonly swapMemoryMetric: MetricWithAlarmSupport;
  readonly itemsMemoryMetric: MetricWithAlarmSupport;
  readonly itemsCountMetrics: MetricWithAlarmSupport;
  readonly itemsEvictedMetrics: MetricWithAlarmSupport;

  readonly usageAlarmFactory: UsageAlarmFactory;
  readonly elastiCacheAlarmFactory: ElastiCacheAlarmFactory;
  readonly cpuUsageAnnotations: HorizontalAnnotation[];
  readonly itemsCountAnnotations: HorizontalAnnotation[];
  readonly evictedItemsCountAnnotations: HorizontalAnnotation[];
  readonly memoryUsageAnnotations: HorizontalAnnotation[];

  constructor(
    scope: MonitoringScope,
    props: ElastiCacheClusterMonitoringProps
  ) {
    super(scope, props);

    const clusterType = capitalizeFirstLetterOnly(
      ElastiCacheClusterType[props.clusterType]
    );
    const fallbackConstructName = [clusterType, props.clusterId ?? "ALL"].join(
      "-"
    );
    const namingStrategy = new MonitoringNamingStrategy({
      ...props,
      fallbackConstructName,
    });
    this.title = namingStrategy.resolveHumanReadableName();
    if (props.clusterId) {
      this.clusterUrl = scope
        .createAwsConsoleUrlFactory()
        .getElastiCacheClusterUrl(props.clusterId, props.clusterType);
    }

    const metricFactory = new ElastiCacheClusterMetricFactory(
      scope.createMetricFactory(),
      props
    );
    this.connectionsMetric = metricFactory.metricAverageConnections();
    this.cpuUsageMetric = metricFactory.metricMaxCpuUtilizationInPercent();
    this.freeableMemoryMetric =
      metricFactory.metricAverageFreeableMemoryInBytes();
    this.unusedMemoryMetric = metricFactory.metricAverageUnusedMemoryInBytes();
    this.swapMemoryMetric = metricFactory.metricAverageSwapUsageInBytes();
    this.itemsMemoryMetric =
      metricFactory.metricAverageCachedItemsSizeInBytes();
    this.itemsCountMetrics = metricFactory.metricMaxItemCount();
    this.itemsEvictedMetrics = metricFactory.metricEvictions();

    this.cpuUsageAnnotations = [];
    this.itemsCountAnnotations = [];
    this.evictedItemsCountAnnotations = [];
    this.memoryUsageAnnotations = [];

    const alarmFactory = this.createAlarmFactory(
      namingStrategy.resolveAlarmFriendlyName()
    );
    this.usageAlarmFactory = new UsageAlarmFactory(alarmFactory);
    this.elastiCacheAlarmFactory = new ElastiCacheAlarmFactory(alarmFactory);

    for (const disambiguator in props.addCpuUsageAlarm) {
      const alarmProps = props.addCpuUsageAlarm[disambiguator];
      const createdAlarm = this.usageAlarmFactory.addMaxCpuUsagePercentAlarm(
        this.cpuUsageMetric,
        alarmProps,
        disambiguator
      );
      this.cpuUsageAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }
    for (const disambiguator in props.addMaxItemsCountAlarm) {
      const alarmProps = props.addMaxItemsCountAlarm[disambiguator];
      const createdAlarm = this.elastiCacheAlarmFactory.addMaxItemsCountAlarm(
        this.itemsCountMetrics,
        alarmProps,
        disambiguator
      );
      this.itemsCountAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }
    for (const disambiguator in props.addMaxEvictedItemsCountAlarm) {
      const alarmProps = props.addMaxEvictedItemsCountAlarm[disambiguator];
      const createdAlarm =
        this.elastiCacheAlarmFactory.addMaxEvictedItemsCountAlarm(
          this.itemsEvictedMetrics,
          alarmProps,
          disambiguator
        );
      this.evictedItemsCountAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }
    for (const disambiguator in props.addMinFreeableMemoryAlarm) {
      const alarmProps = props.addMinFreeableMemoryAlarm[disambiguator];
      const createdAlarm =
        this.elastiCacheAlarmFactory.addMinFreeableMemoryAlarm(
          this.freeableMemoryMetric,
          alarmProps,
          disambiguator
        );
      this.memoryUsageAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }
    for (const disambiguator in props.addMaxUsedSwapMemoryAlarm) {
      const alarmProps = props.addMaxUsedSwapMemoryAlarm[disambiguator];
      const createdAlarm =
        this.elastiCacheAlarmFactory.addMaxUsedSwapMemoryAlarm(
          this.swapMemoryMetric,
          alarmProps,
          disambiguator
        );
      this.memoryUsageAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }

    props.useCreatedAlarms?.consume(this.createdAlarms());
  }

  summaryWidgets(): IWidget[] {
    return [
      this.createTitleWidget(),
      this.createCpuUsageWidget(ThirdWidth, DefaultSummaryWidgetHeight),
      this.createMemoryUsageWidget(ThirdWidth, DefaultSummaryWidgetHeight),
      this.createItemCountWidget(ThirdWidth, DefaultSummaryWidgetHeight),
    ];
  }

  widgets(): IWidget[] {
    return [
      this.createTitleWidget(),
      this.createCpuUsageWidget(QuarterWidth, DefaultGraphWidgetHeight),
      this.createMemoryUsageWidget(QuarterWidth, DefaultGraphWidgetHeight),
      this.createConnectionsWidget(QuarterWidth, DefaultGraphWidgetHeight),
      this.createItemCountWidget(QuarterWidth, DefaultGraphWidgetHeight),
    ];
  }

  createTitleWidget() {
    return new MonitoringHeaderWidget({
      family: "ElastiCache Cluster",
      title: this.title,
      goToLinkUrl: this.clusterUrl,
    });
  }

  createCpuUsageWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "CPU Utilization",
      left: [this.cpuUsageMetric],
      leftYAxis: PercentageAxisFromZeroToHundred,
      leftAnnotations: this.cpuUsageAnnotations,
    });
  }

  createMemoryUsageWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Memory Utilization",
      left: [
        this.freeableMemoryMetric,
        this.unusedMemoryMetric,
        this.swapMemoryMetric,
      ],
      leftYAxis: SizeAxisBytesFromZero,
      leftAnnotations: this.memoryUsageAnnotations,
    });
  }

  createItemCountWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Items",
      left: [this.itemsCountMetrics],
      leftYAxis: CountAxisFromZero,
      leftAnnotations: this.itemsCountAnnotations,
      right: [this.itemsEvictedMetrics],
      rightYAxis: CountAxisFromZero,
      rightAnnotations: this.evictedItemsCountAnnotations,
    });
  }

  createConnectionsWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Connections",
      left: [this.connectionsMetric],
      leftYAxis: CountAxisFromZero,
    });
  }
}
