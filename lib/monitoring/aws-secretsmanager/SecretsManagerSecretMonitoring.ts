import {
  GraphWidget,
  HorizontalAnnotation,
  IWidget,
} from "aws-cdk-lib/aws-cloudwatch";
import { IFunction } from "aws-cdk-lib/aws-lambda";

import { SecretsManagerMetricsPublisher } from "./SecretsManagerMetricsPublisher";
import {
  SecretsManagerSecretMetricFactory,
  SecretsManagerSecretMetricFactoryProps,
} from "./SecretsManagerSecretMetricFactory";
import {
  AgeAlarmFactory,
  AlarmFactory,
  BaseMonitoringProps,
  CountAxisFromZero,
  DaysSinceUpdateThreshold,
  DefaultGraphWidgetHeight,
  HalfWidth,
  MetricWithAlarmSupport,
  Monitoring,
  MonitoringScope,
} from "../../common";
import {
  MonitoringHeaderWidget,
  MonitoringNamingStrategy,
} from "../../dashboard";

export interface IPublisherConsumer {
  consume(lambdaFunction: IFunction): void;
}

export interface SecretsManagerSecretMonitoringOptions
  extends BaseMonitoringProps {
  readonly addDaysSinceLastChangeAlarm?: Record<
    string,
    DaysSinceUpdateThreshold
  >;
  readonly addDaysSinceLastRotationAlarm?: Record<
    string,
    DaysSinceUpdateThreshold
  >;

  /**
   * @default - true, if `addDaysSinceLastRotationAlarm` is set, otherwise `false`.
   */
  readonly showLastRotationWidget?: boolean;

  /**
   * Provides access to the underlying metrics publisher Lambda function.
   * This may be useful if you want to monitor the function itself.
   */
  readonly usePublisher?: IPublisherConsumer;
}

/**
 * Monitoring props for Secrets Manager secrets.
 */
export interface SecretsManagerSecretMonitoringProps
  extends SecretsManagerSecretMetricFactoryProps,
    SecretsManagerSecretMonitoringOptions {}

export class SecretsManagerSecretMonitoring extends Monitoring {
  readonly title: string;
  readonly showLastRotationWidget: boolean;
  readonly alarmFactory: AlarmFactory;
  readonly daysSinceLastChangeMetric: MetricWithAlarmSupport;
  readonly daysSinceLastChangeAnnotations: HorizontalAnnotation[];
  readonly daysSinceLastRotationMetric: MetricWithAlarmSupport;
  readonly daysSinceLastRotationAnnotations: HorizontalAnnotation[];

  constructor(
    scope: MonitoringScope,
    props: SecretsManagerSecretMonitoringProps,
  ) {
    super(scope);

    const publisher = SecretsManagerMetricsPublisher.getInstance(scope);
    publisher.addSecret(props.secret);

    const namingStrategy = new MonitoringNamingStrategy({
      ...props,
      namedConstruct: props.secret,
      fallbackConstructName: props.secret.secretName,
    });

    this.title = namingStrategy.resolveHumanReadableName();
    this.showLastRotationWidget = !!(
      props.showLastRotationWidget || props.addDaysSinceLastRotationAlarm
    );
    const metricFactory = new SecretsManagerSecretMetricFactory(
      scope.createMetricFactory(),
      props,
    );
    this.daysSinceLastChangeMetric = metricFactory.metricDaysSinceLastChange();
    this.daysSinceLastRotationMetric =
      metricFactory.metricDaysSinceLastRotation();

    this.alarmFactory = this.createAlarmFactory(
      namingStrategy.resolveAlarmFriendlyName(),
    );
    const ageAlarmFactory = new AgeAlarmFactory(this.alarmFactory);
    this.daysSinceLastChangeAnnotations = [];
    this.daysSinceLastRotationAnnotations = [];

    for (const disambiguator in props.addDaysSinceLastChangeAlarm) {
      const alarmProps = props.addDaysSinceLastChangeAlarm[disambiguator];
      const createdAlarm = ageAlarmFactory.addDaysSinceUpdateAlarm(
        this.daysSinceLastChangeMetric,
        alarmProps,
        disambiguator,
      );
      this.daysSinceLastChangeAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }

    for (const disambiguator in props.addDaysSinceLastRotationAlarm) {
      const alarmProps = props.addDaysSinceLastRotationAlarm[disambiguator];
      const createdAlarm = ageAlarmFactory.addDaysSinceUpdateAlarm(
        this.daysSinceLastRotationMetric,
        alarmProps,
        disambiguator,
      );
      this.daysSinceLastRotationAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }

    props.useCreatedAlarms?.consume(this.createdAlarms());
    props.usePublisher?.consume(publisher.lambda);
  }

  createDaysSinceLastChangeWidget() {
    return new GraphWidget({
      width: HalfWidth,
      height: DefaultGraphWidgetHeight,
      title: "Days since last change",
      left: [this.daysSinceLastChangeMetric],
      leftYAxis: CountAxisFromZero,
      leftAnnotations: this.daysSinceLastChangeAnnotations,
    });
  }

  createDaysSinceLastRotationWidget() {
    return new GraphWidget({
      width: HalfWidth,
      height: DefaultGraphWidgetHeight,
      title: "Days since last rotation",
      left: [this.daysSinceLastRotationMetric],
      leftYAxis: CountAxisFromZero,
      leftAnnotations: this.daysSinceLastRotationAnnotations,
    });
  }

  createTitleWidget() {
    return new MonitoringHeaderWidget({
      family: "Secret",
      title: this.title,
    });
  }

  widgets(): IWidget[] {
    const widgets = [
      this.createTitleWidget(),
      this.createDaysSinceLastChangeWidget(),
    ];

    if (this.showLastRotationWidget) {
      widgets.push(this.createDaysSinceLastRotationWidget());
    }

    return widgets;
  }

  summaryWidgets(): IWidget[] {
    // TODO verify dimensions, mainly height
    return this.widgets();
  }
}
