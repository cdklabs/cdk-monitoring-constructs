import { Duration } from "aws-cdk-lib";
import {
  Dashboard,
  DashboardProps,
  PeriodOverride,
} from "aws-cdk-lib/aws-cloudwatch";
import { Construct } from "constructs";

import { BitmapDashboard } from "./BitmapDashboard";
import { IDynamicDashboardSegment } from "./DashboardSegment";
import { DashboardWithBitmapCopy } from "./DashboardWithBitmapCopy";
import {
  IDashboardFactory,
  IDynamicDashboardFactory,
  IDashboardFactoryProps,
} from "./IDashboardFactory";

/**
 * Preferred way of rendering the widgets.
 */
export enum DashboardRenderingPreference {
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

export interface MonitoringDashboardsProps {
  /**
   * Prefix added to each dashboard name.
   * This allows to have all dashboards sorted close to each other and also separate multiple monitoring facades.
   */
  readonly dashboardNamePrefix: string;
  /**
   * Range of the detail dashboard (and other auxiliary dashboards).
   * @default - 8 hours
   * @see DefaultDetailDashboardRange
   */
  readonly detailDashboardRange?: Duration;
  /**
   * Period override for the detail dashboard (and other auxiliary dashboards).
   * @default - respect individual graphs (PeriodOverride.INHERIT)
   */
  readonly detailDashboardPeriodOverride?: PeriodOverride;
  /**
   * Range of the summary dashboard.
   * @default - 14 days
   */
  readonly summaryDashboardRange?: Duration;
  /**
   * Period override for the summary dashboard.
   * @default - respect individual graphs (PeriodOverride.INHERIT)
   */
  readonly summaryDashboardPeriodOverride?: PeriodOverride;
  /**
   * Flag indicating whether the default dashboard should be created.
   * This is independent on other create dashboard flags.
   *
   * @default - true
   */
  readonly createDashboard?: boolean;
  /**
   * Flag indicating whether the summary dashboard should be created.
   * This is independent on other create dashboard flags.
   *
   * @default - false
   */
  readonly createSummaryDashboard?: boolean;
  /**
   * Flag indicating whether the alarm dashboard should be created.
   * This is independent on other create dashboard flags.
   *
   * @default - false
   */
  readonly createAlarmDashboard?: boolean;
  /**
   * Dashboard rendering preference.
   *
   * @default - DashboardRenderingPreference.INTERACTIVE_ONLY
   */
  readonly renderingPreference?: DashboardRenderingPreference;

  /**
   * List of dashboard types to generate.
   */
  readonly dashboardTypes?: string[];
}

export class DefaultDashboardFactory
  extends Construct
  implements IDashboardFactory, IDynamicDashboardFactory
{
  // legacy factory props
  readonly dashboard?: Dashboard;
  readonly summaryDashboard?: Dashboard;
  readonly alarmDashboard?: Dashboard;
  readonly anyDashboardCreated: boolean;

  // dyanmic factory fields
  dashboards: Record<string, Dashboard> = {};

  constructor(scope: Construct, id: string, props: MonitoringDashboardsProps) {
    super(scope, id);

    const createDashboard = props.createDashboard ?? true;
    const createSummaryDashboard = props.createSummaryDashboard ?? false;
    const createAlarmDashboard = props.createAlarmDashboard ?? false;
    const shouldCreateDashboards =
      createDashboard || createAlarmDashboard || createSummaryDashboard;

    if (shouldCreateDashboards && !props.dashboardNamePrefix) {
      throw Error(
        "A non-empty dashboardNamePrefix is required if dashboards are being created"
      );
    }

    if (props.dashboardTypes) {
      // Dashboard types are defined, so use new dynamic dashboarding features
      const renderingPreference =
        props.renderingPreference ??
        DashboardRenderingPreference.INTERACTIVE_ONLY;
      const start: string = "-" + Duration.hours(8).toIsoString();

      console.log("Creating dashboards for types = " + props.dashboardTypes);
      props.dashboardTypes?.forEach((dashboardType) => {
        const dashboard = this.createDashboard(
          renderingPreference,
          dashboardType,
          {
            dashboardName: `${props.dashboardNamePrefix}-${dashboardType}`,
            start: start,
            periodOverride:
              props.detailDashboardPeriodOverride ?? PeriodOverride.INHERIT,
          }
        );

        this.dashboards[dashboardType] = dashboard;
      });
      this.anyDashboardCreated = true;
    } else {
      // Dashboard types are not defined, so use legacy static dashboarding features
      const renderingPreference =
        props.renderingPreference ??
        DashboardRenderingPreference.INTERACTIVE_ONLY;
      const detailStart: string = "-" + Duration.hours(3).toIsoString();
      const summaryStart: string =
        "-" + (props.summaryDashboardRange ?? Duration.days(14)).toIsoString();
      let anyDashboardCreated = false;

      if (createDashboard) {
        anyDashboardCreated = true;
        this.dashboard = this.createDashboard(
          renderingPreference,
          "Dashboard",
          {
            dashboardName: props.dashboardNamePrefix,
            start: detailStart,
            periodOverride:
              props.detailDashboardPeriodOverride ?? PeriodOverride.INHERIT,
          }
        );
      }
      if (createSummaryDashboard) {
        anyDashboardCreated = true;
        this.summaryDashboard = this.createDashboard(
          renderingPreference,
          "SummaryDashboard",
          {
            dashboardName: `${props.dashboardNamePrefix}-Summary`,
            start: summaryStart,
            periodOverride:
              props.summaryDashboardPeriodOverride ?? PeriodOverride.INHERIT,
          }
        );
      }
      if (createAlarmDashboard) {
        anyDashboardCreated = true;
        this.alarmDashboard = this.createDashboard(
          renderingPreference,
          "AlarmDashboard",
          {
            dashboardName: `${props.dashboardNamePrefix}-Alarms`,
            start: detailStart,
            periodOverride:
              props.detailDashboardPeriodOverride ?? PeriodOverride.INHERIT,
          }
        );
      }
      this.anyDashboardCreated = anyDashboardCreated;
    }
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
      dashboard.addWidgets(...segment.widgetsByDashboardType(type));
    }
  }

  addSegment(props: IDashboardFactoryProps) {
    if ((props.overrideProps?.addToDetailDashboard ?? true) && this.dashboard) {
      this.dashboard.addWidgets(...props.segment.widgets());
    }
    if (
      (props.overrideProps?.addToSummaryDashboard ?? true) &&
      this.summaryDashboard
    ) {
      this.summaryDashboard.addWidgets(...props.segment.summaryWidgets());
    }
    if (
      (props.overrideProps?.addToAlarmDashboard ?? true) &&
      this.alarmDashboard
    ) {
      this.alarmDashboard.addWidgets(...props.segment.alarmWidgets());
    }
  }

  getDashboard(type: string): Dashboard | undefined {
    return this.dashboards[type];
  }

  createdDashboard(): Dashboard | undefined {
    return this.dashboard;
  }

  createdSummaryDashboard(): Dashboard | undefined {
    return this.summaryDashboard;
  }

  createdAlarmDashboard(): Dashboard | undefined {
    return this.alarmDashboard;
  }
}
