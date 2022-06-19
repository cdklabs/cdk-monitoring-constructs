import { DimensionsMap } from "aws-cdk-lib/aws-cloudwatch";

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
  protected readonly rateComputationMethod: RateComputationMethod;
  protected readonly dimensionsMap: DimensionsMap;

  constructor(metricFactory: MetricFactory, props: GlueJobMetricFactoryProps) {
    this.metricFactory = metricFactory;
    this.rateComputationMethod =
      props.rateComputationMethod ?? RateComputationMethod.AVERAGE;
    this.dimensionsMap = {
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
    const label = "CPU Usage (executor average)";
    const metric = this.metricFactory.createMetric(
      "glue.ALL.system.cpuSystemLoad",
      MetricStatistic.AVERAGE,
      label,
      this.dimensionsMap,
      undefined,
      GlueNamespace
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
      GlueNamespace
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
      this.dimensionsMap,
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
      this.dimensionsMap,
      undefined,
      GlueNamespace
    );
  }
}
