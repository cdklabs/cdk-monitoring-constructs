import { Construct } from "constructs";
import { IMetricAdjuster } from "./IMetricAdjuster";
import { MetricWithAlarmSupport } from "../../metric";
import { AddAlarmProps } from "../AlarmFactory";

/**
 * Allows to apply a collection of {@link IMetricAdjuster} to a metric.
 */
export class CompositeMetricAdjuster implements IMetricAdjuster {
  constructor(private readonly adjusters: IMetricAdjuster[]) {}

  static of(...adjusters: IMetricAdjuster[]) {
    return new CompositeMetricAdjuster(adjusters);
  }

  /** @inheritdoc */
  adjustMetric(
    metric: MetricWithAlarmSupport,
    alarmScope: Construct,
    props: AddAlarmProps,
  ): MetricWithAlarmSupport {
    let adjustedMetric = metric;
    for (const adjuster of this.adjusters) {
      adjustedMetric = adjuster.adjustMetric(adjustedMetric, alarmScope, props);
    }

    return adjustedMetric;
  }
}
