import {
  ComparisonOperator,
  TreatMissingData,
} from "aws-cdk-lib/aws-cloudwatch";

import { AlarmFactory, CustomAlarmThreshold } from "../../alarm";
import { MetricWithAlarmSupport } from "../../metric";

const NUMBER_OF_DATAPOINTS = 1;

export interface MinSecretCountThreshold extends CustomAlarmThreshold {
  readonly minSecretCount: number;
}

export interface MaxSecretCountThreshold extends CustomAlarmThreshold {
  readonly maxSecretCount: number;
}

export interface ChangeInSecretCountThreshold extends CustomAlarmThreshold {
  readonly requiredSecretCount: number;
  readonly alarmWhenIncreased: boolean;
  readonly alarmWhenDecreased: boolean;
  readonly additionalDescription?: string;
}

export class SecretsManagerAlarmFactory {
  protected readonly alarmFactory: AlarmFactory;

  constructor(alarmFactory: AlarmFactory) {
    this.alarmFactory = alarmFactory;
  }

  addMinSecretCountAlarm(
    metric: MetricWithAlarmSupport,
    props: MinSecretCountThreshold,
    disambiguator?: string
  ) {
    return this.alarmFactory.addAlarm(metric, {
      treatMissingData:
        props.treatMissingDataOverride ?? TreatMissingData.MISSING,
      datapointsToAlarm: props.datapointsToAlarm ?? NUMBER_OF_DATAPOINTS,
      comparisonOperator:
        props.comparisonOperatorOverride ??
        ComparisonOperator.LESS_THAN_THRESHOLD,
      ...props,
      disambiguator,
      threshold: props.minSecretCount,
      alarmNameSuffix: "Secrets-Count-Min",
      alarmDescription: "Number of secrets is too low.",
    });
  }

  addMaxSecretCountAlarm(
    metric: MetricWithAlarmSupport,
    props: MaxSecretCountThreshold,
    disambiguator?: string
  ) {
    return this.alarmFactory.addAlarm(metric, {
      treatMissingData:
        props.treatMissingDataOverride ?? TreatMissingData.MISSING,
      comparisonOperator:
        props.comparisonOperatorOverride ??
        ComparisonOperator.GREATER_THAN_THRESHOLD,
      datapointsToAlarm: props.datapointsToAlarm ?? NUMBER_OF_DATAPOINTS,
      ...props,
      disambiguator,
      threshold: props.maxSecretCount,
      alarmNameSuffix: "Secrets-Count-Max",
      alarmDescription: "Number of secrets is too high.",
    });
  }

  addChangeInSecretCountAlarm(
    metric: MetricWithAlarmSupport,
    props: ChangeInSecretCountThreshold,
    disambiguator?: string
  ) {
    return this.alarmFactory.addAlarm(metric, {
      ...props,
      disambiguator,
      treatMissingData:
        props.treatMissingDataOverride ?? TreatMissingData.MISSING,
      threshold: props.requiredSecretCount,
      comparisonOperator: this.getComparisonOperator(props),
      datapointsToAlarm: props.datapointsToAlarm ?? NUMBER_OF_DATAPOINTS,
      alarmNameSuffix: "Secrets-Count-Change",
      alarmDescription: this.getDefaultDescription(props),
    });
  }

  private getDefaultDescription(props: ChangeInSecretCountThreshold) {
    if (props.alarmWhenIncreased && props.alarmWhenDecreased) {
      return "Secret count: Secret count has changed.";
    } else if (props.alarmWhenIncreased) {
      return "Secret count: Secret count has increased.";
    } else if (props.alarmWhenDecreased) {
      return "Secret count: Secret count has decreased.";
    } else {
      throw new Error(
        "You need to alarm when the value has increased, decreased, or both."
      );
    }
  }

  private getComparisonOperator(props: ChangeInSecretCountThreshold) {
    if (props.alarmWhenIncreased && props.alarmWhenDecreased) {
      return ComparisonOperator.LESS_THAN_LOWER_OR_GREATER_THAN_UPPER_THRESHOLD;
    } else if (props.alarmWhenDecreased) {
      return ComparisonOperator.LESS_THAN_THRESHOLD;
    } else if (props.alarmWhenIncreased) {
      return ComparisonOperator.GREATER_THAN_THRESHOLD;
    } else {
      throw new Error(
        "You need to alarm when the value has increased, decreased, or both."
      );
    }
  }
}
