import {
  ComparisonOperator,
  TreatMissingData,
} from "aws-cdk-lib/aws-cloudwatch";

import { AlarmFactory, CustomAlarmThreshold } from "../../alarm";
import { MetricWithAlarmSupport } from "../../metric";

export interface SuccessPercentageThreshold extends CustomAlarmThreshold {
  readonly minSuccessPercentage: number;
}

export class SuccessPercentageAlarmFactory {
  protected readonly alarmFactory: AlarmFactory;

  constructor(alarmFactory: AlarmFactory) {
    this.alarmFactory = alarmFactory;
  }

  addSuccessPercentageAlarm(
    metric: MetricWithAlarmSupport,
    props: SuccessPercentageThreshold,
    disambiguator?: string
  ) {
    return this.alarmFactory.addAlarm(metric, {
      treatMissingData:
        props.treatMissingDataOverride ?? TreatMissingData.NOT_BREACHING,
      comparisonOperator:
        props.comparisonOperatorOverride ??
        ComparisonOperator.LESS_THAN_OR_EQUAL_TO_THRESHOLD,
      ...props,
      disambiguator,
      threshold: props.minSuccessPercentage,
      alarmNameSuffix: "Success-Percentage",
      alarmDescription: "Success percentage is too low.",
    });
  }
}
