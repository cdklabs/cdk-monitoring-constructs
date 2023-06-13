import {DimensionsMap} from "aws-cdk-lib/aws-cloudwatch";

import {MetricFactory, MetricStatistic} from "../../common";

const CloudWatchLogsNamespace = "AWS/Logs";

export interface CloudWatchLogsMetricFactoryProps {
    /**
     * Name of the log group to monitor.
     */
    readonly logGroupName: string;
}

export class CloudWatchLogsMetricFactory {
    private readonly metricFactory: MetricFactory;
    private readonly dimensionsMap: DimensionsMap;

    constructor(metricFactory: MetricFactory, props: CloudWatchLogsMetricFactoryProps) {
        this.metricFactory = metricFactory;
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
        );
    }
}
