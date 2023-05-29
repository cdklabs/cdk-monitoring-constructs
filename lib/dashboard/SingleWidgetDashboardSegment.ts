import { IWidget } from "aws-cdk-lib/aws-cloudwatch";

import { IDashboardSegment } from "./DashboardSegment";
import { DefaultDashboards } from "./DefaultDashboardFactory";
import { IDynamicDashboardSegment } from "./DynamicDashboardSegment";

export class SingleWidgetDashboardSegment
  implements IDashboardSegment, IDynamicDashboardSegment
{
  protected readonly widget: IWidget;

  constructor(widget: IWidget) {
    this.widget = widget;
  }

  widgetsForDashboard(name: string): IWidget[] {
    switch (name) {
      case DefaultDashboards.SUMMARY:
        return [this.widget];
      case DefaultDashboards.DETAIL:
        return [this.widget];
      case DefaultDashboards.ALARMS:
        return [this.widget];
      default:
        return [];
    }
  }

  alarmWidgets(): IWidget[] {
    return [this.widget];
  }

  summaryWidgets(): IWidget[] {
    return [this.widget];
  }

  widgets(): IWidget[] {
    return [this.widget];
  }
}
