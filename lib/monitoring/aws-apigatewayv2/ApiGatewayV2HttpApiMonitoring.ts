import {
  GraphWidget,
  HorizontalAnnotation,
  IMetric,
  IWidget,
} from "aws-cdk-lib/aws-cloudwatch";

import {
  ApiGatewayV2HttpApiMetricFactory,
  ApiGatewayV2HttpApiMetricFactoryProps,
} from "./ApiGatewayV2HttpApiMetricFactory";
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

const DefaultLatencyTypesToRender = [
  LatencyType.P50,
  LatencyType.P90,
  LatencyType.P99,
];

export interface ApiGatewayV2MonitoringOptions extends BaseMonitoringProps {
  readonly add4xxCountAlarm?: Record<string, ErrorCountThreshold>;
  readonly add4xxRateAlarm?: Record<string, ErrorRateThreshold>;
  readonly add5xxCountAlarm?: Record<string, ErrorCountThreshold>;
  readonly add5xxRateAlarm?: Record<string, ErrorRateThreshold>;

  readonly addLatencyP50Alarm?: Record<string, LatencyThreshold>;
  readonly addLatencyP70Alarm?: Record<string, LatencyThreshold>;
  readonly addLatencyP90Alarm?: Record<string, LatencyThreshold>;
  readonly addLatencyP95Alarm?: Record<string, LatencyThreshold>;
  readonly addLatencyP99Alarm?: Record<string, LatencyThreshold>;
  readonly addLatencyP999Alarm?: Record<string, LatencyThreshold>;
  readonly addLatencyP9999Alarm?: Record<string, LatencyThreshold>;
  readonly addLatencyP100Alarm?: Record<string, LatencyThreshold>;

  readonly addLatencyTM50Alarm?: Record<string, LatencyThreshold>;
  readonly addLatencyTM70Alarm?: Record<string, LatencyThreshold>;
  readonly addLatencyTM90Alarm?: Record<string, LatencyThreshold>;
  readonly addLatencyTM95Alarm?: Record<string, LatencyThreshold>;
  readonly addLatencyTM99Alarm?: Record<string, LatencyThreshold>;
  readonly addLatencyTM999Alarm?: Record<string, LatencyThreshold>;
  readonly addLatencyTM9999Alarm?: Record<string, LatencyThreshold>;

  readonly addLatencyTM95OutlierAlarm?: Record<string, LatencyThreshold>;
  readonly addLatencyTM99OutlierAlarm?: Record<string, LatencyThreshold>;
  readonly addLatencyTM999OutlierAlarm?: Record<string, LatencyThreshold>;
  readonly addLatencyTM9999OutlierAlarm?: Record<string, LatencyThreshold>;

  readonly addLatencyAverageAlarm?: Record<string, LatencyThreshold>;

  readonly addIntegrationLatencyP50Alarm?: Record<string, LatencyThreshold>;
  readonly addIntegrationLatencyP70Alarm?: Record<string, LatencyThreshold>;
  readonly addIntegrationLatencyP90Alarm?: Record<string, LatencyThreshold>;
  readonly addIntegrationLatencyP95Alarm?: Record<string, LatencyThreshold>;
  readonly addIntegrationLatencyP99Alarm?: Record<string, LatencyThreshold>;
  readonly addIntegrationLatencyP999Alarm?: Record<string, LatencyThreshold>;
  readonly addIntegrationLatencyP9999Alarm?: Record<string, LatencyThreshold>;
  readonly addIntegrationLatencyP100Alarm?: Record<string, LatencyThreshold>;

  readonly addIntegrationLatencyTM50Alarm?: Record<string, LatencyThreshold>;
  readonly addIntegrationLatencyTM70Alarm?: Record<string, LatencyThreshold>;
  readonly addIntegrationLatencyTM90Alarm?: Record<string, LatencyThreshold>;
  readonly addIntegrationLatencyTM95Alarm?: Record<string, LatencyThreshold>;
  readonly addIntegrationLatencyTM99Alarm?: Record<string, LatencyThreshold>;
  readonly addIntegrationLatencyTM999Alarm?: Record<string, LatencyThreshold>;
  readonly addIntegrationLatencyTM9999Alarm?: Record<string, LatencyThreshold>;

  readonly addIntegrationLatencyTM95OutlierAlarm?: Record<
    string,
    LatencyThreshold
  >;
  readonly addIntegrationLatencyTM99OutlierAlarm?: Record<
    string,
    LatencyThreshold
  >;
  readonly addIntegrationLatencyTM999OutlierAlarm?: Record<
    string,
    LatencyThreshold
  >;
  readonly addIntegrationLatencyTM9999OutlierAlarm?: Record<
    string,
    LatencyThreshold
  >;

  readonly addIntegrationLatencyAverageAlarm?: Record<string, LatencyThreshold>;

