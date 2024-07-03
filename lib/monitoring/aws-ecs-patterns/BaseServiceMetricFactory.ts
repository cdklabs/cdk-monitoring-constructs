import { DimensionsMap } from "aws-cdk-lib/aws-cloudwatch";
import { IBaseService } from "aws-cdk-lib/aws-ecs";

import {
  BaseMetricFactory,
  BaseMetricFactoryProps,
  MetricFactory,
  MetricStatistic,
} from "../../common";

const EcsNamespace = "AWS/ECS";
const EcsContainerInsightsNamespace = "ECS/ContainerInsights";

/**
 * Props to create BaseServiceMetricFactory.
 */
export interface BaseServiceMetricFactoryProps extends BaseMetricFactoryProps {
  readonly service: IBaseService;
}

/**
 * Metric factory for a base service (parent class for e.g. Fargate and EC2 services).
 */
export class BaseServiceMetricFactory extends BaseMetricFactory<BaseServiceMetricFactoryProps> {
  protected readonly dimensionsMap: DimensionsMap;
  /**
   * @deprecated This isn't required by cdk-monitoring-constructs anymore; use your own reference.
   */
  protected readonly service: IBaseService;

  constructor(
    metricFactory: MetricFactory,
    props: BaseServiceMetricFactoryProps,
  ) {
    super(metricFactory, props);

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
      EcsNamespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricClusterMemoryUtilisationInPercent() {
    return this.metricFactory.createMetric(
      "MemoryUtilization",
      MetricStatistic.AVERAGE,
      "Cluster Memory Utilization",
      this.dimensionsMap,
      undefined,
      EcsNamespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricRunningTaskCount() {
    return this.metricFactory.createMetric(
      "RunningTaskCount",
      MetricStatistic.AVERAGE,
      "Running Tasks",
      this.dimensionsMap,
      undefined,
      EcsContainerInsightsNamespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricEphemeralStorageReserved() {
    return this.metricFactory.createMetric(
      "EphemeralStorageReserved",
      MetricStatistic.MAX,
      "Ephemeral Storage Reserved",
      this.dimensionsMap,
      undefined,
      EcsContainerInsightsNamespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricEphemeralStorageUtilized() {
    return this.metricFactory.createMetric(
      "EphemeralStorageUtilized",
      MetricStatistic.MAX,
      "Ephemeral Storage Utilized",
      this.dimensionsMap,
      undefined,
      EcsContainerInsightsNamespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricEphemeralStorageUsageInPercent() {
    const total = this.metricEphemeralStorageReserved();
    const used = this.metricEphemeralStorageUtilized();

    return this.metricFactory.createMetricMath(
      "100 * (used/total)",
      { used, total },
      "Ephemeral Storage Usage",
    );
  }
}
