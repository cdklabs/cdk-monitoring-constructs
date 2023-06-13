import {Stack} from "aws-cdk-lib";
import {Template} from "aws-cdk-lib/assertions";
import {Distribution} from "aws-cdk-lib/aws-cloudfront";
import {S3Origin} from "aws-cdk-lib/aws-cloudfront-origins";
import {Bucket} from "aws-cdk-lib/aws-s3";

import {AlarmWithAnnotation, CloudFrontDistributionMonitoring} from "../../../lib";
import {addMonitoringDashboardsToStack} from "../../utils/SnapshotUtil";
import {TestMonitoringScope} from "../TestMonitoringScope";

[undefined, true, false].forEach((additionalMetricsEnabled) => {
    test(`snapshot test: no alarms with additionalMetricsEnabled=${additionalMetricsEnabled}`, () => {
        const stack = new Stack();
        const bucket = new Bucket(stack, "Bucket");
        const distribution = new Distribution(stack, "Distribution", {
            defaultBehavior: {
                origin: new S3Origin(bucket),
            },
        });

        const scope = new TestMonitoringScope(stack, "Scope");

        const monitoring = new CloudFrontDistributionMonitoring(scope, {
            distribution,
            additionalMetricsEnabled,
        });

        addMonitoringDashboardsToStack(stack, monitoring);
        expect(Template.fromStack(stack)).toMatchSnapshot();
    });

    test(`snapshot test: all alarms with additionalMetricsEnabled=${additionalMetricsEnabled}`, () => {
        const stack = new Stack();
        const bucket = new Bucket(stack, "Bucket");
        const distribution = new Distribution(stack, "Distribution", {
            defaultBehavior: {
                origin: new S3Origin(bucket),
            },
        });

        const scope = new TestMonitoringScope(stack, "Scope");

        let numAlarmsCreated = 0;

        const monitoring = new CloudFrontDistributionMonitoring(scope, {
            distribution,
            additionalMetricsEnabled,
            addLowTpsAlarm: {
                Warning: {
                    minTps: 10,
                },
            },
            addHighTpsAlarm: {
                Warning: {
                    maxTps: 20,
                },
            },
            addError4xxRate: {
                Warning: {
                    maxErrorRate: 0.5,
                },
            },
            addFault5xxRate: {
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

        addMonitoringDashboardsToStack(stack, monitoring);
        expect(numAlarmsCreated).toStrictEqual(4);
        expect(Template.fromStack(stack)).toMatchSnapshot();
    });
});
