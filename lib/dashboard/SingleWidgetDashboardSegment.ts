import { IWidget } from "aws-cdk-lib/aws-cloudwatch";
import { IDashboardSegment } from "./DashboardSegment";
import { IDynamicDashboardSegment } from "./DynamicDashboardSegment";

export class SingleWidgetDashboardSegment
  implements IDashboardSegment, IDynamicDashboardSegment
{
  protected readonly widget: IWidget;

  constructor(widget: IWidget) {
    this.widget = widget;
  }

  widgetsForDashboard(_name: string): IWidget[] {
    return [this.widget];
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
