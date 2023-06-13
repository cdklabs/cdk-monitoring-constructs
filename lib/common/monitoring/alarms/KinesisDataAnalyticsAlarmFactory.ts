import {ComparisonOperator, TreatMissingData} from "aws-cdk-lib/aws-cloudwatch";

import {AlarmFactory, CustomAlarmThreshold} from "../../alarm";
import {MetricWithAlarmSupport} from "../../metric";

export interface MaxDowntimeThreshold extends CustomAlarmThreshold {
    readonly maxDowntimeInMillis: number;
}

export interface FullRestartCountThreshold extends CustomAlarmThreshold {
    readonly maxFullRestartCount: number;
}

export class KinesisDataAnalyticsAlarmFactory {
    protected readonly alarmFactory: AlarmFactory;

    constructor(alarmFactory: AlarmFactory) {
        this.alarmFactory = alarmFactory;
    }

    addDowntimeAlarm(metric: MetricWithAlarmSupport, props: MaxDowntimeThreshold, disambiguator?: string) {
        return this.alarmFactory.addAlarm(metric, {
            treatMissingData: props.treatMissingDataOverride ?? TreatMissingData.BREACHING,
            comparisonOperator: props.comparisonOperatorOverride ?? ComparisonOperator.GREATER_THAN_THRESHOLD,
            ...props,
            disambiguator,
            threshold: props.maxDowntimeInMillis,
            alarmNameSuffix: "Downtime",
            alarmDescription: "Application has too much downtime",
            // we will dedupe any kind of message count issue to the same ticket
            alarmDedupeStringSuffix: "KDADowntimeAlarm",
        });
    }

    addFullRestartAlarm(metric: MetricWithAlarmSupport, props: FullRestartCountThreshold, disambiguator?: string) {
        return this.alarmFactory.addAlarm(metric, {
            treatMissingData: props.treatMissingDataOverride ?? TreatMissingData.BREACHING,
            comparisonOperator: props.comparisonOperatorOverride ?? ComparisonOperator.GREATER_THAN_THRESHOLD,
            ...props,
            disambiguator,
            threshold: props.maxFullRestartCount,
            alarmNameSuffix: "FullRestart",
            alarmDescription: "Last submitted job is restarting more than usual",
            alarmDedupeStringSuffix: "KDAFullRestartAlarm",
        });
    }
}
