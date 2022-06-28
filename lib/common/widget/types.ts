import {
  GraphWidget,
  GraphWidgetProps,
  GraphWidgetView,
  IWidget,
  SingleValueWidget,
} from "aws-cdk-lib/aws-cloudwatch";

export enum GraphWidgetType {
  LINE = "Line",
  STACKED_AREA = "StackedArea",
  PIE = "Pie",
  BAR = "Bar",
  SINGLE_VALUE = "SingleValue",
}

/**
 * Creates a graph widget of the desired type.
 *
 * @param type graph type (e.g. Pie or Bar)
 * @param props graph widget properties
 */
export function createGraphWidget(
  type: GraphWidgetType,
  props: GraphWidgetProps
): IWidget {
  switch (type) {
    case GraphWidgetType.LINE:
      return new GraphWidget(props);

    case GraphWidgetType.BAR:
      return new GraphWidget({
        ...props,
        view: GraphWidgetView.BAR,
      });

    case GraphWidgetType.PIE:
      return new GraphWidget({
        ...props,
        view: GraphWidgetView.PIE,
      });

    case GraphWidgetType.STACKED_AREA:
      return new GraphWidget({
        ...props,
        stacked: true,
      });

    case GraphWidgetType.SINGLE_VALUE:
      return new SingleValueWidget({
        metrics: [...(props.left ?? []), ...(props.right ?? [])],
      });

    default:
      throw new Error(`Unsupported graph type: ${type}`);
  }
}
