import { Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";

import { AlarmWithAnnotation, GlueJobMonitoring } from "../../../lib";
import { lintStack } from "../../utils/LintUtil";
import { addMonitoringDashboardsToStack } from "../../utils/SnapshotUtil";
import { TestMonitoringScope } from "../TestMonitoringScope";

test("snapshot test: no alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const monitoring = new GlueJobMonitoring(scope, {
    jobName: "DummyGlueJob",
  });

  addMonitoringDashboardsToStack(stack, monitoring);
  lintStack(stack);
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
  lintStack(stack);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});
