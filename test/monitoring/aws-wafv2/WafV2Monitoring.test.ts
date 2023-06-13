import {Stack} from "aws-cdk-lib";
import {Template} from "aws-cdk-lib/assertions";
import {CfnWebACL} from "aws-cdk-lib/aws-wafv2";

import {WafV2Monitoring} from "../../../lib";
import {addMonitoringDashboardsToStack} from "../../utils/SnapshotUtil";
import {TestMonitoringScope} from "../TestMonitoringScope";

test("snapshot test: no alarms", () => {
    const stack = new Stack();
    const acl = new CfnWebACL(stack, "DummyAcl", {
        name: "DummyAclName",
        defaultAction: {allow: {}},
        scope: "REGIONAL",
        visibilityConfig: {
            sampledRequestsEnabled: true,
            cloudWatchMetricsEnabled: true,
            metricName: "DummyMetricName",
        },
    });

    const scope = new TestMonitoringScope(stack, "Scope");

    const monitoring = new WafV2Monitoring(scope, {acl, region: "us-east-1"});

    addMonitoringDashboardsToStack(stack, monitoring);
    expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot test: all alarms", () => {
    const stack = new Stack();
    const acl = new CfnWebACL(stack, "DummyAcl", {
        name: "DummyAclName",
        defaultAction: {allow: {}},
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
