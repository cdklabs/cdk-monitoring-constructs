import { DimensionsMap } from "aws-cdk-lib/aws-cloudwatch";

import {
  getLatencyTypeLabel,
  getLatencyTypeStatistic,
  LatencyType,
  MetricFactory,
  MetricStatistic,
} from "../../common";

const DocumentDbNamespace = "AWS/DocDB";

export interface DocumentDbMetricFactoryProps {
  readonly clusterIdentifier: string;
}

export class DocumentDbMetricFactory {
  protected readonly metricFactory: MetricFactory;
  protected readonly dimensionsMap: DimensionsMap;

  constructor(
    metricFactory: MetricFactory,
    props: DocumentDbMetricFactoryProps
  ) {
    this.metricFactory = metricFactory;
    this.dimensionsMap = {
      DBClusterIdentifier: props.clusterIdentifier,
    };
  }

  metricAverageCpuUsageInPercent() {
    return this.metric("CPUUtilization", MetricStatistic.AVERAGE, "CPU Usage");
  }

  metricMaxConnectionCount() {
    return this.metric(
      "DatabaseConnectionsMax",
      MetricStatistic.MAX,
      "Connections"
    );
  }

  metricMaxCursorCount() {
    return this.metric("DatabaseCursorsMax", MetricStatistic.MAX, "Cursors");
  }

  metricMaxTransactionOpenCount() {
    return this.metric(
      "TransactionsOpenMax",
      MetricStatistic.MAX,
      "Transactions"
    );
  }

  metricOperationsThrottledDueLowMemoryCount() {
    return this.metric(
      "LowMemNumOperationsThrottled",
      MetricStatistic.SUM,
      "Operations throttled (low mem)"
    );
  }

  metricReadLatencyInMillis(latencyType: LatencyType) {
    const label = "Read " + getLatencyTypeLabel(latencyType);
    return this.metric(
      "ReadLatency",
      getLatencyTypeStatistic(latencyType),
      label
    );
  }

  metricWriteLatencyInMillis(latencyType: LatencyType) {
    const label = "Write " + getLatencyTypeLabel(latencyType);
    return this.metric(
      "WriteLatency",
      getLatencyTypeStatistic(latencyType),
      label
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
      DocumentDbNamespace
    );
  }
}
