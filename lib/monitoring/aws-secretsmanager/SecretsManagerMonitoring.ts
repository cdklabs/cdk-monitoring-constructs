import {
  GraphWidget,
  HorizontalAnnotation,
  IWidget,
} from "aws-cdk-lib/aws-cloudwatch";
import { SecretsManagerMetricFactory } from "./SecretsManagerMetricFactory";
import {
  BaseMonitoringProps,
  ChangeInSecretCountThreshold,
  CountAxisFromZero,
  DefaultGraphWidgetHeight,
  DefaultSummaryWidgetHeight,
  HalfWidth,
  MaxSecretCountThreshold,
  MetricWithAlarmSupport,
  MinSecretCountThreshold,
  Monitoring,
  MonitoringScope,
  SecretsManagerAlarmFactory,
  ThirdWidth,
} from "../../common";
import {
  MonitoringHeaderWidget,
  MonitoringNamingStrategy,
} from "../../dashboard";

export interface SecretsManagerMonitoringOptions extends BaseMonitoringProps {
  readonly addMinNumberSecretsAlarm?: Record<string, MinSecretCountThreshold>;
  readonly addMaxNumberSecretsAlarm?: Record<string, MaxSecretCountThreshold>;
  readonly addChangeInSecretsAlarm?: Record<
    string,
    ChangeInSecretCountThreshold
  >;
}

export interface SecretsManagerMonitoringProps
  extends SecretsManagerMonitoringOptions {}

export class SecretsManagerMonitoring extends Monitoring {
  readonly title: string;

  readonly secretsManagerAlarmFactory: SecretsManagerAlarmFactory;
  readonly secretsCountAnnotation: HorizontalAnnotation[];

  readonly secretsCountMetric: MetricWithAlarmSupport;

  constructor(scope: MonitoringScope, props: SecretsManagerMonitoringProps) {
    super(scope);

    const namingStrategy = new MonitoringNamingStrategy({
      ...props,
      fallbackConstructName: "SecretsManager",
    });

    this.title = namingStrategy.resolveHumanReadableName();

    const alarmFactory = this.createAlarmFactory(
      namingStrategy.resolveAlarmFriendlyName(),
    );
    this.secretsManagerAlarmFactory = new SecretsManagerAlarmFactory(
      alarmFactory,
    );
    this.secretsCountAnnotation = [];

    const metricFactory = new SecretsManagerMetricFactory(
      scope.createMetricFactory(),
      props,
    );
    this.secretsCountMetric = metricFactory.metricSecretCount();

    for (const disambiguator in props.addMaxNumberSecretsAlarm) {
      const alarmProps = props.addMaxNumberSecretsAlarm[disambiguator];
      const createdAlarm =
        this.secretsManagerAlarmFactory.addMaxSecretCountAlarm(
          this.secretsCountMetric,
          alarmProps,
          disambiguator,
        );
      this.secretsCountAnnotation.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }

    for (const disambiguator in props.addMinNumberSecretsAlarm) {
      const alarmProps = props.addMinNumberSecretsAlarm[disambiguator];
      const createdAlarm =
        this.secretsManagerAlarmFactory.addMinSecretCountAlarm(
          this.secretsCountMetric,
          alarmProps,
          disambiguator,
        );
      this.secretsCountAnnotation.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }

    for (const disambiguator in props.addChangeInSecretsAlarm) {
      const alarmProps = props.addChangeInSecretsAlarm[disambiguator];
      const createdAlarm =
        this.secretsManagerAlarmFactory.addChangeInSecretCountAlarm(
          this.secretsCountMetric,
          alarmProps,
          disambiguator,
        );
      this.secretsCountAnnotation.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }
    props.useCreatedAlarms?.consume(this.createdAlarms());
  }

  summaryWidgets(): IWidget[] {
    return [
      this.createTitleWidget(),
      this.createSecretsCountWidget(HalfWidth, DefaultSummaryWidgetHeight),
    ];
  }

  widgets(): IWidget[] {
    return [
      this.createTitleWidget(),
      this.createSecretsCountWidget(ThirdWidth, DefaultGraphWidgetHeight),
    ];
  }

  createTitleWidget() {
    return new MonitoringHeaderWidget({
      family: "Secrets Manager Secrets",
      title: this.title,
    });
  }

  createSecretsCountWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Secret Count",
      left: [this.secretsCountMetric],
      leftYAxis: CountAxisFromZero,
      leftAnnotations: this.secretsCountAnnotation,
    });
  }
}
