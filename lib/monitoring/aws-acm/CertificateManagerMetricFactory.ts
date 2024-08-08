import { ICertificate } from "aws-cdk-lib/aws-certificatemanager";
import { DimensionsMap } from "aws-cdk-lib/aws-cloudwatch";

import {
  BaseMetricFactory,
  BaseMetricFactoryProps,
  MetricFactory,
  MetricStatistic,
  MetricWithAlarmSupport,
} from "../../common";

const Namespace = "AWS/CertificateManager";

export interface CertificateManagerMetricFactoryProps
  extends BaseMetricFactoryProps {
  readonly certificate: ICertificate;
}

export class CertificateManagerMetricFactory extends BaseMetricFactory<CertificateManagerMetricFactoryProps> {
  protected readonly dimensionsMap: DimensionsMap;

  constructor(
    metricFactory: MetricFactory,
    props: CertificateManagerMetricFactoryProps,
  ) {
    super(metricFactory, props);

    this.dimensionsMap = {
      CertificateArn: props.certificate.certificateArn,
    };
  }

  metricDaysToExpiry(): MetricWithAlarmSupport {
    return this.metricFactory.metric({
      metricName: "DaysToExpiry",
      statistic: MetricStatistic.MIN,
      label: "Days to expiry",
      dimensionsMap: this.dimensionsMap,
      namespace: Namespace,
      region: this.region,
      account: this.account,
    });
  }
}
