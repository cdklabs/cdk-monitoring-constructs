import {
  NetworkLoadBalancer,
  NetworkTargetGroup,
} from "aws-cdk-lib/aws-elasticloadbalancingv2";

import {
  HealthyMetricColor,
  MetricFactory,
  MetricStatistic,
  UnhealthyMetricColor,
} from "../../common";
import { ILoadBalancerMetricFactory } from "./LoadBalancerMetricFactory";

/**
 * Props to create NetworkLoadBalancerMetricFactory.
 */
export interface NetworkLoadBalancerMetricFactoryProps {
  readonly networkLoadBalancer: NetworkLoadBalancer;
  readonly networkTargetGroup: NetworkTargetGroup;
}

/**
 * Metric factory to create metrics for network load-balanced service.
 */
export class NetworkLoadBalancerMetricFactory
  implements ILoadBalancerMetricFactory
{
  protected readonly metricFactory: MetricFactory;
  protected readonly networkLoadBalancer: NetworkLoadBalancer;
  protected readonly networkTargetGroup: NetworkTargetGroup;

  constructor(
    metricFactory: MetricFactory,
    props: NetworkLoadBalancerMetricFactoryProps
  ) {
    this.metricFactory = metricFactory;
    this.networkLoadBalancer = props.networkLoadBalancer;
    this.networkTargetGroup = props.networkTargetGroup;
  }

  metricHealthyTaskCount() {
    return this.metricFactory.adaptMetric(
      this.networkTargetGroup.metricHealthyHostCount({
        label: "Healthy Tasks",
        color: HealthyMetricColor,
        statistic: MetricStatistic.MIN,
      })
    );
  }

  metricUnhealthyTaskCount() {
    return this.metricFactory.adaptMetric(
      this.networkTargetGroup.metricUnHealthyHostCount({
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
      this.networkLoadBalancer.metricActiveFlowCount({
        label: "Active",
      })
    );
  }

  metricNewConnectionCount() {
    return this.metricFactory.adaptMetric(
      this.networkLoadBalancer.metricNewFlowCount({
        label: "New",
      })
    );
  }

  metricProcessedBytesMin() {
    return this.metricFactory.adaptMetric(
      this.networkLoadBalancer.metricProcessedBytes({
        statistic: MetricStatistic.MIN,
        label: "Processed Bytes (min)",
      })
    );
  }
}
