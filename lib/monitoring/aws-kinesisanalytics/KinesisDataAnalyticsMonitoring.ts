import {GraphWidget, HorizontalAnnotation, IWidget} from "aws-cdk-lib/aws-cloudwatch";

import {KinesisDataAnalyticsMetricFactory, KinesisDataAnalyticsMetricFactoryProps} from "./KinesisDataAnalyticsMetricFactory";
import {
    BaseMonitoringProps,
    CountAxisFromZero,
    DefaultGraphWidgetHeight,
    DefaultSummaryWidgetHeight,
    FullRestartCountThreshold,
    KinesisDataAnalyticsAlarmFactory,
    MaxDowntimeThreshold,
    MetricWithAlarmSupport,
    Monitoring,
    MonitoringScope,
    PercentageAxisFromZeroToHundred,
    QuarterWidth,
    SizeAxisBytesFromZero,
    TimeAxisMillisFromZero,
} from "../../common";
import {MonitoringHeaderWidget, MonitoringNamingStrategy} from "../../dashboard";

export interface KinesisDataAnalyticsMonitoringOptions extends BaseMonitoringProps {
    readonly addDowntimeAlarm?: Record<string, MaxDowntimeThreshold>;

    readonly addFullRestartCountAlarm?: Record<string, FullRestartCountThreshold>;
}

export interface KinesisDataAnalyticsMonitoringProps
    extends KinesisDataAnalyticsMetricFactoryProps,
        KinesisDataAnalyticsMonitoringOptions {}

export class KinesisDataAnalyticsMonitoring extends Monitoring {
    readonly title: string;
    readonly kinesisDataAnalyticsUrl?: string;

    readonly kdaAlarmFactory: KinesisDataAnalyticsAlarmFactory;
    readonly downtimeAnnotations: HorizontalAnnotation[];
    readonly fullRestartAnnotations: HorizontalAnnotation[];

    readonly cpuUtilizationPercentMetric: MetricWithAlarmSupport;
    readonly downtimeMsMetric: MetricWithAlarmSupport;
    readonly fullRestartsCountMetric: MetricWithAlarmSupport;
    readonly heapMemoryUtilizationPercentMetric: MetricWithAlarmSupport;
    readonly kpusCountMetric: MetricWithAlarmSupport;
    readonly lastCheckpointDurationMsMetric: MetricWithAlarmSupport;
    readonly lastCheckpointSizeBytesMetric: MetricWithAlarmSupport;
    readonly numberOfFailedCheckpointsCountMetric: MetricWithAlarmSupport;
    readonly oldGenerationGCCountMetric: MetricWithAlarmSupport;
    readonly oldGenerationGCTimeMsMetric: MetricWithAlarmSupport;

    constructor(scope: MonitoringScope, props: KinesisDataAnalyticsMonitoringProps) {
        super(scope, props);

        const namingStrategy = new MonitoringNamingStrategy({
            ...props,
            fallbackConstructName: props.application,
        });
        this.title = namingStrategy.resolveHumanReadableName();
        this.kinesisDataAnalyticsUrl = scope.createAwsConsoleUrlFactory().getKinesisAnalyticsUrl(props.application);

        const alarmFactory = this.createAlarmFactory(namingStrategy.resolveAlarmFriendlyName());
        this.kdaAlarmFactory = new KinesisDataAnalyticsAlarmFactory(alarmFactory);
        this.downtimeAnnotations = [];
        this.fullRestartAnnotations = [];

        const metricFactory = new KinesisDataAnalyticsMetricFactory(scope.createMetricFactory(), props);

        this.cpuUtilizationPercentMetric = metricFactory.metricCpuUtilizationPercent();
        this.downtimeMsMetric = metricFactory.metricDowntimeMs();
        this.fullRestartsCountMetric = metricFactory.metricFullRestartsCount();
        this.heapMemoryUtilizationPercentMetric = metricFactory.metricHeapMemoryUtilizationPercent();
        this.kpusCountMetric = metricFactory.metricKPUsCount();
        this.lastCheckpointDurationMsMetric = metricFactory.metricLastCheckpointDurationMs();
        this.lastCheckpointSizeBytesMetric = metricFactory.metricLastCheckpointSizeBytes();
        this.numberOfFailedCheckpointsCountMetric = metricFactory.metricNumberOfFailedCheckpointsCount();
        this.oldGenerationGCCountMetric = metricFactory.metricOldGenerationGCCount();
        this.oldGenerationGCTimeMsMetric = metricFactory.metricOldGenerationGCTimeMs();

        for (const disambiguator in props.addDowntimeAlarm) {
            const alarmProps = props.addDowntimeAlarm[disambiguator];
            const createdAlarm = this.kdaAlarmFactory.addDowntimeAlarm(this.downtimeMsMetric, alarmProps, disambiguator);
            this.downtimeAnnotations.push(createdAlarm.annotation);
            this.addAlarm(createdAlarm);
        }

        for (const disambiguator in props.addFullRestartCountAlarm) {
            const alarmProps = props.addFullRestartCountAlarm[disambiguator];
            const createdAlarm = this.kdaAlarmFactory.addFullRestartAlarm(this.fullRestartsCountMetric, alarmProps, disambiguator);
            this.fullRestartAnnotations.push(createdAlarm.annotation);
            this.addAlarm(createdAlarm);
        }

        props.useCreatedAlarms?.consume(this.createdAlarms());
    }

