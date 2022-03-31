import { IAutoScalingGroup } from "aws-cdk-lib/aws-autoscaling";
import { GraphWidget, IMetric, IWidget } from "aws-cdk-lib/aws-cloudwatch";

import {
  BaseMonitoringProps,
  CountAxisFromZero,
  DefaultGraphWidgetHeight,
  DefaultSummaryWidgetHeight,
  Monitoring,
  MonitoringScope,
  PercentageAxisFromZeroToHundred,
  QuarterWidth,
  SizeAxisBytesFromZero,
  ThirdWidth,
} from "../../common";
import {
  MonitoringHeaderWidget,
  MonitoringNamingStrategy,
} from "../../dashboard";
import { EC2MetricFactory } from "./EC2MetricFactory";

export interface EC2MonitoringOptions extends BaseMonitoringProps {
  readonly autoScalingGroup?: IAutoScalingGroup;
}

export interface EC2MonitoringProps extends EC2MonitoringOptions {}

export class EC2Monitoring extends Monitoring {
  protected readonly family: string;
  protected readonly title: string;

  protected readonly cpuUtilisationMetric: IMetric;
  protected readonly diskReadBytesMetric: IMetric;
  protected readonly diskWriteBytesMetric: IMetric;
  protected readonly diskReadOpsMetric: IMetric;
  protected readonly diskWriteOpsMetric: IMetric;
  protected readonly networkInMetric: IMetric;
  protected readonly networkOutMetric: IMetric;

  constructor(scope: MonitoringScope, props: EC2MonitoringProps) {
    super(scope, props);

    const fallbackConstructName = props.autoScalingGroup
      ? props.autoScalingGroup.autoScalingGroupName
      : "All Instances";
    const namingStrategy = new MonitoringNamingStrategy({
      ...props,
      fallbackConstructName,
    });
    this.family = props.autoScalingGroup ? "EC2 Auto Scaling Group" : "EC2";
    this.title = namingStrategy.resolveHumanReadableName();

    const metricFactory = new EC2MetricFactory(
      scope.createMetricFactory(),
      props.autoScalingGroup
    );
    this.cpuUtilisationMetric =
      metricFactory.metricAverageCpuUtilisationPercent();
    this.diskReadBytesMetric = metricFactory.metricAverageDiskReadBytes();
    this.diskWriteBytesMetric = metricFactory.metricAverageDiskWriteBytes();
    this.diskReadOpsMetric = metricFactory.metricAverageDiskReadOps();
    this.diskWriteOpsMetric = metricFactory.metricAverageDiskWriteOps();
    this.networkInMetric = metricFactory.metricAverageNetworkInRateBytes();
    this.networkOutMetric = metricFactory.metricAverageNetworkOutRateBytes();
  }

  summaryWidgets(): IWidget[] {
    return [
      // Title
      this.createTitleWidget(),
      // CPU Usage
      this.createCpuWidget(ThirdWidth, DefaultSummaryWidgetHeight),
      // Disk OPS
      this.createDiskOpsWidget(ThirdWidth, DefaultSummaryWidgetHeight),
      // Network
      this.createNetworkWidget(ThirdWidth, DefaultSummaryWidgetHeight),
    ];
  }

  widgets(): IWidget[] {
    return [
      // Title
      this.createTitleWidget(),
      // CPU Usage
      this.createCpuWidget(QuarterWidth, DefaultGraphWidgetHeight),
      // Disk OPS
      this.createDiskOpsWidget(QuarterWidth, DefaultGraphWidgetHeight),
      // Disk Bytes
      this.createDiskWidget(QuarterWidth, DefaultGraphWidgetHeight),
      // Network
      this.createNetworkWidget(QuarterWidth, DefaultGraphWidgetHeight),
    ];
  }

  protected createTitleWidget() {
    return new MonitoringHeaderWidget({
      family: this.family,
      title: this.title,
    });
  }

  protected createCpuWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "CPU Utilization",
      left: [this.cpuUtilisationMetric],
      leftYAxis: PercentageAxisFromZeroToHundred,
    });
  }

  protected createDiskWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Disk - Bytes",
      left: [this.diskReadBytesMetric, this.diskWriteBytesMetric],
      leftYAxis: SizeAxisBytesFromZero,
    });
  }

  protected createDiskOpsWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Disk - OPS",
      left: [this.diskReadOpsMetric, this.diskWriteOpsMetric],
      leftYAxis: CountAxisFromZero,
    });
  }

  protected createNetworkWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Network",
      left: [this.networkInMetric, this.networkOutMetric],
      leftYAxis: SizeAxisBytesFromZero,
    });
  }
}
