import { Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";

import { LogMonitoring } from "../../../lib";
import { TestMonitoringScope } from "../TestMonitoringScope";

test("snapshot test", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  new LogMonitoring(scope, {
    pattern: "DummyPattern",
    logGroupName: "DummyLogGroup",
    title: "DummyTitle",
  });

  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot test: custom limit", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  new LogMonitoring(scope, {
    pattern: "DummyPattern",
    logGroupName: "DummyLogGroup",
    limit: 500,
  });

  expect(Template.fromStack(stack)).toMatchSnapshot();
});
