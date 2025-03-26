import { Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";

import { KinesisFirehoseMonitoring } from "../../../lib";
import { addMonitoringDashboardsToStack } from "../../utils/SnapshotUtil";
import { TestMonitoringScope } from "../TestMonitoringScope";

test("snapshot test: no alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const monitoring = new KinesisFirehoseMonitoring(scope, {
    deliveryStreamName: "my-firehose-delivery-stream",
  });

  addMonitoringDashboardsToStack(stack, monitoring);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot test: all alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  let numAlarmsCreated = 0;

  const monitoring = new KinesisFirehoseMonitoring(scope, {
    deliveryStreamName: "my-firehose-delivery-stream",
    addRecordsThrottledAlarm: {
      Critical: {
        maxRecordsThrottledThreshold: 5,
      },
    },
    addIncomingBytesExceedThresholdAlarm: {
      Critical: {
        safetyThresholdLimit: 0.6,
      },
    },
    addIncomingRecordsExceedThresholdAlarm: {
      Critical: {
        safetyThresholdLimit: 0.7,
      },
    },
    addIncomingPutRequestsExceedThresholdAlarm: {
      Critical: {
        safetyThresholdLimit: 0.8,
      },
    },
    useCreatedAlarms: {
      consume(alarms) {
        numAlarmsCreated = alarms.length;
      },
    },
  });

  addMonitoringDashboardsToStack(stack, monitoring);
  expect(numAlarmsCreated).toStrictEqual(4);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot test: data format conversion disabled", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const monitoring = new KinesisFirehoseMonitoring(scope, {
    deliveryStreamName: "my-firehose-delivery-stream",
    isDataFormatConversionEnabled: false,
  });

  addMonitoringDashboardsToStack(stack, monitoring);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("test: validation error if incoming traffic usage alarm threshold equal to 1", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  expect(() => {
    new KinesisFirehoseMonitoring(scope, {
      deliveryStreamName:
        "my-firehose-delivery-stream-with-unexpected-threshold",
      addIncomingBytesExceedThresholdAlarm: {
        Critical: {
          safetyThresholdLimit: 1.0,
        },
      },
    });
  }).toThrow(
    `safetyThresholdLimit must be in range [0.0, 1.0) for IncomingBytesExceedThresholdAlarm.`,
  );
});

test("test: validation error if incoming traffic usage alarm threshold less than 0", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  expect(() => {
    new KinesisFirehoseMonitoring(scope, {
      deliveryStreamName:
        "my-firehose-delivery-stream-with-unexpected-threshold",
      addIncomingRecordsExceedThresholdAlarm: {
        Critical: {
          safetyThresholdLimit: -0.1,
        },
      },
    });
  }).toThrow(
    `safetyThresholdLimit must be in range [0.0, 1.0) for IncomingRecordsExceedThresholdAlarm.`,
  );
});
