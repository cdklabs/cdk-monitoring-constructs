import { Duration } from "aws-cdk-lib";
import {
  ComparisonOperator,
  TreatMissingData,
} from "aws-cdk-lib/aws-cloudwatch";

import { AlarmFactory, CustomAlarmThreshold } from "../../alarm";
import { MetricStatistic, MetricWithAlarmSupport } from "../../metric";

export enum LatencyType {
  P50 = "P50",
  P70 = "P70",
  P90 = "P90",
  P95 = "P95",
  P99 = "P99",
  P999 = "P999",
  P9999 = "P9999",
  P100 = "P100",
  TM50 = "TM50",
  TM70 = "TM70",
  TM90 = "TM90",
  TM95 = "TM95",
  TM99 = "TM99",
  TM999 = "TM999",
  TM9999 = "TM9999",
  TM95_TOP = "TM(95%:100%)",
  TM99_TOP = "TM(99%:100%)",
  TM999_TOP = "TM(99.9%:100%)",
  TM9999_TOP = "TM(99.99%:100%)",
  AVERAGE = "Average",
  MAX = "Maximum",
}

export function getLatencyTypeStatistic(latencyType: LatencyType) {
  switch (latencyType) {
    case LatencyType.P50:
      return MetricStatistic.P50;
    case LatencyType.P70:
      return MetricStatistic.P70;
    case LatencyType.P90:
      return MetricStatistic.P90;
    case LatencyType.P95:
      return MetricStatistic.P95;
    case LatencyType.P99:
      return MetricStatistic.P99;
    case LatencyType.P999:
      return MetricStatistic.P999;
    case LatencyType.P9999:
      return MetricStatistic.P9999;
    case LatencyType.P100:
      return MetricStatistic.P100;
    case LatencyType.TM50:
      return MetricStatistic.TM50;
    case LatencyType.TM70:
      return MetricStatistic.TM70;
    case LatencyType.TM90:
      return MetricStatistic.TM90;
    case LatencyType.TM95:
      return MetricStatistic.TM95;
    case LatencyType.TM99:
      return MetricStatistic.TM99;
    case LatencyType.TM999:
      return MetricStatistic.TM999;
    case LatencyType.TM9999:
      return MetricStatistic.TM9999;
    case LatencyType.TM95_TOP:
      return MetricStatistic.TM95_TOP;
    case LatencyType.TM99_TOP:
      return MetricStatistic.TM99_TOP;
    case LatencyType.TM999_TOP:
      return MetricStatistic.TM999_TOP;
    case LatencyType.TM9999_TOP:
      return MetricStatistic.TM9999_TOP;
    case LatencyType.AVERAGE:
      return MetricStatistic.AVERAGE;
    case LatencyType.MAX:
      return MetricStatistic.MAX;
    default:
      throw new Error(
        "Unsupported latency type (unknown statistic): " + latencyType,
      );
  }
}

export function getLatencyTypeExpressionId(latencyType: LatencyType) {
  switch (latencyType) {
    case LatencyType.P50:
    case LatencyType.P70:
    case LatencyType.P90:
    case LatencyType.P95:
    case LatencyType.P99:
    case LatencyType.P999:
    case LatencyType.P9999:
    case LatencyType.P100:
      // remove the P prefix
      return latencyType.substring(1);
    case LatencyType.AVERAGE:
      // making it shorter for backwards compatibility
      return "Avg";
    case LatencyType.MAX:
      return "Max";
    default:
      // use as-is
      return latencyType;
  }
}

export function getLatencyTypeLabel(latencyType: LatencyType) {
  const averageSuffix = " (avg: ${AVG})";

  switch (latencyType) {
    case LatencyType.P999:
    case LatencyType.TM999:
      // we need proper decimal here
      return latencyType.replace("999", "99.9") + averageSuffix;
    case LatencyType.P9999:
    case LatencyType.TM9999:
    case LatencyType.TM95_TOP:
    case LatencyType.TM99_TOP:
    case LatencyType.TM999_TOP:
    case LatencyType.TM9999_TOP:
      // we need proper decimal here
      return latencyType.replace("9999", "99.99") + averageSuffix;
    case LatencyType.AVERAGE:
      // no suffix here, since we already have average
      return "Average";
    case LatencyType.MAX:
      return "Maximum";
    default:
      // use as-is
      return latencyType + averageSuffix;
  }
}

export interface LatencyThreshold extends CustomAlarmThreshold {
  readonly maxLatency: Duration;
}

export interface DurationThreshold extends CustomAlarmThreshold {
  readonly maxDuration: Duration;
}

export class LatencyAlarmFactory {
  protected readonly alarmFactory: AlarmFactory;

