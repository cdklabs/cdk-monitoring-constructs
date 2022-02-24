import { Construct, Duration } from "monocdk";
import {
  Alarm,
  AlarmRule,
  AlarmState,
  ComparisonOperator,
  CompositeAlarm,
  HorizontalAnnotation,
  IAlarmRule,
  TreatMissingData,
} from "monocdk/aws-cloudwatch";

import { MetricFactoryDefaults, MetricWithAlarmSupport } from "../metric";
import { removeBracketsWithDynamicLabels } from "../strings";
import { AlarmNamingStrategy } from "./AlarmNamingStrategy";
import { IAlarmActionStrategy } from "./IAlarmActionStrategy";
import {
  AlarmAnnotationStrategyProps,
  DefaultAlarmAnnotationStrategy,
  IAlarmAnnotationStrategy,
} from "./IAlarmAnnotationStrategy";
import { IAlarmDedupeStringProcessor } from "./IAlarmDedupeStringProcessor";
import { noopAction } from "./NoopAlarmActionStrategy";

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
  readonly alarm: Alarm;
  readonly alarmName: string;
  readonly alarmNameSuffix: string;
  readonly alarmLabel: string;
  readonly alarmDescription: string;
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
   * @default default action will be used
   */
  readonly actionOverride?: IAlarmActionStrategy;

  /**
   * If this is defined, the alarm dedupe string is set to this exact value.
   * Please be aware that you need to handle deduping for different stages (Beta, Prod...) and realms (EU, NA...) manually.
   *
   * @default undefined (no override)
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
   * @default default auto-generated content only
   */
  readonly alarmDescriptionOverride?: string;

  /**
   * Disambiguator is a string that differentiates this alarm from other similar ones.
   *
   * @default undefined (no disambiguator)
   */
  readonly disambiguator?: string;

  /**
   * Alarm description is included in the ticket and therefore should describe what happened, with as much context as possible.
   */
  readonly alarmDescription: string;

  /**
   * An optional link included in the generated ticket description body.
   *
   * @default no additional link will be added
   */
  readonly documentationLink?: string;

  /**
   * An optional link included in the generated ticket description body.
   *
   * @default no additional link will be added
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
   * @default undefined (no suffix)
   */
  readonly alarmDedupeStringSuffix?: string;

  /**
   * Enables the configured CloudWatch alarm ticketing actions.
   *
   * @default the same as monitoring facade default
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
   * @default {number} Same as datapointsToAlarm.
   */
  readonly evaluationPeriods?: number;

  /**
   * Period override for the metric to alarm on.
   *
   * @default the default specified in MetricFactory
   */
  readonly period?: Duration;

  /**
   * Used only for alarms based on percentiles.
   * If you specify <code>false</code>, the alarm state does not change during periods with too few data points to be statistically significant.
   * If you specify <code>true</code>, the alarm is always evaluated and possibly changes state no matter how many data points are available.
   *
   * @default true
   */
  readonly evaluateLowSampleCountPercentile?: boolean;

  /**
   * This allows user to attach custom values to this alarm, which can later be accessed from the "useCreatedAlarms" method.
   *
   * @default no tags
   */
  readonly customTags?: string[];

  /**
   * This allows user to attach custom parameters to this alarm, which can later be accessed from the "useCreatedAlarms" method.
   *
   * @default no parameters
   */
  readonly customParams?: Record<string, any>;

  /**
   * Indicates whether the alarming range of values should be highlighted in the widget.
   *
   * @default false
   */
  readonly fillAlarmRange?: boolean;
}

/**
 * Properties necessary to create a composite alarm and configure it.
 */
export interface AddCompositeAlarmProps {
  /**
   * Allows to override the default action strategy.
   *
   * @default default action will be used
   */
  readonly actionOverride?: IAlarmActionStrategy;

  /**
   * If this is defined, the alarm dedupe string is set to this exact value.
   * Please be aware that you need to handle deduping for different stages (Beta, Prod...) and realms (EU, NA...) manually.
   *
   * @default undefined (no override)
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
   * @default default auto-generated content only
   */
  readonly alarmDescriptionOverride?: string;

  /**
   * Disambiguator is a string that differentiates this alarm from other similar ones.
   */
  readonly disambiguator: string;

  /**
   * Alarm description is included in the ticket and therefore should describe what happened, with as much context as possible.
   *
   * @default no description
   */
  readonly alarmDescription?: string;

