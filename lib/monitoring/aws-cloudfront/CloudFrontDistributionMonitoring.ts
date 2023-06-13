import {GraphWidget, HorizontalAnnotation, IWidget} from "aws-cdk-lib/aws-cloudwatch";

import {CloudFrontDistributionMetricFactory, CloudFrontDistributionMetricFactoryProps} from "./CloudFrontDistributionMetricFactory";
import {
    AlarmFactory,
    BaseMonitoringProps,
    DefaultGraphWidgetHeight,
    DefaultSummaryWidgetHeight,
    ErrorAlarmFactory,
    ErrorRateThreshold,
    ErrorType,
    HalfWidth,
    HighTpsThreshold,
    LowTpsThreshold,
    MetricWithAlarmSupport,
    Monitoring,
    MonitoringScope,
    PercentageAxisFromZeroToHundred,
    QuarterWidth,
    RateAxisFromZero,
    SizeAxisBytesFromZero,
    ThirdWidth,
    TpsAlarmFactory,
} from "../../common";
import {MonitoringHeaderWidget, MonitoringNamingStrategy} from "../../dashboard";

export interface CloudFrontDistributionMonitoringOptions extends BaseMonitoringProps {}

export interface CloudFrontDistributionMonitoringProps
    extends CloudFrontDistributionMetricFactoryProps,
        CloudFrontDistributionMonitoringOptions {
    readonly addError4xxRate?: Record<string, ErrorRateThreshold>;
    readonly addFault5xxRate?: Record<string, ErrorRateThreshold>;

    readonly addLowTpsAlarm?: Record<string, LowTpsThreshold>;
    readonly addHighTpsAlarm?: Record<string, HighTpsThreshold>;
}

export class CloudFrontDistributionMonitoring extends Monitoring {
    readonly title: string;
    readonly distributionUrl?: string;

    readonly namingStrategy: MonitoringNamingStrategy;
    readonly alarmFactory: AlarmFactory;
    readonly errorAlarmFactory: ErrorAlarmFactory;
    readonly tpsAlarmFactory: TpsAlarmFactory;

    readonly errorRateAnnotations: HorizontalAnnotation[];
    readonly tpsAnnotations: HorizontalAnnotation[];

    readonly tpsMetric: MetricWithAlarmSupport;
    readonly downloadedBytesMetric: MetricWithAlarmSupport;
    readonly uploadedBytesMetric: MetricWithAlarmSupport;
    readonly error4xxRate: MetricWithAlarmSupport;
    readonly error5xxRate: MetricWithAlarmSupport;

    readonly additionalMetricsEnabled: boolean;
    readonly cacheHitRate: MetricWithAlarmSupport | undefined;

