import { DimensionsMap } from "aws-cdk-lib/aws-cloudwatch";
import { DatabaseCluster } from "aws-cdk-lib/aws-docdb";

import {
  getLatencyTypeLabel,
  getLatencyTypeStatistic,
  LatencyType,
  MetricFactory,
  MetricStatistic,
} from "../../common";

const DocumentDbNamespace = "AWS/DocDB";

export interface DocumentDbMetricFactoryProps {
  /**
   * database cluster identifier (either this or `cluster` need to be specified)
   */
  readonly clusterIdentifier?: string;
  /**
   * database cluster (either this or `clusterIdentifier` need to be specified)
   */
  readonly cluster?: DatabaseCluster;
}

export class DocumentDbMetricFactory {
  readonly clusterIdentifier: string;
  protected readonly metricFactory: MetricFactory;
  protected readonly dimensionsMap: DimensionsMap;

  constructor(
    metricFactory: MetricFactory,
    props: DocumentDbMetricFactoryProps
  ) {
    this.metricFactory = metricFactory;
    this.clusterIdentifier =
      DocumentDbMetricFactory.resolveDbClusterIdentifier(props);
    this.dimensionsMap = { DBClusterIdentifier: this.clusterIdentifier };
  }

  private static resolveDbClusterIdentifier(
    props: DocumentDbMetricFactoryProps
  ): string {
    if (props.clusterIdentifier !== undefined && props.cluster === undefined) {
      return props.clusterIdentifier;
    } else if (
      props.cluster !== undefined &&
      props.clusterIdentifier === undefined
    ) {
      return props.cluster.clusterIdentifier;
    } else {
      throw new Error(
        "Specify either 'clusterIdentifier' or 'cluster', but not both."
      );
    }
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
