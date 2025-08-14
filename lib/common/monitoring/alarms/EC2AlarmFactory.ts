import {
  ComparisonOperator,
  TreatMissingData,
} from "aws-cdk-lib/aws-cloudwatch";
import { AlarmFactory, CustomAlarmThreshold } from "../../alarm";
import { MetricWithAlarmSupport } from "../../metric";

export interface NetworkOutThreshold extends CustomAlarmThreshold {
  readonly maxNetworkOutBytes: number;
}

export interface NetworkInThreshold extends CustomAlarmThreshold {
  readonly maxNetworkInBytes: number;
}

export class EC2AlarmFactory {
  protected readonly alarmFactory: AlarmFactory;

  constructor(alarmFactory: AlarmFactory) {
    this.alarmFactory = alarmFactory;
  }

  addNetworkOutAlarm(
    metric: MetricWithAlarmSupport,
    props: NetworkOutThreshold,
    disambiguator?: string,
  ) {
    return this.alarmFactory.addAlarm(metric, {
      treatMissingData:
        props.treatMissingDataOverride ?? TreatMissingData.MISSING,
      comparisonOperator:
        props.comparisonOperatorOverride ??
        ComparisonOperator.GREATER_THAN_THRESHOLD,
      ...props,
      disambiguator,
      threshold: props.maxNetworkOutBytes,
      alarmNameSuffix: "NetworkOut",
      alarmDescription: "Network out too high",
    });
  }

  addNetworkInAlarm(
    metric: MetricWithAlarmSupport,
    props: NetworkInThreshold,
    disambiguator?: string,
  ) {
    return this.alarmFactory.addAlarm(metric, {
      treatMissingData:
        props.treatMissingDataOverride ?? TreatMissingData.MISSING,
      comparisonOperator:
        props.comparisonOperatorOverride ??
        ComparisonOperator.GREATER_THAN_THRESHOLD,
      ...props,
      disambiguator,
      threshold: props.maxNetworkInBytes,
      alarmNameSuffix: "NetworkIn",
      alarmDescription: "Network in too high",
    });
  }
}
