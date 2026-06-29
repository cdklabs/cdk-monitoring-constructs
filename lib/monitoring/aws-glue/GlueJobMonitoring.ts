import {
  GraphWidget,
  HorizontalAnnotation,
  IWidget,
  Metric,
} from "aws-cdk-lib/aws-cloudwatch";
import { Rule } from "aws-cdk-lib/aws-events";

import {
  GlueJobMetricFactory,
  GlueJobMetricFactoryProps,
} from "./GlueJobMetricFactory";
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

export interface GlueJobMonitoringOptions
  extends GlueJobMetricFactoryProps,
    BaseMonitoringProps {
  readonly addFailedTaskCountAlarm?: Record<string, ErrorCountThreshold>;
  readonly addFailedTaskRateAlarm?: Record<string, ErrorRateThreshold>;
  readonly addKilledTaskCountAlarm?: Record<string, ErrorCountThreshold>;
  readonly addKilledTaskRateAlarm?: Record<string, ErrorRateThreshold>;
  readonly addJobFailedStateCountAlarm?: Record<string, ErrorCountThreshold>;
  readonly addJobTimeoutStateCountAlarm?: Record<string, ErrorCountThreshold>;
}

export interface GlueJobMonitoringProps extends GlueJobMonitoringOptions {}

export class GlueJobMonitoring extends Monitoring {
  readonly title: string;

  readonly alarmFactory: AlarmFactory;
  readonly errorAlarmFactory: ErrorAlarmFactory;

  readonly errorCountAnnotations: HorizontalAnnotation[];
  readonly errorRateAnnotations: HorizontalAnnotation[];

  readonly bytesReadFromS3Metric: MetricWithAlarmSupport;
  readonly bytesWrittenToS3Metric: MetricWithAlarmSupport;
  readonly cpuUsageMetric: MetricWithAlarmSupport;
  readonly heapMemoryUsageMetric: MetricWithAlarmSupport;
  readonly activeExecutorsMetric: MetricWithAlarmSupport;
  readonly completedStagesMetric: MetricWithAlarmSupport;
  readonly neededExecutorsMetric: MetricWithAlarmSupport;
  readonly failedTaskCountMetric: MetricWithAlarmSupport;
  readonly failedTaskRateMetric: MetricWithAlarmSupport;
  readonly killedTaskCountMetric: MetricWithAlarmSupport;
  readonly killedTaskRateMetric: MetricWithAlarmSupport;
  readonly jobFailedStateMetric: MetricWithAlarmSupport;
  readonly jobTimeoutStateMetric: MetricWithAlarmSupport;

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
      props,
    );

    this.alarmFactory = this.createAlarmFactory(
      namingStrategy.resolveAlarmFriendlyName(),
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
        disambiguator,
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
        disambiguator,
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
        disambiguator,
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
        disambiguator,
      );
      this.errorRateAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }

    this.jobFailedStateMetric = this.createStateChangeMetric(
      props.jobName,
      "FAILED",
    );
    this.jobTimeoutStateMetric = this.createStateChangeMetric(
      props.jobName,
      "TIMEOUT",
    );

    for (const disambiguator in props.addJobFailedStateCountAlarm) {
      const alarmProps = props.addJobFailedStateCountAlarm[disambiguator];
      const createdAlarm = this.errorAlarmFactory.addErrorCountAlarm(
        this.jobFailedStateMetric,
        ErrorType.FAILURE,
        alarmProps,
        disambiguator,
      );
      this.errorCountAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }

    for (const disambiguator in props.addJobTimeoutStateCountAlarm) {
      const alarmProps = props.addJobTimeoutStateCountAlarm[disambiguator];
      const createdAlarm = this.errorAlarmFactory.addErrorCountAlarm(
        this.jobTimeoutStateMetric,
        ErrorType.TIMED_OUT,
        alarmProps,
        disambiguator,
      );
      this.errorCountAnnotations.push(createdAlarm.annotation);
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

  createTitleWidget() {
    return new MonitoringHeaderWidget({
      family: "Glue Job",
      title: this.title,
    });
  }

  createJobExecutionWidget(width: number, height: number) {
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

  createDataMovementWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Data Movement",
      left: [this.bytesReadFromS3Metric, this.bytesWrittenToS3Metric],
      leftYAxis: SizeAxisBytesFromZero,
    });
  }

  createUtilizationWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "CPU/Memory Usage",
      left: [this.cpuUsageMetric, this.heapMemoryUsageMetric],
      leftYAxis: PercentageAxisFromZeroToHundred,
    });
  }

  createErrorCountWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Errors",
      left: [
        this.failedTaskCountMetric,
        this.killedTaskCountMetric,
        this.jobFailedStateMetric,
        this.jobTimeoutStateMetric,
      ],
      leftYAxis: CountAxisFromZero,
      leftAnnotations: this.errorCountAnnotations,
    });
  }

  createErrorRateWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Errors (rate)",
      left: [this.failedTaskRateMetric, this.killedTaskRateMetric],
      leftYAxis: RateAxisFromZero,
      leftAnnotations: this.errorRateAnnotations,
    });
  }

  private createStateChangeMetric(
    jobName: string,
    state: string,
  ): MetricWithAlarmSupport {
    const rule = new Rule(this.scope, `GlueJob-${state}-StateChangeRule`, {
      description: `Event rule for catching ${jobName} ${state}`,
      eventPattern: {
        source: ["aws.glue"],
        detailType: ["Glue Job State Change"],
        detail: {
          jobName: [jobName],
          state: [state],
        },
      },
    });

    return new Metric({
      namespace: "AWS/Events",
      metricName: "TriggeredRules",
      dimensionsMap: {
        RuleName: rule.ruleName,
      },
      statistic: "Sum",
      label: `Job ${state}`,
    });
  }
}
