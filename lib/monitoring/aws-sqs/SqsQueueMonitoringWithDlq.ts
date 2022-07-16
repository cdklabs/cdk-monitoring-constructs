import {
  GraphWidget,
  HorizontalAnnotation,
  IWidget,
} from "aws-cdk-lib/aws-cloudwatch";
import { IQueue } from "aws-cdk-lib/aws-sqs";

import {
  CountAxisFromZero,
  DefaultGraphWidgetHeight,
  DefaultSummaryWidgetHeight,
  HalfWidth,
  MaxIncomingMessagesCountThreshold,
  MaxMessageAgeThreshold,
  MaxMessageCountThreshold,
  MetricWithAlarmSupport,
  MonitoringScope,
  QueueAlarmFactory,
  TimeAxisSecondsFromZero,
} from "../../common";
import {
  MonitoringHeaderWidget,
  MonitoringNamingStrategy,
} from "../../dashboard";
import { SqsQueueMetricFactory } from "./SqsQueueMetricFactory";
import {
  SqsQueueMonitoring,
  SqsQueueMonitoringProps,
} from "./SqsQueueMonitoring";

export interface BaseDlqAlarms {
  readonly addDeadLetterQueueMaxSizeAlarm?: Record<
    string,
    MaxMessageCountThreshold
  >;

  readonly addDeadLetterQueueMaxMessageAgeAlarm?: Record<
    string,
    MaxMessageAgeThreshold
  >;

  /**
   * Alarm on the number of messages added to a queue.
   *
   * Note that this corresponds with the NumberOfMessagesSent metric, which does not capture messages sent to the DLQ
   * as a result of a failed processing attempt.
   *
   * @see https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html#sqs-dlq-number-of-messages
   */
  readonly addDeadLetterQueueMaxIncomingMessagesAlarm?: Record<
    string,
    MaxIncomingMessagesCountThreshold
  >;
}

export interface SqsQueueMonitoringWithDlqProps
  extends SqsQueueMonitoringProps,
    BaseDlqAlarms {
  readonly deadLetterQueue: IQueue;

  /**
   * Indicates whether the DLQ monitoring should be added to summary dashboard.
   *
   * @default - true
   */
  readonly addDeadLetterQueueToSummaryDashboard?: boolean;
}

export class SqsQueueMonitoringWithDlq extends SqsQueueMonitoring {
  protected readonly deadLetterTitle: string;
  protected readonly deadLetterUrl?: string;
  protected readonly addDeadLetterQueueToSummaryDashboard: boolean;

  protected readonly deadLetterQueueAlarmFactory: QueueAlarmFactory;
  protected readonly deadLetterCountAnnotations: HorizontalAnnotation[];
  protected readonly deadLetterAgeAnnotations: HorizontalAnnotation[];

  protected readonly deadLetterQueueVisibleMessagesMetric: MetricWithAlarmSupport;
  protected readonly deadLetterQueueIncomingMessagesMetric: MetricWithAlarmSupport;
  protected readonly deadLetterQueueOldestMessageAgeMetric: MetricWithAlarmSupport;

