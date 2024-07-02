import { Construct } from "constructs";
import { IMetricAdjuster } from "./IMetricAdjuster";
import { MetricWithAlarmSupport } from "../../metric";
import { removeBracketsWithDynamicLabels } from "../../strings";
import { AddAlarmProps } from "../AlarmFactory";

/**
 * Applies the default metric adjustments.
 * These adjustments are always applied last, regardless the value configured in {@link AddAlarmProps.metricAdjuster}.
 */
export class DefaultMetricAdjuster implements IMetricAdjuster {
  static readonly INSTANCE = new DefaultMetricAdjuster();

  /** @inheritdoc */
  adjustMetric(
    metric: MetricWithAlarmSupport,
    _: Construct,
    props: AddAlarmProps,
  ): MetricWithAlarmSupport {
    let adjustedMetric = metric;
    if (props.period) {
      // Adjust metric period for the alarm
      adjustedMetric = adjustedMetric.with({ period: props.period });
    }

    if (adjustedMetric.label) {
      // Annotations do not support dynamic labels, so we have to remove them from metric name
      adjustedMetric = adjustedMetric.with({
        label: removeBracketsWithDynamicLabels(adjustedMetric.label),
      });
    }

    return adjustedMetric;
  }
}
