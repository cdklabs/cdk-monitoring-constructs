import { Construct } from "constructs";

import { IWidgetFactory } from "../../dashboard";
import { AlarmFactory } from "../alarm";
import { MetricFactory } from "../metric";
import { AwsConsoleUrlFactory } from "../url";

/**
 * A scope where all monitored constructs are managed from (i.e., alarms, dashboards, etc.).
 *
 * Standard usages will use {@link MonitoringFacade}.
 */
export abstract class MonitoringScope extends Construct {
  /**
   * Creates a new widget factory.
   */
  abstract createWidgetFactory(): IWidgetFactory;

  /**
   * Creates a new metric factory.
   */
  abstract createMetricFactory(): MetricFactory;

  /**
   * Creates a new alarm factory.
   * Alarms created will be named with the given prefix, unless a local name override is present.
   *
   * @param alarmNamePrefix alarm name prefix
   */
  abstract createAlarmFactory(alarmNamePrefix: string): AlarmFactory;

  /**
   * Creates a new factory that creates AWS Console URLs.
   */
  abstract createAwsConsoleUrlFactory(): AwsConsoleUrlFactory;
}
