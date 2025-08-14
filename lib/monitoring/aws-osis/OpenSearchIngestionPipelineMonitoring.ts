import type { HorizontalAnnotation, IWidget } from "aws-cdk-lib/aws-cloudwatch";
import { GraphWidget, Row } from "aws-cdk-lib/aws-cloudwatch";

import type { OpenSearchIngestionPipelineMetricFactoryProps } from "./OpenSearchIngestionPipelineMetricFactory";
import { OpenSearchIngestionPipelineMetricFactory } from "./OpenSearchIngestionPipelineMetricFactory";
import {
  BaseMonitoringProps,
  MaxUsageCountThreshold,
  MetricWithAlarmSupport,
  Monitoring,
  AlarmFactory,
  UsageAlarmFactory,
  MonitoringScope,
  ThirdWidth,
  DefaultGraphWidgetHeight,
  TimeAxisMillisFromZero,
  CountAxisFromZero,
} from "../../common";
import {
  MonitoringNamingStrategy,
  MonitoringHeaderWidget,
} from "../../dashboard";

export interface OpenSearchIngestionPipelineMonitoringOptions
  extends BaseMonitoringProps {
  readonly addMaxDlqS3CountAlarm?: Record<string, MaxUsageCountThreshold>;
}

export interface OpenSearchIngestionPipelineMonitoringProps
  extends OpenSearchIngestionPipelineMetricFactoryProps,
    OpenSearchIngestionPipelineMonitoringOptions {}

/**
 * @experimental This is subject to change if an L2 construct becomes available.
 */
export class OpenSearchIngestionPipelineMonitoring extends Monitoring {
  readonly title: string;
  readonly pipelineUrl?: string;

  readonly metricSinkRecordsInCount: MetricWithAlarmSupport;
  readonly metricSourceBytesReceivedSum: MetricWithAlarmSupport;
  readonly metricSinkBulkRequestLatencyMax: MetricWithAlarmSupport;
  readonly metricSinkBulkPipelineLatencyMax: MetricWithAlarmSupport;
  readonly metricDlqS3RecordsCount: MetricWithAlarmSupport;

  readonly alarmFactory: AlarmFactory;
  readonly usageAlarmFactory: UsageAlarmFactory;

  readonly usageAnnotations: HorizontalAnnotation[];

  constructor(
    scope: MonitoringScope,
    props: OpenSearchIngestionPipelineMonitoringProps,
  ) {
    super(scope, props);

    const namingStrategy = new MonitoringNamingStrategy({
      ...props,
      fallbackConstructName: props.pipelineName,
    });
    this.title = namingStrategy.resolveHumanReadableName();
    this.pipelineUrl = scope
      .createAwsConsoleUrlFactory()
      .getOsisPipelineUrl(props.pipelineName);

    this.alarmFactory = this.createAlarmFactory(
      namingStrategy.resolveAlarmFriendlyName(),
    );
    this.usageAlarmFactory = new UsageAlarmFactory(this.alarmFactory);

    this.usageAnnotations = [];

    const metricFactory = new OpenSearchIngestionPipelineMetricFactory(
      scope.createMetricFactory(),
      props,
    );

    this.metricSinkRecordsInCount = metricFactory.metricSinkRecordsInCount();
    this.metricSourceBytesReceivedSum =
      metricFactory.metricSourceBytesReceivedSum();
    this.metricSinkBulkRequestLatencyMax =
      metricFactory.metricSinkBulkRequestLatencyMax();
    this.metricSinkBulkPipelineLatencyMax =
      metricFactory.metricSinkBulkPipelineLatencyMax();
    this.metricDlqS3RecordsCount = metricFactory.metricDlqS3RecordsCount();

    for (const disambiguator in props.addMaxDlqS3CountAlarm) {
      const alarmProps = props.addMaxDlqS3CountAlarm[disambiguator];
      const createdAlarm = this.usageAlarmFactory.addMaxCountAlarm(
        this.metricDlqS3RecordsCount,
        alarmProps,
        disambiguator,
      );
      this.usageAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }

    props.useCreatedAlarms?.consume(this.createdAlarms());
  }

  summaryWidgets(): IWidget[] {
    return this.widgets();
  }

  widgets(): IWidget[] {
    return [
      this.createTitleWidget(),
      new Row(
        this.createLatencyWidget(ThirdWidth, DefaultGraphWidgetHeight),
        this.createIncomingDataWidget(ThirdWidth, DefaultGraphWidgetHeight),
        this.createDlqS3Widget(ThirdWidth, DefaultGraphWidgetHeight),
      ),
    ];
  }

  protected createTitleWidget(): IWidget {
    return new MonitoringHeaderWidget({
      family: "OpenSearch Ingestion",
      title: this.title,
      goToLinkUrl: this.pipelineUrl,
    });
  }

  protected createLatencyWidget(width: number, height: number): IWidget {
    return new GraphWidget({
      width,
      height,
      title: "Latency",
      left: [
        this.metricSinkBulkRequestLatencyMax,
        this.metricSinkBulkPipelineLatencyMax,
      ],
      leftYAxis: TimeAxisMillisFromZero,
    });
  }

  protected createIncomingDataWidget(width: number, height: number): IWidget {
    return new GraphWidget({
      width,
      height,
      title: "Incoming data",
      left: [this.metricSinkRecordsInCount],
      leftYAxis: CountAxisFromZero,
      right: [this.metricSourceBytesReceivedSum],
      rightYAxis: CountAxisFromZero,
    });
  }

  protected createDlqS3Widget(width: number, height: number): IWidget {
    return new GraphWidget({
      width,
      height,
      title: "DLQ",
      left: [this.metricDlqS3RecordsCount],
      leftYAxis: CountAxisFromZero,
      leftAnnotations: this.usageAnnotations,
    });
  }
}
