import {
  GraphWidget,
  HorizontalAnnotation,
  IWidget,
  Row,
} from "aws-cdk-lib/aws-cloudwatch";
import {
  ElastiCacheServerlessMetricFactory,
  ElastiCacheServerlessMetricFactoryProps,
} from "./ElastiCacheServerlessMetricFactory";
import {
  BaseMonitoringProps,
  CountAxisFromZero,
  DefaultGraphWidgetHeight,
  DefaultSummaryWidgetHeight,
  ElastiCacheAlarmFactory,
  HalfWidth,
  LatencyAlarmFactory,
  LatencyThreshold,
  LatencyType,
  MaxThrottleRateThreshold,
  MetricWithAlarmSupport,
  MinHitRateThreshold,
  Monitoring,
  MonitoringScope,
  PercentageAxisFromZeroToHundred,
  SizeAxisBytesFromZero,
  ThirdWidth,
  TimeAxisMicrosFromZero,
  TwoThirdsWidth,
} from "../../common";
import {
  MonitoringHeaderWidget,
  MonitoringNamingStrategy,
} from "../../dashboard";

/**
 * Configuration options for monitoring ElastiCache Serverless clusters.
 *
 * Extends BaseMonitoringProps to include alarm configurations specific to
 * ElastiCache Serverless metrics such as latency, throttling, cache hit rates,
 * and item counts.
 */
export interface ElastiCacheServerlessMonitoringOptions
  extends BaseMonitoringProps {
  /**
   * Add alarm when the 99th percentile (TM99) latency for successful read requests exceeds a threshold.
   *
   * The key is a disambiguator (e.g., "Warning", "Critical") and the value defines the latency threshold.
   *
   * @default - no alarm
   */
  readonly addTM99SuccessfulReadRequestLatencyAlarm?: Record<
    string,
    LatencyThreshold
  >;

  /**
   * Add alarm when the average latency for successful read requests exceeds a threshold.
   *
   * The key is a disambiguator (e.g., "Warning", "Critical") and the value defines the latency threshold.
   *
   * @default - no alarm
   */
  readonly addAverageSuccessfulReadRequestLatencyAlarm?: Record<
    string,
    LatencyThreshold
  >;

  /**
   * Add alarm when the 99th percentile (TM99) latency for successful write requests exceeds a threshold.
   *
   * The key is a disambiguator (e.g., "Warning", "Critical") and the value defines the latency threshold.
   *
   * @default - no alarm
   */
  readonly addTM99SuccessfulWriteRequestLatencyAlarm?: Record<
    string,
    LatencyThreshold
  >;

  /**
   * Add alarm when the average latency for successful write requests exceeds a threshold.
   *
   * The key is a disambiguator (e.g., "Warning", "Critical") and the value defines the latency threshold.
   *
   * @default - no alarm
   */
  readonly addAverageSuccessfulWriteRequestLatencyAlarm?: Record<
    string,
    LatencyThreshold
  >;

  /**
   * Add alarm when the throttle rate (percentage of throttled commands) exceeds a threshold.
   *
   * The key is a disambiguator (e.g., "Warning", "Critical") and the value defines the usage threshold.
   *
   * @default - no alarm
   */
  readonly addThrottleRateAlarm?: Record<string, MaxThrottleRateThreshold>;

  /**
   * Add alarm when the cache hit rate falls below a minimum threshold.
   *
   * The key is a disambiguator (e.g., "Warning", "Critical") and the value defines the minimum hit rate threshold.
   *
   * @default - no alarm
   */
  readonly addHitRateAlarm?: Record<string, MinHitRateThreshold>;
}

export interface ElastiCacheServerlessMonitoringProps
  extends ElastiCacheServerlessMetricFactoryProps,
    ElastiCacheServerlessMonitoringOptions {}

export class ElastiCacheServerlessMonitoring extends Monitoring {
  readonly title: string;

