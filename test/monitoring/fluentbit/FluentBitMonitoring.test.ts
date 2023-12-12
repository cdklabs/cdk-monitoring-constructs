import { Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { LogGroup } from "aws-cdk-lib/aws-logs";
import { FluentBitMonitoring } from "../../../lib";
import { addMonitoringDashboardsToStack } from "../../utils/SnapshotUtil";
import { TestMonitoringScope } from "../TestMonitoringScope";

test("snapshot test without all filters", () => {
  const stack = new Stack();
  const scope = new TestMonitoringScope(stack, "Scope");
  const logGroup = new LogGroup(stack, "DummyLogGroup");
  const monitoring = new FluentBitMonitoring(scope, {
    logGroup,
    namespace: "DummyNamespace",
  });

  addMonitoringDashboardsToStack(stack, monitoring);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot test with all filters", () => {
  const stack = new Stack();
  const scope = new TestMonitoringScope(stack, "Scope");
  const logGroup = new LogGroup(stack, "DummyLogGroup");
  const monitoring = new FluentBitMonitoring(scope, {
    logGroup,
    namespace: "DummyNamespace",
    createOptionalMetricFilters: true,
  });

  addMonitoringDashboardsToStack(stack, monitoring);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});
