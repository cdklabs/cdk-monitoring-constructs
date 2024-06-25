import {
  IApplicationLoadBalancer,
  IApplicationTargetGroup,
  INetworkLoadBalancer,
  INetworkTargetGroup,
} from "aws-cdk-lib/aws-elasticloadbalancingv2";

import { ApplicationLoadBalancerMetricFactory } from "./ApplicationLoadBalancerMetricFactory";
import { NetworkLoadBalancerMetricFactory } from "./NetworkLoadBalancerMetricFactory";
import { MetricFactory, MetricWithAlarmSupport } from "../../common";

// It's not possible to use instanceOf with typescript interfaces, so we have to use type guards to differentiate
// between the interfaces. As another problem, the LoadBalancer/TargetGroup for both Network and Application types
// don't have distinguished fields that could be used to differentiate between both types, so we resort to using
// checking for unique methods in their metrics interfaces.
function isApplicationLoadBalancer(
  loadBalancer: INetworkLoadBalancer | IApplicationLoadBalancer,
): loadBalancer is IApplicationLoadBalancer {
  return !!(loadBalancer.metrics as any).httpRedirectCount;
}
function isNetworkLoadBalancer(
  loadBalancer: INetworkLoadBalancer | IApplicationLoadBalancer,
): loadBalancer is INetworkLoadBalancer {
  return !isApplicationLoadBalancer(loadBalancer);
}

function isApplicationTargetGroup(
  targetGroup: INetworkTargetGroup | IApplicationTargetGroup,
): targetGroup is IApplicationTargetGroup {
  return !!(targetGroup.metrics as any).httpCodeTarget;
}
function isNetworkTargetGroup(
  targetGroup: INetworkTargetGroup | IApplicationTargetGroup,
): targetGroup is INetworkTargetGroup {
  return !isApplicationTargetGroup(targetGroup);
}

/**
 * Factory method to create appropriate metric factory based on the load balancer and target group type.
 * @param metricFactory metric factory
 * @param loadBalancer load balancer
 * @param targetGroup target group
 */
export function createLoadBalancerMetricFactory(
  metricFactory: MetricFactory,
  loadBalancer: INetworkLoadBalancer | IApplicationLoadBalancer,
  targetGroup: INetworkTargetGroup | IApplicationTargetGroup,
  invertStatisticsOfTaskCountEnabled?: boolean,
): ILoadBalancerMetricFactory {
  if (
    isNetworkLoadBalancer(loadBalancer) &&
    isNetworkTargetGroup(targetGroup)
  ) {
    return new NetworkLoadBalancerMetricFactory(metricFactory, {
      networkLoadBalancer: loadBalancer,
      networkTargetGroup: targetGroup,
      invertStatisticsOfTaskCountEnabled: invertStatisticsOfTaskCountEnabled,
    });
  } else if (
    isApplicationLoadBalancer(loadBalancer) &&
    isApplicationTargetGroup(targetGroup)
  ) {
    return new ApplicationLoadBalancerMetricFactory(metricFactory, {
      applicationLoadBalancer: loadBalancer,
      applicationTargetGroup: targetGroup,
      invertStatisticsOfTaskCountEnabled: invertStatisticsOfTaskCountEnabled,
    });
  } else {
    throw new Error(
      "Invalid type of load balancer or target group (only ALB and NLB are supported).",
    );
  }
}

/**
 * Base of Monitoring props for load-balancer metric factories.
 */
export interface BaseLoadBalancerMetricFactoryProps {
  /**
   * Invert the statistics of `HealthyHostCount` and `UnHealthyHostCount`.
   *
   * When `invertStatisticsOfTaskCountEnabled` is set to false, the minimum of `HealthyHostCount` and the maximum of `UnHealthyHostCount` are monitored.
   * When `invertStatisticsOfTaskCountEnabled` is set to true, the maximum of `HealthyHostCount` and the minimum of `UnHealthyHostCount` are monitored.
   *
   * `invertStatisticsOfTaskCountEnabled` is recommended to set to true as per the guidelines at
https://docs.aws.amazon.com/elasticloadbalancing/latest/network/load-balancer-cloudwatch-metrics.html#metric-statistics
   *
   * @default false
   */
  readonly invertStatisticsOfTaskCountEnabled?: boolean;
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

  metricUnhealthyRoutingCount(): MetricWithAlarmSupport;

  metricProcessedBytesMin(): MetricWithAlarmSupport;
}
