import { Stack } from "monocdk";
import { Template } from "monocdk/assertions";
import { AutoScalingGroup } from "monocdk/aws-autoscaling";

import { EC2Monitoring } from "../../../lib";
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
      "DummyASG"
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
      "DummyASG"
    ),
  });

  addMonitoringDashboardsToStack(stack, monitoring);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});
