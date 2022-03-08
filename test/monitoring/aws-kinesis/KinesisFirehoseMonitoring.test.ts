import { Stack } from "monocdk";
import { Template } from "monocdk/assertions";

import { KinesisFirehoseMonitoring } from "../../../lib";
import { TestMonitoringScope } from "../TestMonitoringScope";

test("snapshot test", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  new KinesisFirehoseMonitoring(scope, {
    deliveryStreamName: "my-firehose-delivery-stream",
  });

  expect(Template.fromStack(stack)).toMatchSnapshot();
});
