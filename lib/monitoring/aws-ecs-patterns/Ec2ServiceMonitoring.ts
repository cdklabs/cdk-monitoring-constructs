import {
  GraphWidget,
  HorizontalAnnotation,
  IMetric,
  IWidget,
} from "aws-cdk-lib/aws-cloudwatch";
import { Ec2Service } from "aws-cdk-lib/aws-ecs";
import {
  ApplicationLoadBalancedEc2Service,
  NetworkLoadBalancedEc2Service,
} from "aws-cdk-lib/aws-ecs-patterns";
import {
  ApplicationLoadBalancer,
  ApplicationTargetGroup,
  NetworkLoadBalancer,
  NetworkTargetGroup,
} from "aws-cdk-lib/aws-elasticloadbalancingv2";

import {
  BaseMonitoringProps,
  CountAxisFromZero,
  DefaultGraphWidgetHeight,
  DefaultSummaryWidgetHeight,
  HealthyTaskCountThreshold,
  HealthyTaskPercentThreshold,
  MetricFactory,
  MetricWithAlarmSupport,
  MinProcessedBytesThreshold,
  Monitoring,
  MonitoringScope,
  NeutralColor,
  PercentageAxisFromZeroToHundred,
  QuarterWidth,
  RunningTaskCountThreshold,
  SizeAxisBytesFromZero,
  TaskHealthAlarmFactory,
  ThirdWidth,
  ThroughputAlarmFactory,
  UnhealthyTaskCountThreshold,
  UsageAlarmFactory,
  UsageThreshold,
} from "../../common";
import {
  MonitoringHeaderWidget,
  MonitoringNamingStrategy,
} from "../../dashboard";
import {
  ApplicationLoadBalancerMetricFactoryProps,
  ILoadBalancerMetricFactory,
  NetworkLoadBalancerMetricFactoryProps,
  createLoadBalancerMetricFactory,
} from "../aws-loadbalancing";
import { BaseServiceMetricFactory } from "./BaseServiceMetricFactory";

export interface BaseEc2ServiceAlarms {
  /**
   * minimum number of tasks, as specified in your auto scaling config
   */
  readonly minAutoScalingTaskCount?: number;
  /**
   * maximum number of tasks, as specified in your auto scaling config
   */
  readonly maxAutoScalingTaskCount?: number;
  /**
   * Container Insights needs to be enabled for the cluster for this alarm
   */
  readonly addRunningTaskCountAlarm?: Record<string, RunningTaskCountThreshold>;
  readonly addCpuUsageAlarm?: Record<string, UsageThreshold>;
  readonly addMemoryUsageAlarm?: Record<string, UsageThreshold>;
}

/**
 * Monitoring props for any type of EC2 service.
 */
interface BaseEc2ServiceMonitoringProps
  extends BaseMonitoringProps,
    BaseEc2ServiceAlarms {}

/**
 * Monitoring props for Simple EC2 service.
 */
export interface SimpleEc2ServiceMonitoringProps
  extends BaseEc2ServiceMonitoringProps {
  readonly ec2Service: Ec2Service;
}

/**
 * Base of Monitoring props for load-balanced EC2 service.
 */
interface BaseLoadBalancedEc2ServiceMonitoringProps
  extends BaseEc2ServiceMonitoringProps {
  readonly addHealthyTaskCountAlarm?: Record<string, HealthyTaskCountThreshold>;
  readonly addUnhealthyTaskCountAlarm?: Record<
    string,
    UnhealthyTaskCountThreshold
  >;
  readonly addHealthyTaskPercentAlarm?: Record<
    string,
    HealthyTaskPercentThreshold
  >;
  readonly addMinProcessedBytesAlarm?: Record<
    string,
    MinProcessedBytesThreshold
  >;
}

/**
 * Monitoring props for load-balanced EC2 service.
 */
export interface Ec2ServiceMonitoringProps
  extends BaseLoadBalancedEc2ServiceMonitoringProps {
  readonly ec2Service:
    | NetworkLoadBalancedEc2Service
    | ApplicationLoadBalancedEc2Service;
}

