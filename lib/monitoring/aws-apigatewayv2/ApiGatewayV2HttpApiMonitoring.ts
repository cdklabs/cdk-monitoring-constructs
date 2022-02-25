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
  ApiGatewayV2HttpApiMetricFactory,
  ApiGatewayV2HttpApiMetricFactoryProps,
} from "./ApiGatewayV2HttpApiMetricFactory";

export interface ApiGatewayV2HttpApiMonitoringProps
  extends ApiGatewayV2HttpApiMetricFactoryProps,
    BaseMonitoringProps {
  readonly add4xxCountAlarm?: Record<string, ErrorCountThreshold>;
  readonly add4xxRateAlarm?: Record<string, ErrorRateThreshold>;

  readonly add5xxCountAlarm?: Record<string, ErrorCountThreshold>;
  readonly add5xxRateAlarm?: Record<string, ErrorRateThreshold>;

  readonly addLatencyP50Alarm?: Record<string, LatencyThreshold>;
  readonly addLatencyP90Alarm?: Record<string, LatencyThreshold>;
  readonly addLatencyP99Alarm?: Record<string, LatencyThreshold>;

  readonly addIntegrationLatencyP50Alarm?: Record<string, LatencyThreshold>;
  readonly addIntegrationLatencyP90Alarm?: Record<string, LatencyThreshold>;
  readonly addIntegrationLatencyP99Alarm?: Record<string, LatencyThreshold>;

  readonly addLowTpsAlarm?: Record<string, LowTpsThreshold>;
  readonly addHighTpsAlarm?: Record<string, HighTpsThreshold>;
}

export class ApiGatewayV2HttpApiMonitoring extends Monitoring {
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

  protected readonly error4xxCountMetric: MetricWithAlarmSupport;
  protected readonly error4xxRateMetric: MetricWithAlarmSupport;

  protected readonly error5xxCountMetric: MetricWithAlarmSupport;
  protected readonly error5xxRateMetric: MetricWithAlarmSupport;

  protected readonly p50LatencyMetric: MetricWithAlarmSupport;
  protected readonly p90LatencyMetric: MetricWithAlarmSupport;
  protected readonly p99LatencyMetric: MetricWithAlarmSupport;

  protected readonly p50IntegrationLatencyMetric: MetricWithAlarmSupport;
  protected readonly p90IntegrationLatencyMetric: MetricWithAlarmSupport;
  protected readonly p99IntegrationLatencyMetric: MetricWithAlarmSupport;

  constructor(
    scope: MonitoringScope,
    props: ApiGatewayV2HttpApiMonitoringProps
  ) {
    super(scope, props);

    const namingStrategy = new MonitoringNamingStrategy({
      ...props,
      namedConstruct: props.api,
      fallbackConstructName: props.api.httpApiId,
      humanReadableName: `${props.api.httpApiId} ${
        props.apiStage ?? "$default"
      } ${props.apiMethod ?? ""} ${props.apiResource ?? ""}`,
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

    const metricFactory = new ApiGatewayV2HttpApiMetricFactory(
      scope.createMetricFactory(),
      props
    );

    this.tpsMetric = metricFactory.metricTps();

    this.error4xxCountMetric = metricFactory.metric4xxCount();
    this.error4xxRateMetric = metricFactory.metric4xxRate();

    this.error5xxCountMetric = metricFactory.metric5xxCount();
    this.error5xxRateMetric = metricFactory.metric5xxRate();

    this.p50LatencyMetric = metricFactory.metricLatencyP50InMillis();
    this.p90LatencyMetric = metricFactory.metricLatencyP90InMillis();
    this.p99LatencyMetric = metricFactory.metricLatencyP99InMillis();

    this.p50IntegrationLatencyMetric =
      metricFactory.metricIntegrationLatencyP50InMillis();
    this.p90IntegrationLatencyMetric =
      metricFactory.metricIntegrationLatencyP90InMillis();
    this.p99IntegrationLatencyMetric =
      metricFactory.metricIntegrationLatencyP99InMillis();

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

    for (const disambiguator in props.addIntegrationLatencyP50Alarm) {
      const alarmProps = props.addIntegrationLatencyP50Alarm[disambiguator];
      const createdAlarm = this.latencyAlarmFactory.addLatencyAlarm(
        this.p50IntegrationLatencyMetric,
        LatencyType.P50,
        alarmProps,
        disambiguator
      );
      this.latencyAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }

    for (const disambiguator in props.addIntegrationLatencyP90Alarm) {
      const alarmProps = props.addIntegrationLatencyP90Alarm[disambiguator];
      const createdAlarm = this.latencyAlarmFactory.addLatencyAlarm(
        this.p90IntegrationLatencyMetric,
        LatencyType.P90,
        alarmProps,
        disambiguator
      );
      this.latencyAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }

    for (const disambiguator in props.addIntegrationLatencyP99Alarm) {
      const alarmProps = props.addIntegrationLatencyP99Alarm[disambiguator];
      const createdAlarm = this.latencyAlarmFactory.addLatencyAlarm(
        this.p99IntegrationLatencyMetric,
        LatencyType.P99,
        alarmProps,
        disambiguator
      );
      this.latencyAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }

    for (const disambiguator in props.add4xxCountAlarm) {
      const alarmProps = props.add4xxCountAlarm[disambiguator];
      const createdAlarm = this.errorAlarmFactory.addErrorCountAlarm(
        this.error4xxCountMetric,
        ErrorType.ERROR,
        alarmProps,
        disambiguator
      );
      this.errorCountAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }

    for (const disambiguator in props.add4xxRateAlarm) {
      const alarmProps = props.add4xxRateAlarm[disambiguator];
      const createdAlarm = this.errorAlarmFactory.addErrorRateAlarm(
        this.error4xxRateMetric,
        ErrorType.ERROR,
        alarmProps,
        disambiguator
      );
      this.errorRateAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }

    for (const disambiguator in props.add5xxCountAlarm) {
      const alarmProps = props.add5xxCountAlarm[disambiguator];
      const createdAlarm = this.errorAlarmFactory.addErrorCountAlarm(
        this.error5xxCountMetric,
        ErrorType.FAULT,
        alarmProps,
        disambiguator
      );
      this.errorCountAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }

    for (const disambiguator in props.add5xxRateAlarm) {
      const alarmProps = props.add5xxRateAlarm[disambiguator];
      const createdAlarm = this.errorAlarmFactory.addErrorRateAlarm(
        this.error5xxRateMetric,
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
      family: "API Gateway V2 HTTP Endpoint",
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
        this.p50IntegrationLatencyMetric,
        this.p90LatencyMetric,
        this.p90IntegrationLatencyMetric,
        this.p99LatencyMetric,
        this.p99IntegrationLatencyMetric,
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
      left: [this.error4xxCountMetric, this.error5xxCountMetric],
      leftAnnotations: this.errorCountAnnotations,
      leftYAxis: CountAxisFromZero,
    });
  }

  protected createErrorRateWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Errors (rate)",
      left: [this.error4xxRateMetric, this.error5xxRateMetric],
      leftYAxis: RateAxisFromZero,
      leftAnnotations: this.errorRateAnnotations,
    });
  }
}
