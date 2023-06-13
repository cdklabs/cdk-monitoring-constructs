import {DimensionsMap} from "aws-cdk-lib/aws-cloudwatch";
import {IFunction} from "aws-cdk-lib/aws-lambda";

import {MetricFactory, MetricStatistic, RateComputationMethod} from "../../common";

const Namespace = "AWS/States";

export interface StepFunctionLambdaIntegrationMetricFactoryProps {
    readonly lambdaFunction: IFunction;
    /**
     * @default - average
     */
    readonly rateComputationMethod?: RateComputationMethod;
}

export class StepFunctionLambdaIntegrationMetricFactory {
    protected readonly metricFactory: MetricFactory;
    protected readonly rateComputationMethod: RateComputationMethod;
    protected readonly dimensionsMap: DimensionsMap;

    constructor(metricFactory: MetricFactory, props: StepFunctionLambdaIntegrationMetricFactoryProps) {
        this.metricFactory = metricFactory;
        this.rateComputationMethod = RateComputationMethod.AVERAGE;
        this.dimensionsMap = {
            LambdaFunctionArn: props.lambdaFunction.functionArn,
        };
    }

    metricFunctionRunTimeP99InMillis() {
        return this.metricFactory.createMetric(
            "LambdaFunctionRunTime",
            MetricStatistic.P99,
            "P99",
            this.dimensionsMap,
            undefined,
            Namespace,
        );
    }

    metricFunctionRunTimeP90InMillis() {
        return this.metricFactory.createMetric(
            "LambdaFunctionRunTime",
            MetricStatistic.P90,
            "P90",
            this.dimensionsMap,
            undefined,
            Namespace,
        );
    }

    metricFunctionRunTimeP50InMillis() {
        return this.metricFactory.createMetric(
            "LambdaFunctionRunTime",
            MetricStatistic.P50,
            "P50",
            this.dimensionsMap,
            undefined,
            Namespace,
        );
    }

    metricFunctionScheduleTimeP99InMillis() {
        return this.metricFactory.createMetric(
            "LambdaFunctionScheduleTime",
            MetricStatistic.P99,
            "P99",
            this.dimensionsMap,
            undefined,
            Namespace,
        );
    }

    metricFunctionScheduleTimeP90InMillis() {
        return this.metricFactory.createMetric(
            "LambdaFunctionScheduleTime",
            MetricStatistic.P90,
            "P90",
            this.dimensionsMap,
            undefined,
            Namespace,
        );
    }

    metricFunctionScheduleTimeP50InMillis() {
        return this.metricFactory.createMetric(
            "LambdaFunctionScheduleTime",
            MetricStatistic.P50,
            "P50",
            this.dimensionsMap,
            undefined,
            Namespace,
        );
    }

    metricFunctionTimeP99InMillis() {
        return this.metricFactory.createMetric("LambdaFunctionTime", MetricStatistic.P99, "P99", this.dimensionsMap, undefined, Namespace);
    }

    metricFunctionTimeP90InMillis() {
        return this.metricFactory.createMetric("LambdaFunctionTime", MetricStatistic.P90, "P90", this.dimensionsMap, undefined, Namespace);
    }

    metricFunctionTimeP50InMillis() {
        return this.metricFactory.createMetric("LambdaFunctionTime", MetricStatistic.P50, "P50", this.dimensionsMap, undefined, Namespace);
    }

    metricFunctionsFailed() {
        return this.metricFactory.createMetric(
            "LambdaFunctionsFailed",
            MetricStatistic.SUM,
            "Failed",
            this.dimensionsMap,
            undefined,
            Namespace,
        );
    }

    metricFunctionsFailedRate() {
        const metric = this.metricFunctionsFailed();
        return this.metricFactory.toRate(metric, this.rateComputationMethod, false, "faults");
    }

    metricFunctionsScheduled() {
        return this.metricFactory.createMetric(
            "LambdaFunctionsScheduled",
            MetricStatistic.SUM,
            "Scheduled",
            this.dimensionsMap,
            undefined,
            Namespace,
        );
    }

    metricFunctionsStarted() {
        return this.metricFactory.createMetric(
            "LambdaFunctionsStarted",
            MetricStatistic.SUM,
            "Started",
            this.dimensionsMap,
            undefined,
            Namespace,
        );
    }

    metricFunctionsSucceeded() {
        return this.metricFactory.createMetric(
            "LambdaFunctionsSucceeded",
            MetricStatistic.SUM,
            "Succeeded",
            this.dimensionsMap,
            undefined,
            Namespace,
        );
    }

    metricFunctionsTimedOut() {
        return this.metricFactory.createMetric(
            "LambdaFunctionsTimedOut",
            MetricStatistic.SUM,
            "Timeout",
            this.dimensionsMap,
            undefined,
            Namespace,
        );
    }
}
