import { AlarmStatusWidget, IAlarm } from "aws-cdk-lib/aws-cloudwatch";

import { FullWidth } from "../../common/widget";

const AlarmsPerRow = 6;
const MinHeight = 2;
const MaxHeight = 8;

export interface AlarmMatrixWidgetProps {
  /**
   * widget title
   * @default - no title
   */
  readonly title?: string;
  /**
   * desired height
   * @default - auto calculated based on alarm number (3 to 8)
   */
  readonly height?: number;
  /**
   * list of alarms to show
   */
  readonly alarms: IAlarm[];
}

/**
 * Wrapper of Alarm Status Widget which auto-calcultes height based on the number of alarms.
 * Always takes the maximum width.
 */
export class AlarmMatrixWidget extends AlarmStatusWidget {
  constructor(props: AlarmMatrixWidgetProps) {
    super({
      alarms: props.alarms,
      title: props.title,
      width: FullWidth,
      height:
        props.height ??
        AlarmMatrixWidget.getRecommendedHeight(props.alarms.length),
    });
  }

  private static getRecommendedHeight(numAlarms: number) {
    const rows = Math.ceil(numAlarms / AlarmsPerRow);
    if (rows < MinHeight) {
      return MinHeight;
    }
    if (rows > MaxHeight) {
      return MaxHeight;
    }
    return rows;
  }
}
