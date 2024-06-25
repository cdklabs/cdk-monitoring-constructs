import { IQueue } from "aws-cdk-lib/aws-sqs";

import {
  BaseMetricFactory,
  BaseMetricFactoryProps,
  MetricFactory,
  MetricStatistic,
} from "../../common";

export interface SqsQueueMetricFactoryProps extends BaseMetricFactoryProps {
  readonly queue: IQueue;
}

export class SqsQueueMetricFactory extends BaseMetricFactory<SqsQueueMetricFactoryProps> {
  protected readonly queue: IQueue;

  constructor(metricFactory: MetricFactory, props: SqsQueueMetricFactoryProps) {
    super(metricFactory, props);

    this.queue = props.queue;
  }

  metricApproximateVisibleMessageCount() {
    return this.metricFactory.adaptMetric(
      this.queue.metricApproximateNumberOfMessagesVisible({
        label: "Visible",
      }),
    );
  }

  metricIncomingMessageCount() {
    return this.metricFactory.adaptMetric(
      this.queue.metricNumberOfMessagesSent({
        statistic: MetricStatistic.SUM,
        label: "Incoming",
      }),
    );
  }

  metricDeletedMessageCount() {
    return this.metricFactory.adaptMetric(
      this.queue.metricNumberOfMessagesDeleted({
        statistic: MetricStatistic.SUM,
        label: "Deleted",
      }),
    );
  }

  metricApproximateAgeOfOldestMessageInSeconds() {
    return this.metricFactory.adaptMetric(
      this.queue.metricApproximateAgeOfOldestMessage({
        label: "Age",
      }),
    );
  }

  metricAverageMessageSizeInBytes() {
    return this.metricFactory.adaptMetric(
      this.queue.metricSentMessageSize({
        label: "Size",
      }),
    );
  }

  metricProductionRate() {
    return this.metricFactory.createMetricMath(
      "(productionVolume / PERIOD(productionVolume))",
      {
        productionVolume: this.metricIncomingMessageCount(),
      },
      "Production TPS (avg: ${AVG}, max: ${MAX})",
    );
  }

  metricConsumptionRate() {
    return this.metricFactory.createMetricMath(
      "(consumptionVolume / PERIOD(consumptionVolume))",
      {
        consumptionVolume: this.metricDeletedMessageCount(),
      },
      "Consumption TPS (avg: ${AVG}, max: ${MAX})",
    );
  }

  // Time to drain queue (number of visible messages / net consumption rate)
  // Net consumption rate is defined by consumption rate - incoming rate
  metricTimeToDrain() {
    return this.metricFactory.createMetricMath(
      "(visibleMessages / (consumptionVolume - incomingVolume)) * (PERIOD(consumptionVolume))",
      {
        visibleMessages: this.metricApproximateVisibleMessageCount(),
        incomingVolume: this.metricIncomingMessageCount(),
        consumptionVolume: this.metricDeletedMessageCount(),
      },
      "Time to Drain (seconds) (avg: ${AVG}, max: ${MAX})",
    );
  }
}
