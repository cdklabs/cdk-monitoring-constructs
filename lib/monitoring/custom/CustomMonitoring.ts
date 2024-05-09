import { Duration } from "aws-cdk-lib";
import {
  DimensionsMap,
  GraphWidget,
  GraphWidgetProps,
  HorizontalAnnotation,
  IMetric,
  IWidget,
  LegendPosition,
  Row,
  TextWidget,
  VerticalAnnotation,
  YAxisProps,
} from "aws-cdk-lib/aws-cloudwatch";

import {
  AnomalyDetectingAlarmFactory,
  AnomalyDetectionThreshold,
  BaseMonitoringProps,
  createGraphWidget,
  CustomAlarmFactory,
  CustomThreshold,
  DefaultGraphWidgetHeight,
  DefaultSummaryWidgetHeight,
  FullWidth,
  getHashForMetricExpressionId,
  GraphWidgetType,
  MetricStatistic,
  MetricWithAlarmSupport,
  Monitoring,
  MonitoringScope,
  recommendedWidgetWidth,
} from "../../common";
import {
  MonitoringHeaderWidget,
  MonitoringNamingStrategy,
} from "../../dashboard";

export enum AxisPosition {
  LEFT = "left",
  RIGHT = "right",
}

/**
 * Custom metric with an alarm defined.
 */
export interface CustomMetricWithAlarm {
  /**
   * metric to alarm on
   */
  readonly metric: MetricWithAlarmSupport;
  /**
   * alarm friendly name
   */
  readonly alarmFriendlyName: string;
  /**
   * alarm definitions
   */
  readonly addAlarm: Record<string, CustomThreshold>;
  /**
   * axis (right or left) on which to graph metric
   * default: AxisPosition.LEFT
   */
  readonly position?: AxisPosition;
}

/**
 * Custom metric with anomaly detection.
 */
export interface CustomMetricWithAnomalyDetection {
  /**
   * metric to alarm on
   */
  readonly metric: MetricWithAlarmSupport;
  /**
   * anomaly detection period
   * @default - metric period (if defined) or global default
   */
  readonly period?: Duration;
  /**
   * alarm friendly name
   */
  readonly alarmFriendlyName: string;
  /**
   * standard deviation for the anomaly detection to be rendered on the graph widget
   */
  readonly anomalyDetectionStandardDeviationToRender: number;
  /**
   * adds alarm on a detected anomaly
   */
  readonly addAlarmOnAnomaly?: Record<string, AnomalyDetectionThreshold>;
}

/**
 * Custom metric search.
 */
export interface CustomMetricSearch {
  /**
   * metric namespace
   * @default - none
   */
  readonly namespace?: string;
  /**
   * search query (can be empty)
   */
  readonly searchQuery: string;
  /**
   * custom label for the metrics
   * @default - " "
   */
  readonly label?: string;
  /**
   * search dimensions (can be empty)
   */
  readonly dimensionsMap: DimensionsMap;
  /**
   * metric statistic
   */
  readonly statistic: MetricStatistic;
  /**
   * metric period
   * @default - global default
   */
  readonly period?: Duration;
  /**
   * axis (right or left) on which to graph metric
   * default: AxisPosition.LEFT
   */
  readonly position?: AxisPosition;
}

/**
 * Each custom metric can be of four types:
 * @see MetricWithAlarmSupport for a standard metric
 * @see CustomMetricSearch for a search
 * @see CustomMetricWithAlarm for a metric with an alarm
 * @see CustomMetricWithAnomalyDetection for a metric with an anomaly detecting alarm
 */
export type CustomMetric =
  | MetricWithAlarmSupport
  | CustomMetricSearch
  | CustomMetricWithAlarm
  | CustomMetricWithAnomalyDetection;

/**
 * Custom metric group represents a single widget.
 */
