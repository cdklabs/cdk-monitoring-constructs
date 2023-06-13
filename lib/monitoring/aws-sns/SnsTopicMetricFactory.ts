import {ITopic} from "aws-cdk-lib/aws-sns";

import {MetricFactory} from "../../common";

export interface SnsTopicMetricFactoryProps {
    readonly topic: ITopic;
}

export class SnsTopicMetricFactory {
    protected readonly metricFactory: MetricFactory;
    protected readonly topic: ITopic;

    constructor(metricFactory: MetricFactory, props: SnsTopicMetricFactoryProps) {
        this.metricFactory = metricFactory;
        this.topic = props.topic;
    }

    metricIncomingMessageCount() {
        return this.metricFactory.adaptMetric(
            this.topic.metricNumberOfMessagesPublished({
                label: "Incoming",
            }),
        );
    }

    metricOutgoingMessageCount() {
        return this.metricFactory.adaptMetric(
            this.topic.metricNumberOfNotificationsDelivered({
                label: "Outgoing",
            }),
        );
    }

    metricAverageMessageSizeInBytes() {
        return this.metricFactory.adaptMetric(
            this.topic.metricPublishSize({
                label: "Size",
            }),
        );
    }

    metricNumberOfNotificationsFailed() {
        return this.metricFactory.adaptMetric(
            this.topic.metricNumberOfNotificationsFailed({
                label: "Failed",
            }),
        );
    }
}
