import { SynthUtils } from "@monocdk-experiment/assert";
import { Stack } from "monocdk";
import { AutoScalingGroup } from "monocdk/aws-autoscaling";

import { EC2Monitoring } from "../../../lib";
import { TestMonitoringScope } from "../TestMonitoringScope";

test("snapshot test: all instances, no alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  new EC2Monitoring(scope, {
    alarmFriendlyName: "EC2",
  });

  expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});

test("snapshot test: ASG, no alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  new EC2Monitoring(scope, {
    alarmFriendlyName: "EC2",
    autoScalingGroup: AutoScalingGroup.fromAutoScalingGroupName(
      stack,
      "DummyASG",
      "DummyASG"
    ),
  });

  expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});
