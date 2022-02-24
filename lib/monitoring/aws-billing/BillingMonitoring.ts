import { Stack } from "monocdk";
import {
  GraphWidget,
  GraphWidgetView,
  IMetric,
  IWidget,
  SingleValueWidget,
} from "monocdk/aws-cloudwatch";

import {
  BaseMonitoringProps,
  CurrencyAxisUsdFromZero,
  DefaultGraphWidgetHeight,
  DefaultSummaryWidgetHeight,
  FullWidth,
  Monitoring,
  MonitoringScope,
  QuarterWidth,
  ThreeQuartersWidth,
} from "../../common";
import {
  MonitoringHeaderWidget,
  MonitoringNamingStrategy,
} from "../../dashboard";
import {
  BillingCurrency,
  BillingMetricFactory,
  BillingRegion,
} from "./BillingMetricFactory";

export type BillingMonitoringProps = BaseMonitoringProps;

export class BillingMonitoring extends Monitoring {
  private readonly title: string;

  protected readonly costByServiceMetric: IMetric;
  protected readonly totalCostMetric: IMetric;

  constructor(scope: MonitoringScope, props: BillingMonitoringProps) {
    super(scope);

    const fallbackConstructName = Stack.of(scope).account;
    const namingStrategy = new MonitoringNamingStrategy({
      ...props,
      fallbackConstructName,
    });
    this.title = namingStrategy.resolveHumanReadableName();
    const metricFactory = new BillingMetricFactory();
    this.costByServiceMetric =
      metricFactory.metricSearchTopCostByServiceInUsd();
    this.totalCostMetric = metricFactory.metricTotalCostInUsd();
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
        DefaultGraphWidgetHeight
      ),
      this.createTotalChargesWidget(QuarterWidth, DefaultGraphWidgetHeight),
    ];
  }

  protected createTitleWidget() {
    return new MonitoringHeaderWidget({
      family: "AWS Account Billing",
      title: this.title,
    });
  }

  protected createChargesByServiceWidget(width: number, height: number) {
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

  protected createTotalChargesWidget(width: number, height: number) {
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
