import { GraphWidget, IWidget } from "aws-cdk-lib/aws-cloudwatch";
import { CfnBucket, IBucket } from "aws-cdk-lib/aws-s3";

import {
  S3BucketMetricFactory,
  S3BucketMetricFactoryProps,
} from "./S3BucketMetricFactory";
import {
  BaseMonitoringProps,
  CountAxisFromZero,
  DefaultGraphWidgetHeight,
  DefaultSummaryWidgetHeight,
  HalfWidth,
  MetricWithAlarmSupport,
  Monitoring,
  MonitoringScope,
  SizeAxisBytesFromZero,
} from "../../common";
import {
  MonitoringHeaderWidget,
  MonitoringNamingStrategy,
} from "../../dashboard";

export interface S3BucketMonitoringOptions extends BaseMonitoringProps {}

export interface S3BucketMonitoringProps
  extends S3BucketMetricFactoryProps,
    S3BucketMonitoringOptions {}

export class S3BucketMonitoring extends Monitoring {
  protected readonly title: string;
  protected readonly url?: string;

  protected readonly bucketSizeBytesMetric: MetricWithAlarmSupport;
  protected readonly numberOfObjectsMetric: MetricWithAlarmSupport;

  constructor(scope: MonitoringScope, props: S3BucketMonitoringProps) {
    super(scope, props);

    const fallbackConstructName = this.getBucketName(props.bucket);
    const namingStrategy = new MonitoringNamingStrategy({
      ...props,
      namedConstruct: props.bucket,
      fallbackConstructName,
    });
    this.title = namingStrategy.resolveHumanReadableName();
    this.url = scope
      .createAwsConsoleUrlFactory()
      .getS3BucketUrl(props.bucket.bucketName);

    const metricFactory = new S3BucketMetricFactory(
      this.createMetricFactory(),
      props,
    );
    this.bucketSizeBytesMetric = metricFactory.metricBucketSizeBytes();
    this.numberOfObjectsMetric = metricFactory.metricNumberOfObjects();
  }

  summaryWidgets(): IWidget[] {
    return [
      // Title
      new MonitoringHeaderWidget({
        family: "S3 Bucket",
        title: this.title,
        goToLinkUrl: this.url,
      }),
      // Size
      new GraphWidget({
        width: HalfWidth,
        height: DefaultSummaryWidgetHeight,
        title: "Bucket Size",
        left: [this.bucketSizeBytesMetric],
        leftYAxis: SizeAxisBytesFromZero,
      }),
      // Objects
      new GraphWidget({
        width: HalfWidth,
        height: DefaultSummaryWidgetHeight,
        title: "Object Count",
        left: [this.numberOfObjectsMetric],
        leftYAxis: CountAxisFromZero,
      }),
    ];
  }

  widgets(): IWidget[] {
    return [
      // Title
      new MonitoringHeaderWidget({
        family: "S3 Bucket",
        title: this.title,
        goToLinkUrl: this.url,
      }),
      // Size
      new GraphWidget({
        width: HalfWidth,
        height: DefaultGraphWidgetHeight,
        title: "Bucket Size",
        left: [this.bucketSizeBytesMetric],
        leftYAxis: SizeAxisBytesFromZero,
      }),
      // Objects
      new GraphWidget({
        width: HalfWidth,
        height: DefaultGraphWidgetHeight,
        title: "Object Count",
        left: [this.numberOfObjectsMetric],
        leftYAxis: CountAxisFromZero,
      }),
    ];
  }

  private getBucketName(bucket: IBucket): string | undefined {
    // try to take the name (if specified) instead of token
    return (bucket.node.defaultChild as CfnBucket)?.bucketName;
  }
}
