import { Duration } from "aws-cdk-lib";
import {
  ComparisonOperator,
  TreatMissingData,
} from "aws-cdk-lib/aws-cloudwatch";

import { IAlarmActionStrategy } from "./action";
import { IMetricAdjuster } from "./metric-adjuster";

/**
 * Common customization that can be attached to each alarm.
 */
export interface CustomAlarmThreshold {
  /**
   * Allows to override the default alarm action.
   *
   * @default - undefined (default action will be used, if any)
   */
  readonly actionOverride?: IAlarmActionStrategy;

  /**
   * If this is defined, the alarm dedupe string is set to this exact value.
   * Please be aware that you need to handle deduping for different stages (Beta, Prod...) and regions (EU, NA...) manually.
   *
   * @default - undefined (no override)
   */
  readonly dedupeStringOverride?: string;

  /**
   * If this is defined, the alarm name is set to this exact value.
   * Please be aware that you need to specify prefix for different stages (Beta, Prod...) and regions (EU, NA...) manually.
   */
  readonly alarmNameOverride?: string;

  /**
   * A text included in the generated ticket description body, which fully replaces the generated text.
   *
   * @default - default auto-generated content only
   */
  readonly alarmDescriptionOverride?: string;

  /**
   * Specifies how many samples (N) of the metric is needed in a datapoint to be evaluated for alarming.
   * If this property is specified, your metric will be subject to MathExpression that will add an IF condition
   * to your metric to make sure that each datapoint is evaluated only if it has sufficient number of samples.
   * If the number of samples is not sufficient, the datapoint will be treated as missing data and will be evaluated
   * according to the treatMissingData parameter.
   * If specified, deprecated minMetricSamplesToAlarm has no effect.
   *
   * @default - default behaviour - no condition on sample count will be used
   */
  readonly minSampleCountToEvaluateDatapoint?: number;

  /**
   * Specifies how many samples (N) of the metric is needed to trigger the alarm.
   * If this property is specified, a composite alarm is created of the following:
   * <ul>
   * <li>The original alarm, created without this property being used; this alarm will have no actions set.</li>
   * <li>A secondary alarm, which will monitor the same metric with the N (SampleCount) statistic, checking the sample count.</li>
   * </ul>
   * This composite alarm will be returned as a result and uses the specified alarm actions.
   * @default - default behaviour - no condition on sample count will be added to the alarm
   * @deprecated Use minSampleCountToEvaluateDatapoint instead. minMetricSamplesAlarm uses different evaluation
   *   period for its child alarms, so it doesn't guarantee that each datapoint in the evaluation period has
   *   sufficient number of samples
   */
  readonly minMetricSamplesToAlarm?: number;

  /**
   * This allows user to attach custom values to this alarm, which can later be accessed from the "useCreatedAlarms" method.
   *
   * @default - no tags
   */
  readonly customTags?: string[];

  /**
   * This allows user to attach custom parameters to this alarm, which can later be accessed from the "useCreatedAlarms" method.
   *
   * @default - no parameters
   */
  readonly customParams?: Record<string, any>;

  /**
   * Comparison operator used to compare actual value against the threshold.
   *
   * @default - alarm-specific default
   */
  readonly comparisonOperatorOverride?: ComparisonOperator;

  /**
   * Behaviour in case the metric data is missing.
   *
   * @default - alarm-specific default
   */
  readonly treatMissingDataOverride?: TreatMissingData;

  /**
   * Used only for alarms based on percentiles.
   * If you specify <code>false</code>, the alarm state does not change during periods with too few data points to be statistically significant.
   * If you specify <code>true</code>, the alarm is always evaluated and possibly changes state no matter how many data points are available.
   *
   * @default - true
   */
  readonly evaluateLowSampleCountPercentile?: boolean;

  /**
   * Enables the configured CloudWatch alarm ticketing actions.
   *
   * @default - the same as monitoring facade default
   */
  readonly actionsEnabled?: boolean;

  /**
   * Number of breaches required to transition into an ALARM state.
   *
   * @default - the same as monitoring facade default
   */
  readonly datapointsToAlarm?: number;

  /**
   * Number of periods to consider when checking the number of breaching datapoints.
   *
   * @default - the same as monitoring facade default
   */
  readonly evaluationPeriods?: number;

  /**
   * Period override for the metric to alarm on.
   *
   * @default - the default specified in MetricFactory
   */
  readonly period?: Duration;

  /**
   * An optional link included in the generated ticket description body.
   *
   * @default - no additional link will be added
   */
  readonly documentationLink?: string;

  /**
   * An optional link included in the generated ticket description body.
   *
   * @default - no additional link will be added
   */
  readonly runbookLink?: string;

  /**
   * Indicates whether the alarming range of values should be highlighted in the widget.
   *
   * @default - false
   */
  readonly fillAlarmRange?: boolean;

  /**
   * If specified, it modifies the final alarm annotation color.
   *
   * @default - no override (default color)
   */
  readonly overrideAnnotationColor?: string;

  /**
   * If specified, it modifies the final alarm annotation label.
   *
   * @default - no override (default label)
   */
  readonly overrideAnnotationLabel?: string;

  /**
   * If specified, it modifies the final alarm annotation visibility.
   *
   * @default - no override (default visibility)
   */
  readonly overrideAnnotationVisibility?: boolean;

  /**
   * If specified, adjusts the metric before creating an alarm from it.
   *
   * @default - no adjuster
   */
  readonly metricAdjuster?: IMetricAdjuster;
}
