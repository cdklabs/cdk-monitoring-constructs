import { IGraphqlApi } from "@aws-cdk/aws-appsync-alpha";
import { DimensionsMap } from "aws-cdk-lib/aws-cloudwatch";

import {
  MetricFactory,
  MetricStatistic,
  RateComputationMethod,
} from "../../common";

const Namespace = "AWS/AppSync";

export interface AppSyncMetricFactoryProps {
  /**
   * the GraphQL API to monitor
   */
  readonly api: IGraphqlApi;
  /**
   * whether the TPS should be filled with zeroes
   * @default - true
   */
  readonly fillTpsWithZeroes?: boolean;
  /**
   * method to compute TPS
   * @default - average
   */
  readonly rateComputationMethod?: RateComputationMethod;
}

export class AppSyncMetricFactory {
  protected readonly metricFactory: MetricFactory;
  protected readonly fillTpsWithZeroes: boolean;
  protected readonly rateComputationMethod: RateComputationMethod;
  protected readonly dimensionsMap: DimensionsMap;

  constructor(metricFactory: MetricFactory, props: AppSyncMetricFactoryProps) {
    this.metricFactory = metricFactory;
    this.fillTpsWithZeroes = props.fillTpsWithZeroes ?? true;
    this.rateComputationMethod =
      props.rateComputationMethod ?? RateComputationMethod.AVERAGE;
    this.dimensionsMap = {
      GraphQLAPIId: props.api.apiId,
    };
  }

  /**
   * @deprecated use metricRequestRate
   */
  metricTps() {
    return this.metricFactory.toRate(
      this.metricRequestCount(),
      RateComputationMethod.PER_SECOND,
      true,
      "requests",
      this.fillTpsWithZeroes
    );
  }

  metricRequestRate() {
    return this.metricFactory.toRate(
      this.metricRequestCount(),
      this.rateComputationMethod,
      true,
      "requests",
      this.fillTpsWithZeroes
    );
  }

  metricRequestCount() {
    return this.metricFactory.createMetric(
      "Latency",
      MetricStatistic.N,
      "Requests",
      this.dimensionsMap,
      undefined,
      Namespace
    );
  }

  metricLatencyP50InMillis() {
    return this.metricFactory.createMetric(
      "Latency",
      MetricStatistic.P50,
      "P50",
      this.dimensionsMap,
      undefined,
      Namespace
    );
  }

  metricLatencyP90InMillis() {
    return this.metricFactory.createMetric(
      "Latency",
      MetricStatistic.P90,
      "P90",
      this.dimensionsMap,
      undefined,
      Namespace
    );
  }

  metricLatencyP99InMillis() {
    return this.metricFactory.createMetric(
      "Latency",
      MetricStatistic.P99,
      "P99",
      this.dimensionsMap,
      undefined,
      Namespace
    );
  }

  metric4XXErrorCount() {
    return this.metricFactory.createMetric(
      "4XXError",
      MetricStatistic.SUM,
      "4XX Error",
      this.dimensionsMap,
      undefined,
      Namespace
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
      this.dimensionsMap,
      undefined,
      Namespace
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
}
