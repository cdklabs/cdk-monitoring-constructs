import {
  GraphWidget,
  HorizontalAnnotation,
  IWidget,
} from "aws-cdk-lib/aws-cloudwatch";
import { CfnTopic, ITopic } from "aws-cdk-lib/aws-sns";

import {
  SnsTopicMetricFactory,
  SnsTopicMetricFactoryProps,
} from "./SnsTopicMetricFactory";
import {
  BaseMonitoringProps,
  CountAxisFromZero,
  DefaultGraphWidgetHeight,
  DefaultSummaryWidgetHeight,
  HalfWidth,
  HighMessagesPublishedThreshold,
  LowMessagesPublishedThreshold,
  MetricWithAlarmSupport,
  Monitoring,
  MonitoringScope,
  NotificationsFailedThreshold,
  SizeAxisBytesFromZero,
  ThirdWidth,
  TopicAlarmFactory,
} from "../../common";
import {
  MonitoringHeaderWidget,
  MonitoringNamingStrategy,
} from "../../dashboard";

export interface SnsTopicMonitoringOptions extends BaseMonitoringProps {
  readonly addMessageNotificationsFailedAlarm?: Record<
    string,
    NotificationsFailedThreshold
  >;
  readonly addMinNumberOfMessagesPublishedAlarm?: Record<
    string,
    LowMessagesPublishedThreshold
  >;
  readonly addMaxNumberOfMessagesPublishedAlarm?: Record<
    string,
    HighMessagesPublishedThreshold
  >;
}

export interface SnsTopicMonitoringProps
  extends SnsTopicMetricFactoryProps,
    SnsTopicMonitoringOptions {}

export class SnsTopicMonitoring extends Monitoring {
  readonly title: string;
  readonly topicUrl?: string;

  readonly topicAlarmFactory: TopicAlarmFactory;
  readonly failedDeliveryAnnotations: HorizontalAnnotation[];
  readonly incomingMessagesAnnotations: HorizontalAnnotation[];

  readonly incomingMessagesMetric: MetricWithAlarmSupport;
  readonly outgoingMessagesMetric: MetricWithAlarmSupport;
  readonly messageSizeMetric: MetricWithAlarmSupport;
  readonly messagesFailedMetric: MetricWithAlarmSupport;

  constructor(scope: MonitoringScope, props: SnsTopicMonitoringProps) {
    super(scope, props);

    const namingStrategy = new MonitoringNamingStrategy({
      ...props,
      namedConstruct: props.topic,
      fallbackConstructName: this.resolveTopicName(props.topic),
    });

    this.title = namingStrategy.resolveHumanReadableName();
    this.topicUrl = scope
      .createAwsConsoleUrlFactory()
      .getSnsTopicUrl(props.topic.topicArn);

    const alarmFactory = this.createAlarmFactory(
      namingStrategy.resolveAlarmFriendlyName()
    );
    this.topicAlarmFactory = new TopicAlarmFactory(alarmFactory);
    this.failedDeliveryAnnotations = [];
    this.incomingMessagesAnnotations = [];

    const metricFactory = new SnsTopicMetricFactory(
      scope.createMetricFactory(),
      props
    );
    this.incomingMessagesMetric = metricFactory.metricIncomingMessageCount();
    this.outgoingMessagesMetric = metricFactory.metricOutgoingMessageCount();
    this.messageSizeMetric = metricFactory.metricAverageMessageSizeInBytes();
    this.messagesFailedMetric =
      metricFactory.metricNumberOfNotificationsFailed();

    for (const disambiguator in props.addMessageNotificationsFailedAlarm) {
      const alarmProps =
        props.addMessageNotificationsFailedAlarm[disambiguator];
      const createdAlarm =
        this.topicAlarmFactory.addMessageNotificationsFailedAlarm(
          this.messagesFailedMetric,
          alarmProps,
          disambiguator
        );
      this.failedDeliveryAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }

    for (const disambiguator in props.addMinNumberOfMessagesPublishedAlarm) {
      const alarmProps =
        props.addMinNumberOfMessagesPublishedAlarm[disambiguator];
      const createdAlarm = this.topicAlarmFactory.addMinMessagesPublishedAlarm(
        this.incomingMessagesMetric,
        alarmProps,
        disambiguator
      );
      this.incomingMessagesAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }

    for (const disambiguator in props.addMaxNumberOfMessagesPublishedAlarm) {
      const alarmProps =
        props.addMaxNumberOfMessagesPublishedAlarm[disambiguator];
      const createdAlarm = this.topicAlarmFactory.addMaxMessagesPublishedAlarm(
        this.incomingMessagesMetric,
        alarmProps,
        disambiguator
      );
      this.incomingMessagesAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }

    props.useCreatedAlarms?.consume(this.createdAlarms());
  }

  summaryWidgets(): IWidget[] {
    return [
      this.createTitleWidget(),
      this.createMessageCountWidget(HalfWidth, DefaultSummaryWidgetHeight),
      this.createMessageFailedWidget(HalfWidth, DefaultSummaryWidgetHeight),
    ];
  }

  widgets(): IWidget[] {
    return [
      this.createTitleWidget(),
      this.createMessageCountWidget(ThirdWidth, DefaultGraphWidgetHeight),
      this.createMessageSizeWidget(ThirdWidth, DefaultGraphWidgetHeight),
      this.createMessageFailedWidget(ThirdWidth, DefaultGraphWidgetHeight),
    ];
  }

  createTitleWidget() {
    return new MonitoringHeaderWidget({
      family: "SNS Topic",
      title: this.title,
      goToLinkUrl: this.topicUrl,
    });
  }

  createMessageCountWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Message Count",
      left: [this.incomingMessagesMetric, this.outgoingMessagesMetric],
      leftYAxis: CountAxisFromZero,
      leftAnnotations: this.incomingMessagesAnnotations,
    });
  }

  createMessageSizeWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Message Size",
      left: [this.messageSizeMetric],
      leftYAxis: SizeAxisBytesFromZero,
    });
  }

  createMessageFailedWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Message Delivery Failed",
      left: [this.messagesFailedMetric],
      leftYAxis: CountAxisFromZero,
      leftAnnotations: this.failedDeliveryAnnotations,
    });
  }

  private resolveTopicName(snsTopic: ITopic): string | undefined {
    // try to take the name (if specified) instead of token
    return (snsTopic.node.defaultChild as CfnTopic)?.topicName;
  }
}
