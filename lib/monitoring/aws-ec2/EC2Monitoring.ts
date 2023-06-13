import {GraphWidget, IMetric, IWidget} from "aws-cdk-lib/aws-cloudwatch";

import {EC2MetricFactory, EC2MetricFactoryProps} from "./EC2MetricFactory";
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
import {MonitoringHeaderWidget, MonitoringNamingStrategy} from "../../dashboard";

export interface EC2MonitoringOptions extends EC2MetricFactoryProps, BaseMonitoringProps {}

export interface EC2MonitoringProps extends EC2MonitoringOptions {}

export class EC2Monitoring extends Monitoring {
    readonly family: string;
    readonly title: string;

    readonly cpuUtilisationMetrics: IMetric[];
    readonly diskReadBytesMetrics: IMetric[];
    readonly diskWriteBytesMetrics: IMetric[];
    readonly diskReadOpsMetrics: IMetric[];
    readonly diskWriteOpsMetrics: IMetric[];
    readonly networkInMetrics: IMetric[];
    readonly networkOutMetrics: IMetric[];

    constructor(scope: MonitoringScope, props: EC2MonitoringProps) {
        super(scope, props);

        const fallbackConstructName = props.autoScalingGroup ? props.autoScalingGroup.autoScalingGroupName : "All Instances";
        const namingStrategy = new MonitoringNamingStrategy({
            ...props,
            fallbackConstructName,
        });
        this.family = props.autoScalingGroup ? "EC2 Auto Scaling Group" : "EC2";
        this.title = namingStrategy.resolveHumanReadableName();

        const metricFactory = new EC2MetricFactory(scope.createMetricFactory(), props);
        this.cpuUtilisationMetrics = metricFactory.metricAverageCpuUtilisationPercent();
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

    createTitleWidget() {
        return new MonitoringHeaderWidget({
            family: this.family,
            title: this.title,
        });
    }

    createCpuWidget(width: number, height: number) {
        return new GraphWidget({
            width,
            height,
            title: "CPU Utilization",
            left: [...this.cpuUtilisationMetrics],
            leftYAxis: PercentageAxisFromZeroToHundred,
        });
    }

    createDiskWidget(width: number, height: number) {
        return new GraphWidget({
            width,
            height,
            title: "Disk - Bytes",
            left: [...this.diskReadBytesMetrics, ...this.diskWriteBytesMetrics],
            leftYAxis: SizeAxisBytesFromZero,
        });
    }

    createDiskOpsWidget(width: number, height: number) {
        return new GraphWidget({
            width,
            height,
            title: "Disk - OPS",
            left: [...this.diskReadOpsMetrics, ...this.diskWriteOpsMetrics],
            leftYAxis: CountAxisFromZero,
        });
    }

    createNetworkWidget(width: number, height: number) {
        return new GraphWidget({
            width,
            height,
            title: "Network",
            left: [...this.networkInMetrics, ...this.networkOutMetrics],
            leftYAxis: SizeAxisBytesFromZero,
        });
    }
}
