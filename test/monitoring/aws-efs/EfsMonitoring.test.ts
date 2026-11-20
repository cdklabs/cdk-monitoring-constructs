import { Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { Vpc } from "aws-cdk-lib/aws-ec2";
import { FileSystem } from "aws-cdk-lib/aws-efs";

import { EfsMonitoring } from "../../../lib";
import { addMonitoringDashboardsToStack } from "../../utils/SnapshotUtil";
import { TestMonitoringScope } from "../TestMonitoringScope";

test("snapshot test: no alarms", () => {
  const stack = new Stack();
  const scope = new TestMonitoringScope(stack, "Scope");
  const fileSystem = new FileSystem(stack, "DummyFileSystem", {
    vpc: new Vpc(stack, "Vpc"),
  });

  const monitoring = new EfsMonitoring(scope, {
    alarmFriendlyName: "DummyFileSystem",
    fileSystem,
  });

  addMonitoringDashboardsToStack(stack, monitoring);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot test: all alarms", () => {
  const stack = new Stack();
  const scope = new TestMonitoringScope(stack, "Scope");
  const fileSystem = new FileSystem(stack, "DummyFileSystem", {
    vpc: new Vpc(stack, "Vpc"),
  });

  let numAlarmsCreated = 0;

  const monitoring = new EfsMonitoring(scope, {
    fileSystem,
    addThroughputUtilizationAlarm: {
      Warning: { maxUsagePercent: 75 },
    },
    addIOLimitUtilizationAlarm: {
      Warning: { maxUsagePercent: 90 },
    },
    useCreatedAlarms: {
      consume(alarms) {
        numAlarmsCreated = alarms.length;
      },
    },
  });

  addMonitoringDashboardsToStack(stack, monitoring);
  expect(numAlarmsCreated).toStrictEqual(2);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});
