import { SynthUtils } from "@monocdk-experiment/assert";
import { Stack } from "monocdk";

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

  expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});

test("snapshot test: custom limit", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  new LogMonitoring(scope, {
    pattern: "DummyPattern",
    logGroupName: "DummyLogGroup",
    limit: 500,
  });

  expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});
