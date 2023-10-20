import { DimensionsMap } from "aws-cdk-lib/aws-cloudwatch";

import { MetricFactory, MetricStatistic } from "../../common";

const Namespace = "AWS/ElastiCache";

export enum ElastiCacheClusterType {
  MEMCACHED,
  REDIS,
}

export interface ElastiCacheClusterMetricFactoryProps {
  /**
   * Cluster to monitor
   * @default - monitor all clusters
   */
  readonly clusterId?: string;
}

/**
 * @see https://docs.aws.amazon.com/AmazonElastiCache/latest/mem-ug/CacheMetrics.html
 */
export class ElastiCacheClusterMetricFactory {
  protected readonly metricFactory: MetricFactory;
  protected readonly dimensionsMap: DimensionsMap;

  constructor(
    metricFactory: MetricFactory,
    props: ElastiCacheClusterMetricFactoryProps
  ) {
    this.metricFactory = metricFactory;
    this.dimensionsMap = {};
    if (props.clusterId) {
      this.dimensionsMap.CacheClusterId = props.clusterId;
    }
  }

  metricMaxItemCount() {
    return this.metricFactory.createMetric(
      "CurrItems",
      MetricStatistic.MAX,
      "Count",
      this.dimensionsMap,
      undefined,
      Namespace
    );
  }

  metricEvictions() {
    return this.metricFactory.createMetric(
      "Evictions",
      MetricStatistic.SUM,
      "Evictions",
      this.dimensionsMap,
      undefined,
      Namespace
    );
  }

  metricAverageFreeableMemoryInBytes() {
    return this.metricFactory.createMetric(
      "FreeableMemory",
      MetricStatistic.AVERAGE,
      "Freeable",
      this.dimensionsMap,
      undefined,
      Namespace
    );
  }

  metricAverageUnusedMemoryInBytes() {
    return this.metricFactory.createMetric(
      "UnusedMemory",
      MetricStatistic.AVERAGE,
      "Unused",
      this.dimensionsMap,
      undefined,
      Namespace
    );
  }

  metricAverageCachedItemsSizeInBytes() {
    return this.metricFactory.createMetric(
      "BytesUsedForCacheItems",
      MetricStatistic.AVERAGE,
      "Items",
      this.dimensionsMap,
      undefined,
      Namespace
    );
  }

  metricAverageSwapUsageInBytes() {
    return this.metricFactory.createMetric(
      "SwapUsage",
      MetricStatistic.AVERAGE,
      "Swap",
      this.dimensionsMap,
      undefined,
      Namespace
    );
  }

  metricMaxCpuUtilizationInPercent() {
    return this.metricFactory.createMetric(
      "CPUUtilization",
      MetricStatistic.MAX,
      "Cluster CPU Utilization",
      this.dimensionsMap,
      undefined,
      Namespace
    );
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
    return this.metricFactory.createMetric(
      "EngineCPUUtilization",
      MetricStatistic.MAX,
      "Cluster Engine CPU Utilization",
      this.dimensionsMap,
      undefined,
      Namespace
    );
  }

  metricAverageConnections() {
    return this.metricFactory.createMetric(
      "CurrConnections",
      MetricStatistic.AVERAGE,
      "Current",
      this.dimensionsMap,
      undefined,
      Namespace
    );
  }

  metricNetworkBytesIn() {
    return this.metricFactory.createMetric(
      "NetworkBytesIn",
      MetricStatistic.SUM,
      "Bytes In",
      this.dimensionsMap,
      undefined,
      Namespace
    );
  }

  metricNetworkBytesOut() {
    return this.metricFactory.createMetric(
      "NetworkBytesOut",
      MetricStatistic.SUM,
      "Bytes Out",
      this.dimensionsMap,
      undefined,
      Namespace
    );
  }
}
