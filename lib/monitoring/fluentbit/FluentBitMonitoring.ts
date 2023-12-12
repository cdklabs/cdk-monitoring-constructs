import { GraphWidget, IWidget, Metric } from "aws-cdk-lib/aws-cloudwatch";
import { ILogGroup } from "aws-cdk-lib/aws-logs";
import {
  FluentBitMetricFactory,
  FluentBitMetricFactoryProps,
} from "./FluentBitMetricFactory";
import {
  BaseMonitoringProps,
  CountAxisFromZero,
  DefaultGraphWidgetHeight,
  HalfWidth,
  MetricWithAlarmSupport,
  Monitoring,
  MonitoringScope,
} from "../../common";
import { MonitoringHeaderWidget } from "../../dashboard";

export interface FluentBitMonitoringProps
  extends FluentBitMetricFactoryProps,
    BaseMonitoringProps {
  /**

Log group that contains FluentBit metric logs
    */
  readonly logGroup: ILogGroup;
}

export class FluentBitMonitoring extends Monitoring {
  protected readonly logGroupName: string;
  protected readonly metricFactory: FluentBitMetricFactory;
  protected readonly storageMetrics: Metric[];
  protected readonly inputMetrics: Metric[];
  protected readonly outputMetrics: Metric[];
  protected readonly filterMetrics: Metric[];

  constructor(scope: MonitoringScope, props: FluentBitMonitoringProps) {
    super(scope, props);
    this.logGroupName = props.logGroup.logGroupName;
    this.metricFactory = new FluentBitMetricFactory(scope, props);

    this.storageMetrics = this.metricFactory.storageMetrics(props.logGroup);
    this.inputMetrics = this.metricFactory.inputMetrics(props.logGroup);
    this.outputMetrics = this.metricFactory.outputMetrics(props.logGroup);
    this.filterMetrics = this.metricFactory.filterMetrics(props.logGroup);
    this.metricFactory.metricsWithoutWidgets(props.logGroup);
  }

  widgets(): IWidget[] {
    return [
      this.createTitleWidget(),
      this.inputMetricsWidget(),
      this.outputMetricsWidget(),
      this.filterMetricsWidget(),
      this.storageMetricsWidget(),
    ];
  }

  summaryWidgets(): IWidget[] {
    return [
      this.createTitleWidget(),
      this.outputMetricsWidget(),
      this.storageMetricsWidget(),
    ];
  }

  private createTitleWidget() {
    return new MonitoringHeaderWidget({
      title: "FluentBit",
    });
  }
  private inputMetricsWidget() {
    return this.createMetricWidget(
      [...Object.values(this.inputMetrics)],
      "Input Metrics"
    );
  }
  private outputMetricsWidget() {
    return this.createMetricWidget(
      [...Object.values(this.outputMetrics)],
      "Output Metrics"
    );
  }

  private filterMetricsWidget() {
    return this.createMetricWidget(
      [...Object.values(this.filterMetrics)],
      "Filter Metrics"
    );
  }

  private storageMetricsWidget() {
    return this.createMetricWidget(
      [...Object.values(this.storageMetrics)],
      "Storage Metrics"
    );
  }

  private createMetricWidget(
    metrics: MetricWithAlarmSupport[],
    title: string
  ): GraphWidget {
    return new GraphWidget({
      width: HalfWidth,
      height: DefaultGraphWidgetHeight,
      title,
      left: metrics,
      leftAnnotations: undefined,
      leftYAxis: CountAxisFromZero,
    });
  }
}
