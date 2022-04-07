import { Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { CfnWebACL } from "aws-cdk-lib/aws-wafv2";

import { WafV2Monitoring } from "../../../lib";
import { lintStack } from "../../utils/LintUtil";
import { addMonitoringDashboardsToStack } from "../../utils/SnapshotUtil";
import { TestMonitoringScope } from "../TestMonitoringScope";

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

  addMonitoringDashboardsToStack(stack, monitoring);
  lintStack(stack);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});
