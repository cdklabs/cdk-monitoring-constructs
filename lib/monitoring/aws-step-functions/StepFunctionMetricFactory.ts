import { DimensionsMap } from "aws-cdk-lib/aws-cloudwatch";
import { IStateMachine } from "aws-cdk-lib/aws-stepfunctions";

import {
  BaseMetricFactory,
  BaseMetricFactoryProps,
  MetricFactory,
  MetricStatistic,
  RateComputationMethod,
} from "../../common";

const Namespace = "AWS/States";

export interface StepFunctionMetricFactoryProps extends BaseMetricFactoryProps {
  readonly stateMachine: IStateMachine;
  /**
   * @default - average
   */
  readonly rateComputationMethod?: RateComputationMethod;
}

export class StepFunctionMetricFactory extends BaseMetricFactory<StepFunctionMetricFactoryProps> {
  protected readonly rateComputationMethod: RateComputationMethod;
  protected readonly dimensionsMap: DimensionsMap;

  constructor(
    metricFactory: MetricFactory,
    props: StepFunctionMetricFactoryProps,
  ) {
    super(metricFactory, props);

    this.rateComputationMethod = RateComputationMethod.AVERAGE;
    this.dimensionsMap = {
      StateMachineArn: props.stateMachine.stateMachineArn,
    };
  }

  metricExecutionTimeP99InMillis() {
    return this.metricFactory.metric({
      metricName: "ExecutionTime",
      statistic: MetricStatistic.P99,
      label: "P99",
      dimensionsMap: this.dimensionsMap,
      namespace: Namespace,
      region: this.region,
      account: this.account,
    });
  }

  metricExecutionTimeP90InMillis() {
    return this.metricFactory.metric({
      metricName: "ExecutionTime",
      statistic: MetricStatistic.P90,
      label: "P90",
      dimensionsMap: this.dimensionsMap,
      namespace: Namespace,
      region: this.region,
      account: this.account,
    });
  }

  metricExecutionTimeP50InMillis() {
    return this.metricFactory.metric({
      metricName: "ExecutionTime",
      statistic: MetricStatistic.P50,
      label: "P50",
      dimensionsMap: this.dimensionsMap,
      namespace: Namespace,
      region: this.region,
      account: this.account,
    });
  }

  metricExecutionsFailed() {
    return this.metricFactory.metric({
      metricName: "ExecutionsFailed",
      statistic: MetricStatistic.SUM,
      label: "Failed",
      dimensionsMap: this.dimensionsMap,
      namespace: Namespace,
      region: this.region,
      account: this.account,
    });
  }

  metricExecutionsFailedRate() {
    return this.metricFactory.toRate(
      this.metricExecutionsFailed(),
      this.rateComputationMethod,
      false,
      "faults",
    );
  }

  metricExecutionsTimedOut() {
    return this.metricFactory.metric({
      metricName: "ExecutionsTimedOut",
      statistic: MetricStatistic.SUM,
      label: "Timeout",
      dimensionsMap: this.dimensionsMap,
      namespace: Namespace,
      region: this.region,
      account: this.account,
    });
  }

  metricExecutionThrottled() {
    return this.metricFactory.metric({
      metricName: "ExecutionThrottled",
      statistic: MetricStatistic.SUM,
      label: "Throttled",
      dimensionsMap: this.dimensionsMap,
      namespace: Namespace,
      region: this.region,
      account: this.account,
    });
  }

  metricExecutionsAborted() {
    return this.metricFactory.metric({
      metricName: "ExecutionsAborted",
      statistic: MetricStatistic.SUM,
      label: "Aborted",
      dimensionsMap: this.dimensionsMap,
      namespace: Namespace,
      region: this.region,
      account: this.account,
    });
  }

  metricExecutionsStarted() {
    return this.metricFactory.metric({
      metricName: "ExecutionsStarted",
      statistic: MetricStatistic.SUM,
      label: "Started",
      dimensionsMap: this.dimensionsMap,
      namespace: Namespace,
      region: this.region,
      account: this.account,
    });
  }

  metricExecutionsSucceeded() {
    return this.metricFactory.metric({
      metricName: "ExecutionsSucceeded",
      statistic: MetricStatistic.SUM,
      label: "Succeeded",
      dimensionsMap: this.dimensionsMap,
      namespace: Namespace,
      region: this.region,
      account: this.account,
    });
  }
}
