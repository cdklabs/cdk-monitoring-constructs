import { Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";

import { DocumentDbMonitoring } from "../../../lib";
import { addMonitoringDashboardsToStack } from "../../utils/SnapshotUtil";
import { TestMonitoringScope } from "../TestMonitoringScope";

test("snapshot test: no alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const monitoring = new DocumentDbMonitoring(scope, {
    alarmFriendlyName: "DummyDocDbCluster",
    clusterIdentifier: "my-docdb-cluster",
  });

  addMonitoringDashboardsToStack(stack, monitoring);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot test: all alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  let numAlarmsCreated = 0;

  const monitoring = new DocumentDbMonitoring(scope, {
    clusterIdentifier: "my-docdb-cluster",
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

  addMonitoringDashboardsToStack(stack, monitoring);
  expect(numAlarmsCreated).toStrictEqual(1);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});
