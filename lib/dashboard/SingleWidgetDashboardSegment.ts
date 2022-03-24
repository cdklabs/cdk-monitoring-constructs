import { IWidget } from "aws-cdk-lib/aws-cloudwatch";

import { IDashboardSegment } from "./DashboardSegment";

export class SingleWidgetDashboardSegment implements IDashboardSegment {
  protected readonly widget: IWidget;
  protected readonly addToSummary: boolean;
  protected readonly addToAlarm: boolean;

  constructor(widget: IWidget, addToSummary?: boolean, addToAlarm?: boolean) {
    this.widget = widget;
    this.addToSummary = addToSummary ?? true;
    this.addToAlarm = addToAlarm ?? true;
  }

  alarmWidgets(): IWidget[] {
    if (this.addToAlarm) {
      return [this.widget];
    }
    return [];
  }

  summaryWidgets(): IWidget[] {
    if (this.addToSummary) {
      return [this.widget];
    }
    return [];
  }

  widgets(): IWidget[] {
    return [this.widget];
  }
}
