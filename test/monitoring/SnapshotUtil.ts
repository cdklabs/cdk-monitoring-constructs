/**
 * Executes a snapshot test for widgets, summary widgets and alarm widgets.
 * @param monitoring monitoring to test
 */
import { Stack } from "monocdk";
import { Dashboard } from "monocdk/aws-cloudwatch";
import { Monitoring } from "../../lib";

export function addMonitoringDashboardsToStack(
  stack: Stack,
  monitoring: Monitoring
) {
  const summaryDashboard = new Dashboard(stack, "Summary");
  summaryDashboard.addWidgets(...monitoring.summaryWidgets());
  const alarmDashboard = new Dashboard(stack, "Alarm");
  alarmDashboard.addWidgets(...monitoring.alarmWidgets());
  const dashboard = new Dashboard(stack, "Default");
  dashboard.addWidgets(...monitoring.widgets());
}
