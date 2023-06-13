import {DimensionsMap} from "aws-cdk-lib/aws-cloudwatch";
import {IActivity} from "aws-cdk-lib/aws-stepfunctions";

import {MetricFactory, MetricStatistic, RateComputationMethod} from "../../common";

const Namespace = "AWS/States";

export interface StepFunctionActivityMetricFactoryProps {
    readonly activity: IActivity;
    /**
     * @default - average
     */
    readonly rateComputationMethod?: RateComputationMethod;
}

export class StepFunctionActivityMetricFactory {
    protected readonly metricFactory: MetricFactory;
    protected readonly rateComputationMethod: RateComputationMethod;
    protected readonly dimensionsMap: DimensionsMap;

    constructor(metricFactory: MetricFactory, props: StepFunctionActivityMetricFactoryProps) {
        this.metricFactory = metricFactory;
        this.rateComputationMethod = RateComputationMethod.AVERAGE;
        this.dimensionsMap = {
            ActivityArn: props.activity.activityArn,
        };
    }

    metricActivityRunTimeP99InMillis() {
        return this.metricFactory.createMetric("ActivityRunTime", MetricStatistic.P99, "P99", this.dimensionsMap, undefined, Namespace);
    }

    metricActivityRunTimeP90InMillis() {
        return this.metricFactory.createMetric("ActivityRunTime", MetricStatistic.P90, "P90", this.dimensionsMap, undefined, Namespace);
    }

    metricActivityRunTimeP50InMillis() {
        return this.metricFactory.createMetric("ActivityRunTime", MetricStatistic.P50, "P50", this.dimensionsMap, undefined, Namespace);
    }

    metricActivityScheduleTimeP99InMillis() {
        return this.metricFactory.createMetric(
            "ActivityScheduleTime",
            MetricStatistic.P99,
            "P99",
            this.dimensionsMap,
            undefined,
            Namespace,
        );
    }

    metricActivityScheduleTimeP90InMillis() {
        return this.metricFactory.createMetric(
            "ActivityScheduleTime",
            MetricStatistic.P90,
            "P90",
            this.dimensionsMap,
            undefined,
            Namespace,
        );
    }

    metricActivityScheduleTimeP50InMillis() {
        return this.metricFactory.createMetric(
            "ActivityScheduleTime",
            MetricStatistic.P50,
            "P50",
            this.dimensionsMap,
            undefined,
            Namespace,
        );
    }

    metricActivityTimeP99InMillis() {
        return this.metricFactory.createMetric("ActivityTime", MetricStatistic.P99, "P99", this.dimensionsMap, undefined, Namespace);
    }

    metricActivityTimeP90InMillis() {
        return this.metricFactory.createMetric("ActivityTime", MetricStatistic.P90, "P90", this.dimensionsMap, undefined, Namespace);
    }

    metricActivityTimeP50InMillis() {
        return this.metricFactory.createMetric("ActivityTime", MetricStatistic.P50, "P50", this.dimensionsMap, undefined, Namespace);
    }

    metricActivitiesFailed() {
        return this.metricFactory.createMetric("ActivitiesFailed", MetricStatistic.SUM, "Failed", this.dimensionsMap, undefined, Namespace);
    }

    metricActivitiesFailedRate() {
        const metric = this.metricActivitiesFailed();
        return this.metricFactory.toRate(metric, this.rateComputationMethod, false, "faults");
    }

    metricActivitiesHeartbeatTimedOut() {
        return this.metricFactory.createMetric(
            "ActivitiesHeartbeatTimedOut",
            MetricStatistic.SUM,
            "HeartbeatTimedOut",
            this.dimensionsMap,
            undefined,
            Namespace,
        );
    }

    metricActivitiesScheduled() {
        return this.metricFactory.createMetric(
            "ActivitiesScheduled",
            MetricStatistic.SUM,
            "Scheduled",
            this.dimensionsMap,
            undefined,
            Namespace,
        );
    }

    metricActivitiesStarted() {
        return this.metricFactory.createMetric(
            "ActivitiesStarted",
            MetricStatistic.SUM,
            "Started",
            this.dimensionsMap,
            undefined,
            Namespace,
        );
    }

    metricActivitiesSucceeded() {
        return this.metricFactory.createMetric(
            "ActivitiesSucceeded",
            MetricStatistic.SUM,
            "Succeeded",
            this.dimensionsMap,
            undefined,
            Namespace,
        );
    }

    metricActivitiesTimedOut() {
        return this.metricFactory.createMetric(
            "ActivitiesTimedOut",
            MetricStatistic.SUM,
            "Timeout",
            this.dimensionsMap,
            undefined,
            Namespace,
        );
    }
}
