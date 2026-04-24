import {
  GraphWidget,
  HorizontalAnnotation,
  IWidget,
  Row,
} from "aws-cdk-lib/aws-cloudwatch";

import {
  KinesisDataStreamConsumerMetricFactory,
  KinesisDataStreamConsumerMetricFactoryProps,
} from "./KinesisDataStreamConsumerMetricFactory";
import {
  BaseMonitoringProps,
  ConsumerRateExceededThreshold,
  CountAxisFromZero,
  DefaultGraphWidgetHeight,
  DefaultSummaryWidgetHeight,
  HalfWidth,
  KinesisAlarmFactory,
  MaxIteratorAgeThreshold,
  MetricWithAlarmSupport,
  MinConsumerSubscribeToShardSuccessThreshold,
  Monitoring,
  MonitoringScope,
  QuarterWidth,
  RateAxisFromZeroToOne,
  SizeAxisBytesFromZero,
  TimeAxisMillisFromZero,
} from "../../common";
import {
  MonitoringHeaderWidget,
  MonitoringNamingStrategy,
} from "../../dashboard";

export interface KinesisDataStreamConsumerMonitoringOptions
  extends BaseMonitoringProps {
  readonly addConsumerIteratorMaxAgeAlarm?: Record<
    string,
    MaxIteratorAgeThreshold
  >;
  readonly addConsumerSubscribeToShardRateExceededAlarm?: Record<
    string,
    ConsumerRateExceededThreshold
  >;
  readonly addConsumerSubscribeToShardSuccessAlarm?: Record<
    string,
    MinConsumerSubscribeToShardSuccessThreshold
  >;
}

export interface KinesisDataStreamConsumerMonitoringProps
  extends KinesisDataStreamConsumerMetricFactoryProps,
    KinesisDataStreamConsumerMonitoringOptions {}

export class KinesisDataStreamConsumerMonitoring extends Monitoring {
  readonly title: string;
  readonly streamUrl?: string;

  readonly kinesisAlarmFactory: KinesisAlarmFactory;
  readonly ageAnnotations: HorizontalAnnotation[];
  readonly rateExceededAnnotations: HorizontalAnnotation[];
  readonly subscribeSuccessAnnotations: HorizontalAnnotation[];

  readonly millisBehindLatestMetric: MetricWithAlarmSupport;
  readonly rateExceededMetric: MetricWithAlarmSupport;
  readonly subscribeToShardSuccessMetric: MetricWithAlarmSupport;
  readonly subscribeToShardEventSuccessMetric: MetricWithAlarmSupport;
  readonly recordsMetric: MetricWithAlarmSupport;
  readonly bytesMetric: MetricWithAlarmSupport;

