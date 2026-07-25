import { Duration } from "aws-cdk-lib";
import {
  BaseMetricFactory,
  BaseMetricFactoryProps,
  MetricFactory,
  MetricStatistic,
} from "../../common";

const CLASS = "None";
const DEFAULT_METRIC_PERIOD = Duration.hours(1);
const METRICNAMESECRETCOUNT = "ResourceCount";
const NAMESPACE = "AWS/SecretsManager";
const RESOURCE = "SecretCount";
const SERVICE = "Secrets Manager";
const TYPE = "Resource";

export type SecretsManagerMetricFactoryProps = BaseMetricFactoryProps;

export class SecretsManagerMetricFactory extends BaseMetricFactory {
  constructor(
    metricFactory: MetricFactory,
    props: SecretsManagerMetricFactoryProps,
  ) {
    super(metricFactory, props);
  }

  metricSecretCount() {
    const dimensionsMap = {
      Class: CLASS,
      Resource: RESOURCE,
      Service: SERVICE,
      Type: TYPE,
    };

    return this.metricFactory.createMetric(
      METRICNAMESECRETCOUNT,
      MetricStatistic.AVERAGE,
      "Count",
      dimensionsMap,
      undefined,
      NAMESPACE,
      DEFAULT_METRIC_PERIOD,
      this.region,
      this.account,
    );
  }
}
