import { SynthUtils } from "@monocdk-experiment/assert";
import { Stack } from "monocdk";

import { BillingMonitoring } from "../../../lib";
import { TestMonitoringScope } from "../TestMonitoringScope";

test("snapshot test", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  new BillingMonitoring(scope, {});

  expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});