export interface CustomMetricGroup {
  /**
   * title of the whole group
   */
  readonly title: string;
  /**
   * type of the widget
   * @default line
   */
  readonly graphWidgetType?: GraphWidgetType;
  /**
   * optional axis
   * @default undefined
   */
  readonly graphWidgetAxis?: YAxisProps;
  /**
   * optional right axis
   * @default undefined
   */
  readonly graphWidgetRightAxis?: YAxisProps;
  /**
   * graph widget legend
   * @default BOTTOM
   */
  readonly graphWidgetLegend?: LegendPosition;
  /**
   * @see {GraphWidgetProps.setPeriodToTimeRange}
   */
  readonly graphWidgetSetPeriodToTimeRange?: boolean;
  /**
   * Width of graph widget. Note that widgets will overflow into new rows if the summed width
   * exceeds 24.
   *
   * @default - Automatically calculcated width, generally as wide as possible considering all metrics' widgets.
   */
  readonly graphWidgetWidth?: number;
  /**
   * @deprecated use addToSummaryDashboard. addToSummaryDashboard will take precedence over important.
   * @see addToSummaryDashboard
   */
  readonly important?: boolean;
  /**
   * Flag indicating this metric group should be included in the summary as well.
   * @default - addToSummaryDashboard from CustomMonitoringProps, defaulting to false
   */
  readonly addToSummaryDashboard?: boolean;
  /**
   * list of metrics in the group (can be defined in different ways, see the type documentation)
   */
  readonly metrics: CustomMetric[];
  /**
   * Optional custom horizontal annotations which will be displayed over the metrics on the left axis
   * (if there are any alarms, any existing annotations will be merged together).
   */
  readonly horizontalAnnotations?: HorizontalAnnotation[];
  /**
   * Optional custom horizontal annotations which will be displayed over the metrics on the right axis
   * (if there are any alarms, any existing annotations will be merged together).
   */
  readonly horizontalRightAnnotations?: HorizontalAnnotation[];
  /**
   * Optional custom vertical annotations which will be displayed over the metrics.
   */
  readonly verticalAnnotations?: VerticalAnnotation[];
}

export interface CustomMonitoringProps extends BaseMonitoringProps {
  /**
   * optional description of the whole section, in markdown
   *
   * @default - no description
   */
  readonly description?: string;
  /**
   * optional height of the description widget, so the content fits
   *
   * @default - minimum height (should fit one or two lines of text)
   */
  readonly descriptionWidgetHeight?: number;
  /**
   * Height override.
   *
   * @default - default height
   */
  readonly height?: number;
  /**
   * define metric groups and metrics inside them (each metric group represents a widget)
   */
  readonly metricGroups: CustomMetricGroup[];
}

export interface CustomMetricGroupWithAnnotations {
  readonly metricGroup: CustomMetricGroup;
  readonly annotations: HorizontalAnnotation[];
  readonly rightAnnotations: HorizontalAnnotation[];
  readonly verticalAnnotations: VerticalAnnotation[];
  readonly titleAddons: string[];
  readonly height?: number;
}

/**
 * Custom monitoring is a construct allowing you to monitor your own custom metrics.
 * The entire construct consists of metric groups.
 * Each metric group represents a single graph widget with multiple metrics.
 * Each metric inside the metric group represents a single metric inside a graph.
 * The widgets will be sized automatically to waste as little space as possible.
 */
export class CustomMonitoring extends Monitoring {
  readonly title: string;
  readonly description?: string;
  readonly descriptionWidgetHeight?: number;
  readonly height?: number;
  readonly addToSummaryDashboard: boolean;
  readonly customAlarmFactory: CustomAlarmFactory;
  readonly anomalyDetectingAlarmFactory: AnomalyDetectingAlarmFactory;
  readonly metricGroups: CustomMetricGroupWithAnnotations[];

