import { AlarmBase } from "aws-cdk-lib/aws-cloudwatch";

import { AlarmMetadata } from "./AlarmFactory";

/**
 * Properties necessary to append actions to an alarm.
 */
export interface AlarmActionStrategyProps extends AlarmMetadata {
  readonly alarm: AlarmBase;
}

/**
 * An object that appends actions to alarms.
 */
export interface IAlarmActionStrategy {
  addAlarmActions(props: AlarmActionStrategyProps): void;
}
