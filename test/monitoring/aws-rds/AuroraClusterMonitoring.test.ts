import { Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { InstanceType, SubnetType, Vpc } from "aws-cdk-lib/aws-ec2";
import {
  AuroraMysqlEngineVersion,
  DatabaseCluster,
  DatabaseClusterEngine,
  ServerlessCluster,
} from "aws-cdk-lib/aws-rds";

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

test("RDS passed into Aurora Cluster", () => {
  const testGuard = () => {
    const stack = new Stack();
    const scope = new TestMonitoringScope(stack, "Scope");
    const vpc = new Vpc(scope, "DummyVpc", {
      maxAzs: 3,
    });
    const rdsCluster = new DatabaseCluster(scope, "DummyRdsCluster", {
      engine: DatabaseClusterEngine.auroraMysql({
        version: AuroraMysqlEngineVersion.VER_2_07_5,
      }),
      instanceProps: {
        instanceType: new InstanceType("t3.small"),
        vpcSubnets: {
          subnetType: SubnetType.PUBLIC,
        },
        vpc,
      },
    });

    new AuroraClusterMonitoring(scope, {
      alarmFriendlyName: "DummyAuroraCluster",
      cluster: rdsCluster,
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
    });
  };

  expect(testGuard).toThrow(Error);
  expect(testGuard).toThrow(
    "Cluster is not of type `ServerlessCluster`. Monitoring is not applicable.",
  );
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
