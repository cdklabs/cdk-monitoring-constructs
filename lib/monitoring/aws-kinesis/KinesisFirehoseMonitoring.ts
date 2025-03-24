import {
  GraphWidget,
  HorizontalAnnotation,
  IWidget,
} from "aws-cdk-lib/aws-cloudwatch";

import {
  KinesisFirehoseMetricFactory,
  KinesisFirehoseMetricFactoryProps,
} from "./KinesisFirehoseMetricFactory";
import {
  BaseMonitoringProps,
  CountAxisFromZero,
  DefaultGraphWidgetHeight,
  DefaultSummaryWidgetHeight,
  HalfWidth,
  KinesisAlarmFactory,
  MetricWithAlarmSupport,
  Monitoring,
  MonitoringScope,
  QuarterWidth,
  RateAxisFromZero,
  RecordsThrottledThreshold,
  FirehoseStreamLimitThreshold,
  TimeAxisMillisFromZero,
  FullWidth,
  ThirdWidth,
} from "../../common";
import {
  MonitoringHeaderWidget,
  MonitoringNamingStrategy,
} from "../../dashboard";

export interface KinesisFirehoseMonitoringOptions extends BaseMonitoringProps {
  /**
   * Indicates that the Kinesis Firehose has record format conversion enabled.
   * This impacts what widgets are shown.
   *
   * @default - true
   * @see https://docs.aws.amazon.com/firehose/latest/dev/enable-record-format-conversion.html
   */
  readonly isDataFormatConversionEnabled?: boolean;
  readonly addRecordsThrottledAlarm?: Record<string, RecordsThrottledThreshold>;
  readonly addIncomingBytesExceedThresholdAlarm?: Record<
    string,
    FirehoseStreamLimitThreshold
  >;
  readonly addIncomingRecordsExceedThresholdAlarm?: Record<
    string,
    FirehoseStreamLimitThreshold
  >;
  readonly addIncomingPutRequestsExceedThresholdAlarm?: Record<
    string,
    FirehoseStreamLimitThreshold
  >;
}

export interface KinesisFirehoseMonitoringProps
  extends KinesisFirehoseMetricFactoryProps,
    KinesisFirehoseMonitoringOptions {}

export class KinesisFirehoseMonitoring extends Monitoring {
  readonly title: string;
  readonly streamUrl?: string;

  readonly kinesisAlarmFactory: KinesisAlarmFactory;
  readonly recordCountAnnotations: HorizontalAnnotation[];
  readonly incomingLimitAnnotations: HorizontalAnnotation[];

  readonly incomingBytesMetric: MetricWithAlarmSupport;
  readonly incomingRecordsMetric: MetricWithAlarmSupport;
  readonly throttledRecordsMetric: MetricWithAlarmSupport;

  readonly isDataFormatConversionEnabled: boolean;
  readonly successfulConversionMetric: MetricWithAlarmSupport;
  readonly failedConversionMetric: MetricWithAlarmSupport;

  readonly putRecordLatency: MetricWithAlarmSupport;
  readonly putRecordBatchLatency: MetricWithAlarmSupport;
  readonly incomingBytesToLimitRate: MetricWithAlarmSupport;
  readonly incomingRecordsToLimitRate: MetricWithAlarmSupport;
  readonly incomingPutRequestsToLimitRate: MetricWithAlarmSupport;

