import {
  Alarm,
  ComparisonOperator,
  HorizontalAnnotation,
  Shading,
} from "aws-cdk-lib/aws-cloudwatch";

import { AlarmMetadata } from "./AlarmFactory";
import { MetricWithAlarmSupport } from "../metric";

export interface AlarmAnnotationStrategyProps extends AlarmMetadata {
  readonly alarm: Alarm;
  readonly metric: MetricWithAlarmSupport;
  readonly comparisonOperator: ComparisonOperator;
  readonly minMetricSamplesToAlarm?: number;
  readonly minSampleCountToEvaluateDatapoint?: number;
  readonly threshold: number;
  readonly datapointsToAlarm: number;
  readonly evaluationPeriods: number;
  readonly fillAlarmRange: boolean;
  readonly overrideAnnotationColor?: string;
  readonly overrideAnnotationLabel?: string;
  readonly overrideAnnotationVisibility?: boolean;
}

/**
 * Helper class for creating annotations for alarms.
 */
export interface IAlarmAnnotationStrategy {
  /**
   * Creates annotation based on the metric and alarm properties.
   * @param props properties necessary to create annotation
   */
  createAnnotation(props: AlarmAnnotationStrategyProps): HorizontalAnnotation;
}

/**
 * Annotation strategy that fills the annotation provided, using the input and user requirements.
 */
export abstract class FillingAlarmAnnotationStrategy
  implements IAlarmAnnotationStrategy
{
  createAnnotation(props: AlarmAnnotationStrategyProps): HorizontalAnnotation {
    return {
      ...this.createAnnotationToFill(props),
      ...(props.fillAlarmRange && {
        fill: this.getAlarmingRangeShade(props),
      }),
      ...(props.overrideAnnotationColor !== undefined && {
        color: props.overrideAnnotationColor,
      }),
      ...(props.overrideAnnotationLabel !== undefined && {
        label: props.overrideAnnotationLabel,
      }),
      ...(props.overrideAnnotationVisibility !== undefined && {
        visible: props.overrideAnnotationVisibility,
      }),
    };
  }

  protected abstract createAnnotationToFill(
    props: AlarmAnnotationStrategyProps,
  ): HorizontalAnnotation;

  protected getAlarmingRangeShade(
    props: AlarmAnnotationStrategyProps,
  ): Shading | undefined {
    switch (props.comparisonOperator) {
      case ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD:
      case ComparisonOperator.GREATER_THAN_THRESHOLD:
      case ComparisonOperator.GREATER_THAN_UPPER_THRESHOLD:
        // Fill background above the annotation line
        return Shading.ABOVE;
      case ComparisonOperator.LESS_THAN_OR_EQUAL_TO_THRESHOLD:
      case ComparisonOperator.LESS_THAN_THRESHOLD:
      case ComparisonOperator.LESS_THAN_LOWER_THRESHOLD:
        // Fill background below the annotation line
        return Shading.BELOW;
      default:
        return undefined;
    }
  }
}

/**
 * Default annotation strategy that returns the built-in alarm annotation.
 */
export class DefaultAlarmAnnotationStrategy extends FillingAlarmAnnotationStrategy {
  protected createAnnotationToFill(
    props: AlarmAnnotationStrategyProps,
  ): HorizontalAnnotation {
    return props.alarm.toAnnotation();
  }
}
