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
import {
  WafV2MetricFactory,
  WafV2MetricFactoryProps,
} from "./WafV2MetricFactory";

export interface WafV2MonitoringOptions extends BaseMonitoringProps {}

export interface WafV2MonitoringProps
  extends WafV2MetricFactoryProps,
    WafV2MonitoringOptions {}

/**
 * Monitoring for AWS Web Application Firewall.
 *
 * @see https://docs.aws.amazon.com/waf/latest/developerguide/monitoring-cloudwatch.html
 */
export class WafV2Monitoring extends Monitoring {
  protected readonly humanReadableName: string;

  protected readonly allowedRequestsMetric: MetricWithAlarmSupport;
  protected readonly blockedRequestsMetric: MetricWithAlarmSupport;
  protected readonly blockedRequestsRateMetric: MetricWithAlarmSupport;

  constructor(scope: MonitoringScope, props: WafV2MonitoringProps) {
    super(scope, props);

    const namingStrategy = new MonitoringNamingStrategy({
      ...props,
      namedConstruct: props.acl,
    });
    this.humanReadableName = namingStrategy.resolveHumanReadableName();

    const metricFactory = new WafV2MetricFactory(
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
