import { IBucket } from "aws-cdk-lib/aws-s3";

import {
  BaseMetricFactory,
  BaseMetricFactoryProps,
  MetricFactory,
  MetricStatistic,
} from "../../common";

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

export interface S3BucketMetricFactoryProps extends BaseMetricFactoryProps {
  readonly bucket: IBucket;
  readonly storageType?: StorageType;
}

export class S3BucketMetricFactory extends BaseMetricFactory<S3BucketMetricFactoryProps> {
  protected readonly props: S3BucketMetricFactoryProps;

  constructor(metricFactory: MetricFactory, props: S3BucketMetricFactoryProps) {
    super(metricFactory, props);

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
      Namespace,
      undefined,
      this.region,
      this.account,
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
      Namespace,
      undefined,
      this.region,
      this.account,
    );
  }
}
