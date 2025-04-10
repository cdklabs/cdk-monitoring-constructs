import { Duration } from "aws-cdk-lib";
import { ComparisonOperator, Stats } from "aws-cdk-lib/aws-cloudwatch";
import { AlarmCloneFunction, AlarmWithAnnotation } from "../..";

const SupportedMetricPeriods = [
  Duration.minutes(1),
  Duration.minutes(5),
  Duration.minutes(15),
  Duration.hours(1),
  Duration.hours(6),
  Duration.days(1),
  Duration.days(7),
];

/**
 * Properties for configuring a function that clones alarms to be scaled by multiplication factors.
 */
export interface ScaleAlarmsProps {
  /**
   * The disambiguator to assign to the alarms cloned by the function.
   */
  readonly disambiguator: string;

  /**
   * A multiplication factor to apply to the threshold of the cloned alarms.
   *
   * Threshold scaling does not apply to thresholds on anomaly detection alarms.
   *
   * @default - 1.0
   */
  readonly thresholdMultiplier?: number;

  /**
   * A multiplication factor to apply to the datapointsToAlarm property of the cloned alarms.
   *
   * When configured with a value less that 1.0, the cloned alarm *may* use a metric with a more
   * granular period so that the result will use a reasonable number of datapoints. In this case,
   * the `datapointsToAlarm` and `evaluationPeriods` are increased by the same factor that the
   * period is decreased. It will also scale `threshold` for metrics using the SUM or SAMPLE_COUNT
   * stats.
   *
   * @default - 1.0
   */
  readonly datapointsToAlarmMultiplier?: number;

  /**
   * A multiplication factor to apply to the `evaluationPeriods` property of the cloned alarms.
   * @default - Same as datapointsToAlarmMultiplier.
   */
  readonly evaluationPeriodsMultiplier?: number;
}

/**
 * Creates a function that clones alarms to be more scaled using the multiplication factors
 * provided. This function can be provided to the `cloneAlarms` method of
 * {@link MonitoringFacade}.
 *
 * This can be used with scaling factors less than 1.0 to create more aggressive alarms, which
 * can be useful to provide early detection and trigger change rollbacks.
 *
 * If the datapoints to alarm would be scaled to such a small number that it can't effectively be
 * alarmed, the metric period will be reduced to the next smallest duration and the required
 * datapoint count will scale up accordingly.
 *
 * @param props The properties for configuring the function.
 * @returns A function that clones alarms and applies scaling factors.
 */
export function ScaleAlarms(props: ScaleAlarmsProps): AlarmCloneFunction {
  return function (alarm: AlarmWithAnnotation) {
    let thresholdMultiplierToUse: number = 1;
    if (props.thresholdMultiplier) {
      const comparisonOperator =
        alarm.alarmDefinition.addAlarmProps.comparisonOperator;
      switch (comparisonOperator) {
        case ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD:
        case ComparisonOperator.GREATER_THAN_THRESHOLD:
          thresholdMultiplierToUse = props.thresholdMultiplier;
          break;
        case ComparisonOperator.LESS_THAN_OR_EQUAL_TO_THRESHOLD:
        case ComparisonOperator.LESS_THAN_THRESHOLD:
          thresholdMultiplierToUse = 1.0 / props.thresholdMultiplier;
          break;
        case ComparisonOperator.GREATER_THAN_UPPER_THRESHOLD:
        case ComparisonOperator.LESS_THAN_LOWER_THRESHOLD:
        case ComparisonOperator.LESS_THAN_LOWER_OR_GREATER_THAN_UPPER_THRESHOLD:
          // Don't modify thresholds for anomaly detection models.
          thresholdMultiplierToUse = 1;
          break;
        default:
          throw new Error(
            `Comparison operator ${comparisonOperator} is not supported by ScaleAlarms.`,
          );
      }
    }
    let cloneThreshold =
      alarm.alarmDefinition.addAlarmProps.threshold * thresholdMultiplierToUse;

    let cloneEvaluationPeriods =
      alarm.alarmDefinition.evaluationPeriods *
      (props.evaluationPeriodsMultiplier ??
        props.datapointsToAlarmMultiplier ??
        1);
    let cloneDatapointsToAlarm =
      alarm.alarmDefinition.datapointsToAlarm *
      (props.datapointsToAlarmMultiplier ?? 1);

    // If the tightened datapoints to alarm is now so small that we can't effectively alarm on it,
    // reduce the metric period to the next smallest duration and scale up the datapoint count accordingly.
    let clonePeriod = alarm.alarmDefinition.addAlarmProps.period;
    if (cloneEvaluationPeriods < 2 || cloneDatapointsToAlarm < 2) {
      const originalPeriod =
        alarm.alarmDefinition.addAlarmProps.period ??
        alarm.alarmDefinition.metric.period;

      const nextSmallestPeriod = findNextSmallestPeriod(originalPeriod);
      if (nextSmallestPeriod) {
        clonePeriod = nextSmallestPeriod;
        const datapointScaleFactor =
          originalPeriod.toSeconds() / nextSmallestPeriod.toSeconds();
        cloneEvaluationPeriods = cloneEvaluationPeriods * datapointScaleFactor;
        cloneDatapointsToAlarm = cloneDatapointsToAlarm * datapointScaleFactor;

        // If the metric uses SUM or N, we also need to scale the threshold down.
        if ("statistic" in alarm.alarmDefinition.metric) {
          if (
            alarm.alarmDefinition.metric.statistic === Stats.SUM ||
            alarm.alarmDefinition.metric.statistic === Stats.SAMPLE_COUNT
          ) {
            cloneThreshold = cloneThreshold / datapointScaleFactor;
          }
        }
      }
    }

    cloneEvaluationPeriods = Math.max(1, Math.round(cloneEvaluationPeriods));
    cloneDatapointsToAlarm = Math.max(1, Math.round(cloneDatapointsToAlarm));

    return {
      ...alarm.alarmDefinition.addAlarmProps,
      disambiguator: props.disambiguator,
      threshold: cloneThreshold,
      evaluationPeriods: cloneEvaluationPeriods,
      datapointsToAlarm: cloneDatapointsToAlarm,
      period: clonePeriod,
    };
  };
}

function findNextSmallestPeriod(originalPeriod: Duration) {
  for (let index = SupportedMetricPeriods.length - 1; index >= 0; index--) {
    const current = SupportedMetricPeriods[index];
    if (current.toSeconds() < originalPeriod.toSeconds()) {
      return current;
    }
  }
  return undefined;
}
