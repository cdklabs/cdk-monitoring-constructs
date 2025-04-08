import { Stack } from "aws-cdk-lib";
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";

import { CustomWidget } from "../../../lib/dashboard/widget/CustomWidget";

test("widget", () => {
  const stack = new Stack();

  const handler = new Function(stack, "Function", {
    // execution environment
    runtime: Runtime.NODEJS_LATEST,
    // code loaded from "lambda" directory
    code: Code.fromInline(
      'exports.handler = function(event, ctx, cb) { return cb(null, "Hello World!"); }',
    ),
    // file is "dummy", function is "handler"
    handler: "dummy.handler",
  });
  const handlerParams = {
    key: "value",
  };

  const widget = new CustomWidget({
    updateOnTimeRangeChange: false,
    updateOnResize: false,
    updateOnRefresh: true,
    width: 12,
    height: 2,
    title: "Testing",
    handler,
    handlerParams,
  });

  expect(widget.toJson()).toEqual([
    {
      height: 2,
      properties: {
        endpoint: handler.functionArn,
        params: {
          key: "value",
        },
        title: "Testing",
        updateOn: {
          refresh: true,
          resize: false,
          timeRange: false,
        },
      },
      type: "custom",
      width: 12,
      x: undefined,
      y: undefined,
    },
  ]);
});
