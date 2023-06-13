import {DimensionsMap} from "aws-cdk-lib/aws-cloudwatch";
import {IProject} from "aws-cdk-lib/aws-codebuild";

import {MetricFactory, MetricStatistic} from "../../common";

export interface CodeBuildProjectMetricFactoryProps {
    readonly project: IProject;
}

export class CodeBuildProjectMetricFactory {
    protected readonly metricFactory: MetricFactory;
    protected readonly dimensionsMap: DimensionsMap;
    protected readonly project: IProject;

    constructor(metricFactory: MetricFactory, props: CodeBuildProjectMetricFactoryProps) {
        this.metricFactory = metricFactory;
        this.project = props.project;
        this.dimensionsMap = {
            ProjectName: props.project.projectName,
        };
    }

    metricBuildCount() {
        return this.metricFactory.adaptMetric(this.project.metricBuilds());
    }

    metricSucceededBuildCount() {
        return this.metricFactory.adaptMetric(this.project.metricSucceededBuilds());
    }

    metricFailedBuildCount() {
        return this.metricFactory.adaptMetric(this.project.metricFailedBuilds());
    }

    metricFailedBuildRate() {
        return this.metricFailedBuildCount().with({
            statistic: MetricStatistic.AVERAGE,
        });
    }

    metricDurationP99InSeconds() {
        return this.metricFactory.adaptMetric(
            this.project.metricDuration({
                label: "P99",
                statistic: MetricStatistic.P99,
            }),
        );
    }

    metricDurationP90InSeconds() {
        return this.metricFactory.adaptMetric(
            this.project.metricDuration({
                label: "P90",
                statistic: MetricStatistic.P90,
            }),
        );
    }

    metricDurationP50InSeconds() {
        return this.metricFactory.adaptMetric(
            this.project.metricDuration({
                label: "P50",
                statistic: MetricStatistic.P50,
            }),
        );
    }
}
