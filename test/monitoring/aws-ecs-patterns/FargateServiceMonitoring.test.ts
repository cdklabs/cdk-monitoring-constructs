import { SynthUtils } from "@monocdk-experiment/assert";
import { Stack } from "monocdk";
import { Repository } from "monocdk/aws-ecr";
import {
  Cluster,
  EcrImage,
  FargateService,
  FargateTaskDefinition,
} from "monocdk/aws-ecs";
import {
  ApplicationLoadBalancedFargateService,
  NetworkLoadBalancedFargateService,
} from "monocdk/aws-ecs-patterns";
import { NetworkLoadBalancer } from "monocdk/aws-elasticloadbalancingv2";

import { AlarmWithAnnotation, FargateServiceMonitoring } from "../../../lib";
import { TestMonitoringScope } from "../TestMonitoringScope";

test("snapshot test: fargate, NLB, no alarms", () => {
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
  const networkLoadBalancer = new NetworkLoadBalancer(stack, "NLB", {
    vpc: cluster.vpc,
  });
  const networkTargetGroup = networkLoadBalancer
    .addListener("Listener", { port: 80 })
    .addTargets("Target", { port: 80, targets: [fargateService] });

  new FargateServiceMonitoring(scope, {
    fargateService,
    loadBalancer: networkLoadBalancer,
    targetGroup: networkTargetGroup,
    alarmFriendlyName: "DummyFargateService",
  });

  expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});

test("snapshot test: fargate, NLB, all alarms", () => {
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
  const networkLoadBalancer = new NetworkLoadBalancer(stack, "NLB", {
    vpc: cluster.vpc,
  });
  const networkTargetGroup = networkLoadBalancer
    .addListener("Listener", { port: 80 })
    .addTargets("Target", { port: 80, targets: [fargateService] });

  let numAlarmsCreated = 0;

  new FargateServiceMonitoring(scope, {
    fargateService,
    loadBalancer: networkLoadBalancer,
    targetGroup: networkTargetGroup,
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
    useCreatedAlarms: {
      consume(alarms: AlarmWithAnnotation[]) {
        numAlarmsCreated = alarms.length;
      },
    },
  });

  expect(numAlarmsCreated).toStrictEqual(6);
  expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});

test("snapshot test: fargate with NLB, no alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const cluster = new Cluster(stack, "Cluster");
  const image = new EcrImage(new Repository(stack, "Repository"), "DummyImage");

  const fargateService = new NetworkLoadBalancedFargateService(
    stack,
    "Service",
    {
      cluster,
      publicLoadBalancer: false,
      taskImageOptions: {
        containerPort: 8080,
        image,
      },
    }
  );

  new FargateServiceMonitoring(scope, {
    fargateService: fargateService.service,
    loadBalancer: fargateService.loadBalancer,
    targetGroup: fargateService.targetGroup,
    alarmFriendlyName: "DummyFargateService",
  });

  expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});

test("snapshot test: fargate with NLB, all alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const cluster = new Cluster(stack, "Cluster");
  const image = new EcrImage(new Repository(stack, "Repository"), "DummyImage");

  const fargateService = new NetworkLoadBalancedFargateService(
    stack,
    "Service",
    {
      cluster,
      publicLoadBalancer: false,
      taskImageOptions: {
        containerPort: 8080,
        image,
      },
    }
  );

  let numAlarmsCreated = 0;

  new FargateServiceMonitoring(scope, {
    fargateService: fargateService.service,
    loadBalancer: fargateService.loadBalancer,
    targetGroup: fargateService.targetGroup,
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
  expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});

test("snapshot test: fargate with ALB, no alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const cluster = new Cluster(stack, "Cluster");
  const image = new EcrImage(new Repository(stack, "Repository"), "DummyImage");

  const fargateService = new ApplicationLoadBalancedFargateService(
    stack,
    "Service",
    {
      cluster,
      publicLoadBalancer: false,
      taskImageOptions: {
        containerPort: 8080,
        image,
      },
    }
  );

  new FargateServiceMonitoring(scope, {
    fargateService: fargateService.service,
    loadBalancer: fargateService.loadBalancer,
    targetGroup: fargateService.targetGroup,
    alarmFriendlyName: "DummyFargateService",
  });

  expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});

test("snapshot test: fargate with ALB, all alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const cluster = new Cluster(stack, "Cluster");
  const image = new EcrImage(new Repository(stack, "Repository"), "DummyImage");

  const fargateService = new ApplicationLoadBalancedFargateService(
    stack,
    "Service",
    {
      cluster,
      publicLoadBalancer: false,
      taskImageOptions: {
        containerPort: 8080,
        image,
      },
    }
  );

  let numAlarmsCreated = 0;

  new FargateServiceMonitoring(scope, {
    fargateService: fargateService.service,
    loadBalancer: fargateService.loadBalancer,
    targetGroup: fargateService.targetGroup,
    alarmFriendlyName: "DummyFargateService",
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
  expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});

test("snapshot test: fargate, no alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const cluster = new Cluster(stack, "Cluster");

  const taskDefinition = new FargateTaskDefinition(stack, "TaskDefinnition", {
    cpu: 512,
    memoryLimitMiB: 1024,
  });
  const image = new EcrImage(new Repository(stack, "Repository"), "DummyImage");
  taskDefinition.addContainer("DummyContainer", {
    image,
  });

  const fargateService = new FargateService(stack, "Service", {
    cluster,
    taskDefinition,
  });

  new FargateServiceMonitoring(scope, {
    fargateService,
    alarmFriendlyName: "DummyFargateService",
  });

  expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});

test("snapshot test: fargate, all alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const cluster = new Cluster(stack, "Cluster");

  const taskDefinition = new FargateTaskDefinition(stack, "TaskDefinnition", {
    cpu: 512,
    memoryLimitMiB: 1024,
  });
  const image = new EcrImage(new Repository(stack, "Repository"), "DummyImage");
  taskDefinition.addContainer("DummyContainer", {
    image,
  });

  const fargateService = new FargateService(stack, "Service", {
    cluster,
    taskDefinition,
  });

  let numAlarmsCreated = 0;

  new FargateServiceMonitoring(scope, {
    fargateService,
    alarmFriendlyName: "DummyFargateService",
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
    useCreatedAlarms: {
      consume(alarms: AlarmWithAnnotation[]) {
        numAlarmsCreated = alarms.length;
      },
    },
  });

  expect(numAlarmsCreated).toStrictEqual(3);
  expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});
