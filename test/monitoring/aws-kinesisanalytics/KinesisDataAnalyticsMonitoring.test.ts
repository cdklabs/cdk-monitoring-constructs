import { Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";

import { KinesisDataAnalyticsMonitoring } from "../../../lib";
import { addMonitoringDashboardsToStack } from "../../utils/SnapshotUtil";
import { TestMonitoringScope } from "../TestMonitoringScope";

test("snapshot test: no alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const monitoring = new KinesisDataAnalyticsMonitoring(scope, {
    application: "DummyApplication",
  });

  addMonitoringDashboardsToStack(stack, monitoring);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot test: full restart rate alarm", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const monitoring = new KinesisDataAnalyticsMonitoring(scope, {
    application: "DummyApplication",
    addFullRestartRateAlarm: {
      Warning: {
        maxErrorRate: 0.05,
      },
    },
  });

  addMonitoringDashboardsToStack(stack, monitoring);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot test: all alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  let numAlarmsCreated = 0;

  const monitoring = new KinesisDataAnalyticsMonitoring(scope, {
    application: "DummyApplication",
    addDowntimeAlarm: {
      Warning: {
        maxDowntimeInMillis: 300_000,
      },
    },
    addFullRestartCountAlarm: {
      Warning: {
        maxFullRestartCount: 1,
      },
    },
    addFullRestartRateAlarm: {
      Warning: {
        maxErrorRate: 0.1,
      },
    },
    addCheckpointFailureCountAlarm: {
      Warning: {
        maxErrorCount: 5,
      },
    },
    addCheckpointFailureRateAlarm: {
      Warning: {
        maxErrorRate: 0.1,
      },
    },
    useCreatedAlarms: {
      consume(alarms) {
        numAlarmsCreated = alarms.length;
      },
    },
  });

  addMonitoringDashboardsToStack(stack, monitoring);
  expect(numAlarmsCreated).toStrictEqual(5);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});
