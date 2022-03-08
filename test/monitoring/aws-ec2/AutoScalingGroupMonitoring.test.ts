import { Stack } from "monocdk";
import { Template } from "monocdk/assertions";
import { AutoScalingGroup } from "monocdk/aws-autoscaling";
import {
  InstanceClass,
  InstanceSize,
  InstanceType,
  MachineImage,
  Vpc,
} from "monocdk/aws-ec2";

import { AutoScalingGroupMonitoring } from "../../../lib";
import { TestMonitoringScope } from "../TestMonitoringScope";

test("snapshot test", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const vpc = new Vpc(stack, "Vpc");

  const autoScalingGroup = new AutoScalingGroup(stack, "ASG", {
    autoScalingGroupName: "DummyASG",
    vpc,
    instanceType: InstanceType.of(InstanceClass.M4, InstanceSize.LARGE),
    machineImage: MachineImage.latestAmazonLinux(),
    minCapacity: 1,
    maxCapacity: 10,
    desiredCapacity: 5,
  });

  new AutoScalingGroupMonitoring(scope, {
    autoScalingGroup,
  });

  expect(Template.fromStack(stack)).toMatchSnapshot();
});
