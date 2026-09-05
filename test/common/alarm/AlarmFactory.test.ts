import { Duration, Stack } from "aws-cdk-lib";
import { Capture, Match, Template } from "aws-cdk-lib/assertions";
import {
  Alarm,
  CfnAlarm,
  ComparisonOperator,
  MathExpression,
  Metric,
  Shading,
  TreatMissingData,
} from "aws-cdk-lib/aws-cloudwatch";
import {
  determineLatestNodeRuntime,
  Function,
  InlineCode,
} from "aws-cdk-lib/aws-lambda";
import { Topic } from "aws-cdk-lib/aws-sns";
import { Construct } from "constructs";

import {
  AddAlarmProps,
  AlarmActionStrategyProps,
  AlarmFactory,
  AlarmFactoryDefaults,
  AlarmNamingInput,
  CompositeAlarmOperator,
  IAlarmActionStrategy,
  IAlarmNamingStrategy,
  MetricFactoryDefaults,
  MetricStatistic,
  multipleActions,
  noopAction,
  notifySns,
  SnsAlarmActionStrategy,
  triggerLambda,
} from "../../../lib";

const stack = new Stack();
const construct = new Construct(stack, "SampleConstruct");

const snsAction = notifySns(new Topic(stack, "Dummy2"));

class SampleAlarmActionStrategy implements IAlarmActionStrategy {
  readonly prop = "Sample";

  addAlarmActions(_props: AlarmActionStrategyProps): void {
    // No-op
  }
}
const sampleAction = new SampleAlarmActionStrategy();

const globalMetricDefaults: MetricFactoryDefaults = {
  namespace: "DummyNamespace",
};
const globalAlarmDefaults: AlarmFactoryDefaults = {
  alarmNamePrefix: "DummyServiceAlarms",
  actionsEnabled: true,
  datapointsToAlarm: 6,
  // we do not care about alarm actions in this test
  action: noopAction(),
};
const globalAlarmDefaultsWithDisambiguator: AlarmFactoryDefaults = {
  alarmNamePrefix: "DummyServiceAlarms",
  actionsEnabled: {
    Critical: true,
    Warning: false,
  },
  datapointsToAlarm: 6,
  // we do not care about alarm actions in this test
  action: noopAction(),
  disambiguatorAction: {
    DisambiguatedAction: snsAction,
  },
};
const factory = new AlarmFactory(construct, {
  globalMetricDefaults,
  globalAlarmDefaults,
  localAlarmNamePrefix: "prefix",
});

const metric = new Metric({
  metricName: "DummyMetric1",
  namespace: "DummyCustomNamespace",
  dimensionsMap: { CustomDimension: "CustomDimensionValue" },
});

const props: AddAlarmProps = {
  alarmNameSuffix: "Suffix",
  alarmDescription: "Description",
  threshold: 10,
  comparisonOperator: ComparisonOperator.LESS_THAN_THRESHOLD,
  treatMissingData: TreatMissingData.NOT_BREACHING,
  datapointsToAlarm: 10,
  evaluationPeriods: 10,
};

test("addAlarm: valid periods do not throw error", () => {
  factory.addAlarm(metric, {
    ...props,
    datapointsToAlarm: 10,
    evaluationPeriods: 10,
  });
});

test("addAlarm: invalid periods throws error", () => {
  expect(() => {
    factory.addAlarm(metric, {
      ...props,
      datapointsToAlarm: 10,
      evaluationPeriods: 5,
    });
  }).toThrow(Error);
});

