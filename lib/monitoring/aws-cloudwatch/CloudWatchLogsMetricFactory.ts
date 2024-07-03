import { DimensionsMap } from "aws-cdk-lib/aws-cloudwatch";

import {
  BaseMetricFactory,
  BaseMetricFactoryProps,
  MetricFactory,
  MetricStatistic,
} from "../../common";

const CloudWatchLogsNamespace = "AWS/Logs";

export interface CloudWatchLogsMetricFactoryProps
  extends BaseMetricFactoryProps {
  /**
   * Name of the log group to monitor.
   */
  readonly logGroupName: string;
}

export class CloudWatchLogsMetricFactory extends BaseMetricFactory<CloudWatchLogsMetricFactoryProps> {
  private readonly dimensionsMap: DimensionsMap;

  constructor(
    metricFactory: MetricFactory,
    props: CloudWatchLogsMetricFactoryProps,
  ) {
    super(metricFactory, props);

    this.dimensionsMap = {
      LogGroupName: props.logGroupName,
    };
  }

  metricIncomingLogEvents() {
    return this.metricFactory.createMetric(
      "IncomingLogEvents",
      MetricStatistic.N,
      "Logs",
      this.dimensionsMap,
      undefined,
      CloudWatchLogsNamespace,
      undefined,
      this.region,
      this.account,
    );
  }
}
