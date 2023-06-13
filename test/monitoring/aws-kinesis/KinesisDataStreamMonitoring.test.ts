import {Stack} from "aws-cdk-lib";
import {Template} from "aws-cdk-lib/assertions";

import {KinesisDataStreamMonitoring} from "../../../lib";
import {addMonitoringDashboardsToStack} from "../../utils/SnapshotUtil";
import {TestMonitoringScope} from "../TestMonitoringScope";

test("snapshot test for stream: no alarms", () => {
    const stack = new Stack();

    const scope = new TestMonitoringScope(stack, "Scope");

    const monitoring = new KinesisDataStreamMonitoring(scope, {
        streamName: "my-kinesis-data-stream",
    });

    addMonitoringDashboardsToStack(stack, monitoring);
    expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot test for stream: all alarms", () => {
    const stack = new Stack();

    const scope = new TestMonitoringScope(stack, "Scope");

    let numAlarmsCreated = 0;

    const monitoring = new KinesisDataStreamMonitoring(scope, {
        streamName: "my-kinesis-data-stream",
        addIteratorMaxAgeAlarm: {
            Warning: {
                maxAgeInMillis: 1_000_000,
            },
        },
        addPutRecordsThrottledAlarm: {
            Critical: {
                maxRecordsThrottledThreshold: 5,
            },
        },
        addPutRecordsFailedAlarm: {
            Critical: {
                maxRecordsFailedThreshold: 5,
            },
        },
        addReadProvisionedThroughputExceededAlarm: {
            Critical: {
                maxRecordsThrottledThreshold: 0,
            },
        },
        addWriteProvisionedThroughputExceededAlarm: {
            Critical: {
                maxRecordsThrottledThreshold: 0,
            },
        },
        useCreatedAlarms: {
            consume(alarms) {
                numAlarmsCreated = alarms.length;
            },
        },
    });

    expect(numAlarmsCreated).toStrictEqual(5);
    addMonitoringDashboardsToStack(stack, monitoring);
    expect(Template.fromStack(stack)).toMatchSnapshot();
});
