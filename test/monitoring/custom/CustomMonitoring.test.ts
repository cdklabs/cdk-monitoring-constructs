import { Stack } from "monocdk";
import { Template } from "monocdk/assertions";
import {
  ComparisonOperator,
  MathExpression,
  Metric,
  Shading,
} from "monocdk/aws-cloudwatch";

import {
  AxisPosition,
  CustomMonitoring,
  MetricFactory,
  MetricStatistic,
} from "../../../lib";
import { TestMonitoringScope } from "../TestMonitoringScope";

const namespace = "DummyCustomNamespace";
const dimensions = { CustomDimension: "CustomDimensionValue" };

test("snapshot test", () => {
  const stack = new Stack();
  const scope = new TestMonitoringScope(stack, "Scope");

  let numAlarmsCreated = 0;

  new CustomMonitoring(scope, {
    alarmFriendlyName: "DummyAlarmName",
    humanReadableName: "DummyName",
    description:
      "This is a very long description.\nSecond line of this very long description.\nThird line of this very long description.",
    descriptionWidgetHeight: 2,
    metricGroups: [
      {
        title: "DummyGroup1",
        important: true,
        metrics: [
          // regular metric
          new Metric({ metricName: "DummyMetric1", namespace, dimensions }),
          // metric with alarm
          new Metric({ metricName: "DummyMetric2", namespace, dimensions }),
          {
            metric: new Metric({
              metricName: "DummyMetric3",
              namespace,
              dimensions,
            }),
            alarmFriendlyName: "AlarmForDummyMetric3",
            addAlarm: {
              Warning: {
                threshold: 90,
                comparisonOperator: ComparisonOperator.LESS_THAN_THRESHOLD,
              },
              Critical: {
                threshold: 50,
                comparisonOperator: ComparisonOperator.LESS_THAN_THRESHOLD,
              },
            },
          },
          // search metric
          {
            searchQuery: "DummyMetric4-",
            namespace,
            dimensions,
            statistic: MetricStatistic.SUM,
          },
        ],
      },
      {
        title: "DummyGroup2",
        metrics: [
          // regular metric
          new Metric({ metricName: "DummyMetric10", namespace, dimensions }),
          // metric with alarm
          new Metric({ metricName: "DummyMetric11", namespace, dimensions }),
          {
            metric: new Metric({
              metricName: "DummyMetric12",
              namespace,
              dimensions,
            }),
            alarmFriendlyName: "AlarmForDummyMetric12",
            addAlarm: {
              Warning: {
                threshold: 10,
                comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD,
              },
              Critical: {
                threshold: 50,
                comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD,
              },
            },
          },
        ],
        horizontalAnnotations: [
          { label: "DummyAnnotation1", value: 30, fill: Shading.ABOVE },
          { label: "DummyAnnotation2", value: 20, fill: Shading.BELOW },
        ],
      },
      {
        title: "DummyGroup3",
        metrics: [
          // regular metric
          new Metric({ metricName: "DummyMetric20", namespace, dimensions }),
          {
            alarmFriendlyName: "AlarmForDummyMetric21",
            metric: new Metric({
              metricName: "DummyMetric21",
              namespace,
              dimensions,
            }),
            addAlarm: {},
            position: AxisPosition.LEFT,
          },
          // metric with alarm
          // metric graphed on right hand side
          {
            metric: new Metric({
              metricName: "DummyMetric22",
              namespace,
              dimensions,
            }),
            alarmFriendlyName: "AlarmForDummyMetric22",
            addAlarm: {
              Warning: {
                threshold: 10,
                comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD,
              },
              Critical: {
                threshold: 50,
                comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD,
              },
            },
            position: AxisPosition.RIGHT,
          },
        ],
        graphWidgetRightAxis: {
          label: "CustomValue",
        },
        horizontalAnnotations: [
          { label: "DummyAnnotation1", value: 30, fill: Shading.ABOVE },
          { label: "DummyAnnotation2", value: 20, fill: Shading.BELOW },
        ],
        horizontalRightAnnotations: [
          { label: "DummyAnnotation3", value: 20, fill: Shading.BELOW },
        ],
      },
    ],
    useCreatedAlarms: {
      consume(alarms) {
        numAlarmsCreated = alarms.length;
      },
    },
  });

  expect(numAlarmsCreated).toStrictEqual(6);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("anomaly detection", () => {
  const stack = new Stack();
  const metricFactory = new MetricFactory({
    globalDefaults: {
      namespace: "AnomalyNamespace",
    },
  });

  const scope = new TestMonitoringScope(stack, "Scope");

  new CustomMonitoring(scope, {
    alarmFriendlyName: "AnomalyAlarmName",
    metricGroups: [
      {
        title: "AnomalyGroup1",
        metrics: [
          {
            metric: metricFactory.createMetricAnomalyDetection(
              new Metric({ metricName: "DummyMetric1", namespace, dimensions }),
              2,
              "AnomalyLabel",
              "blue",
              "expression"
            ),
            alarmFriendlyName: "Metric1",
            addAlarm: {
              Critical: {
                threshold: 50,
                comparisonOperator:
                  ComparisonOperator.LESS_THAN_LOWER_THRESHOLD,
              },
            },
          },
        ],
      },
    ],
  });

  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("enhanced anomaly detection", () => {
  const stack = new Stack();
  const scope = new TestMonitoringScope(stack, "Scope");

  new CustomMonitoring(scope, {
    alarmFriendlyName: "AnomalyAlarmName",
    metricGroups: [
      {
        title: "AnomalyGroup-OnlyRender",
        metrics: [
          {
            metric: new Metric({
              metricName: "AnomalyMetric",
              namespace: "AnomalyNamespace",
            }),
            alarmFriendlyName: "AnomalyGroup-OnlyRender",
            anomalyDetectionStandardDeviationToRender: 3,
          },
        ],
      },
      {
        title: "AnomalyGroup-RenderAndAlarm",
        metrics: [
          {
            metric: new Metric({
              metricName: "AnomalyMetric",
              namespace: "AnomalyNamespace",
            }),
            alarmFriendlyName: "AnomalyGroup-RenderAndAlarm",
            anomalyDetectionStandardDeviationToRender: 2,
            addAlarmOnAnomaly: {
              AboveOnly: {
                alarmWhenBelowTheBand: false,
                alarmWhenAboveTheBand: true,
                standardDeviationForAlarm: 1,
              },
              BelowOnly: {
                alarmWhenBelowTheBand: true,
                alarmWhenAboveTheBand: false,
                standardDeviationForAlarm: 2,
              },
              AboveOrBelow: {
                alarmWhenBelowTheBand: true,
                alarmWhenAboveTheBand: true,
                standardDeviationForAlarm: 3,
              },
            },
          },
        ],
      },
    ],
  });

  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("enhanced anomaly detection with more complex metric", () => {
  const stack = new Stack();
  const scope = new TestMonitoringScope(stack, "Scope");

  new CustomMonitoring(scope, {
    alarmFriendlyName: "AnomalyAlarmName",
    metricGroups: [
      {
        title: "AnomalyGroup-OnlyRender",
        metrics: [
          {
            metric: new Metric({
              metricName: "DNSQueries",
              namespace: "AWS/Route53",
              dimensions: {
                HostedZoneId: "ID",
              },
            }),
            alarmFriendlyName: "DNSQueries anomaly",
            anomalyDetectionStandardDeviationToRender: 1,
            addAlarmOnAnomaly: {
              CriticalAnomaly: {
                standardDeviationForAlarm: 1,
                alarmWhenBelowTheBand: true,
                alarmWhenAboveTheBand: true,
              },
            },
          },
        ],
      },
    ],
  });

  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("enhanced anomaly detection with metric math", () => {
  const stack = new Stack();
  const scope = new TestMonitoringScope(stack, "Scope");

  const m1 = new Metric({
    metricName: "Metric1",
    namespace: "AnomalyNamespace",
  });
  const m2 = new Metric({
    metricName: "Metric2",
    namespace: "AnomalyNamespace",
  });

  new CustomMonitoring(scope, {
    alarmFriendlyName: "AnomalyAlarmName",
    metricGroups: [
      {
        title: "AnomalyGroup-OnlyRender",
        metrics: [
          {
            metric: new MathExpression({
              expression: "m1/(m1+m2)",
              usingMetrics: { m1, m2 },
            }),
            alarmFriendlyName: "AnomalyWithMetricMath",
            anomalyDetectionStandardDeviationToRender: 1,
            addAlarmOnAnomaly: {
              CriticalAnomaly: {
                standardDeviationForAlarm: 1,
                alarmWhenBelowTheBand: true,
                alarmWhenAboveTheBand: true,
              },
            },
          },
        ],
      },
    ],
  });

  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("throws error if attempting to add alarm on a search query", () => {
  const stack = new Stack();
  const scope = new TestMonitoringScope(stack, "Scope");

  expect(
    () =>
      new CustomMonitoring(scope, {
        alarmFriendlyName: "DummyAlarmName",
        humanReadableName: "DummyName",
        description: "This is a very long description.",
        metricGroups: [
          {
            title: "DummyGroup1",
            important: true,
            metrics: [
              {
                searchQuery: "DummyMetric4-",
                namespace,
                dimensions,
                statistic: MetricStatistic.SUM,
                alarmFriendlyName: "AlarmForDummyMetric3",
                addAlarm: {
                  Warning: {
                    threshold: 90,
                    comparisonOperator: ComparisonOperator.LESS_THAN_THRESHOLD,
                  },
                  Critical: {
                    threshold: 50,
                    comparisonOperator: ComparisonOperator.LESS_THAN_THRESHOLD,
                  },
                },
              },
            ],
          },
        ],
      })
  ).toThrow("Alarming on search queries is not supported by CloudWatch");
});

test("throws error if attempting to add both a regular alarm and an anomoly detection alarm", () => {
  const stack = new Stack();
  const scope = new TestMonitoringScope(stack, "Scope");

  expect(
    () =>
      new CustomMonitoring(scope, {
        alarmFriendlyName: "DummyAlarmName",
        humanReadableName: "DummyName",
        description: "This is a very long description.",
        metricGroups: [
          {
            title: "DummyGroup1",
            important: true,
            metrics: [
              {
                metric: new Metric({
                  metricName: "DNSQueries",
                  namespace: "AWS/Route53",
                  dimensions: {
                    HostedZoneId: "ID",
                  },
                }),
                alarmFriendlyName: "DNSQueries anomaly",
                addAlarm: {
                  Warning: {
                    threshold: 90,
                    comparisonOperator: ComparisonOperator.LESS_THAN_THRESHOLD,
                  },
                },
                anomalyDetectionStandardDeviationToRender: 1,
                addAlarmOnAnomaly: {
                  CriticalAnomaly: {
                    standardDeviationForAlarm: 1,
                    alarmWhenBelowTheBand: true,
                    alarmWhenAboveTheBand: true,
                  },
                },
              },
            ],
          },
        ],
      })
  ).toThrow(
    "Adding both a regular alarm and an anomoly detection alarm at the same time is not supported"
  );
});
