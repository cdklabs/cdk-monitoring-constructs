import { Duration } from "aws-cdk-lib";
import {
  AlarmBase,
  AlarmRule,
  AlarmState,
  ComparisonOperator,
  CompositeAlarm,
  HorizontalAnnotation,
  IAlarm,
  IAlarmRule,
  IMetric,
  MathExpression,
  Metric,
  TreatMissingData,
} from "aws-cdk-lib/aws-cloudwatch";
import { Construct } from "constructs";

import { IAlarmActionStrategy, noopAction } from "./action";
import { AlarmNamingStrategy } from "./AlarmNamingStrategy";
import {
  AlarmAnnotationStrategyProps,
  DefaultAlarmAnnotationStrategy,
  IAlarmAnnotationStrategy,
} from "./IAlarmAnnotationStrategy";
import { IAlarmDedupeStringProcessor } from "./IAlarmDedupeStringProcessor";
import { AlarmNamingInput, IAlarmNamingStrategy } from "./IAlarmNamingStrategy";
import {
  CompositeMetricAdjuster,
  DefaultMetricAdjuster,
  IMetricAdjuster,
} from "./metric-adjuster";
import {
  MetricFactoryDefaults,
  MetricStatistic,
  MetricWithAlarmSupport,
} from "../metric";

const DefaultDatapointsToAlarm = 3;

/**
 * Commonly used disambiguators.
 */
export type PredefinedAlarmDisambiguators = "Warning" | "Critical";

/**
 * Metadata of an alarm.
 */
export interface AlarmMetadata {
  readonly action: IAlarmActionStrategy;
  readonly dedupeString?: string;
  readonly disambiguator?: string;
  readonly customTags?: string[];
  readonly customParams?: Record<string, any>;
}

/**
 * Representation of an alarm with additional information.
 */
export interface AlarmWithAnnotation extends AlarmMetadata {
  readonly alarm: AlarmBase;
  readonly alarmName: string;
  readonly alarmNameSuffix: string;
  readonly alarmLabel: string;
  readonly alarmDescription: string;
  readonly alarmDefinition: AlarmCreateDefinition;
  readonly alarmRuleWhenOk: IAlarmRule;
  readonly alarmRuleWhenAlarming: IAlarmRule;
  readonly alarmRuleWhenInsufficientData: IAlarmRule;
  readonly annotation: HorizontalAnnotation;
}

/**
 * Properties necessary to create a single alarm and configure it.
 */
export interface AddAlarmProps {
  /**
   * Allows to override the default action strategy.
   *
   * @default - default action will be used
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
   * Disambiguator is a string that differentiates this alarm from other similar ones.
   *
   * @default - undefined (no disambiguator)
   */
  readonly disambiguator?: string;

  /**
   * Alarm description is included in the ticket and therefore should describe what happened, with as much context as possible.
   */
  readonly alarmDescription: string;

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
   * Suffix added to base alarm name. Alarm names need to be unique.
   */
  readonly alarmNameSuffix: string;

  /**
   * If this is defined, the default resource-specific alarm dedupe string will be set and this will be added as a suffix.
   * This allows you to specify the same dedupe string for a family of alarms.
   * Cannot be defined at the same time as alarmDedupeStringOverride.
   *
   * @default - undefined (no suffix)
   */
  readonly alarmDedupeStringSuffix?: string;

  /**
   * Enables the configured CloudWatch alarm ticketing actions.
   *
   * @default - the same as monitoring facade default
   */
  readonly actionsEnabled?: boolean;

  /**
   * Threshold to alarm on.
   */
  readonly threshold: number;

  /**
   * Comparison operator used to compare actual value against the threshold.
   */
  readonly comparisonOperator: ComparisonOperator;

  /**
   * Behaviour in case the metric data is missing.
   */
  readonly treatMissingData: TreatMissingData;

  /**
   * Number of breaches required to transition into an ALARM state.
   */
  readonly datapointsToAlarm?: number;

  /**
   * Number of periods to consider when checking the number of breaching datapoints.
   *
   * @default - Same as datapointsToAlarm.
   */
  readonly evaluationPeriods?: number;

  /**
   * Period override for the metric to alarm on.
   *
   * @default - the default specified in MetricFactory
   */
  readonly period?: Duration;

