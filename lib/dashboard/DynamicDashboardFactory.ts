import { Duration } from "aws-cdk-lib";
import {
  Dashboard,
  DashboardProps,
  PeriodOverride,
} from "aws-cdk-lib/aws-cloudwatch";
import { Construct } from "constructs";

import { BitmapDashboard } from "./BitmapDashboard";
import { DashboardRenderingPreference } from "./DashboardRenderingPreference";
import { DashboardWithBitmapCopy } from "./DashboardWithBitmapCopy";
import { DefaultDashboards } from "./DefaultDashboardFactory";
import { IDynamicDashboardSegment } from "./DynamicDashboardSegment";
import { IDynamicDashboardFactory } from "./IDynamicDashboardFactory";

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
  readonly renderingPreference?: DashboardRenderingPreference;

  /**
   * Range of the dashboard
   * @default - 8 hours
   */
  readonly range?: Duration;

  /**
   * Period override for the dashboard.
   * @default - respect individual graphs (PeriodOverride.INHERIT)
   */
  readonly periodOverride?: PeriodOverride;
}

export interface MonitoringDynamicDashboardsProps {
  /**
   * Prefix added to each dashboard's name.
   * This allows to have all dashboards sorted close to each other and also separate multiple monitoring facades.
   */
  readonly dashboardNamePrefix: string;

  /**
   * List of dashboard types to generate.
   */
  readonly dashboardConfigs: DynamicDashboardConfiguration[];
}

export class DynamicDashboardFactory
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
      if (this.dashboards[dashboardConfig.name]) {
        throw new Error("Cannot have duplicate dashboard names!");
      }

      if (
        Object.values<string>(DefaultDashboards).includes(dashboardConfig.name)
      ) {
        throw new Error("Cannot have reserved dashboard names!");
      }

      const renderingPreference =
        dashboardConfig.renderingPreference ??
        DashboardRenderingPreference.INTERACTIVE_ONLY;
      const start: string =
        "-" + (dashboardConfig.range ?? Duration.hours(8).toIsoString());

      const dashboard = this.createDashboard(
        renderingPreference,
        dashboardConfig.name,
        {
          dashboardName: `${props.dashboardNamePrefix}-${dashboardConfig.name}`,
          start,
          periodOverride:
            dashboardConfig.periodOverride ?? PeriodOverride.INHERIT,
        }
      );

      this.dashboards[dashboardConfig.name] = dashboard;
    });
  }

  protected createDashboard(
    renderingPreference: DashboardRenderingPreference,
    id: string,
    props: DashboardProps
  ) {
    switch (renderingPreference) {
      case DashboardRenderingPreference.INTERACTIVE_ONLY:
        return new Dashboard(this, id, props);
      case DashboardRenderingPreference.BITMAP_ONLY:
        return new BitmapDashboard(this, id, props);
      case DashboardRenderingPreference.INTERACTIVE_AND_BITMAP:
        return new DashboardWithBitmapCopy(this, id, props);
    }
  }

  addDynamicSegment(segment: IDynamicDashboardSegment): void {
    for (const type in this.dashboards) {
      const dashboard = this.dashboards[type];
      dashboard.addWidgets(...segment.widgetsForDashboard(type));
    }
  }

  getDashboard(type: string): Dashboard | undefined {
    return this.dashboards[type];
  }
}
