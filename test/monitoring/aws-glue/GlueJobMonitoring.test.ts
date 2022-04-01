import { Stack } from "monocdk";
import { Template } from "monocdk/assertions";

import { AlarmWithAnnotation, GlueJobMonitoring } from "../../../lib";
import { addMonitoringDashboardsToStack } from "../../utils/SnapshotUtil";
import { TestMonitoringScope } from "../TestMonitoringScope";

test("snapshot test: no alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const monitoring = new GlueJobMonitoring(scope, {
    jobName: "DummyGlueJob",
  });

  addMonitoringDashboardsToStack(stack, monitoring);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot test: all alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  let numAlarmsCreated = 0;

  const monitoring = new GlueJobMonitoring(scope, {
    jobName: "DummyGlueJob",
    alarmFriendlyName: "DummyApi",
    addKilledTaskCountAlarm: {
      Warning: {
        maxErrorCount: 3,
      },
    },
    addKilledTaskRateAlarm: {
      Warning: {
        maxErrorRate: 2,
      },
    },
    addFailedTaskCountAlarm: {
      Warning: {
        maxErrorCount: 3,
      },
    },
    addFailedTaskRateAlarm: {
      Warning: {
        maxErrorRate: 4,
      },
    },
    useCreatedAlarms: {
      consume(alarms: AlarmWithAnnotation[]) {
        numAlarmsCreated = alarms.length;
      },
    },
  });

  expect(numAlarmsCreated).toStrictEqual(4);
  addMonitoringDashboardsToStack(stack, monitoring);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});
