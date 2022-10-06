import {
  ComparisonOperator,
  TreatMissingData,
} from "aws-cdk-lib/aws-cloudwatch";

import { AlarmFactory, CustomAlarmThreshold } from "../../alarm";
import { MetricWithAlarmSupport } from "../../metric";

export interface LowConnectionCountThreshold extends CustomAlarmThreshold {
  readonly minConnectionCount: number;
}

export interface HighConnectionCountThreshold extends CustomAlarmThreshold {
  readonly maxConnectionCount: number;
}

export class ConnectionAlarmFactory {
  protected readonly alarmFactory: AlarmFactory;

  constructor(alarmFactory: AlarmFactory) {
    this.alarmFactory = alarmFactory;
  }

  addMinConnectionCountAlarm(
    metric: MetricWithAlarmSupport,
    props: LowConnectionCountThreshold,
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
      threshold: props.minConnectionCount,
      alarmNameSuffix: "Connection-Count-Low",
      alarmDescription: `Number of connections is too low.`,
    });
  }

  addMaxConnectionCountAlarm(
    metric: MetricWithAlarmSupport,
    props: HighConnectionCountThreshold,
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
      threshold: props.maxConnectionCount,
      alarmNameSuffix: "Connection-Count-High",
      alarmDescription: `Number of connections is too high.`,
    });
  }
}
