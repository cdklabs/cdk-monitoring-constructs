import { Duration, Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { Function, InlineCode, Runtime } from "aws-cdk-lib/aws-lambda";

import {
  AlarmWithAnnotation,
  StepFunctionLambdaIntegrationMonitoring,
} from "../../../lib";
import { addMonitoringDashboardsToStack } from "../../utils/SnapshotUtil";
import { TestMonitoringScope } from "../TestMonitoringScope";

test("snapshot test: no alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const lambdaFunction = new Function(stack, "Function", {
    functionName: "DummyLambda",
    runtime: Runtime.NODEJS_LATEST,
    code: InlineCode.fromInline("{}"),
    handler: "Dummy::handler",
  });

  const monitoring = new StepFunctionLambdaIntegrationMonitoring(scope, {
    alarmFriendlyName: "DummyLambdaIntegration",
    lambdaFunction,
  });

  addMonitoringDashboardsToStack(stack, monitoring);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot test: all alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const lambdaFunction = new Function(stack, "Function", {
    functionName: "DummyLambda",
    runtime: Runtime.NODEJS_LATEST,
    code: InlineCode.fromInline("{}"),
    handler: "Dummy::handler",
  });

  let numAlarmsCreated = 0;

  const monitoring = new StepFunctionLambdaIntegrationMonitoring(scope, {
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

  addMonitoringDashboardsToStack(stack, monitoring);
  expect(numAlarmsCreated).toStrictEqual(6);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});
