import { Stack } from "monocdk";
import { Template } from "monocdk/assertions";
import { CfnWebACL } from "monocdk/aws-wafv2";

import { WafV2Monitoring } from "../../../lib";
import { TestMonitoringScope } from "../TestMonitoringScope";
import { expectWidgetsToMatchSnapshot } from "../TestSnapshotUtil";

test("snapshot test: no alarms", () => {
  const stack = new Stack();
  const acl = new CfnWebACL(stack, "DummyAcl", {
    defaultAction: { allow: {} },
    scope: "REGIONAL",
    visibilityConfig: {
      sampledRequestsEnabled: true,
      cloudWatchMetricsEnabled: true,
      metricName: "DummyMetricName",
    },
  });

  const scope = new TestMonitoringScope(stack, "Scope");

  const monitoring = new WafV2Monitoring(scope, { acl });

  expect(Template.fromStack(stack)).toMatchSnapshot();
  expectWidgetsToMatchSnapshot(monitoring);
});
