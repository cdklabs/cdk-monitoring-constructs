import { Dashboard } from "aws-cdk-lib/aws-cloudwatch";
import { IDynamicDashboardSegment } from "./DynamicDashboardSegment";

/**
 * This dashboard factory interface provides for dynamic dashboard generation through
 * IDynamicDashboard segments which will return different content depending on the
 * dashboard type.
 */
export interface IDynamicDashboardFactory {
  /**
   * Adds a dynamic dashboard segment.
   * @param segment IDynamicDashboardSegment
   */
  addDynamicSegment(segment: IDynamicDashboardSegment): void;

  /**
   * Gets the dashboard for the requested dashboard type.
   * @param type
   */
  getDashboard(type: string): Dashboard | undefined;
}
