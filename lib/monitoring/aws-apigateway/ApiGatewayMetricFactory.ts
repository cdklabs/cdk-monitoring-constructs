import { IRestApi } from "aws-cdk-lib/aws-apigateway";
import { DimensionsMap } from "aws-cdk-lib/aws-cloudwatch";

import {
  BaseMetricFactory,
  BaseMetricFactoryProps,
  getLatencyTypeLabel,
  getLatencyTypeStatistic,
  LatencyType,
  MetricFactory,
  MetricStatistic,
  RateComputationMethod,
} from "../../common";

const ApiGatewayNamespace = "AWS/ApiGateway";

export interface ApiGatewayMetricFactoryProps extends BaseMetricFactoryProps {
  /**
   * API to monitor
   */
  readonly api: IRestApi;
  /**
   * @default - prod
   */
  readonly apiStage?: string;
  /**
   * On undefined value is not set in dimensions
   */
  readonly apiMethod?: string;
  /**
   * On undefined value is not set in dimensions
   */
  readonly apiResource?: string;
  /**
   * @default - true
   */
  readonly fillTpsWithZeroes?: boolean;
  /**
   * @default - average
   */
  readonly rateComputationMethod?: RateComputationMethod;
}

export class ApiGatewayMetricFactory extends BaseMetricFactory<ApiGatewayMetricFactoryProps> {
  protected readonly fillTpsWithZeroes: boolean;
  protected readonly rateComputationMethod: RateComputationMethod;
  protected readonly dimensionsMap: DimensionsMap;

  constructor(
    metricFactory: MetricFactory,
    props: ApiGatewayMetricFactoryProps,
  ) {
    super(metricFactory, props);

    this.fillTpsWithZeroes = props.fillTpsWithZeroes ?? true;
    this.rateComputationMethod =
      props.rateComputationMethod ?? RateComputationMethod.AVERAGE;
    this.dimensionsMap = {
      ApiName: props.api.restApiName,
      Stage: props.apiStage ?? "prod",
      ...(props.apiMethod && { Method: props.apiMethod }),
      ...(props.apiResource && { Resource: props.apiResource }),
    };
  }

  /**
   * @deprecated use metricInvocationRate
   */
  metricTps() {
    return this.metricFactory.toRate(
      this.metricInvocationCount(),
      RateComputationMethod.PER_SECOND,
      false,
      "requests",
      this.fillTpsWithZeroes,
    );
  }

  metricInvocationRate() {
    return this.metricFactory.toRate(
      this.metricInvocationCount(),
      this.rateComputationMethod,
      false,
      "requests",
      this.fillTpsWithZeroes,
    );
  }

  metricInvocationCount() {
    return this.metricFactory.metric({
      metricName: "Count",
      statistic: MetricStatistic.SUM,
      label: "Count",
      dimensionsMap: this.dimensionsMap,
      namespace: ApiGatewayNamespace,
      region: this.region,
      account: this.account,
    });
  }

  metric4XXErrorCount() {
    return this.metricFactory.metric({
      metricName: "4XXError",
      statistic: MetricStatistic.SUM,
      label: "4XX Error",
      dimensionsMap: this.dimensionsMap,
      namespace: ApiGatewayNamespace,
      region: this.region,
      account: this.account,
    });
  }

  metric4XXErrorRate() {
    return this.metricFactory.toRate(
      this.metric4XXErrorCount(),
      this.rateComputationMethod,
      false,
      "errors",
    );
  }

  metric5XXFaultCount() {
    return this.metricFactory.metric({
      metricName: "5XXError",
      statistic: MetricStatistic.SUM,
      label: "5XX Fault",
      dimensionsMap: this.dimensionsMap,
      namespace: ApiGatewayNamespace,
      region: this.region,
      account: this.account,
    });
  }

  metric5XXFaultRate() {
    return this.metricFactory.toRate(
      this.metric5XXFaultCount(),
      this.rateComputationMethod,
      false,
      "faults",
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

  metricLatencyInMillis(latencyType: LatencyType) {
    const label = getLatencyTypeLabel(latencyType);
    return this.metricFactory.metric({
      metricName: "Latency",
      statistic: getLatencyTypeStatistic(latencyType),
      label: label,
      dimensionsMap: this.dimensionsMap,
      namespace: ApiGatewayNamespace,
      region: this.region,
      account: this.account,
    });
  }
}