  constructor(scope: MonitoringScope, props: CustomMonitoringProps) {
    super(scope, props);

    const namingStrategy = new MonitoringNamingStrategy({ ...props });
    this.title = namingStrategy.resolveHumanReadableName();

    this.description = props.description;
    this.descriptionWidgetHeight = props.descriptionWidgetHeight;
    this.height = props.height;
    this.addToSummaryDashboard = props.addToSummaryDashboard ?? false;

    const alarmFactory = this.createAlarmFactory(
      namingStrategy.resolveAlarmFriendlyName()
    );
    this.customAlarmFactory = new CustomAlarmFactory(alarmFactory);
    this.anomalyDetectingAlarmFactory = new AnomalyDetectingAlarmFactory(
      alarmFactory
    );

    this.metricGroups = props.metricGroups.map((metricGroup) => {
      const metricGroupWithAnnotation: CustomMetricGroupWithAnnotations = {
        metricGroup,
        annotations: [],
        rightAnnotations: [],
        verticalAnnotations: [],
        titleAddons: [],
      };

      if (metricGroup.horizontalAnnotations) {
        metricGroupWithAnnotation.annotations.push(
          ...metricGroup.horizontalAnnotations
        );
      }
      if (metricGroup.horizontalRightAnnotations) {
        metricGroupWithAnnotation.rightAnnotations.push(
          ...metricGroup.horizontalRightAnnotations
        );
      }
      if (metricGroup.verticalAnnotations) {
        metricGroupWithAnnotation.verticalAnnotations.push(
          ...metricGroup.verticalAnnotations
        );
      }

      metricGroup.metrics.forEach((metric) => {
        if (this.hasAlarm(metric) && this.hasAnomalyDetection(metric)) {
          throw new Error(
            "Adding both a regular alarm and an anomaly detection alarm at the same time is not supported"
          );
        }

        if (this.hasAlarm(metric)) {
          this.setupAlarm(metricGroupWithAnnotation, metric);
        } else if (this.hasAnomalyDetection(metric)) {
          this.setupAnomalyDetectionAlarm(metricGroupWithAnnotation, metric);
        }
      });

      return metricGroupWithAnnotation;
    });

    props.useCreatedAlarms?.consume(this.createdAlarms());
  }

  summaryWidgets(): IWidget[] {
    return this.getAllWidgets(true);
  }

  widgets(): IWidget[] {
    return this.getAllWidgets(false);
  }

  private getAllWidgets(summary: boolean): IWidget[] {
    const filteredMetricGroups = summary
      ? this.metricGroups.filter(
          (group) =>
            group.metricGroup.addToSummaryDashboard ??
            group.metricGroup.important ??
            this.addToSummaryDashboard
        )
      : this.metricGroups;

    if (filteredMetricGroups.length < 1) {
      // short-circuit if there are no metrics specified
      return [];
    }

    const rows: Row[] = [];

    // header and description
    rows.push(new Row(new MonitoringHeaderWidget({ title: this.title })));
    if (this.description && !summary) {
      rows.push(
        new Row(
          this.createDescriptionWidget(
            this.description,
            this.descriptionWidgetHeight
          )
        )
      );
    }

    // graphs
    rows.push(
      new Row(
        ...this.createCustomMetricGroupWidgets(filteredMetricGroups, summary)
      )
    );

    return rows;
  }

  private createDescriptionWidget(
    markdown: string,
    descriptionWidgetHeight?: number
  ) {
    return new TextWidget({
      markdown,
      width: FullWidth,
      height: descriptionWidgetHeight ?? 1,
    });
  }

