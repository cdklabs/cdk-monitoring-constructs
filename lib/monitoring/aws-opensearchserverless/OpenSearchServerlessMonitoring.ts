import type { HorizontalAnnotation, IWidget } from "aws-cdk-lib/aws-cloudwatch";
import { GraphWidget, Row } from "aws-cdk-lib/aws-cloudwatch";

import type { OpenSearchServerlessMetricFactoryProps } from "./OpenSearchServerlessMetricFactory";
import { OpenSearchServerlessMetricFactory } from "./OpenSearchServerlessMetricFactory";
import {
  BaseMonitoringProps,
  Monitoring,
  LatencyThreshold,
  ErrorCountThreshold,
  ErrorRateThreshold,
  AlarmFactory,
  LatencyAlarmFactory,
  ErrorAlarmFactory,
  MetricWithAlarmSupport,
  MonitoringScope,
  LatencyType,
  ErrorType,
  ThirdWidth,
  DefaultGraphWidgetHeight,
  HalfWidth,
  TimeAxisMillisFromZero,
  CountAxisFromZero,
  RateAxisFromZero,
} from "../../common";
import {
  MonitoringNamingStrategy,
  MonitoringHeaderWidget,
} from "../../dashboard";

export interface OpenSearchServerlessMonitoringOptions
  extends BaseMonitoringProps {
  readonly addSearchLatencyP100Alarm?: Record<string, LatencyThreshold>;
  readonly addSearchErrorCountAlarm?: Record<string, ErrorCountThreshold>;

  readonly add4xxCountAlarm?: Record<string, ErrorCountThreshold>;
  readonly add4xxRateAlarm?: Record<string, ErrorRateThreshold>;
  readonly add5xxCountAlarm?: Record<string, ErrorCountThreshold>;
  readonly add5xxRateAlarm?: Record<string, ErrorRateThreshold>;
}

export interface OpenSearchServerlessMonitoringProps
  extends OpenSearchServerlessMetricFactoryProps,
    OpenSearchServerlessMonitoringOptions {}

/**
 * @experimental This is subject to change if an L2 construct becomes available.
 */
export class OpenSearchServerlessMonitoring extends Monitoring {
  readonly title: string;
  readonly collectionUrl?: string;

  readonly alarmFactory: AlarmFactory;
  readonly latencyAlarmFactory: LatencyAlarmFactory;
  readonly errorAlarmFactory: ErrorAlarmFactory;

  readonly searchLatencyAnnotations: HorizontalAnnotation[];
  readonly errorCountAnnotations: HorizontalAnnotation[];
  readonly errorRateAnnotations: HorizontalAnnotation[];

  readonly metricSearchRequestErrorsCount: MetricWithAlarmSupport;
  readonly metricSearchRequestLatencyAvg: MetricWithAlarmSupport;
  readonly metricSearchRequestLatencyMax: MetricWithAlarmSupport;

  readonly metricIngestionRequestSuccessCount: MetricWithAlarmSupport;
  readonly metricIngestionRequestErrorsCount: MetricWithAlarmSupport;
  readonly metricIngestionRequestLatencyAvg: MetricWithAlarmSupport;
  readonly metricIngestionRequestLatencyMax: MetricWithAlarmSupport;

  readonly metric4xxErrorCount: MetricWithAlarmSupport;
  readonly metric4xxErrorRate: MetricWithAlarmSupport;

  readonly metric5xxErrorCount: MetricWithAlarmSupport;
  readonly metric5xxErrorRate: MetricWithAlarmSupport;