    constructor(scope: MonitoringScope, props: CloudFrontDistributionMonitoringProps) {
        super(scope);

        const namedConstruct = props.distribution;
        const fallbackConstructName = namedConstruct.distributionId;

        this.namingStrategy = new MonitoringNamingStrategy({
            ...props,
            namedConstruct,
            fallbackConstructName,
        });
        this.title = this.namingStrategy.resolveHumanReadableName();
        this.distributionUrl = scope.createAwsConsoleUrlFactory().getCloudFrontDistributionUrl(namedConstruct.distributionId);

        this.alarmFactory = this.createAlarmFactory(this.namingStrategy.resolveAlarmFriendlyName());
        this.errorAlarmFactory = new ErrorAlarmFactory(this.alarmFactory);
        this.tpsAlarmFactory = new TpsAlarmFactory(this.alarmFactory);

        this.errorRateAnnotations = [];
        this.tpsAnnotations = [];

        const metricFactory = new CloudFrontDistributionMetricFactory(scope.createMetricFactory(), props);
        this.tpsMetric = metricFactory.metricRequestTps();
        this.downloadedBytesMetric = metricFactory.metricTotalBytesDownloaded();
        this.uploadedBytesMetric = metricFactory.metricTotalBytesUploaded();
        this.error4xxRate = metricFactory.metric4xxErrorRateAverage();
        this.error5xxRate = metricFactory.metric5xxErrorRateAverage();

        this.additionalMetricsEnabled = props.additionalMetricsEnabled ?? true;
        if (this.additionalMetricsEnabled) {
            this.cacheHitRate = metricFactory.metricCacheHitRateAverageInPercent();
        }

        for (const disambiguator in props.addLowTpsAlarm) {
            const alarmProps = props.addLowTpsAlarm[disambiguator];
            const createdAlarm = this.tpsAlarmFactory.addMinTpsAlarm(this.tpsMetric, alarmProps, disambiguator);
            this.tpsAnnotations.push(createdAlarm.annotation);
            this.addAlarm(createdAlarm);
        }
        for (const disambiguator in props.addHighTpsAlarm) {
            const alarmProps = props.addHighTpsAlarm[disambiguator];
            const createdAlarm = this.tpsAlarmFactory.addMaxTpsAlarm(this.tpsMetric, alarmProps, disambiguator);
            this.tpsAnnotations.push(createdAlarm.annotation);
            this.addAlarm(createdAlarm);
        }
        for (const disambiguator in props.addError4xxRate) {
            const alarmProps = props.addError4xxRate[disambiguator];
            const createdAlarm = this.errorAlarmFactory.addErrorRateAlarm(this.error4xxRate, ErrorType.ERROR, alarmProps, disambiguator);
            this.errorRateAnnotations.push(createdAlarm.annotation);
            this.addAlarm(createdAlarm);
        }
        for (const disambiguator in props.addFault5xxRate) {
            const alarmProps = props.addFault5xxRate[disambiguator];
            const createdAlarm = this.errorAlarmFactory.addErrorRateAlarm(this.error5xxRate, ErrorType.FAULT, alarmProps, disambiguator);
            this.errorRateAnnotations.push(createdAlarm.annotation);
            this.addAlarm(createdAlarm);
        }

        if (props.useCreatedAlarms) {
            props.useCreatedAlarms.consume(this.createdAlarms());
        }
    }

    summaryWidgets(): IWidget[] {
        return [
            this.createTitleWidget(),
            this.createTpsWidget(HalfWidth, DefaultSummaryWidgetHeight),
            this.createErrorRateWidget(HalfWidth, DefaultSummaryWidgetHeight),
        ];
    }

    widgets(): IWidget[] {
        if (this.additionalMetricsEnabled) {
            return [
                this.createTitleWidget(),
                this.createTpsWidget(QuarterWidth, DefaultGraphWidgetHeight),
                this.createCacheWidget(QuarterWidth, DefaultGraphWidgetHeight),
                this.createTrafficWidget(QuarterWidth, DefaultGraphWidgetHeight),
                this.createErrorRateWidget(QuarterWidth, DefaultGraphWidgetHeight),
            ];
        } else {
            return [
                this.createTitleWidget(),
                this.createTpsWidget(ThirdWidth, DefaultGraphWidgetHeight),
                this.createTrafficWidget(ThirdWidth, DefaultGraphWidgetHeight),
                this.createErrorRateWidget(ThirdWidth, DefaultGraphWidgetHeight),
            ];
        }
    }

    createTitleWidget() {
        return new MonitoringHeaderWidget({
            family: "CloudFront Distribution",
            title: this.title,
            goToLinkUrl: this.distributionUrl,
        });
    }

    createTpsWidget(width: number, height: number) {
        return new GraphWidget({
            width,
            height,
            title: "TPS",
            left: [this.tpsMetric],
            leftYAxis: RateAxisFromZero,
            leftAnnotations: this.tpsAnnotations,
        });
    }

    createCacheWidget(width: number, height: number) {
        return new GraphWidget({
            width,
            height,
            title: "Hit Rate",
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            left: [this.cacheHitRate!],
            leftYAxis: PercentageAxisFromZeroToHundred,
        });
    }

    createTrafficWidget(width: number, height: number) {
        return new GraphWidget({
            width,
            height,
            title: "Traffic",
            left: [this.downloadedBytesMetric, this.uploadedBytesMetric],
            leftYAxis: SizeAxisBytesFromZero,
        });
    }

    createErrorRateWidget(width: number, height: number) {
        return new GraphWidget({
            width,
            height,
            title: "Errors (rate)",
            left: [this.error4xxRate, this.error5xxRate],
            leftAnnotations: this.errorRateAnnotations,
            leftYAxis: RateAxisFromZero,
        });
    }
}
