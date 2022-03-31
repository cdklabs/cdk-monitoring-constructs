import { Duration, Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";

import {
  AlarmWithAnnotation,
  StepFunctionServiceIntegrationMonitoring,
} from "../../../lib";
import { TestMonitoringScope } from "../TestMonitoringScope";

test("snapshot test: no alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  new StepFunctionServiceIntegrationMonitoring(scope, {
    alarmFriendlyName: "DummyServiceIntegration",
    serviceIntegrationResourceArn:
      "arn:aws:states:eu-west-1:216854468193:batch:submitJob.sync",
  });

  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot test: all alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  let numAlarmsCreated = 0;

  new StepFunctionServiceIntegrationMonitoring(scope, {
    alarmFriendlyName: "DummyServiceIntegration",
    serviceIntegrationResourceArn:
      "arn:aws:states:eu-west-1:216854468193:batch:submitJob.sync",
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
    addFailedServiceIntegrationsCountAlarm: {
      Warning: {
        maxErrorCount: 2,
      },
    },
    addFailedServiceIntegrationsRateAlarm: {
      Warning: {
        maxErrorRate: 1,
      },
    },
    addTimedOutServiceIntegrationsCountAlarm: {
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
