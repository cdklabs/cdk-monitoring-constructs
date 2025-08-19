import {
  GraphWidget,
  GraphWidgetProps,
  GraphWidgetView,
  IWidget,
  SingleValueWidget,
  TableWidget,
} from "aws-cdk-lib/aws-cloudwatch";

export enum GraphWidgetType {
  BAR = "Bar",
  LINE = "Line",
  PIE = "Pie",
  SINGLE_VALUE = "SingleValue",
  STACKED_AREA = "StackedArea",
  TABLE = "Table",
}

/**
 * Creates a graph widget of the desired type.
 *
 * @param type graph type (e.g. Pie or Bar)
 * @param props graph widget properties
 */
export function createGraphWidget(
  type: GraphWidgetType,
  props: GraphWidgetProps,
): IWidget {
  switch (type) {
    case GraphWidgetType.BAR:
      return new GraphWidget({
        ...props,
        view: GraphWidgetView.BAR,
        setPeriodToTimeRange: true,
      });

    case GraphWidgetType.LINE:
      return new GraphWidget(props);

    case GraphWidgetType.PIE:
      return new GraphWidget({
        ...props,
        view: GraphWidgetView.PIE,
        setPeriodToTimeRange: true,
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

    case GraphWidgetType.TABLE:
      return new TableWidget({
        ...props,
        metrics: [...(props.left ?? []), ...(props.right ?? [])],
      });

    default:
      throw new Error(`Unsupported graph type: ${type}`);
  }
}
