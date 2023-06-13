import { Duration } from "aws-cdk-lib";
import {
  ComparisonOperator,
  TreatMissingData,
} from "aws-cdk-lib/aws-cloudwatch";

import { AlarmFactory, CustomAlarmThreshold } from "../../alarm";
import { MetricWithAlarmSupport } from "../../metric";

export interface MinMessageCountThreshold extends CustomAlarmThreshold {
  readonly minMessageCount: number;
}

export interface MaxMessageCountThreshold extends CustomAlarmThreshold {
  readonly maxMessageCount: number;
}

export interface MaxMessageAgeThreshold extends CustomAlarmThreshold {
  readonly maxAgeInSeconds: number;
}

export interface MaxTimeToDrainThreshold extends CustomAlarmThreshold {
  readonly maxTimeToDrain: Duration;
}

export interface MinIncomingMessagesCountThreshold
  extends CustomAlarmThreshold {
  readonly minIncomingMessagesCount: number;
}

export interface MaxIncomingMessagesCountThreshold
  extends CustomAlarmThreshold {
  readonly maxIncomingMessagesCount: number;
}

export class QueueAlarmFactory {
  protected readonly alarmFactory: AlarmFactory;

  constructor(alarmFactory: AlarmFactory) {
    this.alarmFactory = alarmFactory;
  }

  addMinQueueMessageCountAlarm(
    metric: MetricWithAlarmSupport,
    props: MinMessageCountThreshold,
    disambiguator?: string
  ) {
    return this.alarmFactory.addAlarm(metric, {
      treatMissingData:
        props.treatMissingDataOverride ?? TreatMissingData.MISSING,
      comparisonOperator:
        props.comparisonOperatorOverride ??
        ComparisonOperator.LESS_THAN_THRESHOLD,
      ...props,
      disambiguator,
      threshold: props.minMessageCount,
      alarmNameSuffix: "Queue-Message-Count-Min",
      alarmDescription: `Number of messages in the queue is too low.`,
      // we will dedupe any kind of message count issue to the same ticket
      alarmDedupeStringSuffix: "AnyQueueMessageCount",
    });
  }

  addMaxQueueMessageCountAlarm(
    metric: MetricWithAlarmSupport,
    props: MaxMessageCountThreshold,
    disambiguator?: string
  ) {
    return this.alarmFactory.addAlarm(metric, {
      treatMissingData:
        props.treatMissingDataOverride ?? TreatMissingData.MISSING,
      comparisonOperator:
        props.comparisonOperatorOverride ??
        ComparisonOperator.GREATER_THAN_THRESHOLD,
      ...props,
      disambiguator,
      threshold: props.maxMessageCount,
      alarmNameSuffix: "Queue-Message-Count-Max",
      alarmDescription: `Number of messages in the queue is too high.`,
      // we will dedupe any kind of message count issue to the same ticket
      alarmDedupeStringSuffix: "AnyQueueMessageCount",
    });
  }

  addMaxQueueMessageAgeAlarm(
    metric: MetricWithAlarmSupport,
    props: MaxMessageAgeThreshold,
    disambiguator?: string
  ) {
    return this.alarmFactory.addAlarm(metric, {
      treatMissingData:
        props.treatMissingDataOverride ?? TreatMissingData.MISSING,
      comparisonOperator:
        props.comparisonOperatorOverride ??
        ComparisonOperator.GREATER_THAN_THRESHOLD,
      ...props,
      disambiguator,
      threshold: props.maxAgeInSeconds,
      alarmNameSuffix: "Queue-Message-Age-Max",
      alarmDescription: `Age of the oldest message in the queue is too high.`,
    });
  }

  addMaxQueueTimeToDrainMessagesAlarm(
    metric: MetricWithAlarmSupport,
    props: MaxTimeToDrainThreshold,
    disambiguator?: string
  ) {
    return this.alarmFactory.addAlarm(metric, {
      treatMissingData:
        props.treatMissingDataOverride ?? TreatMissingData.NOT_BREACHING,
      comparisonOperator:
        props.comparisonOperatorOverride ??
        ComparisonOperator.GREATER_THAN_THRESHOLD,
      ...props,
      disambiguator,
      threshold: props.maxTimeToDrain.toSeconds(),
      alarmNameSuffix: "Queue-TimeToDrain-Max",
      alarmDescription: `Time to drain messages in the queue is too high.`,
    });
  }

  addMinQueueIncomingMessagesCountAlarm(
    metric: MetricWithAlarmSupport,
    props: MinIncomingMessagesCountThreshold,
    disambiguator?: string
  ) {
    return this.alarmFactory.addAlarm(metric, {
      treatMissingData:
        props.treatMissingDataOverride ?? TreatMissingData.MISSING,
      comparisonOperator:
        props.comparisonOperatorOverride ??
        ComparisonOperator.LESS_THAN_THRESHOLD,
      ...props,
      disambiguator,
      threshold: props.minIncomingMessagesCount,
      alarmNameSuffix: "Queue-Incoming-Messages-Count-Min",
      alarmDescription: `Number of incoming messages into the queue is too low.`,
    });
  }

  addMaxQueueIncomingMessagesCountAlarm(
    metric: MetricWithAlarmSupport,
    props: MaxIncomingMessagesCountThreshold,
    disambiguator?: string
  ) {
    return this.alarmFactory.addAlarm(metric, {
      treatMissingData:
        props.treatMissingDataOverride ?? TreatMissingData.MISSING,
      comparisonOperator:
        props.comparisonOperatorOverride ??
        ComparisonOperator.GREATER_THAN_THRESHOLD,
      ...props,
      disambiguator,
      threshold: props.maxIncomingMessagesCount,
      alarmNameSuffix: "Queue-Incoming-Messages-Count-Max",
      alarmDescription: `Number of incoming messages into the queue is too high.`,
    });
  }
}
