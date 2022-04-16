import {
  GraphWidget,
  HorizontalAnnotation,
  IWidget,
} from "aws-cdk-lib/aws-cloudwatch";

import {
  AlarmFactory,
  BaseMonitoringProps,
  CountAxisFromZero,
  DefaultGraphWidgetHeight,
  DefaultSummaryWidgetHeight,
  ErrorAlarmFactory,
  ErrorCountThreshold,
  ErrorRateThreshold,
  ErrorType,
  HalfQuarterWidth,
  HalfWidth,
  MetricWithAlarmSupport,
  Monitoring,
  MonitoringScope,
  PercentageAxisFromZeroToHundred,
  QuarterWidth,
  RateAxisFromZero,
  SizeAxisBytesFromZero,
} from "../../common";
import {
  MonitoringHeaderWidget,
  MonitoringNamingStrategy,
} from "../../dashboard";
import {
  GlueJobMetricFactory,
  GlueJobMetricFactoryProps,
} from "./GlueJobMetricFactory";

export interface GlueJobMonitoringOptions
  extends GlueJobMetricFactoryProps,
    BaseMonitoringProps {
  readonly addFailedTaskCountAlarm?: Record<string, ErrorCountThreshold>;
  readonly addFailedTaskRateAlarm?: Record<string, ErrorRateThreshold>;
  readonly addKilledTaskCountAlarm?: Record<string, ErrorCountThreshold>;
  readonly addKilledTaskRateAlarm?: Record<string, ErrorRateThreshold>;
}

export interface GlueJobMonitoringProps extends GlueJobMonitoringOptions {}

export class GlueJobMonitoring extends Monitoring {
  protected readonly title: string;

  protected readonly alarmFactory: AlarmFactory;
  protected readonly errorAlarmFactory: ErrorAlarmFactory;

  protected readonly errorCountAnnotations: HorizontalAnnotation[];
  protected readonly errorRateAnnotations: HorizontalAnnotation[];

  protected readonly bytesReadFromS3Metric: MetricWithAlarmSupport;
  protected readonly bytesWrittenToS3Metric: MetricWithAlarmSupport;
  protected readonly cpuUsageMetric: MetricWithAlarmSupport;
  protected readonly heapMemoryUsageMetric: MetricWithAlarmSupport;
  protected readonly activeExecutorsMetric: MetricWithAlarmSupport;
  protected readonly completedStagesMetric: MetricWithAlarmSupport;
  protected readonly neededExecutorsMetric: MetricWithAlarmSupport;
  protected readonly failedTaskCountMetric: MetricWithAlarmSupport;
  protected readonly failedTaskRateMetric: MetricWithAlarmSupport;
  protected readonly killedTaskCountMetric: MetricWithAlarmSupport;
  protected readonly killedTaskRateMetric: MetricWithAlarmSupport;

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
      props
    );

    this.alarmFactory = this.createAlarmFactory(
      namingStrategy.resolveAlarmFriendlyName()
    );
    this.errorAlarmFactory = new ErrorAlarmFactory(this.alarmFactory);

    this.errorCountAnnotations = [];
    this.errorRateAnnotations = [];

    this.bytesReadFromS3Metric = metricFactory.metricTotalReadBytesFromS3();
    this.bytesWrittenToS3Metric = metricFactory.metricTotalWrittenBytesToS3();
    this.cpuUsageMetric = metricFactory
      .metricAverageExecutorCpuUsagePercentage()
      .with({ label: "CPU" });
    this.heapMemoryUsageMetric = metricFactory
      .metricAverageExecutorMemoryUsagePercentage()
      .with({ label: "Heap" });
    this.activeExecutorsMetric = metricFactory.metricActiveExecutorsAverage();
    this.completedStagesMetric = metricFactory.metricCompletedStagesSum();
    this.neededExecutorsMetric = metricFactory.metricMaximumNeededExecutors();
    this.failedTaskCountMetric = metricFactory
      .metricFailedTasksSum()
      .with({ label: "Failed" });
    this.failedTaskRateMetric = metricFactory.metricFailedTasksRate();
    this.killedTaskCountMetric = metricFactory
      .metricKilledTasksSum()
      .with({ label: "Killed" });
    this.killedTaskRateMetric = metricFactory.metricKilledTasksRate();

    for (const disambiguator in props.addFailedTaskCountAlarm) {
      const alarmProps = props.addFailedTaskCountAlarm[disambiguator];
      const createdAlarm = this.errorAlarmFactory.addErrorCountAlarm(
        this.failedTaskCountMetric,
        ErrorType.FAULT,
        alarmProps,
        disambiguator
      );
      this.errorCountAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }

    for (const disambiguator in props.addFailedTaskRateAlarm) {
      const alarmProps = props.addFailedTaskRateAlarm[disambiguator];
      const createdAlarm = this.errorAlarmFactory.addErrorRateAlarm(
        this.failedTaskRateMetric,
        ErrorType.FAULT,
        alarmProps,
        disambiguator
      );
      this.errorRateAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }

    for (const disambiguator in props.addKilledTaskCountAlarm) {
      const alarmProps = props.addKilledTaskCountAlarm[disambiguator];
      const createdAlarm = this.errorAlarmFactory.addErrorCountAlarm(
        this.killedTaskCountMetric,
        ErrorType.KILLED,
        alarmProps,
        disambiguator
      );
      this.errorCountAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }

    for (const disambiguator in props.addKilledTaskRateAlarm) {
      const alarmProps = props.addKilledTaskRateAlarm[disambiguator];
      const createdAlarm = this.errorAlarmFactory.addErrorRateAlarm(
        this.killedTaskRateMetric,
        ErrorType.KILLED,
        alarmProps,
        disambiguator
      );
      this.errorRateAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }

    props.useCreatedAlarms?.consume(this.createdAlarms());
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
      // Usages
      this.createUtilizationWidget(QuarterWidth, DefaultGraphWidgetHeight),
      // Errors
      this.createErrorCountWidget(HalfQuarterWidth, DefaultGraphWidgetHeight),
      this.createErrorRateWidget(HalfQuarterWidth, DefaultGraphWidgetHeight),
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

  protected createErrorCountWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Errors",
      left: [this.failedTaskCountMetric, this.killedTaskCountMetric],
      leftYAxis: CountAxisFromZero,
      leftAnnotations: this.errorCountAnnotations,
    });
  }

  protected createErrorRateWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Errors (rate)",
      left: [this.failedTaskRateMetric, this.killedTaskRateMetric],
      leftYAxis: RateAxisFromZero,
      leftAnnotations: this.errorRateAnnotations,
    });
  }
}
