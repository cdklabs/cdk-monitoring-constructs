import {
  ComparisonOperator,
  TreatMissingData,
} from "aws-cdk-lib/aws-cloudwatch";

import {
  ErrorAlarmFactory,
  ErrorCountThreshold,
  ErrorRateThreshold,
  ErrorType,
} from "./ErrorAlarmFactory";
import { AlarmFactory, CustomAlarmThreshold } from "../../alarm";
import { MetricWithAlarmSupport } from "../../metric";

export interface MaxDowntimeThreshold extends CustomAlarmThreshold {
  readonly maxDowntimeInMillis: number;
}

export interface FullRestartCountThreshold extends CustomAlarmThreshold {
  readonly maxFullRestartCount: number;
}

export class KinesisDataAnalyticsAlarmFactory {
  protected readonly alarmFactory: AlarmFactory;
  protected readonly errorAlarmFactory: ErrorAlarmFactory;

  constructor(alarmFactory: AlarmFactory) {
    this.alarmFactory = alarmFactory;
    this.errorAlarmFactory = new ErrorAlarmFactory(alarmFactory);
  }

  addDowntimeAlarm(
    metric: MetricWithAlarmSupport,
    props: MaxDowntimeThreshold,
    disambiguator?: string,
  ) {
    return this.alarmFactory.addAlarm(metric, {
      treatMissingData:
        props.treatMissingDataOverride ?? TreatMissingData.BREACHING,
      comparisonOperator:
        props.comparisonOperatorOverride ??
        ComparisonOperator.GREATER_THAN_THRESHOLD,
      ...props,
      disambiguator,
      threshold: props.maxDowntimeInMillis,
      alarmNameSuffix: "Downtime",
      alarmDescription: "Application has too much downtime",
      // we will dedupe any kind of message count issue to the same ticket
      alarmDedupeStringSuffix: "KDADowntimeAlarm",
    });
  }

  addFullRestartAlarm(
    metric: MetricWithAlarmSupport,
    props: FullRestartCountThreshold,
    disambiguator?: string,
  ) {
    return this.alarmFactory.addAlarm(metric, {
      treatMissingData:
        props.treatMissingDataOverride ?? TreatMissingData.BREACHING,
      comparisonOperator:
        props.comparisonOperatorOverride ??
        ComparisonOperator.GREATER_THAN_THRESHOLD,
      ...props,
      disambiguator,
      threshold: props.maxFullRestartCount,
      alarmNameSuffix: "FullRestart",
      alarmDescription: "Last submitted job is restarting more than usual",
      alarmDedupeStringSuffix: "KDAFullRestartAlarm",
    });
  }

  addFullRestartRateAlarm(
    metric: MetricWithAlarmSupport,
    props: ErrorRateThreshold,
    disambiguator?: string,
  ) {
    return this.alarmFactory.addAlarm(metric, {
      treatMissingData:
        props.treatMissingDataOverride ?? TreatMissingData.BREACHING,
      comparisonOperator:
        props.comparisonOperatorOverride ??
        ComparisonOperator.GREATER_THAN_THRESHOLD,
      ...props,
      disambiguator,
      threshold: props.maxErrorRate,
      alarmNameSuffix: "FullRestartRate",
      alarmDescription: "Full restart rate is too high",
      alarmDedupeStringSuffix: "KDAFullRestartRateAlarm",
    });
  }

  addCheckpointFailureCountAlarm(
    metric: MetricWithAlarmSupport,
    props: ErrorCountThreshold,
    disambiguator?: string,
  ) {
    return this.errorAlarmFactory.addErrorCountAlarm(
      metric,
      ErrorType.FAILURE,
      props,
      disambiguator,
    );
  }

  addCheckpointFailureRateAlarm(
    metric: MetricWithAlarmSupport,
    props: ErrorRateThreshold,
    disambiguator?: string,
  ) {
    return this.errorAlarmFactory.addErrorRateAlarm(
      metric,
      ErrorType.FAILURE,
      props,
      disambiguator,
    );
  }
}
