import { Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { Alarm, Metric } from "aws-cdk-lib/aws-cloudwatch";
import {
  determineLatestNodeRuntime,
  Function,
  InlineCode,
} from "aws-cdk-lib/aws-lambda";

import { LambdaAlarmActionStrategy } from "../../../../lib";

test("snapshot test: Lambda function", () => {
  const stack = new Stack();
  const onAlarmFunction = new Function(stack, "alarmLambda", {
    functionName: "DummyLambda",
    runtime: determineLatestNodeRuntime(stack),
    code: InlineCode.fromInline("{}"),
    handler: "Dummy::handler",
  });
  const alarm = new Alarm(stack, "DummyAlarm", {
    evaluationPeriods: 1,
    threshold: 0,
    metric: new Metric({ namespace: "Dummy", metricName: "Dummy" }),
  });
  const action = new LambdaAlarmActionStrategy(onAlarmFunction);
  action.addAlarmActions({ alarm, action });

  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot test: Lambda alias", () => {
  const stack = new Stack();
  const onAlarmFunction = new Function(stack, "alarmLambda", {
    functionName: "DummyLambda",
    runtime: determineLatestNodeRuntime(stack),
    code: InlineCode.fromInline("{}"),
    handler: "Dummy::handler",
  });
  const alias = onAlarmFunction.addAlias("aliasName");
  const alarm = new Alarm(stack, "DummyAlarm", {
    evaluationPeriods: 1,
    threshold: 0,
    metric: new Metric({ namespace: "Dummy", metricName: "Dummy" }),
  });
  const action = new LambdaAlarmActionStrategy(alias);
  action.addAlarmActions({ alarm, action });

  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot test: Lambda version", () => {
  const stack = new Stack();
  const onAlarmFunction = new Function(stack, "alarmLambda", {
    functionName: "DummyLambda",
    runtime: determineLatestNodeRuntime(stack),
    code: InlineCode.fromInline("{}"),
    handler: "Dummy::handler",
  });
  const version = onAlarmFunction.currentVersion;
  const alarm = new Alarm(stack, "DummyAlarm", {
    evaluationPeriods: 1,
    threshold: 0,
    metric: new Metric({ namespace: "Dummy", metricName: "Dummy" }),
  });
  const action = new LambdaAlarmActionStrategy(version);
  action.addAlarmActions({ alarm, action });

  expect(Template.fromStack(stack)).toMatchSnapshot();
});