/**
 * Monitoring props for EC2 service with network load balancer and plain service.
 */
export interface Ec2NetworkLoadBalancerMonitoringProps
  extends NetworkLoadBalancerMetricFactoryProps,
    BaseLoadBalancedEc2ServiceMonitoringProps {
  readonly ec2Service: Ec2Service;
}

/**
 * Monitoring props for EC2 service with application load balancer and plain service.
 */
export interface Ec2ApplicationLoadBalancerMonitoringProps
  extends ApplicationLoadBalancerMetricFactoryProps,
    BaseLoadBalancedEc2ServiceMonitoringProps {
  readonly ec2Service: Ec2Service;
}

export interface CustomEc2ServiceMonitoringProps
  extends BaseLoadBalancedEc2ServiceMonitoringProps {
  readonly ec2Service: Ec2Service;
  readonly loadBalancer?: ApplicationLoadBalancer | NetworkLoadBalancer;
  readonly targetGroup?: ApplicationTargetGroup | NetworkTargetGroup;
}

export class Ec2ServiceMonitoring extends Monitoring {
  readonly title: string;

  readonly metricFactory: MetricFactory;
  readonly baseServiceMetricFactory: BaseServiceMetricFactory;
  readonly loadBalancerMetricFactory?: ILoadBalancerMetricFactory;

  readonly taskHealthAlarmFactory: TaskHealthAlarmFactory;
  readonly throughputAlarmFactory: ThroughputAlarmFactory;
  readonly taskHealthAnnotations: HorizontalAnnotation[];
  readonly usageAlarmFactory: UsageAlarmFactory;
  readonly cpuUsageAnnotations: HorizontalAnnotation[];
  readonly memoryUsageAnnotations: HorizontalAnnotation[];
  readonly processedBytesAnnotations: HorizontalAnnotation[];

  readonly healthyTaskCountMetric?: MetricWithAlarmSupport;
  readonly unhealthyTaskCountMetric?: MetricWithAlarmSupport;
  readonly healthyTaskPercentMetric?: MetricWithAlarmSupport;
  readonly runningTaskCountMetric: MetricWithAlarmSupport;
  readonly cpuUtilisationMetric: MetricWithAlarmSupport;
  readonly memoryUtilisationMetric: MetricWithAlarmSupport;
  readonly activeTcpFlowCountMetric?: MetricWithAlarmSupport;
  readonly newTcpFlowCountMetric?: MetricWithAlarmSupport;
  readonly processedBytesMetric?: MetricWithAlarmSupport;

  private hasLoadBalancer: boolean;

