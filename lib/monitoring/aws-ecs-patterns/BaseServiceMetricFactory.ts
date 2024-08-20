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
    return this.metricFactory.metric({
      metricName: "CPUUtilization",
      statistic: MetricStatistic.AVERAGE,
      label: "Cluster CPU Utilization",
      dimensionsMap: this.dimensionsMap,
      namespace: EcsNamespace,
      region: this.region,
      account: this.account,
    });
  }

  metricClusterMemoryUtilisationInPercent() {
    return this.metricFactory.metric({
      metricName: "MemoryUtilization",
      statistic: MetricStatistic.AVERAGE,
      label: "Cluster Memory Utilization",
      dimensionsMap: this.dimensionsMap,
      namespace: EcsNamespace,
      region: this.region,
      account: this.account,
    });
  }

  metricRunningTaskCount() {
    return this.metricFactory.metric({
      metricName: "RunningTaskCount",
      statistic: MetricStatistic.AVERAGE,
      label: "Running Tasks",
      dimensionsMap: this.dimensionsMap,
      namespace: EcsContainerInsightsNamespace,
      region: this.region,
      account: this.account,
    });
  }

  metricEphemeralStorageReserved() {
    return this.metricFactory.metric({
      metricName: "EphemeralStorageReserved",
      statistic: MetricStatistic.MAX,
      label: "Ephemeral Storage Reserved",
      dimensionsMap: this.dimensionsMap,
      namespace: EcsContainerInsightsNamespace,
      region: this.region,
      account: this.account,
    });
  }

  metricEphemeralStorageUtilized() {
    return this.metricFactory.metric({
      metricName: "EphemeralStorageUtilized",
      statistic: MetricStatistic.MAX,
      label: "Ephemeral Storage Utilized",
      dimensionsMap: this.dimensionsMap,
      namespace: EcsContainerInsightsNamespace,
      region: this.region,
      account: this.account,
    });
  }

  metricEphemeralStorageUsageInPercent() {
    return this.metricFactory.createMetricMath(
      "100 * (used/total)",
      {
        used: this.metricEphemeralStorageUtilized(),
        total: this.metricEphemeralStorageReserved(),
      },
      "Ephemeral Storage Usage",
    );
  }
}
