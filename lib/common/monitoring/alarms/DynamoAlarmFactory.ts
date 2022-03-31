import {
  ComparisonOperator,
  TreatMissingData,
} from "aws-cdk-lib/aws-cloudwatch";

import { AlarmFactory, CustomAlarmThreshold } from "../../alarm";
import { MetricWithAlarmSupport } from "../../metric";

export enum CapacityType {
  READ = "Read",
  WRITE = "Write",
}

export interface ConsumedCapacityThreshold extends CustomAlarmThreshold {
  readonly maxConsumedCapacityUnits: number;
}

export interface ThrottledEventsThreshold extends CustomAlarmThreshold {
  readonly maxThrottledEventsThreshold: number;
}

export class DynamoAlarmFactory {
  protected readonly alarmFactory: AlarmFactory;

  constructor(alarmFactory: AlarmFactory) {
    this.alarmFactory = alarmFactory;
  }

  addConsumedCapacityAlarm(
    metric: MetricWithAlarmSupport,
    capacityType: CapacityType,
    props: ConsumedCapacityThreshold,
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
      threshold: props.maxConsumedCapacityUnits,
      alarmNameSuffix: `${capacityType}-Consumed-Capacity`,
      // we will dedupe any kind of error to the same ticket
      alarmDedupeStringSuffix: "ConsumedCapacity",
      alarmDescription: `${capacityType} consumed capacity is too high.`,
    });
  }

  addThrottledEventsAlarm(
    metric: MetricWithAlarmSupport,
    capacityType: CapacityType,
    props: ThrottledEventsThreshold,
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
      threshold: props.maxThrottledEventsThreshold,
      alarmNameSuffix: `${capacityType}-Throttled-Events`,
      // we will dedupe any kind of error to the same ticket
      alarmDedupeStringSuffix: "ThrottledEvents",
      alarmDescription: `${capacityType} throttled events above threshold.`,
    });
  }
}