  /**
   * Used only for alarms based on percentiles.
   * If you specify <code>false</code>, the alarm state does not change during periods with too few data points to be statistically significant.
   * If you specify <code>true</code>, the alarm is always evaluated and possibly changes state no matter how many data points are available.
   *
   * @default - true
   */
  readonly evaluateLowSampleCountPercentile?: boolean;

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
   * This property is required in the following situation:
   * <ol>
   *     <li><code>minSampleCountToEvaluateDatapoint</code> is specified</li>
   *     <li>the metric used for the alarm is a <code>MathExpression</code></li>
   *     <li>the <code>MathExpression</code> is composed of more than one metric</li>
   * </ol>
   *
   * In this situation, this property indicates the metric Id in the MathExpression’s <code>usingMetrics</code>
   * property that should be used as the sampleCount metric for the new MathExpression as described in the documentation
   * for <code>minSampleCountToEvaluateDatapoint</code>.
   */
  readonly sampleCountMetricId?: string;

  /**
   * Specifies how many samples (N) of the metric is needed to trigger the alarm.
   * If this property is specified, an artificial composite alarm is created of the following:
   * <ul>
   * <li>The original alarm, created without this property being used; this alarm will have no actions set.</li>
   * <li>A secondary alarm, which will monitor the same metric with the N (SampleCount) statistic, checking the sample count.</li>
   * </ul>
   * The newly created composite alarm will be returned as a result, and it will take the original alarm actions.
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

/**
 * Describes the inputs to a single alarm's creation and configuration.
 */
export interface AlarmCreateDefinition {
  /**
   * The original, unadjusted metric on which the alarm was created.
   */
  readonly metric: MetricWithAlarmSupport;

  /**
   * The requested configuration for the alarm.
   */
  readonly addAlarmProps: AddAlarmProps;

  /**
   * Number of breaches required to transition into an ALARM state.
   */
  readonly datapointsToAlarm: number;

  /**
   * Number of periods to consider when checking the number of breaching datapoints.
   */
  readonly evaluationPeriods: number;

  /**
   * The alarm factory that created the alarm.
   */
  readonly alarmFactory: AlarmFactory;
}

/**
 * Properties necessary to create a composite alarm and configure it.
 */
export interface AddCompositeAlarmProps {
  /**
   * Allows to override the default action strategy.
   *
   * @default - default action will be used
   */
  readonly actionOverride?: IAlarmActionStrategy;

  /**
   * If this is defined, the alarm dedupe string is set to this exact value.
   * Please be aware that you need to handle deduping for different stages (Beta, Prod...) and realms (EU, NA...) manually.
   *
   * @default - undefined (no override)
   */
  readonly dedupeStringOverride?: string;

  /**
   * If this is defined, the alarm name is set to this exact value.
   * Please be aware that you need to specify prefix for different stages (Beta, Prod...) and realms (EU, NA...) manually.
   */
  readonly alarmNameOverride?: string;

  /**
   * A text included in the generated ticket description body, which fully replaces the generated text.
   *
   * @default - default auto-generated content only
   */
  readonly alarmDescriptionOverride?: string;

  /**
   * Disambiguator is a string that differentiates this alarm from other similar ones.
   */
  readonly disambiguator: string;

  /**
   * Alarm description is included in the ticket and therefore should describe what happened, with as much context as possible.
   *
   * @default - no description
   */
  readonly alarmDescription?: string;

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
   * Suffix added to base alarm name. Alarm names need to be unique.
   *
   * @default - no suffix
   */
  readonly alarmNameSuffix?: string;

  /**
   * If this is defined, the default resource-specific alarm dedupe string will be set and this will be added as a suffix.
   * This allows you to specify the same dedupe string for a family of alarms.
   * Cannot be defined at the same time as dedupeStringOverride.
   *
   * @default - undefined (no suffix)
   */
  readonly alarmDedupeStringSuffix?: string;

  /**
   * Enables the configured CloudWatch alarm ticketing actions.
   *
   * @default - the same as monitoring facade default
   */
  readonly actionsEnabled?: boolean;

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
   * Indicates whether the alarming range of values should be highlighted in the widget.
   *
   * @default - false
   */
  readonly fillAlarmRange?: boolean;

