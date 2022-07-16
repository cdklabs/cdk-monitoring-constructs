import {
  GraphWidget,
  HorizontalAnnotation,
  IWidget,
} from "aws-cdk-lib/aws-cloudwatch";

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
  Monitoring,
  MonitoringScope,
  QuarterWidth,
  TimeAxisMillisFromZero,
} from "../../common";
import {
  MonitoringHeaderWidget,
  MonitoringNamingStrategy,
} from "../../dashboard";
import {
  StepFunctionActivityMetricFactory,
  StepFunctionActivityMetricFactoryProps,
} from "./StepFunctionActivityMetricFactory";

export interface StepFunctionActivityMonitoringProps
  extends StepFunctionActivityMetricFactoryProps,
    BaseMonitoringProps {
  readonly addDurationP50Alarm?: Record<string, DurationThreshold>;
  readonly addDurationP90Alarm?: Record<string, DurationThreshold>;
  readonly addDurationP99Alarm?: Record<string, DurationThreshold>;

  readonly addFailedActivitiesCountAlarm?: Record<string, ErrorCountThreshold>;
  readonly addFailedActivitiesRateAlarm?: Record<string, ErrorRateThreshold>;
  readonly addTimedOutActivitiesCountAlarm?: Record<
    string,
    ErrorCountThreshold
  >;
}

export class StepFunctionActivityMonitoring extends Monitoring {
  protected readonly title: string;

  protected readonly errorAlarmFactory: ErrorAlarmFactory;
  protected readonly durationAlarmFactory: LatencyAlarmFactory;

  protected readonly durationAnnotations: HorizontalAnnotation[];
  protected readonly errorCountAnnotations: HorizontalAnnotation[];
  protected readonly errorRateAnnotations: HorizontalAnnotation[];

  protected readonly p50DurationMetric: MetricWithAlarmSupport;
  protected readonly p90DurationMetric: MetricWithAlarmSupport;
  protected readonly p99DurationMetric: MetricWithAlarmSupport;
  protected readonly scheduledActivitiesMetric: MetricWithAlarmSupport;
  protected readonly startedActivitiesMetric: MetricWithAlarmSupport;
  protected readonly succeededActivitiesMetric: MetricWithAlarmSupport;
  protected readonly failedActivitiesMetric: MetricWithAlarmSupport;
  protected readonly failedActivitiesRateMetric: MetricWithAlarmSupport;
  protected readonly heartbeatTimedOutActivitiesMetrics: MetricWithAlarmSupport;
  protected readonly timedOutActivitiesMetrics: MetricWithAlarmSupport;

  constructor(
    scope: MonitoringScope,
    props: StepFunctionActivityMonitoringProps
  ) {
    super(scope, props);

    const fallbackConstructName = props.activity.activityName;
    const namingStrategy = new MonitoringNamingStrategy({
      ...props,
      fallbackConstructName,
    });
    this.title = namingStrategy.resolveHumanReadableName();

    const alarmFactory = this.createAlarmFactory(
      namingStrategy.resolveAlarmFriendlyName()
    );
    this.errorAlarmFactory = new ErrorAlarmFactory(alarmFactory);
    this.durationAlarmFactory = new LatencyAlarmFactory(alarmFactory);

    this.durationAnnotations = [];
    this.errorCountAnnotations = [];
    this.errorRateAnnotations = [];

    const metricFactory = new StepFunctionActivityMetricFactory(
      scope.createMetricFactory(),
      props
    );
    this.p50DurationMetric = metricFactory.metricActivityRunTimeP50InMillis();
    this.p90DurationMetric = metricFactory.metricActivityRunTimeP90InMillis();
    this.p99DurationMetric = metricFactory.metricActivityRunTimeP99InMillis();
    this.scheduledActivitiesMetric = metricFactory.metricActivitiesScheduled();
    this.startedActivitiesMetric = metricFactory.metricActivitiesStarted();
    this.succeededActivitiesMetric = metricFactory.metricActivitiesSucceeded();
    this.failedActivitiesMetric = metricFactory.metricActivitiesFailed();
    this.failedActivitiesRateMetric =
      metricFactory.metricActivitiesFailedRate();
    this.heartbeatTimedOutActivitiesMetrics =
      metricFactory.metricActivitiesHeartbeatTimedOut();
    this.timedOutActivitiesMetrics = metricFactory.metricActivitiesTimedOut();

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
    for (const disambiguator in props.addFailedActivitiesCountAlarm) {
      const alarmProps = props.addFailedActivitiesCountAlarm[disambiguator];
      const createdAlarm = this.errorAlarmFactory.addErrorCountAlarm(
        this.failedActivitiesMetric,
        ErrorType.FAILURE,
        alarmProps,
        disambiguator
      );
      this.errorCountAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }
    for (const disambiguator in props.addFailedActivitiesRateAlarm) {
      const alarmProps = props.addFailedActivitiesRateAlarm[disambiguator];
      const createdAlarm = this.errorAlarmFactory.addErrorRateAlarm(
        this.failedActivitiesRateMetric,
        ErrorType.FAILURE,
        alarmProps,
        disambiguator
      );
      this.errorRateAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }
    for (const disambiguator in props.addTimedOutActivitiesCountAlarm) {
      const alarmProps = props.addTimedOutActivitiesCountAlarm[disambiguator];
      const createdAlarm = this.errorAlarmFactory.addErrorCountAlarm(
        this.timedOutActivitiesMetrics,
        ErrorType.TIMED_OUT,
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
        family: "States Activity",
        title: this.title,
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
          this.scheduledActivitiesMetric,
          this.startedActivitiesMetric,
          this.succeededActivitiesMetric,
          this.failedActivitiesMetric,
          this.heartbeatTimedOutActivitiesMetrics,
          this.timedOutActivitiesMetrics,
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
        family: "States Activity",
        title: this.title,
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
          this.scheduledActivitiesMetric,
          this.startedActivitiesMetric,
          this.succeededActivitiesMetric,
          this.failedActivitiesMetric,
          this.heartbeatTimedOutActivitiesMetrics,
          this.timedOutActivitiesMetrics,
        ],
        leftYAxis: CountAxisFromZero,
        leftAnnotations: this.errorCountAnnotations,
      }),
      // Fault Rate
      new GraphWidget({
        width: QuarterWidth,
        height: DefaultGraphWidgetHeight,
        title: "Errors (rate)",
        left: [this.failedActivitiesRateMetric],
        leftAnnotations: this.errorRateAnnotations,
      }),
    ];
  }
}
