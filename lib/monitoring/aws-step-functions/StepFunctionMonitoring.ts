import {
  GraphWidget,
  HorizontalAnnotation,
  IWidget,
} from "monocdk/aws-cloudwatch";

import {
  BaseMonitoringProps,
  CountAxisFromZero,
  DefaultGraphWidgetHeight,
  DefaultSummaryWidgetHeight,
  DurationThreshold,
  ErrorAlarmFactory,
  ErrorCountThreshold,
  ErrorRateThreshold,
  ErrorType,
  HalfWidth,
  LatencyAlarmFactory,
  LatencyType,
  MetricWithAlarmSupport,
  MinRunningTaskCountThreshold,
  Monitoring,
  MonitoringScope,
  QuarterWidth,
  TaskHealthAlarmFactory,
  TimeAxisMillisFromZero,
} from "../../common";
import {
  MonitoringHeaderWidget,
  MonitoringNamingStrategy,
} from "../../dashboard";
import {
  StepFunctionMetricFactory,
  StepFunctionMetricFactoryProps,
} from "./StepFunctionMetricFactory";

export interface StepFunctionMonitoringOptions extends BaseMonitoringProps {
  readonly addDurationP50Alarm?: Record<string, DurationThreshold>;
  readonly addDurationP90Alarm?: Record<string, DurationThreshold>;
  readonly addDurationP99Alarm?: Record<string, DurationThreshold>;
  readonly addFailedExecutionCountAlarm?: Record<string, ErrorCountThreshold>;
  readonly addFailedExecutionRateAlarm?: Record<string, ErrorRateThreshold>;
  readonly addAbortedExecutionCountAlarm?: Record<string, ErrorCountThreshold>;
  readonly addThrottledExecutionCountAlarm?: Record<
    string,
    ErrorCountThreshold
  >;
  readonly addTimedOutExecutionCountAlarm?: Record<string, ErrorCountThreshold>;
  /**
   * Add minimum started execution count alarm for the stepfunctions.
   */
  readonly addMinStartedExecutionCountAlarm?: Record<
    string,
    MinRunningTaskCountThreshold
  >;
}

export interface StepFunctionMonitoringProps
  extends StepFunctionMetricFactoryProps,
    StepFunctionMonitoringOptions {}

export class StepFunctionMonitoring extends Monitoring {
  protected readonly title: string;
  protected readonly stateMachineUrl?: string;

  protected readonly errorAlarmFactory: ErrorAlarmFactory;
  protected readonly durationAlarmFactory: LatencyAlarmFactory;
  protected readonly taskHealthAlarmFactory: TaskHealthAlarmFactory;
  protected readonly durationAnnotations: HorizontalAnnotation[];
  protected readonly errorCountAnnotations: HorizontalAnnotation[];
  protected readonly errorRateAnnotations: HorizontalAnnotation[];

  protected readonly p50DurationMetric: MetricWithAlarmSupport;
  protected readonly p90DurationMetric: MetricWithAlarmSupport;
  protected readonly p99DurationMetric: MetricWithAlarmSupport;
  protected readonly startedExecutionsMetric: MetricWithAlarmSupport;
  protected readonly succeededExecutionsMetric: MetricWithAlarmSupport;
  protected readonly failedExecutionsMetric: MetricWithAlarmSupport;
  protected readonly failedExecutionRateMetric: MetricWithAlarmSupport;
  protected readonly abortedExecutionsMetric: MetricWithAlarmSupport;
  protected readonly throttledExecutionsMetric: MetricWithAlarmSupport;
  protected readonly timedOutExecutionsMetrics: MetricWithAlarmSupport;

