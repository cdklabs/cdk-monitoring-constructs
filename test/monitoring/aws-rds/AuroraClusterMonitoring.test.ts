import { Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { DatabaseClusterEngine, ServerlessCluster } from "aws-cdk-lib/aws-rds";

import { AuroraClusterMonitoring } from "../../../lib";
import { addMonitoringDashboardsToStack } from "../../utils/SnapshotUtil";
import { TestMonitoringScope } from "../TestMonitoringScope";

test("snapshot test: no alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const auroraCluster = new ServerlessCluster(scope, "DummyAuroraCluster", {
    clusterIdentifier: "my-aurora-cluster",
    engine: DatabaseClusterEngine.AURORA_MYSQL,
  });

  const monitoring = new AuroraClusterMonitoring(scope, {
    alarmFriendlyName: "DummyAuroraCluster",
    cluster: auroraCluster,
  });

  addMonitoringDashboardsToStack(stack, monitoring);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot test: all alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const auroraCluster = new ServerlessCluster(scope, "DummyAuroraCluster", {
    clusterIdentifier: "my-aurora-cluster",
    engine: DatabaseClusterEngine.AURORA_MYSQL,
  });

  let numAlarmsCreated = 0;

  const monitoring = new AuroraClusterMonitoring(scope, {
    alarmFriendlyName: "DummyAuroraCluster",
    cluster: auroraCluster,
    addCpuUsageAlarm: {
      Warning: {
        maxUsagePercent: 80,
      },
    },
    addMaxConnectionCountAlarm: {
      Warning: {
        maxConnectionCount: 100,
      },
    },
    addMinConnectionCountAlarm: {
      Warning: {
        minConnectionCount: 0,
      },
    },
    addMaxServerlessDatabaseCapacityAlarm: {
      Warning: {
        maxUsageCount: 100,
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
