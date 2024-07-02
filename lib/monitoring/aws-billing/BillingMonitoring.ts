import {
  GraphWidget,
  GraphWidgetView,
  IMetric,
  IWidget,
  SingleValueWidget,
} from "aws-cdk-lib/aws-cloudwatch";

import {
  BillingCurrency,
  BillingMetricFactory,
  BillingRegion,
} from "./BillingMetricFactory";
import {
  AlarmFactory,
  AnomalyDetectingAlarmFactory,
  AnomalyDetectionThreshold,
  BaseMonitoringProps,
  CurrencyAxisUsdFromZero,
  DefaultGraphWidgetHeight,
  DefaultSummaryWidgetHeight,
  FullWidth,
  MetricWithAlarmSupport,
  Monitoring,
  MonitoringScope,
  QuarterWidth,
  ThreeQuartersWidth,
} from "../../common";
import {
  MonitoringHeaderWidget,
  MonitoringNamingStrategy,
} from "../../dashboard";

export interface BillingMonitoringOptions extends BaseMonitoringProps {
  readonly addTotalCostAnomalyAlarm?: Record<string, AnomalyDetectionThreshold>;
}

export interface BillingMonitoringProps extends BillingMonitoringOptions {}

export class BillingMonitoring extends Monitoring {
  readonly title: string;

  readonly alarmFactory: AlarmFactory;
  readonly anomalyDetectingAlarmFactory: AnomalyDetectingAlarmFactory;

  readonly costByServiceMetric: IMetric;
  readonly totalCostMetric: MetricWithAlarmSupport;

  constructor(scope: MonitoringScope, props: BillingMonitoringProps) {
    super(scope);

    const namingStrategy = new MonitoringNamingStrategy({
      ...props,
      fallbackConstructName: "Billing",
    });
    this.title = namingStrategy.resolveHumanReadableName();
    this.alarmFactory = scope.createAlarmFactory(
      namingStrategy.resolveAlarmFriendlyName(),
    );
    this.anomalyDetectingAlarmFactory = new AnomalyDetectingAlarmFactory(
      this.alarmFactory,
    );
    const metricFactory = new BillingMetricFactory();
    this.costByServiceMetric =
      metricFactory.metricSearchTopCostByServiceInUsd();
    this.totalCostMetric = metricFactory.metricTotalCostInUsd();

    for (const disambiguator in props.addTotalCostAnomalyAlarm) {
      const alarmProps = props.addTotalCostAnomalyAlarm[disambiguator];
      const createdAlarm =
        this.anomalyDetectingAlarmFactory.addAlarmWhenOutOfBand(
          this.totalCostMetric,
          "Cost-Anomaly",
          disambiguator,
          alarmProps,
        );
      this.addAlarm(createdAlarm);
    }

    props.useCreatedAlarms?.consume(this.createdAlarms());
  }

  summaryWidgets(): IWidget[] {
    return [
      this.createTitleWidget(),
      this.createTotalChargesWidget(FullWidth, DefaultSummaryWidgetHeight),
    ];
  }

  widgets(): IWidget[] {
    return [
      this.createTitleWidget(),
      this.createChargesByServiceWidget(
        ThreeQuartersWidth,
        DefaultGraphWidgetHeight,
      ),
      this.createTotalChargesWidget(QuarterWidth, DefaultGraphWidgetHeight),
    ];
  }

  createTitleWidget() {
    return new MonitoringHeaderWidget({
      family: "AWS Account Billing",
      title: this.title,
    });
  }

  createChargesByServiceWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Most Expensive Services (" + BillingCurrency + ")",
      left: [this.costByServiceMetric],
      leftYAxis: CurrencyAxisUsdFromZero,
      view: GraphWidgetView.BAR,
      // billing is global but resides in single region
      region: BillingRegion,
    });
  }

  createTotalChargesWidget(width: number, height: number) {
    return new SingleValueWidget({
      width,
      height,
      title: "Total Cost (" + BillingCurrency + ")",
      metrics: [this.totalCostMetric],
      fullPrecision: false,
      setPeriodToTimeRange: false,
      // billing is global but resides in single region
      region: BillingRegion,
    });
  }
}
