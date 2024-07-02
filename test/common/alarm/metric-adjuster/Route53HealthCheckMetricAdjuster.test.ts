import { Duration, Stack } from "aws-cdk-lib";
import {
  CfnAlarm,
  ComparisonOperator,
  MathExpression,
  Metric,
  TreatMissingData,
  Unit,
} from "aws-cdk-lib/aws-cloudwatch";
import {
  AddAlarmProps,
  MetricStatistic,
  Route53HealthCheckMetricAdjuster,
} from "../../../../lib";

const metric = new Metric({
  account: "MyAccount",
  color: "MyColor",
  dimensionsMap: { foo: "bar" },
  label: "MyLabel",
  metricName: "MyMetric",
  namespace: "MyNamespace",
  period: Duration.hours(1),
  region: "MyRegion",
  statistic: MetricStatistic.AVERAGE,
  unit: Unit.COUNT,
});

const alarmScope = new Stack(undefined, undefined, {
  env: { account: "MyAccount" },
});

const props: AddAlarmProps = {
  alarmDescription: "",
  alarmNameSuffix: " World",
  threshold: 0,
  comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD,
  treatMissingData: TreatMissingData.MISSING,
};

test("adjustMetric: with minMetricSamplesToAlarm, throws error", () => {
  expect(() =>
    Route53HealthCheckMetricAdjuster.INSTANCE.adjustMetric(metric, alarmScope, {
      ...props,
      minMetricSamplesToAlarm: 1,
    }),
  ).toThrow("Alarms with 'minMetricSamplesToAlarm' are not supported.");
});

test("adjustMetric: with MathExpression, throws error", () => {
  expect(() =>
    Route53HealthCheckMetricAdjuster.INSTANCE.adjustMetric(
      new MathExpression({ expression: "expr" }),
      alarmScope,
      props,
    ),
  ).toThrow("The specified metric must be a Metric instance.");
});

test("adjustMetric: with cross-account metric, throws error", () => {
  expect(() =>
    Route53HealthCheckMetricAdjuster.INSTANCE.adjustMetric(
      metric.with({ account: "MyOtherAccount" }),
      alarmScope,
      props,
    ),
  ).toThrow("Cross-account metrics are not supported.");
});

test("adjustMetric: with unsupported statistic, throws error", () => {
  expect(() =>
    Route53HealthCheckMetricAdjuster.INSTANCE.adjustMetric(
      metric.with({ statistic: MetricStatistic.P99 }),
      alarmScope,
      props,
    ),
  ).toThrow("Metrics with statistic 'p99' are not supported.");
});

test("adjustMetric: removes label so alarms created from it don't have metrics property set", () => {
  const actual = Route53HealthCheckMetricAdjuster.INSTANCE.adjustMetric(
    metric,
    alarmScope,
    props,
  ) as Metric;

  expect(actual).not.toBe(metric);
  expect(actual).toBeInstanceOf(Metric);
  const { label: actualLabel, ...actualRest } = actual;
  const { label: _, ...expectedRest } = metric; // eslint-disable-line @typescript-eslint/no-unused-vars
  expect(actualLabel).toBeUndefined();
  expect(actualRest).toEqual(expectedRest);

  const cfnAlarm = actual.createAlarm(alarmScope, "Id", {
    evaluationPeriods: 1,
    threshold: 1,
  }).node.defaultChild as CfnAlarm;

  expect(cfnAlarm).not.toBeUndefined();
  expect(cfnAlarm.extendedStatistic).toBeUndefined();
  expect(cfnAlarm.metrics).toBeUndefined();
  expect(cfnAlarm.metricName).not.toBeUndefined();
  expect(cfnAlarm.statistic).not.toBeUndefined();
});
