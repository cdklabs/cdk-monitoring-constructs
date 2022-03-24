import { Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { AutoScalingGroup } from "aws-cdk-lib/aws-autoscaling";

import { EC2Monitoring } from "../../../lib";
import { TestMonitoringScope } from "../TestMonitoringScope";

test("snapshot test: all instances, no alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  new EC2Monitoring(scope, {
    alarmFriendlyName: "EC2",
  });

  expect(Template.fromStack(stack)).toMatchSnapshot();
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

  expect(Template.fromStack(stack)).toMatchSnapshot();
});
