import { DimensionHash } from "monocdk/aws-cloudwatch";

import {
  MetricFactory,
  MetricStatistic,
  RateComputationMethod,
} from "../../common";

const GlueNamespace = "Glue";

export interface GlueJobMetricFactoryProps {
  readonly jobName: string;
  /**
   * @default average
   */
  readonly rateComputationMethod?: RateComputationMethod;
}

export class GlueJobMetricFactory {
  protected readonly metricFactory: MetricFactory;
  protected readonly dimensions: DimensionHash;
  protected readonly rateComputationMethod: RateComputationMethod;

  constructor(metricFactory: MetricFactory, props: GlueJobMetricFactoryProps) {
    this.metricFactory = metricFactory;
    this.rateComputationMethod =
      props.rateComputationMethod ?? RateComputationMethod.AVERAGE;
    this.dimensions = {
      Type: "gauge",
      JobRunId: "ALL",
      JobName: props.jobName,
    };
  }

  metricTotalReadBytesFromS3() {
    return this.metricFactory.createMetric(
      "glue.ALL.s3.filesystem.read_bytes",
      MetricStatistic.SUM,
      "Read (S3)",
      this.dimensions,
      undefined,
      GlueNamespace
    );
  }

  metricTotalWrittenBytesToS3() {
    return this.metricFactory.createMetric(
      "glue.ALL.s3.filesystem.write_bytes",
      MetricStatistic.SUM,
      "Write (S3)",
      this.dimensions,
      undefined,
      GlueNamespace
    );
  }

  metricAverageExecutorCpuUsagePercentage() {
    return this.metricFactory.createMetric(
      "glue.ALL.system.cpuSystemLoad",
      MetricStatistic.AVERAGE,
      "CPU Usage (executor average)",
      this.dimensions,
      undefined,
      GlueNamespace
    );
  }

  metricAverageExecutorMemoryUsagePercentage() {
    return this.metricFactory.createMetric(
      "glue.ALL.jvm.heap.usage",
      MetricStatistic.AVERAGE,
      "JVM Heap usage (executor average)",
      this.dimensions,
      undefined,
      GlueNamespace
    );
  }

  metricActiveExecutorsAverage() {
    return this.metricFactory.createMetric(
      "glue.driver.ExecutorAllocationManager.executors.numberAllExecutors",
      MetricStatistic.AVERAGE,
      "Active Executors",
      this.dimensions,
      undefined,
      GlueNamespace
    );
  }

  metricCompletedStagesSum() {
    return this.metricFactory.createMetric(
      "glue.driver.aggregate.numCompletedStages",
      MetricStatistic.SUM,
      "Completed Stages",
      this.dimensions,
      undefined,
      GlueNamespace
    );
  }

  metricCompletedTasksSum() {
    return this.metricFactory.createMetric(
      "glue.driver.aggregate.numCompletedTasks",
      MetricStatistic.SUM,
      "Completed Tasks",
      this.dimensions,
      undefined,
      GlueNamespace
    );
  }

  metricFailedTasksSum() {
    return this.metricFactory.createMetric(
      "glue.driver.aggregate.numFailedTasks",
      MetricStatistic.SUM,
      "Failed Tasks",
      this.dimensions,
      undefined,
      GlueNamespace
    );
  }

  metricFailedTasksRate() {
    return this.metricFactory.toRate(
      this.metricFailedTasksSum(),
      this.rateComputationMethod,
      true,
      "killed",
      false
    );
  }

  metricKilledTasksSum() {
    return this.metricFactory.createMetric(
      "glue.driver.aggregate.numKilledTasks",
      MetricStatistic.SUM,
      "Killed Tasks",
      this.dimensions,
      undefined,
      GlueNamespace
    );
  }

  metricKilledTasksRate() {
    return this.metricFactory.toRate(
      this.metricKilledTasksSum(),
      this.rateComputationMethod,
      true,
      "killed",
      false
    );
  }

  metricMaximumNeededExecutors() {
    return this.metricFactory.createMetric(
      "glue.driver.ExecutorAllocationManager.executors.numberMaxNeededExecutors",
      MetricStatistic.MAX,
      "Maximum Needed Executors",
      this.dimensions,
      undefined,
      GlueNamespace
    );
  }
}
