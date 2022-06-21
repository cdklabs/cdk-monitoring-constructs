import {
  GraphWidget,
  HorizontalAnnotation,
  IWidget,
} from "aws-cdk-lib/aws-cloudwatch";

import {
  BaseMonitoringProps,
  CountAxisFromZero,
  DefaultGraphWidgetHeight,
  DefaultSummaryWidgetHeight,
  HalfWidth,
  HealthyTaskCountThreshold,
  HealthyTaskPercentThreshold,
  MetricWithAlarmSupport,
  MinProcessedBytesThreshold,
  Monitoring,
  MonitoringScope,
  SizeAxisBytesFromZero,
  TaskHealthAlarmFactory,
  ThroughputAlarmFactory,
  UnhealthyTaskCountThreshold,
} from "../../common";
import {
  MonitoringHeaderWidget,
  MonitoringNamingStrategy,
} from "../../dashboard";
import {
  NetworkLoadBalancerMetricFactory,
  NetworkLoadBalancerMetricFactoryProps,
} from "./NetworkLoadBalancerMetricFactory";

export interface NetworkLoadBalancerMonitoringProps
  extends NetworkLoadBalancerMetricFactoryProps,
    BaseMonitoringProps {
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

export class NetworkLoadBalancerMonitoring extends Monitoring {
  protected readonly humanReadableName: string;
  protected readonly metricFactory: NetworkLoadBalancerMetricFactory;

  protected readonly taskHealthAlarmFactory: TaskHealthAlarmFactory;
  protected readonly throughputAlarmFactory: ThroughputAlarmFactory;
  protected readonly taskHealthAnnotations: HorizontalAnnotation[];
  protected readonly processedBytesAnnotations: HorizontalAnnotation[];

  protected readonly healthyTaskCountMetric: MetricWithAlarmSupport;
  protected readonly unhealthyTaskCountMetric: MetricWithAlarmSupport;
  protected readonly healthyTaskPercentMetric: MetricWithAlarmSupport;
  protected readonly activeTcpFlowCountMetric: MetricWithAlarmSupport;
  protected readonly newTcpFlowCountMetric: MetricWithAlarmSupport;
  protected readonly processedBytesMetric: MetricWithAlarmSupport;

  constructor(
    scope: MonitoringScope,
    props: NetworkLoadBalancerMonitoringProps
  ) {
    super(scope, props);

    const fallbackConstructName = `${props.networkLoadBalancer}-${props.networkTargetGroup}`;
    const namingStrategy = new MonitoringNamingStrategy({
      ...props,
      fallbackConstructName,
    });
    this.humanReadableName = namingStrategy.resolveHumanReadableName();

    this.metricFactory = new NetworkLoadBalancerMetricFactory(
      scope.createMetricFactory(),
      props
    );
    this.healthyTaskCountMetric = this.metricFactory.metricHealthyTaskCount();
    this.unhealthyTaskCountMetric =
      this.metricFactory.metricUnhealthyTaskCount();
    this.healthyTaskPercentMetric =
      this.metricFactory.metricHealthyTaskInPercent();
    this.activeTcpFlowCountMetric =
      this.metricFactory.metricActiveConnectionCount();
    this.newTcpFlowCountMetric = this.metricFactory.metricNewConnectionCount();
    this.processedBytesMetric = this.metricFactory.metricProcessedBytesMin();

    const alarmFactory = this.createAlarmFactory(
      namingStrategy.resolveAlarmFriendlyName()
    );
    this.taskHealthAlarmFactory = new TaskHealthAlarmFactory(alarmFactory);
    this.throughputAlarmFactory = new ThroughputAlarmFactory(alarmFactory);
    this.taskHealthAnnotations = [];
    this.processedBytesAnnotations = [];

    for (const disambiguator in props.addHealthyTaskCountAlarm) {
      const alarmProps = props.addHealthyTaskCountAlarm[disambiguator];
      const createdAlarm = this.taskHealthAlarmFactory.addHealthyTaskCountAlarm(
        this.healthyTaskCountMetric,
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
          this.unhealthyTaskCountMetric,
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
          this.healthyTaskPercentMetric,
          alarmProps,
          disambiguator
        );
      this.addAlarm(createdAlarm);
    }
    for (const disambiguator in props.addMinProcessedBytesAlarm) {
      const alarmProps = props.addMinProcessedBytesAlarm[disambiguator];
      const createdAlarm =
        this.throughputAlarmFactory.addMinProcessedBytesAlarm(
          this.processedBytesMetric,
          alarmProps,
          disambiguator
        );
      this.processedBytesAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }

    props.useCreatedAlarms?.consume(this.createdAlarms());
  }

  summaryWidgets(): IWidget[] {
    return [
      this.createTitleWidget(),
      this.createTcpFlowsWidget(HalfWidth, DefaultSummaryWidgetHeight),
      this.createTaskHealthWidget(HalfWidth, DefaultSummaryWidgetHeight),
    ];
  }

  widgets(): IWidget[] {
    return [
      this.createTitleWidget(),
      this.createTcpFlowsWidget(HalfWidth, DefaultGraphWidgetHeight),
      this.createTaskHealthWidget(HalfWidth, DefaultGraphWidgetHeight),
    ];
  }

  protected createTitleWidget() {
    return new MonitoringHeaderWidget({
      family: "Network Load Balancer",
      title: this.humanReadableName,
    });
  }

  protected createTaskHealthWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Task Health",
      left: [this.healthyTaskCountMetric, this.unhealthyTaskCountMetric],
      leftYAxis: CountAxisFromZero,
      leftAnnotations: this.taskHealthAnnotations,
    });
  }

  protected createTcpFlowsWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "TCP Flows",
      left: [this.activeTcpFlowCountMetric, this.newTcpFlowCountMetric],
      leftYAxis: CountAxisFromZero,
      right: [this.processedBytesMetric],
      rightYAxis: SizeAxisBytesFromZero,
    });
  }
}
