import {
  ComparisonOperator,
  TreatMissingData,
} from "aws-cdk-lib/aws-cloudwatch";

import { AlarmFactory, CustomAlarmThreshold } from "../../alarm";
import { MetricWithAlarmSupport } from "../../metric";

export interface MaxIteratorAgeThreshold extends CustomAlarmThreshold {
  readonly maxAgeInMillis: number;
}

export interface RecordsThrottledThreshold extends CustomAlarmThreshold {
  readonly maxRecordsThrottledThreshold: number;
}

export interface FirehoseStreamLimitThreshold extends CustomAlarmThreshold {
  /**
   * Threshold value between [0.0, 1.0) for when the alarm should be triggered.
   */
  readonly safetyThresholdLimit: number;
}

export interface RecordsFailedThreshold extends CustomAlarmThreshold {
  readonly maxRecordsFailedThreshold: number;
}

export class KinesisAlarmFactory {
  protected readonly alarmFactory: AlarmFactory;

  constructor(alarmFactory: AlarmFactory) {
    this.alarmFactory = alarmFactory;
  }

  addIteratorMaxAgeAlarm(
    metric: MetricWithAlarmSupport,
    props: MaxIteratorAgeThreshold,
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
      threshold: props.maxAgeInMillis,
      alarmNameSuffix: "Iterator-Age-Max",
      alarmDescription: `Iterator Max Age is too high.`,
      // we will dedupe any kind of message count issue to the same ticket
      alarmDedupeStringSuffix: "AnyDataStreamIteratorMaxAge",
    });
  }

  addPutRecordsThrottledAlarm(
    metric: MetricWithAlarmSupport,
    props: RecordsThrottledThreshold,
    disambiguator?: string,
  ) {
    const threshold = props.maxRecordsThrottledThreshold;
    return this.alarmFactory.addAlarm(metric, {
      treatMissingData:
        props.treatMissingDataOverride ?? TreatMissingData.NOT_BREACHING,
      comparisonOperator:
        props.comparisonOperatorOverride ??
        ComparisonOperator.GREATER_THAN_THRESHOLD,
      ...props,
      disambiguator,
      threshold: threshold,
      alarmNameSuffix: "PutRecordsThrottled",
      alarmDescription: `Number of throttled PutRecords exceeded threshold of ${threshold}`,
      // we will dedupe any kind of message count issue to the same ticket
      alarmDedupeStringSuffix: "PutRecordsThrottled",
    });
  }

  addPutRecordsFailedAlarm(
    metric: MetricWithAlarmSupport,
    props: RecordsFailedThreshold,
    disambiguator?: string,
  ) {
    const threshold = props.maxRecordsFailedThreshold;
    return this.alarmFactory.addAlarm(metric, {
      treatMissingData:
        props.treatMissingDataOverride ?? TreatMissingData.NOT_BREACHING,
      comparisonOperator:
        props.comparisonOperatorOverride ??
        ComparisonOperator.GREATER_THAN_THRESHOLD,
      ...props,
      disambiguator,
      threshold,
      alarmNameSuffix: "PutRecordsFailed",
      alarmDescription: `Number of failed PutRecords exceeded threshold of ${threshold}`,
      // we will dedupe any kind of message count issue to the same ticket
      alarmDedupeStringSuffix: "PutRecordsFailed",
    });
  }

  addFirehoseStreamExceedSafetyThresholdAlarm(
    metric: MetricWithAlarmSupport,
    metricName: string,
    quotaName: string,
    props: FirehoseStreamLimitThreshold,
    disambiguator?: string,
  ) {
    const threshold = props.safetyThresholdLimit;
    if (threshold < 0 || threshold >= 1) {
      throw new Error(
        `safetyThresholdLimit must be in range [0.0, 1.0) for ${metricName}ExceedThresholdAlarm.`,
      );
    }

    return this.alarmFactory.addAlarm(metric, {
      treatMissingData:
        props.treatMissingDataOverride ?? TreatMissingData.NOT_BREACHING,
      comparisonOperator:
        props.comparisonOperatorOverride ??
        ComparisonOperator.GREATER_THAN_THRESHOLD,
      ...props,
      disambiguator,
      threshold,
      alarmNameSuffix: metricName,
      alarmDescription: `${metricName} exceeded ${quotaName} alarming threshold of ${threshold}`,
      // we will dedupe any kind of message count issue to the same ticket
      alarmDedupeStringSuffix: `${metricName}ExceedThresholdLimit`,
    });
  }

  addProvisionedReadThroughputExceededAlarm(
    metric: MetricWithAlarmSupport,
    props: RecordsThrottledThreshold,
    disambiguator: string,
  ) {
    const threshold = props.maxRecordsThrottledThreshold;
    return this.alarmFactory.addAlarm(metric, {
      treatMissingData:
        props.treatMissingDataOverride ?? TreatMissingData.NOT_BREACHING,
      comparisonOperator:
        props.comparisonOperatorOverride ??
        ComparisonOperator.GREATER_THAN_THRESHOLD,
      ...props,
      disambiguator,
      threshold,
      alarmNameSuffix: "ReadThroughputExceeded",
      alarmDescription: `Number of records resulting in read throughput capacity throttling reached the threshold of ${threshold}.`,
    });
  }

  addProvisionedWriteThroughputExceededAlarm(
    metric: MetricWithAlarmSupport,
    props: RecordsThrottledThreshold,
    disambiguator: string,
  ) {
    const threshold = props.maxRecordsThrottledThreshold;
    return this.alarmFactory.addAlarm(metric, {
      treatMissingData:
        props.treatMissingDataOverride ?? TreatMissingData.NOT_BREACHING,
      comparisonOperator:
        props.comparisonOperatorOverride ??
        ComparisonOperator.GREATER_THAN_THRESHOLD,
      ...props,
      disambiguator,
      threshold,
      alarmNameSuffix: "WriteThroughputExceeded",
      alarmDescription: `Number of records resulting in write throughput capacity throttling reached the threshold of ${threshold}.`,
    });
  }
}
