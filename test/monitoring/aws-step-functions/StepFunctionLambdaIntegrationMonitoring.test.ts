import { Duration, Stack } from "monocdk";
import { Template } from "monocdk/assertions";
import { Function, InlineCode, Runtime } from "monocdk/aws-lambda";

import {
  AlarmWithAnnotation,
  StepFunctionLambdaIntegrationMonitoring,
} from "../../../lib";
import { TestMonitoringScope } from "../TestMonitoringScope";

test("snapshot test: no alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const lambdaFunction = new Function(stack, "Function", {
    functionName: "DummyLambda",
    runtime: Runtime.NODEJS_12_X,
    code: InlineCode.fromInline("{}"),
    handler: "Dummy::handler",
  });

  new StepFunctionLambdaIntegrationMonitoring(scope, {
    alarmFriendlyName: "DummyLambdaIntegration",
    lambdaFunction,
  });

  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot test: all alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const lambdaFunction = new Function(stack, "Function", {
    functionName: "DummyLambda",
    runtime: Runtime.NODEJS_12_X,
    code: InlineCode.fromInline("{}"),
    handler: "Dummy::handler",
  });

  let numAlarmsCreated = 0;

  new StepFunctionLambdaIntegrationMonitoring(scope, {
    alarmFriendlyName: "DummyLambdaIntegration",
    lambdaFunction,
    addDurationP50Alarm: {
      Warning: {
        maxDuration: Duration.minutes(1),
      },
    },
    addDurationP90Alarm: {
      Warning: {
        maxDuration: Duration.minutes(2),
      },
    },
    addDurationP99Alarm: {
      Warning: {
        maxDuration: Duration.minutes(3),
      },
    },
    addFailedFunctionsCountAlarm: {
      Warning: {
        maxErrorCount: 2,
      },
    },
    addFailedFunctionsRateAlarm: {
      Warning: {
        maxErrorRate: 1,
      },
    },
    addTimedOutFunctionsCountAlarm: {
      Warning: {
        maxErrorCount: 2,
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
