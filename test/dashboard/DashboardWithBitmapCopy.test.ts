import { Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";

import { DashboardWithBitmapCopy } from "../../lib";

test("named dashboard has a bitmap copy", () => {
  const stack = new Stack();

  new DashboardWithBitmapCopy(stack, "UnitUnderTest", {
    dashboardName: "DummyDashboard",
  });

  const template = Template.fromStack(stack);
  template.hasResourceProperties("AWS::CloudWatch::Dashboard", {
    DashboardName: "DummyDashboard",
  });
  template.hasResourceProperties("AWS::CloudWatch::Dashboard", {
    DashboardName: "Bitmap-DummyDashboard",
  });
});
