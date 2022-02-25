import { DimensionHash } from "monocdk/aws-cloudwatch";

import { MetricFactory, MetricStatistic } from "../../common";

const GlueNamespace = "Glue";

export class GlueJobMetricFactory {
  protected readonly metricFactory: MetricFactory;
  protected readonly dimensions: DimensionHash;

  constructor(metricFactory: MetricFactory, jobName: string) {
    this.metricFactory = metricFactory;
    this.dimensions = {
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
