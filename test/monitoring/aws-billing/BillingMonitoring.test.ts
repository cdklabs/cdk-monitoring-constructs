import {Stack} from "aws-cdk-lib";
import {Template} from "aws-cdk-lib/assertions";

import {AlarmWithAnnotation, BillingMonitoring} from "../../../lib";
import {addMonitoringDashboardsToStack} from "../../utils/SnapshotUtil";
import {TestMonitoringScope} from "../TestMonitoringScope";

test("snapshot test", () => {
    const stack = new Stack();

    const scope = new TestMonitoringScope(stack, "Scope");

    const monitoring = new BillingMonitoring(scope, {
        humanReadableName: "Billing",
    });

    addMonitoringDashboardsToStack(stack, monitoring);
    expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot test: all alarms", () => {
    const stack = new Stack();

    const scope = new TestMonitoringScope(stack, "Scope");

    let numAlarmsCreated = 0;

    const monitoring = new BillingMonitoring(scope, {
        humanReadableName: "Billing",
        addTotalCostAnomalyAlarm: {
            Warning: {
                alarmWhenBelowTheBand: false,
                alarmWhenAboveTheBand: true,
                standardDeviationForAlarm: 5,
            },
        },
        useCreatedAlarms: {
            consume(alarms: AlarmWithAnnotation[]) {
                numAlarmsCreated = alarms.length;
            },
        },
    });

    addMonitoringDashboardsToStack(stack, monitoring);
    expect(numAlarmsCreated).toStrictEqual(1);
    expect(Template.fromStack(stack)).toMatchSnapshot();
});