  constructor(alarmFactory: AlarmFactory) {
    this.alarmFactory = alarmFactory;
  }

  addLatencyAlarm(
    metric: MetricWithAlarmSupport,
    latencyType: LatencyType,
    props: LatencyThreshold,
    disambiguator?: string,
    additionalAlarmNameSuffix: string | undefined = undefined,
  ) {
    const alarmNameSuffix = ["Latency", latencyType, additionalAlarmNameSuffix]
      .filter((i) => i !== undefined)
      .join("-");

    return this.alarmFactory.addAlarm(metric, {
      treatMissingData:
        props.treatMissingDataOverride ?? TreatMissingData.NOT_BREACHING,
      comparisonOperator:
        props.comparisonOperatorOverride ??
        ComparisonOperator.GREATER_THAN_THRESHOLD,
      ...props,
      disambiguator,
      threshold: props.maxLatency.toMilliseconds(),
      alarmNameSuffix,
      // we will dedupe any kind of latency issue to the same ticket
      alarmDedupeStringSuffix: this.alarmFactory
        .shouldUseDefaultDedupeForLatency
        ? "AnyLatency"
        : alarmNameSuffix,
      alarmDescription: `${latencyType} latency is too high.`,
    });
  }

  addIntegrationLatencyAlarm(
    metric: MetricWithAlarmSupport,
    latencyType: LatencyType,
    props: LatencyThreshold,
    disambiguator?: string,
    additionalAlarmNameSuffix: string | undefined = undefined,
  ) {
    const alarmNameSuffix = [
      "IntegrationLatency",
      latencyType,
      additionalAlarmNameSuffix,
    ]
      .filter((i) => i !== undefined)
      .join("-");

    return this.alarmFactory.addAlarm(metric, {
      treatMissingData:
        props.treatMissingDataOverride ?? TreatMissingData.NOT_BREACHING,
      comparisonOperator:
        props.comparisonOperatorOverride ??
        ComparisonOperator.GREATER_THAN_THRESHOLD,
      ...props,
      disambiguator,
      threshold: props.maxLatency.toMilliseconds(),
      alarmNameSuffix,
      // we will dedupe any kind of latency issue to the same alarm
      alarmDedupeStringSuffix: this.alarmFactory
        .shouldUseDefaultDedupeForLatency
        ? "AnyLatency"
        : alarmNameSuffix,
      alarmDescription: `${latencyType} integration latency is too high.`,
    });
  }

  addDurationAlarm(
    metric: MetricWithAlarmSupport,
    latencyType: LatencyType,
    props: DurationThreshold,
    disambiguator?: string,
    additionalAlarmNameSuffix: string | undefined = undefined,
  ) {
    const alarmNameSuffix = ["Duration", latencyType, additionalAlarmNameSuffix]
      .filter((i) => i !== undefined)
      .join("-");

    return this.alarmFactory.addAlarm(metric, {
      treatMissingData:
        props.treatMissingDataOverride ?? TreatMissingData.NOT_BREACHING,
      comparisonOperator:
        props.comparisonOperatorOverride ??
        ComparisonOperator.GREATER_THAN_THRESHOLD,
      ...props,
      disambiguator,
      threshold: props.maxDuration.toMilliseconds(),
      alarmNameSuffix,
      // we will dedupe any kind of latency issue to the same ticket
      alarmDedupeStringSuffix: this.alarmFactory
        .shouldUseDefaultDedupeForLatency
        ? "AnyDuration"
        : alarmNameSuffix,
      alarmDescription: `${latencyType} duration is too long.`,
    });
  }

  addJvmGarbageCollectionDurationAlarm(
    metric: MetricWithAlarmSupport,
    latencyType: LatencyType,
    props: DurationThreshold,
    disambiguator?: string,
    additionalAlarmNameSuffix: string | undefined = undefined,
  ) {
    const alarmNameSuffix = [
      "Garbage-Collection-Time",
      latencyType,
      additionalAlarmNameSuffix,
    ]
      .filter((i) => i !== undefined)
      .join("-");

    return this.alarmFactory.addAlarm(metric, {
      treatMissingData:
        props.treatMissingDataOverride ?? TreatMissingData.NOT_BREACHING,
      comparisonOperator:
        props.comparisonOperatorOverride ??
        ComparisonOperator.GREATER_THAN_THRESHOLD,
      ...props,
      disambiguator,
      threshold: props.maxDuration.toMilliseconds(),
      alarmNameSuffix,
      // we will dedupe any kind of latency issue to the same ticket
      alarmDedupeStringSuffix: this.alarmFactory
        .shouldUseDefaultDedupeForLatency
        ? "AnyDuration"
        : alarmNameSuffix,
      alarmDescription: `${latencyType} duration is too long.`,
    });
  }
}
