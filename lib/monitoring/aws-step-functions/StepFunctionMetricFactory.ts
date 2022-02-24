import { DimensionHash } from "monocdk/aws-cloudwatch";
import { IStateMachine } from "monocdk/aws-stepfunctions";

import {
  MetricFactory,
  MetricStatistic,
  RateComputationMethod,
} from "../../common";

const Namespace = "AWS/States";

export interface StepFunctionMetricFactoryProps {
  readonly stateMachine: IStateMachine;
  /**
   * @default average
   */
  readonly rateComputationMethod?: RateComputationMethod;
}

export class StepFunctionMetricFactory {
  protected readonly metricFactory: MetricFactory;
  protected readonly rateComputationMethod: RateComputationMethod;
  protected readonly dimensions: DimensionHash;

  constructor(
    metricFactory: MetricFactory,
    props: StepFunctionMetricFactoryProps
  ) {
    this.metricFactory = metricFactory;
    this.rateComputationMethod = RateComputationMethod.AVERAGE;
    this.dimensions = {
      StateMachineArn: props.stateMachine.stateMachineArn,
    };
  }

  metricExecutionTimeP99InMillis() {
    return this.metricFactory.createMetric(
      "ExecutionTime",
      MetricStatistic.P99,
      "P99",
      this.dimensions,
      undefined,
      Namespace
    );
  }

  metricExecutionTimeP90InMillis() {
    return this.metricFactory.createMetric(
      "ExecutionTime",
      MetricStatistic.P90,
      "P90",
      this.dimensions,
      undefined,
      Namespace
    );
  }

  metricExecutionTimeP50InMillis() {
    return this.metricFactory.createMetric(
      "ExecutionTime",
      MetricStatistic.P50,
      "P50",
      this.dimensions,
      undefined,
      Namespace
    );
  }

  metricExecutionsFailed() {
    return this.metricFactory.createMetric(
      "ExecutionsFailed",
      MetricStatistic.SUM,
      "Failed",
      this.dimensions,
      undefined,
      Namespace
    );
  }

  metricExecutionsFailedRate() {
    const metric = this.metricExecutionsFailed();
    return this.metricFactory.toRate(
      metric,
      this.rateComputationMethod,
      false,
      "faults"
    );
  }

  metricExecutionsTimedOut() {
    return this.metricFactory.createMetric(
      "ExecutionsTimedOut",
      MetricStatistic.SUM,
      "Timeout",
      this.dimensions,
      undefined,
      Namespace
    );
  }

  metricExecutionThrottled() {
    return this.metricFactory.createMetric(
      "ExecutionThrottled",
      MetricStatistic.SUM,
      "Throttled",
      this.dimensions,
      undefined,
      Namespace
    );
  }

  metricExecutionsAborted() {
    return this.metricFactory.createMetric(
      "ExecutionsAborted",
      MetricStatistic.SUM,
      "Aborted",
      this.dimensions,
      undefined,
      Namespace
    );
  }

  metricExecutionsStarted() {
    return this.metricFactory.createMetric(
      "ExecutionsStarted",
      MetricStatistic.SUM,
      "Started",
      this.dimensions,
      undefined,
      Namespace
    );
  }

  metricExecutionsSucceeded() {
    return this.metricFactory.createMetric(
      "ExecutionsSucceeded",
      MetricStatistic.SUM,
      "Succeeded",
      this.dimensions,
      undefined,
      Namespace
    );
  }
}
