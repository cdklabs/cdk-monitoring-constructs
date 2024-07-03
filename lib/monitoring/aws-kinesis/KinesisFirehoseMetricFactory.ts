import { DimensionsMap } from "aws-cdk-lib/aws-cloudwatch";

import {
  BaseMetricFactory,
  BaseMetricFactoryProps,
  MetricFactory,
  MetricStatistic,
} from "../../common";

const FirehoseNamespace = "AWS/Firehose";

export interface KinesisFirehoseMetricFactoryProps
  extends BaseMetricFactoryProps {
  readonly deliveryStreamName: string;
}

/**
 * @see https://docs.aws.amazon.com/firehose/latest/dev/monitoring-with-cloudwatch-metrics.html
 */
export class KinesisFirehoseMetricFactory extends BaseMetricFactory<KinesisFirehoseMetricFactoryProps> {
  protected readonly dimensionsMap: DimensionsMap;

  constructor(
    metricFactory: MetricFactory,
    props: KinesisFirehoseMetricFactoryProps,
  ) {
    super(metricFactory, props);

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
      FirehoseNamespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricFailedConversionCount() {
    return this.metricFactory.createMetric(
      "FailedConversion.Records",
      MetricStatistic.SUM,
      "Failed",
      this.dimensionsMap,
      undefined,
      FirehoseNamespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricIncomingBytes() {
    return this.metricFactory.createMetric(
      "IncomingBytes",
      MetricStatistic.SUM,
      "Incoming (bytes)",
      this.dimensionsMap,
      undefined,
      FirehoseNamespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricIncomingPutRequests() {
    return this.metricFactory.createMetric(
      "IncomingPutRequests",
      MetricStatistic.SUM,
      "Incoming (PutRequest)",
      this.dimensionsMap,
      undefined,
      FirehoseNamespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricIncomingRecordCount() {
    return this.metricFactory.createMetric(
      "IncomingRecords",
      MetricStatistic.SUM,
      "Incoming (Records)",
      this.dimensionsMap,
      undefined,
      FirehoseNamespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricThrottledRecordCount() {
    return this.metricFactory.createMetric(
      "ThrottledRecords",
      MetricStatistic.SUM,
      "Throttled",
      this.dimensionsMap,
      undefined,
      FirehoseNamespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricPutRecordLatencyP90InMillis() {
    return this.metricFactory.createMetric(
      "PutRecord.Latency",
      MetricStatistic.P90,
      "PutRecord P90",
      this.dimensionsMap,
      undefined,
      FirehoseNamespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricPutRecordBatchLatencyP90InMillis() {
    return this.metricFactory.createMetric(
      "PutRecordBatch.Latency",
      MetricStatistic.P90,
      "PutRecordBatch P90",
      this.dimensionsMap,
      undefined,
      FirehoseNamespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricIncomingBytesToLimitRate() {
    return this.metricFactory.createMetricMath(
      "(bytes_in / PERIOD(bytes_in)) / bytes_max",
      {
        bytes_in: this.metricIncomingBytes(),
        bytes_max: this.metricBytesPerSecondLimit(),
      },
      "Incoming Bytes / Limit",
    );
  }

  metricIncomingRecordsToLimitRate() {
    return this.metricFactory.createMetricMath(
      "(records_in / PERIOD(records_in)) / records_max",
      {
        records_in: this.metricIncomingRecordCount(),
        records_max: this.metricRecordsPerSecondLimit(),
      },
      "Incoming Records / Limit",
    );
  }

  metricIncomingPutRequestsToLimitRate() {
    return this.metricFactory.createMetricMath(
      "(requests_in / PERIOD(requests_in)) / requests_max",
      {
        requests_in: this.metricIncomingPutRequests(),
        requests_max: this.metricPutRequestsPerSecondLimit(),
      },
      "Incoming PutRequests / Limit",
    );
  }

  metricBytesPerSecondLimit() {
    return this.metricFactory.createMetric(
      "BytesPerSecondLimit",
      MetricStatistic.AVERAGE,
      "Incoming Bytes/s Limit",
      this.dimensionsMap,
      undefined,
      FirehoseNamespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricRecordsPerSecondLimit() {
    return this.metricFactory.createMetric(
      "RecordsPerSecondLimit",
      MetricStatistic.AVERAGE,
      "Records/s Limit",
      this.dimensionsMap,
      undefined,
      FirehoseNamespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricPutRequestsPerSecondLimit() {
    return this.metricFactory.createMetric(
      "PutRequestsPerSecondLimit",
      MetricStatistic.AVERAGE,
      "PutRequests/s Limit",
      this.dimensionsMap,
      undefined,
      FirehoseNamespace,
      undefined,
      this.region,
      this.account,
    );
  }
}