  private createCustomMetricGroupWidgets(
    annotatedGroups: CustomMetricGroupWithAnnotations[],
    summary: boolean
  ) {
    const widgets: IWidget[] = [];
    const metricGroupWidgetHeightDefault = summary
      ? DefaultSummaryWidgetHeight
      : DefaultGraphWidgetHeight;
    const metricGroupWidgetHeight =
      this.height ?? metricGroupWidgetHeightDefault;

    annotatedGroups.forEach((annotatedGroup) => {
      const metrics = annotatedGroup.metricGroup.metrics;
      const left = this.toMetrics(
        metrics.filter(
          (metric) =>
            ((metric as any).position ?? AxisPosition.LEFT) == AxisPosition.LEFT
        )
      );
      const right = this.toMetrics(
        metrics.filter(
          (metric) =>
            ((metric as any).position ?? AxisPosition.LEFT) ==
            AxisPosition.RIGHT
        )
      );
      const hasOneMetricOnly = metrics.length === 1;
      const hasAnomalyDetection =
        metrics.filter((metric) => this.hasAnomalyDetection(metric)).length > 0;
      const useAnomalyDetectionWidget = hasOneMetricOnly && hasAnomalyDetection;
      let title = annotatedGroup.metricGroup.title;

      if (annotatedGroup.titleAddons.length > 0) {
        title = `${title} (${annotatedGroup.titleAddons.join(", ")})`;
      }

      const graphWidgetProps: GraphWidgetProps = {
        title,
        width:
          annotatedGroup.metricGroup.graphWidgetWidth ??
          recommendedWidgetWidth(annotatedGroups.length),
        height: metricGroupWidgetHeight,
        left,
        right,
        leftAnnotations: annotatedGroup.annotations,
        rightAnnotations: annotatedGroup.rightAnnotations,
        leftYAxis: annotatedGroup.metricGroup.graphWidgetAxis,
        rightYAxis: annotatedGroup.metricGroup.graphWidgetRightAxis,
        verticalAnnotations: annotatedGroup.verticalAnnotations,
        legendPosition: annotatedGroup.metricGroup.graphWidgetLegend,
        setPeriodToTimeRange:
          annotatedGroup.metricGroup.graphWidgetSetPeriodToTimeRange,
      };

      const widget = useAnomalyDetectionWidget
        ? new AnomalyDetectionGraphWidget(graphWidgetProps)
        : createGraphWidget(
            annotatedGroup.metricGroup.graphWidgetType ?? GraphWidgetType.LINE,
            graphWidgetProps
          );

      widgets.push(widget);
    });

    return widgets;
  }

  private toMetrics(metrics: CustomMetric[]): IMetric[] {
    const metricFactory = this.createMetricFactory();

    return metrics.map((metric) => {
      if (this.hasAlarm(metric)) {
        // metric with alarm
        return metricFactory.adaptMetricPreservingPeriod(metric.metric);
      } else if (this.hasAnomalyDetection(metric)) {
        // metric with anomaly detection
        return metricFactory.createMetricAnomalyDetection(
          metric.metric,
          metric.anomalyDetectionStandardDeviationToRender,
          `Expected (stdev = ${metric.anomalyDetectionStandardDeviationToRender})`,
          undefined,
          // needs to be unique in the whole widget and start with lowercase
          AnomalyDetectionMetricIdPrefix +
            getHashForMetricExpressionId(metric.alarmFriendlyName),
          // preserve the most specific metric period
          metric.period ?? metric.metric.period
        );
      } else if (this.isSearch(metric)) {
        // metric search
        return metricFactory.createMetricSearch(
          metric.searchQuery,
          metric.dimensionsMap,
          metric.statistic,
          metric.namespace,
          metric.label,
          metric.period
        );
      } else {
        // general metric
        return metricFactory.adaptMetricPreservingPeriod(metric);
      }
    });
  }

  private hasAlarm(metric: CustomMetric): metric is CustomMetricWithAlarm {
    // type guard
    return (metric as CustomMetricWithAlarm).addAlarm !== undefined;
  }

  private hasAnomalyDetection(
    metric: CustomMetric
  ): metric is CustomMetricWithAnomalyDetection {
    // type guard
    return (
      (metric as CustomMetricWithAnomalyDetection)
        .anomalyDetectionStandardDeviationToRender !== undefined
    );
  }

  private isSearch(metric: CustomMetric): metric is CustomMetricSearch {
    // type guard
    return (metric as CustomMetricSearch).searchQuery !== undefined;
  }

  private setupAlarm(
    metricGroup: CustomMetricGroupWithAnnotations,
    metric: CustomMetricWithAlarm
  ) {
    if (this.isSearch(metric)) {
      throw new Error(
        "Alarming on search queries is not supported by CloudWatch"
      );
    }

    for (const disambiguator in metric.addAlarm) {
      const alarmProps = metric.addAlarm[disambiguator];
      const createdAlarm = this.customAlarmFactory.addCustomAlarm(
        metric.metric,
        metric.alarmFriendlyName,
        disambiguator,
        alarmProps
      );
      const targetAnnotations =
        (metric.position ?? AxisPosition.LEFT) == AxisPosition.LEFT
          ? metricGroup.annotations
          : metricGroup.rightAnnotations;
      targetAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }
  }

