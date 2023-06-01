import { IWidget } from "aws-cdk-lib/aws-cloudwatch";
import { IDashboardSegment } from "./DashboardSegment";
import { DefaultDashboards } from "./DefaultDashboardFactory";
import { IDynamicDashboardSegment } from "./DynamicDashboardSegment";

export class SingleWidgetDashboardSegment
  implements IDashboardSegment, IDynamicDashboardSegment
{
  protected readonly widget: IWidget;
  protected readonly dashboardsToInclude: string[];

  /**
   * Create a dashboard segment representing a single widget.
   * @param widget widget to add
   * @param dashboardsToInclude list of dashboard names which will include the dashboard
   */
  constructor(widget: IWidget, dashboardsToInclude?: string[]) {
    this.widget = widget;
    this.dashboardsToInclude = dashboardsToInclude ?? [
      DefaultDashboards.ALARMS,
      DefaultDashboards.DETAIL,
      DefaultDashboards.SUMMARY,
    ];
  }

  widgetsForDashboard(name: string): IWidget[] {
    if (this.dashboardsToInclude.includes(name)) {
      return [this.widget];
    } else {
      return [];
    }
  }

  alarmWidgets(): IWidget[] {
    if (this.dashboardsToInclude.includes(DefaultDashboards.ALARMS)) {
      return [this.widget];
    } else {
      return [];
    }
  }

  summaryWidgets(): IWidget[] {
    if (this.dashboardsToInclude.includes(DefaultDashboards.SUMMARY)) {
      return [this.widget];
    } else {
      return [];
    }
  }

  widgets(): IWidget[] {
    if (this.dashboardsToInclude.includes(DefaultDashboards.DETAIL)) {
      return [this.widget];
    } else {
      return [];
    }
  }
}
