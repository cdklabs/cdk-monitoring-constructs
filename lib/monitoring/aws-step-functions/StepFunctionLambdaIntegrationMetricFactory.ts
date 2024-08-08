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

export class StepFunctionLambdaIntegrationMetricFactory extends BaseMetricFactory<StepFunctionLambdaIntegrationMetricFactoryProps> {
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
    return this.metricFactory.metric({
      metricName: "LambdaFunctionRunTime",
      statistic: MetricStatistic.P99,
      label: "P99",
      dimensionsMap: this.dimensionsMap,
      namespace: Namespace,
      region: this.region,
      account: this.account,
    });
  }

  metricFunctionRunTimeP90InMillis() {
    return this.metricFactory.metric({
      metricName: "LambdaFunctionRunTime",
      statistic: MetricStatistic.P90,
      label: "P90",
      dimensionsMap: this.dimensionsMap,
      namespace: Namespace,
      region: this.region,
      account: this.account,
    });
  }

  metricFunctionRunTimeP50InMillis() {
    return this.metricFactory.metric({
      metricName: "LambdaFunctionRunTime",
      statistic: MetricStatistic.P50,
      label: "P50",
      dimensionsMap: this.dimensionsMap,
      namespace: Namespace,
      region: this.region,
      account: this.account,
    });
  }

  metricFunctionScheduleTimeP99InMillis() {
    return this.metricFactory.metric({
      metricName: "LambdaFunctionScheduleTime",
      statistic: MetricStatistic.P99,
      label: "P99",
      dimensionsMap: this.dimensionsMap,
      namespace: Namespace,
      region: this.region,
      account: this.account,
    });
  }

  metricFunctionScheduleTimeP90InMillis() {
    return this.metricFactory.metric({
      metricName: "LambdaFunctionScheduleTime",
      statistic: MetricStatistic.P90,
      label: "P90",
      dimensionsMap: this.dimensionsMap,
      namespace: Namespace,
      region: this.region,
      account: this.account,
    });
  }

  metricFunctionScheduleTimeP50InMillis() {
    return this.metricFactory.metric({
      metricName: "LambdaFunctionScheduleTime",
      statistic: MetricStatistic.P50,
      label: "P50",
      dimensionsMap: this.dimensionsMap,
      namespace: Namespace,
      region: this.region,
      account: this.account,
    });
  }

  metricFunctionTimeP99InMillis() {
    return this.metricFactory.metric({
      metricName: "LambdaFunctionTime",
      statistic: MetricStatistic.P99,
      label: "P99",
      dimensionsMap: this.dimensionsMap,
      namespace: Namespace,
      region: this.region,
      account: this.account,
    });
  }

  metricFunctionTimeP90InMillis() {
    return this.metricFactory.metric({
      metricName: "LambdaFunctionTime",
      statistic: MetricStatistic.P90,
      label: "P90",
      dimensionsMap: this.dimensionsMap,
      namespace: Namespace,
      region: this.region,
      account: this.account,
    });
  }

  metricFunctionTimeP50InMillis() {
    return this.metricFactory.metric({
      metricName: "LambdaFunctionTime",
      statistic: MetricStatistic.P50,
      label: "P50",
      dimensionsMap: this.dimensionsMap,
      namespace: Namespace,
      region: this.region,
      account: this.account,
    });
  }

  metricFunctionsFailed() {
    return this.metricFactory.metric({
      metricName: "LambdaFunctionsFailed",
      statistic: MetricStatistic.SUM,
      label: "Failed",
      dimensionsMap: this.dimensionsMap,
      namespace: Namespace,
      region: this.region,
      account: this.account,
    });
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
    return this.metricFactory.metric({
      metricName: "LambdaFunctionsScheduled",
      statistic: MetricStatistic.SUM,
      label: "Scheduled",
      dimensionsMap: this.dimensionsMap,
      namespace: Namespace,
      region: this.region,
      account: this.account,
    });
  }

  metricFunctionsStarted() {
    return this.metricFactory.metric({
      metricName: "LambdaFunctionsStarted",
      statistic: MetricStatistic.SUM,
      label: "Started",
      dimensionsMap: this.dimensionsMap,
      namespace: Namespace,
      region: this.region,
      account: this.account,
    });
  }

  metricFunctionsSucceeded() {
    return this.metricFactory.metric({
      metricName: "LambdaFunctionsSucceeded",
      statistic: MetricStatistic.SUM,
      label: "Succeeded",
      dimensionsMap: this.dimensionsMap,
      namespace: Namespace,
      region: this.region,
      account: this.account,
    });
  }

  metricFunctionsTimedOut() {
    return this.metricFactory.metric({
      metricName: "LambdaFunctionsTimedOut",
      statistic: MetricStatistic.SUM,
      label: "Timeout",
      dimensionsMap: this.dimensionsMap,
      namespace: Namespace,
      region: this.region,
      account: this.account,
    });
  }
}
