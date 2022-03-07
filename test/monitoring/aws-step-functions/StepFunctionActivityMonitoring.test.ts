import { Duration, Stack } from "monocdk";
import { Template } from "monocdk/assertions";
import { Activity } from "monocdk/aws-stepfunctions";

import {
  AlarmWithAnnotation,
  StepFunctionActivityMonitoring,
} from "../../../lib";
import { TestMonitoringScope } from "../TestMonitoringScope";

test("snapshot test: no alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const activity = new Activity(stack, "Activity", {
    activityName: "DummyActivity",
  });

  new StepFunctionActivityMonitoring(scope, {
    alarmFriendlyName: "DummyActivity",
    activity,
  });

  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot test: all alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const activity = new Activity(stack, "Activity", {
    activityName: "DummyActivity",
  });

  let numAlarmsCreated = 0;

  new StepFunctionActivityMonitoring(scope, {
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

  expect(numAlarmsCreated).toStrictEqual(6);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});