test("addAlarm: verify actions enabled", () => {
  const stack = new Stack();
  const factory = new AlarmFactory(stack, {
    globalMetricDefaults,
    globalAlarmDefaults: globalAlarmDefaultsWithDisambiguator,
    localAlarmNamePrefix: "prefix",
  });
  factory.addAlarm(metric, {
    ...props,
    actionsEnabled: true,
    alarmNameSuffix: "EnabledByFlag",
  });
  factory.addAlarm(metric, {
    ...props,
    actionsEnabled: false,
    alarmNameSuffix: "DisabledByFlag",
  });
  factory.addAlarm(metric, {
    ...props,
    disambiguator: "Critical",
    alarmNameSuffix: "EnabledByDisambiguator",
  });
  factory.addAlarm(metric, {
    ...props,
    disambiguator: "Warning",
    alarmNameSuffix: "DisabledByDisambiguator",
  });
  factory.addAlarm(metric, {
    ...props,
    disambiguator: "Invalid",
    alarmNameSuffix: "DisabledByInvalidDisambiguator",
  });
  factory.addAlarm(metric, {
    ...props,
    alarmNameSuffix: "DisabledByDefault",
  });

  const template = Template.fromStack(stack);
  template.hasResourceProperties("AWS::CloudWatch::Alarm", {
    ActionsEnabled: true,
    AlarmName: "DummyServiceAlarms-prefix-EnabledByFlag",
  });
  template.hasResourceProperties("AWS::CloudWatch::Alarm", {
    ActionsEnabled: false,
    AlarmName: "DummyServiceAlarms-prefix-DisabledByFlag",
  });
  template.hasResourceProperties("AWS::CloudWatch::Alarm", {
    ActionsEnabled: true,
    AlarmName: "DummyServiceAlarms-prefix-EnabledByDisambiguator-Critical",
  });
  template.hasResourceProperties("AWS::CloudWatch::Alarm", {
    ActionsEnabled: false,
    AlarmName: "DummyServiceAlarms-prefix-DisabledByDisambiguator-Warning",
  });
  template.hasResourceProperties("AWS::CloudWatch::Alarm", {
    ActionsEnabled: false,
    AlarmName:
      "DummyServiceAlarms-prefix-DisabledByInvalidDisambiguator-Invalid",
  });
  template.hasResourceProperties("AWS::CloudWatch::Alarm", {
    ActionsEnabled: false,
    AlarmName: "DummyServiceAlarms-prefix-DisabledByDefault",
  });
});

test("addAlarm: description can be overridden", () => {
  const alarm1 = factory.addAlarm(metric, {
    ...props,
    alarmNameSuffix: "Suffix6A",
  });
  const alarm2 = factory.addAlarm(metric, {
    ...props,
    alarmNameSuffix: "Suffix6B",
    alarmDescriptionOverride: "New Description",
  });

  expect(alarm1.alarmDescription).toEqual("Description");
  expect(alarm2.alarmDescription).toEqual("New Description");
});

