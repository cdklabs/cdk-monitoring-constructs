import { haveResource } from "@monocdk-experiment/assert";
import { expect as cdkExpect } from "@monocdk-experiment/assert/lib/expect";
import { Stack } from "monocdk";

import { DashboardWithBitmapCopy } from "../../lib";

test("named dashboard has a bitmap copy", () => {
  const stack = new Stack();

  new DashboardWithBitmapCopy(stack, "UnitUnderTest", {
    dashboardName: "DummyDashboard",
  });

  cdkExpect(stack).to(
    haveResource("AWS::CloudWatch::Dashboard", {
      DashboardName: "DummyDashboard",
    }).and(
      haveResource("AWS::CloudWatch::Dashboard", {
        DashboardName: "Bitmap-DummyDashboard",
      })
    )
  );
});
