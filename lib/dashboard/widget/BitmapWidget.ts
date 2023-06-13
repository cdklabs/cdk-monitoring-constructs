import * as path from "path";

import {Duration, Tags} from "aws-cdk-lib";
import {IWidget} from "aws-cdk-lib/aws-cloudwatch";
import {Effect, PolicyStatement} from "aws-cdk-lib/aws-iam";
import {Code, Function, IFunction, Runtime} from "aws-cdk-lib/aws-lambda";
import {RetentionDays} from "aws-cdk-lib/aws-logs";
import {Construct} from "constructs";

import {CustomWidget} from "./CustomWidget";

/**
 * Support for rendering bitmap widgets on the server side.
 * It is a custom widget lambda with some additional roles and helper methods.
 */
export class BitmapWidgetRenderingSupport extends Construct {
    readonly handler: IFunction;

    constructor(scope: Construct, id: string) {
        super(scope, id);

        this.handler = new Function(this, "Lambda", {
            code: Code.fromAsset(path.join(__dirname, "..", "..", "..", "assets", "BitmapWidgetRenderingSupport")),
            description: "Custom Widget Render for Bitmap Widgets (MonitoringCDKConstructs)",
            handler: "index.handler",
            memorySize: 128,
            runtime: Runtime.NODEJS_14_X,
            timeout: Duration.seconds(60),
            logRetention: RetentionDays.ONE_DAY,
        });

        this.handler.addToRolePolicy(
            new PolicyStatement({
                actions: ["cloudwatch:GetMetricWidgetImage"],
                effect: Effect.ALLOW,
                resources: ["*"],
            }),
        );

        Tags.of(this.handler).add("cw-custom-widget", "describe:readOnly");
    }

    asBitmap(widget: IWidget) {
        const props = this.getWidgetProperties(widget);
        // remove the title from the graph and remember it
        const {title, ...graph} = props;

        return new CustomWidget({
            // move the original title here
            title,
            width: widget.width,
            height: widget.height,
            // empty the inner title since we already have it on the whole widget
            handlerParams: {graph: {...graph, title: " "}},
            handler: this.handler,
            updateOnRefresh: true,
            updateOnResize: true,
            updateOnTimeRangeChange: true,
        });
    }

    protected getWidgetProperties(widget: IWidget): any {
        const graphs = widget.toJson();
        if (graphs.length != 1) {
            throw new Error("Number of objects in the widget definition must be exactly one.");
        }
        const graph = graphs[0];
        if (!graph.properties) {
            throw new Error("No graph properties: " + graph);
        }
        return graph.properties;
    }
}
