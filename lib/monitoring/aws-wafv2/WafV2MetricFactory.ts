import { DimensionHash } from "aws-cdk-lib/aws-cloudwatch";
import { CfnWebACL } from "aws-cdk-lib/aws-wafv2";
import {
  BaseMetricFactory,
  BaseMetricFactoryProps,
  MetricFactory,
  MetricStatistic,
} from "../../common";

const MetricNamespace = "AWS/WAFV2";
const AllRulesDimensionValue = "ALL";

export interface WafV2MetricFactoryProps extends BaseMetricFactoryProps {
  readonly acl: CfnWebACL;

  /**
   * Required if acl has a "REGIONAL" scope.
   */
  readonly region?: string;
}

/**
 * https://docs.aws.amazon.com/waf/latest/developerguide/monitoring-cloudwatch.html
 */
export class WafV2MetricFactory extends BaseMetricFactory<WafV2MetricFactoryProps> {
  protected readonly dimensions: DimensionHash;

  constructor(metricFactory: MetricFactory, props: WafV2MetricFactoryProps) {
    super(metricFactory, props);

    this.dimensions = {
      Rule: AllRulesDimensionValue,
      WebACL: props.acl.name,
      ...(props.region && { Region: props.region }),
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