  readonly metricMaxItemCount: MetricWithAlarmSupport;
  readonly metricEvictions: MetricWithAlarmSupport;
  readonly metricAverageCacheSize: MetricWithAlarmSupport;
  readonly metricMaxElastiCacheProcessingUnits: MetricWithAlarmSupport;
  readonly metricAverageConnections: MetricWithAlarmSupport;
  readonly metricNetworkBytesIn: MetricWithAlarmSupport;
  readonly metricNetworkBytesOut: MetricWithAlarmSupport;
  readonly metricTM99SuccessfulReadRequestLatency: MetricWithAlarmSupport;
  readonly metricAverageSuccessfulReadRequestLatency: MetricWithAlarmSupport;
  readonly metricTM99SuccessfulWriteRequestLatency: MetricWithAlarmSupport;
  readonly metricAverageSuccessfulWriteRequestLatency: MetricWithAlarmSupport;
  readonly metricTotalThrottledCmds: MetricWithAlarmSupport;
  readonly metricTotalCmds: MetricWithAlarmSupport;
  readonly metricThrottleRate: MetricWithAlarmSupport;
  readonly metricAverageCacheHitRate: MetricWithAlarmSupport;
  readonly metricCacheHits: MetricWithAlarmSupport;
  readonly metricCacheMisses: MetricWithAlarmSupport;

  readonly elastiCacheAlarmFactory: ElastiCacheAlarmFactory;
  readonly latencyAlarmFactory: LatencyAlarmFactory;

  readonly tm99SuccessfulReadRequestLatencyAlarmAnnotations: HorizontalAnnotation[];
  readonly averageSuccessfulReadRequestLatencyAlarmAnnotations: HorizontalAnnotation[];
  readonly tm99SuccessfulWriteRequestLatencyAlarmAnnotations: HorizontalAnnotation[];
  readonly averageSuccessfulWriteRequestLatencyAlarmAnnotations: HorizontalAnnotation[];
  readonly throttleRateAlarmAnnotations: HorizontalAnnotation[];
  readonly hitRateAlarmAnnotations: HorizontalAnnotation[];

