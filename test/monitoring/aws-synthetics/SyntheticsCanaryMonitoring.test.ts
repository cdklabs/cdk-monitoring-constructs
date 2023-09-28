import { Duration, Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import {
  Canary,
  Code,
  Runtime,
  Schedule,
  Test,
} from "aws-cdk-lib/aws-synthetics";

import { AlarmWithAnnotation } from "../../../lib";
import { SyntheticsCanaryMonitoring } from "../../../lib/monitoring/aws-synthetics";
import { addMonitoringDashboardsToStack } from "../../utils/SnapshotUtil";
import { TestMonitoringScope } from "../TestMonitoringScope";

test("snapshot test: no alarms", () => {
  const stack = new Stack();
  const canary = new Canary(stack, "Canary", {
    schedule: Schedule.rate(Duration.minutes(5)),
    test: Test.custom({
      code: Code.fromInline("/* nothing */"),
      handler: "index.handler", // must end with '.handler'
    }),
    runtime: Runtime.SYNTHETICS_NODEJS_PUPPETEER_5_1,
  });

  const scope = new TestMonitoringScope(stack, "Scope");

  const monitoring = new SyntheticsCanaryMonitoring(scope, { canary });

  addMonitoringDashboardsToStack(stack, monitoring);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot test: all alarms", () => {
  const stack = new Stack();
  const canary = new Canary(stack, "Canary", {
    schedule: Schedule.rate(Duration.minutes(5)),
    test: Test.custom({
      code: Code.fromInline("/* nothing */"),
      handler: "index.handler", // must end with '.handler'
    }),
    runtime: Runtime.SYNTHETICS_NODEJS_PUPPETEER_5_1,
  });

  const scope = new TestMonitoringScope(stack, "Scope");

  let numAlarmsCreated = 0;

  const monitoring = new SyntheticsCanaryMonitoring(scope, {
    canary,
    addAverageLatencyAlarm: {
      Warning: {
        maxLatency: Duration.seconds(10),
      },
    },
    add4xxErrorCountAlarm: {
      Warning: {
        maxErrorCount: 1,
      },
    },
    add5xxFaultCountAlarm: {
      Warning: {
        maxErrorCount: 2,
      },
    },
    add4xxErrorRateAlarm: {
      Warning: {
        maxErrorRate: 0.5,
      },
    },
    add5xxFaultRateAlarm: {
      Warning: {
        maxErrorRate: 0.8,
      },
    },
    useCreatedAlarms: {
      consume(alarms: AlarmWithAnnotation[]) {
        numAlarmsCreated = alarms.length;
      },
    },
  });

  expect(numAlarmsCreated).toStrictEqual(5);
  addMonitoringDashboardsToStack(stack, monitoring);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});
