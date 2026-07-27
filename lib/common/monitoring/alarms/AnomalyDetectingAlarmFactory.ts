import {
  ComparisonOperator,
  TreatMissingData,
} from "aws-cdk-lib/aws-cloudwatch";

import { AlarmFactory, CustomAlarmThreshold } from "../../alarm";
import {
  AnomalyDetectionMathExpression,
  MetricWithAlarmSupport,
} from "../../metric";

export interface AnomalyDetectionThreshold extends CustomAlarmThreshold {
  readonly standardDeviationForAlarm: number;
  readonly alarmWhenAboveTheBand: boolean;
  readonly alarmWhenBelowTheBand: boolean;
  readonly additionalDescription?: string;
}

export class AnomalyDetectingAlarmFactory {
  protected readonly alarmFactory: AlarmFactory;

  constructor(alarmFactory: AlarmFactory) {
    this.alarmFactory = alarmFactory;
  }

  addAlarmWhenOutOfBand(
    metric: MetricWithAlarmSupport,
    alarmNameSuffix: string,
    disambiguator: string,
    props: AnomalyDetectionThreshold,
  ) {
    const alarmMetric =
      metric instanceof AnomalyDetectionMathExpression
        ? metric
        : new AnomalyDetectionMathExpression({
            expression: `ANOMALY_DETECTION_BAND(m1, ${props.standardDeviationForAlarm})`,
            usingMetrics: { m1: metric },
            period: metric.period,
          });

    return this.alarmFactory.addAlarm(alarmMetric, {
      ...props,
      disambiguator,
      treatMissingData:
        props.treatMissingDataOverride ?? TreatMissingData.MISSING,
      // Dummy threshold value. This gets removed later by AnomalyDetectionMathExpression.createAlarm().
      threshold: 0,
      comparisonOperator: this.getComparisonOperator(props),
      alarmDedupeStringSuffix: props.dedupeStringOverride,
      alarmNameSuffix,
      alarmDescription:
        props.additionalDescription ?? this.getDefaultDescription(props),
    });
  }

  private getDefaultDescription(props: AnomalyDetectionThreshold) {
    if (props.alarmWhenAboveTheBand && props.alarmWhenBelowTheBand) {
      return "Anomaly detection: value is outside of the expected band.";
    } else if (props.alarmWhenAboveTheBand) {
      return "Anomaly detection: value is above the expected band.";
    } else if (props.alarmWhenBelowTheBand) {
      return "Anomaly detection: value is below the expected band.";
    } else {
      throw new Error(
        "You need to alarm when the value is above or below the band, or both.",
      );
    }
  }

  private getComparisonOperator(props: AnomalyDetectionThreshold) {
    if (props.alarmWhenAboveTheBand && props.alarmWhenBelowTheBand) {
      return ComparisonOperator.LESS_THAN_LOWER_OR_GREATER_THAN_UPPER_THRESHOLD;
    } else if (props.alarmWhenAboveTheBand) {
      return ComparisonOperator.GREATER_THAN_UPPER_THRESHOLD;
    } else if (props.alarmWhenBelowTheBand) {
      return ComparisonOperator.LESS_THAN_LOWER_THRESHOLD;
    } else {
      throw new Error(
        "You need to alarm when the value is above or below the band, or both.",
      );
    }
  }
}
