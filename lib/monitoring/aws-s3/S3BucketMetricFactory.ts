import { IBucket } from "monocdk/aws-s3";

import { MetricFactory, MetricStatistic } from "../../common";

const Namespace = "AWS/S3";

export enum StorageType {
  DEEP_ARCHIVE_OBJECT_OVERHEAD = "DeepArchiveObjectOverhead",
  DEEP_ARCHIVE_S3_OBJECT_OVERHEAD = "DeepArchiveS3ObjectOverhead",
  DEEP_ARCHIVE_STAGING_STORAGE = "DeepArchiveStagingStorage",
  DEEP_ARCHIVE_STORAGE = "DeepArchiveStorage",
  GLACIER_OBJECT_OVERHEAD = "GlacierObjectOverhead",
  GLACIER_S3_OBJECT_OVERHEAD = "GlacierS3ObjectOverhead",
  GLACIER_STAGING_STORAGE = "GlacierStagingStorage",
  GLACIER_STORAGE = "GlacierStorage",
  INTELLIGENT_TIERING_FA_STORAGE = "IntelligentTieringFAStorage",
  INTELLIGENT_TIERING_IA_STORAGE = "IntelligentTieringIAStorage",
  ONE_ZONE_IA_SIZE_OVERHEAD = "OneZoneIASizeOverhead",
  ONE_ZONE_IA_STORAGE = "OneZoneIAStorage",
  REDUCED_REDUNDANCY_STORAGE = "ReducedRedundancyStorage",
  STANDARD_IA_SIZE_OVERHEAD = "StandardIASizeOverhead",
  STANDARD_IA_STORAGE = "StandardIAStorage",
  STANDARD_STORAGE = "StandardStorage",
}

export interface S3BucketMetricFactoryProps {
  readonly bucket: IBucket;
  readonly storageType?: StorageType;
}

export class S3BucketMetricFactory {
  protected readonly metricFactory: MetricFactory;
  protected readonly props: S3BucketMetricFactoryProps;

  constructor(metricFactory: MetricFactory, props: S3BucketMetricFactoryProps) {
    this.metricFactory = metricFactory;
    this.props = props;
  }

  metricBucketSizeBytes() {
    return this.metricFactory.createMetric(
      "BucketSizeBytes",
      MetricStatistic.AVERAGE,
      "BucketSizeBytes",
      {
        BucketName: this.props.bucket.bucketName,
        StorageType: this.props.storageType ?? StorageType.STANDARD_STORAGE,
      },
      undefined,
      Namespace
    );
  }

  metricNumberOfObjects() {
    return this.metricFactory.createMetric(
      "NumberOfObjects",
      MetricStatistic.AVERAGE,
      "NumberOfObjects",
      {
        BucketName: this.props.bucket.bucketName,
        StorageType: "AllStorageTypes",
      },
      undefined,
      Namespace
    );
  }
}
