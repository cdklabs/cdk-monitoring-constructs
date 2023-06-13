import {ConcreteWidget} from "aws-cdk-lib/aws-cloudwatch";
import {IFunction} from "aws-cdk-lib/aws-lambda";

/**
 * Properties of a custom widget.
 */
export interface CustomWidgetProps {
    /**
     * Title for the graph
     */
    readonly title?: string;
    /**
     * Width of the widget, in a grid of 24 units wide
     *
     * @default - 6
     */
    readonly width?: number;
    /**
     * Height of the widget
     *
     * @default - 6
     */
    readonly height?: number;
    /**
     * Lambda providing the widget contents.
     * The Lambda function should return HTML with widget code.
     * The simplest Lambda example:
     * ```typescript
     * exports.handler = function (event, context, callback) {
     *   return callback(null, "<h1>Hello! This is a custom widget.</h1><pre>" + JSON.stringify(event, null, 2) + "</pre>");
     * };
     * ```
     */
    readonly handler: IFunction;
    /**
     * Arguments to pass to the Lambda.
     * These arguments will be available in the Lambda context.
     */
    readonly handlerParams?: any;
    /**
     * Whether the widget should be updated (by calling the Lambda again) on refresh.
     *
     * @default - true
     */
    readonly updateOnRefresh?: boolean;
    /**
     * Whether the widget should be updated (by calling the Lambda again) on resize.
     *
     * @default - true
     */
    readonly updateOnResize?: boolean;
    /**
     * Whether the widget should be updated (by calling the Lambda again) on time range change.
     *
     * @default - true
     */
    readonly updateOnTimeRangeChange?: boolean;
}

/**
 * A dashboard widget that can be customized using a Lambda.
 */
export class CustomWidget extends ConcreteWidget {
    private readonly props: CustomWidgetProps;

    constructor(props: CustomWidgetProps) {
        super(props.width || 6, props.height || 6);
        this.props = props;
    }

    toJson(): any[] {
        return [
            {
                type: "custom",
                width: this.width,
                height: this.height,
                x: this.x,
                y: this.y,
                properties: {
                    title: this.props.title,
                    endpoint: this.props.handler.functionArn,
                    params: this.props.handlerParams || {},
                    updateOn: {
                        refresh: this.props.updateOnRefresh ?? true,
                        resize: this.props.updateOnResize ?? true,
                        timeRange: this.props.updateOnTimeRangeChange ?? true,
                    },
                },
            },
        ];
    }
}
