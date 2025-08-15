import { Stack } from "aws-cdk-lib";
import type { DimensionsMap } from "aws-cdk-lib/aws-cloudwatch";
import type { CfnCollection } from "aws-cdk-lib/aws-opensearchserverless";

import {
  BaseMetricFactoryProps,
  RateComputationMethod,
  BaseMetricFactory,
  MetricFactory,
  MetricWithAlarmSupport,
  MetricStatistic,
  LatencyType,
  getLatencyTypeStatistic,
  getLatencyTypeLabel,
} from "../../common";

const OpenSearchServerlessNamespace = "AWS/AOSS";

export interface OpenSearchServerlessMetricFactoryProps
  extends BaseMetricFactoryProps {
  readonly collection: CfnCollection;

  /**
   * @default - {@link RateComputationMethod.AVERAGE}
   */
  readonly rateComputationMethod?: RateComputationMethod;
}

/**
 * @experimental This is subject to change if an L2 construct becomes available.
 *
 * @see https://docs.aws.amazon.com/opensearch-service/latest/developerguide/monitoring-cloudwatch.html
 */
export class OpenSearchServerlessMetricFactory extends BaseMetricFactory<OpenSearchServerlessMetricFactoryProps> {
  protected readonly rateComputationMethod: RateComputationMethod;
  protected readonly dimensionsMap: DimensionsMap;

  constructor(
    metricFactory: MetricFactory,
    props: OpenSearchServerlessMetricFactoryProps,
  ) {
    super(metricFactory, props);

    this.rateComputationMethod =
      props.rateComputationMethod ?? RateComputationMethod.AVERAGE;
    this.dimensionsMap = {
      ClientId: this.account ?? Stack.of(props.collection).account,
      CollectionId: props.collection.attrId,
      CollectionName: props.collection.name,
    };
  }

  metricSearchRequestErrors(): MetricWithAlarmSupport {
    return this.metricFactory.createMetric(
      "SearchRequestErrors",
      MetricStatistic.SUM,
      "SearchRequestErrors",
      this.dimensionsMap,
      undefined,
      OpenSearchServerlessNamespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricSearchRequestLatency(statistic: LatencyType): MetricWithAlarmSupport {
    return this.metricFactory.createMetric(
      "SearchRequestLatency",
      getLatencyTypeStatistic(statistic),
      `SearchRequestLatency ${getLatencyTypeLabel(statistic)}`,
      this.dimensionsMap,
      undefined,
      OpenSearchServerlessNamespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricIngestionRequestSuccess(): MetricWithAlarmSupport {
    return this.metricFactory.createMetric(
      "IngestionRequestSuccess",
      MetricStatistic.SUM,
      "IngestionRequestSuccess",
      this.dimensionsMap,
      undefined,
      OpenSearchServerlessNamespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricIngestionRequestErrors(): MetricWithAlarmSupport {
    return this.metricFactory.createMetric(
      "IngestionRequestErrors",
      MetricStatistic.SUM,
      "IngestionRequestErrors",
      this.dimensionsMap,
      undefined,
      OpenSearchServerlessNamespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricIngestionRequestLatency(
    statistic: LatencyType,
  ): MetricWithAlarmSupport {
    return this.metricFactory.createMetric(
      "IngestionRequestLatency",
      getLatencyTypeStatistic(statistic),
      `IngestionRequestLatency ${getLatencyTypeLabel(statistic)}`,
      this.dimensionsMap,
      undefined,
      OpenSearchServerlessNamespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metric4xxCount(): MetricWithAlarmSupport {
    return this.metricFactory.createMetric(
      "4xx",
      MetricStatistic.SUM,
      "4xx",
      this.dimensionsMap,
      undefined,
      OpenSearchServerlessNamespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metric4xxRate(): MetricWithAlarmSupport {
    return this.metricFactory.toRate(
      this.metric4xxCount(),
      this.rateComputationMethod,
      false,
      "errors",
    );
  }

  metric5xxCount(): MetricWithAlarmSupport {
    return this.metricFactory.createMetric(
      "5xx",
      MetricStatistic.SUM,
      "5xx",
      this.dimensionsMap,
      undefined,
      OpenSearchServerlessNamespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metric5xxRate(): MetricWithAlarmSupport {
    return this.metricFactory.toRate(
      this.metric5xxCount(),
      this.rateComputationMethod,
      false,
      "faults",
    );
  }
}
