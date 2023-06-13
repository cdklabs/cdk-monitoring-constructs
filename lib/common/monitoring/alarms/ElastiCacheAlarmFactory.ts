import {
  ComparisonOperator,
  TreatMissingData,
} from "aws-cdk-lib/aws-cloudwatch";

import { AlarmFactory, CustomAlarmThreshold } from "../../alarm";
import { MetricWithAlarmSupport } from "../../metric";

export interface MaxItemsCountThreshold extends CustomAlarmThreshold {
  readonly maxItemsCount: number;
}

export interface MinFreeableMemoryThreshold extends CustomAlarmThreshold {
  readonly minFreeableMemoryInBytes: number;
}

export interface MaxUsedSwapMemoryThreshold extends CustomAlarmThreshold {
  readonly maxUsedSwapMemoryInBytes: number;
}

export class ElastiCacheAlarmFactory {
  protected readonly alarmFactory: AlarmFactory;

  constructor(alarmFactory: AlarmFactory) {
    this.alarmFactory = alarmFactory;
  }

  addMaxItemsCountAlarm(
    metric: MetricWithAlarmSupport,
    props: MaxItemsCountThreshold,
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
      threshold: props.maxItemsCount,
      alarmNameSuffix: "Items-Count",
      alarmDescription: "The number of items in the cache is too high.",
    });
  }

  addMaxEvictedItemsCountAlarm(
    metric: MetricWithAlarmSupport,
    props: MaxItemsCountThreshold,
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
      threshold: props.maxItemsCount,
      alarmNameSuffix: "Items-Evicted",
      alarmDescription: "The number of items evicted by the cache is too high.",
    });
  }

  addMinFreeableMemoryAlarm(
    metric: MetricWithAlarmSupport,
    props: MinFreeableMemoryThreshold,
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
      threshold: props.minFreeableMemoryInBytes,
      alarmNameSuffix: "Memory-Freeable",
      alarmDescription: "The size of freeable memory is too low.",
    });
  }

  addMaxUsedSwapMemoryAlarm(
    metric: MetricWithAlarmSupport,
    props: MaxUsedSwapMemoryThreshold,
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
      threshold: props.maxUsedSwapMemoryInBytes,
      alarmNameSuffix: "Memory-Swap",
      alarmDescription: "The size of swap memory used is too high.",
    });
  }
}
