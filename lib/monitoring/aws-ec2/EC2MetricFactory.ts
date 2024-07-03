import { IAutoScalingGroup } from "aws-cdk-lib/aws-autoscaling";
import { DimensionsMap, IMetric } from "aws-cdk-lib/aws-cloudwatch";

import {
  BaseMetricFactory,
  BaseMetricFactoryProps,
  MetricFactory,
  MetricStatistic,
} from "../../common";

const EC2Namespace = "AWS/EC2";

export interface IEC2MetricFactoryStrategy {
  createMetrics(
    metricFactory: MetricFactory,
    metricName: string,
    statistic: MetricStatistic,
    region?: string,
    account?: string,
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
    statistic: MetricStatistic,
    region?: string,
    account?: string,
  ) {
    return [
      metricFactory.createMetric(
        metricName,
        statistic,
        undefined,
        resolveDimensions(this.autoScalingGroup, undefined),
        undefined,
        EC2Namespace,
        undefined,
        region,
        account,
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
    statistic: MetricStatistic,
    region?: string,
    account?: string,
  ) {
    return this.instanceIds.map((instanceId) => {
      return metricFactory.createMetric(
        metricName,
        statistic,
        `${metricName} (${instanceId})`,
        resolveDimensions(this.autoScalingGroup, instanceId),
        undefined,
        EC2Namespace,
        undefined,
        region,
        account,
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
    statistic: MetricStatistic,
    region?: string,
    account?: string,
  ) {
    return [
      metricFactory.createMetricSearch(
        `MetricName="${metricName}"`,
        { InstanceId: undefined as unknown as string },
        statistic,
        EC2Namespace,
        undefined,
        undefined,
        region,
        account,
      ),
    ];
  }
}

function resolveDimensions(
  autoScalingGroup?: IAutoScalingGroup,
  instanceId?: string,
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
  props: EC2MetricFactoryProps,
): IEC2MetricFactoryStrategy {
  if (props.instanceIds) {
    // instance filter + optional ASG
    return new SelectedInstancesStrategy(
      props.instanceIds,
      props.autoScalingGroup,
    );
  } else if (props.autoScalingGroup) {
    // ASG only
    return new AutoScalingGroupStrategy(props.autoScalingGroup);
  } else {
    // all instances
    return new AllInstancesStrategy();
  }
}

export interface EC2MetricFactoryProps extends BaseMetricFactoryProps {
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

export class EC2MetricFactory extends BaseMetricFactory<EC2MetricFactoryProps> {
  protected readonly strategy: IEC2MetricFactoryStrategy;

  constructor(metricFactory: MetricFactory, props: EC2MetricFactoryProps) {
    super(metricFactory, props);

    this.strategy = resolveStrategy(props);
  }

  /**
   * The percentage of allocated EC2 compute units that are currently in use on the instance.
   * This metric identifies the processing power required to run an application on a selected instance.
   * Depending on the instance type, tools in your operating system can show a lower percentage than
   * CloudWatch when the instance is not allocated a full processor core.
   */
  metricAverageCpuUtilisationPercent() {
    return this.metric("CPUUtilization", MetricStatistic.AVERAGE);
  }

  /**
   * Bytes read from all instance store volumes available to the instance.
   * This metric is used to determine the volume of the data the application reads from the hard disk of the instance.
   * This can be used to determine the speed of the application.
   */
  metricAverageDiskReadBytes() {
    return this.createDiskMetrics("ReadBytes", MetricStatistic.AVERAGE);
  }

  /**
   * Bytes written to all instance store volumes available to the instance.
   * This metric is used to determine the volume of the data the application writes onto the hard disk of the instance.
   * This can be used to determine the speed of the application.
   */
  metricAverageDiskWriteBytes() {
    return this.createDiskMetrics("WriteBytes", MetricStatistic.AVERAGE);
  }

  /**
   * Completed read operations from all instance store volumes available to the instance in a specified period of time.
   */
  metricAverageDiskReadOps() {
    return this.createDiskMetrics("ReadOps", MetricStatistic.AVERAGE);
  }

  /**
   * Completed write operations to all instance store volumes available to the instance in a specified period of time.
   */
  metricAverageDiskWriteOps() {
    return this.createDiskMetrics("WriteOps", MetricStatistic.AVERAGE);
  }

  /**
   * The number of bytes received on all network interfaces by the instance.
   * This metric identifies the volume of incoming network traffic to a single instance.
   */
  metricAverageNetworkInRateBytes() {
    return this.metric("NetworkIn", MetricStatistic.AVERAGE);
  }

  /**
   * The number of bytes sent out on all network interfaces by the instance.
   * This metric identifies the volume of outgoing network traffic from a single instance.
   */
  metricAverageNetworkOutRateBytes() {
    return this.metric("NetworkOut", MetricStatistic.AVERAGE);
  }

  private createDiskMetrics(metricName: string, statistic: MetricStatistic) {
    const classicMetrics = this.strategy.createMetrics(
      this.metricFactory,
      `Disk${metricName}`,
      statistic,
    );
    const ebsMetrics = this.strategy.createMetrics(
      this.metricFactory,
      `EBS${metricName}`,
      statistic,
    );

    return classicMetrics.map((classic, i) => {
      const ebs = ebsMetrics[i];
      const usingMetrics: Record<string, IMetric> = {};
      const classicId = `${metricName.toLowerCase()}_classic_${i}`;
      const ebsId = `${metricName.toLowerCase()}_ebs_${i}`;
      usingMetrics[classicId] = classic;
      usingMetrics[ebsId] = ebs;
      return this.metricFactory.createMetricMath(
        `AVG(REMOVE_EMPTY([${classicId}, ${ebsId}]))`,
        usingMetrics,
        `Disk${metricName}`,
      );
    });
  }

  private metric(metricName: string, statistic: MetricStatistic) {
    return this.strategy.createMetrics(
      this.metricFactory,
      metricName,
      statistic,
    );
  }
}
