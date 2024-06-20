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
    return this.metricFactory.createMetric(
      "glue.ALL.s3.filesystem.read_bytes",
      MetricStatistic.SUM,
      "Read (S3)",
      this.dimensionsMap,
      undefined,
      GlueNamespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricTotalWrittenBytesToS3() {
    return this.metricFactory.createMetric(
      "glue.ALL.s3.filesystem.write_bytes",
      MetricStatistic.SUM,
      "Write (S3)",
      this.dimensionsMap,
      undefined,
      GlueNamespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricAverageExecutorCpuUsagePercentage() {
    const label = "CPU Usage (executor average)";
    const metric = this.metricFactory.createMetric(
      "glue.ALL.system.cpuSystemLoad",
      MetricStatistic.AVERAGE,
      label,
      this.dimensionsMap,
      undefined,
      GlueNamespace,
      undefined,
      this.region,
      this.account,
    );
    return this.metricFactory.multiplyMetric(metric, 100, label, "cpu");
  }

  metricAverageExecutorMemoryUsagePercentage() {
    const label = "JVM Heap usage (executor average)";
    const metric = this.metricFactory.createMetric(
      "glue.ALL.jvm.heap.usage",
      MetricStatistic.AVERAGE,
      label,
      this.dimensionsMap,
      undefined,
      GlueNamespace,
      undefined,
      this.region,
      this.account,
    );
    return this.metricFactory.multiplyMetric(metric, 100, label, "heap");
  }

  metricActiveExecutorsAverage() {
    return this.metricFactory.createMetric(
      "glue.driver.ExecutorAllocationManager.executors.numberAllExecutors",
      MetricStatistic.AVERAGE,
      "Active Executors",
      this.dimensionsMap,
      undefined,
      GlueNamespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricCompletedStagesSum() {
    return this.metricFactory.createMetric(
      "glue.driver.aggregate.numCompletedStages",
      MetricStatistic.SUM,
      "Completed Stages",
      this.typeCountDimensionsMap,
      undefined,
      GlueNamespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricCompletedTasksSum() {
    return this.metricFactory.createMetric(
      "glue.driver.aggregate.numCompletedTasks",
      MetricStatistic.SUM,
      "Completed Tasks",
      this.typeCountDimensionsMap,
      undefined,
      GlueNamespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricFailedTasksSum() {
    return this.metricFactory.createMetric(
      "glue.driver.aggregate.numFailedTasks",
      MetricStatistic.SUM,
      "Failed Tasks",
      this.typeCountDimensionsMap,
      undefined,
      GlueNamespace,
      undefined,
      this.region,
      this.account,
    );
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
    return this.metricFactory.createMetric(
      "glue.driver.aggregate.numKilledTasks",
      MetricStatistic.SUM,
      "Killed Tasks",
      this.typeCountDimensionsMap,
      undefined,
      GlueNamespace,
      undefined,
      this.region,
      this.account,
    );
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
    return this.metricFactory.createMetric(
      "glue.driver.ExecutorAllocationManager.executors.numberMaxNeededExecutors",
      MetricStatistic.MAX,
      "Maximum Needed Executors",
      this.dimensionsMap,
      undefined,
      GlueNamespace,
      undefined,
      this.region,
      this.account,
    );
  }
}
