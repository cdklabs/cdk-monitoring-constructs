import {
  ApplicationLoadBalancer,
  ApplicationTargetGroup,
  NetworkLoadBalancer,
  NetworkTargetGroup,
} from "aws-cdk-lib/aws-elasticloadbalancingv2";

import { MetricFactory, MetricWithAlarmSupport } from "../../common";
import { ApplicationLoadBalancerMetricFactory } from "./ApplicationLoadBalancerMetricFactory";
import { NetworkLoadBalancerMetricFactory } from "./NetworkLoadBalancerMetricFactory";

/**
 * Factory method to create appropriate metric factory based on the load balancer and target group type.
 * @param metricFactory metric factory
 * @param loadBalancer load balancer
 * @param targetGroup target group
 */
export function createLoadBalancerMetricFactory(
  metricFactory: MetricFactory,
  loadBalancer: any,
  targetGroup: any
): ILoadBalancerMetricFactory {
  if (
    loadBalancer instanceof NetworkLoadBalancer &&
    targetGroup instanceof NetworkTargetGroup
  ) {
    return new NetworkLoadBalancerMetricFactory(metricFactory, {
      networkLoadBalancer: loadBalancer,
      networkTargetGroup: targetGroup,
    });
  } else if (
    loadBalancer instanceof ApplicationLoadBalancer &&
    targetGroup instanceof ApplicationTargetGroup
  ) {
    return new ApplicationLoadBalancerMetricFactory(metricFactory, {
      applicationLoadBalancer: loadBalancer,
      applicationTargetGroup: targetGroup,
    });
  } else {
    throw new Error(
      "Invalid type of load balancer or target group (only ALB and ELB is supported)."
    );
  }
}

/**
 * Common interface for load-balancer based service metric factories.
 */
export interface ILoadBalancerMetricFactory {
  metricHealthyTaskCount(): MetricWithAlarmSupport;

  metricUnhealthyTaskCount(): MetricWithAlarmSupport;

  metricHealthyTaskInPercent(): MetricWithAlarmSupport;

  metricActiveConnectionCount(): MetricWithAlarmSupport;

  metricNewConnectionCount(): MetricWithAlarmSupport;

  metricProcessedBytesMin(): MetricWithAlarmSupport;
}
