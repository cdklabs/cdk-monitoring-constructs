import { Duration, Stack } from "monocdk";
import { Template } from "monocdk/assertions";
import { TreatMissingData } from "monocdk/aws-cloudwatch";
import { Pass, StateMachine } from "monocdk/aws-stepfunctions";

import { AlarmWithAnnotation, StepFunctionMonitoring } from "../../../lib";
import { TestMonitoringScope } from "../TestMonitoringScope";

test("snapshot test: no alarms", () => {
  const stack = new Stack();

  const stateMachine = new StateMachine(stack, "DummyStateMachine", {
    definition: new Pass(stack, "DummyStep"),
  });

  const scope = new TestMonitoringScope(stack, "Scope");

  new StepFunctionMonitoring(scope, {
    alarmFriendlyName: "DummyStateMachine",
    stateMachine,
  });

  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot test: all alarms", () => {
  const stack = new Stack();

  const stateMachine = new StateMachine(stack, "DummyStateMachine", {
    definition: new Pass(stack, "DummyStep"),
  });

  const scope = new TestMonitoringScope(stack, "Scope");

  let numAlarmsCreated = 0;

  new StepFunctionMonitoring(scope, {
    alarmFriendlyName: "DummyStateMachine",
    stateMachine,
    addAbortedExecutionCountAlarm: {
      Warning: {
        maxErrorCount: 2,
      },
    },
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
    addFailedExecutionCountAlarm: {
      Warning: {
        maxErrorCount: 2,
      },
    },
    addFailedExecutionRateAlarm: {
      Warning: {
        maxErrorRate: 1,
      },
    },
    addThrottledExecutionCountAlarm: {
      Warning: {
        maxErrorCount: 2,
      },
    },
    addTimedOutExecutionCountAlarm: {
      Warning: {
        maxErrorCount: 2,
      },
    },
    addMinStartedExecutionCountAlarm: {
      Warning: {
        minRunningTasks: 1,
        treatMissingDataOverride: TreatMissingData.NOT_BREACHING,
      },
    },
    useCreatedAlarms: {
      consume(alarms: AlarmWithAnnotation[]) {
        numAlarmsCreated = alarms.length;
      },
    },
  });

  expect(numAlarmsCreated).toStrictEqual(9);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot test: all alarms, alarmPrefix on latency dedupeString", () => {
  const stack = new Stack();

  const stateMachine = new StateMachine(stack, "DummyStateMachine", {
    definition: new Pass(stack, "DummyStep"),
  });

  const scope = new TestMonitoringScope(stack, "Scope");

  let numAlarmsCreated = 0;

  new StepFunctionMonitoring(scope, {
    alarmFriendlyName: "DummyStateMachine",
    stateMachine,
    addAbortedExecutionCountAlarm: {
      Warning: {
        maxErrorCount: 2,
      },
    },
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
    addFailedExecutionCountAlarm: {
      Warning: {
        maxErrorCount: 2,
      },
    },
    addFailedExecutionRateAlarm: {
      Warning: {
        maxErrorRate: 1,
      },
    },
    addThrottledExecutionCountAlarm: {
      Warning: {
        maxErrorCount: 2,
      },
    },
    addTimedOutExecutionCountAlarm: {
      Warning: {
        maxErrorCount: 2,
      },
    },
    addMinStartedExecutionCountAlarm: {
      Warning: {
        minRunningTasks: 1,
        treatMissingDataOverride: TreatMissingData.NOT_BREACHING,
      },
    },
    useCreatedAlarms: {
      consume(alarms: AlarmWithAnnotation[]) {
        numAlarmsCreated = alarms.length;
      },
    },
  });

  expect(numAlarmsCreated).toStrictEqual(9);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});
