import { DimensionsMap } from "aws-cdk-lib/aws-cloudwatch";

import {
  BaseMetricFactory,
  BaseMetricFactoryProps,
  MetricFactory,
  MetricStatistic,
  RateComputationMethod,
} from "../../common";

const Namespace = "AWS/States";

export interface StepFunctionServiceIntegrationMetricFactoryProps
  extends BaseMetricFactoryProps {
  readonly serviceIntegrationResourceArn: string;
  /**
   * @default - average
   */
  readonly rateComputationMethod?: RateComputationMethod;
}

export class StepFunctionServiceIntegrationMetricFactory extends BaseMetricFactory<StepFunctionServiceIntegrationMetricFactoryProps> {
  protected readonly rateComputationMethod: RateComputationMethod;
  protected readonly dimensionsMap: DimensionsMap;

  constructor(
    metricFactory: MetricFactory,
    props: StepFunctionServiceIntegrationMetricFactoryProps,
  ) {
    super(metricFactory, props);

    this.rateComputationMethod = RateComputationMethod.AVERAGE;
    this.dimensionsMap = {
      ServiceIntegrationResourceArn: props.serviceIntegrationResourceArn,
    };
  }

  metricServiceIntegrationRunTimeP99InMillis() {
    return this.metricFactory.metric({
      metricName: "ServiceIntegrationRunTime",
      statistic: MetricStatistic.P99,
      label: "P99",
      dimensionsMap: this.dimensionsMap,
      namespace: Namespace,
      region: this.region,
      account: this.account,
    });
  }

  metricServiceIntegrationRunTimeP90InMillis() {
    return this.metricFactory.metric({
      metricName: "ServiceIntegrationRunTime",
      statistic: MetricStatistic.P90,
      label: "P90",
      dimensionsMap: this.dimensionsMap,
      namespace: Namespace,
      region: this.region,
      account: this.account,
    });
  }

  metricServiceIntegrationRunTimeP50InMillis() {
    return this.metricFactory.metric({
      metricName: "ServiceIntegrationRunTime",
      statistic: MetricStatistic.P50,
      label: "P50",
      dimensionsMap: this.dimensionsMap,
      namespace: Namespace,
      region: this.region,
      account: this.account,
    });
  }

  metricServiceIntegrationScheduleTimeP99InMillis() {
    return this.metricFactory.metric({
      metricName: "ServiceIntegrationScheduleTime",
      statistic: MetricStatistic.P99,
      label: "P99",
      dimensionsMap: this.dimensionsMap,
      namespace: Namespace,
      region: this.region,
      account: this.account,
    });
  }

  metricServiceIntegrationScheduleTimeP90InMillis() {
    return this.metricFactory.metric({
      metricName: "ServiceIntegrationScheduleTime",
      statistic: MetricStatistic.P90,
      label: "P90",
      dimensionsMap: this.dimensionsMap,
      namespace: Namespace,
      region: this.region,
      account: this.account,
    });
  }

  metricServiceIntegrationScheduleTimeP50InMillis() {
    return this.metricFactory.metric({
      metricName: "ServiceIntegrationScheduleTime",
      statistic: MetricStatistic.P50,
      label: "P50",
      dimensionsMap: this.dimensionsMap,
      namespace: Namespace,
      region: this.region,
      account: this.account,
    });
  }

  metricServiceIntegrationTimeP99InMillis() {
    return this.metricFactory.metric({
      metricName: "ServiceIntegrationTime",
      statistic: MetricStatistic.P99,
      label: "P99",
      dimensionsMap: this.dimensionsMap,
      namespace: Namespace,
      region: this.region,
      account: this.account,
    });
  }

  metricServiceIntegrationTimeP90InMillis() {
    return this.metricFactory.metric({
      metricName: "ServiceIntegrationTime",
      statistic: MetricStatistic.P90,
      label: "P90",
      dimensionsMap: this.dimensionsMap,
      namespace: Namespace,
      region: this.region,
      account: this.account,
    });
  }

  metricServiceIntegrationTimeP50InMillis() {
    return this.metricFactory.metric({
      metricName: "ServiceIntegrationTime",
      statistic: MetricStatistic.P50,
      label: "P50",
      dimensionsMap: this.dimensionsMap,
      namespace: Namespace,
      region: this.region,
      account: this.account,
    });
  }

  metricServiceIntegrationsFailed() {
    return this.metricFactory.metric({
      metricName: "ServiceIntegrationsFailed",
      statistic: MetricStatistic.SUM,
      label: "Failed",
      dimensionsMap: this.dimensionsMap,
      namespace: Namespace,
      region: this.region,
      account: this.account,
    });
  }

  metricServiceIntegrationsFailedRate() {
    return this.metricFactory.toRate(
      this.metricServiceIntegrationsFailed(),
      this.rateComputationMethod,
      false,
      "faults",
    );
  }

  metricServiceIntegrationsScheduled() {
    return this.metricFactory.metric({
      metricName: "ServiceIntegrationsScheduled",
      statistic: MetricStatistic.SUM,
      label: "Scheduled",
      dimensionsMap: this.dimensionsMap,
      namespace: Namespace,
      region: this.region,
      account: this.account,
    });
  }

  metricServiceIntegrationsStarted() {
    return this.metricFactory.metric({
      metricName: "ServiceIntegrationsStarted",
      statistic: MetricStatistic.SUM,
      label: "Started",
      dimensionsMap: this.dimensionsMap,
      namespace: Namespace,
      region: this.region,
      account: this.account,
    });
  }

  metricServiceIntegrationsSucceeded() {
    return this.metricFactory.metric({
      metricName: "ServiceIntegrationsSucceeded",
      statistic: MetricStatistic.SUM,
      label: "Succeeded",
      dimensionsMap: this.dimensionsMap,
      namespace: Namespace,
      region: this.region,
      account: this.account,
    });
  }

  metricServiceIntegrationsTimedOut() {
    return this.metricFactory.metric({
      metricName: "ServiceIntegrationsTimedOut",
      statistic: MetricStatistic.SUM,
      label: "Timeout",
      dimensionsMap: this.dimensionsMap,
      namespace: Namespace,
      region: this.region,
      account: this.account,
    });
  }
}
