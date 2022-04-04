import {
  GraphWidget,
  HorizontalAnnotation,
  IWidget,
  Row,
} from "aws-cdk-lib/aws-cloudwatch";

import {
  BaseMonitoringProps,
  CountAxisFromZero,
  DefaultGraphWidgetHeight,
  DefaultSummaryWidgetHeight,
  FullWidth,
  HalfWidth,
  KinesisAlarmFactory,
  MaxIteratorAgeThreshold,
  MetricWithAlarmSupport,
  Monitoring,
  MonitoringScope,
  QuarterWidth,
  RecordsFailedThreshold,
  RecordsThrottledThreshold,
  SizeAxisBytesFromZero,
  TimeAxisMillisFromZero,
} from "../../common";
import {
  MonitoringHeaderWidget,
  MonitoringNamingStrategy,
} from "../../dashboard";
import {
  KinesisDataStreamMetricFactory,
  KinesisDataStreamMetricFactoryProps,
} from "./KinesisDataStreamMetricFactory";

export interface KinesisDataStreamMonitoringOptions
  extends BaseMonitoringProps {
  readonly addIteratorMaxAgeAlarm?: Record<string, MaxIteratorAgeThreshold>;
  readonly addPutRecordsThrottledAlarm?: Record<
    string,
    RecordsThrottledThreshold
  >;
  readonly addPutRecordsFailedAlarm?: Record<string, RecordsFailedThreshold>;
  readonly addThrottledRecordsAlarm?: Record<string, RecordsThrottledThreshold>;
  readonly addReadProvisionedThroughputExceededAlarm?: Record<
    string,
    RecordsThrottledThreshold
  >;
  readonly addWriteProvisionedThroughputExceededAlarm?: Record<
    string,
    RecordsThrottledThreshold
  >;
}

export interface KinesisDataStreamMonitoringProps
  extends KinesisDataStreamMetricFactoryProps,
    KinesisDataStreamMonitoringOptions {}

export class KinesisDataStreamMonitoring extends Monitoring {
  protected readonly title: string;
  protected readonly streamUrl?: string;

  protected readonly kinesisAlarmFactory: KinesisAlarmFactory;
  protected readonly ageAnnotations: HorizontalAnnotation[];
  protected readonly provisionedCapacityAnnotations: HorizontalAnnotation[];
  protected readonly recordCountAnnotations: HorizontalAnnotation[];

  protected readonly metricGetRecordSumBytes: MetricWithAlarmSupport;
  protected readonly metricGetRecordsIteratorAge: MetricWithAlarmSupport;
  protected readonly metricGetRecordsLatencyAverage: MetricWithAlarmSupport;
  protected readonly metricGetRecordsSumCount: MetricWithAlarmSupport;
  protected readonly metricGetRecordsSuccessCount: MetricWithAlarmSupport;
  protected readonly incomingDataSumBytesMetric: MetricWithAlarmSupport;
  protected readonly incomingDataSumCountMetric: MetricWithAlarmSupport;
  protected readonly putRecordSumBytesMetric: MetricWithAlarmSupport;
  protected readonly putRecordLatencyAverageMetric: MetricWithAlarmSupport;
  protected readonly putRecordSuccessCountMetric: MetricWithAlarmSupport;
  protected readonly putRecordsSumBytesMetric: MetricWithAlarmSupport;
  protected readonly putRecordsLatencyAverageMetric: MetricWithAlarmSupport;
  protected readonly putRecordsSuccessCountMetric: MetricWithAlarmSupport;
  protected readonly putRecordsTotalRecordsCountMetric: MetricWithAlarmSupport;
  protected readonly putRecordsSuccessfulRecordsCountMetric: MetricWithAlarmSupport;
  protected readonly putRecordsFailedRecordsCountMetric: MetricWithAlarmSupport;
  protected readonly putRecordsThrottledRecordsCountMetric: MetricWithAlarmSupport;
  protected readonly readProvisionedThroughputExceededMetric: MetricWithAlarmSupport;
  protected readonly writeProvisionedThroughputExceededMetric: MetricWithAlarmSupport;

