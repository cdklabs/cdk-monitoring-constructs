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
    return this.metricFactory.createMetric(
      "ServiceIntegrationRunTime",
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

  metricServiceIntegrationRunTimeP90InMillis() {
    return this.metricFactory.createMetric(
      "ServiceIntegrationRunTime",
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

  metricServiceIntegrationRunTimeP50InMillis() {
    return this.metricFactory.createMetric(
      "ServiceIntegrationRunTime",
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

  metricServiceIntegrationScheduleTimeP99InMillis() {
    return this.metricFactory.createMetric(
      "ServiceIntegrationScheduleTime",
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

  metricServiceIntegrationScheduleTimeP90InMillis() {
    return this.metricFactory.createMetric(
      "ServiceIntegrationScheduleTime",
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

  metricServiceIntegrationScheduleTimeP50InMillis() {
    return this.metricFactory.createMetric(
      "ServiceIntegrationScheduleTime",
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

  metricServiceIntegrationTimeP99InMillis() {
    return this.metricFactory.createMetric(
      "ServiceIntegrationTime",
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

  metricServiceIntegrationTimeP90InMillis() {
    return this.metricFactory.createMetric(
      "ServiceIntegrationTime",
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

  metricServiceIntegrationTimeP50InMillis() {
    return this.metricFactory.createMetric(
      "ServiceIntegrationTime",
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

  metricServiceIntegrationsFailed() {
    return this.metricFactory.createMetric(
      "ServiceIntegrationsFailed",
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

  metricServiceIntegrationsFailedRate() {
    return this.metricFactory.toRate(
      this.metricServiceIntegrationsFailed(),
      this.rateComputationMethod,
      false,
      "faults",
    );
  }

  metricServiceIntegrationsScheduled() {
    return this.metricFactory.createMetric(
      "ServiceIntegrationsScheduled",
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

  metricServiceIntegrationsStarted() {
    return this.metricFactory.createMetric(
      "ServiceIntegrationsStarted",
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

  metricServiceIntegrationsSucceeded() {
    return this.metricFactory.createMetric(
      "ServiceIntegrationsSucceeded",
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

  metricServiceIntegrationsTimedOut() {
    return this.metricFactory.createMetric(
      "ServiceIntegrationsTimedOut",
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
