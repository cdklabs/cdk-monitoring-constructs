import {Stack} from "aws-cdk-lib";
import {Template} from "aws-cdk-lib/assertions";
import {TextWidget} from "aws-cdk-lib/aws-cloudwatch";

import {DashboardRenderingPreference, DefaultDashboardFactory, SingleWidgetDashboardSegment} from "../../lib";

test("default dashboards created", () => {
    const stack = new Stack();

    const factory = new DefaultDashboardFactory(stack, "Dashboards", {
        dashboardNamePrefix: "DummyDashboard",
        renderingPreference: DashboardRenderingPreference.INTERACTIVE_ONLY,
    });

    expect(factory.anyDashboardCreated).toEqual(true);
    expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("all dashboards created", () => {
    const stack = new Stack();

    const factory = new DefaultDashboardFactory(stack, "Dashboards", {
        dashboardNamePrefix: "DummyDashboard",
        createDashboard: true,
        createSummaryDashboard: true,
        createAlarmDashboard: true,
        renderingPreference: DashboardRenderingPreference.INTERACTIVE_ONLY,
    });

    expect(factory.anyDashboardCreated).toEqual(true);
    expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("no dashboards created", () => {
    const stack = new Stack();

    const factory = new DefaultDashboardFactory(stack, "Dashboards", {
        dashboardNamePrefix: "DummyDashboard",
        createDashboard: false,
        createSummaryDashboard: false,
        createAlarmDashboard: false,
        renderingPreference: DashboardRenderingPreference.INTERACTIVE_ONLY,
    });

    factory.addSegment({
        segment: new SingleWidgetDashboardSegment(new TextWidget({markdown: "Hello world!"})),
    });

    expect(factory.anyDashboardCreated).toEqual(false);
    expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("throws error if an empty dashboardNamePrefix is passed but dashboard are to be created", () => {
    const stack = new Stack();

    expect(() => {
        new DefaultDashboardFactory(stack, "Dashboards", {
            dashboardNamePrefix: "",
            createDashboard: true,
            renderingPreference: DashboardRenderingPreference.INTERACTIVE_ONLY,
        });
    }).toThrow("A non-empty dashboardNamePrefix is required if dashboards are being created");
});
