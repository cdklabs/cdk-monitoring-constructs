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

const DefaultLatencyTypesToRender = [
  LatencyType.P50,
  LatencyType.P90,
  LatencyType.P99,
];

export interface ApiGatewayMonitoringOptions extends BaseMonitoringProps {
  readonly addLatencyP50Alarm?: Record<string, LatencyThreshold>;
  readonly addLatencyP70Alarm?: Record<string, LatencyThreshold>;
  readonly addLatencyP90Alarm?: Record<string, LatencyThreshold>;
  readonly addLatencyP99Alarm?: Record<string, LatencyThreshold>;
  readonly addLatencyP999Alarm?: Record<string, LatencyThreshold>;
  readonly addLatencyP9999Alarm?: Record<string, LatencyThreshold>;
  readonly addLatencyP100Alarm?: Record<string, LatencyThreshold>;
  readonly addLatencyTM50Alarm?: Record<string, LatencyThreshold>;
  readonly addLatencyTM70Alarm?: Record<string, LatencyThreshold>;
  readonly addLatencyTM90Alarm?: Record<string, LatencyThreshold>;
  readonly addLatencyTM99Alarm?: Record<string, LatencyThreshold>;
  readonly addLatencyTM999Alarm?: Record<string, LatencyThreshold>;
  readonly addLatencyTM9999Alarm?: Record<string, LatencyThreshold>;
  readonly addLatencyAverageAlarm?: Record<string, LatencyThreshold>;
  readonly add4XXErrorCountAlarm?: Record<string, ErrorCountThreshold>;
  readonly add4XXErrorRateAlarm?: Record<string, ErrorRateThreshold>;
  readonly add5XXFaultCountAlarm?: Record<string, ErrorCountThreshold>;
  readonly add5XXFaultRateAlarm?: Record<string, ErrorRateThreshold>;
  readonly addLowTpsAlarm?: Record<string, LowTpsThreshold>;
  readonly addHighTpsAlarm?: Record<string, HighTpsThreshold>;

  /**
   * You can specify what latency types you want to be rendered in the dashboards.
   * Note: any latency type with an alarm will be also added automatically.
   * If the list is undefined, default values will be shown.
   * If the list is empty, only the latency types with an alarm will be shown (if any).
   * @default p50, p90, p99 (@see DefaultLatencyTypesToRender)
   */
  readonly latencyTypesToRender?: LatencyType[];
}

export interface ApiGatewayMonitoringProps
  extends ApiGatewayMetricFactoryProps,
    ApiGatewayMonitoringOptions {}

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
  protected readonly error4XXCountMetric: MetricWithAlarmSupport;
  protected readonly error4XXRateMetric: MetricWithAlarmSupport;
  protected readonly fault5XXCountMetric: MetricWithAlarmSupport;
  protected readonly fault5XXRateMetric: MetricWithAlarmSupport;

  // keys are LatencyType, but JSII doesn't like non-string types
  protected readonly latencyMetrics: Record<string, MetricWithAlarmSupport>;
  protected readonly latencyTypesToRender: string[];

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

    this.latencyMetrics = {};
    this.latencyTypesToRender = [
      ...(props.latencyTypesToRender ?? DefaultLatencyTypesToRender),
    ];

    this.error4XXCountMetric = metricFactory.metric4XXErrorCount();
    this.error4XXRateMetric = metricFactory.metric4XXErrorRate();
    this.fault5XXCountMetric = metricFactory.metric5XXFaultCount();
    this.fault5XXRateMetric = metricFactory.metric5XXFaultRate();

    const latencyAlarmDefinitions = {
      [LatencyType.P50]: props.addLatencyP50Alarm,
      [LatencyType.P70]: props.addLatencyP70Alarm,
      [LatencyType.P90]: props.addLatencyP90Alarm,
      [LatencyType.P99]: props.addLatencyP99Alarm,
      [LatencyType.P999]: props.addLatencyP999Alarm,
      [LatencyType.P9999]: props.addLatencyP9999Alarm,
      [LatencyType.P100]: props.addLatencyP100Alarm,
      [LatencyType.TM50]: props.addLatencyTM50Alarm,
      [LatencyType.TM70]: props.addLatencyTM70Alarm,
      [LatencyType.TM90]: props.addLatencyTM90Alarm,
      [LatencyType.TM99]: props.addLatencyTM99Alarm,
      [LatencyType.TM999]: props.addLatencyTM999Alarm,
      [LatencyType.TM9999]: props.addLatencyTM9999Alarm,
      [LatencyType.AVERAGE]: props.addLatencyAverageAlarm,
    };

    Object.values(LatencyType).forEach((latencyType) => {
      this.latencyMetrics[latencyType] =
        metricFactory.metricLatencyInMillis(latencyType);
    });

    for (const [latencyType, alarmDefinition] of Object.entries(
      latencyAlarmDefinitions
    )) {
      for (const disambiguator in alarmDefinition) {
        const alarmProps = alarmDefinition[disambiguator];
        const latencyTypeEnum = latencyType as LatencyType;
        const metric = this.latencyMetrics[latencyTypeEnum];
        const createdAlarm = this.latencyAlarmFactory.addLatencyAlarm(
          metric,
          latencyTypeEnum,
          alarmProps,
          disambiguator
        );
        this.latencyAnnotations.push(createdAlarm.annotation);
        this.latencyTypesToRender.push(latencyTypeEnum);
        this.addAlarm(createdAlarm);
      }
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
    const left = Array.from(new Set(this.latencyTypesToRender))
      .sort()
      .map((type) => this.latencyMetrics[type]);

    return new GraphWidget({
      width,
      height,
      title: "Latency",
      left,
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