  /**
   * An optional link included in the generated ticket description body.
   *
   * @default no additional link will be added
   */
  readonly documentationLink?: string;

  /**
   * An optional link included in the generated ticket description body.
   *
   * @default no additional link will be added
   */
  readonly runbookLink?: string;

  /**
   * Suffix added to base alarm name. Alarm names need to be unique.
   *
   * @default no suffix
   */
  readonly alarmNameSuffix?: string;

  /**
   * If this is defined, the default resource-specific alarm dedupe string will be set and this will be added as a suffix.
   * This allows you to specify the same dedupe string for a family of alarms.
   * Cannot be defined at the same time as alarmDedupeStringOverride.
   *
   * @default undefined (no suffix)
   */
  readonly alarmDedupeStringSuffix?: string;

  /**
   * Enables the configured CloudWatch alarm ticketing actions.
   *
   * @default the same as monitoring facade default
   */
  readonly actionsEnabled?: boolean;

  /**
   * This allows user to attach custom values to this alarm, which can later be accessed from the "useCreatedAlarms" method.
   *
   * @default no tags
   */
  readonly customTags?: string[];

  /**
   * This allows user to attach custom parameters to this alarm, which can later be accessed from the "useCreatedAlarms" method.
   *
   * @default no parameters
   */
  readonly customParams?: Record<string, any>;

  /**
   * Indicates whether the alarming range of values should be highlighted in the widget.
   *
   * @default false
   */
  readonly fillAlarmRange?: boolean;

  /**
   * Logical operator used to aggregate the status individual alarms.
   *
   * @default OR
   */
  readonly compositeOperator?: CompositeAlarmOperator;
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
}

export interface AlarmFactoryDefaults {
  /**
   * Enables the configured CloudWatch alarm ticketing actions for either all severities, or per severity.
   */
  readonly actionsEnabled: ActionsEnabled;

  /**
   * Default alarm action used for each alarm, unless it is overridden.
   * If you do not want any actions to be created, just use NoAlarmActionStrategy.
   */
  readonly action?: IAlarmActionStrategy;

  /**
   * Custom strategy to create annotations for alarms.
   *
   * @default default annotations
   */
  readonly annotationStrategy?: IAlarmAnnotationStrategy;

  /**
   * Custom strategy to process dedupe strings of the alarms
   *
   * @default default behaviour (no change)
   */
  readonly dedupeStringProcessor?: IAlarmDedupeStringProcessor;

  /**
   * Number of breaches required to transition into an ALARM state.
   *
   * @default 3
   */
  readonly datapointsToAlarm?: number;

  /**
   * Number of periods to consider when checking the number of breaching datapoints.
   *
   * @default {number} Same as datapointsToAlarm.
   */
  readonly evaluationPeriods?: number;

  /**
   * Global prefix for all alarm names. This should be something unique to avoid collisions with other CTIs.
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
   * @default undefined (true)
   */
  readonly useDefaultDedupeForError?: boolean;

