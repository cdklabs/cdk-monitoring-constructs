import { DimensionsMap } from "aws-cdk-lib/aws-cloudwatch";
import { IBaseService } from "aws-cdk-lib/aws-ecs";

import { MetricFactory, MetricStatistic } from "../../common";

const EcsNamespace = "AWS/ECS";
const EcsContainerInsightsNamespace = "ECS/ContainerInsights";

/**
 * Props to create BaseServiceMetricFactory.
 */
export interface BaseServiceMetricFactoryProps {
  readonly service: IBaseService;
}

/**
 * Metric factory for a base service (parent class for e.g. Fargate and EC2 services).
 */
export class BaseServiceMetricFactory {
  protected readonly metricFactory: MetricFactory;
  protected readonly dimensionsMap: DimensionsMap;
  /**
   * @deprecated This isn't required by cdk-monitoring-constructs anymore; use your own reference.
   */
  protected readonly service: IBaseService;

  constructor(
    metricFactory: MetricFactory,
    props: BaseServiceMetricFactoryProps
  ) {
    this.metricFactory = metricFactory;
    this.dimensionsMap = {
      ClusterName: props.service.cluster.clusterName,
      ServiceName: props.service.serviceName,
    };
    this.service = props.service;
  }

  metricClusterCpuUtilisationInPercent() {
    return this.metricFactory.createMetric(
      "CPUUtilization",
      MetricStatistic.AVERAGE,
      "Cluster CPU Utilization",
      this.dimensionsMap,
      undefined,
      EcsNamespace
    );
  }

  metricClusterMemoryUtilisationInPercent() {
    return this.metricFactory.createMetric(
      "MemoryUtilization",
      MetricStatistic.AVERAGE,
      "Cluster Memory Utilization",
      this.dimensionsMap,
      undefined,
      EcsNamespace
    );
  }

  metricRunningTaskCount() {
    return this.metricFactory.createMetric(
      "RunningTaskCount",
      MetricStatistic.AVERAGE,
      "Running Tasks",
      this.dimensionsMap,
      undefined,
      EcsContainerInsightsNamespace
    );
  }
}
