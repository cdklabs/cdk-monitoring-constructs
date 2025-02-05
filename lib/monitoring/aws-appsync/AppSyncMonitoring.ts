import {
  GraphWidget,
  HorizontalAnnotation,
  IWidget,
} from "aws-cdk-lib/aws-cloudwatch";

import {
  AppSyncMetricFactory,
  AppSyncMetricFactoryProps,
} from "./AppSyncMetricFactory";
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
  HighTpsThreshold,
  LatencyAlarmFactory,
  LatencyThreshold,
  LatencyType,
  LowTpsThreshold,
  MetricWithAlarmSupport,
  Monitoring,
  MonitoringScope,
  QuarterWidth,
  RateAxisFromZero,
  RateComputationMethod,
  ThirdWidth,
  TimeAxisMillisFromZero,
  TpsAlarmFactory,
} from "../../common";
import {
  MonitoringHeaderWidget,
  MonitoringNamingStrategy,
} from "../../dashboard";

export interface AppSyncMonitoringOptions extends BaseMonitoringProps {
  readonly add4XXErrorCountAlarm?: Record<string, ErrorCountThreshold>;
  readonly add4XXErrorRateAlarm?: Record<string, ErrorRateThreshold>;
  readonly add5XXFaultCountAlarm?: Record<string, ErrorCountThreshold>;
  readonly add5XXFaultRateAlarm?: Record<string, ErrorRateThreshold>;

  readonly addLatencyP50Alarm?: Record<string, LatencyThreshold>;
  readonly addLatencyP90Alarm?: Record<string, LatencyThreshold>;
  readonly addLatencyP99Alarm?: Record<string, LatencyThreshold>;

  readonly addLowTpsAlarm?: Record<string, LowTpsThreshold>;
  readonly addHighTpsAlarm?: Record<string, HighTpsThreshold>;
}

export interface AppSyncMonitoringProps
  extends AppSyncMonitoringOptions,
    AppSyncMetricFactoryProps {}

export class AppSyncMonitoring extends Monitoring {
  readonly title: string;

  readonly namingStrategy: MonitoringNamingStrategy;
  readonly metricFactory: AppSyncMetricFactory;
  readonly alarmFactory: AlarmFactory;
  readonly errorAlarmFactory: ErrorAlarmFactory;
  readonly latencyAlarmFactory: LatencyAlarmFactory;
  readonly tpsAlarmFactory: TpsAlarmFactory;

  readonly tpsAnnotations: HorizontalAnnotation[];
  readonly latencyAnnotations: HorizontalAnnotation[];
  readonly errorCountAnnotations: HorizontalAnnotation[];
  readonly errorRateAnnotations: HorizontalAnnotation[];

  readonly tpsMetric: MetricWithAlarmSupport;
  readonly p50LatencyMetric: MetricWithAlarmSupport;
  readonly p90LatencyMetric: MetricWithAlarmSupport;
  readonly p99LatencyMetric: MetricWithAlarmSupport;
  readonly fault5xxCountMetric: MetricWithAlarmSupport;
  readonly fault5xxRateMetric: MetricWithAlarmSupport;
  readonly error4xxCountMetric: MetricWithAlarmSupport;
  readonly error4xxRateMetric: MetricWithAlarmSupport;

