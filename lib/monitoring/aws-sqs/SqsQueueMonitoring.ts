import {
  GraphWidget,
  HorizontalAnnotation,
  IWidget,
  Row,
} from "monocdk/aws-cloudwatch";
import { CfnQueue, IQueue } from "monocdk/aws-sqs";

import {
  BaseMonitoringProps,
  CountAxisFromZero,
  DefaultGraphWidgetHeight,
  DefaultSummaryWidgetHeight,
  HalfWidth,
  MaxIncomingMessagesCountThreshold,
  MaxMessageAgeThreshold,
  MaxMessageCountThreshold,
  MaxTimeToDrainThreshold,
  MetricWithAlarmSupport,
  MinIncomingMessagesCountThreshold,
  MinMessageCountThreshold,
  Monitoring,
  MonitoringScope,
  QueueAlarmFactory,
  RateAxisFromZero,
  SizeAxisBytesFromZero,
  ThirdWidth,
  TimeAxisSecondsFromZero,
} from "../../common";
import {
  MonitoringHeaderWidget,
  MonitoringNamingStrategy,
} from "../../dashboard";
import {
  SqsQueueMetricFactory,
  SqsQueueMetricFactoryProps,
} from "./SqsQueueMetricFactory";

export interface BaseSqsQueueAlarms {
  readonly addQueueMinSizeAlarm?: Record<string, MinMessageCountThreshold>;
  readonly addQueueMaxSizeAlarm?: Record<string, MaxMessageCountThreshold>;
  readonly addQueueMaxMessageAgeAlarm?: Record<string, MaxMessageAgeThreshold>;
  readonly addQueueMaxTimeToDrainMessagesAlarm?: Record<
    string,
    MaxTimeToDrainThreshold
  >;
  readonly addQueueMinIncomingMessagesAlarm?: Record<
    string,
    MinIncomingMessagesCountThreshold
  >;
  readonly addQueueMaxIncomingMessagesAlarm?: Record<
    string,
    MaxIncomingMessagesCountThreshold
  >;
}

export interface SqsQueueMonitoringOptions
  extends BaseSqsQueueAlarms,
    BaseMonitoringProps {}

export interface SqsQueueMonitoringProps
  extends SqsQueueMetricFactoryProps,
    SqsQueueMonitoringOptions {}

export class SqsQueueMonitoring extends Monitoring {
  protected readonly title: string;
  protected readonly queueUrl?: string;

  protected readonly queueAlarmFactory: QueueAlarmFactory;
  protected readonly countAnnotations: HorizontalAnnotation[];
  protected readonly ageAnnotations: HorizontalAnnotation[];
  protected readonly timeToDrainAnnotations: HorizontalAnnotation[];

  protected readonly visibleMessagesMetric: MetricWithAlarmSupport;
  protected readonly incomingMessagesMetric: MetricWithAlarmSupport;
  protected readonly deletedMessagesMetric: MetricWithAlarmSupport;
  protected readonly oldestMessageAgeMetric: MetricWithAlarmSupport;
  protected readonly messageSizeMetric: MetricWithAlarmSupport;
  protected readonly productionRateMetric: MetricWithAlarmSupport;
  protected readonly consumptionRateMetric: MetricWithAlarmSupport;
  protected readonly timeToDrainMetric: MetricWithAlarmSupport;

