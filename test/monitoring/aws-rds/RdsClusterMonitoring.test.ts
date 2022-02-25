import { SynthUtils } from "@monocdk-experiment/assert";
import { Stack } from "monocdk";

import { RdsClusterMonitoring } from "../../../lib";
import { TestMonitoringScope } from "../TestMonitoringScope";

test("snapshot test: no alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  new RdsClusterMonitoring(scope, {
    alarmFriendlyName: "DummyRdsCluster",
    clusterIdentifier: "my-rds-cluster",
  });

  expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});

test("snapshot test: all alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  let numAlarmsCreated = 0;

  new RdsClusterMonitoring(scope, {
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
    useCreatedAlarms: {
      consume(alarms) {
        numAlarmsCreated = alarms.length;
      },
    },
  });

  expect(numAlarmsCreated).toStrictEqual(2);
  expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});
