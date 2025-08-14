import {
  GraphWidget,
  HorizontalAnnotation,
  IMetric,
  IWidget,
} from "aws-cdk-lib/aws-cloudwatch";

import { EC2MetricFactory, EC2MetricFactoryProps } from "./EC2MetricFactory";
import {
  BaseMonitoringProps,
  CountAxisFromZero,
  DefaultGraphWidgetHeight,
  DefaultSummaryWidgetHeight,
  MetricWithAlarmSupport,
  Monitoring,
  MonitoringScope,
  PercentageAxisFromZeroToHundred,
  QuarterWidth,
  SizeAxisBytesFromZero,
  ThirdWidth,
} from "../../common";
import {
  EC2AlarmFactory,
  NetworkInThreshold,
  NetworkOutThreshold,
} from "../../common/monitoring/alarms/EC2AlarmFactory";
import {
  MonitoringHeaderWidget,
  MonitoringNamingStrategy,
} from "../../dashboard";

export interface EC2MonitoringOptions
  extends EC2MetricFactoryProps,
    BaseMonitoringProps {
  readonly addNetworkOutTotalBytesExceedThresholdAlarm?: Record<
    string,
    NetworkOutThreshold
  >;

  readonly addNetworkInTotalBytesExceedThresholdAlarm?: Record<
    string,
    NetworkInThreshold
  >;
}

export interface EC2MonitoringProps extends EC2MonitoringOptions {}

export class EC2Monitoring extends Monitoring {
  readonly family: string;
  readonly title: string;

  readonly ec2AlarmFactory: EC2AlarmFactory;

  readonly cpuUtilisationMetrics: IMetric[];
  readonly diskReadBytesMetrics: IMetric[];
  readonly diskWriteBytesMetrics: IMetric[];
  readonly diskReadOpsMetrics: IMetric[];
  readonly diskWriteOpsMetrics: IMetric[];
  readonly networkInMetrics: MetricWithAlarmSupport[];
  readonly networkOutMetrics: MetricWithAlarmSupport[];

  readonly networkInSumMetrics: MetricWithAlarmSupport[];
  readonly networkOutSumMetrics: MetricWithAlarmSupport[];

  readonly networkInSumLimitAnnotations: HorizontalAnnotation[];
  readonly networkOutSumLimitAnnotations: HorizontalAnnotation[];

