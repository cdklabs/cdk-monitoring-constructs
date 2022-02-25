import { RestApiBase } from "monocdk/aws-apigateway";
import { DimensionHash } from "monocdk/aws-cloudwatch";

import {
  MetricFactory,
  MetricStatistic,
  RateComputationMethod,
} from "../../common";

const ApiGatewayNamespace = "AWS/ApiGateway";

export interface ApiGatewayMetricFactoryProps {
  /**
   * API to monitor (cannot use IRestApi, since it does not provide API name)
   */
  readonly api: RestApiBase;
  /**
   * @default prod
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

export class ApiGatewayMetricFactory {
  protected readonly metricFactory: MetricFactory;
  protected readonly fillTpsWithZeroes: boolean;
  protected readonly rateComputationMethod: RateComputationMethod;
  protected readonly dimensions: DimensionHash;

  constructor(
    metricFactory: MetricFactory,
    props: ApiGatewayMetricFactoryProps
  ) {
    this.metricFactory = metricFactory;
    this.fillTpsWithZeroes = props.fillTpsWithZeroes ?? true;
    this.rateComputationMethod =
      props.rateComputationMethod ?? RateComputationMethod.AVERAGE;
    this.dimensions = {
      ApiName: props.api.restApiName,
      Stage: props.apiStage ?? "prod",
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
      "requests",
      this.fillTpsWithZeroes
    );
  }

  metricInvocationCount() {
    return this.metricFactory.createMetric(
      "Count",
      MetricStatistic.SUM,
      "Count",
      this.dimensions,
      undefined,
      ApiGatewayNamespace
    );
  }

  metric4XXErrorCount() {
    return this.metricFactory.createMetric(
      "4XXError",
      MetricStatistic.SUM,
      "4XX Error",
      this.dimensions,
      undefined,
      ApiGatewayNamespace
    );
  }

  metric4XXErrorRate() {
    const metric = this.metric4XXErrorCount();
    return this.metricFactory.toRate(
      metric,
      this.rateComputationMethod,
      false,
      "errors"
    );
  }

  metric5XXFaultCount() {
    return this.metricFactory.createMetric(
      "5XXError",
      MetricStatistic.SUM,
      "5XX Fault",
      this.dimensions,
      undefined,
      ApiGatewayNamespace
    );
  }

  metric5XXFaultRate() {
    const metric = this.metric5XXFaultCount();
    return this.metricFactory.toRate(
      metric,
      this.rateComputationMethod,
      false,
      "faults"
    );
  }

  metricLatencyP99InMillis() {
    return this.metricFactory.createMetric(
      "Latency",
      MetricStatistic.P99,
      "P99",
      this.dimensions,
      undefined,
      ApiGatewayNamespace
    );
  }

  metricLatencyP90InMillis() {
    return this.metricFactory.createMetric(
      "Latency",
      MetricStatistic.P90,
      "P90",
      this.dimensions,
      undefined,
      ApiGatewayNamespace
    );
  }

  metricLatencyP50InMillis() {
    return this.metricFactory.createMetric(
      "Latency",
      MetricStatistic.P50,
      "P50",
      this.dimensions,
      undefined,
      ApiGatewayNamespace
    );
  }
}
