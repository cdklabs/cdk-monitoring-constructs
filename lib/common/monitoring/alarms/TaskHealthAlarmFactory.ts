import { ComparisonOperator, TreatMissingData } from "monocdk/aws-cloudwatch";

import { AlarmFactory, CustomAlarmThreshold } from "../../alarm";
import { MetricWithAlarmSupport } from "../../metric";

export interface HealthyTaskCountThreshold extends CustomAlarmThreshold {
  readonly minHealthyTasks: number;
}

export interface UnhealthyTaskCountThreshold extends CustomAlarmThreshold {
  readonly maxUnhealthyTasks: number;
}

export interface HealthyTaskPercentThreshold extends CustomAlarmThreshold {
  readonly minHealthyTaskPercent: number;
}

export interface RunningTaskCountThreshold extends CustomAlarmThreshold {
  readonly maxRunningTasks: number;
}

export interface RunningTaskRateThreshold extends CustomAlarmThreshold {
  readonly maxRunningTaskRate: number;
}

export interface MinRunningTaskCountThreshold extends CustomAlarmThreshold {
  readonly minRunningTasks: number;
}

export interface AvailabilityThreshold extends CustomAlarmThreshold {
  readonly minAvailabilityPercent: number;
}

export class TaskHealthAlarmFactory {
  protected readonly alarmFactory: AlarmFactory;

  constructor(alarmFactory: AlarmFactory) {
    this.alarmFactory = alarmFactory;
  }

  addHealthyTaskCountAlarm(
    metric: MetricWithAlarmSupport,
    props: HealthyTaskCountThreshold,
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
      threshold: props.minHealthyTasks,
      alarmNameSuffix: "Healthy-Tasks",
      alarmDescription: "Number of healthy tasks is too low.",
    });
  }

  addUnhealthyTaskCountAlarm(
    metric: MetricWithAlarmSupport,
    props: UnhealthyTaskCountThreshold,
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
      threshold: props.maxUnhealthyTasks,
      alarmNameSuffix: "Unhealthy-Tasks",
      alarmDescription: "Number of unhealthy tasks is too high.",
    });
  }

  addHealthyTaskPercentAlarm(
    metric: MetricWithAlarmSupport,
    props: HealthyTaskPercentThreshold,
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
      threshold: props.minHealthyTaskPercent,
      alarmNameSuffix: "Healthy-Task-Percent",
      alarmDescription: "Percentage of healthy tasks is too low.",
    });
  }

  addRunningTaskCountAlarm(
    metric: MetricWithAlarmSupport,
    props: RunningTaskCountThreshold,
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
      threshold: props.maxRunningTasks,
      alarmNameSuffix: "Running-Tasks-High",
      alarmDescription: "Number of running tasks are too high.",
    });
  }

  addRunningTaskRateAlarm(
    metric: MetricWithAlarmSupport,
    props: RunningTaskRateThreshold,
    disambiguator?: string
  ) {
    const alarmNameSuffix = "Task-Rate";

    return this.alarmFactory.addAlarm(metric, {
      treatMissingData:
        props.treatMissingDataOverride ?? TreatMissingData.NOT_BREACHING,
      comparisonOperator:
        props.comparisonOperatorOverride ??
        ComparisonOperator.GREATER_THAN_THRESHOLD,
      ...props,
      disambiguator,
      threshold: props.maxRunningTaskRate,
      alarmNameSuffix,
      // we will dedupe any kind of error to the same ticket
      alarmDedupeStringSuffix: this.alarmFactory.shouldUseDefaultDedupeForError
        ? "AnyError"
        : alarmNameSuffix,
      alarmDescription: "Running task rate is too high.",
    });
  }

  addMinRunningTaskCountAlarm(
    metric: MetricWithAlarmSupport,
    props: MinRunningTaskCountThreshold,
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
      threshold: props.minRunningTasks,
      alarmNameSuffix: "Running-Tasks-Low",
      alarmDescription: "Number of running tasks is too low.",
    });
  }

  addAvailabilityAlarm(
    metric: MetricWithAlarmSupport,
    props: AvailabilityThreshold,
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
      threshold: props.minAvailabilityPercent,
      alarmNameSuffix: "Availability",
      alarmDescription: "The availability is too low.",
    });
  }
}