  constructor(scope: MonitoringScope, props: CustomEc2ServiceMonitoringProps) {
    super(scope, props);

    this.hasLoadBalancer =
      props.loadBalancer !== undefined && props.targetGroup !== undefined;

    const namingStrategy = new MonitoringNamingStrategy({
      ...props,
      namedConstruct: props.ec2Service,
    });
    this.title = namingStrategy.resolveHumanReadableName();

    this.metricFactory = scope.createMetricFactory();
    this.baseServiceMetricFactory = new BaseServiceMetricFactory(
      this.metricFactory,
      { service: props.ec2Service }
    );
    if (this.hasLoadBalancer) {
      this.loadBalancerMetricFactory = createLoadBalancerMetricFactory(
        this.metricFactory,
        props.loadBalancer,
        props.targetGroup
      );
      this.healthyTaskCountMetric =
        this.loadBalancerMetricFactory.metricHealthyTaskCount();
      this.unhealthyTaskCountMetric =
        this.loadBalancerMetricFactory.metricUnhealthyTaskCount();
      this.healthyTaskPercentMetric =
        this.loadBalancerMetricFactory.metricHealthyTaskInPercent();
      this.activeTcpFlowCountMetric =
        this.loadBalancerMetricFactory.metricActiveConnectionCount();
      this.newTcpFlowCountMetric =
        this.loadBalancerMetricFactory.metricNewConnectionCount();
      this.processedBytesMetric =
        this.loadBalancerMetricFactory.metricProcessedBytesMin();
    }
    this.runningTaskCountMetric =
      this.baseServiceMetricFactory.metricRunningTaskCount();
    this.cpuUtilisationMetric =
      this.baseServiceMetricFactory.metricClusterCpuUtilisationInPercent();
    this.memoryUtilisationMetric =
      this.baseServiceMetricFactory.metricClusterMemoryUtilisationInPercent();

    const alarmFactory = this.createAlarmFactory(
      namingStrategy.resolveAlarmFriendlyName()
    );
    this.taskHealthAlarmFactory = new TaskHealthAlarmFactory(alarmFactory);
    this.throughputAlarmFactory = new ThroughputAlarmFactory(alarmFactory);
    this.taskHealthAnnotations = [];
    this.usageAlarmFactory = new UsageAlarmFactory(alarmFactory);
    this.cpuUsageAnnotations = [];
    this.memoryUsageAnnotations = [];
    this.processedBytesAnnotations = [];

    if (props.minAutoScalingTaskCount) {
      // TODO: use annotation strategy to create neutral annotation
      this.taskHealthAnnotations.push({
        value: props.minAutoScalingTaskCount,
        label: "AutoScaling: Min",
        color: NeutralColor,
      });
    }
    if (props.maxAutoScalingTaskCount) {
      // TODO: use annotation strategy to create neutral annotation
      this.taskHealthAnnotations.push({
        value: props.maxAutoScalingTaskCount,
        label: "AutoScaling: Max",
        color: NeutralColor,
      });
    }

    if (this.hasLoadBalancer) {
      for (const disambiguator in props.addHealthyTaskCountAlarm) {
        const alarmProps = props.addHealthyTaskCountAlarm[disambiguator];
        const createdAlarm =
          this.taskHealthAlarmFactory.addHealthyTaskCountAlarm(
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.healthyTaskCountMetric!,
            alarmProps,
            disambiguator
          );
        this.taskHealthAnnotations.push(createdAlarm.annotation);
        this.addAlarm(createdAlarm);
      }
      for (const disambiguator in props.addUnhealthyTaskCountAlarm) {
        const alarmProps = props.addUnhealthyTaskCountAlarm[disambiguator];
        const createdAlarm =
          this.taskHealthAlarmFactory.addUnhealthyTaskCountAlarm(
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.unhealthyTaskCountMetric!,
            alarmProps,
            disambiguator
          );
        this.taskHealthAnnotations.push(createdAlarm.annotation);
        this.addAlarm(createdAlarm);
      }
      for (const disambiguator in props.addHealthyTaskPercentAlarm) {
        const alarmProps = props.addHealthyTaskPercentAlarm[disambiguator];
        const createdAlarm =
          this.taskHealthAlarmFactory.addHealthyTaskPercentAlarm(
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.healthyTaskPercentMetric!,
            alarmProps,
            disambiguator
          );
        this.addAlarm(createdAlarm);
      }
    }

    for (const disambiguator in props.addRunningTaskCountAlarm) {
      const alarmProps = props.addRunningTaskCountAlarm[disambiguator];
      const createdAlarm = this.taskHealthAlarmFactory.addRunningTaskCountAlarm(
        this.runningTaskCountMetric,
        alarmProps,
        disambiguator
      );
      this.taskHealthAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }
    for (const disambiguator in props.addCpuUsageAlarm) {
      const alarmProps = props.addCpuUsageAlarm[disambiguator];
      const createdAlarm = this.usageAlarmFactory.addMaxCpuUsagePercentAlarm(
        this.cpuUtilisationMetric,
        alarmProps,
        disambiguator
      );
      this.cpuUsageAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }
    for (const disambiguator in props.addMemoryUsageAlarm) {
      const alarmProps = props.addMemoryUsageAlarm[disambiguator];
      const createdAlarm = this.usageAlarmFactory.addMaxMemoryUsagePercentAlarm(
        this.memoryUtilisationMetric,
        alarmProps,
        disambiguator
      );
      this.memoryUsageAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }

    if (this.hasLoadBalancer) {
      for (const disambiguator in props.addMinProcessedBytesAlarm) {
        const alarmProps = props.addMinProcessedBytesAlarm[disambiguator];
        const createdAlarm =
          this.throughputAlarmFactory.addMinProcessedBytesAlarm(
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.processedBytesMetric!,
            alarmProps,
            disambiguator
          );
        this.processedBytesAnnotations.push(createdAlarm.annotation);
        this.addAlarm(createdAlarm);
      }
    }

    props.useCreatedAlarms?.consume(this.createdAlarms());
  }

