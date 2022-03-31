import { DimensionsMap } from "aws-cdk-lib/aws-cloudwatch";

import { MetricFactory, MetricStatistic } from "../../common";

const FirehoseNamespace = "AWS/Firehose";

export interface KinesisFirehoseMetricFactoryProps {
  readonly deliveryStreamName: string;
}

/**
 * @see https://docs.aws.amazon.com/firehose/latest/dev/monitoring-with-cloudwatch-metrics.html
 */
export class KinesisFirehoseMetricFactory {
  protected readonly metricFactory: MetricFactory;
  protected readonly dimensionsMap: DimensionsMap;

  constructor(
    metricFactory: MetricFactory,
    props: KinesisFirehoseMetricFactoryProps
  ) {
    this.metricFactory = metricFactory;
    this.dimensionsMap = {
      DeliveryStreamName: props.deliveryStreamName,
    };
  }

  metricSuccessfulConversionCount() {
    return this.metricFactory.createMetric(
      "SucceedConversion.Records",
      MetricStatistic.SUM,
      "Succeed",
      this.dimensionsMap,
      undefined,
      FirehoseNamespace
    );
  }

  metricFailedConversionCount() {
    return this.metricFactory.createMetric(
      "FailedConversion.Records",
      MetricStatistic.SUM,
      "Failed",
      this.dimensionsMap,
      undefined,
      FirehoseNamespace
    );
  }

  metricIncomingBytes() {
    return this.metricFactory.createMetric(
      "IncomingBytes",
      MetricStatistic.SUM,
      "Incoming (bytes)",
      this.dimensionsMap,
      undefined,
      FirehoseNamespace
    );
  }

  metricIncomingRecordCount() {
    return this.metricFactory.createMetric(
      "IncomingRecords",
      MetricStatistic.SUM,
      "Incoming",
      this.dimensionsMap,
      undefined,
      FirehoseNamespace
    );
  }

  metricThrottledRecordCount() {
    return this.metricFactory.createMetric(
      "ThrottledRecords",
      MetricStatistic.SUM,
      "Throttled",
      this.dimensionsMap,
      undefined,
      FirehoseNamespace
    );
  }

  metricPutRecordLatencyP90InMillis() {
    return this.metricFactory.createMetric(
      "PutRecord.Latency",
      MetricStatistic.P90,
      "PutRecord P90",
      this.dimensionsMap,
      undefined,
      FirehoseNamespace
    );
  }

  metricPutRecordBatchLatencyP90InMillis() {
    return this.metricFactory.createMetric(
      "PutRecordBatch.Latency",
      MetricStatistic.P90,
      "PutRecordBatch P90",
      this.dimensionsMap,
      undefined,
      FirehoseNamespace
    );
  }
}
