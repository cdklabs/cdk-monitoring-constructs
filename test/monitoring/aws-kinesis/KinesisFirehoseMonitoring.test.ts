import { SynthUtils } from "@monocdk-experiment/assert";
import { Stack } from "monocdk";

import { KinesisFirehoseMonitoring } from "../../../lib";
import { TestMonitoringScope } from "../TestMonitoringScope";

test("snapshot test", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  new KinesisFirehoseMonitoring(scope, {
    deliveryStreamName: "my-firehose-delivery-stream",
  });

  expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});
