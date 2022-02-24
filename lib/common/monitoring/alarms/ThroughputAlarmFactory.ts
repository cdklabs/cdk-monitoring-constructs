import { ComparisonOperator, TreatMissingData } from "monocdk/aws-cloudwatch";

import { AlarmFactory, CustomAlarmThreshold } from "../../alarm";
import { MetricWithAlarmSupport } from "../../metric";

export interface MinProcessedBytesThreshold extends CustomAlarmThreshold {
  /**
   * Threshold for the least number of bytes processed
   */
  readonly minProcessedBytes: number;
}

export class ThroughputAlarmFactory {
  protected readonly alarmFactory: AlarmFactory;

  constructor(alarmFactory: AlarmFactory) {
    this.alarmFactory = alarmFactory;
  }

  addMinProcessedBytesAlarm(
    metric: MetricWithAlarmSupport,
    props: MinProcessedBytesThreshold,
    disambiguator?: string
  ) {
    return this.alarmFactory.addAlarm(metric, {
      treatMissingData:
        props.treatMissingDataOverride ?? TreatMissingData.NOT_BREACHING,
      comparisonOperator:
        props.comparisonOperatorOverride ??
        ComparisonOperator.LESS_THAN_THRESHOLD,
      ...props,
      disambiguator,
      threshold: props.minProcessedBytes,
      alarmNameSuffix: "Processed-Bytes-Min",
      alarmDescription: `Minimum number of processed bytes is too low.`,
    });
  }
}
