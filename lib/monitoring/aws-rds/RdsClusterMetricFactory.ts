import { DimensionsMap } from "aws-cdk-lib/aws-cloudwatch";

import { MetricFactory, MetricStatistic } from "../../common";

const RdsNamespace = "AWS/RDS";

export interface RdsClusterMetricFactoryProps {
  readonly clusterIdentifier: string;
}

export class RdsClusterMetricFactory {
  protected readonly metricFactory: MetricFactory;
  protected readonly dimensionsMap: DimensionsMap;

  constructor(
    metricFactory: MetricFactory,
    props: RdsClusterMetricFactoryProps
  ) {
    this.metricFactory = metricFactory;
    this.dimensionsMap = {
      DBClusterIdentifier: props.clusterIdentifier,
    };
  }

  metricTotalConnectionCount() {
    return this.metric(
      "DatabaseConnections",
      MetricStatistic.SUM,
      "Connections"
    );
  }

  metricFreeStorageInBytes() {
    return this.metric("FreeLocalStorage", MetricStatistic.MIN, "Free");
  }

  metricUsedStorageInBytes() {
    return this.metric("VolumeBytesUsed", MetricStatistic.MAX, "Used");
  }

  metricDiskSpaceUsageInPercent() {
    const used = this.metricUsedStorageInBytes();
    const free = this.metricFreeStorageInBytes();
    return this.metricFactory.createMetricMath(
      "100 * (used/(used+free))",
      { used, free },
      "Disk Usage"
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

  private metric(
    metricName: string,
    statistic: MetricStatistic,
    label: string
  ) {
    return this.metricFactory.createMetric(
      metricName,
      statistic,
      label,
      this.dimensionsMap,
      undefined,
      RdsNamespace
    );
  }
}
