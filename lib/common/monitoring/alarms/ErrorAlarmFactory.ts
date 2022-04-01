import { ComparisonOperator, TreatMissingData } from "monocdk/aws-cloudwatch";

import { AlarmFactory, CustomAlarmThreshold } from "../../alarm";
import { MetricWithAlarmSupport } from "../../metric";

export enum ErrorType {
  FAULT = "Fault",
  ERROR = "Error",
  SYSTEM_ERROR = "SystemError",
  USER_ERROR = "UserError",
  FAILURE = "Failure",
  ABORTED = "Aborted",
  THROTTLED = "Throttled",
  TIMED_OUT = "TimedOut",
  READ_ERROR = "ReadError",
  WRITE_ERROR = "WriteError",
  EXPIRED = "Expired",
  KILLED = "Killed",
}

export interface ErrorCountThreshold extends CustomAlarmThreshold {
  readonly maxErrorCount: number;
}

export interface ErrorRateThreshold extends CustomAlarmThreshold {
  readonly maxErrorRate: number;
}

export class ErrorAlarmFactory {
  protected readonly alarmFactory: AlarmFactory;

  constructor(alarmFactory: AlarmFactory) {
    this.alarmFactory = alarmFactory;
  }

  addErrorCountAlarm(
    metric: MetricWithAlarmSupport,
    errorType: ErrorType,
    props: ErrorCountThreshold,
    disambiguator?: string
  ) {
    const alarmNameSuffix = `${errorType}-Count`;

    return this.alarmFactory.addAlarm(metric, {
      treatMissingData:
        props.treatMissingDataOverride ?? TreatMissingData.NOT_BREACHING,
      comparisonOperator:
        props.comparisonOperatorOverride ??
        ComparisonOperator.GREATER_THAN_THRESHOLD,
      ...props,
      disambiguator,
      threshold: props.maxErrorCount,
      alarmNameSuffix,
      // we will dedupe any kind of error to the same ticket
      alarmDedupeStringSuffix: this.alarmFactory.shouldUseDefaultDedupeForError
        ? "AnyError"
        : alarmNameSuffix,
      alarmDescription: `${errorType} count is too high.`,
    });
  }

  addErrorRateAlarm(
    metric: MetricWithAlarmSupport,
    errorType: ErrorType,
    props: ErrorRateThreshold,
    disambiguator?: string
  ) {
    const alarmNameSuffix = `${errorType}-Rate`;

    return this.alarmFactory.addAlarm(metric, {
      treatMissingData:
        props.treatMissingDataOverride ?? TreatMissingData.NOT_BREACHING,
      comparisonOperator:
        props.comparisonOperatorOverride ??
        ComparisonOperator.GREATER_THAN_THRESHOLD,
      ...props,
      disambiguator,
      threshold: props.maxErrorRate,
      alarmNameSuffix,
      // we will dedupe any kind of error to the same ticket
      alarmDedupeStringSuffix: this.alarmFactory.shouldUseDefaultDedupeForError
        ? "AnyError"
        : alarmNameSuffix,
      alarmDescription: `${errorType} rate is too high.`,
    });
  }
}
