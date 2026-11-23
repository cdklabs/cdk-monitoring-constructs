import { Duration } from "aws-cdk-lib";
import { DimensionsMap } from "aws-cdk-lib/aws-cloudwatch";
import { IFileSystem } from "aws-cdk-lib/aws-efs";

import {
  BaseMetricFactory,
  BaseMetricFactoryProps,
  MetricFactory,
  MetricStatistic,
} from "../../common";

const EfsNamespace = "AWS/EFS";

/**
 * EFS storage classes reported by the StorageBytes metric.
 * See https://docs.aws.amazon.com/efs/latest/ug/efs-metrics.html
 */
export enum EfsStorageClass {
  TOTAL = "Total",
  STANDARD = "Standard",
  IA = "IA",
  IA_SIZE_OVERHEAD = "IASizeOverhead",
  ARCHIVE = "Archive",
  ARCHIVE_SIZE_OVERHEAD = "ArchiveSizeOverhead",
}

export interface EfsMetricFactoryProps extends BaseMetricFactoryProps {
  /**
   * file system to monitor
   */
  readonly fileSystem: IFileSystem;
}

/**
 * Metric math divides by PERIOD() so rates stay per-second when a dashboard widens the period,
 * matching the graphs in the EFS console.
 */
export class EfsMetricFactory extends BaseMetricFactory {
  readonly fileSystemId: string;
  protected readonly dimensionsMap: DimensionsMap;

  constructor(metricFactory: MetricFactory, props: EfsMetricFactoryProps) {
    super(metricFactory, props);

    this.fileSystemId = props.fileSystem.fileSystemId;
    this.dimensionsMap = { FileSystemId: this.fileSystemId };
  }

  metricThroughputUtilizationPercent() {
    return this.metricFactory.createMetricMath(
      "100 * (metered / PERIOD(metered)) / permitted",
      {
        metered: this.metric("MeteredIOBytes", MetricStatistic.SUM, "Metered"),
        permitted: this.metric(
          "PermittedThroughput",
          MetricStatistic.AVERAGE,
          "Permitted",
        ),
      },
      "Throughput utilization",
    );
  }

  metricIOLimitUtilizationPercent() {
    return this.metric(
      "PercentIOLimit",
      MetricStatistic.AVERAGE,
      "IOPS utilization",
    );
  }

  metricDataReadIops() {
    return this.perSecond(
      "readOps",
      "DataReadIOBytes",
      MetricStatistic.N,
      "Data read",
    );
  }

  metricDataWriteIops() {
    return this.perSecond(
      "writeOps",
      "DataWriteIOBytes",
      MetricStatistic.N,
      "Data write",
    );
  }

  metricMetadataIops() {
    return this.perSecond(
      "metadataOps",
      "MetadataIOBytes",
      MetricStatistic.N,
      "Metadata",
    );
  }

  metricDataReadBytesPerSecond() {
    return this.perSecond(
      "readBytes",
      "DataReadIOBytes",
      MetricStatistic.SUM,
      "Data read",
    );
  }

  metricDataWriteBytesPerSecond() {
    return this.perSecond(
      "writeBytes",
      "DataWriteIOBytes",
      MetricStatistic.SUM,
      "Data write",
    );
  }

  metricMetadataBytesPerSecond() {
    return this.perSecond(
      "metadataBytes",
      "MetadataIOBytes",
      MetricStatistic.SUM,
      "Metadata",
    );
  }

  /**
   * ClientConnections is a per-minute sum, so this normalises it to connections per minute.
   */
  metricClientConnections() {
    return this.metricFactory.createMetricMath(
      "connections / (PERIOD(connections) / 60)",
      {
        connections: this.metric(
          "ClientConnections",
          MetricStatistic.SUM,
          "Connections",
        ),
      },
      "Client connections",
    );
  }

  metricStorageBytes(storageClass: EfsStorageClass) {
    return this.metricFactory.createMetric(
      "StorageBytes",
      MetricStatistic.AVERAGE,
      storageClass,
      { ...this.dimensionsMap, StorageClass: storageClass },
      undefined,
      EfsNamespace,
      // StorageBytes is only published every 15 minutes.
      Duration.minutes(15),
      this.region,
      this.account,
    );
  }

  /**
   * @param id metric math id, unique within a graph
   */
  private perSecond(
    id: string,
    metricName: string,
    statistic: MetricStatistic,
    label: string,
  ) {
    return this.metricFactory.createMetricMath(
      `${id} / PERIOD(${id})`,
      { [id]: this.metric(metricName, statistic, label) },
      label,
    );
  }

  private metric(
    metricName: string,
    statistic: MetricStatistic,
    label: string,
  ) {
    return this.metricFactory.createMetric(
      metricName,
      statistic,
      label,
      this.dimensionsMap,
      undefined,
      EfsNamespace,
      undefined,
      this.region,
      this.account,
    );
  }
}
