import { Stack } from "aws-cdk-lib";
import {
  ComparisonOperator,
  Metric,
  TreatMissingData,
} from "aws-cdk-lib/aws-cloudwatch";
import { AddAlarmProps, CompositeMetricAdjuster } from "../../../../lib";

const metric = new Metric({
  namespace: "MyNamespace",
  metricName: "MyMetric",
  label: "Hello",
});

const alarmScope = new Stack();

const props: AddAlarmProps = {
  alarmDescription: "",
  alarmNameSuffix: " World",
  threshold: 0,
  comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD,
  treatMissingData: TreatMissingData.MISSING,
};

test("adjustMetric: no metric adjustments, returns untouched metric", () => {
  const metricAdjuster = CompositeMetricAdjuster.of();

  const actual = metricAdjuster.adjustMetric(metric, alarmScope, props);

  expect(actual).toBe(metric);
});

test("adjustMetric: with metric adjustments, applies metric adjustments in specified order", () => {
  const metricAdjuster = CompositeMetricAdjuster.of(
    {
      adjustMetric(metric, _, props) {
        return metric.with({ label: metric.label + props.alarmNameSuffix });
      },
    },
    {
      adjustMetric(metric) {
        return metric.with({ label: metric.label + "!" });
      },
    },
  );

  const actual = metricAdjuster.adjustMetric(metric, alarmScope, props);

  expect(actual).not.toBe(metric);
  expect(actual.label).toEqual("Hello World!");
});
