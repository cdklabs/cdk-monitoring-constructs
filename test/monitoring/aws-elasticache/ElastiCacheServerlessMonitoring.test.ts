import { Duration, Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";

import {
  AlarmWithAnnotation,
  ElastiCacheServerlessMonitoring,
} from "../../../lib";
import { TestMonitoringScope } from "../TestMonitoringScope";

const DummyClusterId = "DummyClusterId";

test("snapshot test: no alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  new ElastiCacheServerlessMonitoring(scope, {});

  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot test: all alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  let numAlarmsCreated = 0;

  new ElastiCacheServerlessMonitoring(scope, {
    addTM99SuccessfulReadRequestLatencyAlarm: {
      Warning: { maxLatency: Duration.millis(1) },
    },
    addAverageSuccessfulReadRequestLatencyAlarm: {
      Warning: { maxLatency: Duration.millis(1) },
    },
    addTM99SuccessfulWriteRequestLatencyAlarm: {
      Warning: { maxLatency: Duration.millis(1) },
    },
    addAverageSuccessfulWriteRequestLatencyAlarm: {
      Warning: { maxLatency: Duration.millis(1) },
    },
    addThrottleRateAlarm: { Warning: { maxThrottleRatePercent: 10 } },
    addHitRateAlarm: { Warning: { minHitRatePercent: 80 } },
    useCreatedAlarms: {
      consume(alarms: AlarmWithAnnotation[]) {
        numAlarmsCreated = alarms.length;
      },
    },
  });

  expect(numAlarmsCreated).toStrictEqual(6);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot test: cluster ID specified", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  new ElastiCacheServerlessMonitoring(scope, {
    clusterId: DummyClusterId,
    humanReadableName: DummyClusterId,
    alarmFriendlyName: DummyClusterId,
  });

  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("widgets: summaryWidgets", () => {
  const stack = new Stack();
  const scope = new TestMonitoringScope(stack, "Scope");
  const monitoring = new ElastiCacheServerlessMonitoring(scope, {});
  const widgets = monitoring.summaryWidgets();
  expect(widgets.length).toBeGreaterThan(0);
});

test("widgets: widgets", () => {
  const stack = new Stack();
  const scope = new TestMonitoringScope(stack, "Scope");
  const monitoring = new ElastiCacheServerlessMonitoring(scope, {});
  const widgets = monitoring.widgets();
  expect(widgets.length).toBeGreaterThan(0);
});
