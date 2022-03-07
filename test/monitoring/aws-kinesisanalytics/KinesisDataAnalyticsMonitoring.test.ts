import { Stack } from "monocdk";
import { Template } from "monocdk/assertions";

import { KinesisDataAnalyticsMonitoring } from "../../../lib";
import { TestMonitoringScope } from "../TestMonitoringScope";

test("snapshot test: no alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  new KinesisDataAnalyticsMonitoring(scope, {
    application: "DummyApplication",
  });

  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot test: all alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  let numAlarmsCreated = 0;

  new KinesisDataAnalyticsMonitoring(scope, {
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
    useCreatedAlarms: {
      consume(alarms) {
        numAlarmsCreated = alarms.length;
      },
    },
  });

  expect(numAlarmsCreated).toStrictEqual(2);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});
