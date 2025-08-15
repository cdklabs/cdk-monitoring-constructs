import { Duration, Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { CfnCollection } from "aws-cdk-lib/aws-opensearchserverless";

import {
  AlarmWithAnnotation,
  OpenSearchServerlessMonitoring,
} from "../../../lib";
import { addMonitoringDashboardsToStack } from "../../utils/SnapshotUtil";
import { TestMonitoringScope } from "../TestMonitoringScope";

test("snapshot test: no alarms", () => {
  const stack = new Stack();
  const scope = new TestMonitoringScope(stack, "Scope");

  const collection = new CfnCollection(stack, "Collection", {
    name: "TestCollection",
  });

  const monitoring = new OpenSearchServerlessMonitoring(scope, {
    collection,
  });

  addMonitoringDashboardsToStack(stack, monitoring);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot test: all alarms", () => {
  const stack = new Stack();
  const scope = new TestMonitoringScope(stack, "Scope");

  let numAlarmsCreated = 0;

  const collection = new CfnCollection(stack, "Collection", {
    name: "TestCollection",
  });

  const monitoring = new OpenSearchServerlessMonitoring(scope, {
    collection,
    add4xxCountAlarm: {
      Warning: {
        maxErrorCount: 0,
      },
    },
    add4xxRateAlarm: {
      Warning: {
        maxErrorRate: 0.1,
      },
    },
    add5xxCountAlarm: {
      Warning: {
        maxErrorCount: 0,
      },
    },
    add5xxRateAlarm: {
      Warning: {
        maxErrorRate: 0.1,
      },
    },
    addSearchErrorCountAlarm: {
      Warning: {
        maxErrorCount: 0,
      },
    },
    addSearchLatencyP100Alarm: {
      Warning: {
        maxLatency: Duration.seconds(5),
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
