import {
  GraphWidget,
  HorizontalAnnotation,
  IMetric,
  IWidget,
} from "aws-cdk-lib/aws-cloudwatch";
import { FargateService } from "aws-cdk-lib/aws-ecs";
import {
  ApplicationLoadBalancedFargateService,
  NetworkLoadBalancedFargateService,
} from "aws-cdk-lib/aws-ecs-patterns";
import {
  IApplicationLoadBalancer,
  IApplicationTargetGroup,
  INetworkLoadBalancer,
  INetworkTargetGroup,
} from "aws-cdk-lib/aws-elasticloadbalancingv2";

import { BaseServiceMetricFactory } from "./BaseServiceMetricFactory";
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

export interface BaseFargateServiceAlarms {
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
 * Monitoring props for any type of Fargate service.
 */
interface BaseFargateServiceMonitoringProps
  extends BaseMonitoringProps,
    BaseFargateServiceAlarms {}

/**
 * Monitoring props for Simple Fargate service.
 */
export interface SimpleFargateServiceMonitoringProps
  extends BaseFargateServiceMonitoringProps {
  readonly fargateService: FargateService;
}

/**
 * Base of Monitoring props for load-balanced Fargate service.
 */
interface BaseLoadBalancedFargateServiceMonitoringProps
  extends BaseFargateServiceMonitoringProps {
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

  /**
   * Invert the statistics of `HealthyHostCount` and `UnHealthyHostCount`.
   *
   * When `invertLoadBalancerTaskCountMetricsStatistics` is set to false, the minimum of `HealthyHostCount` and the maximum of `UnHealthyHostCount` are monitored.
   * When `invertLoadBalancerTaskCountMetricsStatistics` is set to true, the maximum of `HealthyHostCount` and the minimum of `UnHealthyHostCount` are monitored.
   *
   * `invertLoadBalancerTaskCountMetricsStatistics` is recommended to set to true as per the guidelines at
https://docs.aws.amazon.com/elasticloadbalancing/latest/network/load-balancer-cloudwatch-metrics.html#metric-statistics
   *
   * @default false
   */
  readonly invertLoadBalancerTaskCountMetricsStatistics?: boolean;
}

/**
 * Monitoring props for load-balanced Fargate service.
 */
export interface FargateServiceMonitoringProps
  extends BaseLoadBalancedFargateServiceMonitoringProps {
  readonly fargateService:
    | NetworkLoadBalancedFargateService
    | ApplicationLoadBalancedFargateService;
}

/**
 * Monitoring props for Fargate service with network load balancer and plain service.
 */
export interface FargateNetworkLoadBalancerMonitoringProps
  extends NetworkLoadBalancerMetricFactoryProps,
    BaseLoadBalancedFargateServiceMonitoringProps {
  readonly fargateService: FargateService;
}

/**
 * Monitoring props for Fargate service with application load balancer and plain service.
 */
export interface FargateApplicationLoadBalancerMonitoringProps
  extends ApplicationLoadBalancerMetricFactoryProps,
    BaseLoadBalancedFargateServiceMonitoringProps {
  readonly fargateService: FargateService;
}

export interface CustomFargateServiceMonitoringProps
  extends BaseLoadBalancedFargateServiceMonitoringProps {
  readonly fargateService: FargateService;
  readonly loadBalancer?: IApplicationLoadBalancer | INetworkLoadBalancer;
  readonly targetGroup?: IApplicationTargetGroup | INetworkTargetGroup;
}

export class FargateServiceMonitoring extends Monitoring {
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

  constructor(
    scope: MonitoringScope,
    props: CustomFargateServiceMonitoringProps
  ) {
    super(scope, props);

    this.hasLoadBalancer =
      props.loadBalancer !== undefined && props.targetGroup !== undefined;

    const namingStrategy = new MonitoringNamingStrategy({
      ...props,
      namedConstruct: props.fargateService,
    });
    this.title = namingStrategy.resolveHumanReadableName();

    this.metricFactory = scope.createMetricFactory();
    this.baseServiceMetricFactory = new BaseServiceMetricFactory(
      this.metricFactory,
      { service: props.fargateService }
    );
    if (this.hasLoadBalancer) {
      this.loadBalancerMetricFactory = createLoadBalancerMetricFactory(
        this.metricFactory,
        props.loadBalancer!,
        props.targetGroup!,
        props.invertLoadBalancerTaskCountMetricsStatistics
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
      family: "Fargate Service",
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
