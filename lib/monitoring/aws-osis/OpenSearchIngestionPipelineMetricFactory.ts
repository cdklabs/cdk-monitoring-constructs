import type { DimensionsMap } from "aws-cdk-lib/aws-cloudwatch";
import {
  BaseMetricFactoryProps,
  BaseMetricFactory,
  MetricFactory,
  MetricWithAlarmSupport,
  MetricStatistic,
} from "../../common";

const OpenSearchIngestionNamespace = "AWS/OSIS";

export interface OpenSearchIngestionPipelineMetricFactoryProps
  extends BaseMetricFactoryProps {
  readonly subPipelineName: string;
  readonly source: string;
  readonly sink: string;
  readonly pipelineName: string;
}

/**
 * @experimental This is subject to change if an L2 construct becomes available.
 *
 * @see https://docs.aws.amazon.com/opensearch-service/latest/developerguide/monitoring-pipeline-metrics.html
 */
export class OpenSearchIngestionPipelineMetricFactory extends BaseMetricFactory<OpenSearchIngestionPipelineMetricFactoryProps> {
  protected readonly subPipelineName: string;
  protected readonly source: string;
  protected readonly sink: string;

  protected readonly dimensionsMap: DimensionsMap;

  constructor(
    metricFactory: MetricFactory,
    props: OpenSearchIngestionPipelineMetricFactoryProps,
  ) {
    super(metricFactory, props);

    this.subPipelineName = props.subPipelineName;
    this.source = props.source;
    this.sink = props.sink;

    this.dimensionsMap = {
      PipelineName: props.pipelineName,
    };
  }

  metricSourceBytesReceivedSum(): MetricWithAlarmSupport {
    return this.metricFactory.createMetric(
      `${this.subPipelineName}.${this.source}.bytesReceived.sum`,
      MetricStatistic.SUM,
      `${this.source}.bytesReceived.sum`,
      this.dimensionsMap,
      undefined,
      OpenSearchIngestionNamespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricSinkBulkRequestLatencyMax(): MetricWithAlarmSupport {
    return this.metricFactory.createMetric(
      `${this.subPipelineName}.${this.sink}.bulkRequestLatency.max`,
      MetricStatistic.MAX,
      `${this.sink}.bulkRequestLatency.max`,
      this.dimensionsMap,
      undefined,
      OpenSearchIngestionNamespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricSinkBulkPipelineLatencyMax(): MetricWithAlarmSupport {
    return this.metricFactory.createMetric(
      `${this.subPipelineName}.${this.sink}.PipelineLatency.max`,
      MetricStatistic.MAX,
      `${this.sink}.PipelineLatency.max`,
      this.dimensionsMap,
      undefined,
      OpenSearchIngestionNamespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricRecordsProcessedCount(): MetricWithAlarmSupport {
    return this.metricFactory.createMetric(
      `${this.subPipelineName}.recordsProcessed.count`,
      MetricStatistic.SUM,
      "recordsProcessed.count",
      this.dimensionsMap,
      undefined,
      OpenSearchIngestionNamespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricSinkRecordsInCount(): MetricWithAlarmSupport {
    return this.metricFactory.createMetric(
      `${this.subPipelineName}.${this.sink}.recordsIn.count`,
      MetricStatistic.SUM,
      `${this.sink}.recordsIn.count`,
      this.dimensionsMap,
      undefined,
      OpenSearchIngestionNamespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricDlqS3RecordsCount(): MetricWithAlarmSupport {
    return this.metricFactory.createMetricMath(
      "successCount + failedCount",
      {
        successCount: this.metricDlqS3RecordsSuccessCount(),
        failedCount: this.metricDlqS3RecordsFailedCount(),
      },
      "DLQ records count",
    );
  }

  metricDlqS3RecordsSuccessCount(): MetricWithAlarmSupport {
    return this.metricFactory.createMetric(
      `${this.subPipelineName}.${this.sink}.s3.dlqS3RecordsSuccess.count`,
      MetricStatistic.SUM,
      "s3.dlqS3RecordsSuccess.count",
      this.dimensionsMap,
      undefined,
      OpenSearchIngestionNamespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricDlqS3RecordsFailedCount(): MetricWithAlarmSupport {
    return this.metricFactory.createMetric(
      `${this.subPipelineName}.${this.sink}.s3.dlqS3RecordsFailed.count`,
      MetricStatistic.SUM,
      "s3.dlqS3RecordsFailed.count",
      this.dimensionsMap,
      undefined,
      OpenSearchIngestionNamespace,
      undefined,
      this.region,
      this.account,
    );
  }
}
