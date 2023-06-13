import { BaseService } from "aws-cdk-lib/aws-ecs";

import { MetricFactory, MetricStatistic } from "../../common";

const EcsContainerInsightsNamespace = "ECS/ContainerInsights";

/**
 * Props to create BaseServiceMetricFactory.
 */
export interface BaseServiceMetricFactoryProps {
  readonly service: BaseService;
}

/**
 * Metric factory for a base service (parent class for e.g. Fargate and EC2 services).
 */
export class BaseServiceMetricFactory {
  protected readonly metricFactory: MetricFactory;
  protected readonly service: BaseService;

  constructor(
    metricFactory: MetricFactory,
    props: BaseServiceMetricFactoryProps
  ) {
    this.metricFactory = metricFactory;
    this.service = props.service;
  }

  metricClusterCpuUtilisationInPercent() {
    return this.metricFactory.adaptMetric(
      this.service.metricCpuUtilization({
        label: "Cluster CPU Utilization",
      })
    );
  }

  metricClusterMemoryUtilisationInPercent() {
    return this.metricFactory.adaptMetric(
      this.service.metricMemoryUtilization({
        label: "Cluster Memory Utilization",
      })
    );
  }

  metricRunningTaskCount() {
    return this.metricFactory.createMetric(
      "RunningTaskCount",
      MetricStatistic.AVERAGE,
      "Running Tasks",
      {
        ServiceName: this.service.serviceName,
        ClusterName: this.service.cluster.clusterName,
      },
      undefined,
      EcsContainerInsightsNamespace
    );
  }
}
