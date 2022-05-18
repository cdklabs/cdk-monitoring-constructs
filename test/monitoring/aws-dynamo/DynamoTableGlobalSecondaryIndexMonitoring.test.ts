import { Stack } from "monocdk";
import { Template } from "monocdk/assertions";
import { AttributeType, Table } from "monocdk/aws-dynamodb";

import { DynamoTableGlobalSecondaryIndexMonitoring } from "../../../lib";
import { addMonitoringDashboardsToStack } from "../../utils/SnapshotUtil";
import { TestMonitoringScope } from "../TestMonitoringScope";

test("snapshot test: no alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const table = new Table(stack, "Table", {
    tableName: "DummyTable",
    partitionKey: {
      name: "id",
      type: AttributeType.STRING,
    },
  });

  const monitoring = new DynamoTableGlobalSecondaryIndexMonitoring(scope, {
    table,
    globalSecondaryIndexName: "non-existing-index",
  });

  addMonitoringDashboardsToStack(stack, monitoring);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});