  constructor(
    scope: MonitoringScope,
    props: ElastiCacheServerlessMonitoringProps,
  ) {
    super(scope, props);

    const fallbackConstructName = [props.clusterId ?? "ALL"].join("-");
    const namingStrategy = new MonitoringNamingStrategy({
      ...props,
      fallbackConstructName,
    });
    this.title = namingStrategy.resolveHumanReadableName();

    const metricFactory = new ElastiCacheServerlessMetricFactory(
      scope.createMetricFactory(),
      props,
    );
    this.metricMaxItemCount = metricFactory.metricMaxItemCount();
    this.metricEvictions = metricFactory.metricEvictions();
    this.metricAverageCacheSize = metricFactory.metricAverageCacheSize();
    this.metricMaxElastiCacheProcessingUnits =
      metricFactory.metricMaxElastiCacheProcessingUnits();
    this.metricAverageConnections = metricFactory.metricAverageConnections();
    this.metricNetworkBytesIn = metricFactory.metricNetworkBytesIn();
    this.metricNetworkBytesOut = metricFactory.metricNetworkBytesOut();
    this.metricTM99SuccessfulReadRequestLatency =
      metricFactory.metricSuccessfulReadRequestLatency(LatencyType.TM99);
    this.metricAverageSuccessfulReadRequestLatency =
      metricFactory.metricSuccessfulReadRequestLatency(LatencyType.AVERAGE);
    this.metricTM99SuccessfulWriteRequestLatency =
      metricFactory.metricSuccessfulWriteRequestLatency(LatencyType.TM99);
    this.metricAverageSuccessfulWriteRequestLatency =
      metricFactory.metricSuccessfulWriteRequestLatency(LatencyType.AVERAGE);
    this.metricTotalThrottledCmds = metricFactory.metricTotalThrottledCmds();
    this.metricTotalCmds = metricFactory.metricTotalCmds();
    this.metricThrottleRate = metricFactory.metricThrottleRate();
    this.metricAverageCacheHitRate = metricFactory.metricAverageCacheHitRate();
    this.metricCacheHits = metricFactory.metricCacheHits();
    this.metricCacheMisses = metricFactory.metricCacheMisses();

    this.tm99SuccessfulReadRequestLatencyAlarmAnnotations = [];
    this.averageSuccessfulReadRequestLatencyAlarmAnnotations = [];
    this.tm99SuccessfulWriteRequestLatencyAlarmAnnotations = [];
    this.averageSuccessfulWriteRequestLatencyAlarmAnnotations = [];
    this.throttleRateAlarmAnnotations = [];
    this.hitRateAlarmAnnotations = [];

    const alarmFactory = this.createAlarmFactory(
      namingStrategy.resolveAlarmFriendlyName(),
    );
    this.elastiCacheAlarmFactory = new ElastiCacheAlarmFactory(alarmFactory);
    this.latencyAlarmFactory = new LatencyAlarmFactory(alarmFactory);

    for (const disambiguator in props.addTM99SuccessfulReadRequestLatencyAlarm) {
      const alarmProps =
        props.addTM99SuccessfulReadRequestLatencyAlarm[disambiguator];
      const createdAlarm = this.latencyAlarmFactory.addLatencyAlarm(
        this.metricTM99SuccessfulReadRequestLatency,
        LatencyType.TM99,
        alarmProps,
        disambiguator,
        "SuccessfulReadRequest",
      );
      this.tm99SuccessfulReadRequestLatencyAlarmAnnotations.push(
        createdAlarm.annotation,
      );
      this.addAlarm(createdAlarm);
    }

    for (const disambiguator in props.addAverageSuccessfulReadRequestLatencyAlarm) {
      const alarmProps =
        props.addAverageSuccessfulReadRequestLatencyAlarm[disambiguator];
      const createdAlarm = this.latencyAlarmFactory.addLatencyAlarm(
        this.metricAverageSuccessfulReadRequestLatency,
        LatencyType.AVERAGE,
        alarmProps,
        disambiguator,
        "SuccessfulReadRequest",
      );
      this.averageSuccessfulReadRequestLatencyAlarmAnnotations.push(
        createdAlarm.annotation,
      );
      this.addAlarm(createdAlarm);
    }

    for (const disambiguator in props.addTM99SuccessfulWriteRequestLatencyAlarm) {
      const alarmProps =
        props.addTM99SuccessfulWriteRequestLatencyAlarm[disambiguator];
      const createdAlarm = this.latencyAlarmFactory.addLatencyAlarm(
        this.metricTM99SuccessfulWriteRequestLatency,
        LatencyType.TM99,
        alarmProps,
        disambiguator,
        "SuccessfulWriteRequest",
      );
      this.tm99SuccessfulWriteRequestLatencyAlarmAnnotations.push(
        createdAlarm.annotation,
      );
      this.addAlarm(createdAlarm);
    }

    for (const disambiguator in props.addAverageSuccessfulWriteRequestLatencyAlarm) {
      const alarmProps =
        props.addAverageSuccessfulWriteRequestLatencyAlarm[disambiguator];
      const createdAlarm = this.latencyAlarmFactory.addLatencyAlarm(
        this.metricAverageSuccessfulWriteRequestLatency,
        LatencyType.AVERAGE,
        alarmProps,
        disambiguator,
        "SuccessfulWriteRequest",
      );
      this.averageSuccessfulWriteRequestLatencyAlarmAnnotations.push(
        createdAlarm.annotation,
      );
      this.addAlarm(createdAlarm);
    }

    for (const disambiguator in props.addThrottleRateAlarm) {
      const alarmProps = props.addThrottleRateAlarm[disambiguator];
      const createdAlarm = this.elastiCacheAlarmFactory.addMaxThrottleRateAlarm(
        this.metricThrottleRate,
        alarmProps,
        disambiguator,
      );
      this.throttleRateAlarmAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }

    for (const disambiguator in props.addHitRateAlarm) {
      const alarmProps = props.addHitRateAlarm[disambiguator];
      const createdAlarm = this.elastiCacheAlarmFactory.addMinHitRateAlarm(
        this.metricAverageCacheHitRate,
        alarmProps,
        disambiguator,
      );
      this.hitRateAlarmAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }

    props.useCreatedAlarms?.consume(this.createdAlarms());
  }

  summaryWidgets(): IWidget[] {
    return [
      this.createTitleWidget(),
      this.createProcessingUnitsWidget(ThirdWidth, DefaultSummaryWidgetHeight),
      this.createCacheHitAndMissWidget(ThirdWidth, DefaultSummaryWidgetHeight),
      this.createSuccessfulReadLatencyWidget(
        ThirdWidth,
        DefaultSummaryWidgetHeight,
      ),
      this.createSuccessfulWriteLatencyWidget(
        ThirdWidth,
        DefaultSummaryWidgetHeight,
      ),
      this.createItemCountWidget(ThirdWidth, DefaultSummaryWidgetHeight),
    ];
  }

