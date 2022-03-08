import { Stack } from "monocdk";
import { Template } from "monocdk/assertions";

import { GlueJobMonitoring } from "../../../lib";
import { TestMonitoringScope } from "../TestMonitoringScope";

test("snapshot test", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  new GlueJobMonitoring(scope, {
    jobName: "DummyGlueJob",
  });

  expect(Template.fromStack(stack)).toMatchSnapshot();
});
