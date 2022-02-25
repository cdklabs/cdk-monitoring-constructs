import {
  GraphWidget,
  HorizontalAnnotation,
  IWidget,
} from "monocdk/aws-cloudwatch";

import {
  AgeAlarmFactory,
  BaseMonitoringProps,
  CountAxisFromZero,
  DaysToExpiryThreshold,
  DefaultGraphWidgetHeight,
  MetricWithAlarmSupport,
  Monitoring,
  MonitoringScope,
  QuarterWidth,
} from "../../common";
import {
  MonitoringHeaderWidget,
  MonitoringNamingStrategy,
} from "../../dashboard";
import {
  CertificateManagerMetricFactory,
  CertificateManagerMetricFactoryProps,
} from "./CertificateManagerMetricFactory";

export interface CertificateManagerMonitoringProps
  extends BaseMonitoringProps,
    CertificateManagerMetricFactoryProps {
  readonly addDaysToExpiryAlarm?: Record<string, DaysToExpiryThreshold>;
}

export class CertificateManagerMonitoring extends Monitoring {
  protected readonly title: string;

  protected readonly daysToExpiryAnnotations: HorizontalAnnotation[];
  protected readonly daysToExpiryMetric: MetricWithAlarmSupport;

  constructor(
    scope: MonitoringScope,
    props: CertificateManagerMonitoringProps
  ) {
    super(scope, props);

    const namingStrategy = new MonitoringNamingStrategy({ ...props });
    this.title = namingStrategy.resolveHumanReadableName();

    const metricFactory = new CertificateManagerMetricFactory(
      scope.createMetricFactory(),
      props
    );
    const alarmFactory = this.createAlarmFactory(
      namingStrategy.resolveAlarmFriendlyName()
    );
    const ageAlarmFactory = new AgeAlarmFactory(alarmFactory);
    this.daysToExpiryAnnotations = [];
    this.daysToExpiryMetric = metricFactory.metricDaysToExpiry();

    for (const disambiguator in props.addDaysToExpiryAlarm) {
      const alarmProps = props.addDaysToExpiryAlarm[disambiguator];
      const createdAlarm = ageAlarmFactory.addDaysToExpiryAlarm(
        this.daysToExpiryMetric,
        alarmProps,
        disambiguator
      );
      this.daysToExpiryAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }

    props.useCreatedAlarms?.consume(this.createdAlarms());
  }

  summaryWidgets(): IWidget[] {
    return [];
  }

  widgets(): IWidget[] {
    return [
      this.createTitleWidget(),
      this.createDaysToExpiryWidget(QuarterWidth, DefaultGraphWidgetHeight),
    ];
  }

  protected createTitleWidget() {
    return new MonitoringHeaderWidget({
      family: "Certificate",
      title: this.title,
    });
  }

  protected createDaysToExpiryWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Expiration",
      left: [this.daysToExpiryMetric],
      leftAnnotations: this.daysToExpiryAnnotations,
      leftYAxis: CountAxisFromZero,
    });
  }
}
