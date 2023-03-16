import { IWidget } from "aws-cdk-lib/aws-cloudwatch";

export interface IDynamicDashboardSegment {
  /**
   * Returns widgets for the requested dashboard type.
   * @param type dashboard type for which widgets are requested
   */
  widgetsByDashboardType(type: string): IWidget[];
}
