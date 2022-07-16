import { IWidget } from "aws-cdk-lib/aws-cloudwatch";

import {
  IDashboardSegment,
  MonitoringDashboardsOverrideProps,
  UserProvidedNames,
} from "../../dashboard";
import { AlarmWithAnnotation } from "../alarm";
import { MonitoringScope } from "./MonitoringScope";

/**
 * An independent unit of monitoring. This is the base for all monitoring classes with alarm support.
 */
export abstract class Monitoring implements IDashboardSegment {
  protected readonly scope: MonitoringScope;
  protected readonly alarms: AlarmWithAnnotation[];
  protected readonly localAlarmNamePrefixOverride?: string;

  protected constructor(scope: MonitoringScope, props?: BaseMonitoringProps) {
    this.scope = scope;
    this.alarms = [];
    this.localAlarmNamePrefixOverride = props?.localAlarmNamePrefixOverride;
  }

  /**
   * Creates a new widget factory.
   */
  createWidgetFactory() {
    return this.scope.createWidgetFactory();
  }

  /**
   * Creates a new metric factory.
   */
  createMetricFactory() {
    return this.scope.createMetricFactory();
  }

  /**
   * Creates a new alarm factory.
   * Alarms created will be named with the given prefix, unless a local name override is present.
   * @param alarmNamePrefix alarm name prefix
   */
  createAlarmFactory(alarmNamePrefix: string) {
    return this.scope.createAlarmFactory(
      this.localAlarmNamePrefixOverride ?? alarmNamePrefix
    );
  }

  /**
   * Adds an alarm.
   * @param alarm alarm to add
   */
  addAlarm(alarm: AlarmWithAnnotation) {
    this.alarms.push(alarm);
  }

  /**
   * Returns all the alarms created.
   */
  createdAlarms() {
    return this.alarms;
  }

  /**
   * Returns widgets for all alarms. These can go to runbook or to service dashboard.
   */
  alarmWidgets(): IWidget[] {
    return this.createdAlarms().map((alarm) =>
      this.createWidgetFactory().createAlarmDetailWidget(alarm)
    );
  }

  /**
   * Returns widgets to be placed on the summary dashboard.
   *
   * @default - no widgets.
   */
  summaryWidgets(): IWidget[] {
    return [];
  }

  /**
   * Returns widgets to be placed on the main dashboard.
   */
  abstract widgets(): IWidget[];
}

export interface IAlarmConsumer {
  consume(alarms: AlarmWithAnnotation[]): void;
}

/**
 * Base class for properties passed to each monitoring construct.
 * It contains (mostly optional) properties to specify naming, placement, and so on.
 */
export interface BaseMonitoringProps
  extends UserProvidedNames,
    MonitoringDashboardsOverrideProps {
  /**
   * Calls provided function to process all alarms created.
   */
  readonly useCreatedAlarms?: IAlarmConsumer;
}
