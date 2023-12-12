import { Metric } from "aws-cdk-lib/aws-cloudwatch";
import { FilterPattern, ILogGroup, MetricFilter } from "aws-cdk-lib/aws-logs";
import {
  FluentBitFilterMetricTag,
  FluentBitInputMetricTag,
  FluentBitMetricsWithoutWidget,
  FluentBitOutputMetricTag,
  FluentBitStorageMetricTag,
} from "./FluentBitConstants";
import { MetricFactory, MetricStatistic, MonitoringScope } from "../../common";

export interface FluentBitMetricFactoryProps {
  /**
   * Namespace that metrics will be emitted to.
   * @default metric factory default
   */
  readonly namespace?: string;
}

export class FluentBitMetricFactory {
  protected readonly metricFactory: MetricFactory;
  protected readonly namespace: string;
  protected readonly scope: MonitoringScope;

  constructor(scope: MonitoringScope, props: FluentBitMetricFactoryProps) {
    this.scope = scope;
    this.metricFactory = scope.createMetricFactory();
    this.namespace =
      props.namespace ??
      this.metricFactory.getNamespaceWithFallback(props.namespace);
  }

  fluentBitFilterMetrics(logGroup: ILogGroup) {
    const filterMetrics: Metric[] = [];
    Object.values(FluentBitFilterMetricTag).forEach((metricName) => {
      const metric = this.pluginMetric(logGroup, metricName);
      filterMetrics.push(metric);
    });
    return filterMetrics;
  }

  fluentBitOutputMetrics(logGroup: ILogGroup) {
    const outputMetrics: Metric[] = [];
    Object.values(FluentBitOutputMetricTag).forEach((metricName) => {
      const metric = this.pluginMetric(logGroup, metricName);
      outputMetrics.push(metric);
    });
    return outputMetrics;
  }

  fluentBitInputMetrics(logGroup: ILogGroup) {
    const inputMetrics: Metric[] = [];
    Object.values(FluentBitInputMetricTag).forEach((metricName) => {
      const metric = this.pluginMetric(logGroup, metricName);
      inputMetrics.push(metric);
    });
    return inputMetrics;
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
      }
    );
    return metricFilter.metric({
      statistic: MetricStatistic.MAX,
    });
  }

  fluentBitStorageMetrics(logGroup: ILogGroup) {
    const storageMetrics: Metric[] = [];
    Object.values(FluentBitStorageMetricTag).forEach((metricName) => {
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
        }
      );
      const metric = metricFilter.metric({
        statistic: MetricStatistic.MAX,
      });
      storageMetrics.push(metric);
    });
    return storageMetrics;
  }

  fluentBitMetricsWithoutWidgets(logGroup: ILogGroup) {
    Object.values(FluentBitMetricsWithoutWidget).forEach((metricName) =>
      this.pluginMetric(logGroup, metricName)
    );
  }
}
