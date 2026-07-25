import { MetricFactory } from "./MetricFactory";

export interface BaseMetricFactoryProps {
  /**
   * Region where the metrics exist.
   *
   * @default The region configured by the construct holding the Monitoring construct
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Cross-Account-Cross-Region.html
   */
  readonly region?: string;

  /**
   * Account where the metrics exist.
   *
   * @default The account configured by the construct holding the Monitoring construct
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Cross-Account-Cross-Region.html
   */
  readonly account?: string;
}

export abstract class BaseMetricFactory {
  protected readonly metricFactory: MetricFactory;
  protected readonly account?: string;
  protected readonly region?: string;

  constructor(metricFactory: MetricFactory, props: BaseMetricFactoryProps) {
    this.metricFactory = metricFactory;
    this.account = props.account;
    this.region = props.region;
  }
}
