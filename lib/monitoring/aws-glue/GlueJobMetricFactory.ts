import { DimensionsMap } from "aws-cdk-lib/aws-cloudwatch";

import {
  BaseMetricFactory,
  BaseMetricFactoryProps,
  MetricFactory,
  MetricStatistic,
  RateComputationMethod,
} from "../../common";

const GlueNamespace = "Glue";

export interface GlueJobMetricFactoryProps extends BaseMetricFactoryProps {
  readonly jobName: string;
  /**
   * @default - average
   */
  readonly rateComputationMethod?: RateComputationMethod;
}

export class GlueJobMetricFactory extends BaseMetricFactory<GlueJobMetricFactoryProps> {
  protected readonly rateComputationMethod: RateComputationMethod;
  protected readonly dimensionsMap: DimensionsMap;
  protected readonly typeCountDimensionsMap: DimensionsMap;

  constructor(metricFactory: MetricFactory, props: GlueJobMetricFactoryProps) {
    super(metricFactory, props);

    this.rateComputationMethod =
      props.rateComputationMethod ?? RateComputationMethod.AVERAGE;
    this.dimensionsMap = {
      Type: "gauge",
      JobRunId: "ALL",
      JobName: props.jobName,
    };
    this.typeCountDimensionsMap = {
      ...this.dimensionsMap,
      Type: "count",
    };
  }

  metricTotalReadBytesFromS3() {
    return this.metricFactory.metric({
      metricName: "glue.ALL.s3.filesystem.read_bytes",
      statistic: MetricStatistic.SUM,
      label: "Read (S3)",
      dimensionsMap: this.dimensionsMap,
      namespace: GlueNamespace,
      region: this.region,
      account: this.account,
    });
  }

  metricTotalWrittenBytesToS3() {
    return this.metricFactory.metric({
      metricName: "glue.ALL.s3.filesystem.write_bytes",
      statistic: MetricStatistic.SUM,
      label: "Write (S3)",
      dimensionsMap: this.dimensionsMap,
      namespace: GlueNamespace,
      region: this.region,
      account: this.account,
    });
  }

  metricAverageExecutorCpuUsagePercentage() {
    const label = "CPU Usage (executor average)";
    const metric = this.metricFactory.metric({
      metricName: "glue.ALL.system.cpuSystemLoad",
      statistic: MetricStatistic.AVERAGE,
      label: label,
      dimensionsMap: this.dimensionsMap,
      namespace: GlueNamespace,
      region: this.region,
      account: this.account,
    });
    return this.metricFactory.multiplyMetric(metric, 100, label, "cpu");
  }

  metricAverageExecutorMemoryUsagePercentage() {
    const label = "JVM Heap usage (executor average)";
    const metric = this.metricFactory.metric({
      metricName: "glue.ALL.jvm.heap.usage",
      statistic: MetricStatistic.AVERAGE,
      label: label,
      dimensionsMap: this.dimensionsMap,
      namespace: GlueNamespace,
      region: this.region,
      account: this.account,
    });
    return this.metricFactory.multiplyMetric(metric, 100, label, "heap");
  }

  metricActiveExecutorsAverage() {
    return this.metricFactory.metric({
      metricName:
        "glue.driver.ExecutorAllocationManager.executors.numberAllExecutors",
      statistic: MetricStatistic.AVERAGE,
      label: "Active Executors",
      dimensionsMap: this.dimensionsMap,
      namespace: GlueNamespace,
      region: this.region,
      account: this.account,
    });
  }

  metricCompletedStagesSum() {
    return this.metricFactory.metric({
      metricName: "glue.driver.aggregate.numCompletedStages",
      statistic: MetricStatistic.SUM,
      label: "Completed Stages",
      dimensionsMap: this.typeCountDimensionsMap,
      namespace: GlueNamespace,
      region: this.region,
      account: this.account,
    });
  }

  metricCompletedTasksSum() {
    return this.metricFactory.metric({
      metricName: "glue.driver.aggregate.numCompletedTasks",
      statistic: MetricStatistic.SUM,
      label: "Completed Tasks",
      dimensionsMap: this.typeCountDimensionsMap,
      namespace: GlueNamespace,
      region: this.region,
      account: this.account,
    });
  }

  metricFailedTasksSum() {
    return this.metricFactory.metric({
      metricName: "glue.driver.aggregate.numFailedTasks",
      statistic: MetricStatistic.SUM,
      label: "Failed Tasks",
      dimensionsMap: this.typeCountDimensionsMap,
      namespace: GlueNamespace,
      region: this.region,
      account: this.account,
    });
  }

  metricFailedTasksRate() {
    return this.metricFactory.toRate(
      this.metricFailedTasksSum(),
      this.rateComputationMethod,
      true,
      "failed",
      false,
    );
  }

  metricKilledTasksSum() {
    return this.metricFactory.metric({
      metricName: "glue.driver.aggregate.numKilledTasks",
      statistic: MetricStatistic.SUM,
      label: "Killed Tasks",
      dimensionsMap: this.typeCountDimensionsMap,
      namespace: GlueNamespace,
      region: this.region,
      account: this.account,
    });
  }

  metricKilledTasksRate() {
    return this.metricFactory.toRate(
      this.metricKilledTasksSum(),
      this.rateComputationMethod,
      true,
      "killed",
      false,
    );
  }

  metricMaximumNeededExecutors() {
    return this.metricFactory.metric({
      metricName:
        "glue.driver.ExecutorAllocationManager.executors.numberMaxNeededExecutors",
      statistic: MetricStatistic.MAX,
      label: "Maximum Needed Executors",
      dimensionsMap: this.dimensionsMap,
      namespace: GlueNamespace,
      region: this.region,
      account: this.account,
    });
  }
}
