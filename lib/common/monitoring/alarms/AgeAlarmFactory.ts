import {
  ComparisonOperator,
  TreatMissingData,
} from "aws-cdk-lib/aws-cloudwatch";

import { AlarmFactory, CustomAlarmThreshold } from "../../alarm";
import { MetricWithAlarmSupport } from "../../metric";

export interface DaysToExpiryThreshold extends CustomAlarmThreshold {
  readonly minDaysToExpiry: number;
}

export interface MaxAgeThreshold extends CustomAlarmThreshold {
  readonly maxAgeInMillis: number;
}

export interface MaxOffsetLagThreshold extends CustomAlarmThreshold {
  readonly maxOffsetLag: number;
}

export interface DaysSinceUpdateThreshold extends CustomAlarmThreshold {
  readonly maxDaysSinceUpdate: number;
}

export class AgeAlarmFactory {
  protected readonly alarmFactory: AlarmFactory;

  constructor(alarmFactory: AlarmFactory) {
    this.alarmFactory = alarmFactory;
  }

  addDaysToExpiryAlarm(
    metric: MetricWithAlarmSupport,
    props: DaysToExpiryThreshold,
    disambiguator?: string,
  ) {
    return this.alarmFactory.addAlarm(metric, {
      treatMissingData:
        props.treatMissingDataOverride ?? TreatMissingData.MISSING,
      comparisonOperator:
        props.comparisonOperatorOverride ??
        ComparisonOperator.LESS_THAN_THRESHOLD,
      ...props,
      disambiguator,
      threshold: props.minDaysToExpiry,
      alarmNameSuffix: "DaysToExpiry",
      alarmDescription: "Number of days until expiration is too low.",
    });
  }

  addIteratorMaxAgeAlarm(
    metric: MetricWithAlarmSupport,
    props: MaxAgeThreshold,
    disambiguator?: string,
  ) {
    return this.alarmFactory.addAlarm(metric, {
      treatMissingData:
        props.treatMissingDataOverride ?? TreatMissingData.MISSING,
      comparisonOperator:
        props.comparisonOperatorOverride ??
        ComparisonOperator.GREATER_THAN_THRESHOLD,
      ...props,
      disambiguator,
      threshold: props.maxAgeInMillis,
      alarmNameSuffix: "Iterator-Age-Max",
      alarmDescription: "Iterator Max Age is too high.",
      // Dedupe all iterator max age to the same ticket
      alarmDedupeStringSuffix: "AnyIteratorMaxAge",
    });
  }

  addMaxOffsetLagAlarm(
    metric: MetricWithAlarmSupport,
    props: MaxOffsetLagThreshold,
    disambiguator?: string,
  ) {
    return this.alarmFactory.addAlarm(metric, {
      treatMissingData:
        props.treatMissingDataOverride ?? TreatMissingData.MISSING,
      comparisonOperator:
        props.comparisonOperatorOverride ??
        ComparisonOperator.GREATER_THAN_THRESHOLD,
      ...props,
      disambiguator,
      threshold: props.maxOffsetLag,
      alarmNameSuffix: "Offset-Lag-Max",
      alarmDescription: "Max Offset Lag is too high.",
      // Dedupe all iterator max age to the same ticket
      alarmDedupeStringSuffix: "AnyMaxOffsetLag",
    });
  }

  addDaysSinceUpdateAlarm(
    metric: MetricWithAlarmSupport,
    props: DaysSinceUpdateThreshold,
    disambiguator?: string,
  ) {
    return this.alarmFactory.addAlarm(metric, {
      treatMissingData:
        props.treatMissingDataOverride ?? TreatMissingData.MISSING,
      comparisonOperator:
        props.comparisonOperatorOverride ??
        ComparisonOperator.GREATER_THAN_THRESHOLD,
      ...props,
      disambiguator,
      threshold: props.maxDaysSinceUpdate,
      alarmNameSuffix: "DaysSinceUpdate",
      alarmDescription: "Number of days since update is too high.",
    });
  }
}
