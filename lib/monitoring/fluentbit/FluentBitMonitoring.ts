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

Log group to which FluentBit emits metrics logs
    */
  readonly logGroup: ILogGroup;
}

export class FluentBitMonitoring extends Monitoring {
  protected readonly logGroupName: string;
  protected readonly metricFactory: FluentBitMetricFactory;
  protected readonly fluentBitStorageMetrics: Metric[];
  protected readonly fluentBitInputMetrics: Metric[];
  protected readonly fluentBitOutputMetrics: Metric[];
  protected readonly fluentBitFilterMetrics: Metric[];

  constructor(scope: MonitoringScope, props: FluentBitMonitoringProps) {
    super(scope, props);
    this.logGroupName = props.logGroup.logGroupName;
    this.metricFactory = new FluentBitMetricFactory(scope, props);

    this.fluentBitStorageMetrics = this.metricFactory.fluentBitStorageMetrics(
      props.logGroup
    );
    this.fluentBitInputMetrics = this.metricFactory.fluentBitInputMetrics(
      props.logGroup
    );
    this.fluentBitOutputMetrics = this.metricFactory.fluentBitOutputMetrics(
      props.logGroup
    );
    this.fluentBitFilterMetrics = this.metricFactory.fluentBitFilterMetrics(
      props.logGroup
    );
    this.metricFactory.fluentBitMetricsWithoutWidgets(props.logGroup);
  }

  widgets(): IWidget[] {
    return [
      new MonitoringHeaderWidget({
        title: "FluentBit",
      }),
      this.createFluentBitInputWidget(),
      this.createFluentBitOutputWidget(),
      this.createFluentBitFilterWidget(),
      this.createFluentBitStorageWidget(),
    ];
  }

  private createFluentBitInputWidget() {
    return this.createFluentBitMetricWidget(
      [...Object.values(this.fluentBitInputMetrics)],
      "Input Metrics"
    );
  }
  private createFluentBitOutputWidget() {
    return this.createFluentBitMetricWidget(
      [...Object.values(this.fluentBitOutputMetrics)],
      "Output Metrics"
    );
  }

  private createFluentBitFilterWidget() {
    return this.createFluentBitMetricWidget(
      [...Object.values(this.fluentBitFilterMetrics)],
      "Filter Metrics"
    );
  }

  private createFluentBitStorageWidget() {
    return this.createFluentBitMetricWidget(
      [...Object.values(this.fluentBitStorageMetrics)],
      "Storage Metrics"
    );
  }

  private createFluentBitMetricWidget(
    metrics: MetricWithAlarmSupport[],
    title: string
  ): GraphWidget {
    return new GraphWidget({
      width: HalfWidth,
      height: DefaultGraphWidgetHeight,
      title: `${title}`,
      left: metrics,
      leftAnnotations: undefined,
      leftYAxis: CountAxisFromZero,
    });
  }
}
