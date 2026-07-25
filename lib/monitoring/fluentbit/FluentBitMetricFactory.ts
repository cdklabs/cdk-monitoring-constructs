import { FilterPattern, ILogGroup, MetricFilter } from "aws-cdk-lib/aws-logs";
import {
  FluentBitFilterMetricTag,
  FluentBitInputMetricTag,
  FluentBitMetricsWithoutWidget,
  FluentBitOutputMetricTag,
  FluentBitStorageMetricTag,
} from "./FluentBitConstants";
import {
  BaseMetricFactory,
  BaseMetricFactoryProps,
  MetricStatistic,
  MonitoringScope,
} from "../../common";

export interface FluentBitMetricFactoryProps extends BaseMetricFactoryProps {
  /**
   * Namespace that metrics will be emitted to.
   * @default metric factory default
   */
  readonly namespace?: string;
}

export class FluentBitMetricFactory extends BaseMetricFactory {
  protected readonly namespace: string;
  protected readonly scope: MonitoringScope;

  constructor(scope: MonitoringScope, props: FluentBitMetricFactoryProps) {
    super(scope.createMetricFactory(), props);

    this.scope = scope;
    this.namespace =
      props.namespace ??
      this.metricFactory.getNamespaceWithFallback(props.namespace);
  }

  filterMetrics(logGroup: ILogGroup) {
    return Object.values(FluentBitFilterMetricTag).map((metricName) => {
      return this.pluginMetric(logGroup, metricName);
    });
  }

  outputMetrics(logGroup: ILogGroup) {
    return Object.values(FluentBitOutputMetricTag).map((metricName) => {
      return this.pluginMetric(logGroup, metricName);
    });
  }

  inputMetrics(logGroup: ILogGroup) {
    return Object.values(FluentBitInputMetricTag).map((metricName) => {
      return this.pluginMetric(logGroup, metricName);
    });
  }

  private pluginMetric(logGroup: ILogGroup, metricName: string) {
    const metricFilter = new MetricFilter(
      this.scope,
      `FluentBit-${metricName}-${logGroup}-MetricFilter`,
      {
        logGroup: logGroup,
        filterPattern: FilterPattern.literal(`{ $.metric = "${metricName}" }`),
        metricNamespace: this.namespace,
        metricName,
        metricValue: "$.value",
      },
    );
    return metricFilter.metric({
      statistic: MetricStatistic.MAX,
      region: this.region,
      account: this.account,
    });
  }

  storageMetrics(logGroup: ILogGroup) {
    return Object.values(FluentBitStorageMetricTag).map((metricName) => {
      const valueString = `$.storage_layer.chunks.${metricName}`;
      const metricFilter = new MetricFilter(
        this.scope,
        `FluentBit-${metricName}-${logGroup}-MetricFilter`,
        {
          logGroup: logGroup,
          filterPattern: FilterPattern.literal(`{ ${valueString} = * }`),
          metricNamespace: this.namespace,
          metricName,
          metricValue: `${valueString}`,
        },
      );
      return metricFilter.metric({
        statistic: MetricStatistic.MAX,
        region: this.region,
        account: this.account,
      });
    });
  }

  metricsWithoutWidgets(logGroup: ILogGroup) {
    Object.values(FluentBitMetricsWithoutWidget).forEach((metricName) =>
      this.pluginMetric(logGroup, metricName),
    );
  }
}
