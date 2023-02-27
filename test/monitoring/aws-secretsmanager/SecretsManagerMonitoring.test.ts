import { Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";

import { AlarmWithAnnotation, SecretsManagerMonitoring } from "../../../lib";
import { addMonitoringDashboardsToStack } from "../../utils/SnapshotUtil";
import { TestMonitoringScope } from "../TestMonitoringScope";

test("snapshot test", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const monitoring = new SecretsManagerMonitoring(scope, {
    humanReadableName: "SecretsManager",
  });

  addMonitoringDashboardsToStack(stack, monitoring);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot test: all alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  let numAlarmsCreated = 0;

  const monitoring = new SecretsManagerMonitoring(scope, {
    humanReadableName: "SecretsManager",
    addChangeInSecretsAlarm: {
      Warning: {
        alarmWhenDecreased: false,
        alarmWhenIncreased: true,
        requiredSecretCount: 4,
      },
    },
    addMinNumberSecretsAlarm: {
      Warning: {
        minSecretCount: 3,
      },
    },
    addMaxNumberSecretsAlarm: {
      Warning: {
        maxSecretCount: 5,
      },
    },
    useCreatedAlarms: {
      consume(alarms: AlarmWithAnnotation[]) {
        numAlarmsCreated = alarms.length;
      },
    },
  });

  addMonitoringDashboardsToStack(stack, monitoring);
  expect(numAlarmsCreated).toStrictEqual(3);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});