  constructor(scope: MonitoringScope, props: AppSyncMonitoringProps) {
    super(scope, props);

    this.namingStrategy = new MonitoringNamingStrategy({ ...props });
    this.title = this.namingStrategy.resolveHumanReadableName();
    this.metricFactory = new AppSyncMetricFactory(
      scope.createMetricFactory(),
      props,
    );
    this.alarmFactory = this.createAlarmFactory(
      this.namingStrategy.resolveAlarmFriendlyName(),
    );
    this.errorAlarmFactory = new ErrorAlarmFactory(this.alarmFactory);
    this.latencyAlarmFactory = new LatencyAlarmFactory(this.alarmFactory);
    this.tpsAlarmFactory = new TpsAlarmFactory(this.alarmFactory);

    this.tpsAnnotations = [];
    this.latencyAnnotations = [];
    this.errorCountAnnotations = [];
    this.errorRateAnnotations = [];

    this.tpsMetric = this.metricFactory.metricRequestRate(
      RateComputationMethod.PER_SECOND,
    );
    this.p50LatencyMetric = this.metricFactory.metricLatencyP50InMillis();
    this.p90LatencyMetric = this.metricFactory.metricLatencyP90InMillis();
    this.p99LatencyMetric = this.metricFactory.metricLatencyP99InMillis();
    this.fault5xxCountMetric = this.metricFactory.metric5XXFaultCount();
    this.fault5xxRateMetric = this.metricFactory.metric5XXFaultRate();
    this.error4xxCountMetric = this.metricFactory.metric4XXErrorCount();
    this.error4xxRateMetric = this.metricFactory.metric4XXErrorRate();

    for (const disambiguator in props.addLatencyP50Alarm) {
      const alarmProps = props.addLatencyP50Alarm[disambiguator];
      const createdAlarm = this.latencyAlarmFactory.addLatencyAlarm(
        this.p50LatencyMetric,
        LatencyType.P50,
        alarmProps,
        disambiguator,
      );
      this.latencyAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }

    for (const disambiguator in props.addLatencyP90Alarm) {
      const alarmProps = props.addLatencyP90Alarm[disambiguator];
      const createdAlarm = this.latencyAlarmFactory.addLatencyAlarm(
        this.p90LatencyMetric,
        LatencyType.P90,
        alarmProps,
        disambiguator,
      );
      this.latencyAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }

    for (const disambiguator in props.addLatencyP99Alarm) {
      const alarmProps = props.addLatencyP99Alarm[disambiguator];
      const createdAlarm = this.latencyAlarmFactory.addLatencyAlarm(
        this.p99LatencyMetric,
        LatencyType.P99,
        alarmProps,
        disambiguator,
      );
      this.latencyAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }

    for (const disambiguator in props.add4XXErrorCountAlarm) {
      const alarmProps = props.add4XXErrorCountAlarm[disambiguator];
      const createdAlarm = this.errorAlarmFactory.addErrorCountAlarm(
        this.error4xxCountMetric,
        ErrorType.ERROR,
        alarmProps,
        disambiguator,
      );
      this.errorCountAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }

    for (const disambiguator in props.add4XXErrorRateAlarm) {
      const alarmProps = props.add4XXErrorRateAlarm[disambiguator];
      const createdAlarm = this.errorAlarmFactory.addErrorRateAlarm(
        this.error4xxRateMetric,
        ErrorType.ERROR,
        alarmProps,
        disambiguator,
      );
      this.errorRateAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }

    for (const disambiguator in props.add5XXFaultCountAlarm) {
      const alarmProps = props.add5XXFaultCountAlarm[disambiguator];
      const createdAlarm = this.errorAlarmFactory.addErrorCountAlarm(
        this.fault5xxCountMetric,
        ErrorType.FAULT,
        alarmProps,
        disambiguator,
      );
      this.errorCountAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }

    for (const disambiguator in props.add5XXFaultRateAlarm) {
      const alarmProps = props.add5XXFaultRateAlarm[disambiguator];
      const createdAlarm = this.errorAlarmFactory.addErrorRateAlarm(
        this.fault5xxRateMetric,
        ErrorType.FAULT,
        alarmProps,
        disambiguator,
      );
      this.errorRateAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }

    for (const disambiguator in props.addLowTpsAlarm) {
      const alarmProps = props.addLowTpsAlarm[disambiguator];
      const createdAlarm = this.tpsAlarmFactory.addMinTpsAlarm(
        this.tpsMetric,
        alarmProps,
        disambiguator,
      );
      this.tpsAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }

    for (const disambiguator in props.addHighTpsAlarm) {
      const alarmProps = props.addHighTpsAlarm[disambiguator];
      const createdAlarm = this.tpsAlarmFactory.addMaxTpsAlarm(
        this.tpsMetric,
        alarmProps,
        disambiguator,
      );
      this.tpsAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }

    props.useCreatedAlarms?.consume(this.createdAlarms());
  }

  summaryWidgets(): IWidget[] {
    return [
      this.createtTitleWidget(),
      this.createTpsWidget(ThirdWidth, DefaultSummaryWidgetHeight),
      this.createLatencyWidget(ThirdWidth, DefaultSummaryWidgetHeight),
      this.createErrorRateWidget(ThirdWidth, DefaultSummaryWidgetHeight),
    ];
  }

  widgets(): IWidget[] {
    return [
      this.createtTitleWidget(),
      this.createTpsWidget(QuarterWidth, DefaultGraphWidgetHeight),
      this.createLatencyWidget(QuarterWidth, DefaultGraphWidgetHeight),
      this.createErrorCountWidget(QuarterWidth, DefaultGraphWidgetHeight),
      this.createErrorRateWidget(QuarterWidth, DefaultGraphWidgetHeight),
    ];
  }

  createtTitleWidget() {
    return new MonitoringHeaderWidget({
      family: "AppSync GraphQL API",
      title: this.title,
    });
  }

  createTpsWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "TPS",
      left: [this.tpsMetric],
      leftAnnotations: this.tpsAnnotations,
      leftYAxis: RateAxisFromZero,
    });
  }

  createLatencyWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Latency",
      left: [
        this.p50LatencyMetric,
        this.p90LatencyMetric,
        this.p99LatencyMetric,
      ],
      leftAnnotations: this.latencyAnnotations,
      leftYAxis: TimeAxisMillisFromZero,
    });
  }

  createErrorCountWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Errors",
      left: [this.error4xxCountMetric, this.fault5xxCountMetric],
      leftAnnotations: this.errorCountAnnotations,
      leftYAxis: CountAxisFromZero,
    });
  }

  createErrorRateWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Errors (rate)",
      left: [this.error4xxRateMetric, this.fault5xxRateMetric],
      leftAnnotations: this.errorRateAnnotations,
      leftYAxis: RateAxisFromZero,
    });
  }
}
