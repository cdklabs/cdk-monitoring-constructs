import { Stack } from "monocdk";
import { Template } from "monocdk/assertions";

import { WafMonitoring } from "../../../lib";
import { TestMonitoringScope } from "../TestMonitoringScope";

test("snapshot test: no alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  new WafMonitoring(scope, { aclName: "DummyAcl" });

  expect(Template.fromStack(stack)).toMatchSnapshot();
});