  constructor(scope: MonitoringScope, props: KinesisFirehoseMonitoringProps) {
    super(scope);

    const namingStrategy = new MonitoringNamingStrategy({
      ...props,
      fallbackConstructName: props.deliveryStreamName,
    });
    this.title = namingStrategy.resolveHumanReadableName();
    this.streamUrl = scope
      .createAwsConsoleUrlFactory()
      .getKinesisFirehoseDeliveryStreamUrl(props.deliveryStreamName);

    const metricFactory = new KinesisFirehoseMetricFactory(
      scope.createMetricFactory(),
      props,
    );
    const alarmFactory = this.createAlarmFactory(
      namingStrategy.resolveAlarmFriendlyName(),
    );
    this.kinesisAlarmFactory = new KinesisAlarmFactory(alarmFactory);
    this.recordCountAnnotations = [];
    this.incomingLimitAnnotations = [{ value: 1, label: "100% usage" }];

    this.incomingBytesMetric = metricFactory.metricIncomingBytes();
    this.incomingRecordsMetric = metricFactory.metricIncomingRecordCount();
    this.throttledRecordsMetric = metricFactory.metricThrottledRecordCount();

    this.isDataFormatConversionEnabled =
      props.isDataFormatConversionEnabled ?? true;
    this.successfulConversionMetric =
      metricFactory.metricSuccessfulConversionCount();
    this.failedConversionMetric = metricFactory.metricFailedConversionCount();
    this.putRecordLatency = metricFactory.metricPutRecordLatencyP90InMillis();
    this.putRecordBatchLatency =
      metricFactory.metricPutRecordBatchLatencyP90InMillis();
    this.incomingBytesToLimitRate =
      metricFactory.metricIncomingBytesToLimitRate();
    this.incomingRecordsToLimitRate =
      metricFactory.metricIncomingRecordsToLimitRate();
    this.incomingPutRequestsToLimitRate =
      metricFactory.metricIncomingPutRequestsToLimitRate();

    for (const disambiguator in props.addRecordsThrottledAlarm) {
      const alarmProps = props.addRecordsThrottledAlarm[disambiguator];
      const createdAlarm = this.kinesisAlarmFactory.addPutRecordsThrottledAlarm(
        this.throttledRecordsMetric,
        alarmProps,
        disambiguator,
      );
      this.recordCountAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }

    for (const disambiguator in props.addIncomingBytesExceedThresholdAlarm) {
      const alarmProps =
        props.addIncomingBytesExceedThresholdAlarm[disambiguator];
      const createdAlarm =
        this.kinesisAlarmFactory.addFirehoseStreamExceedSafetyThresholdAlarm(
          this.incomingBytesToLimitRate,
          "IncomingBytes",
          "BytesPerSecondLimit",
          alarmProps,
          disambiguator,
        );
      this.incomingLimitAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }

    for (const disambiguator in props.addIncomingRecordsExceedThresholdAlarm) {
      const alarmProps =
        props.addIncomingRecordsExceedThresholdAlarm[disambiguator];
      const createdAlarm =
        this.kinesisAlarmFactory.addFirehoseStreamExceedSafetyThresholdAlarm(
          this.incomingRecordsToLimitRate,
          "IncomingRecords",
          "RecordsPerSecondLimit",
          alarmProps,
          disambiguator,
        );
      this.incomingLimitAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }

    for (const disambiguator in props.addIncomingPutRequestsExceedThresholdAlarm) {
      const alarmProps =
        props.addIncomingPutRequestsExceedThresholdAlarm[disambiguator];
      const createdAlarm =
        this.kinesisAlarmFactory.addFirehoseStreamExceedSafetyThresholdAlarm(
          this.incomingPutRequestsToLimitRate,
          "IncomingPutRequests",
          "PutRequestsPerSecondLimit",
          alarmProps,
          disambiguator,
        );
      this.incomingLimitAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }

    props.useCreatedAlarms?.consume(this.createdAlarms());
  }

  summaryWidgets(): IWidget[] {
    const widgetWidth = this.isDataFormatConversionEnabled
      ? HalfWidth
      : FullWidth;
    const widgets = [
      this.createTitleWidget(),
      this.createIncomingRecordWidget(widgetWidth, DefaultSummaryWidgetHeight),
    ];
    if (this.isDataFormatConversionEnabled) {
      widgets.push(
        this.createConversionWidget(widgetWidth, DefaultSummaryWidgetHeight),
      );
    }
    return widgets;
  }

  widgets(): IWidget[] {
    const widgetWidth = this.isDataFormatConversionEnabled
      ? QuarterWidth
      : ThirdWidth;
    let widgets = [
      this.createTitleWidget(),
      this.createIncomingRecordWidget(widgetWidth, DefaultGraphWidgetHeight),
      this.createLatencyWidget(widgetWidth, DefaultGraphWidgetHeight),
    ];
    if (this.isDataFormatConversionEnabled) {
      widgets.push(
        this.createConversionWidget(widgetWidth, DefaultGraphWidgetHeight),
      );
    }
    widgets.push(this.createLimitWidget(widgetWidth, DefaultGraphWidgetHeight));
    return widgets;
  }

  createTitleWidget() {
    return new MonitoringHeaderWidget({
      family: "Firehose Delivery Stream",
      title: this.title,
      goToLinkUrl: this.streamUrl,
    });
  }

  createIncomingRecordWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Records",
      left: [this.incomingRecordsMetric, this.throttledRecordsMetric],
      leftYAxis: CountAxisFromZero,
      leftAnnotations: this.recordCountAnnotations,
    });
  }

  createLatencyWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Latency (P90)",
      left: [this.putRecordLatency, this.putRecordBatchLatency],
      leftYAxis: TimeAxisMillisFromZero,
    });
  }

  createConversionWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Conversions",
      left: [this.successfulConversionMetric, this.failedConversionMetric],
      leftYAxis: CountAxisFromZero,
    });
  }

  createLimitWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Limits (rate)",
      left: [
        this.incomingBytesToLimitRate.with({ label: "Bytes" }),
        this.incomingRecordsToLimitRate.with({ label: "Records" }),
        this.incomingPutRequestsToLimitRate.with({ label: "PutRequests" }),
      ],
      leftYAxis: RateAxisFromZero,
      leftAnnotations: this.incomingLimitAnnotations,
    });
  }
}
