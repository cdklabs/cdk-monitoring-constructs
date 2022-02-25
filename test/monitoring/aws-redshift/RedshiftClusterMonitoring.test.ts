import { SynthUtils } from "@monocdk-experiment/assert";
import { Stack } from "monocdk";

import { RdsClusterMonitoring } from "../../../lib";
import { TestMonitoringScope } from "../TestMonitoringScope";

test("snapshot test: no alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  new RdsClusterMonitoring(scope, {
    alarmFriendlyName: "DummyRedshiftCluster",
    clusterIdentifier: "my-redshift-cluster",
  });

  expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});

test("snapshot test: all alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  let numAlarmsCreated = 0;

  new RdsClusterMonitoring(scope, {
    clusterIdentifier: "my-redshift-cluster",
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
