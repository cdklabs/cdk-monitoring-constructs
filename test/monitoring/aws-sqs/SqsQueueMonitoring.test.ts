import { Duration, Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { Queue } from "aws-cdk-lib/aws-sqs";

import { AlarmWithAnnotation, SqsQueueMonitoring } from "../../../lib";
import { TestMonitoringScope } from "../TestMonitoringScope";

test("snapshot test: no alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const queue = new Queue(stack, "Queue", {
    queueName: "DummyQueue",
  });

  new SqsQueueMonitoring(scope, {
    queue,
  });

  // alternative: use reference

  new SqsQueueMonitoring(scope, {
    queue: Queue.fromQueueAttributes(stack, "DummyQueueRef", {
      queueArn: "arn:aws:sqs:us-east-2:123456789012:DummyQueueRef",
    }),
  });

  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot test: all alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const queue = new Queue(stack, "Queue", {
    queueName: "DummyQueue",
  });

  let numAlarmsCreated = 0;

  new SqsQueueMonitoring(scope, {
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

  expect(numAlarmsCreated).toStrictEqual(6);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});
