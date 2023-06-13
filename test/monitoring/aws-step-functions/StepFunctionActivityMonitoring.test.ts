import { Duration, Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { Activity } from "aws-cdk-lib/aws-stepfunctions";

import {
  AlarmWithAnnotation,
  StepFunctionActivityMonitoring,
} from "../../../lib";
import { addMonitoringDashboardsToStack } from "../../utils/SnapshotUtil";
import { TestMonitoringScope } from "../TestMonitoringScope";

test("snapshot test: no alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const activity = new Activity(stack, "Activity", {
    activityName: "DummyActivity",
  });

  const monitoring = new StepFunctionActivityMonitoring(scope, {
    alarmFriendlyName: "DummyActivity",
    activity,
  });

  addMonitoringDashboardsToStack(stack, monitoring);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot test: all alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const activity = new Activity(stack, "Activity", {
    activityName: "DummyActivity",
  });

  let numAlarmsCreated = 0;

  const monitoring = new StepFunctionActivityMonitoring(scope, {
    alarmFriendlyName: "DummyActivity",
    activity,
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
    addFailedActivitiesCountAlarm: {
      Warning: {
        maxErrorCount: 2,
      },
    },
    addFailedActivitiesRateAlarm: {
      Warning: {
        maxErrorRate: 1,
      },
    },
    addTimedOutActivitiesCountAlarm: {
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
