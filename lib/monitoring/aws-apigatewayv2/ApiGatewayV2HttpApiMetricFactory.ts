import { IHttpApi } from "aws-cdk-lib/aws-apigatewayv2";
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

export interface ApiGatewayV2HttpApiMetricFactoryProps
  extends BaseMetricFactoryProps {
  readonly api: IHttpApi;
  /**
   * @default - $default
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

export class ApiGatewayV2HttpApiMetricFactory extends BaseMetricFactory<ApiGatewayV2HttpApiMetricFactoryProps> {
  protected readonly fillTpsWithZeroes: boolean;
  protected readonly rateComputationMethod: RateComputationMethod;
  protected readonly dimensionsMap: DimensionsMap;

  constructor(
    metricFactory: MetricFactory,
    props: ApiGatewayV2HttpApiMetricFactoryProps,
  ) {
    super(metricFactory, props);

    this.fillTpsWithZeroes = props.fillTpsWithZeroes ?? true;
    this.rateComputationMethod =
      props.rateComputationMethod ?? RateComputationMethod.AVERAGE;
    this.dimensionsMap = {
      ApiId: props.api.apiId,
      Stage: props.apiStage ?? "$default",
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
    );
  }

  metricInvocationRate() {
    return this.metricFactory.toRate(
      this.metricInvocationCount(),
      this.rateComputationMethod,
      false,
      "requests",
    );
  }

  metricInvocationCount() {
    return this.metricFactory.metric({
      metricName: "Count",
      statistic: MetricStatistic.SUM,
      label: "Invocations",
      dimensionsMap: this.dimensionsMap,
      namespace: ApiGatewayNamespace,
      region: this.region,
      account: this.account,
    });
  }

  metric4xxCount() {
    return this.metricFactory.metric({
      metricName: "4xx",
      statistic: MetricStatistic.SUM,
      label: "4xx",
      dimensionsMap: this.dimensionsMap,
      namespace: ApiGatewayNamespace,
      region: this.region,
      account: this.account,
    });
  }

  metric4xxRate() {
    return this.metricFactory.toRate(
      this.metric4xxCount(),
      this.rateComputationMethod,
      false,
      "errors",
    );
  }

  metric5xxCount() {
    return this.metricFactory.metric({
      metricName: "5xx",
      statistic: MetricStatistic.SUM,
      label: "5xx",
      dimensionsMap: this.dimensionsMap,
      namespace: ApiGatewayNamespace,
      region: this.region,
      account: this.account,
    });
  }

  metric5xxRate() {
    return this.metricFactory.toRate(
      this.metric5xxCount(),
      this.rateComputationMethod,
      false,
      "faults",
    );
  }

  /**
   * @deprecated Use {@link metricLatencyInMillis} instead.
   */
  metricLatencyP50InMillis() {
    return this.metricLatencyInMillis(LatencyType.P50);
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
  metricLatencyP99InMillis() {
    return this.metricLatencyInMillis(LatencyType.P99);
  }

  /**
   * @deprecated Use {@link metricIntegrationLatencyInMillis} instead.
   */
  metricIntegrationLatencyP50InMillis() {
    return this.metricIntegrationLatencyInMillis(LatencyType.P50);
  }

  /**
   * @deprecated Use {@link metricIntegrationLatencyInMillis} instead.
   */
  metricIntegrationLatencyP90InMillis() {
    return this.metricIntegrationLatencyInMillis(LatencyType.P90);
  }

  /**
   * @deprecated Use {@link metricIntegrationLatencyInMillis} instead.
   */
  metricIntegrationLatencyP99InMillis() {
    return this.metricIntegrationLatencyInMillis(LatencyType.P99);
  }

  metricIntegrationLatencyInMillis(latencyType: LatencyType) {
    const label = getLatencyTypeLabel(latencyType);
    return this.metricFactory.metric({
      metricName: "IntegrationLatency",
      statistic: getLatencyTypeStatistic(latencyType),
      label: label,
      dimensionsMap: this.dimensionsMap,
      namespace: ApiGatewayNamespace,
      region: this.region,
      account: this.account,
    });
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
