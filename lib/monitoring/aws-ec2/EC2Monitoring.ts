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
import { EC2MetricFactory, EC2MetricFactoryProps } from "./EC2MetricFactory";

export interface EC2MonitoringOptions
  extends EC2MetricFactoryProps,
    BaseMonitoringProps {}

export interface EC2MonitoringProps extends EC2MonitoringOptions {}

export class EC2Monitoring extends Monitoring {
  protected readonly family: string;
  protected readonly title: string;

  protected readonly cpuUtilisationMetrics: IMetric[];
  protected readonly diskReadBytesMetrics: IMetric[];
  protected readonly diskWriteBytesMetrics: IMetric[];
  protected readonly diskReadOpsMetrics: IMetric[];
  protected readonly diskWriteOpsMetrics: IMetric[];
  protected readonly networkInMetrics: IMetric[];
  protected readonly networkOutMetrics: IMetric[];

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
      props
    );
    this.cpuUtilisationMetrics =
      metricFactory.metricAverageCpuUtilisationPercent();
    this.diskReadBytesMetrics = metricFactory.metricAverageDiskReadBytes();
    this.diskWriteBytesMetrics = metricFactory.metricAverageDiskWriteBytes();
    this.diskReadOpsMetrics = metricFactory.metricAverageDiskReadOps();
    this.diskWriteOpsMetrics = metricFactory.metricAverageDiskWriteOps();
    this.networkInMetrics = metricFactory.metricAverageNetworkInRateBytes();
    this.networkOutMetrics = metricFactory.metricAverageNetworkOutRateBytes();
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
      left: [...this.cpuUtilisationMetrics],
      leftYAxis: PercentageAxisFromZeroToHundred,
    });
  }

  protected createDiskWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Disk - Bytes",
      left: [...this.diskReadBytesMetrics, ...this.diskWriteBytesMetrics],
      leftYAxis: SizeAxisBytesFromZero,
    });
  }

  protected createDiskOpsWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Disk - OPS",
      left: [...this.diskReadOpsMetrics, ...this.diskWriteOpsMetrics],
      leftYAxis: CountAxisFromZero,
    });
  }

  protected createNetworkWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Network",
      left: [...this.networkInMetrics, ...this.networkOutMetrics],
      leftYAxis: SizeAxisBytesFromZero,
    });
  }
}
