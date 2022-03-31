import {
  Column,
  Dashboard,
  DashboardProps,
  GraphWidget,
  IWidget,
  Row,
} from "aws-cdk-lib/aws-cloudwatch";
import { Construct } from "constructs";

import { BitmapWidgetRenderingSupport } from "./widget";

/**
 * Specific subtype of dashboard that renders supported widgets as bitmaps, while preserving the overall layout.
 */
export class BitmapDashboard extends Dashboard {
  protected readonly bitmapRenderingSupport: BitmapWidgetRenderingSupport;

  constructor(scope: Construct, id: string, props: DashboardProps) {
    super(scope, id, props);
    this.bitmapRenderingSupport = new BitmapWidgetRenderingSupport(
      this,
      "BitmapRenderingSupport"
    );
  }

  addWidgets(...widgets: IWidget[]) {
    super.addWidgets(...this.asBitmaps(...widgets));
  }

  protected asBitmap(widget: IWidget): IWidget {
    if (widget instanceof GraphWidget) {
      return this.bitmapRenderingSupport.asBitmap(widget);
    } else if (widget instanceof Row) {
      // needs this to access private property
      const rowWidgets = (widget as any).widgets;
      const rowWidgetsTyped = rowWidgets as IWidget[];
      return new Row(...this.asBitmaps(...rowWidgetsTyped));
    } else if (widget instanceof Column) {
      // needs this to access private property
      const colWidgets = (widget as any).widgets;
      const colWidgetsTyped = colWidgets as IWidget[];
      return new Column(...this.asBitmaps(...colWidgetsTyped));
    } else {
      return widget;
    }
  }

  protected asBitmaps(...widgets: IWidget[]): IWidget[] {
    return widgets.map((widget) => this.asBitmap(widget));
  }
}
