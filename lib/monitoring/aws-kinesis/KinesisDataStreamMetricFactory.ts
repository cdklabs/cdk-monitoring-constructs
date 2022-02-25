import { DimensionHash } from "monocdk/aws-cloudwatch";

import { MetricFactory, MetricStatistic } from "../../common";

const DataStreamNamespace = "AWS/Kinesis";

export interface KinesisDataStreamMetricFactoryProps {
  readonly streamName: string;
}

/**
 * @see https://docs.aws.amazon.com/streams/latest/dev/monitoring-with-cloudwatch.html
 */
export class KinesisDataStreamMetricFactory {
  protected readonly metricFactory: MetricFactory;
  protected readonly dimensions: DimensionHash;

  constructor(
    metricFactory: MetricFactory,
    props: KinesisDataStreamMetricFactoryProps
  ) {
    this.metricFactory = metricFactory;
    this.dimensions = {
      StreamName: props.streamName,
    };
  }

  metricGetRecordsSumBytes() {
    return this.metricFactory.createMetric(
      "GetRecords.Bytes",
      MetricStatistic.SUM,
      "GetRecords",
      this.dimensions,
      undefined,
      DataStreamNamespace
    );
  }

  metricGetRecordsIteratorAgeMaxMs() {
    return this.metricFactory.createMetric(
      "GetRecords.IteratorAgeMilliseconds",
      MetricStatistic.MAX,
      "Iterator Age",
      this.dimensions,
      undefined,
      DataStreamNamespace
    );
  }

  metricGetRecordsLatencyAverageMs() {
    return this.metricFactory.createMetric(
      "GetRecords.Latency",
      MetricStatistic.AVERAGE,
      "GetRecords",
      this.dimensions,
      undefined,
      DataStreamNamespace
    );
  }

  metricGetRecordsSumCount() {
    return this.metricFactory.createMetric(
      "GetRecords.Records",
      MetricStatistic.SUM,
      "GetRecords.Records",
      this.dimensions,
      undefined,
      DataStreamNamespace
    );
  }

  metricGetRecordsSuccessCount() {
    return this.metricFactory.createMetric(
      "GetRecords.Success",
      MetricStatistic.SUM,
      "GetRecords",
      this.dimensions,
      undefined,
      DataStreamNamespace
    );
  }

  metricIncomingDataSumBytes() {
    return this.metricFactory.createMetric(
      "IncomingBytes",
      MetricStatistic.SUM,
      "Incoming Bytes",
      this.dimensions,
      undefined,
      DataStreamNamespace
    );
  }

  metricIncomingDataSumCount() {
    return this.metricFactory.createMetric(
      "IncomingRecords",
      MetricStatistic.SUM,
      "Incoming Records",
      this.dimensions,
      undefined,
      DataStreamNamespace
    );
  }

  metricPutRecordSumBytes() {
    return this.metricFactory.createMetric(
      "PutRecord.Bytes",
      MetricStatistic.SUM,
      "PutRecord",
      this.dimensions,
      undefined,
      DataStreamNamespace
    );
  }

  metricPutRecordLatencyAverageMs() {
    return this.metricFactory.createMetric(
      "PutRecord.Latency",
      MetricStatistic.AVERAGE,
      "PutRecord",
      this.dimensions,
      undefined,
      DataStreamNamespace
    );
  }

  metricPutRecordSuccessCount() {
    return this.metricFactory.createMetric(
      "PutRecord.Success",
      MetricStatistic.SUM,
      "PutRecord",
      this.dimensions,
      undefined,
      DataStreamNamespace
    );
  }

  metricPutRecordsSumBytes() {
    return this.metricFactory.createMetric(
      "PutRecords.Bytes",
      MetricStatistic.SUM,
      "PutRecords",
      this.dimensions,
      undefined,
      DataStreamNamespace
    );
  }

  metricPutRecordsLatencyAverageMs() {
    return this.metricFactory.createMetric(
      "PutRecords.Latency",
      MetricStatistic.AVERAGE,
      "PutRecords",
      this.dimensions,
      undefined,
      DataStreamNamespace
    );
  }

  metricPutRecordsSuccessCount() {
    return this.metricFactory.createMetric(
      "PutRecords.Success",
      MetricStatistic.SUM,
      "PutRecords",
      this.dimensions,
      undefined,
      DataStreamNamespace
    );
  }

  metricPutRecordsSuccessfulRecordsCount() {
    return this.metricFactory.createMetric(
      "PutRecords.SuccessfulRecords",
      MetricStatistic.SUM,
      "PutRecords.SuccessfulRecords",
      this.dimensions,
      undefined,
      DataStreamNamespace
    );
  }

  metricPutRecordsTotalRecordsCount() {
    return this.metricFactory.createMetric(
      "PutRecords.TotalRecords",
      MetricStatistic.SUM,
      "PutRecords.TotalRecords",
      this.dimensions,
      undefined,
      DataStreamNamespace
    );
  }

  metricPutRecordsFailedRecordsCount() {
    return this.metricFactory.createMetric(
      "PutRecords.FailedRecords",
      MetricStatistic.SUM,
      "PutRecords.FailedRecords",
      this.dimensions,
      undefined,
      DataStreamNamespace
    );
  }

  metricPutRecordsThrottledRecordsCount() {
    return this.metricFactory.createMetric(
      "PutRecords.ThrottledRecords",
      MetricStatistic.SUM,
      "PutRecords.ThrottledRecords",
      this.dimensions,
      undefined,
      DataStreamNamespace
    );
  }

  metricReadProvisionedThroughputExceededPercent() {
    return this.metricFactory.createMetric(
      "ReadProvisionedThroughputExceeded",
      MetricStatistic.AVERAGE,
      "Read",
      this.dimensions,
      undefined,
      DataStreamNamespace
    );
  }

  metricWriteProvisionedThroughputExceededPercent() {
    return this.metricFactory.createMetric(
      "WriteProvisionedThroughputExceeded",
      MetricStatistic.AVERAGE,
      "Write",
      this.dimensions,
      undefined,
      DataStreamNamespace
    );
  }
}
