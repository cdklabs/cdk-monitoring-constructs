import { Construct } from "constructs";
import { MetricWithAlarmSupport } from "../../metric";
import { AddAlarmProps } from "../AlarmFactory";

/**
 * Adjusts a metric before creating adding an alarm to it.
 */
export interface IMetricAdjuster {
  /**
   * Adjusts a metric.
   * @param metric The metric to adjust.
   * @param alarmScope The alarm scope.
   * @param props The props specified for adding the alarm.
   * @returns The adjusted metric.
   */
  adjustMetric(
    metric: MetricWithAlarmSupport,
    alarmScope: Construct,
    props: AddAlarmProps,
  ): MetricWithAlarmSupport;
}