  /**
   * Logical operator used to aggregate the status individual alarms.
   *
   * @default - OR
   */
  readonly compositeOperator?: CompositeAlarmOperator;

  /**
   * Options for AT_LEAST operator.
   * Required when compositeOperator is AT_LEAST.
   *
   * @default - undefined
   */
  readonly atLeastOptions?: CompositeAlarmAtLeastOptions;

  /**
   * Actions will be suppressed if the suppressor alarm is in the ALARM state.
   *
   * @default - no suppressor alarm
   */
  readonly actionsSuppressor?: IAlarm;

  /**
   * The maximum duration that the composite alarm waits after suppressor alarm goes out of the ALARM state.
   * After this time, the composite alarm performs its actions.
   *
   * @default - 60 seconds
   */
  readonly actionsSuppressorExtensionPeriod?: Duration;

  /**
   * The maximum duration that the composite alarm waits for the suppressor alarm to go into the ALARM state.
   * After this time, the composite alarm performs its actions.
   *
   * @default - 60 seconds
   */
  readonly actionsSuppressorWaitPeriod?: Duration;
}

/**
 * Enable alarm actions for all severities (boolean) or provide a mapping of the disambiguators to booleans
 */
export type ActionsEnabled =
  | boolean
  | Record<PredefinedAlarmDisambiguators | string, boolean>;

export enum CompositeAlarmOperator {
  /**
   * trigger only if all the alarms are triggered
   */
  AND,

  /**
   * trigger if any of the alarms is triggered
   */
  OR,

  /**
   * trigger if at least M alarms are in the specified state
   * Requires atLeastOptions to be specified
   */
  AT_LEAST,
}

/**
 * Threshold for AT_LEAST operator.
 */
export abstract class AtLeastThreshold {
  /**
   * Create a count-based threshold.
   * @param count The minimum number of alarms that must be in the specified state
   */
  public static count(count: number): AtLeastThreshold {
    return new AtLeastThresholdCount(count);
  }

  /**
   * Create a percentage-based threshold.
   * @param percentage The minimum percentage of alarms (0-100) that must be in the specified state
   */
  public static percentage(percentage: number): AtLeastThreshold {
    return new AtLeastThresholdPercentage(percentage);
  }

  /**
   * @internal
   */
  public abstract _renderThreshold(alarms: IAlarm[]): string;
}

class AtLeastThresholdCount extends AtLeastThreshold {
  constructor(private readonly count: number) {
    super();
  }

  public _renderThreshold(alarms: IAlarm[]): string {
    if (this.count < 0 || this.count > alarms.length) {
      throw new Error(
        `atLeastOptions.threshold count (${this.count}) must be between 0 and ${alarms.length} (number of alarms)`,
      );
    }
    return this.count.toString();
  }
}

class AtLeastThresholdPercentage extends AtLeastThreshold {
  constructor(private readonly percentage: number) {
    super();
  }

  public _renderThreshold(alarms: IAlarm[]): string {
    if (this.percentage < 0 || this.percentage > 100) {
      throw new Error(
        `atLeastOptions.threshold percentage (${this.percentage}) must be between 0 and 100`,
      );
    }
    return `${this.percentage}%`;
  }
}

/**
 * Configuration for AT_LEAST composite alarm operator.
 */
export interface CompositeAlarmAtLeastOptions {
  /**
   * Threshold for AT_LEAST operator.
   * Use AtLeastThreshold.count() or AtLeastThreshold.percentage().
   */
  readonly threshold: AtLeastThreshold;

  /**
   * Alarm state for AT_LEAST operator.
   *
   * @default - ALARM
   */
  readonly state?: AlarmState;
}

export interface AlarmFactoryDefaults {
  /**
   * Enables the configured CloudWatch alarm ticketing actions for either all severities, or per severity.
   */
  readonly actionsEnabled: ActionsEnabled;

  /**
   * Default alarm action used for each alarm, unless it is overridden.
   *
   * @default - no action.
   */
  readonly action?: IAlarmActionStrategy;

  /**
   * Optional alarm action for each disambiguator.
   *
   * @default - Global alarm action if defined.
   */
  readonly disambiguatorAction?: Record<
    PredefinedAlarmDisambiguators | string,
    IAlarmActionStrategy
  >;

