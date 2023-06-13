import {Stack} from "aws-cdk-lib";
import {Template} from "aws-cdk-lib/assertions";
import {Column, GraphWidget, Metric, Row} from "aws-cdk-lib/aws-cloudwatch";

import {BitmapDashboard} from "../../lib";

test("check the bitmap dashboard is generated with rows/columns", () => {
    const stack = new Stack();

    const dashboard = new BitmapDashboard(stack, "UnitUnderTest", {});

    dashboard.addWidgets(
        new Row(
            new Column(
                new GraphWidget({
                    title: "A1",
                    left: [new Metric({metricName: "DummyMetric1", namespace: "Dummy"})],
                }),
            ),
            new Column(
                new GraphWidget({
                    title: "A2",
                    left: [new Metric({metricName: "DummyMetric2", namespace: "Dummy"})],
                }),
            ),
        ),
        new Row(
            new Column(
                new GraphWidget({
                    title: "B1",
                    left: [new Metric({metricName: "DummyMetric3", namespace: "Dummy"})],
                }),
            ),
            new Column(
                new GraphWidget({
                    title: "B2",
                    left: [new Metric({metricName: "DummyMetric4", namespace: "Dummy"})],
                }),
            ),
        ),
    );

    Template.fromStack(stack).resourceCountIs("AWS::CloudWatch::Dashboard", 1);
});
