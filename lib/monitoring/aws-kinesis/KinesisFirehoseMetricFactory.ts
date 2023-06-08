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

  metricIncomingPutRequests() {
    return this.metricFactory.createMetric(
      "IncomingPutRequests",
      MetricStatistic.SUM,
      "Incoming (PutRequest)",
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

  metricIncomingBytesToLimitRate() {
    return this.metricFactory.createMetricMath(
      "(bytes_in / PERIOD(bytes_in)) / bytes_max",
      {
        bytes_in: this.metricIncomingBytes(),
        bytes_max: this.metricBytesPerSecondLimit(),
      },
      "Incoming Bytes / Limit"
    );
  }

  metricIncomingRecordsToLimitRate() {
    return this.metricFactory.createMetricMath(
      "(records_in / PERIOD(records_in)) / records_max",
      {
        records_in: this.metricIncomingRecordCount(),
        records_max: this.metricRecordsPerSecondLimit(),
      },
      "Incoming Records / Limit"
    );
  }

  metricIncomingPutRequestsToLimitRate() {
    return this.metricFactory.createMetricMath(
      "(requests_in / PERIOD(requests_in)) / requests_max",
      {
        requests_in: this.metricIncomingPutRequests(),
        requests_max: this.metricPutRequestsPerSecondLimit(),
      },
      "Incoming PutRequests / Limit"
    );
  }

  metricBytesPerSecondLimit() {
    return this.metricFactory.createMetric(
      "BytesPerSecondLimit",
      MetricStatistic.AVERAGE,
      "Incoming Bytes/s Limit",
      this.dimensionsMap,
      undefined,
      FirehoseNamespace
    );
  }

  metricRecordsPerSecondLimit() {
    return this.metricFactory.createMetric(
      "RecordsPerSecondLimit",
      MetricStatistic.AVERAGE,
      "Records/s Limit",
      this.dimensionsMap,
      undefined,
      FirehoseNamespace
    );
  }

  metricPutRequestsPerSecondLimit() {
    return this.metricFactory.createMetric(
      "PutRequestsPerSecondLimit",
      MetricStatistic.AVERAGE,
      "PutRequests/s Limit",
      this.dimensionsMap,
      undefined,
      FirehoseNamespace
    );
  }
}
