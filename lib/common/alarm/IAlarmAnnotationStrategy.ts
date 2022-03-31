import {
  Alarm,
  ComparisonOperator,
  HorizontalAnnotation,
  Shading,
} from "aws-cdk-lib/aws-cloudwatch";

import { MetricWithAlarmSupport } from "../metric";
import { AlarmMetadata } from "./AlarmFactory";

export interface AlarmAnnotationStrategyProps extends AlarmMetadata {
  readonly alarm: Alarm;
  readonly metric: MetricWithAlarmSupport;
  readonly comparisonOperator: ComparisonOperator;
  readonly threshold: number;
  readonly datapointsToAlarm: number;
  readonly evaluationPeriods: number;
  readonly fillAlarmRange: boolean;
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
    const annotation = this.createAnnotationToFill(props);
    if (props.fillAlarmRange) {
      return { ...annotation, fill: this.getAlarmingRangeShade(props) };
    }
    return annotation;
  }

  protected abstract createAnnotationToFill(
    props: AlarmAnnotationStrategyProps
  ): HorizontalAnnotation;

  protected getAlarmingRangeShade(
    props: AlarmAnnotationStrategyProps
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
    props: AlarmAnnotationStrategyProps
  ): HorizontalAnnotation {
    return props.alarm.toAnnotation();
  }
}
