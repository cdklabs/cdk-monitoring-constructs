import { Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";

import { KinesisFirehoseMonitoring } from "../../../lib";
import { addMonitoringDashboardsToStack } from "../../utils/SnapshotUtil";
import { TestMonitoringScope } from "../TestMonitoringScope";

test("snapshot test: no alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const monitoring = new KinesisFirehoseMonitoring(scope, {
    deliveryStreamName: "my-firehose-delivery-stream",
  });

  addMonitoringDashboardsToStack(stack, monitoring);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot test: all alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  let numAlarmsCreated = 0;

  const monitoring = new KinesisFirehoseMonitoring(scope, {
    deliveryStreamName: "my-firehose-delivery-stream",
    addRecordsThrottledAlarm: {
      Critical: {
        maxRecordsThrottledThreshold: 5,
      },
    },
    useCreatedAlarms: {
      consume(alarms) {
        numAlarmsCreated = alarms.length;
      },
    },
  });

  addMonitoringDashboardsToStack(stack, monitoring);
  expect(numAlarmsCreated).toStrictEqual(1);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});
