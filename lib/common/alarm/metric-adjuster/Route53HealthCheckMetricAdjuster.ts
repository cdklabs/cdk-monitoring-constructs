import { Stack } from "aws-cdk-lib";
import { Metric } from "aws-cdk-lib/aws-cloudwatch";
import { Construct } from "constructs";
import { IMetricAdjuster } from "./IMetricAdjuster";
import { MetricStatistic, MetricWithAlarmSupport } from "../../metric";
import { AddAlarmProps } from "../AlarmFactory";

/**
 * The supported statistics by Route53 Health Checks.
 * @see https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/health-checks-types.html
 */
const SUPPORTED_STATS = new Set<string>([
  MetricStatistic.AVERAGE,
  MetricStatistic.MIN,
  MetricStatistic.MAX,
  MetricStatistic.SUM,
  MetricStatistic.N,
]);

/**
 * Adjusts a metric so that alarms created from it can be used in Route53 Health Checks.
 * The metric will be validated to ensure it satisfies Route53 Health Check alarm requirements, otherwise it will throw an {@link Error}.
 * @see https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/health-checks-types.html
 */
export class Route53HealthCheckMetricAdjuster implements IMetricAdjuster {
  static readonly INSTANCE = new Route53HealthCheckMetricAdjuster();

  /** @inheritdoc */
  adjustMetric(
    metric: MetricWithAlarmSupport,
    alarmScope: Construct,
    props: AddAlarmProps
  ): MetricWithAlarmSupport {
    // Route53 health checks do not support composite alarms
    if (props.minMetricSamplesToAlarm) {
      throw new Error(
        "Alarms with 'minMetricSamplesToAlarm' are not supported."
      );
    }

    // Route53 health checks do to support metric math
    if (!(metric instanceof Metric)) {
      throw new Error("The specified metric must be a Metric instance.");
    }

    const { account, period, statistic } = metric;

    if (account && account !== Stack.of(alarmScope).account) {
      throw new Error("Cross-account metrics are not supported.");
    }

    // Route53 health checks do not support high-resolution metrics
    if (period && period.toSeconds() < 60) {
      throw new Error("High resolution metrics are not supported.");
    }

    // Route53 health checks only support a subset of statistics
    if (!SUPPORTED_STATS.has(statistic)) {
      throw new Error(
        `Metrics with statistic '${statistic}' are not supported.`
      );
    }

    // Can't use `metric.with()` to remove the label, only change it
    // See: https://github.com/aws/aws-cdk/blob/v2.65.0/packages/%40aws-cdk/aws-cloudwatch/lib/metric.ts#L314-L342
    return new Metric({
      ...metric,
      // all fields except dimensions have the same names
      dimensionsMap: metric.dimensions,
      /*
       * `AWS::CloudWatch::Alarm` CFN resource types have two variants:
       * - Based on a single metric: Uses `MetricName` property.
       * - Based on metric math: Uses `Metrics` property.
       *
       * If the `label` of a `Metric` instance is defined, when an
       * alarm is created from it, even if it doesn't use metric math,
       * it will use the `Metrics` property. Since Route53 does not
       * support metric math it assumes any alarm created using the
       * `Metrics` property must use metric math, thus it must be removed.
       *
       * See: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-alarm.html
       * See: https://github.com/aws/aws-cdk/blob/v2.65.0/packages/@aws-cdk/aws-cloudwatch/lib/alarm.ts#L262-L298
       */
      label: undefined,
    });
  }
}
