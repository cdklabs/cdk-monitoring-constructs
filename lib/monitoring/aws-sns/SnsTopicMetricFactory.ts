import { ITopic } from "aws-cdk-lib/aws-sns";

import {
  BaseMetricFactory,
  BaseMetricFactoryProps,
  MetricFactory,
} from "../../common";

export interface SnsTopicMetricFactoryProps extends BaseMetricFactoryProps {
  readonly topic: ITopic;
}

export class SnsTopicMetricFactory extends BaseMetricFactory<SnsTopicMetricFactoryProps> {
  protected readonly topic: ITopic;

  constructor(metricFactory: MetricFactory, props: SnsTopicMetricFactoryProps) {
    super(metricFactory, props);

    this.topic = props.topic;
  }

  metricIncomingMessageCount() {
    return this.metricFactory.adaptMetric(
      this.topic.metricNumberOfMessagesPublished({
        label: "Incoming",
        region: this.region,
        account: this.account,
      }),
    );
  }

  metricOutgoingMessageCount() {
    return this.metricFactory.adaptMetric(
      this.topic.metricNumberOfNotificationsDelivered({
        label: "Outgoing",
        region: this.region,
        account: this.account,
      }),
    );
  }

  metricAverageMessageSizeInBytes() {
    return this.metricFactory.adaptMetric(
      this.topic.metricPublishSize({
        label: "Size",
        region: this.region,
        account: this.account,
      }),
    );
  }

  metricNumberOfNotificationsFailed() {
    return this.metricFactory.adaptMetric(
      this.topic.metricNumberOfNotificationsFailed({
        label: "Failed",
        region: this.region,
        account: this.account,
      }),
    );
  }
}
