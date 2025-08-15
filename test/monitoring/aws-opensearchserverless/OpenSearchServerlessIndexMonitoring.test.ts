import { Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { CfnCollection } from "aws-cdk-lib/aws-opensearchserverless";

import { OpenSearchServerlessIndexMonitoring } from "../../../lib";
import { addMonitoringDashboardsToStack } from "../../utils/SnapshotUtil";
import { TestMonitoringScope } from "../TestMonitoringScope";

test("snapshot test: no alarms", () => {
  const stack = new Stack();
  const scope = new TestMonitoringScope(stack, "Scope");

  const collection = new CfnCollection(stack, "Collection", {
    name: "TestCollection",
  });

  const monitoring = new OpenSearchServerlessIndexMonitoring(scope, {
    collection,
    indexId: "IndexId",
    indexName: "IndexName",
  });

  addMonitoringDashboardsToStack(stack, monitoring);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});
