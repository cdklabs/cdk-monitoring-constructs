import { DimensionHash } from "monocdk/aws-cloudwatch";

import { MetricFactory, MetricStatistic } from "../../common";

const Namespace = "AWS/ElastiCache";

export enum ElastiCacheClusterType {
  MEMCACHED,
  REDIS,
}

export interface ElastiCacheClusterMetricFactoryProps {
  /**
   * Cluster to monitor
   * @default monitor all clusters
   */
  readonly clusterId?: string;
}

/**
 * @see https://docs.aws.amazon.com/AmazonElastiCache/latest/mem-ug/CacheMetrics.html
 */
export class ElastiCacheClusterMetricFactory {
  protected readonly metricFactory: MetricFactory;
  protected readonly dimensions: DimensionHash;

  constructor(
    metricFactory: MetricFactory,
    props: ElastiCacheClusterMetricFactoryProps
  ) {
    this.metricFactory = metricFactory;
    this.dimensions = {};
    if (props.clusterId) {
      this.dimensions.CacheClusterId = props.clusterId;
    }
  }

  metricMaxItemCount() {
    return this.metricFactory.createMetric(
      "CurrItems",
      MetricStatistic.MAX,
      "Count",
      this.dimensions,
      undefined,
      Namespace
    );
  }

  metricEvictions() {
    return this.metricFactory.createMetric(
      "Evictions",
      MetricStatistic.SUM,
      "Evictions",
      this.dimensions,
      undefined,
      Namespace
    );
  }

  metricAverageFreeableMemoryInBytes() {
    return this.metricFactory.createMetric(
      "FreeableMemory",
      MetricStatistic.AVERAGE,
      "Freeable",
      this.dimensions,
      undefined,
      Namespace
    );
  }

  metricAverageUnusedMemoryInBytes() {
    return this.metricFactory.createMetric(
      "UnusedMemory",
      MetricStatistic.AVERAGE,
      "Unused",
      this.dimensions,
      undefined,
      Namespace
    );
  }

  metricAverageCachedItemsSizeInBytes() {
    return this.metricFactory.createMetric(
      "BytesUsedForCacheItems",
      MetricStatistic.AVERAGE,
      "Items",
      this.dimensions,
      undefined,
      Namespace
    );
  }

  metricAverageSwapUsageInBytes() {
    return this.metricFactory.createMetric(
      "SwapUsage",
      MetricStatistic.AVERAGE,
      "Swap",
      this.dimensions,
      undefined,
      Namespace
    );
  }

  metricMaxCpuUtilizationInPercent() {
    return this.metricFactory.createMetric(
      "CPUUtilization",
      MetricStatistic.MAX,
      "Cluster CPU Utilization",
      this.dimensions,
      undefined,
      Namespace
    );
  }

  metricAverageConnections() {
    return this.metricFactory.createMetric(
      "CurrConnections",
      MetricStatistic.AVERAGE,
      "Current",
      this.dimensions,
      undefined,
      Namespace
    );
  }

  metricNetworkBytesIn() {
    return this.metricFactory.createMetric(
      "NetworkBytesIn",
      MetricStatistic.SUM,
      "Bytes In",
      this.dimensions,
      undefined,
      Namespace
    );
  }

  metricNetworkBytesOut() {
    return this.metricFactory.createMetric(
      "NetworkBytesOut",
      MetricStatistic.SUM,
      "Bytes Out",
      this.dimensions,
      undefined,
      Namespace
    );
  }
}
