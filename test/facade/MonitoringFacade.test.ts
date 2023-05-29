import { Stack } from "aws-cdk-lib";
import { Capture, Template } from "aws-cdk-lib/assertions";
import { TextWidget } from "aws-cdk-lib/aws-cloudwatch";
import {
  DefaultDashboardFactory,
  DynamicDashboardFactory,
  MonitoringFacade,
  SingleWidgetDashboardSegment,
} from "../../lib";

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

    const dynamicDashboardFactory = new DynamicDashboardFactory(
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

  test("SingleWidgetDashboardSegment is not displayed if addSegment overrides set to false", () => {
    // configure monitoring facade with dashboard factory which populates all three default dashboards
    const stack = new Stack();
    const dashboardFactory = new DefaultDashboardFactory(
      stack,
      "TestDashboardFactory",
      {
        dashboardNamePrefix: "testPrefix",
        createDashboard: true,
        createAlarmDashboard: true,
        createSummaryDashboard: true,
      }
    );
    const facade = new MonitoringFacade(stack, "Test", {
      dashboardFactory: dashboardFactory,
    });

    // add SingleWidgetDashboardSegment with default ctor args but use overrides to
    // direct exclusion from default dashboards
    facade.addSegment(
      new SingleWidgetDashboardSegment(
        new TextWidget({ markdown: "Simple Dashboard Segment" })
      ),
      {
        addToAlarmDashboard: false,
        addToDetailDashboard: false,
        addToSummaryDashboard: false,
      }
    );

    // verify that the generated dashboards do not include the SingleWidgetDashboardSegment
    // due to override exclusion directives
    const result = Template.fromStack(stack);
    const dashboardCapture = new Capture();
    result.hasResourceProperties("AWS::CloudWatch::Dashboard", {
      DashboardBody: dashboardCapture,
    });
    for (var i = 0; i < 3; i++) {
      const dashboardBody = JSON.parse(dashboardCapture.asString());
      expect(dashboardBody.widgets).toHaveLength(0);
      dashboardCapture.next();
    }
  });
});
