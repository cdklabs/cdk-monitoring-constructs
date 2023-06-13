import { Dashboard, DashboardProps, IWidget } from "aws-cdk-lib/aws-cloudwatch";
import { Construct } from "constructs";

import { BitmapDashboard } from "./BitmapDashboard";

/**
 * Composite dashboard which keeps a normal dashboard with its bitmap copy.
 * The bitmap copy name will be derived from the primary dashboard name, if specified.
 */
export class DashboardWithBitmapCopy extends Dashboard {
  protected readonly bitmapCopy: BitmapDashboard;

  constructor(scope: Construct, id: string, props: DashboardProps) {
    super(scope, id, props);
    let dashboardName = props.dashboardName;
    if (dashboardName !== undefined) {
      dashboardName = "Bitmap-" + dashboardName;
    }
    this.bitmapCopy = new BitmapDashboard(this, "BitmapCopy", {
      ...props,
      dashboardName,
    });
  }

  addWidgets(...widgets: IWidget[]): void {
    super.addWidgets(...widgets);
    this.bitmapCopy.addWidgets(...widgets);
  }
}
