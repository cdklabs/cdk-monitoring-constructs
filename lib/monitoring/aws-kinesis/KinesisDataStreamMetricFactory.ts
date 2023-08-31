import { DimensionsMap } from "aws-cdk-lib/aws-cloudwatch";

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
  protected readonly dimensionsMap: DimensionsMap;

  constructor(
    metricFactory: MetricFactory,
    props: KinesisDataStreamMetricFactoryProps
  ) {
    this.metricFactory = metricFactory;
    this.dimensionsMap = {
      StreamName: props.streamName,
    };
  }

  metricGetRecordsSumBytes() {
    return this.metricFactory.createMetric(
      "GetRecords.Bytes",
      MetricStatistic.SUM,
      "GetRecords",
      this.dimensionsMap,
      undefined,
      DataStreamNamespace
    );
  }

  metricGetRecordsIteratorAgeMaxMs() {
    return this.metricFactory.createMetric(
      "GetRecords.IteratorAgeMilliseconds",
      MetricStatistic.MAX,
      "Iterator Age",
      this.dimensionsMap,
      undefined,
      DataStreamNamespace
    );
  }

  metricGetRecordsLatencyAverageMs() {
    return this.metricFactory.createMetric(
      "GetRecords.Latency",
      MetricStatistic.AVERAGE,
      "GetRecords",
      this.dimensionsMap,
      undefined,
      DataStreamNamespace
    );
  }

  metricGetRecordsSumCount() {
    return this.metricFactory.createMetric(
      "GetRecords.Records",
      MetricStatistic.SUM,
      "GetRecords.Records",
      this.dimensionsMap,
      undefined,
      DataStreamNamespace
    );
  }

  metricGetRecordsSuccessCount() {
    return this.metricFactory.createMetric(
      "GetRecords.Success",
      MetricStatistic.SUM,
      "GetRecords",
      this.dimensionsMap,
      undefined,
      DataStreamNamespace
    );
  }

  metricIncomingDataSumBytes() {
    return this.metricFactory.createMetric(
      "IncomingBytes",
      MetricStatistic.SUM,
      "Incoming Bytes",
      this.dimensionsMap,
      undefined,
      DataStreamNamespace
    );
  }

  metricIncomingDataSumCount() {
    return this.metricFactory.createMetric(
      "IncomingRecords",
      MetricStatistic.SUM,
      "Incoming Records",
      this.dimensionsMap,
      undefined,
      DataStreamNamespace
    );
  }

  metricPutRecordSumBytes() {
    return this.metricFactory.createMetric(
      "PutRecord.Bytes",
      MetricStatistic.SUM,
      "PutRecord",
      this.dimensionsMap,
      undefined,
      DataStreamNamespace
    );
  }

  metricPutRecordLatencyAverageMs() {
    return this.metricFactory.createMetric(
      "PutRecord.Latency",
      MetricStatistic.AVERAGE,
      "PutRecord",
      this.dimensionsMap,
      undefined,
      DataStreamNamespace
    );
  }

  metricPutRecordSuccessCount() {
    return this.metricFactory.createMetric(
      "PutRecord.Success",
      MetricStatistic.SUM,
      "PutRecord",
      this.dimensionsMap,
      undefined,
      DataStreamNamespace
    );
  }

  metricPutRecordsSumBytes() {
    return this.metricFactory.createMetric(
      "PutRecords.Bytes",
      MetricStatistic.SUM,
      "PutRecords",
      this.dimensionsMap,
      undefined,
      DataStreamNamespace
    );
  }

  metricPutRecordsLatencyAverageMs() {
    return this.metricFactory.createMetric(
      "PutRecords.Latency",
      MetricStatistic.AVERAGE,
      "PutRecords",
      this.dimensionsMap,
      undefined,
      DataStreamNamespace
    );
  }

  metricPutRecordsSuccessCount() {
    return this.metricFactory.createMetric(
      "PutRecords.Success",
      MetricStatistic.SUM,
      "PutRecords",
      this.dimensionsMap,
      undefined,
      DataStreamNamespace
    );
  }

  metricPutRecordsSuccessfulRecordsCount() {
    return this.metricFactory.createMetric(
      "PutRecords.SuccessfulRecords",
      MetricStatistic.SUM,
      "PutRecords.SuccessfulRecords",
      this.dimensionsMap,
      undefined,
      DataStreamNamespace
    );
  }

  metricPutRecordsTotalRecordsCount() {
    return this.metricFactory.createMetric(
      "PutRecords.TotalRecords",
      MetricStatistic.SUM,
      "PutRecords.TotalRecords",
      this.dimensionsMap,
      undefined,
      DataStreamNamespace
    );
  }

  metricPutRecordsFailedRecordsCount() {
    return this.metricFactory.createMetric(
      "PutRecords.FailedRecords",
      MetricStatistic.SUM,
      "PutRecords.FailedRecords",
      this.dimensionsMap,
      undefined,
      DataStreamNamespace
    );
  }

  metricPutRecordsThrottledRecordsCount() {
    return this.metricFactory.createMetric(
      "PutRecords.ThrottledRecords",
      MetricStatistic.SUM,
      "PutRecords.ThrottledRecords",
      this.dimensionsMap,
      undefined,
      DataStreamNamespace
    );
  }

  /**
   * @deprecated please use `metricReadProvisionedThroughputExceeded` instead
   */
  metricReadProvisionedThroughputExceededPercent() {
    return this.metricReadProvisionedThroughputExceeded();
  }

  /**
   * @deprecated please use `metricWriteProvisionedThroughputExceeded` instead
   */
  metricWriteProvisionedThroughputExceededPercent() {
    return this.metricWriteProvisionedThroughputExceeded();
  }

  metricReadProvisionedThroughputExceeded() {
    return this.metricFactory.createMetric(
      "ReadProvisionedThroughputExceeded",
      MetricStatistic.AVERAGE,
      "Read",
      this.dimensionsMap,
      undefined,
      DataStreamNamespace
    );
  }

  metricWriteProvisionedThroughputExceeded() {
    return this.metricFactory.createMetric(
      "WriteProvisionedThroughputExceeded",
      MetricStatistic.AVERAGE,
      "Write",
      this.dimensionsMap,
      undefined,
      DataStreamNamespace
    );
  }
}
