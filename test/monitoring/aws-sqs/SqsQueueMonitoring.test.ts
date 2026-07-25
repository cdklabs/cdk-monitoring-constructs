import { Duration, Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { Queue } from "aws-cdk-lib/aws-sqs";

import { AlarmWithAnnotation, SqsQueueMonitoring } from "../../../lib";
import { addMonitoringDashboardsToStack } from "../../utils/SnapshotUtil";
import { TestMonitoringScope } from "../TestMonitoringScope";

test("snapshot test: no alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const queue = new Queue(stack, "Queue", {
    queueName: "DummyQueue",
  });

  const monitoring = new SqsQueueMonitoring(scope, {
    queue,
  });

  addMonitoringDashboardsToStack(stack, monitoring);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot test: use fromQueueAttributes, no alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  new Queue(stack, "Queue", {
    queueName: "DummyQueue",
  });

  const monitoring = new SqsQueueMonitoring(scope, {
    queue: Queue.fromQueueAttributes(stack, "DummyQueueRef", {
      queueArn: "arn:aws:sqs:us-east-2:123456789012:DummyQueueRef",
    }),
  });

  addMonitoringDashboardsToStack(stack, monitoring);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot test: all alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const queue = new Queue(stack, "Queue", {
    queueName: "DummyQueue",
  });

  let numAlarmsCreated = 0;

  const monitoring = new SqsQueueMonitoring(scope, {
    queue,
    addQueueMinSizeAlarm: {
      Warning: {
        minMessageCount: 1,
      },
    },
    addQueueMaxSizeAlarm: {
      Warning: {
        maxMessageCount: 5,
      },
    },
    addQueueMaxMessageAgeAlarm: {
      Warning: {
        maxAgeInSeconds: 100,
      },
    },
    addQueueMaxTimeToDrainMessagesAlarm: {
      Warning: {
        maxTimeToDrain: Duration.hours(6),
      },
    },
    addQueueMinIncomingMessagesAlarm: {
      Warning: {
        minIncomingMessagesCount: 0,
      },
    },
    addQueueMaxIncomingMessagesAlarm: {
      Warning: {
        maxIncomingMessagesCount: 1000,
      },
    },
    useCreatedAlarms: {
      consume(alarms: AlarmWithAnnotation[]) {
        numAlarmsCreated = alarms.length;
      },
    },
  });

  addMonitoringDashboardsToStack(stack, monitoring);
  expect(numAlarmsCreated).toStrictEqual(6);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot test: cross account", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const queue = new Queue(stack, "Queue", {
    queueName: "DummyQueue",
  });

  const monitoring = new SqsQueueMonitoring(scope, {
    queue,
    account: "different-account",
    addQueueMaxTimeToDrainMessagesAlarm: {
      Warning: {
        maxTimeToDrain: Duration.hours(6),
      },
    },
  });
  addMonitoringDashboardsToStack(stack, monitoring);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});
