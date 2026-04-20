import { Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";

import { KinesisDataStreamConsumerMonitoring } from "../../../lib";
import { addMonitoringDashboardsToStack } from "../../utils/SnapshotUtil";
import { TestMonitoringScope } from "../TestMonitoringScope";

test("snapshot test for consumer: no alarms", () => {
  const stack = new Stack();
  const scope = new TestMonitoringScope(stack, "Scope");

  const monitoring = new KinesisDataStreamConsumerMonitoring(scope, {
    streamName: "my-kinesis-data-stream",
    consumerName: "my-consumer",
  });

  addMonitoringDashboardsToStack(stack, monitoring);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot test for consumer: all alarms", () => {
  const stack = new Stack();
  const scope = new TestMonitoringScope(stack, "Scope");

  let numAlarmsCreated = 0;

  const monitoring = new KinesisDataStreamConsumerMonitoring(scope, {
    streamName: "my-kinesis-data-stream",
    consumerName: "my-consumer",
    addConsumerIteratorMaxAgeAlarm: {
      Warning: {
        maxAgeInMillis: 60_000,
      },
    },
    addConsumerSubscribeToShardRateExceededAlarm: {
      Critical: {
        maxRateExceeded: 0.1,
      },
    },
    addConsumerSubscribeToShardSuccessAlarm: {
      Critical: {
        minSuccessRate: 0.99,
      },
    },
    useCreatedAlarms: {
      consume(alarms) {
        numAlarmsCreated = alarms.length;
      },
    },
  });

  expect(numAlarmsCreated).toStrictEqual(3);
  addMonitoringDashboardsToStack(stack, monitoring);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});
