import {ComparisonOperator, TreatMissingData} from "aws-cdk-lib/aws-cloudwatch";

import {AlarmFactory, CustomAlarmThreshold} from "../../alarm";
import {MetricWithAlarmSupport} from "../../metric";

export interface CustomThreshold extends CustomAlarmThreshold {
    readonly threshold: number;
    readonly comparisonOperator: ComparisonOperator;
    readonly dedupeString?: string;
    readonly additionalDescription?: string;
}

export class CustomAlarmFactory {
    protected readonly alarmFactory: AlarmFactory;

    constructor(alarmFactory: AlarmFactory) {
        this.alarmFactory = alarmFactory;
    }

    addCustomAlarm(metric: MetricWithAlarmSupport, alarmNameSuffix: string, disambiguator: string, props: CustomThreshold) {
        return this.alarmFactory.addAlarm(metric, {
            ...props,
            disambiguator,
            treatMissingData: props.treatMissingDataOverride ?? TreatMissingData.MISSING,
            threshold: props.threshold,
            comparisonOperator: props.comparisonOperatorOverride ?? props.comparisonOperator,
            alarmDedupeStringSuffix: props.dedupeString,
            alarmNameSuffix,
            alarmDescription: props.additionalDescription ?? `Threshold of ${props.threshold} has been breached.`,
        });
    }
}
