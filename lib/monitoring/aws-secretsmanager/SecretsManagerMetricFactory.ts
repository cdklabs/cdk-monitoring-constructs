import { Duration } from "aws-cdk-lib";
import {
  BaseMetricFactory,
  BaseMetricFactoryProps,
  MetricFactory,
  MetricStatistic,
} from "../../common";

const NAMESPACE = "AWS/SecretsManager";

export type SecretsManagerMetricFactoryProps = BaseMetricFactoryProps;

export class SecretsManagerMetricFactory extends BaseMetricFactory<SecretsManagerMetricFactoryProps> {
  constructor(
    metricFactory: MetricFactory,
    props: SecretsManagerMetricFactoryProps,
  ) {
    super(metricFactory, props);
  }

  metricSecretCount() {
    return this.metricFactory.metric({
      metricName: "ResourceCount",
      statistic: MetricStatistic.AVERAGE,
      label: "Count",
      dimensionsMap: {
        Class: "None",
        Resource: "SecretCount",
        Service: "Secrets Manager",
        Type: "Resource",
      },
      namespace: NAMESPACE,
      period: Duration.hours(1),
      region: this.region,
      account: this.account,
    });
  }
}
