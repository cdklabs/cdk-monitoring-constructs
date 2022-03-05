import { GraphWidget, IWidget } from "monocdk/aws-cloudwatch";

import {
  BaseMonitoringProps,
  CountAxisFromZero,
  DefaultGraphWidgetHeight,
  DefaultSummaryWidgetHeight,
  HalfWidth,
  MetricWithAlarmSupport,
  Monitoring,
  MonitoringScope,
  PercentageAxisFromZeroToHundred,
  QuarterWidth,
  SizeAxisBytesFromZero,
} from "../../common";
import {
  MonitoringHeaderWidget,
  MonitoringNamingStrategy,
} from "../../dashboard";
import {
  CloudFrontDistributionMetricFactory,
  CloudFrontDistributionMetricFactoryProps,
} from "./CloudFrontDistributionMetricFactory";

export interface CloudFrontDistributionMonitoringOptions
  extends BaseMonitoringProps {}

export interface CloudFrontDistributionMonitoringProps
  extends CloudFrontDistributionMetricFactoryProps,
    CloudFrontDistributionMonitoringOptions {
  // empty
}

export class CloudFrontDistributionMonitoring extends Monitoring {
  private readonly title: string;
  private readonly distributionUrl?: string;

  protected readonly tpsMetric: MetricWithAlarmSupport;
  protected readonly downloadedBytesMetric: MetricWithAlarmSupport;
  protected readonly uploadedBytesMetric: MetricWithAlarmSupport;
  protected readonly cacheHitRate: MetricWithAlarmSupport;
  protected readonly error4xxRate: MetricWithAlarmSupport;
  protected readonly error5xxRate: MetricWithAlarmSupport;

  constructor(
    scope: MonitoringScope,
    props: CloudFrontDistributionMonitoringProps
  ) {
    super(scope);

    const namedConstruct = props.distribution;
    const fallbackConstructName = namedConstruct.distributionId;

    const namingStrategy = new MonitoringNamingStrategy({
      ...props,
      namedConstruct,
      fallbackConstructName,
    });
    this.title = namingStrategy.resolveHumanReadableName();
    this.distributionUrl = scope
      .createAwsConsoleUrlFactory()
      .getCloudFrontDistributionUrl(namedConstruct.distributionId);

    const metricFactory = new CloudFrontDistributionMetricFactory(
      scope.createMetricFactory(),
      props
    );
    this.tpsMetric = metricFactory.metricRequestTps();
    this.downloadedBytesMetric = metricFactory.metricTotalBytesDownloaded();
    this.uploadedBytesMetric = metricFactory.metricTotalBytesUploaded();
    this.cacheHitRate = metricFactory.metricCacheHitRateAverageInPercent();
    this.error4xxRate = metricFactory.metric4xxErrorRateAverage();
    this.error5xxRate = metricFactory.metric5xxErrorRateAverage();
  }

  summaryWidgets(): IWidget[] {
    return [
      this.createTitleWidget(),
      this.createTpsWidget(HalfWidth, DefaultSummaryWidgetHeight),
      this.createErrorRateWidget(HalfWidth, DefaultSummaryWidgetHeight),
    ];
  }

  widgets(): IWidget[] {
    return [
      this.createTitleWidget(),
      this.createTpsWidget(QuarterWidth, DefaultGraphWidgetHeight),
      this.createCacheWidget(QuarterWidth, DefaultGraphWidgetHeight),
      this.createTrafficWidget(QuarterWidth, DefaultGraphWidgetHeight),
      this.createErrorRateWidget(QuarterWidth, DefaultGraphWidgetHeight),
    ];
  }

  protected createTitleWidget() {
    return new MonitoringHeaderWidget({
      family: "CloudFront Distribution",
      title: this.title,
      goToLinkUrl: this.distributionUrl,
    });
  }

  protected createTpsWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "TPS",
      left: [this.tpsMetric],
      leftYAxis: CountAxisFromZero,
    });
  }

  protected createCacheWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Hit Rate",
      left: [this.cacheHitRate],
      leftYAxis: PercentageAxisFromZeroToHundred,
    });
  }

  protected createTrafficWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Traffic",
      left: [this.downloadedBytesMetric, this.uploadedBytesMetric],
      leftYAxis: SizeAxisBytesFromZero,
    });
  }

  protected createErrorRateWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Errors (rate)",
      left: [this.error4xxRate, this.error5xxRate],
    });
  }
}
