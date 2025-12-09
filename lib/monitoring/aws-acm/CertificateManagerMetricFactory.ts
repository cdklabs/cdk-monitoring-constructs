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

export class CertificateManagerMetricFactory extends BaseMetricFactory {
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
    return this.metricFactory.createMetric(
      "DaysToExpiry",
      MetricStatistic.MIN,
      "Days to expiry",
      this.dimensionsMap,
      undefined,
      Namespace,
      undefined,
      this.region,
      this.account,
    );
  }
}
