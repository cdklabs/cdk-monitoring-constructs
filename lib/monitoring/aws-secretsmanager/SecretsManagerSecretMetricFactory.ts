import { FeatureFlags } from "monocdk";
import { DimensionHash } from "monocdk/aws-cloudwatch";
import { ISecret } from "monocdk/aws-secretsmanager";
import * as cxapi from "monocdk/cx-api";

import { MetricFactory, MetricStatistic } from "../../common";

export interface SecretsManagerSecretMetricFactoryProps {
  readonly secret: ISecret;
}

export class SecretsManagerSecretMetricFactory {
  static readonly Namespace = "SecretsManager";
  static readonly MetricNameDaysSinceLastChange = "DaysSinceLastChange";
  static readonly MetricNameDaysSinceLastRotation = "DaysSinceLastRotation";
  protected readonly metricFactory: MetricFactory;
  protected readonly dimensions: DimensionHash;
  protected readonly secret: ISecret;

  constructor(
    metricFactory: MetricFactory,
    props: SecretsManagerSecretMetricFactoryProps
  ) {
    this.metricFactory = metricFactory;
    this.secret = props.secret;
    this.dimensions = {
      SecretName: props.secret.secretName,
    };

    this.ensureParseOwnedSecretName();
  }

  private ensureParseOwnedSecretName() {
    if (
      !FeatureFlags.of(this.secret.stack).isEnabled(
        cxapi.SECRETS_MANAGER_PARSE_OWNED_SECRET_NAME
      )
    ) {
      throw new Error(
        `feature flag "${cxapi.SECRETS_MANAGER_PARSE_OWNED_SECRET_NAME}" is required`
      );
    }
  }

  metricDaysSinceLastChange() {
    return this.metricFactory.createMetric(
      SecretsManagerSecretMetricFactory.MetricNameDaysSinceLastChange,
      MetricStatistic.MAX,
      "Days",
      this.dimensions,
      undefined,
      SecretsManagerSecretMetricFactory.Namespace
    );
  }

  metricDaysSinceLastRotation() {
    return this.metricFactory.createMetric(
      SecretsManagerSecretMetricFactory.MetricNameDaysSinceLastRotation,
      MetricStatistic.MAX,
      "Days",
      this.dimensions,
      undefined,
      SecretsManagerSecretMetricFactory.Namespace
    );
  }
}
