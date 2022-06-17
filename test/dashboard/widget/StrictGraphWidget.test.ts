import {
  HorizontalAnnotation,
  Metric,
  YAxisProps,
} from "aws-cdk-lib/aws-cloudwatch";
import { DoubleAxisGraphWidget, SingleAxisGraphWidget } from "../../../lib";

const DummyMetric1 = new Metric({ namespace: "Dummy", metricName: "Metric1" });
const DummyMetric2 = new Metric({ namespace: "Dummy", metricName: "Metric2" });
const DummyAxis1: YAxisProps = { min: 0, max: 1 };
const DummyAxis2: YAxisProps = { min: 100, max: 200 };
const DummyAnnotation1: HorizontalAnnotation = { value: 42 };
const DummyAnnotation2: HorizontalAnnotation = { value: 66 };

test("single axis - single metric: snapshot test", () => {
  const widget = new SingleAxisGraphWidget({
    title: "single axis - single metric",
    width: 4,
    height: 4,
    leftMetrics: [DummyMetric1],
    leftAnnotations: [DummyAnnotation1],
    leftAxis: DummyAxis1,
  });

  expect(widget.toJson()).toMatchSnapshot();
});

test("single axis - two metrics: snapshot test", () => {
  const widget = new SingleAxisGraphWidget({
    title: "single axis - two metrics",
    width: 4,
    height: 4,
    leftMetrics: [DummyMetric1, DummyMetric2],
    leftAnnotations: [DummyAnnotation1],
    leftAxis: DummyAxis1,
  });

  expect(widget.toJson()).toMatchSnapshot();
});

test("double axis - two metrics: snapshot test", () => {
  const widget = new DoubleAxisGraphWidget({
    title: "double axis - two metrics",
    width: 4,
    height: 4,
    leftMetrics: [DummyMetric1],
    leftAxis: DummyAxis1,
    leftAnnotations: [DummyAnnotation1],
    rightMetrics: [DummyMetric1],
    rightAxis: DummyAxis2,
    rightAnnotations: [DummyAnnotation2],
  });

  expect(widget.toJson()).toMatchSnapshot();
});

describe("failure test cases", () => {
  test("single axis - no metrics: error", () => {
    expect(
      () =>
        new SingleAxisGraphWidget({
          width: 4,
          height: 4,
          leftAxis: DummyAxis1,
          leftMetrics: [],
        })
    ).toThrowError();
  });

  test("double axis - no left metrics: error", () => {
    expect(
      () =>
        new DoubleAxisGraphWidget({
          width: 4,
          height: 4,
          leftAxis: DummyAxis1,
          leftMetrics: [],
          rightAxis: DummyAxis2,
          rightMetrics: [DummyMetric1],
        })
    ).toThrowError();
  });

  test("double axis - no right metrics: error", () => {
    expect(
      () =>
        new DoubleAxisGraphWidget({
          width: 4,
          height: 4,
          leftAxis: DummyAxis1,
          leftMetrics: [DummyMetric1],
          rightAxis: DummyAxis2,
          rightMetrics: [],
        })
    ).toThrowError();
  });
});
