import { ICertificate } from "monocdk/aws-certificatemanager";
import { DimensionHash } from "monocdk/aws-cloudwatch";

import {
  MetricFactory,
  MetricStatistic,
  MetricWithAlarmSupport,
} from "../../common";

const Namespace = "AWS/CertificateManager";

export interface CertificateManagerMetricFactoryProps {
  readonly certificate: ICertificate;
}

export class CertificateManagerMetricFactory {
  protected readonly metricFactory: MetricFactory;
  protected readonly dimensions: DimensionHash;

  constructor(
    metricFactory: MetricFactory,
    props: CertificateManagerMetricFactoryProps
  ) {
    this.metricFactory = metricFactory;
    this.dimensions = {
      CertificateArn: props.certificate.certificateArn,
    };
  }

  metricDaysToExpiry(): MetricWithAlarmSupport {
    return this.metricFactory.createMetric(
      "DaysToExpiry",
      MetricStatistic.MIN,
      "Days to expiry",
      this.dimensions,
      undefined,
      Namespace
    );
  }
}
