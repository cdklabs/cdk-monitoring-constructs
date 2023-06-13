import {GraphWidget, GraphWidgetProps, HorizontalAnnotation, IMetric, LegendPosition, YAxisProps} from "aws-cdk-lib/aws-cloudwatch";

export interface SingleAxisGraphWidgetProps {
    readonly title?: string;
    readonly width: number;
    readonly height: number;
    readonly leftMetrics: IMetric[];
    readonly leftAxis: YAxisProps;
    readonly leftAnnotations?: HorizontalAnnotation[];
}

/**
 * Line graph widget with one axis only (left).
 * If there is just one metric, it will hide the legend to save space.
 * The purpose of this custom class is to make the properties more strict.
 * It will avoid graphs with undefined axis and dimensions.
 */
export class SingleAxisGraphWidget extends GraphWidget {
    constructor(props: SingleAxisGraphWidgetProps) {
        super(SingleAxisGraphWidget.transformProps(props));
    }

    private static transformProps(props: SingleAxisGraphWidgetProps): GraphWidgetProps {
        if (props.leftMetrics.length < 1) {
            throw new Error("No metrics defined. Please define at least one metric.");
        }

        const legendPosition = props.leftMetrics.length === 1 ? LegendPosition.HIDDEN : undefined;

        return {
            title: props.title,
            width: props.width,
            height: props.height,
            left: props.leftMetrics,
            leftYAxis: props.leftAxis,
            leftAnnotations: props.leftAnnotations,
            legendPosition,
        };
    }
}

export interface DoubleAxisGraphWidgetProps {
    readonly title?: string;
    readonly width: number;
    readonly height: number;
    readonly leftMetrics: IMetric[];
    readonly leftAxis: YAxisProps;
    readonly leftAnnotations?: HorizontalAnnotation[];
    readonly rightMetrics: IMetric[];
    readonly rightAxis: YAxisProps;
    readonly rightAnnotations?: HorizontalAnnotation[];
}

/**
 * Line graph widget with both left and right axes.
 * The purpose of this custom class is to make the properties more strict.
 * It will avoid graphs with undefined axes and dimensions.
 */
export class DoubleAxisGraphWidget extends GraphWidget {
    constructor(props: DoubleAxisGraphWidgetProps) {
        super(DoubleAxisGraphWidget.transformProps(props));
    }

    private static transformProps(props: DoubleAxisGraphWidgetProps): GraphWidgetProps {
        if (props.leftMetrics.length < 1) {
            throw new Error("No left metrics defined. Please define at least one metric.");
        }
        if (props.rightMetrics.length < 1) {
            throw new Error("No right metrics defined. Please define at least one metric.");
        }

        return {
            title: props.title,
            width: props.width,
            height: props.height,
            left: props.leftMetrics,
            leftYAxis: props.leftAxis,
            leftAnnotations: props.leftAnnotations,
            right: props.rightMetrics,
            rightYAxis: props.rightAxis,
            rightAnnotations: props.rightAnnotations,
        };
    }
}
