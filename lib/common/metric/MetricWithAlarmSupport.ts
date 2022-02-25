import { MathExpression, Metric } from "monocdk/aws-cloudwatch";

/**
 * Any metric we can create an alarm on.
 *
 * (Cannot be IMetric, as it does not have any alarm support in general.)
 */
export type MetricWithAlarmSupport = Metric | MathExpression;
