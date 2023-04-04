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
import { IDynamicDashboardSegment } from "./DynamicDashboardSegment";
import { IDashboardFactory, IDashboardFactoryProps } from "./IDashboardFactory";
import { IDynamicDashboardFactory } from "./IDynamicDashboardFactory";

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
}

export enum DefaultDashboards {
  SUMMARY = "Summary",
  DETAIL = "Detail",
  ALARMS = "Alarms",
}

export class DefaultDashboardFactory
  extends Construct
  implements IDashboardFactory, IDynamicDashboardFactory
{
  // Legacy Dashboard Fields
  readonly dashboard?: Dashboard;
  readonly summaryDashboard?: Dashboard;
  readonly alarmDashboard?: Dashboard;
  readonly anyDashboardCreated: boolean;

  // Dynamic Dashboard Fields
  readonly dashboards: Record<string, Dashboard> = {};

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

    const renderingPreference =
      props.renderingPreference ??
      DashboardRenderingPreference.INTERACTIVE_ONLY;
    const detailStart: string =
      "-" + (props.detailDashboardRange ?? Duration.hours(8)).toIsoString();
    const summaryStart: string =
      "-" + (props.summaryDashboardRange ?? Duration.days(14)).toIsoString();
    let anyDashboardCreated = false;

    if (createDashboard) {
      anyDashboardCreated = true;
      this.dashboard = this.createDashboard(renderingPreference, "Dashboard", {
        dashboardName: props.dashboardNamePrefix,
        start: detailStart,
        periodOverride:
          props.detailDashboardPeriodOverride ?? PeriodOverride.INHERIT,
      });
      this.dashboards[DefaultDashboards.DETAIL] = this.dashboard;
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
      this.dashboards[DefaultDashboards.SUMMARY] = this.summaryDashboard;
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
      this.dashboards[DefaultDashboards.ALARMS] = this.alarmDashboard;
    }

    this.anyDashboardCreated = anyDashboardCreated;
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

  addDynamicSegment(segment: IDynamicDashboardSegment): void {
    this.dashboard?.addWidgets(
      ...segment.widgetsForDashboard(DefaultDashboards.DETAIL)
    );
    this.summaryDashboard?.addWidgets(
      ...segment.widgetsForDashboard(DefaultDashboards.SUMMARY)
    );
    this.alarmDashboard?.addWidgets(
      ...segment.widgetsForDashboard(DefaultDashboards.ALARMS)
    );
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

  createdDashboard(): Dashboard | undefined {
    return this.dashboard;
  }

  createdSummaryDashboard(): Dashboard | undefined {
    return this.summaryDashboard;
  }

  createdAlarmDashboard(): Dashboard | undefined {
    return this.alarmDashboard;
  }

  getDashboard(type: string): Dashboard | undefined {
    if (type === DefaultDashboards.SUMMARY) {
      return this.summaryDashboard;
    } else if (type === DefaultDashboards.DETAIL) {
      return this.dashboard;
    } else if (type === DefaultDashboards.ALARMS) {
      return this.alarmDashboard;
    } else {
      throw new Error("Unexpected dashboard name!");
    }
  }
}
