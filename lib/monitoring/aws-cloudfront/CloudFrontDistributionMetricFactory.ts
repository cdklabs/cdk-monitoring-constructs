import { IDistribution } from "aws-cdk-lib/aws-cloudfront";
import { DimensionsMap } from "aws-cdk-lib/aws-cloudwatch";

import {
  MetricFactory,
  MetricStatistic,
  RateComputationMethod,
} from "../../common";

const CloudFrontNamespace = "AWS/CloudFront";
const CloudFrontGlobalRegion = "Global";
const CloudFrontDefaultMetricRegion = "us-east-1";

export interface CloudFrontDistributionMetricFactoryProps {
  readonly distribution: IDistribution;
  /**
   * @default true
   */
  readonly fillTpsWithZeroes?: boolean;
  /**
   * @default average
   */
  readonly rateComputationMethod?: RateComputationMethod;
}

/**
 * To get the CloudFront metrics from the CloudWatch API, you must use the US East (N. Virginia) Region (us-east-1).
 * https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/programming-cloudwatch-metrics.html
 */
export class CloudFrontDistributionMetricFactory {
  private readonly metricFactory: MetricFactory;
  private readonly fillTpsWithZeroes: boolean;
  private readonly rateComputationMethod: RateComputationMethod;
  private readonly dimensionsMap: DimensionsMap;

  constructor(
    metricFactory: MetricFactory,
    props: CloudFrontDistributionMetricFactoryProps
  ) {
    this.metricFactory = metricFactory;
    this.fillTpsWithZeroes = props.fillTpsWithZeroes ?? true;
    this.rateComputationMethod =
      props.rateComputationMethod ?? RateComputationMethod.AVERAGE;
    this.dimensionsMap = {
      DistributionId: props.distribution.distributionId,
      Region: CloudFrontGlobalRegion,
    };
  }

  metricRequestCount() {
    return this.metricFactory
      .createMetric(
        "Requests",
        MetricStatistic.SUM,
        "Uploaded",
        this.dimensionsMap,
        undefined,
        CloudFrontNamespace
      )
      .with({ region: CloudFrontDefaultMetricRegion });
  }

  metricRequestRate() {
    return this.metricFactory.toRate(
      this.metricRequestCount(),
      this.rateComputationMethod,
      false,
      "requests",
      this.fillTpsWithZeroes
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
      this.fillTpsWithZeroes
    );
  }

  metricTotalBytesUploaded() {
    return this.metricFactory
      .createMetric(
        "BytesUploaded",
        MetricStatistic.SUM,
        "Uploaded",
        this.dimensionsMap,
        undefined,
        CloudFrontNamespace
      )
      .with({ region: CloudFrontDefaultMetricRegion });
  }

  metricTotalBytesDownloaded() {
    return this.metricFactory
      .createMetric(
        "BytesDownloaded",
        MetricStatistic.SUM,
        "Downloaded",
        this.dimensionsMap,
        undefined,
        CloudFrontNamespace
      )
      .with({ region: CloudFrontDefaultMetricRegion });
  }

  metricCacheHitRateAverageInPercent() {
    return this.metricFactory
      .createMetric(
        "CacheHitRate",
        MetricStatistic.AVERAGE,
        "Hit Rate",
        this.dimensionsMap,
        undefined,
        CloudFrontNamespace
      )
      .with({ region: CloudFrontDefaultMetricRegion });
  }

  metric4xxErrorRateAverage() {
    return this.metricFactory
      .createMetric(
        "4xxErrorRate",
        MetricStatistic.AVERAGE,
        "4XX",
        this.dimensionsMap,
        undefined,
        CloudFrontNamespace
      )
      .with({ region: CloudFrontDefaultMetricRegion });
  }

  metric5xxErrorRateAverage() {
    return this.metricFactory
      .createMetric(
        "5xxErrorRate",
        MetricStatistic.AVERAGE,
        "5XX",
        this.dimensionsMap,
        undefined,
        CloudFrontNamespace
      )
      .with({ region: CloudFrontDefaultMetricRegion });
  }

  metricTotalErrorRateAverage() {
    return this.metricFactory
      .createMetric(
        "TotalErrorRate",
        MetricStatistic.AVERAGE,
        "Total",
        this.dimensionsMap,
        undefined,
        CloudFrontNamespace
      )
      .with({ region: CloudFrontDefaultMetricRegion });
  }
}
