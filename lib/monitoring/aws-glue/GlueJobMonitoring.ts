import { GraphWidget, IWidget } from "monocdk/aws-cloudwatch";

import {
  BaseMonitoringProps,
  CountAxisFromZero,
  DefaultGraphWidgetHeight,
  DefaultSummaryWidgetHeight,
  HalfWidth,
  MetricWithAlarmSupport,
  Monitoring,
  MonitoringScope,
  PercentageAxisFromZeroToHundred,
  QuarterWidth,
  SizeAxisBytesFromZero,
} from "../../common";
import {
  MonitoringHeaderWidget,
  MonitoringNamingStrategy,
} from "../../dashboard";
import { GlueJobMetricFactory } from "./GlueJobMetricFactory";

export interface GlueJobMonitoringProps extends BaseMonitoringProps {
  readonly jobName: string;
}

export class GlueJobMonitoring extends Monitoring {
  protected readonly title: string;

  protected readonly bytesReadFromS3Metric: MetricWithAlarmSupport;
  protected readonly bytesWrittenToS3Metric: MetricWithAlarmSupport;
  protected readonly cpuUsageMetric: MetricWithAlarmSupport;
  protected readonly heapMemoryUsageMetric: MetricWithAlarmSupport;
  protected readonly activeExecutorsMetric: MetricWithAlarmSupport;
  protected readonly completedStagesMetric: MetricWithAlarmSupport;
  protected readonly neededExecutorsMetric: MetricWithAlarmSupport;

  constructor(scope: MonitoringScope, props: GlueJobMonitoringProps) {
    super(scope, props);

    const fallbackConstructName = props.jobName;
    const namingStrategy = new MonitoringNamingStrategy({
      ...props,
      fallbackConstructName,
    });
    this.title = namingStrategy.resolveHumanReadableName();

    const metricFactory = new GlueJobMetricFactory(
      scope.createMetricFactory(),
      props.jobName
    );
    this.bytesReadFromS3Metric = metricFactory.metricTotalReadBytesFromS3();
    this.bytesWrittenToS3Metric = metricFactory.metricTotalWrittenBytesToS3();
    this.cpuUsageMetric =
      metricFactory.metricAverageExecutorCpuUsagePercentage();
    this.heapMemoryUsageMetric =
      metricFactory.metricAverageExecutorMemoryUsagePercentage();
    this.activeExecutorsMetric = metricFactory.metricActiveExecutorsAverage();
    this.completedStagesMetric = metricFactory.metricCompletedStagesSum();
    this.neededExecutorsMetric = metricFactory.metricMaximumNeededExecutors();
  }

  summaryWidgets(): IWidget[] {
    return [
      // Title
      this.createTitleWidget(),
      // Job Execution
      this.createJobExecutionWidget(HalfWidth, DefaultSummaryWidgetHeight),
      // Usages
      this.createUtilizationWidget(HalfWidth, DefaultSummaryWidgetHeight),
    ];
  }

  widgets(): IWidget[] {
    return [
      // Title
      this.createTitleWidget(),
      // Job Execution
      this.createJobExecutionWidget(QuarterWidth, DefaultGraphWidgetHeight),
      // Data Movement
      this.createDataMovementWidget(QuarterWidth, DefaultGraphWidgetHeight),
      // CPU
      this.createCpuUtilizationWidget(QuarterWidth, DefaultGraphWidgetHeight),
      // Memory
      this.createMemoryUtilizationWidget(
        QuarterWidth,
        DefaultGraphWidgetHeight
      ),
    ];
  }

  protected createTitleWidget() {
    return new MonitoringHeaderWidget({
      family: "Glue Job",
      title: this.title,
    });
  }

  protected createJobExecutionWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Job Execution",
      left: [
        this.activeExecutorsMetric,
        this.neededExecutorsMetric,
        this.completedStagesMetric,
      ],
      leftYAxis: CountAxisFromZero,
    });
  }

  protected createDataMovementWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Data Movement",
      left: [this.bytesReadFromS3Metric, this.bytesWrittenToS3Metric],
      leftYAxis: SizeAxisBytesFromZero,
    });
  }

  protected createUtilizationWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "CPU/Memory Usage",
      left: [this.cpuUsageMetric, this.heapMemoryUsageMetric],
      leftYAxis: PercentageAxisFromZeroToHundred,
    });
  }

  protected createCpuUtilizationWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "CPU Usage",
      left: [this.cpuUsageMetric],
      leftYAxis: PercentageAxisFromZeroToHundred,
    });
  }

  protected createMemoryUtilizationWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Memory Usage",
      left: [this.heapMemoryUsageMetric],
      leftYAxis: PercentageAxisFromZeroToHundred,
    });
  }
}