  /**
   * Custom strategy to create annotations for alarms.
   *
   * @default - default annotations
   */
  readonly annotationStrategy?: IAlarmAnnotationStrategy;

  /**
   * Custom strategy to process dedupe strings of the alarms
   *
   * @default - default behaviour (no change)
   */
  readonly dedupeStringProcessor?: IAlarmDedupeStringProcessor;

  /**
   * Custom strategy to name alarms
   *
   * @default - default behaviour (no change)
   */
  readonly alarmNamingStrategy?: IAlarmNamingStrategy;

  /**
   * Number of breaches required to transition into an ALARM state.
   *
   * @default - 3
   */
  readonly datapointsToAlarm?: number;

  /**
   * Number of periods to consider when checking the number of breaching datapoints.
   *
   * @default - Same as datapointsToAlarm.
   */
  readonly evaluationPeriods?: number;

  /**
   * Global prefix for all alarm names. This should be something unique to avoid potential collisions.
   * This is ignored if an alarm's dedupeStringOverride is declared.
   */
  readonly alarmNamePrefix: string;

  /**
   * An optional link included in the generated ticket description body.
   */
  readonly documentationLink?: string;

  /**
   * An optional link included in the generated ticket description body.
   */
  readonly runbookLink?: string;

  /**
   * If this is defined as false and dedupeStringOverride is undefined, the alarm prefix will be part of the dedupe string.
   * This essentially stops the dedupe of different errors together.
   *
   * @default - undefined (true)
   */
  readonly useDefaultDedupeForError?: boolean;

  /**
   * If this is defined as false and dedupeStringOverride is undefined, the alarm prefix will be part of the dedupe string.
   * This essentially stops the dedupe of different latency issues together.
   *
   * @default - undefined (true)
   */
  readonly useDefaultDedupeForLatency?: boolean;
}

export interface AlarmFactoryProps {
  readonly globalAlarmDefaults: AlarmFactoryDefaults;
  readonly globalMetricDefaults: MetricFactoryDefaults;
  readonly localAlarmNamePrefix: string;
}

export class AlarmFactory {
  protected readonly alarmScope: Construct;
  protected readonly globalAlarmDefaults: AlarmFactoryDefaults;
  protected readonly globalMetricDefaults: MetricFactoryDefaults;
  protected readonly alarmNamingStrategy: IAlarmNamingStrategy;

  constructor(alarmScope: Construct, props: AlarmFactoryProps) {
    this.alarmScope = alarmScope;
    this.globalAlarmDefaults = props.globalAlarmDefaults;
    this.globalMetricDefaults = props.globalMetricDefaults;
    this.alarmNamingStrategy =
      props.globalAlarmDefaults.alarmNamingStrategy ??
      new AlarmNamingStrategy(
        props.globalAlarmDefaults.alarmNamePrefix,
        props.localAlarmNamePrefix,
        props.globalAlarmDefaults.dedupeStringProcessor,
      );
  }