  summaryWidgets(): IWidget[] {
    return [
      this.createTitleWidget(),
      this.createCpuWidget(ThirdWidth, DefaultSummaryWidgetHeight),
      this.createMemoryWidget(ThirdWidth, DefaultSummaryWidgetHeight),
      this.createTaskHealthWidget(ThirdWidth, DefaultSummaryWidgetHeight),
    ];
  }

  widgets(): IWidget[] {
    const baseWidget = [
      this.createTitleWidget(),
      this.createCpuWidget(
        this.hasLoadBalancer ? QuarterWidth : ThirdWidth,
        DefaultGraphWidgetHeight
      ),
      this.createMemoryWidget(
        this.hasLoadBalancer ? QuarterWidth : ThirdWidth,
        DefaultGraphWidgetHeight
      ),
    ];

    if (this.hasLoadBalancer) {
      return baseWidget.concat([
        this.createTpcFlowsWidget(QuarterWidth, DefaultGraphWidgetHeight),
        this.createTaskHealthWidget(QuarterWidth, DefaultGraphWidgetHeight),
      ]);
    } else {
      return baseWidget.concat(
        this.createTaskHealthWidget(ThirdWidth, DefaultGraphWidgetHeight)
      );
    }
  }

  createTitleWidget() {
    return new MonitoringHeaderWidget({
      family: "Ec2 Service",
      title: this.title,
    });
  }

  createCpuWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "CPU Utilization",
      left: [this.cpuUtilisationMetric],
      leftYAxis: PercentageAxisFromZeroToHundred,
      leftAnnotations: this.cpuUsageAnnotations,
    });
  }

  createMemoryWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Memory Utilization",
      left: [this.memoryUtilisationMetric],
      leftYAxis: PercentageAxisFromZeroToHundred,
      leftAnnotations: this.memoryUsageAnnotations,
    });
  }

  createTaskHealthWidget(width: number, height: number) {
    const left = [this.runningTaskCountMetric];

    if (this.healthyTaskCountMetric) {
      left.push(this.healthyTaskCountMetric);
    }

    if (this.unhealthyTaskCountMetric) {
      left.push(this.unhealthyTaskCountMetric);
    }

    return new GraphWidget({
      width,
      height,
      title: this.hasLoadBalancer ? "Task Health" : "Task Count",
      left,
      leftYAxis: CountAxisFromZero,
      leftAnnotations: this.taskHealthAnnotations,
    });
  }

  createTpcFlowsWidget(width: number, height: number) {
    const left: IMetric[] = [];
    const right: IMetric[] = [];

    if (this.activeTcpFlowCountMetric) {
      left.push(this.activeTcpFlowCountMetric);
    }

    if (this.newTcpFlowCountMetric) {
      left.push(this.newTcpFlowCountMetric);
    }

    if (this.processedBytesMetric) {
      right.push(this.processedBytesMetric);
    }

    return new GraphWidget({
      width,
      height,
      title: "TCP Flows",
      left,
      leftYAxis: CountAxisFromZero,
      right,
      rightYAxis: SizeAxisBytesFromZero,
    });
  }
}