  constructor(scope: MonitoringScope, props: StepFunctionMonitoringProps) {
    super(scope, props);

    const namedConstruct = props.stateMachine;
    const fallbackConstructName = namedConstruct.stateMachineArn;
    const stateMachineArn = namedConstruct.stateMachineArn;
    const namingStrategy = new MonitoringNamingStrategy({
      ...props,
      namedConstruct,
      fallbackConstructName,
    });
    this.title = namingStrategy.resolveHumanReadableName();
    this.stateMachineUrl = scope
      .createAwsConsoleUrlFactory()
      .getStateMachineUrl(stateMachineArn);

    const alarmFactory = this.createAlarmFactory(
      namingStrategy.resolveAlarmFriendlyName()
    );
    this.errorAlarmFactory = new ErrorAlarmFactory(alarmFactory);
    this.durationAlarmFactory = new LatencyAlarmFactory(alarmFactory);
    this.taskHealthAlarmFactory = new TaskHealthAlarmFactory(alarmFactory);
    this.durationAnnotations = [];
    this.errorCountAnnotations = [];
    this.errorRateAnnotations = [];

    const metricFactory = new StepFunctionMetricFactory(
      scope.createMetricFactory(),
      props
    );
    this.p50DurationMetric = metricFactory.metricExecutionTimeP50InMillis();
    this.p90DurationMetric = metricFactory.metricExecutionTimeP90InMillis();
    this.p99DurationMetric = metricFactory.metricExecutionTimeP99InMillis();
    this.startedExecutionsMetric = metricFactory.metricExecutionsStarted();
    this.succeededExecutionsMetric = metricFactory.metricExecutionsSucceeded();
    this.failedExecutionsMetric = metricFactory.metricExecutionsFailed();
    this.failedExecutionRateMetric = metricFactory.metricExecutionsFailedRate();
    this.abortedExecutionsMetric = metricFactory.metricExecutionsAborted();
    this.throttledExecutionsMetric = metricFactory.metricExecutionThrottled();
    this.timedOutExecutionsMetrics = metricFactory.metricExecutionsTimedOut();

    for (const disambiguator in props.addDurationP50Alarm) {
      const alarmProps = props.addDurationP50Alarm[disambiguator];
      const createdAlarm = this.durationAlarmFactory.addDurationAlarm(
        this.p50DurationMetric,
        LatencyType.P50,
        alarmProps,
        disambiguator
      );
      this.durationAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }
    for (const disambiguator in props.addDurationP90Alarm) {
      const alarmProps = props.addDurationP90Alarm[disambiguator];
      const createdAlarm = this.durationAlarmFactory.addDurationAlarm(
        this.p90DurationMetric,
        LatencyType.P90,
        alarmProps,
        disambiguator
      );
      this.durationAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }
    for (const disambiguator in props.addDurationP99Alarm) {
      const alarmProps = props.addDurationP99Alarm[disambiguator];
      const createdAlarm = this.durationAlarmFactory.addDurationAlarm(
        this.p99DurationMetric,
        LatencyType.P99,
        alarmProps,
        disambiguator
      );
      this.durationAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }
    for (const disambiguator in props.addFailedExecutionCountAlarm) {
      const alarmProps = props.addFailedExecutionCountAlarm[disambiguator];
      const createdAlarm = this.errorAlarmFactory.addErrorCountAlarm(
        this.failedExecutionsMetric,
        ErrorType.FAILURE,
        alarmProps,
        disambiguator
      );
      this.errorCountAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }
    for (const disambiguator in props.addFailedExecutionRateAlarm) {
      const alarmProps = props.addFailedExecutionRateAlarm[disambiguator];
      const createdAlarm = this.errorAlarmFactory.addErrorRateAlarm(
        this.failedExecutionRateMetric,
        ErrorType.FAILURE,
        alarmProps,
        disambiguator
      );
      this.errorRateAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }
    for (const disambiguator in props.addAbortedExecutionCountAlarm) {
      const alarmProps = props.addAbortedExecutionCountAlarm[disambiguator];
      const createdAlarm = this.errorAlarmFactory.addErrorCountAlarm(
        this.abortedExecutionsMetric,
        ErrorType.ABORTED,
        alarmProps,
        disambiguator
      );
      this.errorCountAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }
    for (const disambiguator in props.addThrottledExecutionCountAlarm) {
      const alarmProps = props.addThrottledExecutionCountAlarm[disambiguator];
      const createdAlarm = this.errorAlarmFactory.addErrorCountAlarm(
        this.throttledExecutionsMetric,
        ErrorType.THROTTLED,
        alarmProps,
        disambiguator
      );
      this.errorCountAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }
    for (const disambiguator in props.addTimedOutExecutionCountAlarm) {
      const alarmProps = props.addTimedOutExecutionCountAlarm[disambiguator];
      const createdAlarm = this.errorAlarmFactory.addErrorCountAlarm(
        this.timedOutExecutionsMetrics,
        ErrorType.TIMED_OUT,
        alarmProps,
        disambiguator
      );
      this.errorCountAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }
    for (const disambiguator in props.addMinStartedExecutionCountAlarm) {
      const alarmProps = props.addMinStartedExecutionCountAlarm[disambiguator];
      const createdAlarm =
        this.taskHealthAlarmFactory.addMinRunningTaskCountAlarm(
          this.startedExecutionsMetric,
          alarmProps,
          disambiguator
        );
      this.errorCountAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }

    props.useCreatedAlarms?.consume(this.createdAlarms());
  }