  constructor(
    scope: MonitoringScope,
    props: SqsQueueMonitoringProps,
    invokedFromSuper?: boolean
  ) {
    super(scope, props);

    const namingStrategy = new MonitoringNamingStrategy({
      ...props,
      namedConstruct: props.queue,
      fallbackConstructName: this.resolveQueueName(props.queue),
    });

    this.title = namingStrategy.resolveHumanReadableName();
    this.queueUrl = scope
      .createAwsConsoleUrlFactory()
      .getSqsQueueUrl(props.queue.queueUrl);

    const alarmFactory = this.createAlarmFactory(
      namingStrategy.resolveAlarmFriendlyName()
    );
    this.queueAlarmFactory = new QueueAlarmFactory(alarmFactory);
    this.countAnnotations = [];
    this.ageAnnotations = [];
    this.timeToDrainAnnotations = [];

    const metricFactory = new SqsQueueMetricFactory(
      scope.createMetricFactory(),
      props
    );
    this.visibleMessagesMetric =
      metricFactory.metricApproximateVisibleMessageCount();
    this.incomingMessagesMetric = metricFactory.metricIncomingMessageCount();
    this.deletedMessagesMetric = metricFactory.metricDeletedMessageCount();
    this.oldestMessageAgeMetric =
      metricFactory.metricApproximateAgeOfOldestMessageInSeconds();
    this.messageSizeMetric = metricFactory.metricAverageMessageSizeInBytes();
    this.productionRateMetric = metricFactory.metricProductionRate();
    this.consumptionRateMetric = metricFactory.metricConsumptionRate();
    this.timeToDrainMetric = metricFactory.metricTimeToDrain();

    for (const disambiguator in props.addQueueMinSizeAlarm) {
      const alarmProps = props.addQueueMinSizeAlarm[disambiguator];
      const createdAlarm = this.queueAlarmFactory.addMinQueueMessageCountAlarm(
        this.visibleMessagesMetric,
        alarmProps,
        disambiguator
      );
      this.countAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }
    for (const disambiguator in props.addQueueMaxSizeAlarm) {
      const alarmProps = props.addQueueMaxSizeAlarm[disambiguator];
      const createdAlarm = this.queueAlarmFactory.addMaxQueueMessageCountAlarm(
        this.visibleMessagesMetric,
        alarmProps,
        disambiguator
      );
      this.countAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }
    for (const disambiguator in props.addQueueMaxMessageAgeAlarm) {
      const alarmProps = props.addQueueMaxMessageAgeAlarm[disambiguator];
      const createdAlarm = this.queueAlarmFactory.addMaxQueueMessageAgeAlarm(
        this.oldestMessageAgeMetric,
        alarmProps,
        disambiguator
      );
      this.ageAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }
    for (const disambiguator in props.addQueueMaxTimeToDrainMessagesAlarm) {
      const alarmProps =
        props.addQueueMaxTimeToDrainMessagesAlarm[disambiguator];
      const createdAlarm =
        this.queueAlarmFactory.addMaxQueueTimeToDrainMessagesAlarm(
          this.timeToDrainMetric,
          alarmProps,
          disambiguator
        );
      this.timeToDrainAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }
    for (const disambiguator in props.addQueueMinIncomingMessagesAlarm) {
      const alarmProps = props.addQueueMinIncomingMessagesAlarm[disambiguator];
      const createdAlarm =
        this.queueAlarmFactory.addMinQueueIncomingMessagesCountAlarm(
          this.incomingMessagesMetric,
          alarmProps,
          disambiguator
        );
      this.countAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }
    for (const disambiguator in props.addQueueMaxIncomingMessagesAlarm) {
      const alarmProps = props.addQueueMaxIncomingMessagesAlarm[disambiguator];
      const createdAlarm =
        this.queueAlarmFactory.addMaxQueueIncomingMessagesCountAlarm(
          this.incomingMessagesMetric,
          alarmProps,
          disambiguator
        );
      this.countAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }
    if (!(invokedFromSuper ?? false)) {
      // invoke only when not called from super class, so it is not called twice
      // TODO: find a more elegant solution for this
      props.useCreatedAlarms?.consume(this.createdAlarms());
    }
  }

  summaryWidgets(): IWidget[] {
    return [
      this.createTitleWidget(),
      new Row(
        this.createProducerAndConsumerRateWidget(
          HalfWidth,
          DefaultSummaryWidgetHeight
        ),
        this.createTimeToDrainWidget(HalfWidth, DefaultSummaryWidgetHeight)
      ),
      new Row(
        this.createMessageCountWidget(HalfWidth, DefaultSummaryWidgetHeight),
        this.createMessageAgeWidget(HalfWidth, DefaultSummaryWidgetHeight)
      ),
    ];
  }

  widgets(): IWidget[] {
    return [
      this.createTitleWidget(),
      new Row(
        this.createMessageCountWidget(ThirdWidth, DefaultGraphWidgetHeight),
        this.createMessageAgeWidget(ThirdWidth, DefaultGraphWidgetHeight),
        this.createMessageSizeWidget(ThirdWidth, DefaultGraphWidgetHeight)
      ),
      new Row(
        this.createProducerAndConsumerRateWidget(
          HalfWidth,
          DefaultGraphWidgetHeight
        ),
        this.createTimeToDrainWidget(HalfWidth, DefaultGraphWidgetHeight)
      ),
    ];
  }

  protected createTitleWidget() {
    return new MonitoringHeaderWidget({
      family: "SQS Queue",
      title: this.title,
      goToLinkUrl: this.queueUrl,
    });
  }

  protected createMessageCountWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Message Count",
      left: [this.visibleMessagesMetric, this.incomingMessagesMetric],
      leftYAxis: CountAxisFromZero,
      leftAnnotations: this.countAnnotations,
    });
  }

  protected createMessageAgeWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Oldest Message Age",
      left: [this.oldestMessageAgeMetric],
      leftYAxis: TimeAxisSecondsFromZero,
      leftAnnotations: this.ageAnnotations,
    });
  }

  protected createMessageSizeWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Message Size",
      left: [this.messageSizeMetric],
      leftYAxis: SizeAxisBytesFromZero,
    });
  }

  protected createProducerAndConsumerRateWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Producer vs Consumer (rate)",
      left: [this.productionRateMetric, this.consumptionRateMetric],
      leftYAxis: RateAxisFromZero,
    });
  }

  protected createTimeToDrainWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Time to drain",
      left: [this.timeToDrainMetric],
      leftYAxis: TimeAxisSecondsFromZero,
    });
  }

  protected resolveQueueName(queue: IQueue): string | undefined {
    // try to take the name (if specified) instead of token
    return (queue.node.defaultChild as CfnQueue)?.queueName;
  }
}
