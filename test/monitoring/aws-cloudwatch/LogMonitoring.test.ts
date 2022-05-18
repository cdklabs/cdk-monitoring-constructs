import { Stack } from "monocdk";
import { Template } from "monocdk/assertions";

import { LogMonitoring } from "../../../lib";
import { addMonitoringDashboardsToStack } from "../../utils/SnapshotUtil";
import { TestMonitoringScope } from "../TestMonitoringScope";

test("snapshot test", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const monitoring = new LogMonitoring(scope, {
    pattern: "DummyPattern",
    logGroupName: "DummyLogGroup",
    title: "DummyTitle",
  });

  addMonitoringDashboardsToStack(stack, monitoring);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot test: custom limit", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const monitoring = new LogMonitoring(scope, {
    pattern: "DummyPattern",
    logGroupName: "DummyLogGroup",
    limit: 500,
  });

  addMonitoringDashboardsToStack(stack, monitoring);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});
