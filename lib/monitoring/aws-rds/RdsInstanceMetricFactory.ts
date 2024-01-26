import { DimensionsMap } from "aws-cdk-lib/aws-cloudwatch";
import { IDatabaseInstance } from "aws-cdk-lib/aws-rds";

import {
  LatencyType,
  MetricFactory,
  MetricStatistic,
  getLatencyTypeLabel,
  getLatencyTypeStatistic,
} from "../../common";

const RdsNamespace = "AWS/RDS";

export interface RdsInstanceMetricFactoryProps {
  /**
   * database instance
   */
  readonly instance?: IDatabaseInstance;
}

export class RdsInstanceMetricFactory {
  readonly instanceIdentifier: string;
  readonly instance?: IDatabaseInstance;
  protected readonly metricFactory: MetricFactory;
  protected readonly dimensionsMap: DimensionsMap;

  constructor(
    metricFactory: MetricFactory,
    props: RdsInstanceMetricFactoryProps
  ) {
    this.metricFactory = metricFactory;
    this.instance = props.instance;
    this.instanceIdentifier =
      RdsInstanceMetricFactory.resolveDbInstanceIdentifier(props);
    this.dimensionsMap = { DBInstanceIdentifier: this.instanceIdentifier };
  }

  private static resolveDbInstanceIdentifier(
    props: RdsInstanceMetricFactoryProps
  ): string {
    if (!props.instance) {
      throw Error("`instance` is required");
    }
    return props.instance.instanceIdentifier;
  }

  metricTotalConnectionCount() {
    return this.metric(
      "DatabaseConnections",
      MetricStatistic.SUM,
      "Connections: Sum"
    );
  }

  metricAverageCpuUsageInPercent() {
    return this.metric("CPUUtilization", MetricStatistic.AVERAGE, "CPU Usage");
  }

  metricAverageFreeStorageSpace() {
    return this.metric(
      "FreeStorageSpace",
      MetricStatistic.AVERAGE,
      "FreeStorageSpace: Average"
    );
  }

  metricAverageFreeableMemory() {
    return this.metric(
      "FreeableMemory",
      MetricStatistic.AVERAGE,
      "FreeableMemory: Average"
    );
  }

  metricReadLatencyInMillis(latencyType: LatencyType) {
    const label = "ReadLatency " + getLatencyTypeLabel(latencyType);
    return this.metric(
      "ReadLatency",
      getLatencyTypeStatistic(latencyType),
      label
    );
  }

  metricReadThroughput() {
    return this.metric(
      "ReadThroughput",
      MetricStatistic.AVERAGE,
      "ReadThroughput: Average"
    );
  }

  metricReadIops() {
    return this.metric(
      "ReadIOPS",
      MetricStatistic.AVERAGE,
      "ReadIOPS: Average"
    );
  }

  metricWriteLatencyInMillis(latencyType: LatencyType) {
    const label = "WriteLatency " + getLatencyTypeLabel(latencyType);
    return this.metric(
      "WriteLatency",
      getLatencyTypeStatistic(latencyType),
      label
    );
  }

  metricWriteThroughput() {
    return this.metric(
      "WriteThroughput",
      MetricStatistic.AVERAGE,
      "WriteThroughput: Average"
    );
  }

  metricWriteIops() {
    return this.metric(
      "WriteIOPS",
      MetricStatistic.AVERAGE,
      "WriteIOPS: Average"
    );
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
