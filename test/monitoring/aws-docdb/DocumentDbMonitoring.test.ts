import {Stack} from "aws-cdk-lib";
import {Template} from "aws-cdk-lib/assertions";
import {DatabaseCluster} from "aws-cdk-lib/aws-docdb";
import {InstanceClass, InstanceSize, InstanceType, Vpc} from "aws-cdk-lib/aws-ec2";

import {DocumentDbMonitoring} from "../../../lib";
import {addMonitoringDashboardsToStack} from "../../utils/SnapshotUtil";
import {TestMonitoringScope} from "../TestMonitoringScope";

test("snapshot test: no alarms", () => {
    const stack = new Stack();
    const scope = new TestMonitoringScope(stack, "Scope");
    const cluster = new DatabaseCluster(stack, "DummyDocDbCluster", {
        vpc: new Vpc(stack, "Vpc"),
        masterUser: {username: "master"},
        instanceType: InstanceType.of(InstanceClass.C5, InstanceSize.LARGE),
    });

    const monitoring = new DocumentDbMonitoring(scope, {
        alarmFriendlyName: "DummyDocDbCluster",
        cluster,
    });

    addMonitoringDashboardsToStack(stack, monitoring);
    expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot test: all alarms", () => {
    const stack = new Stack();
    const scope = new TestMonitoringScope(stack, "Scope");
    const cluster = new DatabaseCluster(stack, "DummyDocDbCluster", {
        vpc: new Vpc(stack, "Vpc"),
        masterUser: {username: "master"},
        instanceType: InstanceType.of(InstanceClass.C5, InstanceSize.LARGE),
    });

    let numAlarmsCreated = 0;

    const monitoring = new DocumentDbMonitoring(scope, {
        cluster,
        addCpuUsageAlarm: {
            Warning: {
                maxUsagePercent: 70,
            },
        },
        useCreatedAlarms: {
            consume(alarms) {
                numAlarmsCreated = alarms.length;
            },
        },
    });

    addMonitoringDashboardsToStack(stack, monitoring);
    expect(numAlarmsCreated).toStrictEqual(1);
    expect(Template.fromStack(stack)).toMatchSnapshot();
});