  constructor(scope: MonitoringScope, props: KinesisDataStreamMonitoringProps) {
    super(scope, props);

    const namingStrategy = new MonitoringNamingStrategy({
      ...props,
      fallbackConstructName: props.streamName,
    });
    this.title = namingStrategy.resolveHumanReadableName();
    this.streamUrl = scope
      .createAwsConsoleUrlFactory()
      .getKinesisDataStreamUrl(props.streamName);

    const alarmFactory = this.createAlarmFactory(
      namingStrategy.resolveAlarmFriendlyName()
    );
    this.kinesisAlarmFactory = new KinesisAlarmFactory(alarmFactory);
    this.provisionedCapacityAnnotations = [];
    this.ageAnnotations = [];
    this.recordCountAnnotations = [];

    const metricFactory = new KinesisDataStreamMetricFactory(
      scope.createMetricFactory(),
      props
    );
    this.metricGetRecordSumBytes = metricFactory.metricGetRecordsSumBytes();
    this.metricGetRecordsIteratorAge =
      metricFactory.metricGetRecordsIteratorAgeMaxMs();
    this.metricGetRecordsLatencyAverage =
      metricFactory.metricGetRecordsLatencyAverageMs();
    this.metricGetRecordsSumCount = metricFactory.metricGetRecordsSumCount();
    this.metricGetRecordsSuccessCount =
      metricFactory.metricGetRecordsSuccessCount();
    this.incomingDataSumBytesMetric =
      metricFactory.metricIncomingDataSumBytes();
    this.incomingDataSumCountMetric =
      metricFactory.metricIncomingDataSumCount();
    this.putRecordSumBytesMetric = metricFactory.metricPutRecordSumBytes();
    this.putRecordLatencyAverageMetric =
      metricFactory.metricPutRecordLatencyAverageMs();
    this.putRecordSuccessCountMetric =
      metricFactory.metricPutRecordSuccessCount();
    this.putRecordsSumBytesMetric = metricFactory.metricPutRecordsSumBytes();
    this.putRecordsLatencyAverageMetric =
      metricFactory.metricPutRecordsLatencyAverageMs();
    this.putRecordsSuccessCountMetric =
      metricFactory.metricPutRecordsSuccessCount();
    this.putRecordsTotalRecordsCountMetric =
      metricFactory.metricPutRecordsTotalRecordsCount();
    this.putRecordsSuccessfulRecordsCountMetric =
      metricFactory.metricPutRecordsSuccessfulRecordsCount();
    this.putRecordsThrottledRecordsCountMetric =
      metricFactory.metricPutRecordsThrottledRecordsCount();
    this.putRecordsFailedRecordsCountMetric =
      metricFactory.metricPutRecordsFailedRecordsCount();
    this.readProvisionedThroughputExceededMetric =
      metricFactory.metricReadProvisionedThroughputExceededPercent();
    this.writeProvisionedThroughputExceededMetric =
      metricFactory.metricWriteProvisionedThroughputExceededPercent();

    for (const disambiguator in props.addIteratorMaxAgeAlarm) {
      const alarmProps = props.addIteratorMaxAgeAlarm[disambiguator];
      const createdAlarm = this.kinesisAlarmFactory.addIteratorMaxAgeAlarm(
        this.metricGetRecordsIteratorAge,
        alarmProps,
        disambiguator
      );
      this.ageAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }
    for (const disambiguator in props.addPutRecordsThrottledAlarm) {
      const alarmProps = props.addPutRecordsThrottledAlarm[disambiguator];
      const createdAlarm = this.kinesisAlarmFactory.addPutRecordsThrottledAlarm(
        this.putRecordsThrottledRecordsCountMetric,
        alarmProps,
        disambiguator
      );
      this.recordCountAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }
    for (const disambiguator in props.addPutRecordsFailedAlarm) {
      const alarmProps = props.addPutRecordsFailedAlarm[disambiguator];
      const createdAlarm = this.kinesisAlarmFactory.addPutRecordsFailedAlarm(
        this.putRecordsFailedRecordsCountMetric,
        alarmProps,
        disambiguator
      );
      this.recordCountAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }
    for (const disambiguator in props.addReadProvisionedThroughputExceededAlarm) {
      const alarmProps =
        props.addReadProvisionedThroughputExceededAlarm[disambiguator];
      const createdAlarm =
        this.kinesisAlarmFactory.addProvisionedReadThroughputExceededAlarm(
          this.readProvisionedThroughputExceededMetric,
          alarmProps,
          disambiguator
        );
      this.provisionedCapacityAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }
    for (const disambiguator in props.addWriteProvisionedThroughputExceededAlarm) {
      const alarmProps =
        props.addWriteProvisionedThroughputExceededAlarm[disambiguator];
      const createdAlarm =
        this.kinesisAlarmFactory.addProvisionedWriteThroughputExceededAlarm(
          this.writeProvisionedThroughputExceededMetric,
          alarmProps,
          disambiguator
        );
      this.provisionedCapacityAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }

    props.useCreatedAlarms?.consume(this.createdAlarms());
  }

