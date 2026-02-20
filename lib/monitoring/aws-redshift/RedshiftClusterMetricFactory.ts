import { DimensionsMap } from "aws-cdk-lib/aws-cloudwatch";

import {
  BaseMetricFactory,
  BaseMetricFactoryProps,
  MetricFactory,
  MetricStatistic,
} from "../../common";

const RedshiftNamespace = "AWS/Redshift";

type QueryLatencyClass = "short" | "medium" | "long";

export interface RedshiftClusterMetricFactoryProps
  extends BaseMetricFactoryProps {
  readonly clusterIdentifier: string;
}

export class RedshiftClusterMetricFactory extends BaseMetricFactory<RedshiftClusterMetricFactoryProps> {
  protected readonly dimensionsMap: DimensionsMap;

  constructor(
    metricFactory: MetricFactory,
    props: RedshiftClusterMetricFactoryProps,
  ) {
    super(metricFactory, props);

    this.dimensionsMap = {
      ClusterIdentifier: props.clusterIdentifier,
    };
  }

  metricTotalConnectionCount() {
    return this.metric(
      "DatabaseConnections",
      MetricStatistic.SUM,
      "Connections",
    );
  }

  metricAverageDiskSpaceUsageInPercent() {
    return this.metric(
      "PercentageDiskSpaceUsed",
      MetricStatistic.AVERAGE,
      "Disk Usage",
    );
  }

  metricAverageCpuUsageInPercent() {
    return this.metric("CPUUtilization", MetricStatistic.AVERAGE, "CPU Usage");
  }

  metricShortQueryDurationP90InMillis() {
    const sQueryLatency90 = this.metricQueryDuration(
      "short",
      MetricStatistic.P90,
    );
    // need to convert micros to millis
    return this.metricFactory.createMetricMath(
      "sQueryLatency90 / 1000",
      { sQueryLatency90 },
      "Short P90",
    );
  }

  metricMediumQueryDurationP90InMillis() {
    const mQueryLatency90 = this.metricQueryDuration(
      "medium",
      MetricStatistic.P90,
    );
    // need to convert micros to millis
    return this.metricFactory.createMetricMath(
      "mQueryLatency90 / 1000",
      { mQueryLatency90 },
      "Medium P90",
    );
  }

  metricLongQueryDurationP90InMillis() {
    const lQueryLatency90 = this.metricQueryDuration(
      "long",
      MetricStatistic.P90,
    );
    // need to convert micros to millis
    return this.metricFactory.createMetricMath(
      "lQueryLatency90 / 1000",
      { lQueryLatency90 },
      "Long P90",
    );
  }

  metricMaintenanceModeEnabled() {
    return this.metric("MaintenanceMode", MetricStatistic.MAX, "Maintenance");
  }

  metricReadLatencyP90InMillis() {
    const readLatency = this.metric(
      "ReadLatency",
      MetricStatistic.P90,
      "Read P90",
    );
    // need to convert seconds to millis
    return this.metricFactory.createMetricMath(
      "readLatency * 1000",
      { readLatency },
      "Read P90",
    );
  }

  metricWriteLatencyP90InMillis() {
    const writeLatency = this.metric(
      "WriteLatency",
      MetricStatistic.P90,
      "Write P90",
    );
    // need to convert seconds to millis
    return this.metricFactory.createMetricMath(
      "writeLatency * 1000",
      { writeLatency },
      "Write P90",
    );
  }

  private metricQueryDuration(
    latency: QueryLatencyClass,
    statistic: MetricStatistic,
  ) {
    const dimensions = { ...this.dimensionsMap, latency };
    return this.metricFactory.createMetric(
      "QueryDuration",
      statistic,
      latency,
      dimensions,
      undefined,
      RedshiftNamespace,
      undefined,
      this.region,
      this.account,
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
      RedshiftNamespace,
      undefined,
      this.region,
      this.account,
    );
  }
}
