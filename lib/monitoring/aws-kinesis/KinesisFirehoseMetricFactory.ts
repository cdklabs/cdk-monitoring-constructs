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
    return this.metricFactory.metric({
      metricName: "SucceedConversion.Records",
      statistic: MetricStatistic.SUM,
      label: "Succeed",
      dimensionsMap: this.dimensionsMap,
      namespace: FirehoseNamespace,
      region: this.region,
      account: this.account,
    });
  }

  metricFailedConversionCount() {
    return this.metricFactory.metric({
      metricName: "FailedConversion.Records",
      statistic: MetricStatistic.SUM,
      label: "Failed",
      dimensionsMap: this.dimensionsMap,
      namespace: FirehoseNamespace,
      region: this.region,
      account: this.account,
    });
  }

  metricIncomingBytes() {
    return this.metricFactory.metric({
      metricName: "IncomingBytes",
      statistic: MetricStatistic.SUM,
      label: "Incoming (bytes)",
      dimensionsMap: this.dimensionsMap,
      namespace: FirehoseNamespace,
      region: this.region,
      account: this.account,
    });
  }

  metricIncomingPutRequests() {
    return this.metricFactory.metric({
      metricName: "IncomingPutRequests",
      statistic: MetricStatistic.SUM,
      label: "Incoming (PutRequest)",
      dimensionsMap: this.dimensionsMap,
      namespace: FirehoseNamespace,
      region: this.region,
      account: this.account,
    });
  }

  metricIncomingRecordCount() {
    return this.metricFactory.metric({
      metricName: "IncomingRecords",
      statistic: MetricStatistic.SUM,
      label: "Incoming (Records)",
      dimensionsMap: this.dimensionsMap,
      namespace: FirehoseNamespace,
      region: this.region,
      account: this.account,
    });
  }

  metricThrottledRecordCount() {
    return this.metricFactory.metric({
      metricName: "ThrottledRecords",
      statistic: MetricStatistic.SUM,
      label: "Throttled",
      dimensionsMap: this.dimensionsMap,
      namespace: FirehoseNamespace,
      region: this.region,
      account: this.account,
    });
  }

  metricPutRecordLatencyP90InMillis() {
    return this.metricFactory.metric({
      metricName: "PutRecord.Latency",
      statistic: MetricStatistic.P90,
      label: "PutRecord P90",
      dimensionsMap: this.dimensionsMap,
      namespace: FirehoseNamespace,
      region: this.region,
      account: this.account,
    });
  }

  metricPutRecordBatchLatencyP90InMillis() {
    return this.metricFactory.metric({
      metricName: "PutRecordBatch.Latency",
      statistic: MetricStatistic.P90,
      label: "PutRecordBatch P90",
      dimensionsMap: this.dimensionsMap,
      namespace: FirehoseNamespace,
      region: this.region,
      account: this.account,
    });
  }

  metricIncomingBytesToLimitRate() {
    return this.metricFactory.createMetricMath(
      "(bytes_in / PERIOD(bytes_in)) / bytes_max",
      {
        bytes_in: this.metricIncomingBytes(),
        bytes_max: this.metricBytesPerSecondLimit(),
      },
      "Incoming Bytes / Limit",
      undefined,
      undefined,
      this.region,
      this.account,
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
      undefined,
      undefined,
      this.region,
      this.account,
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
      undefined,
      undefined,
      this.region,
      this.account,
    );
  }

  metricBytesPerSecondLimit() {
    return this.metricFactory.metric({
      metricName: "BytesPerSecondLimit",
      statistic: MetricStatistic.AVERAGE,
      label: "Incoming Bytes/s Limit",
      dimensionsMap: this.dimensionsMap,
      namespace: FirehoseNamespace,
      region: this.region,
      account: this.account,
    });
  }

  metricRecordsPerSecondLimit() {
    return this.metricFactory.metric({
      metricName: "RecordsPerSecondLimit",
      statistic: MetricStatistic.AVERAGE,
      label: "Records/s Limit",
      dimensionsMap: this.dimensionsMap,
      namespace: FirehoseNamespace,
      region: this.region,
      account: this.account,
    });
  }

  metricPutRequestsPerSecondLimit() {
    return this.metricFactory.metric({
      metricName: "PutRequestsPerSecondLimit",
      statistic: MetricStatistic.AVERAGE,
      label: "PutRequests/s Limit",
      dimensionsMap: this.dimensionsMap,
      namespace: FirehoseNamespace,
      region: this.region,
      account: this.account,
    });
  }
}