  readonly addLowTpsAlarm?: Record<string, LowTpsThreshold>;
  readonly addHighTpsAlarm?: Record<string, HighTpsThreshold>;

  /**
   * You can specify what latency types you want to be rendered in the dashboards.
   * Note: any latency type with an alarm will be also added automatically.
   * If the list is undefined, default values will be shown.
   * If the list is empty, only the latency types with an alarm will be shown (if any).
   * @default - p50, p90, p99 (@see DefaultLatencyTypesShown)
   */
  readonly latencyTypesToRender?: LatencyType[];
}

export interface ApiGatewayV2HttpApiMonitoringProps
  extends ApiGatewayV2HttpApiMetricFactoryProps,
    ApiGatewayV2MonitoringOptions {}

export class ApiGatewayV2HttpApiMonitoring extends Monitoring {
  readonly title: string;

  readonly alarmFactory: AlarmFactory;
  readonly errorAlarmFactory: ErrorAlarmFactory;
  readonly tpsAlarmFactory: TpsAlarmFactory;
  readonly latencyAlarmFactory: LatencyAlarmFactory;

  readonly tpsAnnotations: HorizontalAnnotation[];
  readonly latencyAnnotations: HorizontalAnnotation[];
  readonly errorCountAnnotations: HorizontalAnnotation[];
  readonly errorRateAnnotations: HorizontalAnnotation[];

  readonly tpsMetric: MetricWithAlarmSupport;
  readonly error4xxCountMetric: MetricWithAlarmSupport;
  readonly error4xxRateMetric: MetricWithAlarmSupport;
  readonly error5xxCountMetric: MetricWithAlarmSupport;
  readonly error5xxRateMetric: MetricWithAlarmSupport;

  // keys are LatencyType, but JSII doesn't like non-string types
  readonly latencyMetrics: Record<string, MetricWithAlarmSupport>;
  readonly integrationLatencyMetrics: Record<string, MetricWithAlarmSupport>;
  readonly latencyTypesToRender: string[];

  constructor(
    scope: MonitoringScope,
    props: ApiGatewayV2HttpApiMonitoringProps,
  ) {
    super(scope, props);

    // used when humanReadableName is not provided by user
    const fallbackNameArray = [props.api.apiId];
    fallbackNameArray.push(props.apiStage ?? "$default");
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
      namingStrategy.resolveAlarmFriendlyName(),
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
      props,
    );

    this.tpsMetric = metricFactory.metricTps();

    this.latencyMetrics = {};
    this.integrationLatencyMetrics = {};
    this.latencyTypesToRender = [
      ...(props.latencyTypesToRender ?? DefaultLatencyTypesToRender),
    ];

    this.error4xxCountMetric = metricFactory.metric4xxCount();
    this.error4xxRateMetric = metricFactory.metric4xxRate();

    this.error5xxCountMetric = metricFactory.metric5xxCount();
    this.error5xxRateMetric = metricFactory.metric5xxRate();

    const latencyAlarmDefinitions = {
      [LatencyType.P50]: props.addLatencyP50Alarm,
      [LatencyType.P70]: props.addLatencyP70Alarm,
      [LatencyType.P90]: props.addLatencyP90Alarm,
      [LatencyType.P95]: props.addLatencyP95Alarm,
      [LatencyType.P99]: props.addLatencyP99Alarm,
      [LatencyType.P999]: props.addLatencyP999Alarm,
      [LatencyType.P9999]: props.addLatencyP9999Alarm,
      [LatencyType.P100]: props.addLatencyP100Alarm,
      [LatencyType.TM50]: props.addLatencyTM50Alarm,
      [LatencyType.TM70]: props.addLatencyTM70Alarm,
      [LatencyType.TM90]: props.addLatencyTM90Alarm,
      [LatencyType.TM95]: props.addLatencyTM95Alarm,
      [LatencyType.TM99]: props.addLatencyTM99Alarm,
      [LatencyType.TM999]: props.addLatencyTM999Alarm,
      [LatencyType.TM9999]: props.addLatencyTM9999Alarm,
      [LatencyType.TM95_TOP]: props.addLatencyTM95OutlierAlarm,
      [LatencyType.TM99_TOP]: props.addLatencyTM99OutlierAlarm,
      [LatencyType.TM999_TOP]: props.addLatencyTM999OutlierAlarm,
      [LatencyType.TM9999_TOP]: props.addLatencyTM999OutlierAlarm,
      [LatencyType.AVERAGE]: props.addLatencyAverageAlarm,
    };

