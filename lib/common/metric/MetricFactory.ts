import { Duration, Stack } from "aws-cdk-lib";
import {
  DimensionsMap,
  IMetric,
  MathExpression,
  Metric,
} from "aws-cdk-lib/aws-cloudwatch";
import { Construct } from "constructs";

import { AnomalyDetectionMathExpression } from "./AnomalyDetectionMathExpression";
import { BaseMetricFactoryProps } from "./BaseMetricFactory";
import { MetricStatistic } from "./MetricStatistic";
import { MetricWithAlarmSupport } from "./MetricWithAlarmSupport";
import { RateComputationMethod } from "./RateComputationMethod";

/**
 * The most common default metric period used at Amazon is currently 5 minutes.
 */
export const DefaultMetricPeriod = Duration.minutes(5);

/**
 * These are the globals used for each metric, unless there is some kind of override.
 */
export interface MetricFactoryDefaults extends BaseMetricFactoryProps {
  /**
   * Each metric exists in a namespace. AWS Services have their own namespace, but here you can specify your custom one.
   */
  readonly namespace?: string;

  /**
   * Metric period. Default value is used if not defined.
   * @default - DefaultMetricPeriod
   */
  readonly period?: Duration;
}

export interface MetricFactoryProps {
  /**
   * Allows you to specify the global defaults, which can be overridden in the individual metrics or alarms.
   */
  readonly globalDefaults?: MetricFactoryDefaults;
}

export class MetricFactory {
  protected readonly globalDefaults: MetricFactoryDefaults;
  protected readonly scope: Construct | undefined;

  constructor(scope: Construct, props?: MetricFactoryProps) {
    this.globalDefaults = props?.globalDefaults ?? {};
    this.scope = scope;
  }

  /**
   * Factory method that creates a metric. The metric properties will already be updated to comply with the global defaults.
   *
   * @param metricName metric name
   * @param statistic aggregation statistic to use
   * @param label metric label; if undefined, metric name is used by CloudWatch
   * @param dimensionsMap additional dimensions to be added
   * @param color metric color; if undefined, uses a CloudWatch provided color (preferred)
   * @param namespace specify a custom namespace; if undefined, uses the global default
   * @param period specify a custom period; if undefined, uses the global default
   * @param region specify a custom region; if undefined, uses the global default
   * @param account specify a custom account; if undefined, uses the global default
   */
  createMetric(
    metricName: string,
    statistic: MetricStatistic,
    label?: string,
    dimensionsMap?: DimensionsMap,
    color?: string,
    namespace?: string,
    period?: Duration,
    region?: string,
    account?: string,
  ): MetricWithAlarmSupport {
    return new Metric({
      statistic,
      metricName,
      label,
      color,
      dimensionsMap: dimensionsMap
        ? this.removeUndefinedEntries(dimensionsMap)
        : undefined,
      namespace: this.getNamespaceWithFallback(namespace),
      period: period ?? this.globalDefaults.period ?? DefaultMetricPeriod,
      region: this.resolveRegion(region ?? this.globalDefaults.region),
      account: this.resolveAccount(account ?? this.globalDefaults.account),
    });
  }

  /**
   * Factory method that creates a metric math expression. The metric properties will already be updated to comply with the global defaults.
   *
   * @param expression CloudWatch metric math expression (https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/using-metric-math.html)
   * @param usingMetrics map of metrics, where keys are expression IDs (used in the expression) and values are metrics
   * @param label metric label (required, as there is no reasonable default)
   * @param color metric color; if undefined, uses a CloudWatch provided color (preferred)
   * @param period specify a custom period; if undefined, uses the global default
   * @param region -- Deprecated: Use createSearchMetric if doing cross region search
   * @param account -- Deprecated: Use createSearchMetric if doing cross region search
   */
  createMetricMath(
    expression: string,
    usingMetrics: Record<string, IMetric>,
    label: string,
    color?: string,
    period?: Duration,
    region?: string,
    account?: string,
  ): MetricWithAlarmSupport {
    if (region || account) {
      console.warn(
        "'region' and 'account' inputs are ignored, please use 'createSearchMetric'",
      );
    }
    return new MathExpression({
      label,
      color,
      expression,
      usingMetrics,
      period: period ?? this.globalDefaults.period ?? DefaultMetricPeriod,
    });
  }

