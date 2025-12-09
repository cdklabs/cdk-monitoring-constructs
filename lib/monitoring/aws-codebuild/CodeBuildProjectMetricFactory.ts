import { DimensionsMap } from "aws-cdk-lib/aws-cloudwatch";
import { IProject } from "aws-cdk-lib/aws-codebuild";

import {
  BaseMetricFactory,
  BaseMetricFactoryProps,
  MetricFactory,
  MetricStatistic,
} from "../../common";

export interface CodeBuildProjectMetricFactoryProps
  extends BaseMetricFactoryProps {
  readonly project: IProject;
}

export class CodeBuildProjectMetricFactory extends BaseMetricFactory {
  protected readonly dimensionsMap: DimensionsMap;
  protected readonly project: IProject;

  constructor(
    metricFactory: MetricFactory,
    props: CodeBuildProjectMetricFactoryProps,
  ) {
    super(metricFactory, props);

    this.project = props.project;
    this.dimensionsMap = {
      ProjectName: props.project.projectName,
    };
  }

  metricBuildCount() {
    return this.metricFactory.adaptMetric(
      this.project.metricBuilds({
        region: this.region,
        account: this.account,
      }),
    );
  }

  metricSucceededBuildCount() {
    return this.metricFactory.adaptMetric(
      this.project.metricSucceededBuilds({
        region: this.region,
        account: this.account,
      }),
    );
  }

  metricFailedBuildCount() {
    return this.metricFactory.adaptMetric(
      this.project.metricFailedBuilds({
        region: this.region,
        account: this.account,
      }),
    );
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
        region: this.region,
        account: this.account,
      }),
    );
  }

  metricDurationP90InSeconds() {
    return this.metricFactory.adaptMetric(
      this.project.metricDuration({
        label: "P90",
        statistic: MetricStatistic.P90,
        region: this.region,
        account: this.account,
      }),
    );
  }

  metricDurationP50InSeconds() {
    return this.metricFactory.adaptMetric(
      this.project.metricDuration({
        label: "P50",
        statistic: MetricStatistic.P50,
        region: this.region,
        account: this.account,
      }),
    );
  }
}
