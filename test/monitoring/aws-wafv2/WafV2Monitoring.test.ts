import { Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { Dimension } from "aws-cdk-lib/aws-cloudwatch";
import { CfnWebACL } from "aws-cdk-lib/aws-wafv2";

import { AlarmWithAnnotation, WafV2Monitoring } from "../../../lib";
import { addMonitoringDashboardsToStack } from "../../utils/SnapshotUtil";
import { TestMonitoringScope } from "../TestMonitoringScope";

test("snapshot test: alarms with REGIONAL ACL", () => {
  const stack = new Stack();
  const acl = new CfnWebACL(stack, "DummyAcl", {
    name: "DummyAclName",
    defaultAction: { allow: {} },
    scope: "REGIONAL",
    visibilityConfig: {
      sampledRequestsEnabled: true,
      cloudWatchMetricsEnabled: true,
      metricName: "DummyMetricName",
    },
  });

  const scope = new TestMonitoringScope(stack, "Scope");

  let numAlarmsCreated = 0;

  const monitoring = new WafV2Monitoring(scope, {
    acl,
    region: "us-east-1",
    addBlockedRequestsCountAlarm: {
      Warning: {
        maxErrorCount: 5,
      },
    },
    useCreatedAlarms: {
      consume(alarms) {
        expect(getDimensions(alarms[0])).toEqual([
          { name: "Region", value: "us-east-1" },
          { name: "Rule", value: "ALL" },
          { name: "WebACL", value: "DummyAclName" },
        ]);

        numAlarmsCreated = alarms.length;
      },
    },
  });

  addMonitoringDashboardsToStack(stack, monitoring);
  expect(numAlarmsCreated).toStrictEqual(1);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("with REGIONAL ACL but no region prop, throws error", () => {
  const stack = new Stack();
  const acl = new CfnWebACL(stack, "DummyAcl", {
    name: "DummyAclName",
    defaultAction: { allow: {} },
    scope: "REGIONAL",
    visibilityConfig: {
      sampledRequestsEnabled: true,
      cloudWatchMetricsEnabled: true,
      metricName: "DummyMetricName",
    },
  });

  const scope = new TestMonitoringScope(stack, "Scope");

  expect(() => new WafV2Monitoring(scope, { acl })).toThrow(
    `region is required if CfnWebACL has "REGIONAL" scope`,
  );
});

test("with CLOUDFRONT ACL and region prop, does not include as dimension", () => {
  const stack = new Stack();
  const acl = new CfnWebACL(stack, "DummyAcl", {
    name: "DummyAclName",
    defaultAction: { allow: {} },
    scope: "CLOUDFRONT",
    visibilityConfig: {
      sampledRequestsEnabled: true,
      cloudWatchMetricsEnabled: true,
      metricName: "DummyMetricName",
    },
  });

  const scope = new TestMonitoringScope(stack, "Scope");

  const monitoring = new WafV2Monitoring(scope, {
    acl,
    region: "us-west-2",
    addBlockedRequestsCountAlarm: {
      Warning: {
        maxErrorCount: 5,
      },
    },
    useCreatedAlarms: {
      consume(alarms) {
        expect(getDimensions(alarms[0])).toEqual([
          { name: "Rule", value: "ALL" },
          { name: "WebACL", value: "DummyAclName" },
        ]);
      },
    },
  });

  addMonitoringDashboardsToStack(stack, monitoring);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot test: all alarms ", () => {
  const stack = new Stack();
  const acl = new CfnWebACL(stack, "DummyAcl", {
    name: "DummyAclName",
    defaultAction: { allow: {} },
    scope: "CLOUDFRONT",
    visibilityConfig: {
      sampledRequestsEnabled: true,
      cloudWatchMetricsEnabled: true,
      metricName: "DummyMetricName",
    },
  });

  const scope = new TestMonitoringScope(stack, "Scope");

  let numAlarmsCreated = 0;

  const monitoring = new WafV2Monitoring(scope, {
    acl,
    addBlockedRequestsCountAlarm: {
      Warning: {
        maxErrorCount: 5,
      },
    },
    addBlockedRequestsRateAlarm: {
      Warning: {
        maxErrorRate: 0.05,
      },
    },
    useCreatedAlarms: {
      consume(alarms) {
        numAlarmsCreated = alarms.length;
      },
    },
  });

  addMonitoringDashboardsToStack(stack, monitoring);
  expect(numAlarmsCreated).toStrictEqual(2);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});

function getDimensions(alarm: AlarmWithAnnotation): Dimension[] | undefined {
  return alarm.alarmDefinition.metric.toMetricConfig().metricStat?.dimensions;
}
