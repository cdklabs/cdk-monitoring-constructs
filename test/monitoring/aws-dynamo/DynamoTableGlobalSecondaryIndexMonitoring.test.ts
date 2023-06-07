import { Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { AttributeType, Table } from "aws-cdk-lib/aws-dynamodb";

import {
  AlarmWithAnnotation,
  DynamoTableGlobalSecondaryIndexMonitoring,
} from "../../../lib";
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

  let numAlarmsCreated = 0;

  const monitoring = new DynamoTableGlobalSecondaryIndexMonitoring(scope, {
    table,
    globalSecondaryIndexName: "non-existing-index",
    useCreatedAlarms: {
      consume(alarms: AlarmWithAnnotation[]) {
        numAlarmsCreated = alarms.length;
      },
    },
  });

  addMonitoringDashboardsToStack(stack, monitoring);
  expect(numAlarmsCreated).toStrictEqual(0);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot test: all alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const table = new Table(stack, "Table", {
    tableName: "DummyTable",
    partitionKey: {
      name: "id",
      type: AttributeType.STRING,
    },
  });

  let numAlarmsCreated = 0;

  const monitoring = new DynamoTableGlobalSecondaryIndexMonitoring(scope, {
    table,
    globalSecondaryIndexName: "non-existing-index",
    addReadThrottledEventsCountAlarm: {
      Warning: {
        maxThrottledEventsThreshold: 5,
      },
    },
    addWriteThrottledEventsCountAlarm: {
      Warning: {
        maxThrottledEventsThreshold: 5,
      },
    },
    useCreatedAlarms: {
      consume(alarms: AlarmWithAnnotation[]) {
        numAlarmsCreated = alarms.length;
      },
    },
  });

  addMonitoringDashboardsToStack(stack, monitoring);
  expect(numAlarmsCreated).toStrictEqual(2);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});
