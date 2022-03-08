import { Stack } from "monocdk";
import { Template } from "monocdk/assertions";
import { Queue } from "monocdk/aws-sqs";

import { AlarmWithAnnotation, SqsQueueMonitoringWithDlq } from "../../../lib";
import { TestMonitoringScope } from "../TestMonitoringScope";

test("snapshot test: no alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const queue = new Queue(stack, "Queue", {
    queueName: "DummyQueue",
  });

  const deadLetterQueue = new Queue(stack, "DeadLetterQueue", {
    queueName: "DummyQueue-DLQ",
  });

  new SqsQueueMonitoringWithDlq(scope, {
    queue,
    deadLetterQueue,
  });

  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot test: all alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const queue = new Queue(stack, "Queue", {
    queueName: "DummyQueue",
  });

  const deadLetterQueue = new Queue(stack, "DeadLetterQueue", {
    queueName: "DummyQueue-DLQ",
  });

  let numAlarmsCreated = 0;

  new SqsQueueMonitoringWithDlq(scope, {
    queue,
    deadLetterQueue,
    addQueueMaxSizeAlarm: {
      Warning: {
        maxMessageCount: 1,
      },
    },
    addQueueMaxMessageAgeAlarm: {
      Warning: {
        maxAgeInSeconds: 100,
      },
    },
    addDeadLetterQueueMaxSizeAlarm: {
      Critical: {
        maxMessageCount: 2,
      },
    },
    addDeadLetterQueueMaxMessageAgeAlarm: {
      Critical: {
        maxAgeInSeconds: 200,
      },
    },
    addDeadLetterQueueMaxIncomingMessagesAlarm: {
      Critical: {
        maxIncomingMessagesCount: 5,
      },
    },
    useCreatedAlarms: {
      consume(alarms: AlarmWithAnnotation[]) {
        numAlarmsCreated = alarms.length;
      },
    },
  });

  expect(numAlarmsCreated).toStrictEqual(5);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("useCreatedAlarms is only called once with all alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const queue = new Queue(stack, "Queue", {
    queueName: "DummyQueue",
  });

  const deadLetterQueue = new Queue(stack, "DeadLetterQueue", {
    queueName: "DummyQueue-DLQ",
  });

  let numTimesCalled = 0;
  let numAlarmsCreated = 0;

  new SqsQueueMonitoringWithDlq(scope, {
    queue,
    deadLetterQueue,
    addQueueMaxSizeAlarm: {
      Warning: {
        maxMessageCount: 1,
      },
    },
    addDeadLetterQueueMaxMessageAgeAlarm: {
      Warning: {
        maxAgeInSeconds: 1500,
      },
    },
    useCreatedAlarms: {
      consume(alarms: AlarmWithAnnotation[]) {
        numTimesCalled++;
        numAlarmsCreated += alarms.length;
      },
    },
  });

  expect(numTimesCalled).toStrictEqual(1);
  expect(numAlarmsCreated).toStrictEqual(2);
});
