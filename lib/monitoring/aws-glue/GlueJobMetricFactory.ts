import { DimensionsMap } from "aws-cdk-lib/aws-cloudwatch";

import {
  MetricFactory,
  MetricStatistic,
  RateComputationMethod,
} from "../../common";

const GlueNamespace = "Glue";

export class GlueJobMetricFactory {
  protected readonly metricFactory: MetricFactory;
  protected readonly dimensionsMap: DimensionsMap;

  constructor(metricFactory: MetricFactory, jobName: string) {
    this.metricFactory = metricFactory;
    this.dimensionsMap = {
      Type: "gauge",
      JobRunId: "ALL",
      JobName: jobName,
    };
  }

  metricTotalReadBytesFromS3() {
    return this.metricFactory.createMetric(
      "glue.ALL.s3.filesystem.read_bytes",
      MetricStatistic.SUM,
      "Read (S3)",
      this.dimensionsMap,
      undefined,
      GlueNamespace
    );
  }

  metricTotalWrittenBytesToS3() {
    return this.metricFactory.createMetric(
      "glue.ALL.s3.filesystem.write_bytes",
      MetricStatistic.SUM,
      "Write (S3)",
      this.dimensionsMap,
      undefined,
      GlueNamespace
    );
  }

  metricAverageExecutorCpuUsagePercentage() {
    return this.metricFactory.createMetric(
      "glue.ALL.system.cpuSystemLoad",
      MetricStatistic.AVERAGE,
      "CPU Usage (executor average)",
      this.dimensionsMap,
      undefined,
      GlueNamespace
    );
  }

  metricAverageExecutorMemoryUsagePercentage() {
    return this.metricFactory.createMetric(
      "glue.ALL.jvm.heap.usage",
      MetricStatistic.AVERAGE,
      "JVM Heap usage (executor average)",
      this.dimensionsMap,
      undefined,
      GlueNamespace
    );
  }

  metricActiveExecutorsAverage() {
    return this.metricFactory.createMetric(
      "glue.driver.ExecutorAllocationManager.executors.numberAllExecutors",
      MetricStatistic.AVERAGE,
      "Active Executors",
      this.dimensionsMap,
      undefined,
      GlueNamespace
    );
  }

  metricCompletedStagesSum() {
    return this.metricFactory.createMetric(
      "glue.driver.aggregate.numCompletedStages",
      MetricStatistic.SUM,
      "Completed Stages",
      this.dimensionsMap,
      undefined,
      GlueNamespace
    );
  }

  metricCompletedTasksSum() {
    return this.metricFactory.createMetric(
      "glue.driver.aggregate.numCompletedTasks",
      MetricStatistic.SUM,
      "Completed Tasks",
      this.dimensionsMap,
      undefined,
      GlueNamespace
    );
  }

  metricFailedTasksSum() {
    return this.metricFactory.createMetric(
      "glue.driver.aggregate.numFailedTasks",
      MetricStatistic.SUM,
      "Failed Tasks",
      this.dimensionsMap,
      undefined,
      GlueNamespace
    );
  }

  metricFailedTasksRate() {
    return this.metricFactory.toRate(
      this.metricFailedTasksSum(),
      RateComputationMethod.AVERAGE,
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
      this.dimensionsMap,
      undefined,
      GlueNamespace
    );
  }

  metricKilledTasksRate() {
    return this.metricFactory.toRate(
      this.metricKilledTasksSum(),
      RateComputationMethod.AVERAGE,
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
      this.dimensionsMap,
      undefined,
      GlueNamespace
    );
  }
}
