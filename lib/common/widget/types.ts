import {
  GraphWidget,
  GraphWidgetProps,
  GraphWidgetView,
} from "aws-cdk-lib/aws-cloudwatch";

export enum GraphWidgetType {
  LINE = "Line",
  STACKED_AREA = "StackedArea",
  PIE = "Pie",
  BAR = "Bar",
}

/**
 * Creates a graph widget of the desired type.
 * @param type graph type (e.g. Pie or Bar)
 * @param props graph widget properties
 */
export function createGraphWidget(
  type: GraphWidgetType,
  props: GraphWidgetProps
) {
  switch (type) {
    case "Line":
      return new GraphWidget(props);
    case "Bar":
      return new GraphWidget({
        ...props,
        view: GraphWidgetView.BAR,
      });
    case "Pie":
      return new GraphWidget({
        ...props,
        view: GraphWidgetView.PIE,
      });
    case "StackedArea":
      return new GraphWidget({
        ...props,
        stacked: true,
      });
    default:
      throw new Error("Unsupported graph type: " + type);
  }
}
