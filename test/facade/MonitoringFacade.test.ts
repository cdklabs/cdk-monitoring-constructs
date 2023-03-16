import { Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { DefaultDynamicDashboardFactory, MonitoringFacade } from "../../lib";

describe("test of defaults", () => {
  test("only default dashboard gets created by default", () => {
    const stack = new Stack();
    new MonitoringFacade(stack, "Test");
    const result = Template.fromStack(stack);

    result.resourceCountIs("AWS::CloudWatch::Dashboard", 1);

    result.hasResourceProperties("AWS::CloudWatch::Dashboard", {
      DashboardName: "Test",
    });
  });

  test("handles multiple facades", () => {
    const stack = new Stack();
    new MonitoringFacade(stack, "Test1");
    new MonitoringFacade(stack, "Test2");
    const result = Template.fromStack(stack);

    result.resourceCountIs("AWS::CloudWatch::Dashboard", 2);

    result.hasResourceProperties("AWS::CloudWatch::Dashboard", {
      DashboardName: "Test1",
    });
    result.hasResourceProperties("AWS::CloudWatch::Dashboard", {
      DashboardName: "Test2",
    });
  });

  test("handles dynamic dashboards", () => {
    const stack = new Stack();

    const dynamicDashboardFactory = new DefaultDynamicDashboardFactory(
      stack,
      "TestDynamicDashboardFactory",
      {
        dashboardNamePrefix: "testPrefix",
        dashboardConfigs: [{ name: "Dynamic1" }, { name: "Dynamic2" }],
      }
    );
    new MonitoringFacade(stack, "Test1", {
      dashboardFactory: dynamicDashboardFactory,
    });
    const result = Template.fromStack(stack);

    result.resourceCountIs("AWS::CloudWatch::Dashboard", 2);

    result.hasResourceProperties("AWS::CloudWatch::Dashboard", {
      DashboardName: "testPrefix-Dynamic1",
    });

    result.hasResourceProperties("AWS::CloudWatch::Dashboard", {
      DashboardName: "testPrefix-Dynamic2",
    });
  });
});
