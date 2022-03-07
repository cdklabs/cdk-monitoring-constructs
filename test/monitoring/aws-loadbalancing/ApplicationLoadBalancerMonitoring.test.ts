import { Stack } from "monocdk";
import { Template } from "monocdk/assertions";
import { InstanceType } from "monocdk/aws-ec2";
import { Repository } from "monocdk/aws-ecr";
import {
  Cluster,
  Ec2Service,
  Ec2TaskDefinition,
  EcrImage,
  FargateService,
  FargateTaskDefinition,
} from "monocdk/aws-ecs";
import { ApplicationLoadBalancer } from "monocdk/aws-elasticloadbalancingv2";

import {
  AlarmWithAnnotation,
  Ec2ServiceMonitoring,
  FargateServiceMonitoring,
} from "../../../lib";
import { TestMonitoringScope } from "../TestMonitoringScope";

// FARGATE SERVICE
// ===============

test("snapshot alb test: no alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const cluster = new Cluster(stack, "Cluster");
  const image = new EcrImage(new Repository(stack, "Repository"), "DummyImage");
  const taskDefinition = new FargateTaskDefinition(stack, "TaskDef", {});

  taskDefinition
    .addContainer("Container", { image })
    .addPortMappings({ containerPort: 8080 });

  const fargateService = new FargateService(stack, "Service", {
    cluster,
    taskDefinition,
  });
  const applicationLoadBalancer = new ApplicationLoadBalancer(stack, "ALB", {
    vpc: cluster.vpc,
  });
  const applicationTargetGroup = applicationLoadBalancer
    .addListener("Listener", { port: 80 })
    .addTargets("Target", { port: 80, targets: [fargateService] });

  new FargateServiceMonitoring(scope, {
    fargateService,
    loadBalancer: applicationLoadBalancer,
    targetGroup: applicationTargetGroup,
    alarmFriendlyName: "DummyFargateService",
  });

  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot alb test: all alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const cluster = new Cluster(stack, "Cluster");
  const image = new EcrImage(new Repository(stack, "Repository"), "DummyImage");
  const taskDefinition = new FargateTaskDefinition(stack, "TaskDef", {});

  taskDefinition
    .addContainer("Container", { image })
    .addPortMappings({ containerPort: 8080 });

  const fargateService = new FargateService(stack, "Service", {
    cluster,
    taskDefinition,
  });
  const applicationLoadBalancer = new ApplicationLoadBalancer(stack, "ALB", {
    vpc: cluster.vpc,
  });
  const applicationTargetGroup = applicationLoadBalancer
    .addListener("Listener", { port: 80 })
    .addTargets("Target", { port: 80, targets: [fargateService] });

  let numAlarmsCreated = 0;

  new FargateServiceMonitoring(scope, {
    fargateService,
    loadBalancer: applicationLoadBalancer,
    targetGroup: applicationTargetGroup,
    alarmFriendlyName: "DummyFargateService",
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
        minProcessedBytes: 0,
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

// EC2 SERVICE
// ===========

test("snapshot ec2 alb test: no alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const cluster = new Cluster(stack, "Cluster");

  const image = new EcrImage(new Repository(stack, "Repository"), "DummyImage");
  const taskDefinition = new Ec2TaskDefinition(stack, "TaskDef", {});

  taskDefinition
    .addContainer("Container", { image, memoryReservationMiB: 128 })
    .addPortMappings({ containerPort: 8080 });
  cluster.addCapacity("dummy capacity id", {
    instanceType: new InstanceType("dummy ec2 identifier"),
  });

  const ec2Service = new Ec2Service(stack, "Service", {
    cluster,
    taskDefinition,
  });
  const applicationLoadBalancer = new ApplicationLoadBalancer(stack, "ALB", {
    vpc: cluster.vpc,
  });
  const applicationTargetGroup = applicationLoadBalancer
    .addListener("Listener", { port: 80 })
    .addTargets("Target", { port: 80, targets: [ec2Service] });

  new Ec2ServiceMonitoring(scope, {
    ec2Service,
    loadBalancer: applicationLoadBalancer,
    targetGroup: applicationTargetGroup,
    alarmFriendlyName: "DummyEc2Service",
  });

  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot ec2 alb test: all alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const cluster = new Cluster(stack, "Cluster");
  const image = new EcrImage(new Repository(stack, "Repository"), "DummyImage");
  const taskDefinition = new Ec2TaskDefinition(stack, "TaskDef", {});

  taskDefinition
    .addContainer("Container", { image, memoryReservationMiB: 128 })
    .addPortMappings({ containerPort: 8080 });
  cluster.addCapacity("dummy capacity id", {
    instanceType: new InstanceType("dummy ec2 identifier"),
  });

  const ec2Service = new Ec2Service(stack, "Service", {
    cluster,
    taskDefinition,
  });
  const applicationLoadBalancer = new ApplicationLoadBalancer(stack, "ALB", {
    vpc: cluster.vpc,
  });
  const applicationTargetGroup = applicationLoadBalancer
    .addListener("Listener", { port: 80 })
    .addTargets("Target", { port: 80, targets: [ec2Service] });

  let numAlarmsCreated = 0;

  new Ec2ServiceMonitoring(scope, {
    ec2Service,
    loadBalancer: applicationLoadBalancer,
    targetGroup: applicationTargetGroup,
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
        minProcessedBytes: 0,
      },
    },
    addHealthyTaskPercentAlarm: {
      Warning: {
        minHealthyTaskPercent: 50,
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
