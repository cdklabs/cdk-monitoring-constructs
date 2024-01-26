import { Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { Vpc } from "aws-cdk-lib/aws-ec2";
import { DatabaseInstance, DatabaseInstanceEngine } from "aws-cdk-lib/aws-rds";

import { RdsInstanceMonitoring } from "../../../lib";
import { addMonitoringDashboardsToStack } from "../../utils/SnapshotUtil";
import { TestMonitoringScope } from "../TestMonitoringScope";

function createRdsInstance() {
  const stack = new Stack();
  const vpc = new Vpc(stack, "Vpc");
  const instance = new DatabaseInstance(stack, "DatabaseInstance", {
    instanceIdentifier: "my-rds-instance",
    engine: DatabaseInstanceEngine.MYSQL,
    vpc: vpc,
  });
  return { instance, stack };
}

test.each([createRdsInstance])("snapshot test: no alarms - %#", (factory) => {
  const { stack, instance } = factory();

  const scope = new TestMonitoringScope(stack, "Scope");
  const monitoring = new RdsInstanceMonitoring(scope, {
    alarmFriendlyName: "DummyRdsInstance",
    instance: instance,
  });

  addMonitoringDashboardsToStack(stack, monitoring);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test.each([createRdsInstance])("snapshot test: all alarms - %#", (factory) => {
  const { stack, instance } = factory();

  const scope = new TestMonitoringScope(stack, "Scope");

  let numAlarmsCreated = 0;

  const monitoring = new RdsInstanceMonitoring(scope, {
    instance: instance,
    addDiskSpaceUsageAlarm: {
      Warning: {
        maxUsagePercent: 80,
      },
    },
    addCpuUsageAlarm: {
      Warning: {
        maxUsagePercent: 70,
      },
    },
    addMinConnectionCountAlarm: {
      Warning: {
        minConnectionCount: 1,
      },
    },
    addMaxConnectionCountAlarm: {
      Warning: {
        maxConnectionCount: 100,
      },
    },
    useCreatedAlarms: {
      consume(alarms) {
        numAlarmsCreated = alarms.length;
      },
    },
  });

  addMonitoringDashboardsToStack(stack, monitoring);
  expect(numAlarmsCreated).toStrictEqual(4);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});
