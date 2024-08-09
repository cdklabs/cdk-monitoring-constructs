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
    return this.metricFactory.metric({
      metricName: "Requests",
      statistic: MetricStatistic.SUM,
      label: "Uploaded",
      dimensionsMap: this.dimensionsMap,
      namespace: CloudFrontNamespace,
      region: CloudFrontDefaultMetricRegion,
      account: this.account,
    });
  }

  metricRequestRate() {
    return this.metricFactory.toRate(
      this.metricRequestCount(),
      this.rateComputationMethod,
      false,
      "requests",
      this.fillTpsWithZeroes,
    );
  }

  /**
   * @deprecated use metricRequestRate
   */
  metricRequestTps() {
    return this.metricFactory.toRate(
      this.metricRequestCount(),
      RateComputationMethod.PER_SECOND,
      false,
      "requests",
      this.fillTpsWithZeroes,
    );
  }

  metricTotalBytesUploaded() {
    return this.metricFactory.metric({
      metricName: "BytesUploaded",
      statistic: MetricStatistic.SUM,
      label: "Uploaded",
      dimensionsMap: this.dimensionsMap,
      namespace: CloudFrontNamespace,
      region: CloudFrontDefaultMetricRegion,
      account: this.account,
    });
  }

  metricTotalBytesDownloaded() {
    return this.metricFactory.metric({
      metricName: "BytesDownloaded",
      statistic: MetricStatistic.SUM,
      label: "Downloaded",
      dimensionsMap: this.dimensionsMap,
      namespace: CloudFrontNamespace,
      region: CloudFrontDefaultMetricRegion,
      account: this.account,
    });
  }

  /**
   * Cache hit rate metric. This is an additional metric that needs to be explicitly enabled for an additional cost.
   *
   * @see https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/viewing-cloudfront-metrics.html#monitoring-console.distributions-additional
   */
  metricCacheHitRateAverageInPercent() {
    return this.metricFactory.metric({
      metricName: "CacheHitRate",
      statistic: MetricStatistic.AVERAGE,
      label: "Hit Rate",
      dimensionsMap: this.dimensionsMap,
      namespace: CloudFrontNamespace,
      region: CloudFrontDefaultMetricRegion,
      account: this.account,
    });
  }

  metric4xxErrorRateAverage() {
    return this.metricFactory.metric({
      metricName: "4xxErrorRate",
      statistic: MetricStatistic.AVERAGE,
      label: "4XX",
      dimensionsMap: this.dimensionsMap,
      namespace: CloudFrontNamespace,
      region: CloudFrontDefaultMetricRegion,
      account: this.account,
    });
  }

  metric5xxErrorRateAverage() {
    return this.metricFactory.metric({
      metricName: "5xxErrorRate",
      statistic: MetricStatistic.AVERAGE,
      label: "5XX",
      dimensionsMap: this.dimensionsMap,
      namespace: CloudFrontNamespace,
      region: CloudFrontDefaultMetricRegion,
      account: this.account,
    });
  }

  metricTotalErrorRateAverage() {
    return this.metricFactory.metric({
      metricName: "TotalErrorRate",
      statistic: MetricStatistic.AVERAGE,
      label: "Total",
      dimensionsMap: this.dimensionsMap,
      namespace: CloudFrontNamespace,
      region: CloudFrontDefaultMetricRegion,
      account: this.account,
    });
  }
}
