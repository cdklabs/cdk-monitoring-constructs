import { DimensionsMap } from "aws-cdk-lib/aws-cloudwatch";
import { IFunction } from "aws-cdk-lib/aws-lambda";

import {
  BaseMetricFactory,
  BaseMetricFactoryProps,
  MetricFactory,
  MetricStatistic,
  RateComputationMethod,
} from "../../common";

const Namespace = "AWS/States";

export interface StepFunctionLambdaIntegrationMetricFactoryProps
  extends BaseMetricFactoryProps {
  readonly lambdaFunction: IFunction;
  /**
   * @default - average
   */
  readonly rateComputationMethod?: RateComputationMethod;
}

export class StepFunctionLambdaIntegrationMetricFactory extends BaseMetricFactory {
  protected readonly rateComputationMethod: RateComputationMethod;
  protected readonly dimensionsMap: DimensionsMap;

  constructor(
    metricFactory: MetricFactory,
    props: StepFunctionLambdaIntegrationMetricFactoryProps,
  ) {
    super(metricFactory, props);

    this.rateComputationMethod = RateComputationMethod.AVERAGE;
    this.dimensionsMap = {
      LambdaFunctionArn: props.lambdaFunction.functionArn,
    };
  }

  metricFunctionRunTimeP99InMillis() {
    return this.metricFactory.createMetric(
      "LambdaFunctionRunTime",
      MetricStatistic.P99,
      "P99",
      this.dimensionsMap,
      undefined,
      Namespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricFunctionRunTimeP90InMillis() {
    return this.metricFactory.createMetric(
      "LambdaFunctionRunTime",
      MetricStatistic.P90,
      "P90",
      this.dimensionsMap,
      undefined,
      Namespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricFunctionRunTimeP50InMillis() {
    return this.metricFactory.createMetric(
      "LambdaFunctionRunTime",
      MetricStatistic.P50,
      "P50",
      this.dimensionsMap,
      undefined,
      Namespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricFunctionScheduleTimeP99InMillis() {
    return this.metricFactory.createMetric(
      "LambdaFunctionScheduleTime",
      MetricStatistic.P99,
      "P99",
      this.dimensionsMap,
      undefined,
      Namespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricFunctionScheduleTimeP90InMillis() {
    return this.metricFactory.createMetric(
      "LambdaFunctionScheduleTime",
      MetricStatistic.P90,
      "P90",
      this.dimensionsMap,
      undefined,
      Namespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricFunctionScheduleTimeP50InMillis() {
    return this.metricFactory.createMetric(
      "LambdaFunctionScheduleTime",
      MetricStatistic.P50,
      "P50",
      this.dimensionsMap,
      undefined,
      Namespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricFunctionTimeP99InMillis() {
    return this.metricFactory.createMetric(
      "LambdaFunctionTime",
      MetricStatistic.P99,
      "P99",
      this.dimensionsMap,
      undefined,
      Namespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricFunctionTimeP90InMillis() {
    return this.metricFactory.createMetric(
      "LambdaFunctionTime",
      MetricStatistic.P90,
      "P90",
      this.dimensionsMap,
      undefined,
      Namespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricFunctionTimeP50InMillis() {
    return this.metricFactory.createMetric(
      "LambdaFunctionTime",
      MetricStatistic.P50,
      "P50",
      this.dimensionsMap,
      undefined,
      Namespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricFunctionsFailed() {
    return this.metricFactory.createMetric(
      "LambdaFunctionsFailed",
      MetricStatistic.SUM,
      "Failed",
      this.dimensionsMap,
      undefined,
      Namespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricFunctionsFailedRate() {
    return this.metricFactory.toRate(
      this.metricFunctionsFailed(),
      this.rateComputationMethod,
      false,
      "faults",
    );
  }

  metricFunctionsScheduled() {
    return this.metricFactory.createMetric(
      "LambdaFunctionsScheduled",
      MetricStatistic.SUM,
      "Scheduled",
      this.dimensionsMap,
      undefined,
      Namespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricFunctionsStarted() {
    return this.metricFactory.createMetric(
      "LambdaFunctionsStarted",
      MetricStatistic.SUM,
      "Started",
      this.dimensionsMap,
      undefined,
      Namespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricFunctionsSucceeded() {
    return this.metricFactory.createMetric(
      "LambdaFunctionsSucceeded",
      MetricStatistic.SUM,
      "Succeeded",
      this.dimensionsMap,
      undefined,
      Namespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricFunctionsTimedOut() {
    return this.metricFactory.createMetric(
      "LambdaFunctionsTimedOut",
      MetricStatistic.SUM,
      "Timeout",
      this.dimensionsMap,
      undefined,
      Namespace,
      undefined,
      this.region,
      this.account,
    );
  }
}
