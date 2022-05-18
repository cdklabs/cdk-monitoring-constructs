import { Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { InstanceType } from "aws-cdk-lib/aws-ec2";
import { Repository } from "aws-cdk-lib/aws-ecr";
import { Cluster, EcrImage } from "aws-cdk-lib/aws-ecs";
import {
  ApplicationLoadBalancedEc2Service,
  NetworkLoadBalancedEc2Service,
} from "aws-cdk-lib/aws-ecs-patterns";

import { AlarmWithAnnotation, Ec2ServiceMonitoring } from "../../../lib";
import { addMonitoringDashboardsToStack } from "../../utils/SnapshotUtil";
import { TestMonitoringScope } from "../TestMonitoringScope";

test("snapshot test: EC2 + NLB, no alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const cluster = new Cluster(stack, "Cluster");
  cluster.addCapacity("dummy capacity id", {
    instanceType: new InstanceType("dummy ec2 identifier"),
  });

  const image = new EcrImage(new Repository(stack, "Repository"), "DummyImage");

  const ec2Service = new NetworkLoadBalancedEc2Service(stack, "Service", {
    cluster,
    publicLoadBalancer: false,
    memoryReservationMiB: 128,
    taskImageOptions: {
      containerPort: 8080,
      image,
    },
  });

  const monitoring = new Ec2ServiceMonitoring(scope, {
    ec2Service: ec2Service.service,
    loadBalancer: ec2Service.loadBalancer,
    targetGroup: ec2Service.targetGroup,
    alarmFriendlyName: "DummyEc2Service",
  });

  addMonitoringDashboardsToStack(stack, monitoring);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot test: EC2 + NLB, all alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const cluster = new Cluster(stack, "Cluster");
  cluster.addCapacity("dummy capacity id", {
    instanceType: new InstanceType("dummy ec2 identifier"),
  });

  const image = new EcrImage(new Repository(stack, "Repository"), "DummyImage");

  const ec2Service = new NetworkLoadBalancedEc2Service(stack, "Service", {
    cluster,
    publicLoadBalancer: false,
    memoryReservationMiB: 128,
    taskImageOptions: {
      containerPort: 8080,
      image,
    },
  });

  let numAlarmsCreated = 0;

  const monitoring = new Ec2ServiceMonitoring(scope, {
    ec2Service: ec2Service.service,
    loadBalancer: ec2Service.loadBalancer,
    targetGroup: ec2Service.targetGroup,
    alarmFriendlyName: "DummyEc2Service",
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
    addRunningTaskCountAlarm: {
      Warning: {
        maxRunningTasks: 5,
      },
    },
    addCpuUsageAlarm: {
      Warning: {
        maxUsagePercent: 80,
      },
    },
    addMemoryUsageAlarm: {
      Warning: {
        maxUsagePercent: 80,
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
  expect(numAlarmsCreated).toStrictEqual(7);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot test: EC2 + ALB, no alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const cluster = new Cluster(stack, "Cluster");
  cluster.addCapacity("dummy capacity id", {
    instanceType: new InstanceType("dummy ec2 identifier"),
  });

  const image = new EcrImage(new Repository(stack, "Repository"), "DummyImage");

  const ec2Service = new ApplicationLoadBalancedEc2Service(stack, "Service", {
    cluster,
    publicLoadBalancer: false,
    memoryReservationMiB: 128,
    taskImageOptions: {
      containerPort: 8080,
      image,
    },
  });

  const monitoring = new Ec2ServiceMonitoring(scope, {
    ec2Service: ec2Service.service,
    loadBalancer: ec2Service.loadBalancer,
    targetGroup: ec2Service.targetGroup,
    alarmFriendlyName: "DummyEc2Service",
  });

  addMonitoringDashboardsToStack(stack, monitoring);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot test: EC2 + ALB, all alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const cluster = new Cluster(stack, "Cluster");
  cluster.addCapacity("dummy capacity id", {
    instanceType: new InstanceType("dummy ec2 identifier"),
  });

  const image = new EcrImage(new Repository(stack, "Repository"), "DummyImage");

  const ec2Service = new ApplicationLoadBalancedEc2Service(stack, "Service", {
    cluster,
    publicLoadBalancer: false,
    memoryReservationMiB: 128,
    taskImageOptions: {
      containerPort: 8080,
      image,
    },
  });

  let numAlarmsCreated = 0;

  const monitoring = new Ec2ServiceMonitoring(scope, {
    ec2Service: ec2Service.service,
    loadBalancer: ec2Service.loadBalancer,
    targetGroup: ec2Service.targetGroup,
    alarmFriendlyName: "DummyEc2Service",
    addHealthyTaskCountAlarm: {
      Warning: {
        minHealthyTasks: 3,
      },
    },
    addHealthyTaskPercentAlarm: {
      Warning: {
        minHealthyTaskPercent: 75,
      },
    },
    addUnhealthyTaskCountAlarm: {
      Warning: {
        maxUnhealthyTasks: 3,
      },
    },
    addRunningTaskCountAlarm: {
      Warning: {
        maxRunningTasks: 5,
      },
    },
    addCpuUsageAlarm: {
      Warning: {
        maxUsagePercent: 80,
      },
    },
    addMemoryUsageAlarm: {
      Warning: {
        maxUsagePercent: 80,
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
  expect(numAlarmsCreated).toStrictEqual(7);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});
