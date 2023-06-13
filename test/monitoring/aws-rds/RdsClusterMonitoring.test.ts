import { Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";

import { RdsClusterMonitoring } from "../../../lib";
import { addMonitoringDashboardsToStack } from "../../utils/SnapshotUtil";
import { TestMonitoringScope } from "../TestMonitoringScope";

test("snapshot test: no alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const monitoring = new RdsClusterMonitoring(scope, {
    alarmFriendlyName: "DummyRdsCluster",
    clusterIdentifier: "my-rds-cluster",
  });

  addMonitoringDashboardsToStack(stack, monitoring);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot test: all alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  let numAlarmsCreated = 0;

  const monitoring = new RdsClusterMonitoring(scope, {
    clusterIdentifier: "my-rds-cluster",
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
