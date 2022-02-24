import { SynthUtils } from "@monocdk-experiment/assert";
import { Stack } from "monocdk";

import { GlueJobMonitoring } from "../../../lib";
import { TestMonitoringScope } from "../TestMonitoringScope";

test("snapshot test", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  new GlueJobMonitoring(scope, {
    jobName: "DummyGlueJob",
  });

  expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});
