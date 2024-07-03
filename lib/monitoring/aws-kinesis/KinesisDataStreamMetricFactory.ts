import { DimensionsMap } from "aws-cdk-lib/aws-cloudwatch";

import {
  BaseMetricFactory,
  BaseMetricFactoryProps,
  MetricFactory,
  MetricStatistic,
} from "../../common";

const DataStreamNamespace = "AWS/Kinesis";

export interface KinesisDataStreamMetricFactoryProps
  extends BaseMetricFactoryProps {
  readonly streamName: string;
}

/**
 * @see https://docs.aws.amazon.com/streams/latest/dev/monitoring-with-cloudwatch.html
 */
export class KinesisDataStreamMetricFactory extends BaseMetricFactory<KinesisDataStreamMetricFactoryProps> {
  protected readonly dimensionsMap: DimensionsMap;

  constructor(
    metricFactory: MetricFactory,
    props: KinesisDataStreamMetricFactoryProps,
  ) {
    super(metricFactory, props);

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
      DataStreamNamespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricGetRecordsIteratorAgeMaxMs() {
    return this.metricFactory.createMetric(
      "GetRecords.IteratorAgeMilliseconds",
      MetricStatistic.MAX,
      "Iterator Age",
      this.dimensionsMap,
      undefined,
      DataStreamNamespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricGetRecordsLatencyAverageMs() {
    return this.metricFactory.createMetric(
      "GetRecords.Latency",
      MetricStatistic.AVERAGE,
      "GetRecords",
      this.dimensionsMap,
      undefined,
      DataStreamNamespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricGetRecordsSumCount() {
    return this.metricFactory.createMetric(
      "GetRecords.Records",
      MetricStatistic.SUM,
      "GetRecords.Records",
      this.dimensionsMap,
      undefined,
      DataStreamNamespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricGetRecordsSuccessCount() {
    return this.metricFactory.createMetric(
      "GetRecords.Success",
      MetricStatistic.SUM,
      "GetRecords",
      this.dimensionsMap,
      undefined,
      DataStreamNamespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricIncomingDataSumBytes() {
    return this.metricFactory.createMetric(
      "IncomingBytes",
      MetricStatistic.SUM,
      "Incoming Bytes",
      this.dimensionsMap,
      undefined,
      DataStreamNamespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricIncomingDataSumCount() {
    return this.metricFactory.createMetric(
      "IncomingRecords",
      MetricStatistic.SUM,
      "Incoming Records",
      this.dimensionsMap,
      undefined,
      DataStreamNamespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricPutRecordSumBytes() {
    return this.metricFactory.createMetric(
      "PutRecord.Bytes",
      MetricStatistic.SUM,
      "PutRecord",
      this.dimensionsMap,
      undefined,
      DataStreamNamespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricPutRecordLatencyAverageMs() {
    return this.metricFactory.createMetric(
      "PutRecord.Latency",
      MetricStatistic.AVERAGE,
      "PutRecord",
      this.dimensionsMap,
      undefined,
      DataStreamNamespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricPutRecordSuccessCount() {
    return this.metricFactory.createMetric(
      "PutRecord.Success",
      MetricStatistic.SUM,
      "PutRecord",
      this.dimensionsMap,
      undefined,
      DataStreamNamespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricPutRecordsSumBytes() {
    return this.metricFactory.createMetric(
      "PutRecords.Bytes",
      MetricStatistic.SUM,
      "PutRecords",
      this.dimensionsMap,
      undefined,
      DataStreamNamespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricPutRecordsLatencyAverageMs() {
    return this.metricFactory.createMetric(
      "PutRecords.Latency",
      MetricStatistic.AVERAGE,
      "PutRecords",
      this.dimensionsMap,
      undefined,
      DataStreamNamespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricPutRecordsSuccessCount() {
    return this.metricFactory.createMetric(
      "PutRecords.Success",
      MetricStatistic.SUM,
      "PutRecords",
      this.dimensionsMap,
      undefined,
      DataStreamNamespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricPutRecordsSuccessfulRecordsCount() {
    return this.metricFactory.createMetric(
      "PutRecords.SuccessfulRecords",
      MetricStatistic.SUM,
      "PutRecords.SuccessfulRecords",
      this.dimensionsMap,
      undefined,
      DataStreamNamespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricPutRecordsTotalRecordsCount() {
    return this.metricFactory.createMetric(
      "PutRecords.TotalRecords",
      MetricStatistic.SUM,
      "PutRecords.TotalRecords",
      this.dimensionsMap,
      undefined,
      DataStreamNamespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricPutRecordsFailedRecordsCount() {
    return this.metricFactory.createMetric(
      "PutRecords.FailedRecords",
      MetricStatistic.SUM,
      "PutRecords.FailedRecords",
      this.dimensionsMap,
      undefined,
      DataStreamNamespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricPutRecordsThrottledRecordsCount() {
    return this.metricFactory.createMetric(
      "PutRecords.ThrottledRecords",
      MetricStatistic.SUM,
      "PutRecords.ThrottledRecords",
      this.dimensionsMap,
      undefined,
      DataStreamNamespace,
      undefined,
      this.region,
      this.account,
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
      DataStreamNamespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricWriteProvisionedThroughputExceeded() {
    return this.metricFactory.createMetric(
      "WriteProvisionedThroughputExceeded",
      MetricStatistic.AVERAGE,
      "Write",
      this.dimensionsMap,
      undefined,
      DataStreamNamespace,
      undefined,
      this.region,
      this.account,
    );
  }
}