  constructor(scope: MonitoringScope, props: SqsQueueMonitoringWithDlqProps) {
    super(scope, props, true);

    const deadLetterMetricFactory = new SqsQueueMetricFactory(
      scope.createMetricFactory(),
      {
        ...props,
        queue: props.deadLetterQueue,
      }
    );

    const namingStrategy = new MonitoringNamingStrategy({
      ...props,
      namedConstruct: props.deadLetterQueue,
      fallbackConstructName: this.resolveQueueName(props.deadLetterQueue),
    });

    this.deadLetterTitle = namingStrategy.resolveHumanReadableName();
    this.deadLetterUrl = scope
      .createAwsConsoleUrlFactory()
      .getSqsQueueUrl(props.deadLetterQueue.queueUrl);
    this.addDeadLetterQueueToSummaryDashboard =
      props.addDeadLetterQueueToSummaryDashboard ?? false;

    const deadLetterAlarmFactory = this.createAlarmFactory(
      namingStrategy.resolveAlarmFriendlyName() + "-DLQ"
    );
    this.deadLetterCountAnnotations = [];
    this.deadLetterAgeAnnotations = [];

    this.deadLetterQueueAlarmFactory = new QueueAlarmFactory(
      deadLetterAlarmFactory
    );
    this.deadLetterQueueVisibleMessagesMetric =
      deadLetterMetricFactory.metricApproximateVisibleMessageCount();
    this.deadLetterQueueIncomingMessagesMetric =
      deadLetterMetricFactory.metricIncomingMessageCount();
    this.deadLetterQueueOldestMessageAgeMetric =
      deadLetterMetricFactory.metricApproximateAgeOfOldestMessageInSeconds();

    for (const disambiguator in props.addDeadLetterQueueMaxSizeAlarm) {
      const alarmProps = props.addDeadLetterQueueMaxSizeAlarm[disambiguator];
      const createdAlarm =
        this.deadLetterQueueAlarmFactory.addMaxQueueMessageCountAlarm(
          this.deadLetterQueueVisibleMessagesMetric,
          alarmProps,
          disambiguator
        );
      this.deadLetterCountAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }
    for (const disambiguator in props.addDeadLetterQueueMaxMessageAgeAlarm) {
      const alarmProps =
        props.addDeadLetterQueueMaxMessageAgeAlarm[disambiguator];
      const createdAlarm =
        this.deadLetterQueueAlarmFactory.addMaxQueueMessageAgeAlarm(
          this.deadLetterQueueOldestMessageAgeMetric,
          alarmProps,
          disambiguator
        );
      this.deadLetterAgeAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }
    for (const disambiguator in props.addDeadLetterQueueMaxIncomingMessagesAlarm) {
      const alarmProps =
        props.addDeadLetterQueueMaxIncomingMessagesAlarm[disambiguator];
      const createdAlarm =
        this.deadLetterQueueAlarmFactory.addMaxQueueIncomingMessagesCountAlarm(
          this.deadLetterQueueIncomingMessagesMetric,
          alarmProps,
          disambiguator
        );
      this.addAlarm(createdAlarm);
    }

    props.useCreatedAlarms?.consume(this.createdAlarms());
  }

  summaryWidgets(): IWidget[] {
    const addToSummary = this.addDeadLetterQueueToSummaryDashboard ?? true;

    if (!addToSummary) {
      // do not show the DLQ widgets at all
      return super.summaryWidgets();
    }

    return [
      ...super.summaryWidgets(),
      this.createDeadLetterMessageCountWidget(
        HalfWidth,
        DefaultSummaryWidgetHeight
      ),
      this.createDeadLetterMessageAgeWidget(
        HalfWidth,
        DefaultSummaryWidgetHeight
      ),
    ];
  }

  widgets(): IWidget[] {
    return [
      ...super.widgets(),
      this.createDeadLetterTitleWidget(),
      this.createDeadLetterMessageCountWidget(
        HalfWidth,
        DefaultGraphWidgetHeight
      ),
      this.createDeadLetterMessageAgeWidget(
        HalfWidth,
        DefaultGraphWidgetHeight
      ),
    ];
  }

  protected createDeadLetterTitleWidget() {
    return new MonitoringHeaderWidget({
      family: "SQS Dead-Letter Queue",
      title: this.deadLetterTitle,
      goToLinkUrl: this.deadLetterUrl,
    });
  }

  protected createDeadLetterMessageCountWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "DLQ: Message Count",
      left: [
        this.deadLetterQueueVisibleMessagesMetric,
        this.deadLetterQueueIncomingMessagesMetric,
      ],
      leftYAxis: CountAxisFromZero,
      leftAnnotations: this.deadLetterCountAnnotations,
    });
  }

  protected createDeadLetterMessageAgeWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "DLQ: Oldest Message Age",
      left: [this.deadLetterQueueOldestMessageAgeMetric],
      leftYAxis: TimeAxisSecondsFromZero,
      leftAnnotations: this.deadLetterAgeAnnotations,
    });
  }
}
