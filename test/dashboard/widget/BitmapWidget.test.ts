import { Stack } from "monocdk";
import { Template } from "monocdk/assertions";
import { GraphWidget } from "monocdk/aws-cloudwatch";

import { BitmapWidgetRenderingSupport } from "../../../lib";
import { forceStableAssetKeys } from "../../utils/StableTestKeys";

test("support", () => {
  const stack = new Stack();

  new BitmapWidgetRenderingSupport(stack, "Support");

  forceStableAssetKeys(stack);

  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("widget", () => {
  const stack = new Stack();

  const support = new BitmapWidgetRenderingSupport(stack, "Support");

  const widget = support.asBitmap(
    new GraphWidget({
      width: 12,
      height: 6,
      title: "Dummy Title",
      left: [],
      leftAnnotations: [{ label: "Dummy Annotation", value: 10 }],
    })
  );

  expect(widget.toJson()).toEqual([
    {
      height: 6,
      properties: {
        endpoint: support.handler.functionArn,
        params: {
          graph: {
            annotations: {
              horizontal: [
                {
                  label: "Dummy Annotation",
                  value: 10,
                  yAxis: "left",
                },
              ],
            },
            legend: undefined,
            liveData: undefined,
            metrics: undefined,
            period: undefined,
            region: stack.region,
            setPeriodToTimeRange: undefined,
            stacked: undefined,
            stat: undefined,
            title: " ",
            view: "timeSeries",
            yAxis: {
              left: undefined,
              right: undefined,
            },
          },
        },
        title: "Dummy Title",
        updateOn: {
          refresh: true,
          resize: true,
          timeRange: true,
        },
      },
      type: "custom",
      width: 12,
      x: undefined,
      y: undefined,
    },
  ]);
});
