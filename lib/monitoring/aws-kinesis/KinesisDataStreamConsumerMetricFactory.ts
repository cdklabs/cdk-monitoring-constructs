import { DimensionsMap } from "aws-cdk-lib/aws-cloudwatch";

import {
  BaseMetricFactory,
  BaseMetricFactoryProps,
  MetricFactory,
  MetricStatistic,
} from "../../common";

const DataStreamNamespace = "AWS/Kinesis";

export interface KinesisDataStreamConsumerMetricFactoryProps
  extends BaseMetricFactoryProps {
  readonly streamName: string;
  readonly consumerName: string;
}

/**
 * Metrics for a single enhanced fan-out (EFO) consumer of a Kinesis data stream.
 * Dimensions: {StreamName, ConsumerName}.
 *
 * @see https://docs.aws.amazon.com/streams/latest/dev/monitoring-with-cloudwatch.html#kinesis-metrics-consumer
 */
export class KinesisDataStreamConsumerMetricFactory extends BaseMetricFactory<KinesisDataStreamConsumerMetricFactoryProps> {
  protected readonly dimensionsMap: DimensionsMap;

  constructor(
    metricFactory: MetricFactory,
    props: KinesisDataStreamConsumerMetricFactoryProps,
  ) {
    super(metricFactory, props);
    this.dimensionsMap = {
      StreamName: props.streamName,
      ConsumerName: props.consumerName,
    };
  }

  /** Max lag (ms) for events delivered to this EFO consumer. */
  metricSubscribeToShardEventMillisBehindLatestMaxMs() {
    return this.metricFactory.createMetric(
      "SubscribeToShardEvent.MillisBehindLatest",
      MetricStatistic.MAX,
      "Millis Behind Latest",
      this.dimensionsMap,
      undefined,
      DataStreamNamespace,
      undefined,
      this.region,
      this.account,
    );
  }

  /** Rate at which SubscribeToShard calls for this consumer are throttled. */
  metricSubscribeToShardRateExceededAverage() {
    return this.metricFactory.createMetric(
      "SubscribeToShard.RateExceeded",
      MetricStatistic.AVERAGE,
      "Rate Exceeded",
      this.dimensionsMap,
      undefined,
      DataStreamNamespace,
      undefined,
      this.region,
      this.account,
    );
  }

  /** Success rate of SubscribeToShard calls (connect handshake). */
  metricSubscribeToShardSuccessAverage() {
    return this.metricFactory.createMetric(
      "SubscribeToShard.Success",
      MetricStatistic.AVERAGE,
      "Subscribe Success",
      this.dimensionsMap,
      undefined,
      DataStreamNamespace,
      undefined,
      this.region,
      this.account,
    );
  }

  /** Success rate of individual SubscribeToShardEvent deliveries within an open subscription. */
  metricSubscribeToShardEventSuccessAverage() {
    return this.metricFactory.createMetric(
      "SubscribeToShardEvent.Success",
      MetricStatistic.AVERAGE,
      "Event Success",
      this.dimensionsMap,
      undefined,
      DataStreamNamespace,
      undefined,
      this.region,
      this.account,
    );
  }

  /** Records delivered to this consumer. */
  metricSubscribeToShardEventRecordsSumCount() {
    return this.metricFactory.createMetric(
      "SubscribeToShardEvent.Records",
      MetricStatistic.SUM,
      "Records",
      this.dimensionsMap,
      undefined,
      DataStreamNamespace,
      undefined,
      this.region,
      this.account,
    );
  }

  /** Bytes delivered to this consumer. */
  metricSubscribeToShardEventSumBytes() {
    return this.metricFactory.createMetric(
      "SubscribeToShardEvent.Bytes",
      MetricStatistic.SUM,
      "Bytes",
      this.dimensionsMap,
      undefined,
      DataStreamNamespace,
      undefined,
      this.region,
      this.account,
    );
  }
}
