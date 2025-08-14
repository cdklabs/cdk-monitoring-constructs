import { Duration, Stack } from "aws-cdk-lib";
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
    addReadIOPSAlarm: {
      Warning: {
        maxCount: 1000,
      },
    },
    addWriteIOPSAlarm: {
      Warning: {
        maxCount: 500,
      },
    },
    addSelectLatencyP50Alarm: {
      Warning: {
        maxLatency: Duration.seconds(1),
      },
    },
    addSelectLatencyP70Alarm: {
      Warning: {
        maxLatency: Duration.seconds(1),
      },
    },
    addSelectLatencyP90Alarm: {
      Warning: {
        maxLatency: Duration.seconds(1),
      },
    },
    addSelectLatencyP95Alarm: {
      Warning: {
        maxLatency: Duration.seconds(1),
      },
    },
    addSelectLatencyP99Alarm: {
      Warning: {
        maxLatency: Duration.seconds(1),
      },
    },
    addSelectLatencyP999Alarm: {
      Warning: {
        maxLatency: Duration.seconds(1),
      },
    },
    addSelectLatencyP9999Alarm: {
      Warning: {
        maxLatency: Duration.seconds(1),
      },
    },
    addSelectLatencyP100Alarm: {
      Warning: {
        maxLatency: Duration.seconds(1),
      },
    },
    addSelectLatencyAverageAlarm: {
      Warning: {
        maxLatency: Duration.seconds(1),
      },
    },
    addInsertLatencyP50Alarm: {
      Warning: {
        maxLatency: Duration.seconds(2),
      },
    },
    addInsertLatencyP70Alarm: {
      Warning: {
        maxLatency: Duration.seconds(2),
      },
    },
    addInsertLatencyP90Alarm: {
      Warning: {
        maxLatency: Duration.seconds(2),
      },
    },
    addInsertLatencyP95Alarm: {
      Warning: {
        maxLatency: Duration.seconds(2),
      },
    },
    addInsertLatencyP99Alarm: {
      Warning: {
        maxLatency: Duration.seconds(2),
      },
    },
    addInsertLatencyP999Alarm: {
      Warning: {
        maxLatency: Duration.seconds(2),
      },
    },
    addInsertLatencyP9999Alarm: {
      Warning: {
        maxLatency: Duration.seconds(2),
      },
    },
    addInsertLatencyP100Alarm: {
      Warning: {
        maxLatency: Duration.seconds(2),
      },
    },
    addInsertLatencyAverageAlarm: {
      Warning: {
        maxLatency: Duration.seconds(2),
      },
    },
    addUpdateLatencyP50Alarm: {
      Warning: {
        maxLatency: Duration.seconds(2),
      },
    },
    addUpdateLatencyP70Alarm: {
      Warning: {
        maxLatency: Duration.seconds(2),
      },
    },
    addUpdateLatencyP90Alarm: {
      Warning: {
        maxLatency: Duration.seconds(2),
      },
    },
    addUpdateLatencyP95Alarm: {
      Warning: {
        maxLatency: Duration.seconds(2),
      },
    },
    addUpdateLatencyP99Alarm: {
      Warning: {
        maxLatency: Duration.seconds(2),
      },
    },
    addUpdateLatencyP999Alarm: {
      Warning: {
        maxLatency: Duration.seconds(2),
      },
    },
    addUpdateLatencyP9999Alarm: {
      Warning: {
        maxLatency: Duration.seconds(2),
      },
    },
    addUpdateLatencyP100Alarm: {
      Warning: {
        maxLatency: Duration.seconds(2),
      },
    },
    addUpdateLatencyAverageAlarm: {
      Warning: {
        maxLatency: Duration.seconds(2),
      },
    },
    addDeleteLatencyP50Alarm: {
      Warning: {
        maxLatency: Duration.seconds(1),
      },
    },
    addDeleteLatencyP70Alarm: {
      Warning: {
        maxLatency: Duration.seconds(1),
      },
    },
    addDeleteLatencyP90Alarm: {
      Warning: {
        maxLatency: Duration.seconds(1),
      },
    },
    addDeleteLatencyP95Alarm: {
      Warning: {
        maxLatency: Duration.seconds(1),
      },
    },
    addDeleteLatencyP99Alarm: {
      Warning: {
        maxLatency: Duration.seconds(1),
      },
    },
    addDeleteLatencyP999Alarm: {
      Warning: {
        maxLatency: Duration.seconds(1),
      },
    },
    addDeleteLatencyP9999Alarm: {
      Warning: {
        maxLatency: Duration.seconds(1),
      },
    },
    addDeleteLatencyP100Alarm: {
      Warning: {
        maxLatency: Duration.seconds(1),
      },
    },
    addDeleteLatencyAverageAlarm: {
      Warning: {
        maxLatency: Duration.seconds(1),
      },
    },
    addCommitLatencyP50Alarm: {
      Warning: {
        maxLatency: Duration.seconds(1),
      },
    },
    addCommitLatencyP70Alarm: {
      Warning: {
        maxLatency: Duration.seconds(1),
      },
    },
    addCommitLatencyP90Alarm: {
      Warning: {
        maxLatency: Duration.seconds(1),
      },
    },
    addCommitLatencyP95Alarm: {
      Warning: {
        maxLatency: Duration.seconds(1),
      },
    },
    addCommitLatencyP99Alarm: {
      Warning: {
        maxLatency: Duration.seconds(1),
      },
    },
    addCommitLatencyP999Alarm: {
      Warning: {
        maxLatency: Duration.seconds(1),
      },
    },
    addCommitLatencyP9999Alarm: {
      Warning: {
        maxLatency: Duration.seconds(1),
      },
    },
    addCommitLatencyP100Alarm: {
      Warning: {
        maxLatency: Duration.seconds(1),
      },
    },
    addCommitLatencyAverageAlarm: {
      Warning: {
        maxLatency: Duration.seconds(1),
      },
    },
    useCreatedAlarms: {
      consume(alarms) {
        numAlarmsCreated = alarms.length;
      },
    },
  });

  addMonitoringDashboardsToStack(stack, monitoring);
  expect(numAlarmsCreated).toStrictEqual(51);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});
