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

export class StepFunctionActivityMetricFactory extends BaseMetricFactory<StepFunctionActivityMetricFactoryProps> {
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
    return this.metricFactory.metric({
      metricName: "ActivityRunTime",
      statistic: MetricStatistic.P99,
      label: "P99",
      dimensionsMap: this.dimensionsMap,
      namespace: Namespace,
      region: this.region,
      account: this.account,
    });
  }

  metricActivityRunTimeP90InMillis() {
    return this.metricFactory.metric({
      metricName: "ActivityRunTime",
      statistic: MetricStatistic.P90,
      label: "P90",
      dimensionsMap: this.dimensionsMap,
      namespace: Namespace,
      region: this.region,
      account: this.account,
    });
  }

  metricActivityRunTimeP50InMillis() {
    return this.metricFactory.metric({
      metricName: "ActivityRunTime",
      statistic: MetricStatistic.P50,
      label: "P50",
      dimensionsMap: this.dimensionsMap,
      namespace: Namespace,
      region: this.region,
      account: this.account,
    });
  }

  metricActivityScheduleTimeP99InMillis() {
    return this.metricFactory.metric({
      metricName: "ActivityScheduleTime",
      statistic: MetricStatistic.P99,
      label: "P99",
      dimensionsMap: this.dimensionsMap,
      namespace: Namespace,
      region: this.region,
      account: this.account,
    });
  }

  metricActivityScheduleTimeP90InMillis() {
    return this.metricFactory.metric({
      metricName: "ActivityScheduleTime",
      statistic: MetricStatistic.P90,
      label: "P90",
      dimensionsMap: this.dimensionsMap,
      namespace: Namespace,
      region: this.region,
      account: this.account,
    });
  }

  metricActivityScheduleTimeP50InMillis() {
    return this.metricFactory.metric({
      metricName: "ActivityScheduleTime",
      statistic: MetricStatistic.P50,
      label: "P50",
      dimensionsMap: this.dimensionsMap,
      namespace: Namespace,
      region: this.region,
      account: this.account,
    });
  }

  metricActivityTimeP99InMillis() {
    return this.metricFactory.metric({
      metricName: "ActivityTime",
      statistic: MetricStatistic.P99,
      label: "P99",
      dimensionsMap: this.dimensionsMap,
      namespace: Namespace,
      region: this.region,
      account: this.account,
    });
  }

  metricActivityTimeP90InMillis() {
    return this.metricFactory.metric({
      metricName: "ActivityTime",
      statistic: MetricStatistic.P90,
      label: "P90",
      dimensionsMap: this.dimensionsMap,
      namespace: Namespace,
      region: this.region,
      account: this.account,
    });
  }

  metricActivityTimeP50InMillis() {
    return this.metricFactory.metric({
      metricName: "ActivityTime",
      statistic: MetricStatistic.P50,
      label: "P50",
      dimensionsMap: this.dimensionsMap,
      namespace: Namespace,
      region: this.region,
      account: this.account,
    });
  }

  metricActivitiesFailed() {
    return this.metricFactory.metric({
      metricName: "ActivitiesFailed",
      statistic: MetricStatistic.SUM,
      label: "Failed",
      dimensionsMap: this.dimensionsMap,
      namespace: Namespace,
      region: this.region,
      account: this.account,
    });
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
    return this.metricFactory.metric({
      metricName: "ActivitiesHeartbeatTimedOut",
      statistic: MetricStatistic.SUM,
      label: "HeartbeatTimedOut",
      dimensionsMap: this.dimensionsMap,
      namespace: Namespace,
      region: this.region,
      account: this.account,
    });
  }

  metricActivitiesScheduled() {
    return this.metricFactory.metric({
      metricName: "ActivitiesScheduled",
      statistic: MetricStatistic.SUM,
      label: "Scheduled",
      dimensionsMap: this.dimensionsMap,
      namespace: Namespace,
      region: this.region,
      account: this.account,
    });
  }

  metricActivitiesStarted() {
    return this.metricFactory.metric({
      metricName: "ActivitiesStarted",
      statistic: MetricStatistic.SUM,
      label: "Started",
      dimensionsMap: this.dimensionsMap,
      namespace: Namespace,
      region: this.region,
      account: this.account,
    });
  }

  metricActivitiesSucceeded() {
    return this.metricFactory.metric({
      metricName: "ActivitiesSucceeded",
      statistic: MetricStatistic.SUM,
      label: "Succeeded",
      dimensionsMap: this.dimensionsMap,
      namespace: Namespace,
      region: this.region,
      account: this.account,
    });
  }

  metricActivitiesTimedOut() {
    return this.metricFactory.metric({
      metricName: "ActivitiesTimedOut",
      statistic: MetricStatistic.SUM,
      label: "Timeout",
      dimensionsMap: this.dimensionsMap,
      namespace: Namespace,
      region: this.region,
      account: this.account,
    });
  }
}
