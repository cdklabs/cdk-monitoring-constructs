import { IHttpApi } from "monocdk/aws-apigatewayv2";
import { DimensionHash } from "monocdk/aws-cloudwatch";

import {
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
  protected readonly dimensions: DimensionHash;

  constructor(
    metricFactory: MetricFactory,
    props: ApiGatewayV2HttpApiMetricFactoryProps
  ) {
    this.metricFactory = metricFactory;
    this.fillTpsWithZeroes = props.fillTpsWithZeroes ?? true;
    this.rateComputationMethod =
      props.rateComputationMethod ?? RateComputationMethod.AVERAGE;
    this.dimensions = {
      ApiId: props.api.httpApiId,
      Stage: props.apiStage ?? "$default",
      ...(props.apiMethod && { Method: props.apiMethod }),
      ...(props.apiResource && { Resource: props.apiResource }),
    };
  }

  metricTps() {
    // TODO: rename to metricInvocationRate and use rateComputationMethod
    return this.metricFactory.toRate(
      this.metricInvocationCount(),
      RateComputationMethod.PER_SECOND,
      false,
      "requests"
    );
  }

  metricInvocationCount() {
    return this.metricFactory.createMetric(
      "Count",
      MetricStatistic.SUM,
      "Invocations",
      this.dimensions,
      undefined,
      ApiGatewayNamespace
    );
  }

  metric4xxCount() {
    return this.metricFactory.createMetric(
      "4xx",
      MetricStatistic.SUM,
      "4xx",
      this.dimensions,
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
      this.dimensions,
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

  metricLatencyP50InMillis() {
    return this.metricFactory.createMetric(
      "Latency",
      MetricStatistic.P50,
      "P50 Latency",
      this.dimensions,
      undefined,
      ApiGatewayNamespace
    );
  }

  metricLatencyP90InMillis() {
    return this.metricFactory.createMetric(
      "Latency",
      MetricStatistic.P90,
      "P90 Latency",
      this.dimensions,
      undefined,
      ApiGatewayNamespace
    );
  }

  metricLatencyP99InMillis() {
    return this.metricFactory.createMetric(
      "Latency",
      MetricStatistic.P99,
      "P99 Latency",
      this.dimensions,
      undefined,
      ApiGatewayNamespace
    );
  }

  metricIntegrationLatencyP50InMillis() {
    return this.metricFactory.createMetric(
      "IntegrationLatency",
      MetricStatistic.P50,
      "P50 Integration Latency",
      this.dimensions,
      undefined,
      ApiGatewayNamespace
    );
  }

  metricIntegrationLatencyP90InMillis() {
    return this.metricFactory.createMetric(
      "IntegrationLatency",
      MetricStatistic.P90,
      "P90 Integration Latency",
      this.dimensions,
      undefined,
      ApiGatewayNamespace
    );
  }

  metricIntegrationLatencyP99InMillis() {
    return this.metricFactory.createMetric(
      "IntegrationLatency",
      MetricStatistic.P99,
      "P99 Integration Latency",
      this.dimensions,
      undefined,
      ApiGatewayNamespace
    );
  }
}
