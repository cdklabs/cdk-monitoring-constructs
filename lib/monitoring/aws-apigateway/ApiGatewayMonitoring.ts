import {
  GraphWidget,
  HorizontalAnnotation,
  IWidget,
} from "monocdk/aws-cloudwatch";

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
  ThirdWidth,
  TimeAxisMillisFromZero,
  TpsAlarmFactory,
} from "../../common";
import {
  MonitoringHeaderWidget,
  MonitoringNamingStrategy,
} from "../../dashboard";
import {
  ApiGatewayMetricFactory,
  ApiGatewayMetricFactoryProps,
} from "./ApiGatewayMetricFactory";

export interface ApiGatewayMonitoringProps
  extends ApiGatewayMetricFactoryProps,
    BaseMonitoringProps {
  readonly addLatencyP50Alarm?: Record<string, LatencyThreshold>;
  readonly addLatencyP90Alarm?: Record<string, LatencyThreshold>;
  readonly addLatencyP99Alarm?: Record<string, LatencyThreshold>;
  readonly add4XXErrorCountAlarm?: Record<string, ErrorCountThreshold>;
  readonly add4XXErrorRateAlarm?: Record<string, ErrorRateThreshold>;
  readonly add5XXFaultCountAlarm?: Record<string, ErrorCountThreshold>;
  readonly add5XXFaultRateAlarm?: Record<string, ErrorRateThreshold>;
  readonly addLowTpsAlarm?: Record<string, LowTpsThreshold>;
  readonly addHighTpsAlarm?: Record<string, HighTpsThreshold>;
}

export class ApiGatewayMonitoring extends Monitoring {
  protected readonly title: string;

  protected readonly alarmFactory: AlarmFactory;
  protected readonly errorAlarmFactory: ErrorAlarmFactory;
  protected readonly tpsAlarmFactory: TpsAlarmFactory;
  protected readonly latencyAlarmFactory: LatencyAlarmFactory;

  protected readonly tpsAnnotations: HorizontalAnnotation[];
  protected readonly latencyAnnotations: HorizontalAnnotation[];
  protected readonly errorCountAnnotations: HorizontalAnnotation[];
  protected readonly errorRateAnnotations: HorizontalAnnotation[];

  protected readonly tpsMetric: MetricWithAlarmSupport;
  protected readonly p50LatencyMetric: MetricWithAlarmSupport;
  protected readonly p90LatencyMetric: MetricWithAlarmSupport;
  protected readonly p99LatencyMetric: MetricWithAlarmSupport;
  protected readonly error4XXCountMetric: MetricWithAlarmSupport;
  protected readonly error4XXRateMetric: MetricWithAlarmSupport;
  protected readonly fault5XXCountMetric: MetricWithAlarmSupport;
  protected readonly fault5XXRateMetric: MetricWithAlarmSupport;