    const integrationLatencyAlarmDefinitions = {
      [LatencyType.P50]: props.addIntegrationLatencyP50Alarm,
      [LatencyType.P70]: props.addIntegrationLatencyP70Alarm,
      [LatencyType.P90]: props.addIntegrationLatencyP90Alarm,
      [LatencyType.P95]: props.addIntegrationLatencyP95Alarm,
      [LatencyType.P99]: props.addIntegrationLatencyP99Alarm,
      [LatencyType.P999]: props.addIntegrationLatencyP999Alarm,
      [LatencyType.P9999]: props.addIntegrationLatencyP9999Alarm,
      [LatencyType.P100]: props.addIntegrationLatencyP100Alarm,
      [LatencyType.TM50]: props.addIntegrationLatencyTM50Alarm,
      [LatencyType.TM70]: props.addIntegrationLatencyTM70Alarm,
      [LatencyType.TM90]: props.addIntegrationLatencyTM90Alarm,
      [LatencyType.TM95]: props.addIntegrationLatencyTM95Alarm,
      [LatencyType.TM99]: props.addIntegrationLatencyTM99Alarm,
      [LatencyType.TM999]: props.addIntegrationLatencyTM999Alarm,
      [LatencyType.TM9999]: props.addIntegrationLatencyTM9999Alarm,
      [LatencyType.TM95_TOP]: props.addIntegrationLatencyTM95OutlierAlarm,
      [LatencyType.TM99_TOP]: props.addIntegrationLatencyTM99OutlierAlarm,
      [LatencyType.TM999_TOP]: props.addIntegrationLatencyTM999OutlierAlarm,
      [LatencyType.TM9999_TOP]: props.addIntegrationLatencyTM9999OutlierAlarm,
      [LatencyType.AVERAGE]: props.addIntegrationLatencyAverageAlarm,
    };

    Object.values(LatencyType).forEach((latencyType) => {
      this.latencyMetrics[latencyType] =
        metricFactory.metricLatencyInMillis(latencyType);
      this.integrationLatencyMetrics[latencyType] =
        metricFactory.metricIntegrationLatencyInMillis(latencyType);
    });

    for (const [latencyType, alarmDefinition] of Object.entries(
      latencyAlarmDefinitions,
    )) {
      for (const disambiguator in alarmDefinition) {
        const alarmProps = alarmDefinition[disambiguator];
        const latencyTypeEnum = latencyType as LatencyType;
        const metric = this.latencyMetrics[latencyTypeEnum];
        const createdAlarm = this.latencyAlarmFactory.addLatencyAlarm(
          metric,
          latencyTypeEnum,
          alarmProps,
          disambiguator,
        );
        this.latencyAnnotations.push(createdAlarm.annotation);
        this.latencyTypesToRender.push(latencyTypeEnum);
        this.addAlarm(createdAlarm);
      }
    }

    for (const [latencyType, alarmDefinition] of Object.entries(
      integrationLatencyAlarmDefinitions,
    )) {
      for (const disambiguator in alarmDefinition) {
        const alarmProps = alarmDefinition[disambiguator];
        const latencyTypeEnum = latencyType as LatencyType;
        const metric = this.integrationLatencyMetrics[latencyTypeEnum];
        const createdAlarm =
          this.latencyAlarmFactory.addIntegrationLatencyAlarm(
            metric,
            latencyTypeEnum,
            alarmProps,
            disambiguator,
          );
        this.latencyAnnotations.push(createdAlarm.annotation);
        this.latencyTypesToRender.push(latencyTypeEnum);
        this.addAlarm(createdAlarm);
      }
    }

    for (const disambiguator in props.add4xxCountAlarm) {
      const alarmProps = props.add4xxCountAlarm[disambiguator];
      const createdAlarm = this.errorAlarmFactory.addErrorCountAlarm(
        this.error4xxCountMetric,
        ErrorType.ERROR,
        alarmProps,
        disambiguator,
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
        disambiguator,
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
        disambiguator,
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

  createTitleWidget() {
    return new MonitoringHeaderWidget({
      family: "API Gateway V2 HTTP Endpoint",
      title: this.title,
    });
  }

  createTpsWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "TPS",
      left: [this.tpsMetric],
      leftYAxis: RateAxisFromZero,
      leftAnnotations: this.tpsAnnotations,
    });
  }

  createLatencyWidget(width: number, height: number) {
    const left: IMetric[] = [];

    Array.from(new Set(this.latencyTypesToRender))
      .sort()
      .forEach((type) => {
        left.push(this.latencyMetrics[type]);
        left.push(this.integrationLatencyMetrics[type]);
      });

    return new GraphWidget({
      width,
      height,
      title: "Latency",
      left,
      leftYAxis: TimeAxisMillisFromZero,
      leftAnnotations: this.latencyAnnotations,
    });
  }

  createErrorCountWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Errors",
      left: [this.error4xxCountMetric, this.error5xxCountMetric],
      leftAnnotations: this.errorCountAnnotations,
      leftYAxis: CountAxisFromZero,
    });
  }

  createErrorRateWidget(width: number, height: number) {
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
