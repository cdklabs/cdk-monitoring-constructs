import { ComparisonOperator, TreatMissingData } from "monocdk/aws-cloudwatch";

import { AlarmFactory, CustomAlarmThreshold } from "../../alarm";
import { MetricWithAlarmSupport } from "../../metric";

/**
 * Level of a given log
 */
export enum LogLevel {
  ERROR = "ERROR",
  CRITICAL = "CRITICAL",
}

export interface LogLevelCountThreshold extends CustomAlarmThreshold {
  /**
   * Threshold for the number of logs to alarm on
   */
  readonly maxLogCount: number;
}

export class LogLevelAlarmFactory {
  protected readonly alarmFactory: AlarmFactory;

  constructor(alarmFactory: AlarmFactory) {
    this.alarmFactory = alarmFactory;
  }

  addLogCountAlarm(
    metric: MetricWithAlarmSupport,
    logLevel: LogLevel,
    props: LogLevelCountThreshold,
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
      threshold: props.maxLogCount,
      alarmNameSuffix: `${LogLevel[logLevel]}-Logs-Count`,
      // we will dedupe any kind of error to the same ticket
      alarmDedupeStringSuffix: `${LogLevel[logLevel].toLowerCase()}`,
      alarmDescription: `${LogLevel[logLevel]} logs count is too high.`,
    });
  }
}
