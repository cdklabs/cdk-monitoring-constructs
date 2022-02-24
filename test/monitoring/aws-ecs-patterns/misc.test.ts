import { SynthUtils } from "@monocdk-experiment/assert";
import { Stack } from "monocdk";
import { InstanceType } from "monocdk/aws-ec2";
import { Repository } from "monocdk/aws-ecr";
import { Cluster, EcrImage, FargateTaskDefinition } from "monocdk/aws-ecs";
import {
  QueueProcessingEc2Service,
  QueueProcessingFargateService,
} from "monocdk/aws-ecs-patterns";

import {
  getQueueProcessingEc2ServiceMonitoring,
  getQueueProcessingFargateServiceMonitoring,
} from "../../../lib";
import { TestMonitoringScope } from "../TestMonitoringScope";

test("Fargate: snapshot test: no alarms", () => {
  const stack = new Stack();
  const scope = new TestMonitoringScope(stack, "Scope");
  const cluster = new Cluster(stack, "Cluster");
  const image = new EcrImage(new Repository(stack, "Repository"), "DummyImage");
  const taskDefinition = new FargateTaskDefinition(stack, "TaskDef", {});
  taskDefinition
    .addContainer("Container", { image })
    .addPortMappings({ containerPort: 8080 });
  const fargateService = new QueueProcessingFargateService(stack, "Service", {
    cluster,
    image,
  });

  getQueueProcessingFargateServiceMonitoring(scope, { fargateService });

  expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});

test("Fargate: snapshot test: one alarm in each aspect", () => {
  const stack = new Stack();
  const scope = new TestMonitoringScope(stack, "Scope");
  const cluster = new Cluster(stack, "Cluster");
  const image = new EcrImage(new Repository(stack, "Repository"), "DummyImage");
  const taskDefinition = new FargateTaskDefinition(stack, "TaskDef", {});
  taskDefinition
    .addContainer("Container", { image })
    .addPortMappings({ containerPort: 8080 });
  const fargateService = new QueueProcessingFargateService(stack, "Service", {
    cluster,
    image,
  });

  getQueueProcessingFargateServiceMonitoring(scope, {
    fargateService,
    alarmFriendlyName: "DummyAlarm",
    addServiceAlarms: {
      addCpuUsageAlarm: {
        Warning: { maxUsagePercent: 50 },
      },
    },
    addQueueAlarms: {
      addQueueMaxSizeAlarm: {
        Warning: { maxMessageCount: 1000 },
      },
    },
    addDeadLetterQueueAlarms: {
      addDeadLetterQueueMaxSizeAlarm: {
        Warning: { maxMessageCount: 0 },
      },
    },
  });

  expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});

test("EC2: snapshot test: no alarms", () => {
  const stack = new Stack();
  const scope = new TestMonitoringScope(stack, "Scope");
  const cluster = new Cluster(stack, "Cluster");
  cluster.addCapacity("dummy capacity id", {
    instanceType: new InstanceType("dummy ec2 identifier"),
  });
  const image = new EcrImage(new Repository(stack, "Repository"), "DummyImage");
  const ec2Service = new QueueProcessingEc2Service(stack, "Service", {
    cluster,
    image,
    memoryLimitMiB: 42,
  });

  getQueueProcessingEc2ServiceMonitoring(scope, { ec2Service });

  expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});

test("EC2: snapshot test: one alarm in each aspect", () => {
  const stack = new Stack();
  const scope = new TestMonitoringScope(stack, "Scope");
  const cluster = new Cluster(stack, "Cluster");
  cluster.addCapacity("dummy capacity id", {
    instanceType: new InstanceType("dummy ec2 identifier"),
  });
  const image = new EcrImage(new Repository(stack, "Repository"), "DummyImage");
  const ec2Service = new QueueProcessingEc2Service(stack, "Service", {
    cluster,
    image,
    memoryLimitMiB: 42,
  });

  getQueueProcessingEc2ServiceMonitoring(scope, {
    ec2Service,
    alarmFriendlyName: "DummyAlarm",
    addServiceAlarms: {
      addCpuUsageAlarm: {
        Warning: { maxUsagePercent: 50 },
      },
    },
    addQueueAlarms: {
      addQueueMaxSizeAlarm: {
        Warning: { maxMessageCount: 1000 },
      },
    },
    addDeadLetterQueueAlarms: {
      addDeadLetterQueueMaxSizeAlarm: {
        Warning: { maxMessageCount: 0 },
      },
    },
  });

  expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});
