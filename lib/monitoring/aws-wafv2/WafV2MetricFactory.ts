import { DimensionHash } from "monocdk/aws-cloudwatch";
import { CfnWebACL } from "monocdk/aws-wafv2";
import { MetricFactory, MetricStatistic } from "../../common";

const MetricNamespace = "AWS/WAFV2";
const AllRulesDimensionValue = "ALL";

export interface WafV2MetricFactoryProps {
  readonly region?: string;
  readonly acl: CfnWebACL;
}

/**
 * https://docs.aws.amazon.com/waf/latest/developerguide/monitoring-cloudwatch.html
 */
export class WafV2MetricFactory {
  protected readonly metricFactory: MetricFactory;
  protected readonly dimensions: DimensionHash;

  constructor(metricFactory: MetricFactory, props: WafV2MetricFactoryProps) {
    this.metricFactory = metricFactory;
    this.dimensions = {
      Rule: AllRulesDimensionValue,
      WebACL: props.acl.name,
    };
  }

  metricAllowedRequests() {
    return this.metricFactory.createMetric(
      "AllowedRequests",
      MetricStatistic.SUM,
      "Allowed",
      this.dimensions,
      undefined,
      MetricNamespace
    );
  }

  metricBlockedRequests() {
    return this.metricFactory.createMetric(
      "BlockedRequests",
      MetricStatistic.SUM,
      "Blocked",
      this.dimensions,
      undefined,
      MetricNamespace
    );
  }

  metricBlockedRequestsRate() {
    return this.metricFactory.createMetricMath(
      "100 * (blocked / (allowed + blocked))",
      {
        allowed: this.metricAllowedRequests(),
        blocked: this.metricBlockedRequests(),
      },
      "Blocked (rate)"
    );
  }
}