  widgets(): IWidget[] {
    return [
      this.createTitleWidget(),
      new Row(
        this.createCacheSizeWidget(ThirdWidth, DefaultGraphWidgetHeight),
        this.createCacheHitAndMissWidget(
          TwoThirdsWidth,
          DefaultGraphWidgetHeight,
        ),
      ),
      new Row(
        this.createSuccessfulReadLatencyWidget(
          HalfWidth,
          DefaultGraphWidgetHeight,
        ),
        this.createSuccessfulWriteLatencyWidget(
          HalfWidth,
          DefaultGraphWidgetHeight,
        ),
      ),
      new Row(
        this.createNetworkWidget(ThirdWidth, DefaultGraphWidgetHeight),
        this.createCacheCmdsWidget(TwoThirdsWidth, DefaultGraphWidgetHeight),
      ),
      new Row(
        this.createProcessingUnitsWidget(ThirdWidth, DefaultGraphWidgetHeight),
        this.createItemCountWidget(ThirdWidth, DefaultGraphWidgetHeight),
        this.createConnectionsWidget(ThirdWidth, DefaultGraphWidgetHeight),
      ),
    ];
  }

  createTitleWidget() {
    return new MonitoringHeaderWidget({
      family: "Serverless ElastiCache",
      title: this.title,
    });
  }

  createSuccessfulReadLatencyWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Successful Read Latency",
      left: [
        this.metricTM99SuccessfulReadRequestLatency,
        this.metricAverageSuccessfulReadRequestLatency,
      ],
      leftYAxis: TimeAxisMicrosFromZero,
      leftAnnotations: [
        ...this.tm99SuccessfulReadRequestLatencyAlarmAnnotations,
        ...this.averageSuccessfulReadRequestLatencyAlarmAnnotations,
      ],
    });
  }

  createSuccessfulWriteLatencyWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Successful Write Latency",
      left: [
        this.metricTM99SuccessfulWriteRequestLatency,
        this.metricAverageSuccessfulWriteRequestLatency,
      ],
      leftYAxis: TimeAxisMicrosFromZero,
      leftAnnotations: [
        ...this.tm99SuccessfulWriteRequestLatencyAlarmAnnotations,
        ...this.averageSuccessfulWriteRequestLatencyAlarmAnnotations,
      ],
    });
  }

  createCacheSizeWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Cache Size",
      left: [this.metricAverageCacheSize],
      leftYAxis: SizeAxisBytesFromZero,
    });
  }

  createCacheHitAndMissWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Hits/Misses",
      left: [this.metricAverageCacheHitRate],
      leftYAxis: PercentageAxisFromZeroToHundred,
      leftAnnotations: this.hitRateAlarmAnnotations,
      right: [this.metricCacheHits, this.metricCacheMisses],
      rightYAxis: CountAxisFromZero,
    });
  }

  createCacheCmdsWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Commands",
      left: [this.metricThrottleRate],
      leftYAxis: PercentageAxisFromZeroToHundred,
      leftAnnotations: this.throttleRateAlarmAnnotations,
      right: [this.metricTotalCmds, this.metricTotalCmds],
      rightYAxis: CountAxisFromZero,
    });
  }

  createNetworkWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "IO",
      left: [this.metricNetworkBytesIn, this.metricNetworkBytesOut],
      leftYAxis: SizeAxisBytesFromZero,
    });
  }

  createProcessingUnitsWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Processing Units",
      left: [this.metricMaxElastiCacheProcessingUnits],
      leftYAxis: CountAxisFromZero,
    });
  }

  createItemCountWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Items",
      left: [this.metricMaxItemCount],
      leftYAxis: CountAxisFromZero,
      right: [this.metricEvictions],
      rightYAxis: CountAxisFromZero,
    });
  }

  createConnectionsWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Connections",
      left: [this.metricAverageConnections],
      leftYAxis: CountAxisFromZero,
    });
  }
}