  /**
   * If this is defined as false and dedupeStringOverride is undefined, the alarm prefix will be part of the dedupe string.
   * This essentially stops the dedupe of different latency issues together.
   *
   * @default undefined (true)
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
  protected readonly alarmNamingStrategy: AlarmNamingStrategy;

  constructor(alarmScope: Construct, props: AlarmFactoryProps) {
    this.alarmScope = alarmScope;
    this.globalAlarmDefaults = props.globalAlarmDefaults;
    this.globalMetricDefaults = props.globalMetricDefaults;
    this.alarmNamingStrategy = new AlarmNamingStrategy(
      props.globalAlarmDefaults.alarmNamePrefix,
      props.localAlarmNamePrefix,
      props.globalAlarmDefaults.dedupeStringProcessor
    );
  }

  addAlarm(
    metric: MetricWithAlarmSupport,
    props: AddAlarmProps
  ): AlarmWithAnnotation {
    let adjustedMetric = metric;
    if (props.period) {
      // Adjust metric period for the alarm
      adjustedMetric = adjustedMetric.with({ period: props.period });
    }
    if (adjustedMetric.label) {
      // Annotations do not support dynamic labels, so we have to remove them from metric name
      adjustedMetric = adjustedMetric.with({
        label: removeBracketsWithDynamicLabels(adjustedMetric.label),
      });
    }
    const actionsEnabled = this.determineActionsEnabled(
      props.actionsEnabled,
      props.disambiguator
    );
    const action =
      props.actionOverride ?? this.globalAlarmDefaults.action ?? noopAction();
    const alarmName = this.alarmNamingStrategy.getName(props);
    const alarmNameSuffix = props.alarmNameSuffix;
    const alarmLabel = this.alarmNamingStrategy.getWidgetLabel(props);
    const alarmDescription = this.generateDescription(
      props.alarmDescription,
      props.alarmDescriptionOverride,
      props.runbookLink,
      props.documentationLink
    );
    const dedupeString = this.alarmNamingStrategy.getDedupeString(props);
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
        `evaluationPeriods must be greater than or equal to datapointsToAlarm for ${alarmName}`
      );
    }

    const alarm = adjustedMetric.createAlarm(this.alarmScope, alarmName, {
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

    action.addAlarmActions({
      alarm,
      action,
      dedupeString,
      disambiguator: props.disambiguator,
      customTags: props.customTags ?? [],
      customParams: props.customParams ?? {},
    });

    const annotation = this.createAnnotation({
      alarm,
      action,
      metric: adjustedMetric,
      evaluationPeriods,
      datapointsToAlarm,
      dedupeString,
      fillAlarmRange: props.fillAlarmRange ?? false,
      comparisonOperator: props.comparisonOperator,
      threshold: props.threshold,
      disambiguator: props.disambiguator,
      customTags: props.customTags ?? [],
      customParams: props.customParams ?? {},
    });

    return {
      alarm,
      action,
      alarmName,
      alarmNameSuffix,
      alarmLabel,
      alarmDescription,
      customTags: props.customTags,
      customParams: props.customParams,
      alarmRuleWhenOk: AlarmRule.fromAlarm(alarm, AlarmState.OK),
      alarmRuleWhenAlarming: AlarmRule.fromAlarm(alarm, AlarmState.ALARM),
      alarmRuleWhenInsufficientData: AlarmRule.fromAlarm(
        alarm,
        AlarmState.INSUFFICIENT_DATA
      ),
      dedupeString,
      annotation,
      disambiguator: props.disambiguator,
    };
  }

  addCompositeAlarm(
    alarms: AlarmWithAnnotation[],
    props: AddCompositeAlarmProps
  ): CompositeAlarm {
    const actionsEnabled = this.determineActionsEnabled(
      props?.actionsEnabled,
      props?.disambiguator
    );
    const action =
      props.actionOverride ?? this.globalAlarmDefaults.action ?? noopAction();
    const namingInput = { alarmNameSuffix: "Composite", ...props };
    const alarmName = this.alarmNamingStrategy.getName(namingInput);
    const alarmDescription = this.generateDescription(
      props?.alarmDescription ?? "Composite alarm",
      props?.alarmDescriptionOverride,
      props?.runbookLink,
      props?.documentationLink
    );
    const dedupeString = this.alarmNamingStrategy.getDedupeString(namingInput);
    const alarmRule = this.determineCompositeAlarmRule(alarms, props);

    const alarm = new CompositeAlarm(this.alarmScope, alarmName, {
      compositeAlarmName: alarmName,
      alarmDescription,
      alarmRule,
      actionsEnabled,
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
    props: AddCompositeAlarmProps
  ): IAlarmRule {
    const alarmRules = alarms.map((alarm) => alarm.alarmRuleWhenAlarming);
    const operator = props.compositeOperator ?? CompositeAlarmOperator.OR;
    switch (operator) {
      case CompositeAlarmOperator.AND:
        return AlarmRule.allOf(...alarmRules);
      case CompositeAlarmOperator.OR:
        return AlarmRule.anyOf(...alarmRules);
      default:
        throw new Error("Unsupported composite alarm operator: " + operator);
    }
  }

  protected determineActionsEnabled(
    actionsEnabled?: boolean,
    disambiguator?: string
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
    documentationLinkOverride?: string
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

    return parts.join(" \r\n");
  }

  protected createAnnotation(props: AlarmAnnotationStrategyProps) {
    const strategy =
      this.globalAlarmDefaults.annotationStrategy ??
      new DefaultAlarmAnnotationStrategy();
    return strategy.createAnnotation(props);
  }
}
