import { Duration, Stack } from "aws-cdk-lib";
import {
  Alarm,
  ComparisonOperator,
  Metric,
  TreatMissingData,
} from "aws-cdk-lib/aws-cloudwatch";

import {
  AlarmAnnotationStrategyProps,
  DefaultAlarmAnnotationStrategy,
  noopAction,
} from "../../../lib";

function createTestAnnotation(comparisonOperator: ComparisonOperator) {
  const stack = new Stack();
  const metric = new Metric({
    namespace: "DummyNamespace",
    metricName: "DummyMetric",
    period: Duration.minutes(5),
  });
  const alarm = new Alarm(stack, "DummyAlarm", {
    metric,
    threshold: 10,
    comparisonOperator,
    evaluationPeriods: 3,
    datapointsToAlarm: 3,
    treatMissingData: TreatMissingData.MISSING,
  });
  const props: AlarmAnnotationStrategyProps = {
    action: noopAction(),
    alarm,
    comparisonOperator,
    datapointsToAlarm: 3,
    evaluationPeriods: 3,
    fillAlarmRange: false,
    metric,
    threshold: 10,
  };
  return new DefaultAlarmAnnotationStrategy().createAnnotation(props);
}

test.each([
  [ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD, "≥"],
  [ComparisonOperator.LESS_THAN_OR_EQUAL_TO_THRESHOLD, "≤"],
  [ComparisonOperator.GREATER_THAN_THRESHOLD, ">"],
  [ComparisonOperator.LESS_THAN_THRESHOLD, "<"],
])("annotation label for %s uses the %s glyph", (operator, glyph) => {
  const annotation = createTestAnnotation(operator);
  expect(annotation.label).toContain(` ${glyph} 10`);
});

test("annotation label does not contain two-character ASCII operators", () => {
  const annotation = createTestAnnotation(
    ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
  );
  expect(annotation.label).not.toContain(">=");
});