  private setupAnomalyDetectionAlarm(
    metricGroup: CustomMetricGroupWithAnnotations,
    metric: CustomMetricWithAnomalyDetection
  ) {
    if (this.isSearch(metric)) {
      throw new Error(
        "Alarming on search queries is not supported by CloudWatch"
      );
    }

    const alarmStDevs = new Set<number>();
    const metricFactory = this.createMetricFactory();

    for (const disambiguator in metric.addAlarmOnAnomaly) {
      const alarmProps = metric.addAlarmOnAnomaly[disambiguator];
      if (
        alarmProps.alarmWhenAboveTheBand ||
        alarmProps.alarmWhenBelowTheBand
      ) {
        const anomalyMetric = metricFactory.createMetricAnomalyDetection(
          // Because the metric was provided to us, we use metricFactory.overrideNamespace() to
          // confirm it aligns with any namespace overrides requested for this MonitoringFacade
          metricFactory.adaptMetricPreservingPeriod(metric.metric),
          alarmProps.standardDeviationForAlarm,
          `Band (stdev ${alarmProps.standardDeviationForAlarm})`,
          undefined,
          // expression ID needs to be unique across the whole widget; needs to start with a lowercase letter
          AnomalyDetectionAlarmIdPrefix +
            getHashForMetricExpressionId(
              metric.alarmFriendlyName + "_" + disambiguator
            ),
          // preserve the most-specific metric period
          metric.period ?? metric.metric.period
        );

        const createdAlarm =
          this.anomalyDetectingAlarmFactory.addAlarmWhenOutOfBand(
            anomalyMetric,
            metric.alarmFriendlyName,
            disambiguator,
            alarmProps
          );

        // no need to add annotation since the bands are rendered automatically
        this.addAlarm(createdAlarm);
        alarmStDevs.add(alarmProps.standardDeviationForAlarm);
      }
    }

    if (alarmStDevs.size > 0) {
      const alarmStDevsString = Array.from(alarmStDevs).sort().join(", ");
      metricGroup.titleAddons.push(`alarms with stdev ${alarmStDevsString}`);
    }
  }
}

const AnomalyDetectionAlarmIdPrefix = "alarm_";
const AnomalyDetectionMetricIdPrefix = "anomaly_";
const AnomalyBandMetricIdSuffix = "_band";

/**
 * INTERNAL - PLEASE DO NOT USE
 * This is a hacky solution to make band visible in GraphWidget (default widget only renders lines, not the band).
 * The class makes assumptions about the internal JSON structure but found no other way :(.
 * Ideally, we want to remove this hack once the anomaly detection rendering in CDK gets improved
 */
class AnomalyDetectionGraphWidget extends GraphWidget {
  constructor(props: GraphWidgetProps) {
    super(props);
  }

  toJson() {
    const json = super.toJson();
    if (json.length !== 1 || !json?.[0]?.properties?.metrics) {
      throw new Error(
        "The JSON is expected to have exactly one element with properties.metrics property."
      );
    }
    const metrics: any[] = json[0].properties.metrics;
    if (metrics.length < 2) {
      throw new Error(
        "The number of metrics must be at least two (metric + anomaly detection math)."
      );
    }
    const anomalyDetectionMetricPart: any[] = metrics[0]?.value;
    if (
      !anomalyDetectionMetricPart ||
      anomalyDetectionMetricPart.length !== 1
    ) {
      throw new Error("First metric must be a math expression.");
    }
    const evaluatedMetricPart: any[] = metrics[1]?.value;
    if (
      !evaluatedMetricPart ||
      evaluatedMetricPart.length < 1 ||
      !evaluatedMetricPart[evaluatedMetricPart.length - 1].id
    ) {
      throw new Error("Second metric must have an ID.");
    }
    // band rendering requires ID to be set
    anomalyDetectionMetricPart[0].id =
      evaluatedMetricPart[evaluatedMetricPart.length - 1].id +
      AnomalyBandMetricIdSuffix;
    // band rendering requires the evaluated metric to be visible
    evaluatedMetricPart[evaluatedMetricPart.length - 1].visible = true;
    return json;
  }
}
