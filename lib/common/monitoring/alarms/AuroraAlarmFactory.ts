import {
  ComparisonOperator,
  TreatMissingData,
} from "aws-cdk-lib/aws-cloudwatch";

import { AlarmFactory, CustomAlarmThreshold } from "../../alarm";
import { MetricWithAlarmSupport } from "../../metric";

export interface HighServerlessDatabaseCapacityThreshold
  extends CustomAlarmThreshold {
  readonly maxServerlessDatabaseCapacity: number;
}

export class AuroraAlarmFactory {
  protected readonly alarmFactory: AlarmFactory;

  constructor(alarmFactory: AlarmFactory) {
    this.alarmFactory = alarmFactory;
  }

  addMaxServerlessDatabaseCapacity(
    metric: MetricWithAlarmSupport,
    props: HighServerlessDatabaseCapacityThreshold,
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
      threshold: props.maxServerlessDatabaseCapacity,
      alarmNameSuffix: "Serverless-Database-Capacity-High",
      alarmDescription: "Serverless Database Capacity usage is too high.",
    });
  }
}