  summaryWidgets(): IWidget[] {
    return [
      // Title
      new MonitoringHeaderWidget({
        family: "State Machine",
        title: this.title,
        goToLinkUrl: this.stateMachineUrl,
      }),
      // Duration
      new GraphWidget({
        width: HalfWidth,
        height: DefaultSummaryWidgetHeight,
        title: "Duration",
        left: [
          this.p50DurationMetric,
          this.p90DurationMetric,
          this.p99DurationMetric,
        ],
        leftYAxis: TimeAxisMillisFromZero,
        leftAnnotations: this.durationAnnotations,
      }),
      // Statuses
      new GraphWidget({
        width: HalfWidth,
        height: DefaultSummaryWidgetHeight,
        title: "Executions",
        left: [
          this.startedExecutionsMetric,
          this.succeededExecutionsMetric,
          this.failedExecutionsMetric,
          this.abortedExecutionsMetric,
          this.throttledExecutionsMetric,
          this.timedOutExecutionsMetrics,
        ],
        leftYAxis: CountAxisFromZero,
        leftAnnotations: this.errorCountAnnotations,
      }),
    ];
  }

  widgets(): IWidget[] {
    return [
      // Title
      new MonitoringHeaderWidget({
        family: "State Machine",
        title: this.title,
        goToLinkUrl: this.stateMachineUrl,
      }),
      // Duration
      new GraphWidget({
        width: QuarterWidth,
        height: DefaultGraphWidgetHeight,
        title: "Duration",
        left: [
          this.p50DurationMetric,
          this.p90DurationMetric,
          this.p99DurationMetric,
        ],
        leftYAxis: TimeAxisMillisFromZero,
        leftAnnotations: this.durationAnnotations,
      }),
      // Statuses
      new GraphWidget({
        width: HalfWidth,
        height: DefaultGraphWidgetHeight,
        title: "Executions",
        left: [
          this.startedExecutionsMetric,
          this.succeededExecutionsMetric,
          this.failedExecutionsMetric,
          this.abortedExecutionsMetric,
          this.throttledExecutionsMetric,
          this.timedOutExecutionsMetrics,
        ],
        leftYAxis: CountAxisFromZero,
        leftAnnotations: this.errorCountAnnotations,
      }),
      // Fault Rate
      new GraphWidget({
        width: QuarterWidth,
        height: DefaultGraphWidgetHeight,
        title: "Errors (rate)",
        left: [this.failedExecutionRateMetric],
        leftAnnotations: this.errorRateAnnotations,
      }),
    ];
  }
}