    summaryWidgets(): IWidget[] {
        return [this.createTitleWidget(), ...this.createSummaryWidgetRow(DefaultSummaryWidgetHeight)];
    }

    widgets(): IWidget[] {
        return [this.createTitleWidget(), ...this.createSummaryWidgetRow(DefaultGraphWidgetHeight), ...this.createCheckpointAndGcWidgets()];
    }

    createTitleWidget() {
        return new MonitoringHeaderWidget({
            family: "Kinesis Data Analytics",
            title: this.title,
            goToLinkUrl: this.kinesisDataAnalyticsUrl,
        });
    }

    createKPUWidget(width: number, height: number) {
        return new GraphWidget({
            width,
            height,
            title: "KPU Usage",
            left: [this.kpusCountMetric],
            leftYAxis: CountAxisFromZero,
        });
    }

    createResourceUtilizationWidget(width: number, height: number) {
        return new GraphWidget({
            width,
            height,
            title: "Resource Utilization",
            left: [this.cpuUtilizationPercentMetric, this.heapMemoryUtilizationPercentMetric],
            leftYAxis: PercentageAxisFromZeroToHundred,
        });
    }

    createDownTimeWidget(width: number, height: number) {
        return new GraphWidget({
            width,
            height,
            title: "Down Time",
            left: [this.downtimeMsMetric],
            leftYAxis: TimeAxisMillisFromZero,
            leftAnnotations: this.downtimeAnnotations,
        });
    }

    createFullRestartsWidget(width: number, height: number) {
        return new GraphWidget({
            width,
            height,
            title: "Full Restarts",
            left: [this.fullRestartsCountMetric],
            leftYAxis: CountAxisFromZero,
            leftAnnotations: this.fullRestartAnnotations,
        });
    }

    createNumberOfFailedCheckpointsWidget(width: number, height: number) {
        return new GraphWidget({
            width,
            height,
            title: "Checkpoint Failures",
            left: [this.numberOfFailedCheckpointsCountMetric],
            leftYAxis: CountAxisFromZero,
        });
    }

    createLastCheckpointDurationWidget(width: number, height: number) {
        return new GraphWidget({
            width,
            height,
            title: "Checkpoint Duration",
            left: [this.lastCheckpointDurationMsMetric],
            leftYAxis: TimeAxisMillisFromZero,
        });
    }

    createLastCheckpointSizeWidget(width: number, height: number) {
        return new GraphWidget({
            width,
            height,
            title: "Checkpoint Size",
            left: [this.lastCheckpointSizeBytesMetric],
            leftYAxis: SizeAxisBytesFromZero,
        });
    }

    createGarbageCollectionWidget(width: number, height: number) {
        return new GraphWidget({
            width,
            height,
            title: "Garbage Collection",
            left: [this.oldGenerationGCCountMetric],
            leftYAxis: CountAxisFromZero,
            right: [this.oldGenerationGCTimeMsMetric],
            rightYAxis: TimeAxisMillisFromZero,
        });
    }

    private createSummaryWidgetRow(height: number): GraphWidget[] {
        return [
            // KPUs
            this.createKPUWidget(QuarterWidth, height),
            // CPU And Heap Usage
            this.createResourceUtilizationWidget(QuarterWidth, height),
            // Down Time and Up Time
            this.createDownTimeWidget(QuarterWidth, height),
            // Full Restarts
            this.createFullRestartsWidget(QuarterWidth, height),
        ];
    }

    private createCheckpointAndGcWidgets(): GraphWidget[] {
        return [
            // Checkpointing
            this.createNumberOfFailedCheckpointsWidget(QuarterWidth, DefaultGraphWidgetHeight),
            // Checkpoint Duration
            this.createLastCheckpointDurationWidget(QuarterWidth, DefaultGraphWidgetHeight),
            // Checkpoint Size
            this.createLastCheckpointSizeWidget(QuarterWidth, DefaultGraphWidgetHeight),
            // Garbage Collection
            this.createGarbageCollectionWidget(QuarterWidth, DefaultGraphWidgetHeight),
        ];
    }
}
