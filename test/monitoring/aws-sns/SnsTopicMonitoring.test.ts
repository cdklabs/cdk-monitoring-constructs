import { Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { Topic } from "aws-cdk-lib/aws-sns";

import { AlarmWithAnnotation, SnsTopicMonitoring } from "../../../lib";
import { TestMonitoringScope } from "../TestMonitoringScope";

test("snapshot test: no alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const topic = new Topic(stack, "Topic", {
    topicName: "DummyTopic",
  });

  new SnsTopicMonitoring(scope, {
    topic,
  });

  // alternative: use reference

  new SnsTopicMonitoring(scope, {
    topic: Topic.fromTopicArn(
      stack,
      "DummyTopicRef",
      "arn:aws:sns:us-east-2:123456789012:DummyTopicRef"
    ),
  });

  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot test: all alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const topic = new Topic(stack, "Topic", {
    topicName: "DummyTopic",
  });

  let numAlarmsCreated = 0;

  new SnsTopicMonitoring(scope, {
    topic,
  });

  new SnsTopicMonitoring(scope, {
    topic,
    addMessageNotificationsFailedAlarm: {
      Warning: {
        maxNotificationsFailedCount: 5,
      },
    },
    addMinNumberOfMessagesPublishedAlarm: {
      Warning: {
        minMessagesPublishedCount: 100,
      },
    },
    addMaxNumberOfMessagesPublishedAlarm: {
      Warning: {
        maxMessagesPublishedCount: 200,
      },
    },
    useCreatedAlarms: {
      consume(alarms: AlarmWithAnnotation[]) {
        numAlarmsCreated = alarms.length;
      },
    },
  });

  expect(numAlarmsCreated).toStrictEqual(3);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});
