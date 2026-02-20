import { DimensionHash } from "aws-cdk-lib/aws-cloudwatch";
import { CfnWebACL } from "aws-cdk-lib/aws-wafv2";
import {
  BaseMetricFactory,
  BaseMetricFactoryProps,
  MetricFactory,
  MetricStatistic,
} from "../../common";

const MetricNamespace = "AWS/WAFV2";

export interface WafV2MetricFactoryProps extends BaseMetricFactoryProps {
  /**
   * Note that the "region" prop is required if this has a "REGIONAL" scope.
   */
  readonly acl: CfnWebACL;
}

/**
 * https://docs.aws.amazon.com/waf/latest/developerguide/monitoring-cloudwatch.html
 */
export class WafV2MetricFactory extends BaseMetricFactory<WafV2MetricFactoryProps> {
  protected readonly dimensions: DimensionHash;

  constructor(metricFactory: MetricFactory, props: WafV2MetricFactoryProps) {
    super(metricFactory, props);

    if (props.acl.scope === "REGIONAL" && !props.region) {
      throw new Error(`region is required if CfnWebACL has "REGIONAL" scope`);
    }

    this.dimensions = {
      Rule: "ALL",
      WebACL: props.acl.name,
      ...(props.acl.scope === "REGIONAL" && { Region: props.region }),
    };
  }

  metricAllowedRequests() {
    return this.metricFactory.createMetric(
      "AllowedRequests",
      MetricStatistic.SUM,
      "Allowed",
      this.dimensions,
      undefined,
      MetricNamespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricBlockedRequests() {
    return this.metricFactory.createMetric(
      "BlockedRequests",
      MetricStatistic.SUM,
      "Blocked",
      this.dimensions,
      undefined,
      MetricNamespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricBlockedRequestsRate() {
    return this.metricFactory.createMetricMath(
      "100 * (blocked / (allowed + blocked))",
      {
        allowed: this.metricAllowedRequests(),
        blocked: this.metricBlockedRequests(),
      },
      "Blocked (rate)",
    );
  }
}
