import {GraphWidget, HorizontalAnnotation, IWidget} from "aws-cdk-lib/aws-cloudwatch";
import {DocumentDbMetricFactory, DocumentDbMetricFactoryProps} from "./DocumentDbMetricFactory";
import {
    BaseMonitoringProps,
    CountAxisFromZero,
    DefaultGraphWidgetHeight,
    DefaultSummaryWidgetHeight,
    LatencyType,
    MetricWithAlarmSupport,
    Monitoring,
    MonitoringScope,
    PercentageAxisFromZeroToHundred,
    QuarterWidth,
    ThirdWidth,
    TimeAxisMillisFromZero,
    UsageAlarmFactory,
    UsageThreshold,
} from "../../common";
import {MonitoringHeaderWidget, MonitoringNamingStrategy} from "../../dashboard";

export interface DocumentDbMonitoringOptions extends BaseMonitoringProps {
    readonly addCpuUsageAlarm?: Record<string, UsageThreshold>;
}

export interface DocumentDbMonitoringProps extends DocumentDbMetricFactoryProps, DocumentDbMonitoringOptions {}

export class DocumentDbMonitoring extends Monitoring {
    readonly title: string;
    readonly url?: string;

    readonly usageAlarmFactory: UsageAlarmFactory;
    readonly usageAnnotations: HorizontalAnnotation[];

    readonly cpuUsageMetric: MetricWithAlarmSupport;
    readonly readLatencyMetric: MetricWithAlarmSupport;
    readonly writeLatencyMetric: MetricWithAlarmSupport;
    readonly connectionsMetric: MetricWithAlarmSupport;
    readonly cursorsMetric: MetricWithAlarmSupport;
    readonly transactionsMetric: MetricWithAlarmSupport;
    readonly throttledMetric: MetricWithAlarmSupport;

    constructor(scope: MonitoringScope, props: DocumentDbMonitoringProps) {
        super(scope, props);

        const metricFactory = new DocumentDbMetricFactory(scope.createMetricFactory(), props);
        this.cpuUsageMetric = metricFactory.metricAverageCpuUsageInPercent();
        this.readLatencyMetric = metricFactory.metricReadLatencyInMillis(LatencyType.P90);
        this.writeLatencyMetric = metricFactory.metricWriteLatencyInMillis(LatencyType.P90);
        this.connectionsMetric = metricFactory.metricMaxConnectionCount();
        this.cursorsMetric = metricFactory.metricMaxCursorCount();
        this.transactionsMetric = metricFactory.metricMaxTransactionOpenCount();
        this.throttledMetric = metricFactory.metricOperationsThrottledDueLowMemoryCount();

        const namingStrategy = new MonitoringNamingStrategy({
            ...props,
            fallbackConstructName: metricFactory.clusterIdentifier,
            namedConstruct: props.cluster,
        });
        this.title = namingStrategy.resolveHumanReadableName();
        this.url = scope.createAwsConsoleUrlFactory().getDocumentDbClusterUrl(metricFactory.clusterIdentifier);
        const alarmFactory = this.createAlarmFactory(namingStrategy.resolveAlarmFriendlyName());

        this.usageAlarmFactory = new UsageAlarmFactory(alarmFactory);
        this.usageAnnotations = [];

        for (const disambiguator in props.addCpuUsageAlarm) {
            const alarmProps = props.addCpuUsageAlarm[disambiguator];
            const createdAlarm = this.usageAlarmFactory.addMaxCpuUsagePercentAlarm(this.cpuUsageMetric, alarmProps, disambiguator);
            this.usageAnnotations.push(createdAlarm.annotation);
            this.addAlarm(createdAlarm);
        }

        props.useCreatedAlarms?.consume(this.createdAlarms());
    }

    summaryWidgets(): IWidget[] {
        return [
            this.createTitleWidget(),
            this.createResourceUsageWidget(ThirdWidth, DefaultSummaryWidgetHeight),
            this.createConnectionsWidget(ThirdWidth, DefaultSummaryWidgetHeight),
            this.createLatencyWidget(ThirdWidth, DefaultSummaryWidgetHeight),
        ];
    }

    widgets(): IWidget[] {
        return [
            this.createTitleWidget(),
            this.createResourceUsageWidget(QuarterWidth, DefaultGraphWidgetHeight),
            this.createConnectionsWidget(QuarterWidth, DefaultGraphWidgetHeight),
            this.createTransactionsWidget(QuarterWidth, DefaultGraphWidgetHeight),
            this.createLatencyWidget(QuarterWidth, DefaultGraphWidgetHeight),
        ];
    }

    createTitleWidget() {
        return new MonitoringHeaderWidget({
            family: "DocumentDB",
            title: this.title,
            goToLinkUrl: this.url,
        });
    }

    createResourceUsageWidget(width: number, height: number) {
        return new GraphWidget({
            width,
            height,
            title: "CPU Usage",
            left: [this.cpuUsageMetric],
            leftYAxis: PercentageAxisFromZeroToHundred,
            leftAnnotations: this.usageAnnotations,
        });
    }

    createConnectionsWidget(width: number, height: number) {
        return new GraphWidget({
            width,
            height,
            title: "Connections",
            left: [this.connectionsMetric],
            leftYAxis: CountAxisFromZero,
        });
    }

    createTransactionsWidget(width: number, height: number) {
        return new GraphWidget({
            width,
            height,
            title: "Transactions",
            left: [this.transactionsMetric, this.cursorsMetric],
            leftYAxis: CountAxisFromZero,
        });
    }

    createLatencyWidget(width: number, height: number) {
        return new GraphWidget({
            width,
            height,
            title: "Latency",
            left: [this.readLatencyMetric, this.writeLatencyMetric],
            leftYAxis: TimeAxisMillisFromZero,
        });
    }
}