  /**
   * Factory method that creates a metric search query. The metric properties will already be updated to comply with the global defaults.
   * If you want to match "any value" of a specific dimension, please use `undefined` value representation in your consumer language.
   * (For example, `undefined as any as string` in TypeScript, due to JSII typing quirks.)
   *
   * @param query metric search query (the same as the search query prompt in CloudWatch AWS Console), it might also be empty
   * @param dimensionsMap dimensions, further narrowing the search results; use `undefined` if you want to represent "any value" (in TS: `undefined as any as string`)
   * @param statistic aggregation statistic to use
   * @param namespace specify a custom namespace; if undefined, uses the global default
   * @param label specify custom label for search metrics; default is " " as it cannot be empty string
   * @param period specify a custom period; if undefined, uses the global default
   * @param region specify a custom region; if undefined, uses the global default
   * @param account specify a custom account; if undefined, uses the global default
   */
  createMetricSearch(
    query: string,
    dimensionsMap: DimensionsMap,
    statistic: MetricStatistic,
    namespace?: string,
    label?: string,
    period?: Duration,
    region?: string,
    account?: string,
  ): MathExpression {
    const finalPeriod =
      period ?? this.globalDefaults.period ?? DefaultMetricPeriod;
    const searchNamespace = this.getNamespaceWithFallback(namespace);
    const namespacesWithQuotations = searchNamespace
      .split(",")
      .map((namespace) => `"${namespace.trim()}"`);
    const keysWithQuotations = Object.keys(dimensionsMap).map(
      (key) => `"${key}"`,
    );
    const namespacePlusDimensionKeys = [
      ...namespacesWithQuotations,
      ...keysWithQuotations,
    ].join(",");
    const metricSchema = `{${namespacePlusDimensionKeys}}`;

    const dimensionKeysAndValues = Object.entries(
      this.removeUndefinedEntries(dimensionsMap),
    )
      .map(([key, value]) => `"${key}"="${value}"`)
      .join(" ");

    const expression = `SEARCH('${metricSchema} ${dimensionKeysAndValues} ${query}', '${statistic}', ${finalPeriod.toSeconds()})`;

    return new MathExpression({
      expression,
      // see https://github.com/aws/aws-cdk/issues/7237
      usingMetrics: {},
      // cannot be an empty string and undefined is no good either
      label: label ?? " ",
      period: finalPeriod,
      searchRegion: this.resolveRegion(region ?? this.globalDefaults.region),
      searchAccount: this.resolveAccount(
        account ?? this.globalDefaults.account,
      ),
    });
  }

  /**
   * Factory method that creates anomaly detection on a metric.
   * Anomaly occurs whenever a metric value falls outside of a precomputed range of predicted values.
   * The detection does not need any setup. The model will start learning automatically and should be ready in a few minutes.
   * Usually, the anomaly detection is paired with an alarm.
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Anomaly_Detection.html
   *
   * @param metric metric to detect anomaly detection of
   * @param stdev standard deviation, basically the tolerance / band thickness
   * @param label metric label (required, as there is no reasonable default)
   * @param color metric color; if undefined, uses a CloudWatch provided color (preferred)
   * @param expressionId expression ID of the metric; uses `m1` if undefined
   * @param period specify a custom period; if undefined, uses the global default
   * @param region specify a custom region; if undefined, uses the global default
   * @param account specify a custom account; if undefined, uses the global default
   */
  createMetricAnomalyDetection(
    metric: IMetric,
    stdev: number,
    label: string,
    color?: string,
    expressionId?: string,
    period?: Duration,
    region?: string,
    account?: string,
  ): MetricWithAlarmSupport {
    const finalExpressionId = expressionId ?? "m1";
    const usingMetrics: Record<string, IMetric> = {};
    usingMetrics[finalExpressionId] = metric;
    return new AnomalyDetectionMathExpression({
      label,
      color,
      usingMetrics,
      expression: `ANOMALY_DETECTION_BAND(${finalExpressionId},${stdev})`,
      period: period ?? this.globalDefaults.period ?? DefaultMetricPeriod,
      searchRegion: this.resolveRegion(region ?? this.globalDefaults.region),
      searchAccount: this.resolveAccount(
        account ?? this.globalDefaults.account,
      ),
    });
  }

