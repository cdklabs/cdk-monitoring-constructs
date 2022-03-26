import { DimensionHash } from "monocdk/aws-cloudwatch";
import { MetricFactory, MetricStatistic } from "../../common/index";

const MetricNamespace = "AWS/WAFV2";
const AllRulesDimensionValue = "ALL";

export interface WafMetricFactoryProps {
  readonly region?: string;
  readonly aclName: string;
}

/**
 * https://docs.aws.amazon.com/waf/latest/developerguide/monitoring-cloudwatch.html
 */
export class WafMetricFactory {
  protected readonly metricFactory: MetricFactory;
  protected readonly dimensions: DimensionHash;

  constructor(metricFactory: MetricFactory, props: WafMetricFactoryProps) {
    this.metricFactory = metricFactory;
    this.dimensions = {
      Rule: AllRulesDimensionValue,
      WebACL: props.aclName,
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
