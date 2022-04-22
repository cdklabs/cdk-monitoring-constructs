import { IHttpApi } from "@aws-cdk/aws-apigatewayv2-alpha";
import { DimensionsMap } from "aws-cdk-lib/aws-cloudwatch";

import {
  getLatencyTypeLabel,
  getLatencyTypeStatistic,
  LatencyType,
  MetricFactory,
  MetricStatistic,
  RateComputationMethod,
} from "../../common";

const ApiGatewayNamespace = "AWS/ApiGateway";

export interface ApiGatewayV2HttpApiMetricFactoryProps {
  readonly api: IHttpApi;
  /**
   * @default $default
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
   * @default true
   */
  readonly fillTpsWithZeroes?: boolean;
  /**
   * @default average
   */
  readonly rateComputationMethod?: RateComputationMethod;
}

export class ApiGatewayV2HttpApiMetricFactory {
  protected readonly metricFactory: MetricFactory;
  protected readonly fillTpsWithZeroes: boolean;
  protected readonly rateComputationMethod: RateComputationMethod;
  protected readonly dimensionsMap: DimensionsMap;

  constructor(
    metricFactory: MetricFactory,
    props: ApiGatewayV2HttpApiMetricFactoryProps
  ) {
    this.metricFactory = metricFactory;
    this.fillTpsWithZeroes = props.fillTpsWithZeroes ?? true;
    this.rateComputationMethod =
      props.rateComputationMethod ?? RateComputationMethod.AVERAGE;
    this.dimensionsMap = {
      ApiId: props.api.httpApiId,
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
      "requests"
    );
  }

  metricInvocationRate() {
    return this.metricFactory.toRate(
      this.metricInvocationCount(),
      this.rateComputationMethod,
      false,
      "requests"
    );
  }

  metricInvocationCount() {
    return this.metricFactory.createMetric(
      "Count",
      MetricStatistic.SUM,
      "Invocations",
      this.dimensionsMap,
      undefined,
      ApiGatewayNamespace
    );
  }

  metric4xxCount() {
    return this.metricFactory.createMetric(
      "4xx",
      MetricStatistic.SUM,
      "4xx",
      this.dimensionsMap,
      undefined,
      ApiGatewayNamespace
    );
  }

  metric4xxRate() {
    const metric = this.metric4xxCount();
    return this.metricFactory.toRate(
      metric,
      this.rateComputationMethod,
      false,
      "errors"
    );
  }

  metric5xxCount() {
    return this.metricFactory.createMetric(
      "5xx",
      MetricStatistic.SUM,
      "5xx",
      this.dimensionsMap,
      undefined,
      ApiGatewayNamespace
    );
  }

  metric5xxRate() {
    const metric = this.metric5xxCount();
    return this.metricFactory.toRate(
      metric,
      this.rateComputationMethod,
      false,
      "faults"
    );
  }

  /**
   * @deprecated use metricLatencyInMillis instead
   */
  metricLatencyP50InMillis() {
    return this.metricLatencyInMillis(LatencyType.P50);
  }

  /**
   * @deprecated use metricLatencyInMillis instead
   */
  metricLatencyP90InMillis() {
    return this.metricLatencyInMillis(LatencyType.P90);
  }

  /**
   * @deprecated use metricLatencyInMillis instead
   */
  metricLatencyP99InMillis() {
    return this.metricLatencyInMillis(LatencyType.P99);
  }

  /**
   * @deprecated use metricIntegrationLatencyInMillis instead
   */
  metricIntegrationLatencyP50InMillis() {
    return this.metricIntegrationLatencyInMillis(LatencyType.P50);
  }

  /**
   * @deprecated use metricIntegrationLatencyInMillis instead
   */
  metricIntegrationLatencyP90InMillis() {
    return this.metricIntegrationLatencyInMillis(LatencyType.P90);
  }

  /**
   * @deprecated use metricIntegrationLatencyInMillis instead
   */
  metricIntegrationLatencyP99InMillis() {
    return this.metricIntegrationLatencyInMillis(LatencyType.P99);
  }

  metricIntegrationLatencyInMillis(latencyType: LatencyType) {
    const label = getLatencyTypeLabel(latencyType);
    return this.metricFactory.createMetric(
      "IntegrationLatency",
      getLatencyTypeStatistic(latencyType),
      label,
      this.dimensionsMap,
      undefined,
      ApiGatewayNamespace
    );
  }

  metricLatencyInMillis(latencyType: LatencyType) {
    const label = getLatencyTypeLabel(latencyType);
    return this.metricFactory.createMetric(
      "Latency",
      getLatencyTypeStatistic(latencyType),
      label,
      this.dimensionsMap,
      undefined,
      ApiGatewayNamespace
    );
  }
}