  addAlarm(
    metric: MetricWithAlarmSupport,
    props: AddAlarmProps,
  ): AlarmWithAnnotation {
    // adjust the metric

    const metricAdjuster = props.metricAdjuster
      ? CompositeMetricAdjuster.of(
          props.metricAdjuster,
          DefaultMetricAdjuster.INSTANCE,
        )
      : DefaultMetricAdjuster.INSTANCE;
    const adjustedMetric = metricAdjuster.adjustMetric(
      metric,
      this.alarmScope,
      props,
    );

    // metric that will be ultimately used to create the alarm
    let alarmMetric: MetricWithAlarmSupport = adjustedMetric;

    // prepare primary alarm properties

    const actionsEnabled = this.determineActionsEnabled(
      props.actionsEnabled,
      props.disambiguator,
    );
    const action = this.determineAction(
      props.disambiguator,
      props.actionOverride,
    );
    const alarmNamingInput: AlarmNamingInput = {
      ...props,
      action,
    };
    const alarmName = this.alarmNamingStrategy.getName(alarmNamingInput);
    const alarmNameSuffix = props.alarmNameSuffix;
    const alarmLabel =
      this.alarmNamingStrategy.getWidgetLabel(alarmNamingInput);
    const alarmDescription = this.generateDescription(
      props.alarmDescription,
      props.alarmDescriptionOverride,
      props.runbookLink,
      props.documentationLink,
    );
    const dedupeString =
      this.alarmNamingStrategy.getDedupeString(alarmNamingInput);
    const evaluateLowSampleCountPercentile =
      props.evaluateLowSampleCountPercentile ?? true;

    const datapointsToAlarm =
      props.datapointsToAlarm ??
      this.globalAlarmDefaults.datapointsToAlarm ??
      DefaultDatapointsToAlarm;
    const evaluationPeriods =
      props.evaluationPeriods ??
      this.globalAlarmDefaults.evaluationPeriods ??
      datapointsToAlarm;

    if (evaluationPeriods < datapointsToAlarm) {
      throw new Error(
        `evaluationPeriods must be greater than or equal to datapointsToAlarm for ${alarmName}`,
      );
    }

    // apply metric math for minimum metric samples

    if (props.minSampleCountToEvaluateDatapoint) {
      let label: string = `${adjustedMetric}`;
      let metricExpression: string;
      let metricSampleCountId: string = "sampleCount";
      let usingMetrics: Record<string, IMetric>;

      if (adjustedMetric instanceof MathExpression) {
        label = adjustedMetric.label ?? label;
        metricExpression = `(${adjustedMetric.expression})`;

        if (Object.keys(adjustedMetric.usingMetrics).length === 1) {
          const sampleCountMetric = (
            adjustedMetric.usingMetrics[
              Object.keys(adjustedMetric.usingMetrics)[0]
            ] as Metric
          ).with({
            statistic: MetricStatistic.N,
            label: "Sample count",
          });

          usingMetrics = {
            ...adjustedMetric.usingMetrics,
            [metricSampleCountId]: sampleCountMetric,
          };
        } else if (props.sampleCountMetricId) {
          usingMetrics = adjustedMetric.usingMetrics;
          metricSampleCountId = props.sampleCountMetricId;
        } else {
          throw new Error(
            "sampleCountMetricId must be specified when using minSampleCountToEvaluateDatapoint with a multiple-metric MathExpression",
          );
        }
      } else {
        const metricId: string = "metric";

        metricExpression = metricId;
        usingMetrics = {
          [metricId]: adjustedMetric,
          [metricSampleCountId]: adjustedMetric.with({
            statistic: MetricStatistic.N,
            label: "Sample count",
          }),
        };
      }

      alarmMetric = new MathExpression({
        label,
        expression: `IF(${metricSampleCountId} > ${props.minSampleCountToEvaluateDatapoint}, ${metricExpression})`,
        period: adjustedMetric.period,
        usingMetrics,
      });
    }

    // create primary alarm

    const primaryAlarm = alarmMetric.createAlarm(this.alarmScope, alarmName, {
      alarmName,
      alarmDescription,
      threshold: props.threshold,
      comparisonOperator: props.comparisonOperator,
      treatMissingData: props.treatMissingData,
      // default value (undefined) means "evaluate"
      evaluateLowSampleCountPercentile: evaluateLowSampleCountPercentile
        ? undefined
        : "ignore",
      datapointsToAlarm,
      evaluationPeriods,
      actionsEnabled,
    });

    let alarm: AlarmBase = primaryAlarm;

    // create composite alarm for min metric samples (if defined)
    // deprecated in favour of minSampleCountToEvaluateDatapoint

    if (
      !props.minSampleCountToEvaluateDatapoint &&
      props.minMetricSamplesToAlarm
    ) {
      const metricSampleCount = adjustedMetric.with({
        statistic: MetricStatistic.N,
      });
      const noSamplesAlarm = metricSampleCount.createAlarm(
        this.alarmScope,
        `${alarmName}-NoSamples`,
        {
          alarmName: `${alarmName}-NoSamples`,
          alarmDescription: `The metric (${adjustedMetric}) does not have enough samples to alarm. Must have at least ${props.minMetricSamplesToAlarm}.`,
          threshold: props.minMetricSamplesToAlarm,
          comparisonOperator: ComparisonOperator.LESS_THAN_THRESHOLD,
          treatMissingData: TreatMissingData.BREACHING,
          datapointsToAlarm: 1,
          evaluationPeriods: 1,
          actionsEnabled,
        },
      );
      alarm = new CompositeAlarm(this.alarmScope, `${alarmName}-WithSamples`, {
        actionsEnabled,
        compositeAlarmName: `${alarmName}-WithSamples`,
        alarmDescription: this.joinDescriptionParts(
          alarmDescription,
          `Min number of samples to alarm: ${props.minMetricSamplesToAlarm}`,
        ),
        alarmRule: AlarmRule.allOf(
          AlarmRule.fromAlarm(primaryAlarm, AlarmState.ALARM),
          AlarmRule.not(AlarmRule.fromAlarm(noSamplesAlarm, AlarmState.ALARM)),
        ),
      });
    }

    // attach alarm actions

    action.addAlarmActions({
      alarm,
      action,
      dedupeString,
      disambiguator: props.disambiguator,
      customTags: props.customTags ?? [],
      customParams: props.customParams ?? {},
    });

    // create annotation for the primary alarm

    const annotation = this.createAnnotation({
      alarm: primaryAlarm,
      action,
      metric: adjustedMetric,
      evaluationPeriods,
      datapointsToAlarm,
      dedupeString,
      minMetricSamplesToAlarm: props.minMetricSamplesToAlarm,
      minSampleCountToEvaluateDatapoint:
        props.minSampleCountToEvaluateDatapoint,
      fillAlarmRange: props.fillAlarmRange ?? false,
      overrideAnnotationColor: props.overrideAnnotationColor,
      overrideAnnotationLabel: props.overrideAnnotationLabel,
      overrideAnnotationVisibility: props.overrideAnnotationVisibility,
      comparisonOperator: props.comparisonOperator,
      threshold: props.threshold,
      disambiguator: props.disambiguator,
      customTags: props.customTags ?? [],
      customParams: props.customParams ?? {},
    });

    // return the final result

    return {
      alarm,
      action,
      alarmName,
      alarmNameSuffix,
      alarmLabel,
      alarmDescription,
      alarmDefinition: {
        metric,
        addAlarmProps: props,
        datapointsToAlarm,
        evaluationPeriods,
        alarmFactory: this,
      },
      customTags: props.customTags,
      customParams: props.customParams,
      alarmRuleWhenOk: AlarmRule.fromAlarm(alarm, AlarmState.OK),
      alarmRuleWhenAlarming: AlarmRule.fromAlarm(alarm, AlarmState.ALARM),
      alarmRuleWhenInsufficientData: AlarmRule.fromAlarm(
        alarm,
        AlarmState.INSUFFICIENT_DATA,
      ),
      dedupeString,
      annotation,
      disambiguator: props.disambiguator,
    };
  }