test("addAlarm: evaluateLowSampleCountPercentile can be overridden", () => {
  const stack = new Stack();
  const factory = new AlarmFactory(stack, {
    globalMetricDefaults,
    globalAlarmDefaults,
    localAlarmNamePrefix: "prefix",
  });
  factory.addAlarm(metric, {
    ...props,
    alarmNameSuffix: "DefaultValue",
  });
  factory.addAlarm(metric, {
    ...props,
    evaluateLowSampleCountPercentile: false,
    alarmNameSuffix: "FalseValue",
  });
  factory.addAlarm(metric, {
    ...props,
    evaluateLowSampleCountPercentile: true,
    alarmNameSuffix: "TrueValue",
  });

  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("addAlarm: period override is propagated to alarm metric", () => {
  const alarm1h = factory.addAlarm(metric, {
    ...props,
    alarmNameSuffix: "OneHourPeriod",
    period: Duration.hours(1),
  });
  const alarm2h = factory.addAlarm(metric, {
    ...props,
    evaluateLowSampleCountPercentile: false,
    alarmNameSuffix: "TwoHoursPeriod",
    period: Duration.hours(2),
  });

  const alarm1hConfig = (alarm1h.alarm as Alarm).metric.toMetricConfig();
  expect(alarm1hConfig.metricStat?.period).toStrictEqual(Duration.hours(1));
  const alarm2hConfig = (alarm2h.alarm as Alarm).metric.toMetricConfig();
  expect(alarm2hConfig.metricStat?.period).toStrictEqual(Duration.hours(2));
});

test("addAlarm: fill is propagated to alarm annotation", () => {
  const stack = new Stack();
  const factory = new AlarmFactory(stack, {
    globalMetricDefaults,
    globalAlarmDefaults,
    localAlarmNamePrefix: "prefix",
  });
  const alarmNone = factory.addAlarm(metric, {
    ...props,
    alarmNameSuffix: "none",
    comparisonOperator: ComparisonOperator.LESS_THAN_THRESHOLD,
    fillAlarmRange: false,
  });
  const alarmAbove = factory.addAlarm(metric, {
    ...props,
    alarmNameSuffix: "above",
    comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD,
    fillAlarmRange: true,
  });
  const alarmBelow = factory.addAlarm(metric, {
    ...props,
    alarmNameSuffix: "below",
    comparisonOperator: ComparisonOperator.LESS_THAN_THRESHOLD,
    fillAlarmRange: true,
  });

  expect(alarmNone.annotation.fill).toBeUndefined();
  expect(alarmAbove.annotation.fill).toStrictEqual(Shading.ABOVE);
  expect(alarmBelow.annotation.fill).toStrictEqual(Shading.BELOW);
});

test("addAlarm: annotation overrides are applied", () => {
  const stack = new Stack();
  const factory = new AlarmFactory(stack, {
    globalMetricDefaults,
    globalAlarmDefaults,
    localAlarmNamePrefix: "prefix",
  });
  const alarm = factory.addAlarm(metric, {
    ...props,
    alarmNameSuffix: "none",
    comparisonOperator: ComparisonOperator.LESS_THAN_THRESHOLD,
    overrideAnnotationLabel: "NewLabel",
    overrideAnnotationVisibility: false,
    overrideAnnotationColor: "NewColor",
  });

  expect(alarm.annotation).toStrictEqual({
    color: "NewColor",
    label: "NewLabel",
    value: 10,
    visible: false,
  });
});

test("addAlarm: check created alarms when minMetricSamplesToAlarm is used", () => {
  const stack = new Stack();
  const factory = new AlarmFactory(stack, {
    globalMetricDefaults,
    globalAlarmDefaults,
    localAlarmNamePrefix: "prefix",
  });
  factory.addAlarm(metric, {
    ...props,
    alarmNameSuffix: "none",
    comparisonOperator: ComparisonOperator.LESS_THAN_THRESHOLD,
    minMetricSamplesToAlarm: 42,
    period: Duration.minutes(15),
  });

  const template = Template.fromStack(stack);
  template.hasResourceProperties("AWS::CloudWatch::Alarm", {
    AlarmName: "DummyServiceAlarms-prefix-none",
    MetricName: "DummyMetric1",
    Statistic: "Average",
    Period: 900,
  });
  template.hasResourceProperties("AWS::CloudWatch::Alarm", {
    AlarmName: "DummyServiceAlarms-prefix-none-NoSamples",
    AlarmDescription:
      "The metric (DummyMetric1) does not have enough samples to alarm. Must have at least 42.",
    ComparisonOperator: "LessThanThreshold",
    DatapointsToAlarm: 1,
    EvaluationPeriods: 1,
    MetricName: "DummyMetric1",
    Statistic: "SampleCount",
    Threshold: 42,
    TreatMissingData: "breaching",
    Period: 900,
  });

  const alarmRuleCapture = new Capture();
  template.hasResourceProperties("AWS::CloudWatch::CompositeAlarm", {
    AlarmName: "DummyServiceAlarms-prefix-none-WithSamples",
    AlarmRule: alarmRuleCapture,
  });
  const expectedPrimaryAlarmArn = {
    "Fn::GetAtt": ["DummyServiceAlarmsprefixnoneF01556DA", "Arn"],
  };
  const expectedSecondaryAlarmArn = {
    "Fn::GetAtt": ["DummyServiceAlarmsprefixnoneNoSamples414211DB", "Arn"],
  };
  expect(alarmRuleCapture.asObject()).toStrictEqual({
    ["Fn::Join"]: [
      "",
      [
        '(ALARM("',
        expectedPrimaryAlarmArn,
        '") AND (NOT (ALARM("',
        expectedSecondaryAlarmArn,
        '"))))',
      ],
    ],
  });
});

test("addAlarm: check created alarms when minSampleCountToEvaluateDatapoint is used", () => {
  const stack = new Stack();
  const factory = new AlarmFactory(stack, {
    globalMetricDefaults,
    globalAlarmDefaults,
    localAlarmNamePrefix: "prefix",
  });
  factory.addAlarm(metric, {
    ...props,
    alarmNameSuffix: "none",
    comparisonOperator: ComparisonOperator.LESS_THAN_THRESHOLD,
    minSampleCountToEvaluateDatapoint: 42,
    minMetricSamplesToAlarm: 55, // not used if minSampleCountToEvaluateDatapoint defined
    period: Duration.minutes(15),
  });

  const template = Template.fromStack(stack);
  template.hasResourceProperties("AWS::CloudWatch::Alarm", {
    AlarmName: "DummyServiceAlarms-prefix-none",
    AlarmDescription: "Description",
    ComparisonOperator: "LessThanThreshold",
    DatapointsToAlarm: 10,
    EvaluationPeriods: 10,
    TreatMissingData: "notBreaching",
    Metrics: [
      Match.objectLike({
        Expression: "IF(sampleCount > 42, metric)",
        Label: "DummyMetric1",
      }),
      {
        Id: "metric",
        MetricStat: {
          Metric: Match.objectLike({
            MetricName: "DummyMetric1",
          }),
          Period: 900,
          Stat: "Average",
        },
        ReturnData: false,
      },
      {
        Id: "sampleCount",
        MetricStat: {
          Metric: Match.objectLike({
            MetricName: "DummyMetric1",
          }),
          Period: 900,
          Stat: "SampleCount",
        },
        ReturnData: false,
      },
    ],
  });
});

test("addAlarm: check created alarms when minSampleCountToEvaluateDatapoint is used with single-metric MathExpression", () => {
  const stack = new Stack();
  const factory = new AlarmFactory(stack, {
    globalMetricDefaults,
    globalAlarmDefaults,
    localAlarmNamePrefix: "prefix",
  });
  const mathExpression = new MathExpression({
    expression: "MAX(metric)",
    label: "max",
    usingMetrics: {
      metric,
    },
  });

  factory.addAlarm(mathExpression, {
    ...props,
    alarmNameSuffix: "none",
    comparisonOperator: ComparisonOperator.LESS_THAN_THRESHOLD,
    minSampleCountToEvaluateDatapoint: 42,
    period: Duration.minutes(15),
  });

  const template = Template.fromStack(stack);
  template.hasResourceProperties("AWS::CloudWatch::Alarm", {
    AlarmName: "DummyServiceAlarms-prefix-none",
    AlarmDescription: "Description",
    ComparisonOperator: "LessThanThreshold",
    DatapointsToAlarm: 10,
    EvaluationPeriods: 10,
    TreatMissingData: "notBreaching",
    Metrics: [
      Match.objectLike({
        Expression: "IF(sampleCount > 42, (MAX(metric)))",
        Label: "max",
      }),
      {
        Id: "metric",
        MetricStat: {
          Metric: Match.objectLike({
            MetricName: "DummyMetric1",
          }),
          Period: 900,
          Stat: "Average",
        },
        ReturnData: false,
      },
      {
        Id: "sampleCount",
        MetricStat: {
          Metric: Match.objectLike({
            MetricName: "DummyMetric1",
          }),
          Period: 900,
          Stat: "SampleCount",
        },
        ReturnData: false,
      },
    ],
  });
});

test("addAlarm: should throw Error when minSampleCountToEvaluateDatapoint is used with multiple-metric MathExpression and sampleCountMetricId is not specified", () => {
  const stack = new Stack();
  const factory = new AlarmFactory(stack, {
    globalMetricDefaults,
    globalAlarmDefaults,
    localAlarmNamePrefix: "prefix",
  });
  const mathExpression = new MathExpression({
    expression: "MAX(metric)",
    label: "max",
    usingMetrics: {
      m1: metric,
      m2: metric.with({ statistic: MetricStatistic.N }),
    },
  });

  expect(() =>
    factory.addAlarm(mathExpression, {
      ...props,
      alarmNameSuffix: "none",
      comparisonOperator: ComparisonOperator.LESS_THAN_THRESHOLD,
      minSampleCountToEvaluateDatapoint: 42,
      period: Duration.minutes(15),
    }),
  ).toThrow(
    "sampleCountMetricId must be specified when using minSampleCountToEvaluateDatapoint with a multiple-metric MathExpression",
  );
});

test("addAlarm: check created alarms when minSampleCountToEvaluateDatapoint is used with multiple-metric MathExpression and sampleCountMetricId is specified", () => {
  const stack = new Stack();
  const factory = new AlarmFactory(stack, {
    globalMetricDefaults,
    globalAlarmDefaults,
    localAlarmNamePrefix: "prefix",
  });
  const mathExpression = new MathExpression({
    expression: "MAX(m1)",
    label: "max",
    usingMetrics: {
      m1: metric,
      m2: metric.with({ statistic: MetricStatistic.N }),
    },
  });

  factory.addAlarm(mathExpression, {
    ...props,
    alarmNameSuffix: "none",
    comparisonOperator: ComparisonOperator.LESS_THAN_THRESHOLD,
    minSampleCountToEvaluateDatapoint: 42,
    sampleCountMetricId: "m2",
    period: Duration.minutes(15),
  });

  const template = Template.fromStack(stack);
  template.hasResourceProperties("AWS::CloudWatch::Alarm", {
    AlarmName: "DummyServiceAlarms-prefix-none",
    AlarmDescription: "Description",
    ComparisonOperator: "LessThanThreshold",
    DatapointsToAlarm: 10,
    EvaluationPeriods: 10,
    TreatMissingData: "notBreaching",
    Metrics: [
      Match.objectLike({
        Expression: "IF(m2 > 42, (MAX(m1)))",
        Label: "max",
      }),
      {
        Id: "m1",
        MetricStat: {
          Metric: Match.objectLike({
            MetricName: "DummyMetric1",
          }),
          Period: 900,
          Stat: "Average",
        },
        ReturnData: false,
      },
      {
        Id: "m2",
        MetricStat: {
          Metric: Match.objectLike({
            MetricName: "DummyMetric1",
          }),
          Period: 900,
          Stat: "SampleCount",
        },
        ReturnData: false,
      },
    ],
  });
});

test("addCompositeAlarm: snapshot for operator", () => {
  const stack = new Stack();
  const factory = new AlarmFactory(stack, {
    globalMetricDefaults,
    globalAlarmDefaults: globalAlarmDefaultsWithDisambiguator,
    localAlarmNamePrefix: "prefix",
  });
  const alarm1 = factory.addAlarm(metric, {
    alarmNameSuffix: "Alarm1",
    alarmDescription: "Testing alarm 1",
    threshold: 1,
    comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD,
    treatMissingData: TreatMissingData.MISSING,
  });
  const alarm2 = factory.addAlarm(metric, {
    alarmNameSuffix: "Alarm2",
    alarmDescription: "Testing alarm 2",
    threshold: 2,
    comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD,
    treatMissingData: TreatMissingData.MISSING,
  });
  factory.addCompositeAlarm([alarm1, alarm2], {
    disambiguator: "CompositeAnd",
    alarmNameSuffix: "CompositeAnd",
    compositeOperator: CompositeAlarmOperator.AND,
  });
  factory.addCompositeAlarm([alarm1, alarm2], {
    disambiguator: "CompositeOr",
    alarmNameSuffix: "CompositeOr",
    compositeOperator: CompositeAlarmOperator.OR,
  });

  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("addCompositeAlarm: with actions", () => {
  const stack = new Stack();
  const factory = new AlarmFactory(stack, {
    globalMetricDefaults,
    globalAlarmDefaults: {
      alarmNamePrefix: "DummyServiceAlarms",
      actionsEnabled: true,
      datapointsToAlarm: 6,
      action: notifySns(new Topic(stack, "DefaultTopic")),
      disambiguatorAction: {
        Critical: notifySns(new Topic(stack, "CriticalTopic")),
        Warning: notifySns(new Topic(stack, "WarningTopic")),
      },
    },
    localAlarmNamePrefix: "prefix",
  });
  const alarm = factory.addAlarm(metric, {
    alarmNameSuffix: "Alarm",
    alarmDescription: "Testing alarm",
    threshold: 1,
    comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD,
    treatMissingData: TreatMissingData.MISSING,
  });

  // Should use action defined in disambiguatorAction
  factory.addCompositeAlarm([alarm], {
    disambiguator: "Critical",
  });

  // Should ignore action defined in disambiguatorAction in favor of actionOverride
  factory.addCompositeAlarm([alarm], {
    disambiguator: "Warning",
    actionOverride: triggerLambda(
      new Function(stack, "FunctionAction", {
        runtime: determineLatestNodeRuntime(stack),
        code: InlineCode.fromInline("{}"),
        handler: "Dummy::handler",
      }),
    ),
  });

  // Should use default action
  factory.addCompositeAlarm([alarm], {
    disambiguator: "Unknown",
  });

  const template = Template.fromStack(stack);
  template.hasResourceProperties("AWS::CloudWatch::CompositeAlarm", {
    AlarmName: "DummyServiceAlarms-prefix-Composite-Critical",
    AlarmActions: [{ Ref: "CriticalTopic48D98EE4" }],
  });
  template.hasResourceProperties("AWS::CloudWatch::CompositeAlarm", {
    AlarmName: "DummyServiceAlarms-prefix-Composite-Warning",
    AlarmActions: [{ "Fn::GetAtt": ["FunctionActionD082C8F7", "Arn"] }],
  });
  template.hasResourceProperties("AWS::CloudWatch::CompositeAlarm", {
    AlarmName: "DummyServiceAlarms-prefix-Composite-Unknown",
    AlarmActions: [{ Ref: "DefaultTopicC4DC856F" }],
  });
});

test("addCompositeAlarm: snapshot for suppressor alarm props", () => {
  const stack = new Stack();
  const factory = new AlarmFactory(stack, {
    globalMetricDefaults,
    globalAlarmDefaults: globalAlarmDefaultsWithDisambiguator,
    localAlarmNamePrefix: "prefix",
  });
  const alarm1 = factory.addAlarm(metric, {
    alarmNameSuffix: "Alarm1",
    alarmDescription: "Testing alarm 1",
    threshold: 1,
    comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD,
    treatMissingData: TreatMissingData.MISSING,
  });
  const alarm2 = factory.addAlarm(metric, {
    alarmNameSuffix: "Alarm2",
    alarmDescription: "Testing alarm 2",
    threshold: 2,
    comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD,
    treatMissingData: TreatMissingData.MISSING,
  });
  const suppressorAlarm = factory.addCompositeAlarm([alarm1, alarm2], {
    disambiguator: "SuppressorAlarm",
    alarmNameSuffix: "SuppressorAlarm",
  });
  factory.addCompositeAlarm([alarm1, alarm2], {
    disambiguator: "SuppressedAlarmDefault",
    alarmNameSuffix: "SuppressedAlarmDefault",
    actionsSuppressor: suppressorAlarm,
  });
  factory.addCompositeAlarm([alarm1, alarm2], {
    disambiguator: "SuppressedAlarmTestExtensionPeriod",
    alarmNameSuffix: "SuppressedAlarmTestExtensionPeriod",
    actionsSuppressor: suppressorAlarm,
    actionsSuppressorExtensionPeriod: Duration.seconds(100),
  });
  factory.addCompositeAlarm([alarm1, alarm2], {
    disambiguator: "SuppressedAlarmTestWaitPeriod",
    alarmNameSuffix: "SuppressedAlarmTestWaitPeriod",
    actionsSuppressor: suppressorAlarm,
    actionsSuppressorWaitPeriod: Duration.seconds(100),
  });
  factory.addCompositeAlarm([alarm1, alarm2], {
    disambiguator: "SuppressedAlarmTestBothExtensionAndWaitPeriod",
    alarmNameSuffix: "SuppressedAlarmTestBothExtensionAndWaitPeriod",
    actionsSuppressor: suppressorAlarm,
    actionsSuppressorExtensionPeriod: Duration.seconds(100),
    actionsSuppressorWaitPeriod: Duration.seconds(100),
  });

  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("addCompositeAlarm: actions suppressor extension period specified but no actions suppressor throws error", () => {
  expect(() => {
    factory.addCompositeAlarm([], {
      disambiguator: "CompositeAlarmExtensionPeriodSpecifiedNoSuppressorAlarm",
      alarmNameSuffix:
        "CompositeAlarmExtensionPeriodSpecifiedNoSuppressorAlarm",
      actionsSuppressorExtensionPeriod: Duration.seconds(100),
    });
  }).toThrow(Error);
});

test("addCompositeAlarm: actions suppressor wait period specified but no actions suppressor throws error", () => {
  expect(() => {
    factory.addCompositeAlarm([], {
      disambiguator: "CompositeAlarmWaitPeriodSpecifiedNoSuppressorAlarm",
      alarmNameSuffix: "CompositeAlarmWaitPeriodSpecifiedNoSuppressorAlarm",
      actionsSuppressorWaitPeriod: Duration.seconds(100),
    });
  }).toThrow(Error);
});

test("addCompositeAlarm: actions suppressor both extension and wait periods specified but no actions suppressor throws error", () => {
  expect(() => {
    factory.addCompositeAlarm([], {
      disambiguator:
        "CompositeAlarmBothExtensionAndWaitPeriodSpecifiedNoSuppressorAlarm",
      alarmNameSuffix:
        "CompositeAlarmBothExtensionAndWaitPeriodSpecifiedNoSuppressorAlarm",
      actionsSuppressorExtensionPeriod: Duration.seconds(100),
      actionsSuppressorWaitPeriod: Duration.seconds(100),
    });
  }).toThrow(Error);
});

test("addAlarm: original actionOverride with a different action gets preserved", () => {
  const originalActionOverride = new SnsAlarmActionStrategy({
    onAlarmTopic: new Topic(stack, "Dummy1"),
  });

  const alarm = factory.addAlarm(metric, {
    ...props,
    alarmNameSuffix: "OriginalActionOverridePreserved",
    actionOverride: originalActionOverride,
  });

  expect(alarm.action).toStrictEqual(originalActionOverride);
});

test("addAlarm: original actionOverride with multipleActions gets preserved", () => {
  const action1 = snsAction;
  const action2 = noopAction();

  const originalActionOverride = multipleActions(action1, action2);

  const alarm = factory.addAlarm(metric, {
    ...props,
    alarmNameSuffix: "OriginalActionOverridePreservedInMultipleActions",
    actionOverride: originalActionOverride,
  });

  expect(alarm.action).toStrictEqual(multipleActions(action1, action2));
});

test("addAlarm: disambigatorAction takes precedence over default action", () => {
  const stack = new Stack();
  const factory = new AlarmFactory(stack, {
    globalMetricDefaults,
    globalAlarmDefaults: globalAlarmDefaultsWithDisambiguator,
    localAlarmNamePrefix: "prefix",
  });
  const alarm = factory.addAlarm(metric, {
    ...props,
    disambiguator: "DisambiguatedAction",
  });

  expect(alarm.action).toStrictEqual(snsAction);
});

test("addAlarm: custom alarm naming strategy", () => {
  const alarmName = "alarmName";
  const alarmLabel = "alarmLabel";
  const alarmDedupe = "alarmDedupe";
  const disambiguator = "Critical";
  const stack = new Stack();
  const customNamingStrategy: IAlarmNamingStrategy = {
    getName: (props: AlarmNamingInput) =>
      `${alarmName}-${props.disambiguator}-${
        (props.action as SampleAlarmActionStrategy).prop
      }`,
    getWidgetLabel: (props: AlarmNamingInput) =>
      `${alarmLabel}-${props.disambiguator}-${
        (props.action as SampleAlarmActionStrategy).prop
      }`,
    getDedupeString: (props: AlarmNamingInput) =>
      `${alarmDedupe}-${props.disambiguator}-${
        (props.action as SampleAlarmActionStrategy).prop
      }`,
  };
  const factory = new AlarmFactory(stack, {
    globalMetricDefaults,
    globalAlarmDefaults: {
      ...globalAlarmDefaultsWithDisambiguator,
      alarmNamingStrategy: customNamingStrategy,
    },
    localAlarmNamePrefix: "prefix",
  });
  const action = sampleAction;
  const alarm = factory.addAlarm(metric, {
    ...props,
    disambiguator,
    actionOverride: action,
  });
  expect(alarm.alarmName).toBe(`${alarmName}-${disambiguator}-Sample`);
  expect(alarm.alarmLabel).toBe(`${alarmLabel}-${disambiguator}-Sample`);
  expect(alarm.dedupeString).toBe(`${alarmDedupe}-${disambiguator}-Sample`);
});

test("addAlarm: custom metric adjuster, applies it and DefaultMetricAdjuster after it", () => {
  const actual = factory.addAlarm(metric, {
    ...props,
    disambiguator: "AdjustMetric",
    metricAdjuster: {
      adjustMetric(metric) {
        return metric.with({
          label: "MyLabel (avg: ${AVG})",
          period: Duration.minutes(5),
        });
      },
    },
    period: Duration.minutes(10),
  });

  expect(actual.annotation.label).toEqual(
    "MyLabel < 10 for 10 datapoints within 100 minutes",
  );
  const cfnAlarm = actual.alarm.node.defaultChild as CfnAlarm;
  expect(cfnAlarm.metrics).toHaveLength(1);
  expect(
    (
      (cfnAlarm.metrics as CfnAlarm.MetricDataQueryProperty[])?.[0]
        ?.metricStat as CfnAlarm.MetricStatProperty
    )?.period,
  ).toEqual(Duration.minutes(10).toSeconds());
});
