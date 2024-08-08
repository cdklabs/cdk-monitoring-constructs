import { IGraphqlApi } from "aws-cdk-lib/aws-appsync";
import { DimensionsMap } from "aws-cdk-lib/aws-cloudwatch";

import {
  BaseMetricFactory,
  BaseMetricFactoryProps,
  MetricFactory,
  MetricStatistic,
  RateComputationMethod,
} from "../../common";

const Namespace = "AWS/AppSync";

export interface AppSyncMetricFactoryProps extends BaseMetricFactoryProps {
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

export class AppSyncMetricFactory extends BaseMetricFactory<AppSyncMetricFactoryProps> {
  protected readonly fillTpsWithZeroes: boolean;
  protected readonly rateComputationMethod: RateComputationMethod;
  protected readonly dimensionsMap: DimensionsMap;

  constructor(metricFactory: MetricFactory, props: AppSyncMetricFactoryProps) {
    super(metricFactory, props);

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
      this.fillTpsWithZeroes,
    );
  }

  metricRequestRate() {
    return this.metricFactory.toRate(
      this.metricRequestCount(),
      this.rateComputationMethod,
      true,
      "requests",
      this.fillTpsWithZeroes,
    );
  }

  metricRequestCount() {
    return this.metricFactory.metric({
      metricName: "Latency",
      statistic: MetricStatistic.N,
      label: "Requests",
      dimensionsMap: this.dimensionsMap,
      namespace: Namespace,
      region: this.region,
      account: this.account,
    });
  }

  metricLatencyP50InMillis() {
    return this.metricFactory.metric({
      metricName: "Latency",
      statistic: MetricStatistic.P50,
      label: "P50",
      dimensionsMap: this.dimensionsMap,
      namespace: Namespace,
      region: this.region,
      account: this.account,
    });
  }

  metricLatencyP90InMillis() {
    return this.metricFactory.metric({
      metricName: "Latency",
      statistic: MetricStatistic.P90,
      label: "P90",
      dimensionsMap: this.dimensionsMap,
      namespace: Namespace,
      region: this.region,
      account: this.account,
    });
  }

  metricLatencyP99InMillis() {
    return this.metricFactory.metric({
      metricName: "Latency",
      statistic: MetricStatistic.P99,
      label: "P99",
      dimensionsMap: this.dimensionsMap,
      namespace: Namespace,
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
      namespace: Namespace,
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
      namespace: Namespace,
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
}
