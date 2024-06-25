import { Stack } from "aws-cdk-lib";
import { Dashboard } from "aws-cdk-lib/aws-cloudwatch";
import { Monitoring } from "../../lib";

/**
 * Executes a snapshot test for widgets, summary widgets and alarm widgets.
 *
 * @param monitoring monitoring to test
 */
export function addMonitoringDashboardsToStack(
  stack: Stack,
  monitoring: Monitoring,
) {
  const summaryDashboard = new Dashboard(stack, "Summary");
  summaryDashboard.addWidgets(...monitoring.summaryWidgets());
  const alarmDashboard = new Dashboard(stack, "Alarm");
  alarmDashboard.addWidgets(...monitoring.alarmWidgets());
  const dashboard = new Dashboard(stack, "Default");
  dashboard.addWidgets(...monitoring.widgets());
}
