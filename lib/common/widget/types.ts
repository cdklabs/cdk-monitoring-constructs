import {GraphWidget, GraphWidgetProps, GraphWidgetView, IWidget, SingleValueWidget} from "aws-cdk-lib/aws-cloudwatch";

export enum GraphWidgetType {
    BAR = "Bar",
    LINE = "Line",
    PIE = "Pie",
    SINGLE_VALUE = "SingleValue",
    STACKED_AREA = "StackedArea",
}

/**
 * Creates a graph widget of the desired type.
 *
 * @param type graph type (e.g. Pie or Bar)
 * @param props graph widget properties
 */
export function createGraphWidget(type: GraphWidgetType, props: GraphWidgetProps): IWidget {
    switch (type) {
        case GraphWidgetType.BAR:
            return new GraphWidget({
                ...props,
                view: GraphWidgetView.BAR,
            });

        case GraphWidgetType.LINE:
            return new GraphWidget(props);

        case GraphWidgetType.PIE:
            return new GraphWidget({
                ...props,
                view: GraphWidgetView.PIE,
            });

        case GraphWidgetType.SINGLE_VALUE:
            return new SingleValueWidget({
                ...props,
                metrics: [...(props.left ?? []), ...(props.right ?? [])],
            });

        case GraphWidgetType.STACKED_AREA:
            return new GraphWidget({
                ...props,
                stacked: true,
            });

        default:
            throw new Error(`Unsupported graph type: ${type}`);
    }
}
