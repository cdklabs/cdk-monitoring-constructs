import { DimensionsMap } from "aws-cdk-lib/aws-cloudwatch";
import {
  BaseMetricFactory,
  BaseMetricFactoryProps,
  getLatencyTypeLabel,
  getLatencyTypeStatistic,
  LatencyType,
  MetricFactory,
  MetricStatistic,
} from "../../common";

const Namespace = "AWS/ElastiCache";

export interface ElastiCacheServerlessMetricFactoryProps
  extends BaseMetricFactoryProps {
  /**
   * Cluster to monitor
   * @default - monitor all clusters
   */
  readonly clusterId?: string;
}

/**
 * @see https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/serverless-metrics-events-redis.html
 */
export class ElastiCacheServerlessMetricFactory extends BaseMetricFactory<ElastiCacheServerlessMetricFactoryProps> {
  protected readonly dimensionsMap: DimensionsMap;

  constructor(
    metricFactory: MetricFactory,
    props: ElastiCacheServerlessMetricFactoryProps,
  ) {
    super(metricFactory, props);

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
      Namespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricEvictions() {
    return this.metricFactory.createMetric(
      "Evictions",
      MetricStatistic.SUM,
      "Evictions",
      this.dimensionsMap,
      undefined,
      Namespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricAverageCacheSize() {
    return this.metricFactory.createMetric(
      "BytesUsedForCache",
      MetricStatistic.AVERAGE,
      "Size",
      this.dimensionsMap,
      undefined,
      Namespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricMaxElastiCacheProcessingUnits() {
    return this.metricFactory.createMetric(
      "ElastiCacheProcessingUnits",
      MetricStatistic.MAX,
      "Processing Units",
      this.dimensionsMap,
      undefined,
      Namespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricAverageConnections() {
    return this.metricFactory.createMetric(
      "CurrConnections",
      MetricStatistic.AVERAGE,
      "Current",
      this.dimensionsMap,
      undefined,
      Namespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricNetworkBytesIn() {
    return this.metricFactory.createMetric(
      "NetworkBytesIn",
      MetricStatistic.SUM,
      "Bytes In",
      this.dimensionsMap,
      undefined,
      Namespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricNetworkBytesOut() {
    return this.metricFactory.createMetric(
      "NetworkBytesOut",
      MetricStatistic.SUM,
      "Bytes Out",
      this.dimensionsMap,
      undefined,
      Namespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricSuccessfulReadRequestLatency(latencyType: LatencyType) {
    return this.metricFactory.createMetric(
      "SuccessfulReadRequestLatency",
      getLatencyTypeStatistic(latencyType),
      `Read ${getLatencyTypeLabel(latencyType)}`,
      this.dimensionsMap,
      undefined,
      Namespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricSuccessfulWriteRequestLatency(latencyType: LatencyType) {
    return this.metricFactory.createMetric(
      "SuccessfulWriteRequestLatency",
      getLatencyTypeStatistic(latencyType),
      `Write ${getLatencyTypeLabel(latencyType)}`,
      this.dimensionsMap,
      undefined,
      Namespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricTotalThrottledCmds() {
    return this.metricFactory.createMetric(
      "ThrottledCmds",
      MetricStatistic.SUM,
      "Throttled Cmds",
      this.dimensionsMap,
      undefined,
      Namespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricTotalCmds() {
    return this.metricFactory.createMetric(
      "TotalCmdsCount",
      MetricStatistic.SUM,
      "Cmds",
      this.dimensionsMap,
      undefined,
      Namespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricThrottleRate() {
    return this.metricFactory.createMetricMath(
      "FILL(IF(total > 0, 100 * throttles/total, 0), 0)",
      {
        throttles: this.metricTotalThrottledCmds(),
        total: this.metricTotalCmds(),
      },
      "Throttle Rate",
    );
  }

  metricAverageCacheHitRate() {
    return this.metricFactory.createMetric(
      "CacheHitRate",
      MetricStatistic.AVERAGE,
      "Hit rate",
      this.dimensionsMap,
      undefined,
      Namespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricCacheHits() {
    return this.metricFactory.createMetric(
      "CacheHits",
      MetricStatistic.SUM,
      "Hits",
      this.dimensionsMap,
      undefined,
      Namespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricCacheMisses() {
    return this.metricFactory.createMetric(
      "CacheMisses",
      MetricStatistic.SUM,
      "Misses",
      this.dimensionsMap,
      undefined,
      Namespace,
      undefined,
      this.region,
      this.account,
    );
  }
}
