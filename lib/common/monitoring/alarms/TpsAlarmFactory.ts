import {
  ComparisonOperator,
  TreatMissingData,
} from "aws-cdk-lib/aws-cloudwatch";

import { AlarmFactory, CustomAlarmThreshold } from "../../alarm";
import { MetricWithAlarmSupport } from "../../metric";

export interface LowTpsThreshold extends CustomAlarmThreshold {
  readonly minTps: number;
}

export interface HighTpsThreshold extends CustomAlarmThreshold {
  readonly maxTps: number;
}

export class TpsAlarmFactory {
  protected readonly alarmFactory: AlarmFactory;

  constructor(alarmFactory: AlarmFactory) {
    this.alarmFactory = alarmFactory;
  }

  addMinTpsAlarm(
    metric: MetricWithAlarmSupport,
    props: LowTpsThreshold,
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
      threshold: props.minTps,
      alarmNameSuffix: `MinTPS`,
      alarmDedupeStringSuffix: "Tps-Min",
      alarmDescription: `TPS is too low.`,
    });
  }

  addMaxTpsAlarm(
    metric: MetricWithAlarmSupport,
    props: HighTpsThreshold,
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
      threshold: props.maxTps,
      alarmNameSuffix: `MaxTPS`,
      alarmDedupeStringSuffix: "Tps-Max",
      alarmDescription: `TPS is too high.`,
    });
  }
}
