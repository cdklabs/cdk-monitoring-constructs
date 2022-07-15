import { IAutoScalingGroup } from "aws-cdk-lib/aws-autoscaling";
import { DimensionsMap, IMetric } from "aws-cdk-lib/aws-cloudwatch";

import { MetricFactory, MetricStatistic } from "../../common";

const EC2Namespace = "AWS/EC2";

export interface IEC2MetricFactoryStrategy {
  createMetrics(
    metricFactory: MetricFactory,
    metricName: string,
    statistic: MetricStatistic
  ): IMetric[];
}

/**
 * Creates a single metric for the whole ASG.
 */
class AutoScalingGroupStrategy implements IEC2MetricFactoryStrategy {
  protected autoScalingGroup: IAutoScalingGroup;

  constructor(autoScalingGroup: IAutoScalingGroup) {
    this.autoScalingGroup = autoScalingGroup;
  }

  createMetrics(
    metricFactory: MetricFactory,
    metricName: string,
    statistic: MetricStatistic
  ) {
    return [
      metricFactory.createMetric(
        metricName,
        statistic,
        undefined,
        resolveDimensions(this.autoScalingGroup, undefined),
        undefined,
        EC2Namespace
      ),
    ];
  }
}

/**
 * Creates multiple metrics (one for each instance) with an optional ASG filter.
 */
class SelectedInstancesStrategy implements IEC2MetricFactoryStrategy {
  protected instanceIds: string[];
  protected autoScalingGroup?: IAutoScalingGroup;

  constructor(instanceIds: string[], autoScalingGroup?: IAutoScalingGroup) {
    this.instanceIds = instanceIds;
    this.autoScalingGroup = autoScalingGroup;
  }

  createMetrics(
    metricFactory: MetricFactory,
    metricName: string,
    statistic: MetricStatistic
  ) {
    return this.instanceIds.map((instanceId) => {
      return metricFactory.createMetric(
        metricName,
        statistic,
        `${metricName} (${instanceId})`,
        resolveDimensions(this.autoScalingGroup, instanceId),
        undefined,
        EC2Namespace
      );
    });
  }
}

/**
 * Creates a single metric search expression for all instances.
 */
class AllInstancesStrategy implements IEC2MetricFactoryStrategy {
  createMetrics(
    metricFactory: MetricFactory,
    metricName: string,
    statistic: MetricStatistic
  ) {
    return [
      metricFactory.createMetricSearch(
        `MetricName="${metricName}"`,
        { InstanceId: undefined as unknown as string },
        statistic,
        EC2Namespace
      ),
    ];
  }
}

function resolveDimensions(
  autoScalingGroup?: IAutoScalingGroup,
  instanceId?: string
): DimensionsMap {
  const dimensions: DimensionsMap = {};
  if (autoScalingGroup) {
    dimensions.AutoScalingGroupName = autoScalingGroup.autoScalingGroupName;
  }
  if (instanceId) {
    dimensions.InstanceId = instanceId;
  }
  return dimensions;
}

function resolveStrategy(
  props: EC2MetricFactoryProps
): IEC2MetricFactoryStrategy {
  if (props.instanceIds) {
    // instance filter + optional ASG
    return new SelectedInstancesStrategy(
      props.instanceIds,
      props.autoScalingGroup
    );
  } else if (props.autoScalingGroup) {
    // ASG only
    return new AutoScalingGroupStrategy(props.autoScalingGroup);
  } else {
    // all instances
    return new AllInstancesStrategy();
  }
}

export interface EC2MetricFactoryProps {
  /**
   * Auto-Scaling Group to monitor.
   * @default - no Auto-Scaling Group filter
   */
  readonly autoScalingGroup?: IAutoScalingGroup;
  /**
   * Selected IDs of EC2 instances to monitor.
   * @default - no instance filter
   */
  readonly instanceIds?: string[];
}

export class EC2MetricFactory {
  protected readonly metricFactory: MetricFactory;
  protected readonly strategy: IEC2MetricFactoryStrategy;

  constructor(metricFactory: MetricFactory, props: EC2MetricFactoryProps) {
    this.metricFactory = metricFactory;
    this.strategy = resolveStrategy(props);
  }

  /**
   * The percentage of allocated EC2 compute units that are currently in use on the instance.
   * This metric identifies the processing power required to run an application on a selected instance.
   * Depending on the instance type, tools in your operating system can show a lower percentage than
   * CloudWatch when the instance is not allocated a full processor core.
   */
  metricAverageCpuUtilisationPercent() {
    return this.createMetrics("CPUUtilization", MetricStatistic.AVERAGE);
  }

  /**
   * Bytes read from all instance store volumes available to the instance.
   * This metric is used to determine the volume of the data the application reads from the hard disk of the instance.
   * This can be used to determine the speed of the application.
   */
  metricAverageDiskReadBytes() {
    return this.createMetrics("DiskReadBytes", MetricStatistic.AVERAGE);
  }

  /**
   * Bytes written to all instance store volumes available to the instance.
   * This metric is used to determine the volume of the data the application writes onto the hard disk of the instance.
   * This can be used to determine the speed of the application.
   */
  metricAverageDiskWriteBytes() {
    return this.createMetrics("DiskWriteBytes", MetricStatistic.AVERAGE);
  }

  /**
   * Completed read operations from all instance store volumes available to the instance in a specified period of time.
   */
  metricAverageDiskReadOps() {
    return this.createMetrics("DiskReadOps", MetricStatistic.AVERAGE);
  }

  /**
   * Completed write operations to all instance store volumes available to the instance in a specified period of time.
   */
  metricAverageDiskWriteOps() {
    return this.createMetrics("DiskWriteOps", MetricStatistic.AVERAGE);
  }

  /**
   * The number of bytes received on all network interfaces by the instance.
   * This metric identifies the volume of incoming network traffic to a single instance.
   */
  metricAverageNetworkInRateBytes() {
    return this.createMetrics("NetworkIn", MetricStatistic.AVERAGE);
  }

  /**
   * The number of bytes sent out on all network interfaces by the instance.
   * This metric identifies the volume of outgoing network traffic from a single instance.
   */
  metricAverageNetworkOutRateBytes() {
    return this.createMetrics("NetworkOut", MetricStatistic.AVERAGE);
  }

  private createMetrics(metricName: string, statistic: MetricStatistic) {
    return this.strategy.createMetrics(
      this.metricFactory,
      metricName,
      statistic
    );
  }
}
