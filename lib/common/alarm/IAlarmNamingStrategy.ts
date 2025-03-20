import { IAlarmActionStrategy } from "./action";

export interface AlarmNamingInput {
  // TODO: make this required
  readonly action?: IAlarmActionStrategy;
  readonly alarmNameSuffix: string;
  readonly alarmNameOverride?: string;
  readonly alarmDedupeStringSuffix?: string;
  readonly dedupeStringOverride?: string;
  readonly disambiguator?: string;
}

/**
 * Strategy used to name alarms, their widgets, and their dedupe strings.
 */
export interface IAlarmNamingStrategy {
  /**
   * How to generate the name of an alarm.
   *
   * @param props AlarmNamingInput
   */
  getName(props: AlarmNamingInput): string;

  /**
   * How to generate the label for the alarm displayed on a widget.
   *
   * @param props AlarmNamingInput
   */
  getWidgetLabel(props: AlarmNamingInput): string;

  /**
   * How to generate the deduplication string for an alarm.
   */
  getDedupeString(props: AlarmNamingInput): string | undefined;
}
