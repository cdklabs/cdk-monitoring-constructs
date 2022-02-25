import { Construct, Duration } from "monocdk";
import {
  Dashboard,
  DashboardProps,
  PeriodOverride,
} from "monocdk/aws-cloudwatch";

import { BitmapDashboard } from "./BitmapDashboard";
import { DashboardWithBitmapCopy } from "./DashboardWithBitmapCopy";
import { IDashboardFactory, IDashboardFactoryProps } from "./IDashboardFactory";

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
   * @default 8 hours
   * @see DefaultDetailDashboardRange
   */
  readonly detailDashboardRange?: Duration;
  /**
   * Period override for the detail dashboard (and other auxiliary dashboards).
   * @default automatic (period dependent)
   */
  readonly detailDashboardPeriodOverride?: PeriodOverride;
  /**
   * Range of the summary dashboard.
   * @default 14 days
   */
  readonly summaryDashboardRange?: Duration;
  /**
   * Period override for the summary dashboard.
   * @default automatic (period dependent)
   */
  readonly summaryDashboardPeriodOverride?: PeriodOverride;
  /**
   * Flag indicating whether the default dashboard should be created.
   * This is independent on other create dashboard flags.
   */
  readonly createDashboard: boolean;
  /**
   * Flag indicating whether the summary dashboard should be created.
   * This is independent on other create dashboard flags.
   */
  readonly createSummaryDashboard: boolean;
  /**
   * Flag indicating whether the alarm dashboard should be created.
   * This is independent on other create dashboard flags.
   */
  readonly createAlarmDashboard: boolean;
  /**
   * Dashboard rendering preference.
   */
  readonly renderingPreference: DashboardRenderingPreference;
}

export class DefaultDashboardFactory
  extends Construct
  implements IDashboardFactory
{
  readonly dashboard?: Dashboard;
  readonly summaryDashboard?: Dashboard;
  readonly alarmDashboard?: Dashboard;
  protected readonly anyDashboardCreated: boolean;

  constructor(scope: Construct, id: string, props: MonitoringDashboardsProps) {
    super(scope, id);

    const detailStart: string =
      "-" + (props.detailDashboardRange ?? Duration.hours(8)).toIsoString();
    const summaryStart: string =
      "-" + (props.summaryDashboardRange ?? Duration.days(14)).toIsoString();
    let anyDashboardCreated = false;

    if (props.createDashboard) {
      anyDashboardCreated = true;
      this.dashboard = this.createDashboard(
        props.renderingPreference,
        "Dashboard",
        {
          dashboardName: props.dashboardNamePrefix,
          start: detailStart,
          periodOverride: props.detailDashboardPeriodOverride,
        }
      );
    }
    if (props.createSummaryDashboard) {
      anyDashboardCreated = true;
      this.summaryDashboard = this.createDashboard(
        props.renderingPreference,
        "SummaryDashboard",
        {
          dashboardName: `${props.dashboardNamePrefix}-Summary`,
          start: summaryStart,
          periodOverride: props.summaryDashboardPeriodOverride,
        }
      );
    }
    if (props.createAlarmDashboard) {
      anyDashboardCreated = true;
      this.alarmDashboard = this.createDashboard(
        props.renderingPreference,
        "AlarmDashboard",
        {
          dashboardName: `${props.dashboardNamePrefix}-Alarms`,
          start: detailStart,
          periodOverride: props.detailDashboardPeriodOverride,
        }
      );
    }

    this.anyDashboardCreated = anyDashboardCreated;
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
