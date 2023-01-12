import { GraphWidget, IWidget } from "aws-cdk-lib/aws-cloudwatch";

import {
  AutoScalingGroupMetricFactory,
  AutoScalingGroupMetricFactoryProps,
} from "./AutoScalingGroupMetricFactory";
import {
  BaseMonitoringProps,
  CountAxisFromZero,
  DefaultGraphWidgetHeight,
  DefaultSummaryWidgetHeight,
  FullWidth,
  HalfWidth,
  MetricWithAlarmSupport,
  Monitoring,
  MonitoringScope,
} from "../../common";
import {
  MonitoringHeaderWidget,
  MonitoringNamingStrategy,
} from "../../dashboard";

export interface AutoScalingGroupMonitoringOptions
  extends BaseMonitoringProps {}

export interface AutoScalingGroupMonitoringProps
  extends AutoScalingGroupMetricFactoryProps,
    AutoScalingGroupMonitoringOptions {}

export class AutoScalingGroupMonitoring extends Monitoring {
  readonly title: string;

  readonly groupMinSizeMetric: MetricWithAlarmSupport;
  readonly groupMaxSizeMetric: MetricWithAlarmSupport;
  readonly groupDesiredSizeMetric: MetricWithAlarmSupport;
  readonly instancesInServiceMetric: MetricWithAlarmSupport;
  readonly instancesPendingMetric: MetricWithAlarmSupport;
  readonly instancesStandbyMetric: MetricWithAlarmSupport;
  readonly instancesTerminatingMetric: MetricWithAlarmSupport;
  readonly instancesTotalMetric: MetricWithAlarmSupport;

  constructor(scope: MonitoringScope, props: AutoScalingGroupMonitoringProps) {
    super(scope, props);

    const fallbackConstructName = props.autoScalingGroup.autoScalingGroupName;
    const namingStrategy = new MonitoringNamingStrategy({
      ...props,
      namedConstruct: props.autoScalingGroup,
      fallbackConstructName,
    });
    this.title = namingStrategy.resolveHumanReadableName();

    const metricFactory = new AutoScalingGroupMetricFactory(
      scope.createMetricFactory(),
      props
    );
    this.groupMinSizeMetric = metricFactory.metricGroupMinSize();
    this.groupMaxSizeMetric = metricFactory.metricGroupMaxSize();
    this.groupDesiredSizeMetric = metricFactory.metricGroupDesiredCapacity();
    this.instancesInServiceMetric =
      metricFactory.metricGroupInServiceInstances();
    this.instancesPendingMetric = metricFactory.metricGroupPendingInstances();
    this.instancesStandbyMetric = metricFactory.metricGroupStandbyInstances();
    this.instancesTerminatingMetric =
      metricFactory.metricGroupTerminatingInstances();
    this.instancesTotalMetric = metricFactory.metricGroupTotalInstances();
  }

  summaryWidgets(): IWidget[] {
    return [
      this.createTitleWidget(),
      this.createGroupSizeWidget(FullWidth, DefaultSummaryWidgetHeight),
    ];
  }

  widgets(): IWidget[] {
    return [
      this.createTitleWidget(),
      this.createGroupSizeWidget(HalfWidth, DefaultGraphWidgetHeight),
      this.createGroupStatusWidget(HalfWidth, DefaultGraphWidgetHeight),
    ];
  }

  createTitleWidget() {
    return new MonitoringHeaderWidget({
      family: "Auto Scaling Group",
      title: this.title,
    });
  }

  createGroupSizeWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Group Size",
      left: [
        this.groupMinSizeMetric,
        this.groupMaxSizeMetric,
        this.groupDesiredSizeMetric,
        this.instancesTotalMetric,
      ],
      leftYAxis: CountAxisFromZero,
    });
  }

  createGroupStatusWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Instance States",
      left: [
        this.instancesInServiceMetric,
        this.instancesPendingMetric,
        this.instancesStandbyMetric,
        this.instancesTerminatingMetric,
      ],
      leftYAxis: CountAxisFromZero,
      stacked: true,
    });
  }
}
