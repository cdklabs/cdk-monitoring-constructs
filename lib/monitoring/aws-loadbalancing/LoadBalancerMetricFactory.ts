import {
    IApplicationLoadBalancer,
    IApplicationTargetGroup,
    INetworkLoadBalancer,
    INetworkTargetGroup,
} from "aws-cdk-lib/aws-elasticloadbalancingv2";

import {ApplicationLoadBalancerMetricFactory} from "./ApplicationLoadBalancerMetricFactory";
import {NetworkLoadBalancerMetricFactory} from "./NetworkLoadBalancerMetricFactory";
import {MetricFactory, MetricWithAlarmSupport} from "../../common";

// It's not possible to use instanceOf with typescript interfaces, so we have to use type guards to differentiate
// between the interfaces. As another problem, the LoadBalancer/TargetGroup for both Network and Application types
// don't have distinguished fields that could be used to differentiate between both types, so we resort to using
// the name of the class below.
//
// Ideally the 2 interfaces would provide a specific field to distinguish both types.
function isApplicationLoadBalancer(
    loadBalancer: INetworkLoadBalancer | IApplicationLoadBalancer,
): loadBalancer is IApplicationLoadBalancer {
    return loadBalancer.constructor.name.indexOf("Application") != -1;
}
function isNetworkLoadBalancer(loadBalancer: INetworkLoadBalancer | IApplicationLoadBalancer): loadBalancer is INetworkLoadBalancer {
    return loadBalancer.constructor.name.indexOf("Network") != -1;
}

function isApplicationTargetGroup(targetGroup: INetworkTargetGroup | IApplicationTargetGroup): targetGroup is IApplicationTargetGroup {
    return targetGroup.constructor.name.indexOf("Application") != -1;
}
function isNetworkTargetGroup(targetGroup: INetworkTargetGroup | IApplicationTargetGroup): targetGroup is INetworkTargetGroup {
    return targetGroup.constructor.name.indexOf("Network") != -1;
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
): ILoadBalancerMetricFactory {
    if (isNetworkLoadBalancer(loadBalancer) && isNetworkTargetGroup(targetGroup)) {
        return new NetworkLoadBalancerMetricFactory(metricFactory, {
            networkLoadBalancer: loadBalancer,
            networkTargetGroup: targetGroup,
        });
    } else if (isApplicationLoadBalancer(loadBalancer) && isApplicationTargetGroup(targetGroup)) {
        return new ApplicationLoadBalancerMetricFactory(metricFactory, {
            applicationLoadBalancer: loadBalancer,
            applicationTargetGroup: targetGroup,
        });
    } else {
        throw new Error("Invalid type of load balancer or target group (only ALB and NLB are supported).");
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
