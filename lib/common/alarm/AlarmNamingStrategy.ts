import {
  DoNotModifyDedupeString,
  IAlarmDedupeStringProcessor,
} from "./IAlarmDedupeStringProcessor";
import { AlarmNamingInput, IAlarmNamingStrategy } from "./IAlarmNamingStrategy";

const AlarmNamePartSeparator = "-";
const AlarmLabelPartSeparator = " ";

export class AlarmNamingStrategy implements IAlarmNamingStrategy {
  protected readonly globalPrefix: string;
  protected readonly localPrefix: string;
  protected readonly dedupeStringStrategy: IAlarmDedupeStringProcessor;

  constructor(
    globalPrefix: string,
    localPrefix: string,
    dedupeStringStrategy?: IAlarmDedupeStringProcessor,
  ) {
    this.globalPrefix = globalPrefix;
    this.localPrefix = localPrefix;
    this.dedupeStringStrategy =
      dedupeStringStrategy ?? new DoNotModifyDedupeString();
  }

  /**
   * Alarm name is resolved like this:
   * - If "alarmNameOverride" is defined for an alarm, it will be used as alarm name.
   * - Otherwise, the alarm name will be generated by joining: global prefix, local prefix, alarm name suffix, disambiguator.
   *
   * @param props properties
   */
  getName(props: AlarmNamingInput) {
    if (props.alarmNameOverride) {
      return props.alarmNameOverride;
    }

    const parts: string[] = [
      this.globalPrefix,
      this.localPrefix,
      props.alarmNameSuffix,
    ];

    if (props.disambiguator) {
      parts.push(props.disambiguator);
    }

    return this.joinDistinct(parts, AlarmNamePartSeparator);
  }

  getWidgetLabel(props: AlarmNamingInput) {
    // not using global prefix to make the label shorter
    const parts: string[] = [this.localPrefix, props.alarmNameSuffix];

    if (props.disambiguator) {
      parts.push(props.disambiguator);
    }

    return this.joinDistinct(parts, AlarmLabelPartSeparator);
  }

  /**
   * Dedupe string resolved like this:
   * - If "dedupeStringOverride" is defined for an alarm, it will be used as a dedupe string.
   * - If "alarmDedupeStringSuffix" from the alarm factory is defined, "GlobalPrefix-LocalPrefix-AlarmDedupeStringSuffix" will be used as a dedupe string.
   * - Otherwise, the alarm dedupe string will not be set.
   * If a dedupe string strategy is set, it will be used to process the final string.
   *
   * @param props properties
   */
  getDedupeString(props: AlarmNamingInput) {
    if (props.dedupeStringOverride) {
      return this.dedupeStringStrategy.processDedupeStringOverride(
        props.dedupeStringOverride,
      );
    }

    if (props.alarmDedupeStringSuffix) {
      // not using disambiguator here as we are still alarming on the same thing
      const parts = [
        this.globalPrefix,
        this.localPrefix,
        props.alarmDedupeStringSuffix,
      ];
      const dedupeString = this.joinDistinct(parts, AlarmNamePartSeparator);
      return this.dedupeStringStrategy.processDedupeString(dedupeString);
    }

    return undefined;
  }

  protected joinDistinct(parts: string[], separator: string): string {
    return parts.filter((x, i, a) => a.indexOf(x) == i).join(separator);
  }
}