  addCompositeAlarm(
    alarms: AlarmWithAnnotation[],
    props: AddCompositeAlarmProps,
  ): CompositeAlarm {
    const actionsEnabled = this.determineActionsEnabled(
      props?.actionsEnabled,
      props?.disambiguator,
    );
    const action =
      props.actionOverride ?? this.globalAlarmDefaults.action ?? noopAction();
    const namingInput = { alarmNameSuffix: "Composite", ...props };
    const alarmName = this.alarmNamingStrategy.getName(namingInput);
    const alarmDescription = this.generateDescription(
      props?.alarmDescription ?? "Composite alarm",
      props?.alarmDescriptionOverride,
      props?.runbookLink,
      props?.documentationLink,
    );
    const dedupeString = this.alarmNamingStrategy.getDedupeString(namingInput);
    const alarmRule = this.determineCompositeAlarmRule(alarms, props);

    const alarm = new CompositeAlarm(this.alarmScope, alarmName, {
      compositeAlarmName: alarmName,
      alarmDescription,
      alarmRule,
      actionsEnabled,
      actionsSuppressor: props?.actionsSuppressor,
      actionsSuppressorExtensionPeriod: props?.actionsSuppressorExtensionPeriod,
      actionsSuppressorWaitPeriod: props?.actionsSuppressorWaitPeriod,
    });

    action.addAlarmActions({
      alarm,
      action,
      dedupeString,
      disambiguator: props?.disambiguator,
      customTags: props?.customTags,
      customParams: props?.customParams,
    });

    return alarm;
  }

