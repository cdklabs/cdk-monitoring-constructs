import { DimensionsMap } from "aws-cdk-lib/aws-cloudwatch";
import { ISecret } from "aws-cdk-lib/aws-secretsmanager";

import {
  BaseMetricFactory,
  BaseMetricFactoryProps,
  MetricFactory,
  MetricStatistic,
} from "../../common";

export interface SecretsManagerSecretMetricFactoryProps
  extends BaseMetricFactoryProps {
  readonly secret: ISecret;
}

export class SecretsManagerSecretMetricFactory extends BaseMetricFactory<SecretsManagerSecretMetricFactoryProps> {
  static readonly Namespace = "SecretsManager";
  static readonly MetricNameDaysSinceLastChange = "DaysSinceLastChange";
  static readonly MetricNameDaysSinceLastRotation = "DaysSinceLastRotation";
  protected readonly dimensionsMap: DimensionsMap;
  protected readonly secret: ISecret;

  constructor(
    metricFactory: MetricFactory,
    props: SecretsManagerSecretMetricFactoryProps,
  ) {
    super(metricFactory, props);

    this.secret = props.secret;
    this.dimensionsMap = {
      SecretName: props.secret.secretName,
    };
  }

  metricDaysSinceLastChange() {
    return this.metricFactory.createMetric(
      SecretsManagerSecretMetricFactory.MetricNameDaysSinceLastChange,
      MetricStatistic.MAX,
      "Days",
      this.dimensionsMap,
      undefined,
      SecretsManagerSecretMetricFactory.Namespace,
    );
  }

  metricDaysSinceLastRotation() {
    return this.metricFactory.createMetric(
      SecretsManagerSecretMetricFactory.MetricNameDaysSinceLastRotation,
      MetricStatistic.MAX,
      "Days",
      this.dimensionsMap,
      undefined,
      SecretsManagerSecretMetricFactory.Namespace,
    );
  }
}
