import {
  ComparisonOperator,
  TreatMissingData,
} from "aws-cdk-lib/aws-cloudwatch";

import { AlarmFactory, CustomAlarmThreshold } from "../../alarm";
import { MetricWithAlarmSupport } from "../../metric";

export interface LowMessagesPublishedThreshold extends CustomAlarmThreshold {
  readonly minMessagesPublishedCount: number;
}

export interface HighMessagesPublishedThreshold extends CustomAlarmThreshold {
  readonly maxMessagesPublishedCount: number;
}

export interface NotificationsFailedThreshold extends CustomAlarmThreshold {
  readonly maxNotificationsFailedCount: number;
}

export class TopicAlarmFactory {
  protected readonly alarmFactory: AlarmFactory;

  constructor(alarmFactory: AlarmFactory) {
    this.alarmFactory = alarmFactory;
  }

  addMinMessagesPublishedAlarm(
    metric: MetricWithAlarmSupport,
    props: LowMessagesPublishedThreshold,
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
      threshold: props.minMessagesPublishedCount,
      alarmNameSuffix: "Topic-Published-Low",
      alarmDescription: `Number of SNS messages published is too low.`,
    });
  }

  addMaxMessagesPublishedAlarm(
    metric: MetricWithAlarmSupport,
    props: HighMessagesPublishedThreshold,
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
      threshold: props.maxMessagesPublishedCount,
      alarmNameSuffix: "Topic-Published-High",
      alarmDescription: `Number of SNS messages published is too high.`,
    });
  }

  addMessageNotificationsFailedAlarm(
    metric: MetricWithAlarmSupport,
    props: NotificationsFailedThreshold,
    disambiguator?: string
  ) {
    const threshold = props.maxNotificationsFailedCount;
    return this.alarmFactory.addAlarm(metric, {
      treatMissingData:
        props.treatMissingDataOverride ?? TreatMissingData.MISSING,
      comparisonOperator:
        props.comparisonOperatorOverride ??
        ComparisonOperator.GREATER_THAN_THRESHOLD,
      ...props,
      disambiguator,
      threshold: threshold,
      alarmNameSuffix: "Topic-Notifications-Failed",
      alarmDescription: `Number of failed sns messages exceeded threshold of ${threshold}.`,
    });
  }
}
