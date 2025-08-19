import { Duration, Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { AutoScalingGroup } from "aws-cdk-lib/aws-autoscaling";

import { AlarmWithAnnotation, EC2Monitoring } from "../../../lib";
import { addMonitoringDashboardsToStack } from "../../utils/SnapshotUtil";
import { TestMonitoringScope } from "../TestMonitoringScope";

test("snapshot test: all instances, no alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const monitoring = new EC2Monitoring(scope, {
    alarmFriendlyName: "EC2",
  });

  addMonitoringDashboardsToStack(stack, monitoring);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot test: ASG, no alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const monitoring = new EC2Monitoring(scope, {
    alarmFriendlyName: "EC2",
    autoScalingGroup: AutoScalingGroup.fromAutoScalingGroupName(
      stack,
      "DummyASG",
      "DummyASG",
    ),
  });

  addMonitoringDashboardsToStack(stack, monitoring);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot test: instance filter, no alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const monitoring = new EC2Monitoring(scope, {
    alarmFriendlyName: "EC2",
    instanceIds: ["instance1", "instance2"],
  });

  addMonitoringDashboardsToStack(stack, monitoring);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot test: instance filter + ASG, no alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const monitoring = new EC2Monitoring(scope, {
    alarmFriendlyName: "EC2",
    instanceIds: ["instance1", "instance2"],
    autoScalingGroup: AutoScalingGroup.fromAutoScalingGroupName(
      stack,
      "DummyASG",
      "DummyASG",
    ),
  });

  addMonitoringDashboardsToStack(stack, monitoring);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot test: all instances, network alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  let numAlarmsCreated = 0;

  const monitoring = new EC2Monitoring(scope, {
    alarmFriendlyName: "EC2",
    addNetworkInTotalBytesExceedThresholdAlarm: {
      WARNING: {
        maxNetworkInBytes: 100,
        period: Duration.days(1),
      },
    },
    addNetworkOutTotalBytesExceedThresholdAlarm: {
      ERROR: {
        maxNetworkOutBytes: 200,
        period: Duration.days(4),
      },
    },
    useCreatedAlarms: {
      consume(alarms: AlarmWithAnnotation[]) {
        numAlarmsCreated = alarms.length;
      },
    },
  });

  addMonitoringDashboardsToStack(stack, monitoring);
  expect(numAlarmsCreated).toBe(2);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot test: ASG, network alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  let numAlarmsCreated = 0;

  const monitoring = new EC2Monitoring(scope, {
    alarmFriendlyName: "EC2",
    autoScalingGroup: AutoScalingGroup.fromAutoScalingGroupName(
      stack,
      "DummyASG",
      "DummyASG",
    ),
    addNetworkInTotalBytesExceedThresholdAlarm: {
      WARNING: {
        maxNetworkInBytes: 100,
        period: Duration.days(1),
      },
    },
    addNetworkOutTotalBytesExceedThresholdAlarm: {
      ERROR: {
        maxNetworkOutBytes: 200,
        period: Duration.days(4),
      },
    },
    useCreatedAlarms: {
      consume(alarms: AlarmWithAnnotation[]) {
        numAlarmsCreated = alarms.length;
      },
    },
  });

  addMonitoringDashboardsToStack(stack, monitoring);
  expect(numAlarmsCreated).toBe(2);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot test: instance filter, network alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  let numAlarmsCreated = 0;

  const monitoring = new EC2Monitoring(scope, {
    alarmFriendlyName: "EC2",
    instanceIds: ["instanceId1", "instanceId2"],
    addNetworkInTotalBytesExceedThresholdAlarm: {
      WARNING: {
        maxNetworkInBytes: 100,
        period: Duration.days(1),
      },
    },
    addNetworkOutTotalBytesExceedThresholdAlarm: {
      ERROR: {
        maxNetworkOutBytes: 200,
        period: Duration.days(4),
      },
    },
    useCreatedAlarms: {
      consume(alarms: AlarmWithAnnotation[]) {
        numAlarmsCreated = alarms.length;
      },
    },
  });

  addMonitoringDashboardsToStack(stack, monitoring);
  expect(numAlarmsCreated).toBe(4);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot test: instance filter + ASG, network alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  let numAlarmsCreated = 0;

  const monitoring = new EC2Monitoring(scope, {
    alarmFriendlyName: "EC2",
    instanceIds: ["instanceId1", "instanceId2"],
    autoScalingGroup: AutoScalingGroup.fromAutoScalingGroupName(
      stack,
      "DummyASG",
      "DummyASG",
    ),
    addNetworkInTotalBytesExceedThresholdAlarm: {
      WARNING: {
        maxNetworkInBytes: 100,
        period: Duration.days(1),
      },
    },
    addNetworkOutTotalBytesExceedThresholdAlarm: {
      ERROR: {
        maxNetworkOutBytes: 200,
        period: Duration.days(4),
      },
    },
    useCreatedAlarms: {
      consume(alarms: AlarmWithAnnotation[]) {
        numAlarmsCreated = alarms.length;
      },
    },
  });

  addMonitoringDashboardsToStack(stack, monitoring);
  expect(numAlarmsCreated).toBe(4);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});
