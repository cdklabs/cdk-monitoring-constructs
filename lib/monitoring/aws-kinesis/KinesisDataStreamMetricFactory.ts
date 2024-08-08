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
    return this.metricFactory.metric({
      metricName: "GetRecords.Bytes",
      statistic: MetricStatistic.SUM,
      label: "GetRecords",
      dimensionsMap: this.dimensionsMap,
      namespace: DataStreamNamespace,
      region: this.region,
      account: this.account,
    });
  }

  metricGetRecordsIteratorAgeMaxMs() {
    return this.metricFactory.metric({
      metricName: "GetRecords.IteratorAgeMilliseconds",
      statistic: MetricStatistic.MAX,
      label: "Iterator Age",
      dimensionsMap: this.dimensionsMap,
      namespace: DataStreamNamespace,
      region: this.region,
      account: this.account,
    });
  }

  metricGetRecordsLatencyAverageMs() {
    return this.metricFactory.metric({
      metricName: "GetRecords.Latency",
      statistic: MetricStatistic.AVERAGE,
      label: "GetRecords",
      dimensionsMap: this.dimensionsMap,
      namespace: DataStreamNamespace,
      region: this.region,
      account: this.account,
    });
  }

  metricGetRecordsSumCount() {
    return this.metricFactory.metric({
      metricName: "GetRecords.Records",
      statistic: MetricStatistic.SUM,
      label: "GetRecords.Records",
      dimensionsMap: this.dimensionsMap,
      namespace: DataStreamNamespace,
      region: this.region,
      account: this.account,
    });
  }

  metricGetRecordsSuccessCount() {
    return this.metricFactory.metric({
      metricName: "GetRecords.Success",
      statistic: MetricStatistic.SUM,
      label: "GetRecords",
      dimensionsMap: this.dimensionsMap,
      namespace: DataStreamNamespace,
      region: this.region,
      account: this.account,
    });
  }

  metricIncomingDataSumBytes() {
    return this.metricFactory.metric({
      metricName: "IncomingBytes",
      statistic: MetricStatistic.SUM,
      label: "Incoming Bytes",
      dimensionsMap: this.dimensionsMap,
      namespace: DataStreamNamespace,
      region: this.region,
      account: this.account,
    });
  }

  metricIncomingDataSumCount() {
    return this.metricFactory.metric({
      metricName: "IncomingRecords",
      statistic: MetricStatistic.SUM,
      label: "Incoming Records",
      dimensionsMap: this.dimensionsMap,
      namespace: DataStreamNamespace,
      region: this.region,
      account: this.account,
    });
  }

  metricPutRecordSumBytes() {
    return this.metricFactory.metric({
      metricName: "PutRecord.Bytes",
      statistic: MetricStatistic.SUM,
      label: "PutRecord",
      dimensionsMap: this.dimensionsMap,
      namespace: DataStreamNamespace,
      region: this.region,
      account: this.account,
    });
  }

  metricPutRecordLatencyAverageMs() {
    return this.metricFactory.metric({
      metricName: "PutRecord.Latency",
      statistic: MetricStatistic.AVERAGE,
      label: "PutRecord",
      dimensionsMap: this.dimensionsMap,
      namespace: DataStreamNamespace,
      region: this.region,
      account: this.account,
    });
  }

  metricPutRecordSuccessCount() {
    return this.metricFactory.metric({
      metricName: "PutRecord.Success",
      statistic: MetricStatistic.SUM,
      label: "PutRecord",
      dimensionsMap: this.dimensionsMap,
      namespace: DataStreamNamespace,
      region: this.region,
      account: this.account,
    });
  }

  metricPutRecordsSumBytes() {
    return this.metricFactory.metric({
      metricName: "PutRecords.Bytes",
      statistic: MetricStatistic.SUM,
      label: "PutRecords",
      dimensionsMap: this.dimensionsMap,
      namespace: DataStreamNamespace,
      region: this.region,
      account: this.account,
    });
  }

  metricPutRecordsLatencyAverageMs() {
    return this.metricFactory.metric({
      metricName: "PutRecords.Latency",
      statistic: MetricStatistic.AVERAGE,
      label: "PutRecords",
      dimensionsMap: this.dimensionsMap,
      namespace: DataStreamNamespace,
      region: this.region,
      account: this.account,
    });
  }

  metricPutRecordsSuccessCount() {
    return this.metricFactory.metric({
      metricName: "PutRecords.Success",
      statistic: MetricStatistic.SUM,
      label: "PutRecords",
      dimensionsMap: this.dimensionsMap,
      namespace: DataStreamNamespace,
      region: this.region,
      account: this.account,
    });
  }

  metricPutRecordsSuccessfulRecordsCount() {
    return this.metricFactory.metric({
      metricName: "PutRecords.SuccessfulRecords",
      statistic: MetricStatistic.SUM,
      label: "PutRecords.SuccessfulRecords",
      dimensionsMap: this.dimensionsMap,
      namespace: DataStreamNamespace,
      region: this.region,
      account: this.account,
    });
  }

  metricPutRecordsTotalRecordsCount() {
    return this.metricFactory.metric({
      metricName: "PutRecords.TotalRecords",
      statistic: MetricStatistic.SUM,
      label: "PutRecords.TotalRecords",
      dimensionsMap: this.dimensionsMap,
      namespace: DataStreamNamespace,
      region: this.region,
      account: this.account,
    });
  }

  metricPutRecordsFailedRecordsCount() {
    return this.metricFactory.metric({
      metricName: "PutRecords.FailedRecords",
      statistic: MetricStatistic.SUM,
      label: "PutRecords.FailedRecords",
      dimensionsMap: this.dimensionsMap,
      namespace: DataStreamNamespace,
      region: this.region,
      account: this.account,
    });
  }

  metricPutRecordsThrottledRecordsCount() {
    return this.metricFactory.metric({
      metricName: "PutRecords.ThrottledRecords",
      statistic: MetricStatistic.SUM,
      label: "PutRecords.ThrottledRecords",
      dimensionsMap: this.dimensionsMap,
      namespace: DataStreamNamespace,
      region: this.region,
      account: this.account,
    });
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
    return this.metricFactory.metric({
      metricName: "ReadProvisionedThroughputExceeded",
      statistic: MetricStatistic.AVERAGE,
      label: "Read",
      dimensionsMap: this.dimensionsMap,
      namespace: DataStreamNamespace,
      region: this.region,
      account: this.account,
    });
  }

  metricWriteProvisionedThroughputExceeded() {
    return this.metricFactory.metric({
      metricName: "WriteProvisionedThroughputExceeded",
      statistic: MetricStatistic.AVERAGE,
      label: "Write",
      dimensionsMap: this.dimensionsMap,
      namespace: DataStreamNamespace,
      region: this.region,
      account: this.account,
    });
  }
}
