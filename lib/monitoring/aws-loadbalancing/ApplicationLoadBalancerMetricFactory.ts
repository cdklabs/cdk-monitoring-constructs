import {
  IApplicationLoadBalancer,
  IApplicationTargetGroup,
} from "aws-cdk-lib/aws-elasticloadbalancingv2";

import { ILoadBalancerMetricFactory } from "./LoadBalancerMetricFactory";
import {
  HealthyMetricColor,
  MetricFactory,
  MetricStatistic,
  UnhealthyMetricColor,
} from "../../common";

/**
 * Props to create ApplicationLoadBalancerMetricFactory.
 */
export interface ApplicationLoadBalancerMetricFactoryProps {
  readonly applicationLoadBalancer: IApplicationLoadBalancer;
  readonly applicationTargetGroup: IApplicationTargetGroup;
}

/**
 * Metric factory to create metrics for application load-balanced service.
 */
export class ApplicationLoadBalancerMetricFactory
  implements ILoadBalancerMetricFactory
{
  protected readonly metricFactory: MetricFactory;
  protected readonly applicationLoadBalancer: IApplicationLoadBalancer;
  protected readonly applicationTargetGroup: IApplicationTargetGroup;

  constructor(
    metricFactory: MetricFactory,
    props: ApplicationLoadBalancerMetricFactoryProps
  ) {
    this.metricFactory = metricFactory;
    this.applicationLoadBalancer = props.applicationLoadBalancer;
    this.applicationTargetGroup = props.applicationTargetGroup;
  }

  metricHealthyTaskCount() {
    return this.metricFactory.adaptMetric(
      this.applicationTargetGroup.metrics.healthyHostCount({
        label: "Healthy Tasks",
        color: HealthyMetricColor,
        statistic: MetricStatistic.MIN,
      })
    );
  }

  metricUnhealthyTaskCount() {
    return this.metricFactory.adaptMetric(
      this.applicationTargetGroup.metrics.unhealthyHostCount({
        label: "Unhealthy Tasks",
        color: UnhealthyMetricColor,
        statistic: MetricStatistic.MAX,
      })
    );
  }

  metricHealthyTaskInPercent() {
    const healthyTaskCount = this.metricHealthyTaskCount();
    const unhealthyTaskCount = this.metricUnhealthyTaskCount();
    return this.metricFactory.createMetricMath(
      "(healthyTaskCount / (healthyTaskCount + unhealthyTaskCount)) * 100",
      { healthyTaskCount, unhealthyTaskCount },
      "Healthy Task Percent (avg: ${AVG})"
    );
  }

  metricActiveConnectionCount() {
    return this.metricFactory.adaptMetric(
      this.applicationLoadBalancer.metrics.activeConnectionCount({
        label: "Active",
      })
    );
  }

  metricNewConnectionCount() {
    return this.metricFactory.adaptMetric(
      this.applicationLoadBalancer.metrics.newConnectionCount({
        label: "New",
      })
    );
  }

  metricProcessedBytesMin() {
    return this.metricFactory.adaptMetric(
      this.applicationLoadBalancer.metrics.processedBytes({
        statistic: MetricStatistic.MIN,
        label: "Processed Bytes (min)",
      })
    );
  }
}
