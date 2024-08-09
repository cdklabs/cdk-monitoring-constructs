import { DimensionsMap } from "aws-cdk-lib/aws-cloudwatch";

import {
  BaseMetricFactory,
  BaseMetricFactoryProps,
  MetricFactory,
  MetricStatistic,
} from "../../common";

export interface KinesisDataAnalyticsMetricFactoryProps
  extends BaseMetricFactoryProps {
  readonly application: string;
}

/**
 * Used internally by this class to ease generating metrics
 */
interface MetricsSpec {
  readonly name: string;
  readonly description: string;
  readonly metricStatistic?: MetricStatistic;
}

/**
 * @see https://docs.aws.amazon.com/kinesisanalytics/latest/java/metrics-dimensions.html
 */
export class KinesisDataAnalyticsMetricFactory extends BaseMetricFactory<KinesisDataAnalyticsMetricFactoryProps> {
  protected readonly dimensionsMap: DimensionsMap;

  constructor(
    metricFactory: MetricFactory,
    props: KinesisDataAnalyticsMetricFactoryProps,
  ) {
    super(metricFactory, props);

    this.dimensionsMap = {
      Application: props.application,
    };
  }

  metricKPUsCount() {
    return this.metric({
      name: "KPUs",
      description: "Kinesis Processing Units",
    });
  }

  metricDowntimeMs() {
    return this.metric({
      name: "downtime",
      description: "Downtime",
    });
  }

  metricUptimeMs() {
    return this.metric({
      name: "uptime",
      description: "Uptime",
    });
  }

  metricFullRestartsCount() {
    return this.metric({
      name: "fullRestarts",
      description: "Restarts",
    });
  }

  metricNumberOfFailedCheckpointsCount() {
    return this.metric({
      name: "numberOfFailedCheckpoints",
      description: "Failed Checkpoints",
      metricStatistic: MetricStatistic.SUM,
    });
  }

  metricLastCheckpointDurationMs() {
    return this.metric({
      name: "lastCheckpointDuration",
      description: "Last Checkpoint Duration",
    });
  }

  metricLastCheckpointSizeBytes() {
    return this.metric({
      name: "lastCheckpointSize",
      description: "Last Checkpoint Size",
      metricStatistic: MetricStatistic.SUM,
    });
  }

  metricCpuUtilizationPercent() {
    return this.metric({
      name: "cpuUtilization",
      description: "CPU Utilization",
    });
  }

  metricHeapMemoryUtilizationPercent() {
    return this.metric({
      name: "heapMemoryUtilization",
      description: "Heap Memory Utilization",
    });
  }

  metricOldGenerationGCTimeMs() {
    return this.metric({
      name: "oldGenerationGCTime",
      description: "GC Time",
    });
  }

  metricOldGenerationGCCount() {
    return this.metric({
      name: "oldGenerationGCCount",
      metricStatistic: MetricStatistic.N,
      description: "GC Count",
    });
  }

  private metric(metricsSpec: MetricsSpec) {
    return this.metricFactory.metric({
      metricName: metricsSpec.name,
      statistic: metricsSpec.metricStatistic ?? MetricStatistic.AVERAGE,
      label: metricsSpec.description,
      dimensionsMap: this.dimensionsMap,
      namespace: "AWS/KinesisAnalytics",
      region: this.region,
      account: this.account,
    });
  }
}
