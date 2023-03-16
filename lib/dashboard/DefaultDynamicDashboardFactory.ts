import { Duration } from "aws-cdk-lib";
import {
  Dashboard,
  DashboardProps,
  PeriodOverride,
} from "aws-cdk-lib/aws-cloudwatch";
import { Construct } from "constructs";

import { BitmapDashboard } from "./BitmapDashboard";
import { DashboardWithBitmapCopy } from "./DashboardWithBitmapCopy";
import { IDynamicDashboardSegment } from "./DynamicDashboardSegment";
import { IDynamicDashboardFactory } from "./IDynamicDashboardFactory";

/**
 * Preferred way of rendering the widgets.
 */
export enum DynamicDashboardRenderingPreference {
  /**
   * create standard set of dashboards with interactive widgets only
   */
  INTERACTIVE_ONLY,
  /**
   * create standard set of dashboards with bitmap widgets only
   */
  BITMAP_ONLY,
  /**
   * create a two sets of dashboards: standard set (interactive) and a copy (bitmap)
   */
  INTERACTIVE_AND_BITMAP,
}

export interface DynamicDashboardConfiguration {
  /**
   * Name of the dashboard. Full dashboard name will take the form of:
   * `{@link MonitoringDynamicDashboardsProps.dashboardNamePrefix}-{@link name}`
   */
  readonly name: string;

  /**
   * Dashboard rendering preference.
   *
   * @default - DashboardRenderingPreference.INTERACTIVE_ONLY
   */
  readonly renderingPreference?: DynamicDashboardRenderingPreference;

  /**
   * Range of the dashboard
   * @default - 8 hours
   */
  readonly range?: Duration;

  /**
   * Period override for the detail dashboard (and other auxiliary dashboards).
   * @default - respect individual graphs (PeriodOverride.INHERIT)
   */
  readonly periodOverride?: PeriodOverride;
}

export interface MonitoringDynamicDashboardsProps {
  /**
   * Prefix added to each dashboard name.
   * This allows to have all dashboards sorted close to each other and also separate multiple monitoring facades.
   */
  readonly dashboardNamePrefix: string;

  /**
   * List of dashboard types to generate.
   */
  readonly dashboardConfigs: DynamicDashboardConfiguration[];
}

export class DefaultDynamicDashboardFactory
  extends Construct
  implements IDynamicDashboardFactory
{
  readonly dashboards: Record<string, Dashboard> = {};

  constructor(
    scope: Construct,
    id: string,
    props: MonitoringDynamicDashboardsProps
  ) {
    super(scope, id);

    props.dashboardConfigs.forEach((dashboardConfig) => {
      const renderingPreference =
        dashboardConfig.renderingPreference ??
        DynamicDashboardRenderingPreference.INTERACTIVE_ONLY;
      const start: string =
        "-" + (dashboardConfig.range ?? Duration.hours(8).toIsoString());

      const dashboard = this.createDashboard(
        renderingPreference,
        dashboardConfig.name,
        {
          dashboardName: `${props.dashboardNamePrefix}-${dashboardConfig.name}`,
          start: start,
          periodOverride:
            dashboardConfig.periodOverride ?? PeriodOverride.INHERIT,
        }
      );

      this.dashboards[dashboardConfig.name] = dashboard;
    });
  }

  protected createDashboard(
    renderingPreference: DynamicDashboardRenderingPreference,
    id: string,
    props: DashboardProps
  ) {
    switch (renderingPreference) {
      case DynamicDashboardRenderingPreference.INTERACTIVE_ONLY:
        return new Dashboard(this, id, props);
      case DynamicDashboardRenderingPreference.BITMAP_ONLY:
        return new BitmapDashboard(this, id, props);
      case DynamicDashboardRenderingPreference.INTERACTIVE_AND_BITMAP:
        return new DashboardWithBitmapCopy(this, id, props);
    }
  }

  addDynamicSegment(segment: IDynamicDashboardSegment): void {
    for (const type in this.dashboards) {
      const dashboard = this.dashboards[type];
      dashboard.addWidgets(...segment.widgetsByDashboardType(type));
    }
  }

  getDashboard(type: string): Dashboard | undefined {
    return this.dashboards[type];
  }
}
