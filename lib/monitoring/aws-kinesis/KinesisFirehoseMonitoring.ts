import { GraphWidget, IWidget } from "monocdk/aws-cloudwatch";

import {
  BaseMonitoringProps,
  CountAxisFromZero,
  DefaultGraphWidgetHeight,
  DefaultSummaryWidgetHeight,
  HalfWidth,
  MetricWithAlarmSupport,
  Monitoring,
  MonitoringScope,
  ThirdWidth,
  TimeAxisMillisFromZero,
} from "../../common";
import {
  MonitoringHeaderWidget,
  MonitoringNamingStrategy,
} from "../../dashboard";
import {
  KinesisFirehoseMetricFactory,
  KinesisFirehoseMetricFactoryProps,
} from "./KinesisFirehoseMetricFactory";

export interface KinesisFirehoseMonitoringOptions extends BaseMonitoringProps {}

export interface KinesisFirehoseMonitoringProps
  extends KinesisFirehoseMetricFactoryProps,
    KinesisFirehoseMonitoringOptions {}

export class KinesisFirehoseMonitoring extends Monitoring {
  protected readonly title: string;
  protected readonly streamUrl?: string;

  protected readonly incomingBytesMetric: MetricWithAlarmSupport;
  protected readonly incomingRecordsMetric: MetricWithAlarmSupport;
  protected readonly throttledRecordsMetric: MetricWithAlarmSupport;
  protected readonly successfulConversionMetric: MetricWithAlarmSupport;
  protected readonly failedConversionMetric: MetricWithAlarmSupport;
  protected readonly putRecordLatency: MetricWithAlarmSupport;
  protected readonly putRecordBatchLatency: MetricWithAlarmSupport;

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
      props
    );
    this.incomingBytesMetric = metricFactory.metricIncomingBytes();
    this.incomingRecordsMetric = metricFactory.metricIncomingRecordCount();
    this.throttledRecordsMetric = metricFactory.metricThrottledRecordCount();
    this.successfulConversionMetric =
      metricFactory.metricSuccessfulConversionCount();
    this.failedConversionMetric = metricFactory.metricFailedConversionCount();
    this.putRecordLatency = metricFactory.metricPutRecordLatencyP90InMillis();
    this.putRecordBatchLatency =
      metricFactory.metricPutRecordBatchLatencyP90InMillis();
  }

  summaryWidgets(): IWidget[] {
    return [
      this.createTitleWidget(),
      this.createIncomingRecordWidget(HalfWidth, DefaultSummaryWidgetHeight),
      this.createConversionWidget(HalfWidth, DefaultSummaryWidgetHeight),
    ];
  }

  widgets(): IWidget[] {
    return [
      this.createTitleWidget(),
      this.createIncomingRecordWidget(ThirdWidth, DefaultGraphWidgetHeight),
      this.createLatencyWidget(ThirdWidth, DefaultGraphWidgetHeight),
      this.createConversionWidget(ThirdWidth, DefaultGraphWidgetHeight),
    ];
  }

  protected createTitleWidget() {
    return new MonitoringHeaderWidget({
      family: "Firehose Delivery Stream",
      title: this.title,
      goToLinkUrl: this.streamUrl,
    });
  }

  protected createIncomingRecordWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Records",
      left: [this.incomingRecordsMetric, this.throttledRecordsMetric],
      leftYAxis: CountAxisFromZero,
    });
  }

  protected createLatencyWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Latency (P90)",
      left: [this.putRecordLatency, this.putRecordBatchLatency],
      leftYAxis: TimeAxisMillisFromZero,
    });
  }

  protected createConversionWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Conversions",
      left: [this.successfulConversionMetric, this.failedConversionMetric],
      leftYAxis: CountAxisFromZero,
    });
  }
}
