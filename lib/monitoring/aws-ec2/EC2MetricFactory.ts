import { IAutoScalingGroup } from "monocdk/aws-autoscaling";
import { DimensionHash } from "monocdk/aws-cloudwatch";

import { MetricFactory, MetricStatistic } from "../../common";

const EC2Namespace = "AWS/EC2";

export class EC2MetricFactory {
  protected readonly metricFactory: MetricFactory;
  protected readonly autoScalingGroup?: IAutoScalingGroup;

  constructor(
    metricFactory: MetricFactory,
    autoScalingGroup?: IAutoScalingGroup
  ) {
    this.metricFactory = metricFactory;
    this.autoScalingGroup = autoScalingGroup;
  }

  /**
   * The percentage of allocated EC2 compute units that are currently in use on the instance.
   * This metric identifies the processing power required to run an application on a selected instance.
   * Depending on the instance type, tools in your operating system can show a lower percentage than
   * CloudWatch when the instance is not allocated a full processor core.
   */
  metricAverageCpuUtilisationPercent() {
    return this.createMetric("CPUUtilization", MetricStatistic.AVERAGE);
  }

  /**
   * Bytes read from all instance store volumes available to the instance.
   * This metric is used to determine the volume of the data the application reads from the hard disk of the instance.
   * This can be used to determine the speed of the application.
   */
  metricAverageDiskReadBytes() {
    return this.createMetric("DiskReadBytes", MetricStatistic.AVERAGE);
  }

  /**
   * Bytes written to all instance store volumes available to the instance.
   * This metric is used to determine the volume of the data the application writes onto the hard disk of the instance.
   * This can be used to determine the speed of the application.
   */
  metricAverageDiskWriteBytes() {
    return this.createMetric("DiskWriteBytes", MetricStatistic.AVERAGE);
  }

  /**
   * Completed read operations from all instance store volumes available to the instance in a specified period of time.
   */
  metricAverageDiskReadOps() {
    return this.createMetric("DiskReadOps", MetricStatistic.AVERAGE);
  }

  /**
   * Completed write operations to all instance store volumes available to the instance in a specified period of time.
   */
  metricAverageDiskWriteOps() {
    return this.createMetric("DiskWriteOps", MetricStatistic.AVERAGE);
  }

  /**
   * The number of bytes received on all network interfaces by the instance.
   * This metric identifies the volume of incoming network traffic to a single instance.
   */
  metricAverageNetworkInRateBytes() {
    return this.createMetric("NetworkIn", MetricStatistic.AVERAGE);
  }

  /**
   * The number of bytes sent out on all network interfaces by the instance.
   * This metric identifies the volume of outgoing network traffic from a single instance.
   */
  metricAverageNetworkOutRateBytes() {
    return this.createMetric("NetworkOut", MetricStatistic.AVERAGE);
  }

  private createMetric(metricName: string, statistic: MetricStatistic) {
    if (this.autoScalingGroup) {
      return this.metricForAutoScalingGroup(metricName, statistic);
    }
    return this.metricForAllInstances(metricName, statistic);
  }

  private metricForAutoScalingGroup(
    metricName: string,
    statistic: MetricStatistic
  ) {
    const dimensions: DimensionHash = {};
    if (this.autoScalingGroup) {
      dimensions.AutoScalingGroupName =
        this.autoScalingGroup.autoScalingGroupName;
    }
    return this.metricFactory.createMetric(
      metricName,
      statistic,
      undefined,
      dimensions,
      undefined,
      EC2Namespace
    );
  }

  private metricForAllInstances(
    metricName: string,
    statistic: MetricStatistic
  ) {
    return this.metricFactory.createMetricSearch(
      `MetricName="${metricName}"`,
      { InstanceId: undefined },
      statistic,
      EC2Namespace
    );
  }
}
