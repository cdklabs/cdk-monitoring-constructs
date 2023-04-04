import { Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { IWidget, TextWidget } from "aws-cdk-lib/aws-cloudwatch";
import { DynamicDashboardFactory, IDynamicDashboardSegment } from "../../lib";

enum TestDashboards {
  Dynamic1 = "Dynamic1",
  Dynamic2 = "Dynamic2",
}

class TestSegment implements IDynamicDashboardSegment {
  widgetsForDashboard(name: string): IWidget[] {
    if (name === TestDashboards.Dynamic1) {
      return [new TextWidget({ markdown: "Dynamic1" })];
    } else if (name === TestDashboards.Dynamic2) {
      return [new TextWidget({ markdown: "Dynamic2" })];
    } else {
      return [];
    }
  }
}

test("dynamic dashboards created", () => {
  const stack = new Stack();

  const factory = new DynamicDashboardFactory(stack, "DynamicDashboards", {
    dashboardNamePrefix: "testPrefix",
    dashboardConfigs: [
      { name: TestDashboards.Dynamic1 },
      { name: TestDashboards.Dynamic2 },
    ],
  });

  factory.addDynamicSegment(new TestSegment());

  const result = Template.fromStack(stack);

  expect(factory.dashboards.Dynamic1).not.toBeNull();
  expect(factory.dashboards.Dynamic2).not.toBeNull();

  result.resourceCountIs("AWS::CloudWatch::Dashboard", 2);
  result.hasResourceProperties("AWS::CloudWatch::Dashboard", {
    DashboardBody: `{"start":"-PT8H","periodOverride":"inherit","widgets":[{"type":"text","width":6,"height":2,"x":0,"y":0,"properties":{"markdown":"Dynamic1"}}]}`,
    DashboardName: "testPrefix-Dynamic1",
  });
  result.hasResourceProperties("AWS::CloudWatch::Dashboard", {
    DashboardBody: `{"start":"-PT8H","periodOverride":"inherit","widgets":[{"type":"text","width":6,"height":2,"x":0,"y":0,"properties":{"markdown":"Dynamic2"}}]}`,
    DashboardName: "testPrefix-Dynamic2",
  });
});

test("does not allow duplicate dashboard names", () => {
  const stack = new Stack();

  expect(() => {
    new DynamicDashboardFactory(stack, "DynamicDashboards", {
      dashboardNamePrefix: "testPrefix",
      dashboardConfigs: [{ name: "Dynamic1" }, { name: "Dynamic1" }],
    });
  }).toThrow("Cannot have duplicate dashboard names!");
});

test("does not allow reserved dashboard names", () => {
  const stack = new Stack();

  expect(() => {
    new DynamicDashboardFactory(stack, "DynamicDashboards", {
      dashboardNamePrefix: "testPrefix",
      dashboardConfigs: [{ name: "Summary" }, { name: "Detail" }],
    });
  }).toThrow("Cannot have reserved dashboard names!");
});
