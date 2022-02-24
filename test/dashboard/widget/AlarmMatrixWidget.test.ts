import { Stack } from "monocdk";
import { Alarm, Metric } from "monocdk/aws-cloudwatch";

import { AlarmMatrixWidget } from "../../../lib/dashboard/widget/AlarmMatrixWidget";

test("no alarms", () => {
  const widget = new AlarmMatrixWidget({ title: "Title", alarms: [] });

  expect(widget.toJson()).toEqual([
    {
      height: 2,
      properties: {
        alarms: [],
        title: "Title",
      },
      type: "alarm",
      width: 24,
      x: undefined,
      y: undefined,
    },
  ]);
});

test("small number of alarms", () => {
  const stack = new Stack();

  const alarm = new Alarm(stack, "Alarm", {
    metric: new Metric({ metricName: "Metric", namespace: "Namespace" }),
    threshold: 10,
    evaluationPeriods: 5,
  });

  const widget = new AlarmMatrixWidget({
    title: "Title",
    alarms: Array(6).fill(alarm),
  });

  expect(widget.toJson()).toEqual([
    {
      height: 2,
      properties: {
        alarms: Array(6).fill(alarm.alarmArn),
        title: "Title",
      },
      type: "alarm",
      width: 24,
      x: undefined,
      y: undefined,
    },
  ]);
});

test("big number of alarms", () => {
  const stack = new Stack();

  const alarm = new Alarm(stack, "Alarm", {
    metric: new Metric({ metricName: "Metric", namespace: "Namespace" }),
    threshold: 10,
    evaluationPeriods: 5,
  });

  const widget = new AlarmMatrixWidget({
    title: "Title",
    alarms: Array(17).fill(alarm),
  });

  expect(widget.toJson()).toEqual([
    {
      height: 3,
      properties: {
        alarms: Array(17).fill(alarm.alarmArn),
        title: "Title",
      },
      type: "alarm",
      width: 24,
      x: undefined,
      y: undefined,
    },
  ]);
});
