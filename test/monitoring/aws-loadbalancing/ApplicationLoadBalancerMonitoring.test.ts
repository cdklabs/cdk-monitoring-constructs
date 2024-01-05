import { Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { InstanceType, IVpc } from "aws-cdk-lib/aws-ec2";
import { Repository } from "aws-cdk-lib/aws-ecr";
import {
  Cluster,
  Ec2Service,
  Ec2TaskDefinition,
  EcrImage,
  FargateService,
  FargateTaskDefinition,
} from "aws-cdk-lib/aws-ecs";
import {
  ApplicationLoadBalancer,
  ApplicationTargetGroup,
  IApplicationLoadBalancerTarget,
} from "aws-cdk-lib/aws-elasticloadbalancingv2";

import {
  AlarmWithAnnotation,
  Ec2ServiceMonitoring,
  FargateServiceMonitoring,
} from "../../../lib";
import { addMonitoringDashboardsToStack } from "../../utils/SnapshotUtil";
import { TestMonitoringScope } from "../TestMonitoringScope";

// FARGATE SERVICE
// ===============

function createAlb(
  stack: Stack,
  vpc: IVpc,
  target: IApplicationLoadBalancerTarget
) {
  const applicationLoadBalancer = new ApplicationLoadBalancer(stack, "ALB", {
    vpc: vpc,
  });
  const applicationTargetGroup = applicationLoadBalancer
    .addListener("Listener", { port: 80 })
    .addTargets("Target", { port: 80, targets: [target] });
  return { applicationLoadBalancer, applicationTargetGroup };
}

function importAlb(stack: Stack) {
  const albArn =
    "arn:aws:elasticloadbalancing:us-west-2:123456789012:loadbalancer/app/my-load-balancer/50dc6c495c0c9188";
  const tgArn =
    "arn:aws:elasticloadbalancing:us-west-2:123456789012:targetgroup/my-target-group/50dc6c495c0c9188";
  const applicationLoadBalancer =
    ApplicationLoadBalancer.fromApplicationLoadBalancerAttributes(
      stack,
      "ImportedALB",
      {
        loadBalancerArn: albArn,
        securityGroupId: "sg-abcdefg",
      }
    );
  const applicationTargetGroup =
    ApplicationTargetGroup.fromTargetGroupAttributes(
      stack,
      "ImportedApplicationTargetGroup",
      {
        loadBalancerArns: albArn,
        targetGroupArn: tgArn,
      }
    );
  return { applicationLoadBalancer, applicationTargetGroup };
}

test.each([createAlb, importAlb])(
  "snapshot alb test: no alarms - %#",
  (lbResourcesFactory) => {
    const stack = new Stack();

    const scope = new TestMonitoringScope(stack, "Scope");

    const cluster = new Cluster(stack, "Cluster");
    const image = new EcrImage(
      new Repository(stack, "Repository"),
      "DummyImage"
    );
    const taskDefinition = new FargateTaskDefinition(stack, "TaskDef", {});

    taskDefinition
      .addContainer("Container", { image })
      .addPortMappings({ containerPort: 8080 });

    const fargateService = new FargateService(stack, "Service", {
      cluster,
      taskDefinition,
    });
    const lbResources = lbResourcesFactory(stack, cluster.vpc, fargateService);

    const monitoring = new FargateServiceMonitoring(scope, {
      fargateService,
      applicationLoadBalancer: lbResources.applicationLoadBalancer,
      applicationTargetGroup: lbResources.applicationTargetGroup,
      alarmFriendlyName: "DummyFargateService",
    });

    addMonitoringDashboardsToStack(stack, monitoring);
    expect(Template.fromStack(stack)).toMatchSnapshot();
  }
);

test.each([createAlb, importAlb])(
  "snapshot alb test: all alarms - %#",
  (lbResourcesFactory) => {
    const stack = new Stack();

    const scope = new TestMonitoringScope(stack, "Scope");

    const cluster = new Cluster(stack, "Cluster");
    const image = new EcrImage(
      new Repository(stack, "Repository"),
      "DummyImage"
    );
    const taskDefinition = new FargateTaskDefinition(stack, "TaskDef", {});

    taskDefinition
      .addContainer("Container", { image })
      .addPortMappings({ containerPort: 8080 });

    const fargateService = new FargateService(stack, "Service", {
      cluster,
      taskDefinition,
    });
    const lbResources = lbResourcesFactory(stack, cluster.vpc, fargateService);

    let numAlarmsCreated = 0;

    const monitoring = new FargateServiceMonitoring(scope, {
      fargateService,
      applicationLoadBalancer: lbResources.applicationLoadBalancer,
      applicationTargetGroup: lbResources.applicationTargetGroup,
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

    addMonitoringDashboardsToStack(stack, monitoring);
    expect(numAlarmsCreated).toStrictEqual(7);
    expect(Template.fromStack(stack)).toMatchSnapshot();
  }
);

// EC2 SERVICE
// ===========

test.each([createAlb, importAlb])(
  "snapshot ec2 alb test: no alarms - %#",
  (lbResourcesFactory) => {
    const stack = new Stack();

    const scope = new TestMonitoringScope(stack, "Scope");

    const cluster = new Cluster(stack, "Cluster");

    const image = new EcrImage(
      new Repository(stack, "Repository"),
      "DummyImage"
    );
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
    const lbResources = lbResourcesFactory(stack, cluster.vpc, ec2Service);

    const monitoring = new Ec2ServiceMonitoring(scope, {
      ec2Service,
      loadBalancer: lbResources.applicationLoadBalancer,
      targetGroup: lbResources.applicationTargetGroup,
      alarmFriendlyName: "DummyEc2Service",
    });

    addMonitoringDashboardsToStack(stack, monitoring);
    expect(Template.fromStack(stack)).toMatchSnapshot();
  }
);

test.each([createAlb, importAlb])(
  "snapshot ec2 alb test: all alarms - %s",
  (lbResourcesFactory) => {
    const stack = new Stack();

    const scope = new TestMonitoringScope(stack, "Scope");

    const cluster = new Cluster(stack, "Cluster");
    const image = new EcrImage(
      new Repository(stack, "Repository"),
      "DummyImage"
    );
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
    const lbResources = lbResourcesFactory(stack, cluster.vpc, ec2Service);

    let numAlarmsCreated = 0;

    const monitoring = new Ec2ServiceMonitoring(scope, {
      ec2Service,
      loadBalancer: lbResources.applicationLoadBalancer,
      targetGroup: lbResources.applicationTargetGroup,
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

    addMonitoringDashboardsToStack(stack, monitoring);
    expect(numAlarmsCreated).toStrictEqual(7);
    expect(Template.fromStack(stack)).toMatchSnapshot();
  }
);
