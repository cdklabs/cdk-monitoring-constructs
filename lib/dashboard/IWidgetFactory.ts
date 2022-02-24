import { IWidget } from "monocdk/aws-cloudwatch";

import { AlarmWithAnnotation } from "../common/alarm";

/**
 * Strategy for creating widgets.
 */
export interface IWidgetFactory {
  /**
   * Create widget representing an alarm detail.
   * @param alarm alarm to represent
   */
  createAlarmDetailWidget(alarm: AlarmWithAnnotation): IWidget;
}
