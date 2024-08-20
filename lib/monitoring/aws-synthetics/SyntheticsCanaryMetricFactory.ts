import { DimensionsMap } from "aws-cdk-lib/aws-cloudwatch";
import { Canary } from "aws-cdk-lib/aws-synthetics";
import {
  BaseMetricFactory,
  BaseMetricFactoryProps,
  MetricFactory,
  MetricStatistic,
  RateComputationMethod,
} from "../../common/index";

const MetricNamespace = "CloudWatchSynthetics";

export interface SyntheticsCanaryMetricFactoryProps
  extends BaseMetricFactoryProps {
  /**
   * CloudWatch Canary to monitor
   */
  readonly canary: Canary;
  /**
   * Method used to calculate relative rates
   * @default - average
   */
  readonly rateComputationMethod?: RateComputationMethod;
}

export class SyntheticsCanaryMetricFactory extends BaseMetricFactory<SyntheticsCanaryMetricFactoryProps> {
  protected readonly canary: Canary;
  protected readonly rateComputationMethod: RateComputationMethod;
  protected readonly dimensionsMap: DimensionsMap;

  constructor(
    metricFactory: MetricFactory,
    props: SyntheticsCanaryMetricFactoryProps,
  ) {
    super(metricFactory, props);

    this.canary = props.canary;
    this.rateComputationMethod =
      props.rateComputationMethod ?? RateComputationMethod.AVERAGE;
    this.dimensionsMap = {
      CanaryName: props.canary.canaryName,
    };
  }

  metricLatencyAverageInMillis() {
    return this.metricFactory.adaptMetric(
      this.canary.metricDuration({
        label: "Average",
        statistic: MetricStatistic.AVERAGE,
        region: this.region,
        account: this.account,
      }),
    );
  }

  metricSuccessInPercent() {
    return this.metricFactory.adaptMetric(
      this.canary.metricSuccessPercent({
        label: "Success Rate",
        statistic: MetricStatistic.AVERAGE,
        region: this.region,
        account: this.account,
      }),
    );
  }

  metric4xxErrorCount() {
    return this.metricFactory.metric({
      metricName: "4xx",
      statistic: MetricStatistic.SUM,
      label: "4xx",
      dimensionsMap: this.dimensionsMap,
      namespace: MetricNamespace,
      region: this.region,
      account: this.account,
    });
  }

  metric4xxErrorRate() {
    return this.metricFactory.toRate(
      this.metric4xxErrorCount(),
      this.rateComputationMethod,
      false,
      "errors",
    );
  }

  metric5xxFaultCount() {
    return this.metricFactory.metric({
      metricName: "5xx",
      statistic: MetricStatistic.SUM,
      label: "5xx",
      dimensionsMap: this.dimensionsMap,
      namespace: MetricNamespace,
      region: this.region,
      account: this.account,
    });
  }

  metric5xxFaultRate() {
    return this.metricFactory.toRate(
      this.metric5xxFaultCount(),
      this.rateComputationMethod,
      false,
      "faults",
    );
  }
}
