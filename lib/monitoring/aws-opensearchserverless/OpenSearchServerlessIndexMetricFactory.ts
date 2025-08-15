import { Stack } from "aws-cdk-lib";
import type { DimensionsMap } from "aws-cdk-lib/aws-cloudwatch";
import type { CfnCollection } from "aws-cdk-lib/aws-opensearchserverless";
import {
  BaseMetricFactoryProps,
  BaseMetricFactory,
  MetricFactory,
  MetricWithAlarmSupport,
  MetricStatistic,
} from "../../common";

const OpenSearchServerlessNamespace = "AWS/AOSS";

export interface OpenSearchServerlessIndexMetricFactoryProps
  extends BaseMetricFactoryProps {
  readonly collection: CfnCollection;
  readonly indexId: string;
  readonly indexName: string;
}

/**
 * @experimental This is subject to change if an L2 construct becomes available.
 *
 * @see https://docs.aws.amazon.com/opensearch-service/latest/developerguide/monitoring-cloudwatch.html
 */
export class OpenSearchServerlessIndexMetricFactory extends BaseMetricFactory<OpenSearchServerlessIndexMetricFactoryProps> {
  protected readonly dimensionsMap: DimensionsMap;

  constructor(
    metricFactory: MetricFactory,
    props: OpenSearchServerlessIndexMetricFactoryProps,
  ) {
    super(metricFactory, props);

    this.dimensionsMap = {
      ClientId: this.account ?? Stack.of(props.collection).account,
      CollectionId: props.collection.attrId,
      CollectionName: props.collection.name,
      IndexId: props.indexId,
      IndexName: props.indexName,
    };
  }

  metricIndexSearchableDocuments(): MetricWithAlarmSupport {
    return this.metricFactory.createMetric(
      "SearchableDocuments",
      MetricStatistic.SUM,
      `SearchableDocuments: ${this.dimensionsMap.IndexName}`,
      this.dimensionsMap,
      undefined,
      OpenSearchServerlessNamespace,
      undefined,
      this.region,
      this.account,
    );
  }
}
