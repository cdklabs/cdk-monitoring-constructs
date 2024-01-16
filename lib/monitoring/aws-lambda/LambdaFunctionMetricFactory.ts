import { IFunction } from "aws-cdk-lib/aws-lambda";

import {
  LatencyType,
  MetricFactory,
  MetricStatistic,
  RateComputationMethod,
  getLatencyTypeLabel,
  getLatencyTypeStatistic,
} from "../../common";

export interface LambdaFunctionMetricFactoryProps {
  readonly lambdaFunction: IFunction;
  /**
   * @default - true
   */
  readonly fillTpsWithZeroes?: boolean;
  /**
   * @default - average
   */
  readonly rateComputationMethod?: RateComputationMethod;
  /**
   * Generate dashboard charts for Lambda Insights metrics.
   *
   * To enable Lambda Insights on your Lambda function, see
   * https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Lambda-Insights-Getting-Started-clouddevelopmentkit.html
   *
   * @default - false
   */
  readonly lambdaInsightsEnabled?: boolean;
}

export class LambdaFunctionMetricFactory {
  protected readonly metricFactory: MetricFactory;
  protected readonly lambdaFunction: IFunction;
  protected readonly fillTpsWithZeroes: boolean;
  protected readonly rateComputationMethod: RateComputationMethod;

  constructor(
    metricFactory: MetricFactory,
    props: LambdaFunctionMetricFactoryProps
  ) {
    this.metricFactory = metricFactory;
    this.lambdaFunction = props.lambdaFunction;
    this.fillTpsWithZeroes = props.fillTpsWithZeroes ?? true;
    this.rateComputationMethod =
      props.rateComputationMethod ?? RateComputationMethod.AVERAGE;
  }

  /**
   * @deprecated Use {@link metricInvocationRate} instead.
   */
  metricTps() {
    return this.metricFactory.toRate(
      this.metricInvocationCount(),
      RateComputationMethod.PER_SECOND,
      false,
      "requests",
      this.fillTpsWithZeroes
    );
  }

  metricInvocationRate() {
    return this.metricFactory.toRate(
      this.metricInvocationCount(),
      this.rateComputationMethod,
      false,
      "requests",
      this.fillTpsWithZeroes
    );
  }

  metricInvocationCount() {
    return this.metricFactory.adaptMetric(
      this.lambdaFunction.metricInvocations({
        label: "Invocations",
      })
    );
  }

  metricThrottlesCount() {
    return this.metricFactory.adaptMetric(
      this.lambdaFunction.metricThrottles({
        label: "Throttles",
      })
    );
  }

  metricThrottlesRate() {
    const metric = this.metricThrottlesCount();
    return this.metricFactory.toRate(
      metric,
      this.rateComputationMethod,
      false,
      "throttles"
    );
  }

  metricFaultCount() {
    return this.metricFactory.adaptMetric(
      this.lambdaFunction.metricErrors({
        label: "Faults",
      })
    );
  }

  metricFaultRate() {
    const metric = this.metricFaultCount();
    return this.metricFactory.toRate(
      metric,
      this.rateComputationMethod,
      false,
      "faults"
    );
  }

  metricLatencyInMillis(latencyType: LatencyType) {
    return this.metricFactory.adaptMetric(
      this.lambdaFunction.metricDuration({
        statistic: getLatencyTypeStatistic(latencyType),
        label: getLatencyTypeLabel(latencyType),
      })
    );
  }

  /**
   * @deprecated Use {@link metricLatencyInMillis} instead.
   */
  metricLatencyP99InMillis() {
    return this.metricLatencyInMillis(LatencyType.P99);
  }

  /**
   * @deprecated Use {@link metricLatencyInMillis} instead.
   */
  metricLatencyP90InMillis() {
    return this.metricLatencyInMillis(LatencyType.P90);
  }

  /**
   * @deprecated Use {@link metricLatencyInMillis} instead.
   */
  metricLatencyP50InMillis() {
    return this.metricLatencyInMillis(LatencyType.P50);
  }

  metricConcurrentExecutions() {
    return this.metricFactory.adaptMetric(
      this.lambdaFunction.metric("ConcurrentExecutions", {
        statistic: MetricStatistic.MAX,
        label: "Concurrent",
      })
    );
  }

  metricProvisionedConcurrencySpilloverInvocations() {
    return this.metricFactory.adaptMetric(
      this.lambdaFunction.metric("ProvisionedConcurrencySpilloverInvocations", {
        statistic: MetricStatistic.SUM,
        label: "Provisioned Concurrency Spillovers",
      })
    );
  }

  metricProvisionedConcurrencySpilloverRate() {
    const metric = this.metricProvisionedConcurrencySpilloverInvocations();
    return this.metricFactory.toRate(
      metric,
      this.rateComputationMethod,
      false,
      "pcsi"
    );
  }

  metricMaxIteratorAgeInMillis() {
    return this.metricFactory.adaptMetric(
      this.lambdaFunction.metric("IteratorAge", {
        statistic: MetricStatistic.MAX,
        label: "Iterator Age",
      })
    );
  }
}
