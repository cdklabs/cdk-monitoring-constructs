import { SnsAction } from "aws-cdk-lib/aws-cloudwatch-actions";
import { ITopic } from "aws-cdk-lib/aws-sns";

import {
  AlarmActionStrategyProps,
  IAlarmActionStrategy,
} from "./IAlarmActionStrategy";

export function notifySns(
  onAlarmTopic: ITopic,
  onOkTopic?: ITopic,
  onInsufficientDataTopic?: ITopic
): IAlarmActionStrategy {
  return new SnsAlarmActionStrategy({
    onAlarmTopic,
    onOkTopic,
    onInsufficientDataTopic,
  });
}

export interface SnsAlarmActionStrategyProps {
  /**
   * Target topic used when the alarm is triggered.
   */
  readonly onAlarmTopic: ITopic;

  /**
   * Optional target topic for when the alarm goes into the OK state.
   *
   * @default - no notification sent
   */
  readonly onOkTopic?: ITopic;

  /**
   * Optional target topic for when the alarm goes into the INSUFFICIENT_DATA state.
   *
   * @default - no notification sent
   */
  readonly onInsufficientDataTopic?: ITopic;
}

/**
 * Alarm action strategy that sends a notification to the specified SNS topic.
 */
export class SnsAlarmActionStrategy implements IAlarmActionStrategy {
  protected readonly onAlarmTopic: ITopic;
  protected readonly onOkTopic?: ITopic;
  protected readonly onInsufficientDataTopic?: ITopic;

  constructor(props: SnsAlarmActionStrategyProps) {
    this.onAlarmTopic = props.onAlarmTopic;
    this.onOkTopic = props.onOkTopic;
    this.onInsufficientDataTopic = props.onInsufficientDataTopic;
  }

  addAlarmActions(props: AlarmActionStrategyProps): void {
    props.alarm.addAlarmAction(new SnsAction(this.onAlarmTopic));

    if (this.onOkTopic) {
      props.alarm.addOkAction(new SnsAction(this.onOkTopic));
    }

    if (this.onInsufficientDataTopic) {
      props.alarm.addInsufficientDataAction(
        new SnsAction(this.onInsufficientDataTopic)
      );
    }
  }
}
