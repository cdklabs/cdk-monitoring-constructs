import { DimensionsMap } from "aws-cdk-lib/aws-cloudwatch";
import { IActivity } from "aws-cdk-lib/aws-stepfunctions";

import {
  BaseMetricFactory,
  BaseMetricFactoryProps,
  MetricFactory,
  MetricStatistic,
  RateComputationMethod,
} from "../../common";

const Namespace = "AWS/States";

export interface StepFunctionActivityMetricFactoryProps
  extends BaseMetricFactoryProps {
  readonly activity: IActivity;
  /**
   * @default - average
   */
  readonly rateComputationMethod?: RateComputationMethod;
}

export class StepFunctionActivityMetricFactory extends BaseMetricFactory {
  protected readonly rateComputationMethod: RateComputationMethod;
  protected readonly dimensionsMap: DimensionsMap;

  constructor(
    metricFactory: MetricFactory,
    props: StepFunctionActivityMetricFactoryProps,
  ) {
    super(metricFactory, props);

    this.rateComputationMethod = RateComputationMethod.AVERAGE;
    this.dimensionsMap = {
      ActivityArn: props.activity.activityArn,
    };
  }

  metricActivityRunTimeP99InMillis() {
    return this.metricFactory.createMetric(
      "ActivityRunTime",
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

  metricActivityRunTimeP90InMillis() {
    return this.metricFactory.createMetric(
      "ActivityRunTime",
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

  metricActivityRunTimeP50InMillis() {
    return this.metricFactory.createMetric(
      "ActivityRunTime",
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

  metricActivityScheduleTimeP99InMillis() {
    return this.metricFactory.createMetric(
      "ActivityScheduleTime",
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

  metricActivityScheduleTimeP90InMillis() {
    return this.metricFactory.createMetric(
      "ActivityScheduleTime",
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

  metricActivityScheduleTimeP50InMillis() {
    return this.metricFactory.createMetric(
      "ActivityScheduleTime",
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

  metricActivityTimeP99InMillis() {
    return this.metricFactory.createMetric(
      "ActivityTime",
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

  metricActivityTimeP90InMillis() {
    return this.metricFactory.createMetric(
      "ActivityTime",
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

  metricActivityTimeP50InMillis() {
    return this.metricFactory.createMetric(
      "ActivityTime",
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

  metricActivitiesFailed() {
    return this.metricFactory.createMetric(
      "ActivitiesFailed",
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

  metricActivitiesFailedRate() {
    const metric = this.metricActivitiesFailed();
    return this.metricFactory.toRate(
      metric,
      this.rateComputationMethod,
      false,
      "faults",
    );
  }

  metricActivitiesHeartbeatTimedOut() {
    return this.metricFactory.createMetric(
      "ActivitiesHeartbeatTimedOut",
      MetricStatistic.SUM,
      "HeartbeatTimedOut",
      this.dimensionsMap,
      undefined,
      Namespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricActivitiesScheduled() {
    return this.metricFactory.createMetric(
      "ActivitiesScheduled",
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

  metricActivitiesStarted() {
    return this.metricFactory.createMetric(
      "ActivitiesStarted",
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

  metricActivitiesSucceeded() {
    return this.metricFactory.createMetric(
      "ActivitiesSucceeded",
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

  metricActivitiesTimedOut() {
    return this.metricFactory.createMetric(
      "ActivitiesTimedOut",
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