  constructor(scope: MonitoringScope, props: ApiGatewayMonitoringProps) {
    super(scope, props);

    // used when humanReadableName is not provided by user
    const fallbackNameArray = [props.api.restApiName];
    fallbackNameArray.push(props.apiStage ?? "prod");
    if (props.apiMethod) {
      fallbackNameArray.push(props.apiMethod);
    }
    if (props.apiResource) {
      fallbackNameArray.push(props.apiResource);
    }

    const namingStrategy = new MonitoringNamingStrategy({
      ...props,
      namedConstruct: props.api,
      fallbackConstructName: fallbackNameArray
        .join("-")
        .replace(/[^a-zA-Z0-9-_]/g, ""),
      humanReadableName: props.humanReadableName ?? fallbackNameArray.join(" "),
    });

    this.title = namingStrategy.resolveHumanReadableName();

    this.alarmFactory = this.createAlarmFactory(
      namingStrategy.resolveAlarmFriendlyName()
    );
    this.errorAlarmFactory = new ErrorAlarmFactory(this.alarmFactory);
    this.tpsAlarmFactory = new TpsAlarmFactory(this.alarmFactory);
    this.latencyAlarmFactory = new LatencyAlarmFactory(this.alarmFactory);

    this.tpsAnnotations = [];
    this.latencyAnnotations = [];
    this.errorCountAnnotations = [];
    this.errorRateAnnotations = [];

    const metricFactory = new ApiGatewayMetricFactory(
      scope.createMetricFactory(),
      props
    );
    this.tpsMetric = metricFactory.metricTps();
    this.p50LatencyMetric = metricFactory.metricLatencyP50InMillis();
    this.p90LatencyMetric = metricFactory.metricLatencyP90InMillis();
    this.p99LatencyMetric = metricFactory.metricLatencyP99InMillis();
    this.error4XXCountMetric = metricFactory.metric4XXErrorCount();
    this.error4XXRateMetric = metricFactory.metric4XXErrorRate();
    this.fault5XXCountMetric = metricFactory.metric5XXFaultCount();
    this.fault5XXRateMetric = metricFactory.metric5XXFaultRate();

    for (const disambiguator in props.addLatencyP50Alarm) {
      const alarmProps = props.addLatencyP50Alarm[disambiguator];
      const createdAlarm = this.latencyAlarmFactory.addLatencyAlarm(
        this.p50LatencyMetric,
        LatencyType.P50,
        alarmProps,
        disambiguator
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
        disambiguator
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
        disambiguator
      );
      this.latencyAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }
    for (const disambiguator in props.add5XXFaultCountAlarm) {
      const alarmProps = props.add5XXFaultCountAlarm[disambiguator];
      const createdAlarm = this.errorAlarmFactory.addErrorCountAlarm(
        this.fault5XXCountMetric,
        ErrorType.FAULT,
        alarmProps,
        disambiguator
      );
      this.errorCountAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }
    for (const disambiguator in props.add4XXErrorCountAlarm) {
      const alarmProps = props.add4XXErrorCountAlarm[disambiguator];
      const createdAlarm = this.errorAlarmFactory.addErrorCountAlarm(
        this.error4XXCountMetric,
        ErrorType.ERROR,
        alarmProps,
        disambiguator
      );
      this.errorCountAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }
    for (const disambiguator in props.add4XXErrorRateAlarm) {
      const alarmProps = props.add4XXErrorRateAlarm[disambiguator];
      const createdAlarm = this.errorAlarmFactory.addErrorRateAlarm(
        this.error4XXRateMetric,
        ErrorType.ERROR,
        alarmProps,
        disambiguator
      );
      this.errorRateAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }
    for (const disambiguator in props.add5XXFaultRateAlarm) {
      const alarmProps = props.add5XXFaultRateAlarm[disambiguator];
      const createdAlarm = this.errorAlarmFactory.addErrorRateAlarm(
        this.fault5XXRateMetric,
        ErrorType.FAULT,
        alarmProps,
        disambiguator
      );
      this.errorRateAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }
    for (const disambiguator in props.addLowTpsAlarm) {
      const alarmProps = props.addLowTpsAlarm[disambiguator];
      const createdAlarm = this.tpsAlarmFactory.addMinTpsAlarm(
        this.tpsMetric,
        alarmProps,
        disambiguator
      );
      this.tpsAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }
    for (const disambiguator in props.addHighTpsAlarm) {
      const alarmProps = props.addHighTpsAlarm[disambiguator];
      const createdAlarm = this.tpsAlarmFactory.addMaxTpsAlarm(
        this.tpsMetric,
        alarmProps,
        disambiguator
      );
      this.tpsAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }
    props.useCreatedAlarms?.consume(this.createdAlarms());
  }

  summaryWidgets(): IWidget[] {
    return [
      this.createTitleWidget(),
      this.createTpsWidget(ThirdWidth, DefaultSummaryWidgetHeight),
      this.createLatencyWidget(ThirdWidth, DefaultSummaryWidgetHeight),
      this.createErrorRateWidget(ThirdWidth, DefaultSummaryWidgetHeight),
    ];
  }

  widgets(): IWidget[] {
    return [
      this.createTitleWidget(),
      this.createTpsWidget(QuarterWidth, DefaultGraphWidgetHeight),
      this.createLatencyWidget(QuarterWidth, DefaultGraphWidgetHeight),
      this.createErrorCountWidget(QuarterWidth, DefaultGraphWidgetHeight),
      this.createErrorRateWidget(QuarterWidth, DefaultGraphWidgetHeight),
    ];
  }

  protected createTitleWidget() {
    return new MonitoringHeaderWidget({
      family: "API Gateway Endpoint",
      title: this.title,
    });
  }

  protected createTpsWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "TPS",
      left: [this.tpsMetric],
      leftYAxis: CountAxisFromZero,
      leftAnnotations: this.tpsAnnotations,
    });
  }

  protected createLatencyWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Latency",
      left: [
        this.p50LatencyMetric,
        this.p90LatencyMetric,
        this.p99LatencyMetric,
      ],
      leftYAxis: TimeAxisMillisFromZero,
      leftAnnotations: this.latencyAnnotations,
    });
  }

  protected createErrorCountWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Errors",
      left: [this.error4XXCountMetric, this.fault5XXCountMetric],
      leftYAxis: CountAxisFromZero,
      leftAnnotations: this.errorCountAnnotations,
    });
  }

  protected createErrorRateWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Errors (rate)",
      left: [this.error4XXRateMetric, this.fault5XXRateMetric],
      leftYAxis: RateAxisFromZero,
      leftAnnotations: this.errorRateAnnotations,
    });
  }
}
