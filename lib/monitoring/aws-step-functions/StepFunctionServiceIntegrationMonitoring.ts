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
  StepFunctionServiceIntegrationMetricFactory,
  StepFunctionServiceIntegrationMetricFactoryProps,
} from "./StepFunctionServiceIntegrationMetricFactory";

export interface StepFunctionServiceIntegrationMonitoringProps
  extends StepFunctionServiceIntegrationMetricFactoryProps,
    BaseMonitoringProps {
  readonly addDurationP50Alarm?: Record<string, DurationThreshold>;
  readonly addDurationP90Alarm?: Record<string, DurationThreshold>;
  readonly addDurationP99Alarm?: Record<string, DurationThreshold>;

  readonly addFailedServiceIntegrationsCountAlarm?: Record<
    string,
    ErrorCountThreshold
  >;
  readonly addFailedServiceIntegrationsRateAlarm?: Record<
    string,
    ErrorRateThreshold
  >;
  readonly addTimedOutServiceIntegrationsCountAlarm?: Record<
    string,
    ErrorCountThreshold
  >;
}

export class StepFunctionServiceIntegrationMonitoring extends Monitoring {
  protected readonly title: string;

  protected readonly errorAlarmFactory: ErrorAlarmFactory;
  protected readonly durationAlarmFactory: LatencyAlarmFactory;

  protected readonly durationAnnotations: HorizontalAnnotation[];
  protected readonly errorCountAnnotations: HorizontalAnnotation[];
  protected readonly errorRateAnnotations: HorizontalAnnotation[];

  protected readonly p50DurationMetric: MetricWithAlarmSupport;
  protected readonly p90DurationMetric: MetricWithAlarmSupport;
  protected readonly p99DurationMetric: MetricWithAlarmSupport;
  protected readonly scheduledServiceIntegrationsMetric: MetricWithAlarmSupport;
  protected readonly startedServiceIntegrationsMetric: MetricWithAlarmSupport;
  protected readonly succeededServiceIntegrationsMetric: MetricWithAlarmSupport;
  protected readonly failedServiceIntegrationsMetric: MetricWithAlarmSupport;
  protected readonly failedServiceIntegrationRateMetric: MetricWithAlarmSupport;
  protected readonly timedOutServiceIntegrationsMetrics: MetricWithAlarmSupport;

  constructor(
    scope: MonitoringScope,
    props: StepFunctionServiceIntegrationMonitoringProps
  ) {
    super(scope, props);

    const fallbackConstructName = "Service Integration Task";
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

    const metricFactory = new StepFunctionServiceIntegrationMetricFactory(
      scope.createMetricFactory(),
      props
    );
    this.p50DurationMetric =
      metricFactory.metricServiceIntegrationRunTimeP50InMillis();
    this.p90DurationMetric =
      metricFactory.metricServiceIntegrationRunTimeP90InMillis();
    this.p99DurationMetric =
      metricFactory.metricServiceIntegrationRunTimeP99InMillis();
    this.scheduledServiceIntegrationsMetric =
      metricFactory.metricServiceIntegrationsScheduled();
    this.startedServiceIntegrationsMetric =
      metricFactory.metricServiceIntegrationsStarted();
    this.succeededServiceIntegrationsMetric =
      metricFactory.metricServiceIntegrationsSucceeded();
    this.failedServiceIntegrationsMetric =
      metricFactory.metricServiceIntegrationsFailed();
    this.failedServiceIntegrationRateMetric =
      metricFactory.metricServiceIntegrationsFailedRate();
    this.timedOutServiceIntegrationsMetrics =
      metricFactory.metricServiceIntegrationsTimedOut();

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
    for (const disambiguator in props.addFailedServiceIntegrationsCountAlarm) {
      const alarmProps =
        props.addFailedServiceIntegrationsCountAlarm[disambiguator];
      const createdAlarm = this.errorAlarmFactory.addErrorCountAlarm(
        this.failedServiceIntegrationsMetric,
        ErrorType.FAILURE,
        alarmProps,
        disambiguator
      );
      this.errorCountAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }
    for (const disambiguator in props.addFailedServiceIntegrationsRateAlarm) {
      const alarmProps =
        props.addFailedServiceIntegrationsRateAlarm[disambiguator];
      const createdAlarm = this.errorAlarmFactory.addErrorRateAlarm(
        this.failedServiceIntegrationRateMetric,
        ErrorType.FAILURE,
        alarmProps,
        disambiguator
      );
      this.errorRateAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }
    for (const disambiguator in props.addTimedOutServiceIntegrationsCountAlarm) {
      const alarmProps =
        props.addTimedOutServiceIntegrationsCountAlarm[disambiguator];
      const createdAlarm = this.errorAlarmFactory.addErrorCountAlarm(
        this.timedOutServiceIntegrationsMetrics,
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
        family: "States Service Integration",
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
          this.scheduledServiceIntegrationsMetric,
          this.startedServiceIntegrationsMetric,
          this.succeededServiceIntegrationsMetric,
          this.failedServiceIntegrationsMetric,
          this.timedOutServiceIntegrationsMetrics,
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
        family: "States Service Integration",
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
          this.scheduledServiceIntegrationsMetric,
          this.startedServiceIntegrationsMetric,
          this.succeededServiceIntegrationsMetric,
          this.failedServiceIntegrationsMetric,
          this.timedOutServiceIntegrationsMetrics,
        ],
        leftYAxis: CountAxisFromZero,
        leftAnnotations: this.errorCountAnnotations,
      }),
      // Fault Rate
      new GraphWidget({
        width: QuarterWidth,
        height: DefaultGraphWidgetHeight,
        title: "Errors (rate)",
        left: [this.failedServiceIntegrationRateMetric],
        leftAnnotations: this.errorRateAnnotations,
      }),
    ];
  }
}
