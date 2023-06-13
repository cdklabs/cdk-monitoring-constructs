import { Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { Vpc } from "aws-cdk-lib/aws-ec2";
import {
  NetworkLoadBalancer,
  NetworkTargetGroup,
} from "aws-cdk-lib/aws-elasticloadbalancingv2";

import {
  AlarmWithAnnotation,
  NetworkLoadBalancerMonitoring,
} from "../../../lib";
import { addMonitoringDashboardsToStack } from "../../utils/SnapshotUtil";
import { TestMonitoringScope } from "../TestMonitoringScope";

function createNlb() {
  const stack = new Stack();
  const vpc = new Vpc(stack, "Vpc");
  const networkLoadBalancer = new NetworkLoadBalancer(stack, "NLB", {
    vpc: vpc,
  });
  const networkTargetGroup = networkLoadBalancer
    .addListener("Listener", { port: 80 })
    .addTargets("Target", { port: 80 });
  return { networkLoadBalancer, networkTargetGroup, stack };
}

function importNlb() {
  const stack = new Stack();
  const nlbArn =
    "arn:aws:elasticloadbalancing:us-west-2:123456789012:loadbalancer/network/my-load-balancer/50dc6c495c0c9188";
  const tgArn =
    "arn:aws:elasticloadbalancing:us-west-2:123456789012:targetgroup/my-target-group/50dc6c495c0c9188";
  const networkLoadBalancer =
    NetworkLoadBalancer.fromNetworkLoadBalancerAttributes(
      stack,
      "ImportedNLB",
      {
        loadBalancerArn: nlbArn,
      }
    );
  const networkTargetGroup = NetworkTargetGroup.fromTargetGroupAttributes(
    stack,
    "ImportedNetworkTargetGroup",
    {
      loadBalancerArns: nlbArn,
      targetGroupArn: tgArn,
    }
  );
  return { networkLoadBalancer, networkTargetGroup, stack };
}

test.each([createNlb, importNlb])(
  "snapshot nlb test: no alarms - %#",
  (factory) => {
    let props = factory();
    const networkLoadBalancer = props.networkLoadBalancer;
    const networkTargetGroup = props.networkTargetGroup;
    const stack = props.stack;

    const scope = new TestMonitoringScope(stack, "Scope");
    const monitoring = new NetworkLoadBalancerMonitoring(scope, {
      networkLoadBalancer,
      networkTargetGroup,
      alarmFriendlyName: "DummyNetworkLoadBalancer",
    });

    addMonitoringDashboardsToStack(stack, monitoring);
    expect(Template.fromStack(stack)).toMatchSnapshot();
  }
);

test.each([createNlb, importNlb])(
  "snapshot nlb test: all alarms - %#",
  (lbResourcesFactory) => {
    let lbResources = lbResourcesFactory();
    const networkLoadBalancer = lbResources.networkLoadBalancer;
    const networkTargetGroup = lbResources.networkTargetGroup;
    const stack = lbResources.stack;
    const scope = new TestMonitoringScope(stack, "Scope");

    let numAlarmsCreated = 0;

    const monitoring = new NetworkLoadBalancerMonitoring(scope, {
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

    addMonitoringDashboardsToStack(stack, monitoring);
    expect(numAlarmsCreated).toStrictEqual(4);
    expect(Template.fromStack(stack)).toMatchSnapshot();
  }
);
