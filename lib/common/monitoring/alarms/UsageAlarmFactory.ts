import {
  ComparisonOperator,
  TreatMissingData,
} from "aws-cdk-lib/aws-cloudwatch";

import { AlarmFactory, CustomAlarmThreshold } from "../../alarm";
import { MetricWithAlarmSupport } from "../../metric";

export enum UsageType {
  P50 = "P50",
  P70 = "P70",
  P90 = "P90",
  P99 = "P99",
  P999 = "P999",
  P9999 = "P9999",
  P100 = "P100",
  AVERAGE = "Average",
  MAX = "Maximum",
}

export interface UsageThreshold extends CustomAlarmThreshold {
  readonly maxUsagePercent: number;
}

export interface MinUsageCountThreshold extends CustomAlarmThreshold {
  readonly minCount: number;
}

export interface UsageCountThreshold extends CustomAlarmThreshold {
  readonly maxUsageCount: number;
}

export class UsageAlarmFactory {
  protected readonly alarmFactory: AlarmFactory;

  constructor(alarmFactory: AlarmFactory) {
    this.alarmFactory = alarmFactory;
  }

  addMinUsageCountAlarm(
    percentMetric: MetricWithAlarmSupport,
    props: MinUsageCountThreshold,
    disambiguator?: string
  ) {
    return this.alarmFactory.addAlarm(percentMetric, {
      treatMissingData:
        props.treatMissingDataOverride ?? TreatMissingData.MISSING,
      comparisonOperator:
        props.comparisonOperatorOverride ??
        ComparisonOperator.LESS_THAN_THRESHOLD,
      ...props,
      disambiguator,
      threshold: props.minCount,
      alarmNameSuffix: "Usage-Count",
      alarmDescription: "The count is too low.",
    });
  }

  addMaxCpuUsagePercentAlarm(
    percentMetric: MetricWithAlarmSupport,
    props: UsageThreshold,
    disambiguator?: string,
    usageType?: UsageType,
    additionalAlarmNameSuffix?: string
  ) {
    const alarmNameSuffix: string = [
      usageType,
      "CPU-Usage",
      additionalAlarmNameSuffix,
    ]
      .filter((i) => i !== undefined)
      .join("-");
    return this.alarmFactory.addAlarm(percentMetric, {
      treatMissingData:
        props.treatMissingDataOverride ?? TreatMissingData.MISSING,
      comparisonOperator:
        props.comparisonOperatorOverride ??
        ComparisonOperator.GREATER_THAN_THRESHOLD,
      ...props,
      disambiguator,
      threshold: props.maxUsagePercent,
      alarmNameSuffix,
      alarmDescription: "The CPU usage is too high.",
    });
  }

  addMaxMasterCpuUsagePercentAlarm(
    percentMetric: MetricWithAlarmSupport,
    props: UsageThreshold,
    disambiguator?: string
  ) {
    return this.alarmFactory.addAlarm(percentMetric, {
      treatMissingData:
        props.treatMissingDataOverride ?? TreatMissingData.MISSING,
      comparisonOperator:
        props.comparisonOperatorOverride ??
        ComparisonOperator.GREATER_THAN_THRESHOLD,
      ...props,
      disambiguator,
      threshold: props.maxUsagePercent,
      alarmNameSuffix: "Master-CPU-Usage",
      alarmDescription: "The master CPU usage is too high.",
    });
  }

  addMaxMemoryUsagePercentAlarm(
    percentMetric: MetricWithAlarmSupport,
    props: UsageThreshold,
    disambiguator?: string
  ) {
    return this.addMemoryUsagePercentAlarm(
      percentMetric,
      props,
      UsageType.MAX,
      disambiguator
    );
  }

