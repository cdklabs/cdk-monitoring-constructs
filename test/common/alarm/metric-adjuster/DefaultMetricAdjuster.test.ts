import { Duration, Stack } from "aws-cdk-lib";
import {
  ComparisonOperator,
  Metric,
  TreatMissingData,
} from "aws-cdk-lib/aws-cloudwatch";
import { DefaultMetricAdjuster } from "../../../../lib";

test("adjustMetric: applies default adjustments", () => {
  const actual = DefaultMetricAdjuster.INSTANCE.adjustMetric(
    new Metric({
      namespace: "MyNamespace",
      metricName: "MyMetric",
      label: "My (label) with (some ${text}) ${content}.",
      period: Duration.minutes(1),
    }),
    new Stack(),
    {
      alarmDescription: "",
      alarmNameSuffix: "",
      threshold: 0,
      comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD,
      treatMissingData: TreatMissingData.MISSING,
      period: Duration.minutes(5),
    }
  );

  expect(actual.period).toEqual(Duration.minutes(5));
  expect(actual.label).toBe("My (label) with ${content}.");
});