  constructor(
    scope: MonitoringScope,
    props: KinesisDataStreamConsumerMonitoringProps,
  ) {
    super(scope, props);

    const namingStrategy = new MonitoringNamingStrategy({
      ...props,
      fallbackConstructName: `${props.streamName}-${props.consumerName}`,
    });
    this.title = namingStrategy.resolveHumanReadableName();
    this.streamUrl = scope
      .createAwsConsoleUrlFactory()
      .getKinesisDataStreamUrl(props.streamName);

    const alarmFactory = this.createAlarmFactory(
      namingStrategy.resolveAlarmFriendlyName(),
    );
    this.kinesisAlarmFactory = new KinesisAlarmFactory(alarmFactory);
    this.ageAnnotations = [];
    this.rateExceededAnnotations = [];
    this.subscribeSuccessAnnotations = [];

    const metricFactory = new KinesisDataStreamConsumerMetricFactory(
      scope.createMetricFactory(),
      props,
    );
    this.millisBehindLatestMetric =
      metricFactory.metricSubscribeToShardEventMillisBehindLatestMaxMs();
    this.rateExceededMetric =
      metricFactory.metricSubscribeToShardRateExceededAverage();
    this.subscribeToShardSuccessMetric =
      metricFactory.metricSubscribeToShardSuccessAverage();
    this.subscribeToShardEventSuccessMetric =
      metricFactory.metricSubscribeToShardEventSuccessAverage();
    this.recordsMetric =
      metricFactory.metricSubscribeToShardEventRecordsSumCount();
    this.bytesMetric = metricFactory.metricSubscribeToShardEventSumBytes();

    for (const disambiguator in props.addConsumerIteratorMaxAgeAlarm) {
      const alarmProps = props.addConsumerIteratorMaxAgeAlarm[disambiguator];
      const createdAlarm =
        this.kinesisAlarmFactory.addConsumerIteratorMaxAgeAlarm(
          this.millisBehindLatestMetric,
          alarmProps,
          disambiguator,
        );
      this.ageAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }
    for (const disambiguator in props.addConsumerSubscribeToShardRateExceededAlarm) {
      const alarmProps =
        props.addConsumerSubscribeToShardRateExceededAlarm[disambiguator];
      const createdAlarm =
        this.kinesisAlarmFactory.addConsumerSubscribeToShardRateExceededAlarm(
          this.rateExceededMetric,
          alarmProps,
          disambiguator,
        );
      this.rateExceededAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }
    for (const disambiguator in props.addConsumerSubscribeToShardSuccessAlarm) {
      const alarmProps =
        props.addConsumerSubscribeToShardSuccessAlarm[disambiguator];
      const createdAlarm =
        this.kinesisAlarmFactory.addConsumerSubscribeToShardSuccessAlarm(
          this.subscribeToShardSuccessMetric,
          alarmProps,
          disambiguator,
        );
      this.subscribeSuccessAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }

    props.useCreatedAlarms?.consume(this.createdAlarms());
  }

  summaryWidgets(): IWidget[] {
    return [
      this.createTitleWidget(),
      new Row(
        this.createMillisBehindLatestWidget(
          QuarterWidth,
          DefaultSummaryWidgetHeight,
        ),
        this.createSubscribeSuccessWidget(
          QuarterWidth,
          DefaultSummaryWidgetHeight,
        ),
        this.createRateExceededWidget(QuarterWidth, DefaultSummaryWidgetHeight),
      ),
    ];
  }

  widgets(): IWidget[] {
    return [
      this.createTitleWidget(),
      new Row(
        this.createMillisBehindLatestWidget(
          QuarterWidth,
          DefaultGraphWidgetHeight,
        ),
        this.createSubscribeSuccessWidget(
          QuarterWidth,
          DefaultGraphWidgetHeight,
        ),
        this.createRateExceededWidget(QuarterWidth, DefaultGraphWidgetHeight),
      ),
      new Row(
        this.createRecordsWidget(HalfWidth, DefaultGraphWidgetHeight),
        this.createBytesWidget(HalfWidth, DefaultGraphWidgetHeight),
      ),
    ];
  }

  createTitleWidget() {
    return new MonitoringHeaderWidget({
      family: "Kinesis Data Stream Consumer",
      title: this.title,
      goToLinkUrl: this.streamUrl,
    });
  }

  createMillisBehindLatestWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Iterator (Consumer)",
      left: [this.millisBehindLatestMetric],
      leftAnnotations: this.ageAnnotations,
      leftYAxis: TimeAxisMillisFromZero,
    });
  }

  createSubscribeSuccessWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Subscribe Success",
      left: [
        this.subscribeToShardSuccessMetric,
        this.subscribeToShardEventSuccessMetric,
      ],
      leftAnnotations: this.subscribeSuccessAnnotations,
      leftYAxis: RateAxisFromZeroToOne,
    });
  }

  createRateExceededWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Rate Exceeded",
      left: [this.rateExceededMetric],
      leftAnnotations: this.rateExceededAnnotations,
      leftYAxis: RateAxisFromZeroToOne,
    });
  }

  createRecordsWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Records",
      left: [this.recordsMetric],
      leftYAxis: CountAxisFromZero,
    });
  }

  createBytesWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Bytes",
      left: [this.bytesMetric],
      leftYAxis: SizeAxisBytesFromZero,
    });
  }
}
