import { Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { Alarm, Metric } from "aws-cdk-lib/aws-cloudwatch";
import { Topic } from "aws-cdk-lib/aws-sns";

import {
  isMultipleAlarmActionStrategy,
  multipleActions,
  SnsAlarmActionStrategy,
} from "../../../../lib";

test("snapshot test: multiple actions", () => {
  const stack = new Stack();
  const topic1 = new Topic(stack, "DummyTopic1");
  const topic2 = new Topic(stack, "DummyTopic2");
  const topic3 = new Topic(stack, "DummyTopic3");
  const alarm = new Alarm(stack, "DummyAlarm", {
    evaluationPeriods: 1,
    threshold: 0,
    metric: new Metric({ namespace: "Dummy", metricName: "Dummy" }),
  });

  const action1 = new SnsAlarmActionStrategy({ onAlarmTopic: topic1 });
  const action2 = new SnsAlarmActionStrategy({ onAlarmTopic: topic2 });
  const action3 = new SnsAlarmActionStrategy({ onAlarmTopic: topic3 });

  const action = multipleActions(action1, action2, action3);
  action.addAlarmActions({ alarm, action });

  expect(Template.fromStack(stack)).toMatchSnapshot();
  expect(action.flattenedAlarmActions()).toEqual([action1, action2, action3]);
});

test("isMultipleAlarmActionStrategy", () => {
  const stack = new Stack();
  const topic1 = new Topic(stack, "DummyTopic1");
  const snsAction = new SnsAlarmActionStrategy({ onAlarmTopic: topic1 });
  const multipleAction = multipleActions(snsAction);

  expect(isMultipleAlarmActionStrategy(multipleAction)).toBe(true);
  expect(isMultipleAlarmActionStrategy(snsAction)).toBe(false);
});
