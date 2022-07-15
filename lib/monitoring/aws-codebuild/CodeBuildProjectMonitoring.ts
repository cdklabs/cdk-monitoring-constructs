import {
  GraphWidget,
  HorizontalAnnotation,
  IWidget,
} from "aws-cdk-lib/aws-cloudwatch";
import { CfnProject, IProject } from "aws-cdk-lib/aws-codebuild";

import {
  BaseMonitoringProps,
  CountAxisFromZero,
  DefaultGraphWidgetHeight,
  DurationThreshold,
  ErrorAlarmFactory,
  ErrorCountThreshold,
  ErrorRateThreshold,
  ErrorType,
  LatencyAlarmFactory,
  LatencyType,
  MetricWithAlarmSupport,
  Monitoring,
  MonitoringScope,
  RateAxisFromZero,
  ThirdWidth,
  TimeAxisSecondsFromZero,
} from "../../common";
import {
  MonitoringHeaderWidget,
  MonitoringNamingStrategy,
} from "../../dashboard";
import {
  CodeBuildProjectMetricFactory,
  CodeBuildProjectMetricFactoryProps,
} from "./CodeBuildProjectMetricFactory";

export interface CodeBuildProjectMonitoringOptions extends BaseMonitoringProps {
  readonly addDurationP99Alarm?: Record<string, DurationThreshold>;
  readonly addDurationP90Alarm?: Record<string, DurationThreshold>;
  readonly addDurationP50Alarm?: Record<string, DurationThreshold>;

  readonly addFailedBuildCountAlarm?: Record<string, ErrorCountThreshold>;
  readonly addFailedBuildRateAlarm?: Record<string, ErrorRateThreshold>;
}

/**
 * Monitoring props for CodeBuild projects.
 */
export interface CodeBuildProjectMonitoringProps
  extends CodeBuildProjectMetricFactoryProps,
    CodeBuildProjectMonitoringOptions {}

export class CodeBuildProjectMonitoring extends Monitoring {
  protected readonly title: string;
  protected readonly projectUrl?: string;

  protected readonly errorAlarmFactory: ErrorAlarmFactory;
  protected readonly durationAlarmFactory: LatencyAlarmFactory;
  protected readonly durationAnnotations: HorizontalAnnotation[];
  protected readonly errorCountAnnotations: HorizontalAnnotation[];
  protected readonly errorRateAnnotations: HorizontalAnnotation[];

  protected readonly buildCountMetric: MetricWithAlarmSupport;
  protected readonly succeededBuildCountMetric: MetricWithAlarmSupport;
  protected readonly failedBuildCountMetric: MetricWithAlarmSupport;
  protected readonly failedBuildRateMetric: MetricWithAlarmSupport;
  protected readonly durationP99InSecondsMetric: MetricWithAlarmSupport;
  protected readonly durationP90InSecondsMetric: MetricWithAlarmSupport;
  protected readonly durationP50InSecondsMetric: MetricWithAlarmSupport;

