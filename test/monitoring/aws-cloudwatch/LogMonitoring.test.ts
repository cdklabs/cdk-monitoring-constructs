import { Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { TreatMissingData } from "aws-cdk-lib/aws-cloudwatch";

import { LogMonitoring } from "../../../lib";
import { addMonitoringDashboardsToStack } from "../../utils/SnapshotUtil";
import { TestMonitoringScope } from "../TestMonitoringScope";

test("snapshot test", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const monitoring = new LogMonitoring(scope, {
    logGroupName: "DummyLogGroup",
    pattern: "DummyPattern",
    title: "DummyTitle",
  });

  addMonitoringDashboardsToStack(stack, monitoring);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot test: custom limit", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const monitoring = new LogMonitoring(scope, {
    logGroupName: "DummyLogGroup",
    pattern: "DummyPattern",
    limit: 500,
  });

  addMonitoringDashboardsToStack(stack, monitoring);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot test: no pattern", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const monitoring = new LogMonitoring(scope, {
    logGroupName: "DummyLogGroup",
  });

  addMonitoringDashboardsToStack(stack, monitoring);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot test: with alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  let numAlarmsCreated = 0;

  const monitoring = new LogMonitoring(scope, {
    logGroupName: "DummyLogGroup",
    pattern: "DummyPattern",
    addMinIncomingLogsAlarm: {
      Warning: {
        minCount: 20,
        treatMissingDataOverride: TreatMissingData.BREACHING,
      },
    },
    addMaxIncomingLogsAlarm: {
      Critical: {
        maxCount: 9001,
      },
    },
    useCreatedAlarms: {
      consume(alarms) {
        numAlarmsCreated = alarms.length;
      },
    },
  });

  addMonitoringDashboardsToStack(stack, monitoring);
  expect(numAlarmsCreated).toStrictEqual(2);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});
