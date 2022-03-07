import { Stack } from "monocdk";
import { Template } from "monocdk/assertions";
import { InstanceType } from "monocdk/aws-ec2";
import { Repository } from "monocdk/aws-ecr";
import { Cluster, EcrImage } from "monocdk/aws-ecs";
import {
  ApplicationLoadBalancedEc2Service,
  NetworkLoadBalancedEc2Service,
} from "monocdk/aws-ecs-patterns";

import { AlarmWithAnnotation, Ec2ServiceMonitoring } from "../../../lib";
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

  new Ec2ServiceMonitoring(scope, {
    ec2Service: ec2Service.service,
    loadBalancer: ec2Service.loadBalancer,
    targetGroup: ec2Service.targetGroup,
    alarmFriendlyName: "DummyEc2Service",
  });

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

  new Ec2ServiceMonitoring(scope, {
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

  new Ec2ServiceMonitoring(scope, {
    ec2Service: ec2Service.service,
    loadBalancer: ec2Service.loadBalancer,
    targetGroup: ec2Service.targetGroup,
    alarmFriendlyName: "DummyEc2Service",
  });

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

  new Ec2ServiceMonitoring(scope, {
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

  expect(numAlarmsCreated).toStrictEqual(7);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});