  constructor(scope: MonitoringScope, props: CodeBuildProjectMonitoringProps) {
    super(scope);

    const namingStrategy = new MonitoringNamingStrategy({
      ...props,
      namedConstruct: props.project,
      fallbackConstructName: this.resolveProjectName(props.project),
    });

    this.title = namingStrategy.resolveHumanReadableName();
    this.projectUrl = scope
      .createAwsConsoleUrlFactory()
      .getCodeBuildProjectUrl(props.project.projectName);

    const alarmFactory = this.createAlarmFactory(
      namingStrategy.resolveAlarmFriendlyName()
    );
    this.durationAlarmFactory = new LatencyAlarmFactory(alarmFactory);
    this.errorAlarmFactory = new ErrorAlarmFactory(alarmFactory);

    this.durationAnnotations = [];
    this.errorCountAnnotations = [];
    this.errorRateAnnotations = [];

    const metricFactory = new CodeBuildProjectMetricFactory(
      scope.createMetricFactory(),
      props
    );
    this.buildCountMetric = metricFactory.metricBuildCount();
    this.succeededBuildCountMetric = metricFactory.metricSucceededBuildCount();
    this.failedBuildCountMetric = metricFactory.metricFailedBuildCount();
    this.failedBuildRateMetric = metricFactory.metricFailedBuildRate();
    this.durationP99InSecondsMetric =
      metricFactory.metricDurationP99InSeconds();
    this.durationP90InSecondsMetric =
      metricFactory.metricDurationP90InSeconds();
    this.durationP50InSecondsMetric =
      metricFactory.metricDurationP50InSeconds();

    for (const disambiguator in props.addDurationP99Alarm) {
      const alarmProps = props.addDurationP99Alarm[disambiguator];
      const createdAlarm = this.durationAlarmFactory.addDurationAlarm(
        this.durationP99InSecondsMetric,
        LatencyType.P99,
        alarmProps,
        disambiguator
      );

      this.durationAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }

    for (const disambiguator in props.addDurationP90Alarm) {
      const alarmProps = props.addDurationP90Alarm[disambiguator];
      const createdAlarm = this.durationAlarmFactory.addDurationAlarm(
        this.durationP90InSecondsMetric,
        LatencyType.P90,
        alarmProps,
        disambiguator
      );

      this.durationAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }

    for (const disambiguator in props.addDurationP50Alarm) {
      const alarmProps = props.addDurationP50Alarm[disambiguator];
      const createdAlarm = this.durationAlarmFactory.addDurationAlarm(
        this.durationP50InSecondsMetric,
        LatencyType.P50,
        alarmProps,
        disambiguator
      );

      this.durationAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }

    for (const disambiguator in props.addFailedBuildCountAlarm) {
      const alarmProps = props.addFailedBuildCountAlarm[disambiguator];
      const createdAlarm = this.errorAlarmFactory.addErrorCountAlarm(
        this.failedBuildCountMetric,
        ErrorType.FAILURE,
        alarmProps,
        disambiguator
      );

      this.errorCountAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }

    for (const disambiguator in props.addFailedBuildRateAlarm) {
      const alarmProps = props.addFailedBuildRateAlarm[disambiguator];
      const createdAlarm = this.errorAlarmFactory.addErrorRateAlarm(
        this.failedBuildRateMetric,
        ErrorType.FAILURE,
        alarmProps,
        disambiguator
      );

      this.errorRateAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }

    props.useCreatedAlarms?.consume(this.createdAlarms());
  }

  widgets(): IWidget[] {
    return [
      this.createTitleWidget(),
      this.createBuildCountsWidget(),
      this.createDurationWidget(),
      this.createFailedBuildRateWidget(),
    ];
  }

  summaryWidgets(): IWidget[] {
    // TODO: verify sizes, mainly heights
    return this.widgets();
  }

  protected createTitleWidget() {
    return new MonitoringHeaderWidget({
      family: "CodeBuild Project",
      title: this.title,
      goToLinkUrl: this.projectUrl,
    });
  }

  protected createBuildCountsWidget() {
    return new GraphWidget({
      width: ThirdWidth,
      height: DefaultGraphWidgetHeight,
      title: "Builds",
      left: [
        this.buildCountMetric,
        this.succeededBuildCountMetric,
        this.failedBuildCountMetric,
      ],
      leftYAxis: CountAxisFromZero,
      leftAnnotations: this.errorCountAnnotations,
    });
  }

  protected createDurationWidget() {
    return new GraphWidget({
      width: ThirdWidth,
      height: DefaultGraphWidgetHeight,
      title: "Duration",
      left: [
        this.durationP50InSecondsMetric,
        this.durationP90InSecondsMetric,
        this.durationP99InSecondsMetric,
      ],
      leftYAxis: TimeAxisSecondsFromZero,
      leftAnnotations: this.durationAnnotations,
    });
  }

  protected createFailedBuildRateWidget() {
    return new GraphWidget({
      width: ThirdWidth,
      height: DefaultGraphWidgetHeight,
      title: "Failed Builds (rate)",
      left: [this.failedBuildRateMetric],
      leftYAxis: RateAxisFromZero,
      leftAnnotations: this.errorRateAnnotations,
    });
  }

  protected resolveProjectName(project: IProject): string | undefined {
    return (project.node.defaultChild as CfnProject)?.name;
  }
}
