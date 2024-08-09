import { DimensionsMap } from "aws-cdk-lib/aws-cloudwatch";

import {
  BaseMetricFactory,
  BaseMetricFactoryProps,
  MetricFactory,
  MetricStatistic,
} from "../../common";

const Namespace = "AWS/ElastiCache";

export enum ElastiCacheClusterType {
  MEMCACHED,
  REDIS,
}

export interface ElastiCacheClusterMetricFactoryProps
  extends BaseMetricFactoryProps {
  /**
   * Cluster to monitor
   * @default - monitor all clusters
   */
  readonly clusterId?: string;
}

/**
 * @see https://docs.aws.amazon.com/AmazonElastiCache/latest/mem-ug/CacheMetrics.html
 */
export class ElastiCacheClusterMetricFactory extends BaseMetricFactory<ElastiCacheClusterMetricFactoryProps> {
  protected readonly dimensionsMap: DimensionsMap;

  constructor(
    metricFactory: MetricFactory,
    props: ElastiCacheClusterMetricFactoryProps,
  ) {
    super(metricFactory, props);

    this.dimensionsMap = {};
    if (props.clusterId) {
      this.dimensionsMap.CacheClusterId = props.clusterId;
    }
  }

  metricMaxItemCount() {
    return this.metricFactory.metric({
      metricName: "CurrItems",
      statistic: MetricStatistic.MAX,
      label: "Count",
      dimensionsMap: this.dimensionsMap,
      namespace: Namespace,
      region: this.region,
      account: this.account,
    });
  }

  metricEvictions() {
    return this.metricFactory.metric({
      metricName: "Evictions",
      statistic: MetricStatistic.SUM,
      label: "Evictions",
      dimensionsMap: this.dimensionsMap,
      namespace: Namespace,
      region: this.region,
      account: this.account,
    });
  }

  metricAverageFreeableMemoryInBytes() {
    return this.metricFactory.metric({
      metricName: "FreeableMemory",
      statistic: MetricStatistic.AVERAGE,
      label: "Freeable",
      dimensionsMap: this.dimensionsMap,
      namespace: Namespace,
      region: this.region,
      account: this.account,
    });
  }

  metricAverageUnusedMemoryInBytes() {
    return this.metricFactory.metric({
      metricName: "UnusedMemory",
      statistic: MetricStatistic.AVERAGE,
      label: "Unused",
      dimensionsMap: this.dimensionsMap,
      namespace: Namespace,
      region: this.region,
      account: this.account,
    });
  }

  metricAverageCachedItemsSizeInBytes() {
    return this.metricFactory.metric({
      metricName: "BytesUsedForCacheItems",
      statistic: MetricStatistic.AVERAGE,
      label: "Items",
      dimensionsMap: this.dimensionsMap,
      namespace: Namespace,
      region: this.region,
      account: this.account,
    });
  }

  metricAverageSwapUsageInBytes() {
    return this.metricFactory.metric({
      metricName: "SwapUsage",
      statistic: MetricStatistic.AVERAGE,
      label: "Swap",
      dimensionsMap: this.dimensionsMap,
      namespace: Namespace,
      region: this.region,
      account: this.account,
    });
  }

  metricMaxCpuUtilizationInPercent() {
    return this.metricFactory.metric({
      metricName: "CPUUtilization",
      statistic: MetricStatistic.MAX,
      label: "Cluster CPU Utilization",
      dimensionsMap: this.dimensionsMap,
      namespace: Namespace,
      region: this.region,
      account: this.account,
    });
  }

  /**
   * Because Redis is single-threaded, you can use this metric to analyze the load of the Redis process itself.
   * Note that you may want to monitor both Engine CPU Utilization as well as CPU Utilization as background
   * processes can take up a significant portion of the CPU workload. This is especially important for
   * hosts with 2 vCPUs or less.
   *
   * @see https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/CacheMetrics.Redis.html
   */
  metricMaxRedisEngineCpuUtilizationInPercent() {
    return this.metricFactory.metric({
      metricName: "EngineCPUUtilization",
      statistic: MetricStatistic.MAX,
      label: "Cluster Engine CPU Utilization",
      dimensionsMap: this.dimensionsMap,
      namespace: Namespace,
      region: this.region,
      account: this.account,
    });
  }

  metricAverageConnections() {
    return this.metricFactory.metric({
      metricName: "CurrConnections",
      statistic: MetricStatistic.AVERAGE,
      label: "Current",
      dimensionsMap: this.dimensionsMap,
      namespace: Namespace,
      region: this.region,
      account: this.account,
    });
  }

  metricNetworkBytesIn() {
    return this.metricFactory.metric({
      metricName: "NetworkBytesIn",
      statistic: MetricStatistic.SUM,
      label: "Bytes In",
      dimensionsMap: this.dimensionsMap,
      namespace: Namespace,
      region: this.region,
      account: this.account,
    });
  }

  metricNetworkBytesOut() {
    return this.metricFactory.metric({
      metricName: "NetworkBytesOut",
      statistic: MetricStatistic.SUM,
      label: "Bytes Out",
      dimensionsMap: this.dimensionsMap,
      namespace: Namespace,
      region: this.region,
      account: this.account,
    });
  }
}