  /**
   * Adapts properties of a foreign metric (metric created outside of this metric factory) to comply with the global defaults.
   * Might modify namespace and metric period.
   *
   * @param metric metric to be adapted
   */
  adaptMetric(metric: MetricWithAlarmSupport): MetricWithAlarmSupport {
    if (this.globalDefaults.region) {
      metric = metric.with({ region: this.globalDefaults.region });
    }

    if (this.globalDefaults.account) {
      metric = metric.with({ account: this.globalDefaults.account });
    }

    return metric.with({
      period: this.globalDefaults.period ?? DefaultMetricPeriod,
    });
  }

  /**
   * Adapts properties of a foreign metric (metric created outside of this metric factory) to comply with the global defaults.
   * Might modify namespace. Preserves metric period.
   *
   * @param metric metric to be adapted
   */
  adaptMetricPreservingPeriod(
    metric: MetricWithAlarmSupport,
  ): MetricWithAlarmSupport {
    return metric;
  }

  /**
   * Creates a metric math expression that multiplies the given metric by given coefficient.
   * Does nothing if the multiplier is one. Preserves the metric period.
   *
   * @param metric metric to multiply
   * @param multiplier multiplier (must be > 1)
   * @param label expression label
   * @param expressionId expression ID of the metric; uses `m1` if undefined
   */
  multiplyMetric(
    metric: MetricWithAlarmSupport,
    multiplier: number,
    label: string,
    expressionId?: string,
  ): MetricWithAlarmSupport {
    if (multiplier == 1) {
      return metric;
    } else if (multiplier < 1) {
      throw new Error("Multiplier must be greater than one.");
    } else {
      const finalExpressionId = expressionId ?? "m1";
      const usingMetrics: Record<string, IMetric> = {};
      usingMetrics[finalExpressionId] = metric;
      return this.createMetricMath(
        `${finalExpressionId} * ${multiplier}`,
        usingMetrics,
        label,
        metric.color,
        metric.period,
      );
    }
  }

  /**
   * Creates a metric math expression that divides the given metric by given coefficient.
   * Does nothing if the divisor is one. Preserves the metric period.
   *
   * @param metric metric to multiply
   * @param divisor divisor (must be > 1)
   * @param label expression label
   * @param expressionId expression ID of the metric; uses `m1` if undefined
   */
  divideMetric(
    metric: MetricWithAlarmSupport,
    divisor: number,
    label: string,
    expressionId?: string,
  ): MetricWithAlarmSupport {
    if (divisor == 1) {
      return metric;
    } else if (divisor < 1) {
      throw new Error("Divisor must be greater than one.");
    } else {
      const finalExpressionId = expressionId ?? "m1";
      const usingMetrics: Record<string, IMetric> = {};
      usingMetrics[finalExpressionId] = metric;
      return this.createMetricMath(
        `${finalExpressionId} / ${divisor}`,
        usingMetrics,
        label,
        metric.color,
        metric.period,
      );
    }
  }

