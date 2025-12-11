import { DimensionsMap } from "aws-cdk-lib/aws-cloudwatch";
import { IDatabaseCluster, ServerlessCluster } from "aws-cdk-lib/aws-rds";

import {
  BaseMetricFactory,
  BaseMetricFactoryProps,
  getLatencyTypeLabel,
  getLatencyTypeStatistic,
  LatencyType,
  MetricFactory,
  MetricStatistic,
} from "../../common";

const RdsNamespace = "AWS/RDS";

export interface RdsClusterMetricFactoryProps extends BaseMetricFactoryProps {
  /**
   * database cluster identifier (either this or `cluster` need to be specified)
   * @deprecated please use `cluster` instead
   */
  readonly clusterIdentifier?: string;
  /**
   * database cluster (either this or `clusterIdentifier` need to be specified)
   */
  readonly cluster?: IDatabaseCluster | ServerlessCluster;
}

export class RdsClusterMetricFactory extends BaseMetricFactory {
  readonly clusterIdentifier: string;
  readonly cluster?: IDatabaseCluster | ServerlessCluster;
  protected readonly dimensionsMap: DimensionsMap;

  constructor(
    metricFactory: MetricFactory,
    props: RdsClusterMetricFactoryProps,
  ) {
    super(metricFactory, props);

    this.cluster = props.cluster;
    this.clusterIdentifier =
      RdsClusterMetricFactory.resolveDbClusterIdentifier(props);
    this.dimensionsMap = { DBClusterIdentifier: this.clusterIdentifier };
  }

  private static resolveDbClusterIdentifier(
    props: RdsClusterMetricFactoryProps,
  ): string {
    if (props.clusterIdentifier !== undefined && props.cluster === undefined) {
      return props.clusterIdentifier;
    } else if (
      props.clusterIdentifier === undefined &&
      props.cluster !== undefined
    ) {
      return props.cluster.clusterIdentifier;
    } else if (props.cluster !== undefined && props.cluster !== undefined) {
      throw Error("Only one of `clusterIdentifier` and `cluster` is supported");
    } else {
      throw Error(
        "At least one of `clusterIdentifier` or `cluster` is required",
      );
    }
  }

  private isServerlessCluster(obj: any): obj is ServerlessCluster {
    return (obj as any).clusterArn !== undefined;
  }

  metricTotalConnectionCount() {
    return this.metric(
      "DatabaseConnections",
      MetricStatistic.AVERAGE,
      "Connections",
    );
  }

  metricFreeStorageInBytes() {
    return this.metric("FreeLocalStorage", MetricStatistic.MIN, "Free");
  }

  metricUsedStorageInBytes() {
    return this.metric("VolumeBytesUsed", MetricStatistic.MAX, "Used");
  }

  metricDiskSpaceUsageInPercent() {
    return this.metricFactory.createMetricMath(
      "100 * (used/(used+free))",
      {
        used: this.metricUsedStorageInBytes(),
        free: this.metricFreeStorageInBytes(),
      },
      "Disk Usage",
    );
  }

  metricAverageCpuUsageInPercent() {
    return this.metric("CPUUtilization", MetricStatistic.AVERAGE, "CPU Usage");
  }

  metricSelectLatencyInMillis(latencyType: LatencyType) {
    const label = getLatencyTypeLabel(latencyType);
    return this.metric(
      "SelectLatency",
      getLatencyTypeStatistic(latencyType),
      `Select ${label}`,
    );
  }

  metricInsertLatencyInMillis(latencyType: LatencyType) {
    const label = getLatencyTypeLabel(latencyType);
    return this.metric(
      "InsertLatency",
      getLatencyTypeStatistic(latencyType),
      `Insert ${label}`,
    );
  }

  metricUpdateLatencyInMillis(latencyType: LatencyType) {
    const label = getLatencyTypeLabel(latencyType);
    return this.metric(
      "UpdateLatency",
      getLatencyTypeStatistic(latencyType),
      `Update ${label}`,
    );
  }

  metricDeleteLatencyInMillis(latencyType: LatencyType) {
    const label = getLatencyTypeLabel(latencyType);
    return this.metric(
      "DeleteLatency",
      getLatencyTypeStatistic(latencyType),
      `Delete ${label}`,
    );
  }

  metricCommitLatencyInMillis(latencyType: LatencyType) {
    const label = getLatencyTypeLabel(latencyType);
    return this.metric(
      "CommitLatency",
      getLatencyTypeStatistic(latencyType),
      `Commit ${label}`,
    );
  }

  // Backward compatibility methods
  metricSelectLatencyP90InMillis() {
    return this.metricSelectLatencyInMillis(LatencyType.P90);
  }

  metricInsertLatencyP90InMillis() {
    return this.metricInsertLatencyInMillis(LatencyType.P90);
  }

  metricUpdateLatencyP90InMillis() {
    return this.metricUpdateLatencyInMillis(LatencyType.P90);
  }

  metricDeleteLatencyP90InMillis() {
    return this.metricDeleteLatencyInMillis(LatencyType.P90);
  }

  metricCommitLatencyP90InMillis() {
    return this.metricCommitLatencyInMillis(LatencyType.P90);
  }

  metricReadIOPS() {
    return this.metric("ReadIOPS", MetricStatistic.AVERAGE, "Read IOPS");
  }

  metricWriteIOPS() {
    return this.metric("WriteIOPS", MetricStatistic.AVERAGE, "Write IOPS");
  }
  metricServerlessDatabaseCapacity() {
    if (!this.isServerlessCluster(this.cluster)) {
      throw Error(
        "Cluster is not of type `ServerlessCluster`. Metric is not applicable",
      );
    }

    return this.metric(
      "ServerlessDatabaseCapacity",
      MetricStatistic.AVERAGE,
      "Serverless Database Capacity",
    );
  }

  private metric(
    metricName: string,
    statistic: MetricStatistic,
    label: string,
  ) {
    return this.metricFactory.createMetric(
      metricName,
      statistic,
      label,
      this.dimensionsMap,
      undefined,
      RdsNamespace,
      undefined,
      this.region,
      this.account,
    );
  }
}
