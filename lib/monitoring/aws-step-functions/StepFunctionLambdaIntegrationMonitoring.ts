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
  StepFunctionLambdaIntegrationMetricFactory,
  StepFunctionLambdaIntegrationMetricFactoryProps,
} from "./StepFunctionLambdaIntegrationMetricFactory";

export interface StepFunctionLambdaIntegrationMonitoringProps
  extends StepFunctionLambdaIntegrationMetricFactoryProps,
    BaseMonitoringProps {
  readonly addDurationP50Alarm?: Record<string, DurationThreshold>;
  readonly addDurationP90Alarm?: Record<string, DurationThreshold>;
  readonly addDurationP99Alarm?: Record<string, DurationThreshold>;

  readonly addFailedFunctionsCountAlarm?: Record<string, ErrorCountThreshold>;
  readonly addFailedFunctionsRateAlarm?: Record<string, ErrorRateThreshold>;
  readonly addTimedOutFunctionsCountAlarm?: Record<string, ErrorCountThreshold>;
}

export class StepFunctionLambdaIntegrationMonitoring extends Monitoring {
  protected readonly title: string;
  protected readonly functionUrl?: string;

  protected readonly errorAlarmFactory: ErrorAlarmFactory;
  protected readonly durationAlarmFactory: LatencyAlarmFactory;

  protected readonly durationAnnotations: HorizontalAnnotation[];
  protected readonly errorCountAnnotations: HorizontalAnnotation[];
  protected readonly errorRateAnnotations: HorizontalAnnotation[];

  protected readonly p50DurationMetric: MetricWithAlarmSupport;
  protected readonly p90DurationMetric: MetricWithAlarmSupport;
  protected readonly p99DurationMetric: MetricWithAlarmSupport;
  protected readonly scheduledFunctionsMetric: MetricWithAlarmSupport;
  protected readonly startedFunctionsMetric: MetricWithAlarmSupport;
  protected readonly succeededFunctionsMetric: MetricWithAlarmSupport;
  protected readonly failedFunctionsMetric: MetricWithAlarmSupport;
  protected readonly failedFunctionRateMetric: MetricWithAlarmSupport;
  protected readonly timedOutFunctionsMetrics: MetricWithAlarmSupport;

  constructor(
    scope: MonitoringScope,
    props: StepFunctionLambdaIntegrationMonitoringProps
  ) {
    super(scope, props);

    const fallbackConstructName = props.lambdaFunction.functionName;
    const namingStrategy = new MonitoringNamingStrategy({
      ...props,
      fallbackConstructName,
    });
    this.title = namingStrategy.resolveHumanReadableName();
    this.functionUrl = scope
      .createAwsConsoleUrlFactory()
      .getLambdaFunctionUrl(props.lambdaFunction.functionName);

    const alarmFactory = this.createAlarmFactory(
      namingStrategy.resolveAlarmFriendlyName()
    );
    this.errorAlarmFactory = new ErrorAlarmFactory(alarmFactory);
    this.durationAlarmFactory = new LatencyAlarmFactory(alarmFactory);

    this.durationAnnotations = [];
    this.errorCountAnnotations = [];
    this.errorRateAnnotations = [];

    const metricFactory = new StepFunctionLambdaIntegrationMetricFactory(
      scope.createMetricFactory(),
      props
    );
    this.p50DurationMetric = metricFactory.metricFunctionRunTimeP50InMillis();
    this.p90DurationMetric = metricFactory.metricFunctionRunTimeP90InMillis();
    this.p99DurationMetric = metricFactory.metricFunctionRunTimeP99InMillis();
    this.scheduledFunctionsMetric = metricFactory.metricFunctionsScheduled();
    this.startedFunctionsMetric = metricFactory.metricFunctionsStarted();
    this.succeededFunctionsMetric = metricFactory.metricFunctionsSucceeded();
    this.failedFunctionsMetric = metricFactory.metricFunctionsFailed();
    this.failedFunctionRateMetric = metricFactory.metricFunctionsFailedRate();
    this.timedOutFunctionsMetrics = metricFactory.metricFunctionsTimedOut();

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
    for (const disambiguator in props.addFailedFunctionsCountAlarm) {
      const alarmProps = props.addFailedFunctionsCountAlarm[disambiguator];
      const createdAlarm = this.errorAlarmFactory.addErrorCountAlarm(
        this.failedFunctionsMetric,
        ErrorType.FAILURE,
        alarmProps,
        disambiguator
      );
      this.errorCountAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }
    for (const disambiguator in props.addFailedFunctionsRateAlarm) {
      const alarmProps = props.addFailedFunctionsRateAlarm[disambiguator];
      const createdAlarm = this.errorAlarmFactory.addErrorRateAlarm(
        this.failedFunctionRateMetric,
        ErrorType.FAILURE,
        alarmProps,
        disambiguator
      );
      this.errorRateAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }
    for (const disambiguator in props.addTimedOutFunctionsCountAlarm) {
      const alarmProps = props.addTimedOutFunctionsCountAlarm[disambiguator];
      const createdAlarm = this.errorAlarmFactory.addErrorCountAlarm(
        this.timedOutFunctionsMetrics,
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
        family: "States Lambda Integration",
        title: this.title,
        goToLinkUrl: this.functionUrl,
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
          this.scheduledFunctionsMetric,
          this.startedFunctionsMetric,
          this.succeededFunctionsMetric,
          this.failedFunctionsMetric,
          this.timedOutFunctionsMetrics,
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
        family: "States Lambda Integration",
        title: this.title,
        goToLinkUrl: this.functionUrl,
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
          this.scheduledFunctionsMetric,
          this.startedFunctionsMetric,
          this.succeededFunctionsMetric,
          this.failedFunctionsMetric,
          this.timedOutFunctionsMetrics,
        ],
        leftYAxis: CountAxisFromZero,
        leftAnnotations: this.errorCountAnnotations,
      }),
      // Fault Rate
      new GraphWidget({
        width: QuarterWidth,
        height: DefaultGraphWidgetHeight,
        title: "Errors (rate)",
        left: [this.failedFunctionRateMetric],
        leftAnnotations: this.errorRateAnnotations,
      }),
    ];
  }
}
