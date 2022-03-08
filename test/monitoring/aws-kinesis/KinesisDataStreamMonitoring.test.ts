import { Stack } from "monocdk";
import { Template } from "monocdk/assertions";

import { KinesisDataStreamMonitoring } from "../../../lib";
import { TestMonitoringScope } from "../TestMonitoringScope";

test("snapshot test for stream: no alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  new KinesisDataStreamMonitoring(scope, {
    streamName: "my-kinesis-data-stream",
  });

  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot test for stream: all alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  let numAlarmsCreated = 0;

  new KinesisDataStreamMonitoring(scope, {
    streamName: "my-kinesis-data-stream",
    addIteratorMaxAgeAlarm: {
      Warning: {
        maxAgeInMillis: 1_000_000,
      },
    },
    addPutRecordsThrottledAlarm: {
      Critical: {
        maxRecordsThrottledThreshold: 5,
      },
    },
    addPutRecordsFailedAlarm: {
      Critical: {
        maxRecordsFailedThreshold: 5,
      },
    },
    useCreatedAlarms: {
      consume(alarms) {
        numAlarmsCreated = alarms.length;
      },
    },
  });

  expect(numAlarmsCreated).toStrictEqual(3);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});
