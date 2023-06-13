import {ICertificate} from "aws-cdk-lib/aws-certificatemanager";
import {DimensionsMap} from "aws-cdk-lib/aws-cloudwatch";

import {MetricFactory, MetricStatistic, MetricWithAlarmSupport} from "../../common";

const Namespace = "AWS/CertificateManager";

export interface CertificateManagerMetricFactoryProps {
    readonly certificate: ICertificate;
}

export class CertificateManagerMetricFactory {
    protected readonly metricFactory: MetricFactory;
    protected readonly dimensionsMap: DimensionsMap;

    constructor(metricFactory: MetricFactory, props: CertificateManagerMetricFactoryProps) {
        this.metricFactory = metricFactory;
        this.dimensionsMap = {
            CertificateArn: props.certificate.certificateArn,
        };
    }

    metricDaysToExpiry(): MetricWithAlarmSupport {
        return this.metricFactory.createMetric(
            "DaysToExpiry",
            MetricStatistic.MIN,
            "Days to expiry",
            this.dimensionsMap,
            undefined,
            Namespace,
        );
    }
}