  summaryWidgets(): IWidget[] {
    return [
      this.createTitleWidget(),
      new Row(
        this.createIncomingDataWidget(QuarterWidth, DefaultSummaryWidgetHeight),
        this.createIteratorAgeWidget(QuarterWidth, DefaultSummaryWidgetHeight),
        this.createLatencyWidget(QuarterWidth, DefaultSummaryWidgetHeight),
        this.createCapacityWidget(QuarterWidth, DefaultSummaryWidgetHeight)
      ),
    ];
  }

  widgets(): IWidget[] {
    return [
      this.createTitleWidget(),
      new Row(
        this.createIncomingDataWidget(QuarterWidth, DefaultGraphWidgetHeight),
        this.createIteratorAgeWidget(QuarterWidth, DefaultGraphWidgetHeight),
        this.createLatencyWidget(QuarterWidth, DefaultGraphWidgetHeight),
        this.createCapacityWidget(QuarterWidth, DefaultGraphWidgetHeight)
      ),
      this.createFirstAdditionalRow(),
      this.createSecondAdditionalRow(),
    ];
  }

  private createFirstAdditionalRow() {
    return new Row(
      this.createRecordSizeWidget(HalfWidth, DefaultGraphWidgetHeight),
      this.createOperationWidget(HalfWidth, DefaultGraphWidgetHeight)
    );
  }

  protected createSecondAdditionalRow() {
    return new Row(
      this.createRecordNumberWidget(FullWidth, DefaultGraphWidgetHeight)
    );
  }

  protected createTitleWidget() {
    return new MonitoringHeaderWidget({
      family: "Kinesis Data Stream",
      title: this.title,
      goToLinkUrl: this.streamUrl,
    });
  }

  protected createIncomingDataWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Incoming",
      left: [this.incomingDataSumCountMetric],
      leftYAxis: CountAxisFromZero,
    });
  }

  protected createIteratorAgeWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Iterator",
      left: [this.metricGetRecordsIteratorAge],
      leftAnnotations: this.ageAnnotations,
      leftYAxis: TimeAxisMillisFromZero,
    });
  }

  protected createLatencyWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Latency (Average)",
      left: [
        this.metricGetRecordsLatencyAverage,
        this.putRecordLatencyAverageMetric,
        this.putRecordsLatencyAverageMetric,
      ],
      leftYAxis: TimeAxisMillisFromZero,
    });
  }

  protected createCapacityWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Provisioned Capacity Exceeded",
      left: [
        this.readProvisionedThroughputExceededMetric,
        this.writeProvisionedThroughputExceededMetric,
      ],
      leftYAxis: TimeAxisMillisFromZero,
      leftAnnotations: this.provisionedCapacityAnnotations,
    });
  }

  protected createRecordSizeWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Bytes",
      left: [
        this.metricGetRecordSumBytes,
        this.putRecordSumBytesMetric,
        this.putRecordsSumBytesMetric,
      ],
      leftYAxis: SizeAxisBytesFromZero,
    });
  }

  protected createOperationWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Successful Operations",
      left: [
        this.metricGetRecordsSuccessCount,
        this.putRecordSuccessCountMetric,
        this.putRecordsSuccessCountMetric,
      ],
      leftYAxis: CountAxisFromZero,
    });
  }

  protected createRecordNumberWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Records",
      left: [
        this.metricGetRecordsSumCount,
        this.putRecordsTotalRecordsCountMetric,
        this.putRecordsSuccessfulRecordsCountMetric,
        this.putRecordsFailedRecordsCountMetric,
        this.putRecordsThrottledRecordsCountMetric,
      ],
      leftAnnotations: this.recordCountAnnotations,
      leftYAxis: CountAxisFromZero,
    });
  }
}
