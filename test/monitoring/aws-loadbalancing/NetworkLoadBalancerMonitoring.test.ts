import { Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { Vpc } from "aws-cdk-lib/aws-ec2";
import { NetworkLoadBalancer } from "aws-cdk-lib/aws-elasticloadbalancingv2";

import {
  AlarmWithAnnotation,
  NetworkLoadBalancerMonitoring,
} from "../../../lib";
import { TestMonitoringScope } from "../TestMonitoringScope";

test("snapshot nlb test: no alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const vpc = new Vpc(stack, "Vpc");
  const networkLoadBalancer = new NetworkLoadBalancer(stack, "NLB", {
    vpc: vpc,
  });
  const networkTargetGroup = networkLoadBalancer
    .addListener("Listener", { port: 80 })
    .addTargets("Target", { port: 80 });

  new NetworkLoadBalancerMonitoring(scope, {
    networkLoadBalancer,
    networkTargetGroup,
    alarmFriendlyName: "DummyNetworkLoadBalancer",
  });

  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot nlb test: all alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const vpc = new Vpc(stack, "Vpc");
  const networkLoadBalancer = new NetworkLoadBalancer(stack, "NLB", {
    vpc: vpc,
  });
  const networkTargetGroup = networkLoadBalancer
    .addListener("Listener", { port: 80 })
    .addTargets("Target", { port: 80 });

  let numAlarmsCreated = 0;

  new NetworkLoadBalancerMonitoring(scope, {
    networkLoadBalancer,
    networkTargetGroup,
    alarmFriendlyName: "DummyNetworkLoadBalancer",
    addHealthyTaskCountAlarm: {
      Warning: {
        minHealthyTasks: 3,
      },
    },
    addUnhealthyTaskCountAlarm: {
      Warning: {
        maxUnhealthyTasks: 3,
      },
    },
    addHealthyTaskPercentAlarm: {
      Warning: {
        minHealthyTaskPercent: 75,
      },
    },
    addMinProcessedBytesAlarm: {
      Warning: {
        minProcessedBytes: 1024,
      },
    },
    useCreatedAlarms: {
      consume(alarms: AlarmWithAnnotation[]) {
        numAlarmsCreated = alarms.length;
      },
    },
  });

  expect(numAlarmsCreated).toStrictEqual(4);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});
