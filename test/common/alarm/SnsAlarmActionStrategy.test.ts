import { Stack } from "monocdk";
import { Template } from "monocdk/assertions";
import { Alarm, Metric } from "monocdk/aws-cloudwatch";
import { Topic } from "monocdk/aws-sns";

import { SnsAlarmActionStrategy } from "../../../lib";

test("snapshot test: default action only", () => {
  const stack = new Stack();
  const onAlarmTopic = new Topic(stack, "DummyTopic");
  const alarm = new Alarm(stack, "DummyAlarm", {
    evaluationPeriods: 1,
    threshold: 0,
    metric: new Metric({ namespace: "Dummy", metricName: "Dummy" }),
  });
  const action = new SnsAlarmActionStrategy({ onAlarmTopic });
  action.addAlarmActions({ alarm, action });

  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot test: all actions", () => {
  const stack = new Stack();
  const onAlarmTopic = new Topic(stack, "DummyTopic");
  const onOkTopic = new Topic(stack, "DummyOkTopic");
  const onInsufficientDataTopic = new Topic(
    stack,
    "DummyInsufficientDataTopic"
  );
  const alarm = new Alarm(stack, "DummyAlarm", {
    evaluationPeriods: 1,
    threshold: 0,
    metric: new Metric({ namespace: "Dummy", metricName: "Dummy" }),
  });
  const action = new SnsAlarmActionStrategy({
    onAlarmTopic,
    onOkTopic,
    onInsufficientDataTopic,
  });
  action.addAlarmActions({ alarm, action });

  expect(Template.fromStack(stack)).toMatchSnapshot();
});
