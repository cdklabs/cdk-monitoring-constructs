import { IAutoScalingGroup } from "aws-cdk-lib/aws-autoscaling";
import { DimensionsMap } from "aws-cdk-lib/aws-cloudwatch";

import {
  BaseMetricFactory,
  BaseMetricFactoryProps,
  MetricFactory,
  MetricStatistic,
} from "../../common";

const AutoScalingNamespace = "AWS/AutoScaling";

export interface AutoScalingGroupMetricFactoryProps
  extends BaseMetricFactoryProps {
  readonly autoScalingGroup: IAutoScalingGroup;
}

export class AutoScalingGroupMetricFactory extends BaseMetricFactory {
  protected readonly dimensionsMap: DimensionsMap;

  constructor(
    metricFactory: MetricFactory,
    props: AutoScalingGroupMetricFactoryProps,
  ) {
    super(metricFactory, props);

    this.dimensionsMap = {
      AutoScalingGroupName: props.autoScalingGroup.autoScalingGroupName,
    };
  }

  /**
   * The minimum size of the Auto Scaling group.
   */
  metricGroupMinSize() {
    return this.metric("GroupMinSize", "Min", MetricStatistic.AVERAGE);
  }

  /**
   * The maximum size of the Auto Scaling group.
   */
  metricGroupMaxSize() {
    return this.metric("GroupMaxSize", "Max", MetricStatistic.AVERAGE);
  }

  /**
   * The number of instances that the Auto Scaling group attempts to maintain.
   */
  metricGroupDesiredCapacity() {
    return this.metric(
      "GroupDesiredCapacity",
      "Desired",
      MetricStatistic.AVERAGE,
    );
  }

  /**
     *
     The number of instances that are running as part of the Auto Scaling group.
     This metric does not include instances that are pending or terminating.
     */
  metricGroupInServiceInstances() {
    return this.metric(
      "GroupInServiceInstances",
      "InService",
      MetricStatistic.AVERAGE,
    );
  }

  /**
   * The number of instances that are pending. A pending instance is not yet in service.
   * This metric does not include instances that are in service or terminating.
   */
  metricGroupPendingInstances() {
    return this.metric(
      "GroupPendingInstances",
      "Pending",
      MetricStatistic.AVERAGE,
    );
  }

  /**
   * The number of instances that are in a Standby state.
   * Instances in this state are still running but are not actively in service.
   */
  metricGroupStandbyInstances() {
    return this.metric(
      "GroupStandbyInstances",
      "Standby",
      MetricStatistic.AVERAGE,
    );
  }

  /**
   * The number of instances that are in the process of terminating.
   * This metric does not include instances that are in service or pending.
   */
  metricGroupTerminatingInstances() {
    return this.metric(
      "GroupTerminatingInstances",
      "Terminating",
      MetricStatistic.AVERAGE,
    );
  }

  /**
   * The total number of instances in the Auto Scaling group.
   * This metric identifies the number of instances that are in service, pending, and terminating.
   */
  metricGroupTotalInstances() {
    return this.metric("GroupTotalInstances", "Total", MetricStatistic.AVERAGE);
  }

  private metric(
    metricName: string,
    label: string,
    statistic: MetricStatistic,
  ) {
    return this.metricFactory.createMetric(
      metricName,
      statistic,
      label,
      this.dimensionsMap,
      undefined,
      AutoScalingNamespace,
      undefined,
      this.region,
      this.account,
    );
  }
}