  constructor(scope: MonitoringScope, props: EC2MonitoringProps) {
    super(scope, props);

    const fallbackConstructName = props.autoScalingGroup
      ? props.autoScalingGroup.autoScalingGroupName
      : "All Instances";
    const namingStrategy = new MonitoringNamingStrategy({
      ...props,
      fallbackConstructName,
    });
    this.family = props.autoScalingGroup ? "EC2 Auto Scaling Group" : "EC2";
    this.title = namingStrategy.resolveHumanReadableName();
    this.networkOutSumLimitAnnotations = [];
    this.networkInSumLimitAnnotations = [];

    const metricFactory = new EC2MetricFactory(
      scope.createMetricFactory(),
      props,
    );

    // using different fallback alarm construct name
    // as alarms don't allow whitespace
    const fallbackAlarmConstructName = props.autoScalingGroup
      ? props.autoScalingGroup.autoScalingGroupName
      : "All-Instances";
    const namingAlarmStrategy = new MonitoringNamingStrategy({
      ...props,
      fallbackConstructName: fallbackAlarmConstructName,
    });
    const alarmFactory = this.createAlarmFactory(
      namingAlarmStrategy.resolveAlarmFriendlyName(),
    );
    this.ec2AlarmFactory = new EC2AlarmFactory(alarmFactory);

    this.cpuUtilisationMetrics =
      metricFactory.metricAverageCpuUtilisationPercent();
    this.diskReadBytesMetrics = metricFactory.metricAverageDiskReadBytes();
    this.diskWriteBytesMetrics = metricFactory.metricAverageDiskWriteBytes();
    this.diskReadOpsMetrics = metricFactory.metricAverageDiskReadOps();
    this.diskWriteOpsMetrics = metricFactory.metricAverageDiskWriteOps();
    this.networkInMetrics = metricFactory.metricAverageNetworkInRateBytes();
    this.networkOutMetrics = metricFactory.metricAverageNetworkOutRateBytes();

    this.networkInSumMetrics = metricFactory.metricSumNetworkInRateBytes();
    this.networkOutSumMetrics = metricFactory.metricSumNetworkOutRateBytes();

    for (const disambiguator in props.addNetworkInTotalBytesExceedThresholdAlarm) {
      const alarmProps =
        props.addNetworkInTotalBytesExceedThresholdAlarm[disambiguator];

      const createdAlarms = this.networkInMetrics.map((metric) => {
        const createdAlarm = this.ec2AlarmFactory.addNetworkInAlarm(
          metric,
          alarmProps,
          disambiguator,
        );
        this.addAlarm(createdAlarm);
        return createdAlarm;
      });

      if (createdAlarms.length > 0) {
        this.networkInSumLimitAnnotations.push(createdAlarms[0].annotation);
      }
    }

    for (const disambiguator in props.addNetworkOutTotalBytesExceedThresholdAlarm) {
      const alarmProps =
        props.addNetworkOutTotalBytesExceedThresholdAlarm[disambiguator];
      const createdAlarms = this.networkOutSumMetrics.map((metric) => {
        const createdAlarm = this.ec2AlarmFactory.addNetworkOutAlarm(
          metric,
          alarmProps,
          disambiguator,
        );
        this.addAlarm(createdAlarm);
        return createdAlarm;
      });

      if (createdAlarms.length > 0) {
        this.networkInSumLimitAnnotations.push(createdAlarms[0].annotation);
        this.networkOutSumLimitAnnotations.push(createdAlarms[0].annotation);
      }
      props.useCreatedAlarms?.consume(this.createdAlarms());
    }
  }

  summaryWidgets(): IWidget[] {
    return [
      // Title
      this.createTitleWidget(),
      // CPU Usage
      this.createCpuWidget(ThirdWidth, DefaultSummaryWidgetHeight),
      // Disk OPS
      this.createDiskOpsWidget(ThirdWidth, DefaultSummaryWidgetHeight),
      // Network
      this.createNetworkWidget(ThirdWidth, DefaultSummaryWidgetHeight),
    ];
  }

  widgets(): IWidget[] {
    return [
      // Title
      this.createTitleWidget(),
      // CPU Usage
      this.createCpuWidget(QuarterWidth, DefaultGraphWidgetHeight),
      // Disk OPS
      this.createDiskOpsWidget(QuarterWidth, DefaultGraphWidgetHeight),
      // Disk Bytes
      this.createDiskWidget(QuarterWidth, DefaultGraphWidgetHeight),
      // Network
      this.createNetworkWidget(QuarterWidth, DefaultGraphWidgetHeight),
    ];
  }

  createTitleWidget() {
    return new MonitoringHeaderWidget({
      family: this.family,
      title: this.title,
    });
  }

  createCpuWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "CPU Utilization",
      left: [...this.cpuUtilisationMetrics],
      leftYAxis: PercentageAxisFromZeroToHundred,
    });
  }

  createDiskWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Disk - Bytes",
      left: [...this.diskReadBytesMetrics, ...this.diskWriteBytesMetrics],
      leftYAxis: SizeAxisBytesFromZero,
    });
  }

  createDiskOpsWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Disk - OPS",
      left: [...this.diskReadOpsMetrics, ...this.diskWriteOpsMetrics],
      leftYAxis: CountAxisFromZero,
    });
  }

  createNetworkWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Network",
      left: [...this.networkInMetrics, ...this.networkOutMetrics],
      leftYAxis: SizeAxisBytesFromZero,
      right: [...this.networkInSumMetrics, ...this.networkOutSumMetrics],
      rightYAxis: SizeAxisBytesFromZero,
      rightAnnotations: [
        ...this.networkInSumLimitAnnotations,
        ...this.networkOutSumLimitAnnotations,
      ],
    });
  }
}
