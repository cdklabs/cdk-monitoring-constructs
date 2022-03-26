import { GraphWidget, IWidget } from "monocdk/aws-cloudwatch";
import {
  BaseMonitoringProps,
  CountAxisFromZero,
  DefaultGraphWidgetHeight,
  DefaultSummaryWidgetHeight,
  MetricWithAlarmSupport,
  Monitoring,
  MonitoringScope,
  RateAxisFromZero,
  ThirdWidth,
} from "../../common";
import {
  MonitoringHeaderWidget,
  MonitoringNamingStrategy,
} from "../../dashboard";
import { WafMetricFactory, WafMetricFactoryProps } from "./WafMetricFactory";

export interface WafMonitoringOptions extends BaseMonitoringProps {}

export interface WafMonitoringProps
  extends WafMetricFactoryProps,
    WafMonitoringOptions {}

/**
 * Monitoring for AWS Web Application Firewall.
 *
 * @see https://docs.aws.amazon.com/waf/latest/developerguide/monitoring-cloudwatch.html
 */
export class WafMonitoring extends Monitoring {
  protected readonly humanReadableName: string;

  protected readonly allowedRequestsMetric: MetricWithAlarmSupport;
  protected readonly blockedRequestsMetric: MetricWithAlarmSupport;
  protected readonly blockedRequestsRateMetric: MetricWithAlarmSupport;

  constructor(scope: MonitoringScope, props: WafMonitoringProps) {
    super(scope, props);

    const namingStrategy = new MonitoringNamingStrategy({
      ...props,
      fallbackConstructName: props.aclName,
    });
    this.humanReadableName = namingStrategy.resolveHumanReadableName();

    const metricFactory = new WafMetricFactory(
      scope.createMetricFactory(),
      props
    );

    this.allowedRequestsMetric = metricFactory.metricAllowedRequests();
    this.blockedRequestsMetric = metricFactory.metricBlockedRequests();
    this.blockedRequestsRateMetric = metricFactory.metricBlockedRequestsRate();
  }

  summaryWidgets(): IWidget[] {
    return [
      this.createTitleWidget(),
      this.createAllowedRequestsWidget(ThirdWidth, DefaultSummaryWidgetHeight),
      this.createBlockedRequestsWidget(ThirdWidth, DefaultSummaryWidgetHeight),
      this.createBlockedRequestsRateWidget(
        ThirdWidth,
        DefaultSummaryWidgetHeight
      ),
    ];
  }

  widgets(): IWidget[] {
    return [
      this.createTitleWidget(),
      this.createAllowedRequestsWidget(ThirdWidth, DefaultGraphWidgetHeight),
      this.createBlockedRequestsWidget(ThirdWidth, DefaultSummaryWidgetHeight),
      this.createBlockedRequestsRateWidget(
        ThirdWidth,
        DefaultSummaryWidgetHeight
      ),
    ];
  }

  protected createTitleWidget() {
    return new MonitoringHeaderWidget({
      family: "Web Application Firewall",
      title: this.humanReadableName,
    });
  }

  protected createAllowedRequestsWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Allowed Requests",
      left: [this.allowedRequestsMetric],
      leftYAxis: CountAxisFromZero,
    });
  }

  protected createBlockedRequestsWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Blocked Requests",
      left: [this.blockedRequestsMetric],
      leftYAxis: CountAxisFromZero,
    });
  }

  protected createBlockedRequestsRateWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Blocked Requests (rate)",
      left: [this.blockedRequestsRateMetric],
      leftYAxis: RateAxisFromZero,
    });
  }
}
