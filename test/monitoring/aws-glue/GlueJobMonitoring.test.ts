import { Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";

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

test("snapshot test: state change alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  let numAlarmsCreated = 0;

  const monitoring = new GlueJobMonitoring(scope, {
    jobName: "DummyGlueJob",
    alarmFriendlyName: "DummyGlueAlarm",
    addJobFailedStateCountAlarm: {
      Warning: {
        maxErrorCount: 1,
      },
    },
    addJobTimeoutStateCountAlarm: {
      Warning: {
        maxErrorCount: 1,
      },
    },
    useCreatedAlarms: {
      consume(alarms: AlarmWithAnnotation[]) {
        numAlarmsCreated = alarms.length;
      },
    },
  });

  expect(numAlarmsCreated).toStrictEqual(2);
  addMonitoringDashboardsToStack(stack, monitoring);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("state change alarms create EventBridge rules", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  new GlueJobMonitoring(scope, {
    jobName: "MyJob",
    addJobFailedStateCountAlarm: {
      Critical: {
        maxErrorCount: 1,
      },
    },
  });

  const template = Template.fromStack(stack);
  template.hasResourceProperties("AWS::Events::Rule", {
    EventPattern: {
      source: ["aws.glue"],
      "detail-type": ["Glue Job State Change"],
      detail: {
        jobName: ["MyJob"],
        state: ["FAILED"],
      },
    },
  });
});

test("two Glue jobs can share the same monitoring scope", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  new GlueJobMonitoring(scope, {
    jobName: "JobA",
  });
  new GlueJobMonitoring(scope, {
    jobName: "JobB",
  });

  const template = Template.fromStack(stack);
  for (const jobName of ["JobA", "JobB"]) {
    for (const state of ["FAILED", "TIMEOUT"]) {
      template.hasResourceProperties("AWS::Events::Rule", {
        EventPattern: {
          source: ["aws.glue"],
          "detail-type": ["Glue Job State Change"],
          detail: {
            jobName: [jobName],
            state: [state],
          },
        },
      });
    }
  }
});

test("EventBridge rules are always created", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  new GlueJobMonitoring(scope, {
    jobName: "MyJob",
  });

  const template = Template.fromStack(stack);
  template.hasResourceProperties("AWS::Events::Rule", {
    EventPattern: {
      source: ["aws.glue"],
      "detail-type": ["Glue Job State Change"],
      detail: {
        jobName: ["MyJob"],
        state: ["FAILED"],
      },
    },
  });
  template.hasResourceProperties("AWS::Events::Rule", {
    EventPattern: {
      source: ["aws.glue"],
      "detail-type": ["Glue Job State Change"],
      detail: {
        jobName: ["MyJob"],
        state: ["TIMEOUT"],
      },
    },
  });
});
