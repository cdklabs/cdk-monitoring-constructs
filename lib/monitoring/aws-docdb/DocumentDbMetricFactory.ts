import { DimensionsMap } from "aws-cdk-lib/aws-cloudwatch";
import { IDatabaseCluster } from "aws-cdk-lib/aws-docdb";

import {
  BaseMetricFactory,
  BaseMetricFactoryProps,
  getLatencyTypeLabel,
  getLatencyTypeStatistic,
  LatencyType,
  MetricFactory,
  MetricStatistic,
} from "../../common";

const DocumentDbNamespace = "AWS/DocDB";

export interface DocumentDbMetricFactoryProps extends BaseMetricFactoryProps {
  /**
   * database cluster
   */
  readonly cluster: IDatabaseCluster;
}

export class DocumentDbMetricFactory extends BaseMetricFactory<DocumentDbMetricFactoryProps> {
  readonly clusterIdentifier: string;
  protected readonly dimensionsMap: DimensionsMap;

  constructor(
    metricFactory: MetricFactory,
    props: DocumentDbMetricFactoryProps,
  ) {
    super(metricFactory, props);

    this.clusterIdentifier = props.cluster.clusterIdentifier;
    this.dimensionsMap = { DBClusterIdentifier: this.clusterIdentifier };
  }

  metricAverageCpuUsageInPercent() {
    return this.metric("CPUUtilization", MetricStatistic.AVERAGE, "CPU Usage");
  }

  metricMaxConnectionCount() {
    return this.metric(
      "DatabaseConnectionsMax",
      MetricStatistic.MAX,
      "Connections",
    );
  }

  metricMaxCursorCount() {
    return this.metric("DatabaseCursorsMax", MetricStatistic.MAX, "Cursors");
  }

  metricMaxTransactionOpenCount() {
    return this.metric(
      "TransactionsOpenMax",
      MetricStatistic.MAX,
      "Transactions",
    );
  }

  metricOperationsThrottledDueLowMemoryCount() {
    return this.metric(
      "LowMemNumOperationsThrottled",
      MetricStatistic.SUM,
      "Operations throttled (low mem)",
    );
  }

  metricReadLatencyInMillis(latencyType: LatencyType) {
    return this.metric(
      "ReadLatency",
      getLatencyTypeStatistic(latencyType),
      `Read ${getLatencyTypeLabel(latencyType)}`,
    );
  }

  metricWriteLatencyInMillis(latencyType: LatencyType) {
    return this.metric(
      "WriteLatency",
      getLatencyTypeStatistic(latencyType),
      `Write ${getLatencyTypeLabel(latencyType)}`,
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
      DocumentDbNamespace,
      undefined,
      this.region,
      this.account,
    );
  }
}
