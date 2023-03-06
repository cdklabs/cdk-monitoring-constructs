import { Dashboard } from "aws-cdk-lib/aws-cloudwatch";

import {
  IDashboardSegment,
  IDynamicDashboardSegment,
} from "./DashboardSegment";

export interface MonitoringDashboardsOverrideProps {
  /**
   * Flag indicating if the widgets should be added to detailed dashboard
   *
   * @default - true
   */
  readonly addToDetailDashboard?: boolean;
  /**
   * Flag indicating if the widgets should be added to summary dashboard
   *
   * @default - true
   */
  readonly addToSummaryDashboard?: boolean;
  /**
   * Flag indicating if the widgets should be added to alarm dashboard
   *
   * @default - true
   */
  readonly addToAlarmDashboard?: boolean;
}

export interface IDashboardFactoryProps {
  /**
   * Segment to be placed on the dashboard.
   */
  segment: IDashboardSegment;
  /**
   * Dashboard placement override props.
   *
   * @default - all default
   */
  overrideProps?: MonitoringDashboardsOverrideProps;
}

export interface IDashboardFactory {
  addSegment(props: IDashboardFactoryProps): void;

  createdDashboard(): Dashboard | undefined;

  createdSummaryDashboard(): Dashboard | undefined;

  createdAlarmDashboard(): Dashboard | undefined;
}

/**
 * This dashboard factory interface provides for dynamic dashboard generation through
 * IDynamicDashboard segments which will return different content depending on the
 * dashboard type.
 */
export interface IDynamicDashboardFactory {
  /**
   * Adds a dynamic dashboard segment.
   * @param segment IDynamicDashboardSegment
   */
  addDynamicSegment(segment: IDynamicDashboardSegment): void;

  /**
   * Gets the dashboard for the requested dashboard type.
   * @param type
   */
  getDashboard(type: string): Dashboard | undefined;
}