  constructor(
    scope: MonitoringScope,
    props: OpenSearchServerlessMonitoringProps,
  ) {
    super(scope, props);

    const namingStrategy = new MonitoringNamingStrategy({
      ...props,
      fallbackConstructName: props.collection.name,
    });
    this.title = namingStrategy.resolveHumanReadableName();
    this.collectionUrl = scope
      .createAwsConsoleUrlFactory()
      .getOpenSearchServerlessCollectionUrl(props.collection.name);

    this.alarmFactory = this.createAlarmFactory(
      namingStrategy.resolveAlarmFriendlyName(),
    );

    this.latencyAlarmFactory = new LatencyAlarmFactory(this.alarmFactory);
    this.errorAlarmFactory = new ErrorAlarmFactory(this.alarmFactory);

    this.searchLatencyAnnotations = [];
    this.errorCountAnnotations = [];
    this.errorRateAnnotations = [];

    const metricFactory = new OpenSearchServerlessMetricFactory(
      scope.createMetricFactory(),
      props,
    );

    this.metricSearchRequestErrorsCount =
      metricFactory.metricSearchRequestErrors();
    this.metricSearchRequestLatencyAvg =
      metricFactory.metricSearchRequestLatency(LatencyType.AVERAGE);
    this.metricSearchRequestLatencyMax =
      metricFactory.metricSearchRequestLatency(LatencyType.MAX);

    this.metricIngestionRequestSuccessCount =
      metricFactory.metricIngestionRequestSuccess();
    this.metricIngestionRequestErrorsCount =
      metricFactory.metricIngestionRequestErrors();
    this.metricIngestionRequestLatencyAvg =
      metricFactory.metricIngestionRequestLatency(LatencyType.AVERAGE);
    this.metricIngestionRequestLatencyMax =
      metricFactory.metricIngestionRequestLatency(LatencyType.MAX);

    this.metric4xxErrorCount = metricFactory.metric4xxCount();
    this.metric4xxErrorRate = metricFactory.metric4xxRate();

    this.metric5xxErrorCount = metricFactory.metric5xxCount();
    this.metric5xxErrorRate = metricFactory.metric5xxRate();

    for (const disambiguator in props.addSearchLatencyP100Alarm) {
      const alarmProps = props.addSearchLatencyP100Alarm[disambiguator];
      const createdAlarm = this.latencyAlarmFactory.addLatencyAlarm(
        this.metricSearchRequestLatencyMax,
        LatencyType.P100,
        alarmProps,
        disambiguator,
      );
      this.searchLatencyAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }

    for (const disambiguator in props.addSearchErrorCountAlarm) {
      const alarmProps = props.addSearchErrorCountAlarm[disambiguator];
      const createdAlarm = this.errorAlarmFactory.addErrorCountAlarm(
        this.metricSearchRequestErrorsCount,
        ErrorType.ERROR,
        alarmProps,
        disambiguator,
      );
      this.errorCountAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }

    for (const disambiguator in props.add4xxCountAlarm) {
      const alarmProps = props.add4xxCountAlarm[disambiguator];
      const createdAlarm = this.errorAlarmFactory.addErrorCountAlarm(
        this.metric4xxErrorCount,
        ErrorType.USER_ERROR,
        alarmProps,
        disambiguator,
      );
      this.errorCountAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }

    for (const disambiguator in props.add4xxRateAlarm) {
      const alarmProps = props.add4xxRateAlarm[disambiguator];
      const createdAlarm = this.errorAlarmFactory.addErrorRateAlarm(
        this.metric4xxErrorRate,
        ErrorType.USER_ERROR,
        alarmProps,
        disambiguator,
      );
      this.errorRateAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }

    for (const disambiguator in props.add5xxCountAlarm) {
      const alarmProps = props.add5xxCountAlarm[disambiguator];
      const createdAlarm = this.errorAlarmFactory.addErrorCountAlarm(
        this.metric5xxErrorCount,
        ErrorType.FAULT,
        alarmProps,
        disambiguator,
      );
      this.errorCountAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }

    for (const disambiguator in props.add5xxRateAlarm) {
      const alarmProps = props.add5xxRateAlarm[disambiguator];
      const createdAlarm = this.errorAlarmFactory.addErrorRateAlarm(
        this.metric5xxErrorRate,
        ErrorType.FAULT,
        alarmProps,
        disambiguator,
      );
      this.errorRateAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }

    props.useCreatedAlarms?.consume(this.createdAlarms());
  }

  summaryWidgets(): IWidget[] {
    return this.widgets();
  }

  widgets(): IWidget[] {
    return [
      this.createTitleWidget(),
      new Row(
        this.createSearchRequestLatencyWidget(
          ThirdWidth,
          DefaultGraphWidgetHeight,
        ),
        this.createErrorCountWidget(ThirdWidth, DefaultGraphWidgetHeight),
        this.createErrorRateWidget(ThirdWidth, DefaultGraphWidgetHeight),
      ),
      new Row(
        this.createIngestionRequestsWidget(HalfWidth, DefaultGraphWidgetHeight),
        this.createIngestionLatencyWidget(HalfWidth, DefaultGraphWidgetHeight),
      ),
    ];
  }

  protected createTitleWidget(): IWidget {
    return new MonitoringHeaderWidget({
      family: "OpenSearch Serverless Collection",
      title: this.title,
      goToLinkUrl: this.collectionUrl,
    });
  }

  protected createSearchRequestLatencyWidget(
    width: number,
    height: number,
  ): IWidget {
    return new GraphWidget({
      width,
      height,
      title: "Search request latency",
      left: [
        this.metricSearchRequestLatencyAvg,
        this.metricSearchRequestLatencyMax,
      ],
      leftYAxis: TimeAxisMillisFromZero,
      leftAnnotations: this.searchLatencyAnnotations,
    });
  }

  protected createErrorCountWidget(width: number, height: number): IWidget {
    return new GraphWidget({
      width,
      height,
      title: "Errors",
      left: [
        this.metric4xxErrorCount,
        this.metric5xxErrorCount,
        this.metricSearchRequestErrorsCount,
      ],
      leftYAxis: CountAxisFromZero,
      leftAnnotations: this.errorCountAnnotations,
    });
  }

  protected createErrorRateWidget(width: number, height: number): IWidget {
    return new GraphWidget({
      width,
      height,
      title: "Errors (rate)",
      left: [this.metric4xxErrorRate, this.metric5xxErrorRate],
      leftYAxis: RateAxisFromZero,
      leftAnnotations: this.errorRateAnnotations,
    });
  }

  protected createIngestionRequestsWidget(
    width: number,
    height: number,
  ): IWidget {
    return new GraphWidget({
      width,
      height,
      title: "Ingestion requests",
      left: [
        this.metricIngestionRequestSuccessCount,
        this.metricIngestionRequestErrorsCount,
      ],
      leftYAxis: CountAxisFromZero,
    });
  }

  protected createIngestionLatencyWidget(
    width: number,
    height: number,
  ): IWidget {
    return new GraphWidget({
      width,
      height,
      title: "Ingestion latency",
      left: [
        this.metricIngestionRequestLatencyAvg,
        this.metricIngestionRequestLatencyMax,
      ],
      leftYAxis: TimeAxisMillisFromZero,
    });
  }
}
