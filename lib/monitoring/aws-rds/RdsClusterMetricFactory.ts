import { DimensionsMap } from "aws-cdk-lib/aws-cloudwatch";
import { IDatabaseCluster, ServerlessCluster } from "aws-cdk-lib/aws-rds";

import {
  BaseMetricFactory,
  BaseMetricFactoryProps,
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

export class RdsClusterMetricFactory extends BaseMetricFactory<RdsClusterMetricFactoryProps> {
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

  metricSelectLatencyP90InMillis() {
    return this.metric("SelectLatency", MetricStatistic.P90, "Select");
  }

  metricInsertLatencyP90InMillis() {
    return this.metric("InsertLatency", MetricStatistic.P90, "Insert");
  }

  metricUpdateLatencyP90InMillis() {
    return this.metric("UpdateLatency", MetricStatistic.P90, "Update");
  }

  metricDeleteLatencyP90InMillis() {
    return this.metric("DeleteLatency", MetricStatistic.P90, "Delete");
  }

  metricCommitLatencyP90InMillis() {
    return this.metric("CommitLatency", MetricStatistic.P90, "Commit");
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
    return this.metricFactory.metric({
      metricName,
      statistic,
      label,
      dimensionsMap: this.dimensionsMap,
      namespace: RdsNamespace,
      region: this.region,
      account: this.account,
    });
  }
}
