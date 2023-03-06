import { IWidget } from "aws-cdk-lib/aws-cloudwatch";

export interface IDashboardSegment {
  /**
   * Returns widgets for all alarms. These should go to the runbook or service dashboard.
   */
  alarmWidgets(): IWidget[];

  /**
   * Returns widgets for the summary. These should go to the team OPS dashboard.
   */
  summaryWidgets(): IWidget[];

  /**
   * Returns all widgets. These should go to the detailed service dashboard.
   */
  widgets(): IWidget[];
}

export interface IDynamicDashboardSegment {
  /**
   * Returns widgets for the requested dashboard type.
   * @param type dashboard type for which widgets are requested
   */
  widgetsByDashboardType(type: string): IWidget[];
}
