import {GraphWidget, HorizontalAnnotation, IWidget} from "aws-cdk-lib/aws-cloudwatch";
import {WafV2MetricFactory, WafV2MetricFactoryProps} from "./WafV2MetricFactory";
import {
    AlarmFactory,
    BaseMonitoringProps,
    CountAxisFromZero,
    DefaultGraphWidgetHeight,
    DefaultSummaryWidgetHeight,
    ErrorAlarmFactory,
    ErrorCountThreshold,
    ErrorRateThreshold,
    ErrorType,
    MetricWithAlarmSupport,
    Monitoring,
    MonitoringScope,
    RateAxisFromZero,
    ThirdWidth,
} from "../../common";
import {MonitoringHeaderWidget, MonitoringNamingStrategy} from "../../dashboard";

export interface WafV2MonitoringOptions extends BaseMonitoringProps {}

export interface WafV2MonitoringProps extends WafV2MetricFactoryProps, WafV2MonitoringOptions {
    readonly addBlockedRequestsCountAlarm?: Record<string, ErrorCountThreshold>;
    readonly addBlockedRequestsRateAlarm?: Record<string, ErrorRateThreshold>;
}

/**
 * Monitoring for AWS Web Application Firewall.
 *
 * @see https://docs.aws.amazon.com/waf/latest/developerguide/monitoring-cloudwatch.html
 */
export class WafV2Monitoring extends Monitoring {
    readonly humanReadableName: string;

    readonly alarmFactory: AlarmFactory;
    readonly errorAlarmFactory: ErrorAlarmFactory;

    readonly errorCountAnnotations: HorizontalAnnotation[];
    readonly errorRateAnnotations: HorizontalAnnotation[];

    readonly allowedRequestsMetric: MetricWithAlarmSupport;
    readonly blockedRequestsMetric: MetricWithAlarmSupport;
    readonly blockedRequestsRateMetric: MetricWithAlarmSupport;

    constructor(scope: MonitoringScope, props: WafV2MonitoringProps) {
        super(scope, props);

        const namingStrategy = new MonitoringNamingStrategy({
            ...props,
            namedConstruct: props.acl,
        });
        this.humanReadableName = namingStrategy.resolveHumanReadableName();

        this.alarmFactory = this.createAlarmFactory(namingStrategy.resolveAlarmFriendlyName());

        this.errorAlarmFactory = new ErrorAlarmFactory(this.alarmFactory);

        this.errorCountAnnotations = [];
        this.errorRateAnnotations = [];

        const metricFactory = new WafV2MetricFactory(scope.createMetricFactory(), props);

        this.allowedRequestsMetric = metricFactory.metricAllowedRequests();
        this.blockedRequestsMetric = metricFactory.metricBlockedRequests();
        this.blockedRequestsRateMetric = metricFactory.metricBlockedRequestsRate();

        for (const disambiguator in props.addBlockedRequestsCountAlarm) {
            const alarmProps = props.addBlockedRequestsCountAlarm[disambiguator];
            const createdAlarm = this.errorAlarmFactory.addErrorCountAlarm(
                this.blockedRequestsMetric,
                ErrorType.BLOCKED,
                alarmProps,
                disambiguator,
            );
            this.errorCountAnnotations.push(createdAlarm.annotation);
            this.addAlarm(createdAlarm);
        }
        for (const disambiguator in props.addBlockedRequestsRateAlarm) {
            const alarmProps = props.addBlockedRequestsRateAlarm[disambiguator];
            const createdAlarm = this.errorAlarmFactory.addErrorRateAlarm(
                this.blockedRequestsRateMetric,
                ErrorType.BLOCKED,
                alarmProps,
                disambiguator,
            );
            this.errorRateAnnotations.push(createdAlarm.annotation);
            this.addAlarm(createdAlarm);
        }

        props.useCreatedAlarms?.consume(this.createdAlarms());
    }

    summaryWidgets(): IWidget[] {
        return [
            this.createTitleWidget(),
            this.createAllowedRequestsWidget(ThirdWidth, DefaultSummaryWidgetHeight),
            this.createBlockedRequestsWidget(ThirdWidth, DefaultSummaryWidgetHeight),
            this.createBlockedRequestsRateWidget(ThirdWidth, DefaultSummaryWidgetHeight),
        ];
    }

    widgets(): IWidget[] {
        return [
            this.createTitleWidget(),
            this.createAllowedRequestsWidget(ThirdWidth, DefaultGraphWidgetHeight),
            this.createBlockedRequestsWidget(ThirdWidth, DefaultGraphWidgetHeight),
            this.createBlockedRequestsRateWidget(ThirdWidth, DefaultGraphWidgetHeight),
        ];
    }

    createTitleWidget() {
        return new MonitoringHeaderWidget({
            family: "Web Application Firewall",
            title: this.humanReadableName,
        });
    }

    createAllowedRequestsWidget(width: number, height: number) {
        return new GraphWidget({
            width,
            height,
            title: "Allowed Requests",
            left: [this.allowedRequestsMetric],
            leftYAxis: CountAxisFromZero,
        });
    }

    createBlockedRequestsWidget(width: number, height: number) {
        return new GraphWidget({
            width,
            height,
            title: "Blocked Requests",
            left: [this.blockedRequestsMetric],
            leftAnnotations: this.errorCountAnnotations,
            leftYAxis: CountAxisFromZero,
        });
    }

    createBlockedRequestsRateWidget(width: number, height: number) {
        return new GraphWidget({
            width,
            height,
            title: "Blocked Requests (rate)",
            left: [this.blockedRequestsRateMetric],
            leftAnnotations: this.errorRateAnnotations,
            leftYAxis: RateAxisFromZero,
        });
    }
}
