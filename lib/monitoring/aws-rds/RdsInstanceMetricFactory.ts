import { DimensionsMap } from "aws-cdk-lib/aws-cloudwatch";
import { IDatabaseInstance } from "aws-cdk-lib/aws-rds";

import {
  BaseMetricFactory,
  BaseMetricFactoryProps,
  LatencyType,
  MetricFactory,
  MetricStatistic,
  getLatencyTypeLabel,
  getLatencyTypeStatistic,
} from "../../common";

const RdsNamespace = "AWS/RDS";

export interface RdsInstanceMetricFactoryProps extends BaseMetricFactoryProps {
  /**
   * database instance
   */
  readonly instance: IDatabaseInstance;
}

export class RdsInstanceMetricFactory extends BaseMetricFactory<RdsInstanceMetricFactoryProps> {
  readonly instanceIdentifier: string;
  readonly instance: IDatabaseInstance;
  protected readonly dimensionsMap: DimensionsMap;

  constructor(
    metricFactory: MetricFactory,
    props: RdsInstanceMetricFactoryProps,
  ) {
    super(metricFactory, props);

    this.instance = props.instance;
    this.instanceIdentifier = props.instance.instanceIdentifier;
    this.dimensionsMap = {
      DBInstanceIdentifier: this.instanceIdentifier,
    };
  }

  metricTotalConnectionCount() {
    return this.metricFactory.adaptMetric(
      this.instance.metricDatabaseConnections({
        statistic: MetricStatistic.SUM,
        label: "Connections: Sum",
        region: this.region,
        account: this.account,
      }),
    );
  }

  metricAverageCpuUsageInPercent() {
    return this.metricFactory.adaptMetric(
      this.instance.metricCPUUtilization({
        statistic: MetricStatistic.AVERAGE,
        label: "CPU Usage",
        region: this.region,
        account: this.account,
      }),
    );
  }

  metricMaxFreeStorageSpace() {
    return this.metricFactory.adaptMetric(
      this.instance.metricFreeStorageSpace({
        statistic: MetricStatistic.MAX,
        label: "FreeStorageSpace: MAX",
        region: this.region,
        account: this.account,
      }),
    );
  }

  metricAverageFreeableMemory() {
    return this.metricFactory.adaptMetric(
      this.instance.metricFreeableMemory({
        statistic: MetricStatistic.AVERAGE,
        label: "FreeStorageSpace: Average",
        region: this.region,
        account: this.account,
      }),
    );
  }

  metricReadLatencyInMillis(latencyType: LatencyType) {
    const label = "ReadLatency " + getLatencyTypeLabel(latencyType);
    return this.metric(
      "ReadLatency",
      getLatencyTypeStatistic(latencyType),
      label,
    );
  }

  metricReadThroughput() {
    return this.metric(
      "ReadThroughput",
      MetricStatistic.AVERAGE,
      "ReadThroughput: Average",
    );
  }

  metricReadIops() {
    return this.metricFactory.adaptMetric(
      this.instance.metricReadIOPS({
        statistic: MetricStatistic.AVERAGE,
        label: "ReadIOPS: Average",
        region: this.region,
        account: this.account,
      }),
    );
  }

  metricWriteLatencyInMillis(latencyType: LatencyType) {
    const label = "WriteLatency " + getLatencyTypeLabel(latencyType);
    return this.metric(
      "WriteLatency",
      getLatencyTypeStatistic(latencyType),
      label,
    );
  }

  metricWriteThroughput() {
    return this.metric(
      "WriteThroughput",
      MetricStatistic.AVERAGE,
      "WriteThroughput: Average",
    );
  }

  metricWriteIops() {
    return this.metricFactory.adaptMetric(
      this.instance.metricWriteIOPS({
        statistic: MetricStatistic.AVERAGE,
        label: "WriteIOPS: Average",
        region: this.region,
        account: this.account,
      }),
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
