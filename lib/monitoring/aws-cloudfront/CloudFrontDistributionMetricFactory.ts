import { IDistribution } from "aws-cdk-lib/aws-cloudfront";
import { DimensionsMap } from "aws-cdk-lib/aws-cloudwatch";

import {
  BaseMetricFactory,
  BaseMetricFactoryProps,
  MetricFactory,
  MetricStatistic,
  RateComputationMethod,
} from "../../common";

const CloudFrontNamespace = "AWS/CloudFront";
const CloudFrontGlobalRegion = "Global";
const CloudFrontDefaultMetricRegion = "us-east-1";

export interface CloudFrontDistributionMetricFactoryProps
  extends BaseMetricFactoryProps {
  readonly distribution: IDistribution;

  /**
   * @default - true
   */
  readonly fillTpsWithZeroes?: boolean;

  /**
   * @default - average
   */
  readonly rateComputationMethod?: RateComputationMethod;

  /**
   * Generate dashboard charts for additional CloudFront distribution metrics.
   *
   * To enable additional metrics on your CloudFront distribution, see
   * https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/viewing-cloudfront-metrics.html#monitoring-console.distributions-additional
   *
   * @default - true
   */
  readonly additionalMetricsEnabled?: boolean;
}

/**
 * To get the CloudFront metrics from the CloudWatch API, you must use the US East (N. Virginia) Region (us-east-1).
 * https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/programming-cloudwatch-metrics.html
 */
export class CloudFrontDistributionMetricFactory extends BaseMetricFactory<CloudFrontDistributionMetricFactoryProps> {
  private readonly fillTpsWithZeroes: boolean;
  private readonly rateComputationMethod: RateComputationMethod;
  private readonly dimensionsMap: DimensionsMap;

  constructor(
    metricFactory: MetricFactory,
    props: CloudFrontDistributionMetricFactoryProps,
  ) {
    super(metricFactory, props);

    this.fillTpsWithZeroes = props.fillTpsWithZeroes ?? true;
    this.rateComputationMethod =
      props.rateComputationMethod ?? RateComputationMethod.AVERAGE;
    this.dimensionsMap = {
      DistributionId: props.distribution.distributionId,
      Region: CloudFrontGlobalRegion,
    };
  }

  metricRequestCount() {
    return this.metricFactory.createMetric(
      "Requests",
      MetricStatistic.SUM,
      "Requests",
      this.dimensionsMap,
      undefined,
      CloudFrontNamespace,
      undefined,
      CloudFrontDefaultMetricRegion,
      this.account,
    );
  }

  metricRequestRate(rateComputationMethod?: RateComputationMethod) {
    return this.metricFactory.toRate(
      this.metricRequestCount(),
      rateComputationMethod ?? this.rateComputationMethod,
      false,
      "requests",
      this.fillTpsWithZeroes,
    );
  }

  /**
   * @deprecated use metricRequestRate
   */
  metricRequestTps() {
    return this.metricRequestRate(RateComputationMethod.PER_SECOND);
  }

  metricTotalBytesUploaded() {
    return this.metricFactory.createMetric(
      "BytesUploaded",
      MetricStatistic.SUM,
      "Uploaded",
      this.dimensionsMap,
      undefined,
      CloudFrontNamespace,
      undefined,
      CloudFrontDefaultMetricRegion,
      this.account,
    );
  }

  metricTotalBytesDownloaded() {
    return this.metricFactory.createMetric(
      "BytesDownloaded",
      MetricStatistic.SUM,
      "Downloaded",
      this.dimensionsMap,
      undefined,
      CloudFrontNamespace,
      undefined,
      CloudFrontDefaultMetricRegion,
      this.account,
    );
  }

  /**
   * Cache hit rate metric. This is an additional metric that needs to be explicitly enabled for an additional cost.
   *
   * @see https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/viewing-cloudfront-metrics.html#monitoring-console.distributions-additional
   */
  metricCacheHitRateAverageInPercent() {
    return this.metricFactory.createMetric(
      "CacheHitRate",
      MetricStatistic.AVERAGE,
      "Hit Rate",
      this.dimensionsMap,
      undefined,
      CloudFrontNamespace,
      undefined,
      CloudFrontDefaultMetricRegion,
      this.account,
    );
  }

  metric4xxErrorRateAverage() {
    return this.metricFactory.createMetric(
      "4xxErrorRate",
      MetricStatistic.AVERAGE,
      "4XX",
      this.dimensionsMap,
      undefined,
      CloudFrontNamespace,
      undefined,
      CloudFrontDefaultMetricRegion,
      this.account,
    );
  }

  metric5xxErrorRateAverage() {
    return this.metricFactory.createMetric(
      "5xxErrorRate",
      MetricStatistic.AVERAGE,
      "5XX",
      this.dimensionsMap,
      undefined,
      CloudFrontNamespace,
      undefined,
      CloudFrontDefaultMetricRegion,
      this.account,
    );
  }

  metricTotalErrorRateAverage() {
    return this.metricFactory.createMetric(
      "TotalErrorRate",
      MetricStatistic.AVERAGE,
      "Total",
      this.dimensionsMap,
      undefined,
      CloudFrontNamespace,
      undefined,
      CloudFrontDefaultMetricRegion,
      this.account,
    );
  }
}
