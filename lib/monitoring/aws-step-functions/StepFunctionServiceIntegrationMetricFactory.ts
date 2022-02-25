import { DimensionHash } from "monocdk/aws-cloudwatch";

import {
  MetricFactory,
  MetricStatistic,
  RateComputationMethod,
} from "../../common";

const Namespace = "AWS/States";

export interface StepFunctionServiceIntegrationMetricFactoryProps {
  readonly serviceIntegrationResourceArn: string;
  /**
   * @default average
   */
  readonly rateComputationMethod?: RateComputationMethod;
}

export class StepFunctionServiceIntegrationMetricFactory {
  protected readonly metricFactory: MetricFactory;
  protected readonly rateComputationMethod: RateComputationMethod;
  protected readonly dimensions: DimensionHash;

  constructor(
    metricFactory: MetricFactory,
    props: StepFunctionServiceIntegrationMetricFactoryProps
  ) {
    this.metricFactory = metricFactory;
    this.rateComputationMethod = RateComputationMethod.AVERAGE;
    this.dimensions = {
      ServiceIntegrationResourceArn: props.serviceIntegrationResourceArn,
    };
  }

  metricServiceIntegrationRunTimeP99InMillis() {
    return this.metricFactory.createMetric(
      "ServiceIntegrationRunTime",
      MetricStatistic.P99,
      "P99",
      this.dimensions,
      undefined,
      Namespace
    );
  }

  metricServiceIntegrationRunTimeP90InMillis() {
    return this.metricFactory.createMetric(
      "ServiceIntegrationRunTime",
      MetricStatistic.P90,
      "P90",
      this.dimensions,
      undefined,
      Namespace
    );
  }

  metricServiceIntegrationRunTimeP50InMillis() {
    return this.metricFactory.createMetric(
      "ServiceIntegrationRunTime",
      MetricStatistic.P50,
      "P50",
      this.dimensions,
      undefined,
      Namespace
    );
  }

  metricServiceIntegrationScheduleTimeP99InMillis() {
    return this.metricFactory.createMetric(
      "ServiceIntegrationScheduleTime",
      MetricStatistic.P99,
      "P99",
      this.dimensions,
      undefined,
      Namespace
    );
  }

  metricServiceIntegrationScheduleTimeP90InMillis() {
    return this.metricFactory.createMetric(
      "ServiceIntegrationScheduleTime",
      MetricStatistic.P90,
      "P90",
      this.dimensions,
      undefined,
      Namespace
    );
  }

  metricServiceIntegrationScheduleTimeP50InMillis() {
    return this.metricFactory.createMetric(
      "ServiceIntegrationScheduleTime",
      MetricStatistic.P50,
      "P50",
      this.dimensions,
      undefined,
      Namespace
    );
  }

  metricServiceIntegrationTimeP99InMillis() {
    return this.metricFactory.createMetric(
      "ServiceIntegrationTime",
      MetricStatistic.P99,
      "P99",
      this.dimensions,
      undefined,
      Namespace
    );
  }

  metricServiceIntegrationTimeP90InMillis() {
    return this.metricFactory.createMetric(
      "ServiceIntegrationTime",
      MetricStatistic.P90,
      "P90",
      this.dimensions,
      undefined,
      Namespace
    );
  }

  metricServiceIntegrationTimeP50InMillis() {
    return this.metricFactory.createMetric(
      "ServiceIntegrationTime",
      MetricStatistic.P50,
      "P50",
      this.dimensions,
      undefined,
      Namespace
    );
  }

  metricServiceIntegrationsFailed() {
    return this.metricFactory.createMetric(
      "ServiceIntegrationsFailed",
      MetricStatistic.SUM,
      "Failed",
      this.dimensions,
      undefined,
      Namespace
    );
  }

  metricServiceIntegrationsFailedRate() {
    const metric = this.metricServiceIntegrationsFailed();
    return this.metricFactory.toRate(
      metric,
      this.rateComputationMethod,
      false,
      "faults"
    );
  }

  metricServiceIntegrationsScheduled() {
    return this.metricFactory.createMetric(
      "ServiceIntegrationsScheduled",
      MetricStatistic.SUM,
      "Scheduled",
      this.dimensions,
      undefined,
      Namespace
    );
  }

  metricServiceIntegrationsStarted() {
    return this.metricFactory.createMetric(
      "ServiceIntegrationsStarted",
      MetricStatistic.SUM,
      "Started",
      this.dimensions,
      undefined,
      Namespace
    );
  }

  metricServiceIntegrationsSucceeded() {
    return this.metricFactory.createMetric(
      "ServiceIntegrationsSucceeded",
      MetricStatistic.SUM,
      "Succeeded",
      this.dimensions,
      undefined,
      Namespace
    );
  }

  metricServiceIntegrationsTimedOut() {
    return this.metricFactory.createMetric(
      "ServiceIntegrationsTimedOut",
      MetricStatistic.SUM,
      "Timeout",
      this.dimensions,
      undefined,
      Namespace
    );
  }
}