  protected determineCompositeAlarmRule(
    alarms: AlarmWithAnnotation[],
    props: AddCompositeAlarmProps,
  ): IAlarmRule {
    const operator = props.compositeOperator ?? CompositeAlarmOperator.OR;
    switch (operator) {
      case CompositeAlarmOperator.AND: {
        const alarmRules = alarms.map((alarm) => alarm.alarmRuleWhenAlarming);
        return AlarmRule.allOf(...alarmRules);
      }
      case CompositeAlarmOperator.OR: {
        const alarmRules = alarms.map((alarm) => alarm.alarmRuleWhenAlarming);
        return AlarmRule.anyOf(...alarmRules);
      }
      case CompositeAlarmOperator.AT_LEAST: {
        if (!props.atLeastOptions) {
          throw new Error(
            "atLeastOptions must be specified when using AT_LEAST operator",
          );
        }
        const threshold = props.atLeastOptions.threshold;
        const state = props.atLeastOptions.state ?? AlarmState.ALARM;
        const alarmObjects = alarms.map((alarm) => alarm.alarm);
        const alarmNames = alarms.map((alarm) => alarm.alarm.alarmName);
        const thresholdString = threshold._renderThreshold(alarmObjects);
        const stateString = state.toString();
        const alarmList = alarmNames.join(", ");
        return AlarmRule.fromString(
          `AT_LEAST(${thresholdString}, ${stateString}, (${alarmList}))`,
        );
      }
      default:
        throw new Error(`Unsupported composite alarm operator: ${operator}`);
    }
  }

  protected determineActionsEnabled(
    actionsEnabled?: boolean,
    disambiguator?: string,
  ): boolean {
    if (actionsEnabled !== undefined) {
      // alarm-specific override to true or false
      return actionsEnabled;
    }
    if (typeof this.globalAlarmDefaults.actionsEnabled === "boolean") {
      // global defaults: boolean value
      return this.globalAlarmDefaults.actionsEnabled;
    }
    if (disambiguator) {
      // global defaults: disambiguator based value
      return this.globalAlarmDefaults.actionsEnabled[disambiguator] ?? false;
    }
    return false;
  }

  protected determineAction(
    disambiguator?: string,
    actionOverride?: IAlarmActionStrategy,
  ): IAlarmActionStrategy {
    // Explicit override
    if (actionOverride) {
      return actionOverride;
    }

    // Default by disambiugator
    if (
      disambiguator &&
      this.globalAlarmDefaults.disambiguatorAction?.[disambiguator]
    ) {
      return this.globalAlarmDefaults.disambiguatorAction[disambiguator];
    }

    // Default global action
    return this.globalAlarmDefaults.action ?? noopAction();
  }

  get shouldUseDefaultDedupeForError() {
    return this.globalAlarmDefaults.useDefaultDedupeForError ?? true;
  }

  get shouldUseDefaultDedupeForLatency() {
    return this.globalAlarmDefaults.useDefaultDedupeForLatency ?? true;
  }

  protected generateDescription(
    alarmDescription: string,
    alarmDescriptionOverride?: string,
    runbookLinkOverride?: string,
    documentationLinkOverride?: string,
  ) {
    const parts = [alarmDescriptionOverride ?? alarmDescription];

    const runbookLink =
      runbookLinkOverride ?? this.globalAlarmDefaults.runbookLink;
    const documentationLink =
      documentationLinkOverride ?? this.globalAlarmDefaults.documentationLink;

    if (runbookLink) {
      parts.push(`Runbook: ${runbookLink}`);
    }

    if (documentationLink) {
      parts.push(`Documentation: ${documentationLink}`);
    }

    return this.joinDescriptionParts(...parts);
  }

  protected joinDescriptionParts(...parts: string[]) {
    return parts.join(" \r\n");
  }

  protected createAnnotation(props: AlarmAnnotationStrategyProps) {
    const strategy =
      this.globalAlarmDefaults.annotationStrategy ??
      new DefaultAlarmAnnotationStrategy();
    return strategy.createAnnotation(props);
  }
}