  addMemoryUsagePercentAlarm(
    percentMetric: MetricWithAlarmSupport,
    props: UsageThreshold,
    usageType: UsageType,
    disambiguator?: string
  ) {
    const alarmNameSuffix: string =
      usageType === UsageType.MAX
        ? "Memory-Usage"
        : `${usageType}-Memory-Usage`;
    return this.alarmFactory.addAlarm(percentMetric, {
      treatMissingData:
        props.treatMissingDataOverride ?? TreatMissingData.MISSING,
      comparisonOperator:
        props.comparisonOperatorOverride ??
        ComparisonOperator.GREATER_THAN_THRESHOLD,
      ...props,
      disambiguator,
      threshold: props.maxUsagePercent,
      alarmNameSuffix,
      alarmDescription: "The memory usage is too high.",
    });
  }

  addMaxMasterMemoryUsagePercentAlarm(
    percentMetric: MetricWithAlarmSupport,
    props: UsageThreshold,
    disambiguator?: string
  ) {
    return this.alarmFactory.addAlarm(percentMetric, {
      treatMissingData:
        props.treatMissingDataOverride ?? TreatMissingData.MISSING,
      comparisonOperator:
        props.comparisonOperatorOverride ??
        ComparisonOperator.GREATER_THAN_THRESHOLD,
      ...props,
      disambiguator,
      threshold: props.maxUsagePercent,
      alarmNameSuffix: "Master-Memory-Usage",
      alarmDescription: "The master memory usage is too high.",
    });
  }

  addMaxDiskUsagePercentAlarm(
    percentMetric: MetricWithAlarmSupport,
    props: UsageThreshold,
    disambiguator?: string
  ) {
    return this.alarmFactory.addAlarm(percentMetric, {
      treatMissingData:
        props.treatMissingDataOverride ?? TreatMissingData.MISSING,
      comparisonOperator:
        props.comparisonOperatorOverride ??
        ComparisonOperator.GREATER_THAN_THRESHOLD,
      ...props,
      disambiguator,
      threshold: props.maxUsagePercent,
      alarmNameSuffix: "Disk-Usage",
      alarmDescription: "The disk usage is too high.",
    });
  }

  addMaxHeapMemoryAfterGCUsagePercentAlarm(
    percentMetric: MetricWithAlarmSupport,
    props: UsageThreshold,
    disambiguator?: string
  ) {
    return this.alarmFactory.addAlarm(percentMetric, {
      treatMissingData:
        props.treatMissingDataOverride ?? TreatMissingData.MISSING,
      comparisonOperator:
        props.comparisonOperatorOverride ??
        ComparisonOperator.GREATER_THAN_THRESHOLD,
      ...props,
      disambiguator,
      threshold: props.maxUsagePercent,
      alarmNameSuffix: "HeapMemoryAfterGC-Usage",
      alarmDescription: "The heap memory after GC usage is too high.",
    });
  }

  addMaxFileDescriptorPercentAlarm(
    percentMetric: MetricWithAlarmSupport,
    props: UsageThreshold,
    disambiguator?: string
  ) {
    return this.alarmFactory.addAlarm(percentMetric, {
      treatMissingData:
        props.treatMissingDataOverride ?? TreatMissingData.MISSING,
      comparisonOperator:
        props.comparisonOperatorOverride ??
        ComparisonOperator.GREATER_THAN_THRESHOLD,
      ...props,
      disambiguator,
      threshold: props.maxUsagePercent,
      alarmNameSuffix: "File-Descriptor-Usage",
      alarmDescription: "The file descriptor usage is too high.",
    });
  }

  addMaxThreadCountUsageAlarm(
    percentMetric: MetricWithAlarmSupport,
    props: UsageCountThreshold,
    disambiguator?: string
  ) {
    return this.alarmFactory.addAlarm(percentMetric, {
      treatMissingData:
        props.treatMissingDataOverride ?? TreatMissingData.MISSING,
      comparisonOperator:
        props.comparisonOperatorOverride ??
        ComparisonOperator.GREATER_THAN_THRESHOLD,
      ...props,
      disambiguator,
      threshold: props.maxUsageCount,
      alarmNameSuffix: "Thread-Count",
      alarmDescription: "The thread count is too high.",
    });
  }
}