  /**
   * Creates a metric math expression that computes a rate from a regular metric.
   * For example, it allows you to compute rate per second (TPS), per minute, or just an average of your transactions.
   *
   * @param metric metric to calculate the rate from
   * @param method rate computation method
   * @param addStatsToLabel add detailed statistics (min, max, average) to the label
   * @param expressionId expression ID of the metric; uses `m1` if undefined
   * @param fillWithZeroes if TRUE, the final metric will be zero-filled (0 on no data); false if undefined
   */
  toRate(
    metric: MetricWithAlarmSupport,
    method: RateComputationMethod,
    addStatsToLabel?: boolean,
    expressionId?: string,
    fillWithZeroes?: boolean,
  ): MetricWithAlarmSupport {
    const finalExpressionId = expressionId ?? "m1";
    const labelPrefix = metric.label ?? "Rate";

    const statsInLabel: string[] = [];
    if (addStatsToLabel ?? false) {
      statsInLabel.push("min: ${MIN}");
      statsInLabel.push("max: ${MAX}");
      if (method !== RateComputationMethod.AVERAGE) {
        // only add average if do not have it already
        statsInLabel.push("avg: ${AVG}");
      }
    }

    const finalExpressionIdZeroed =
      fillWithZeroes ?? false
        ? `FILL(${finalExpressionId},0)`
        : finalExpressionId;
    const labelAppendix =
      statsInLabel.length > 0 ? ` (${statsInLabel.join(", ")})` : "";

    switch (method) {
      case RateComputationMethod.AVERAGE:
        const avgLabel = `${labelPrefix} (avg)${labelAppendix}`;
        const avgMetric = metric.with({
          label: avgLabel,
          statistic: MetricStatistic.AVERAGE,
        });
        if (fillWithZeroes ?? false) {
          return this.createMetricMath(
            finalExpressionIdZeroed,
            { [finalExpressionId]: avgMetric },
            avgLabel,
            avgMetric.color,
            avgMetric.period,
          );
        }
        return avgMetric;
      case RateComputationMethod.PER_SECOND:
        let perSecondLabel = `${labelPrefix}/s${labelAppendix}`;
        if (
          labelPrefix === "Requests" ||
          labelPrefix === "Invocations" ||
          labelPrefix === "Transactions"
        ) {
          // currently, kept as "TPS" to reduce number of snapshot changes
          perSecondLabel = `TPS${labelAppendix}`;
        }
        return this.createMetricMath(
          `${finalExpressionIdZeroed} / PERIOD(${finalExpressionId})`,
          { [finalExpressionId]: metric },
          perSecondLabel,
          metric.color,
          metric.period,
        );
      case RateComputationMethod.PER_MINUTE:
        return this.createMetricMath(
          `(60 * ${finalExpressionIdZeroed}) / PERIOD(${finalExpressionId})`,
          { [finalExpressionId]: metric },
          `${labelPrefix}/m${labelAppendix}`,
          metric.color,
          metric.period,
        );
      case RateComputationMethod.PER_HOUR:
        return this.createMetricMath(
          `(3600 * ${finalExpressionIdZeroed}) / PERIOD(${finalExpressionId})`,
          { [finalExpressionId]: metric },
          `${labelPrefix}/h${labelAppendix}`,
          metric.color,
          metric.period,
        );
      case RateComputationMethod.PER_DAY:
        return this.createMetricMath(
          `(86400 * ${finalExpressionIdZeroed}) / PERIOD(${finalExpressionId})`,
          { [finalExpressionId]: metric },
          `${labelPrefix}/d${labelAppendix}`,
          metric.color,
          metric.period,
        );
    }
  }

  /**
   * Returns the given namespace (if defined) or the global namespace as a fallback.
   * If there is no namespace to fallback to (neither the custom or the default one), it will fail.
   * @param value custom namespace
   */
  getNamespaceWithFallback(value?: string) {
    const namespace = value ?? this.globalDefaults.namespace;
    if (!namespace) {
      throw new Error(
        "There is no custom namespace defined. Please specify it in your factory defaults.",
      );
    }
    return namespace;
  }

  /**
   * Helper method that helps to sanitize the given expression ID and removes all invalid characters.
   * Valid expression ID regexp is the following: ^[a-z][a-zA-Z0-9_]*$
   * As this is just to validate a suffix and not the whole ID, we do not have to verify the first lower case letter.
   * @param expressionId expression ID to sanitize
   */
  sanitizeMetricExpressionIdSuffix(expressionId: string) {
    return expressionId.replace(/[^0-9a-z_]/gi, "");
  }

  /**
   * Merges the given additional dimensions to the given target dimension hash.
   * All existing dimensions with the same key are replaced.
   * @param target target dimension hash to update
   * @param additionalDimensions additional dimensions
   */
  addAdditionalDimensions(
    target: DimensionsMap,
    additionalDimensions: DimensionsMap,
  ) {
    // Add additional dimensions in the search query
    Object.keys(additionalDimensions).forEach((key) => {
      target[key] = additionalDimensions[key];
    });
  }

  /**
   * Removes all entries from the given dimension hash that contain an undefined value.
   * @param dimensionsMap dimensions map to update
   */
  private removeUndefinedEntries(dimensionsMap: DimensionsMap) {
    const copy: DimensionsMap = {};

    Object.entries(dimensionsMap)
      .filter(([_, value]) => value !== undefined)
      .forEach(([key, value]) => (copy[key] = value));

    return copy;
  }

  /**
   * Attempts to get the account from the metric if it differs from the scope.
   */
  private resolveAccount(
    metricAccount: string | undefined,
  ): string | undefined {
    if (!this.scope) {
      return metricAccount;
    }

    const { account } = Stack.of(this.scope);
    if (metricAccount !== account) {
      return metricAccount;
    }

    return;
  }

  /**
   * Attempts to get the region from the metric if it differs from the scope.
   */
  private resolveRegion(metricRegion: string | undefined): string | undefined {
    if (!this.scope) {
      return metricRegion;
    }

    const { region } = Stack.of(this.scope);
    if (metricRegion !== region) {
      return metricRegion;
    }

    return;
  }
}
