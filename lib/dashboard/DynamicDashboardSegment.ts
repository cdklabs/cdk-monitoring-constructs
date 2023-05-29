import { IWidget } from "aws-cdk-lib/aws-cloudwatch";
import { DefaultDashboards } from "./DefaultDashboardFactory";
import { IDashboardFactoryProps } from "./IDashboardFactory";

export interface IDynamicDashboardSegment {
  /**
   * Returns widgets for the requested dashboard type.
   * @param name name of dashboard for which widgets are generated.
   */
  widgetsForDashboard(name: string): IWidget[];
}

export class StaticSegmentDynamicAdapter implements IDynamicDashboardSegment {
  protected readonly props: IDashboardFactoryProps;

  constructor(props: IDashboardFactoryProps) {
    this.props = props;
  }

  /**
   * Adapts an IDashboardSegment to the IDynamicDashboardSegment interface by using
   * overrideProps to determine if a segment should be shown on a specific dashboard.
   * The default values are true, so consumers must set these to false if they would
   * like to hide these items from dashboards
   */
  widgetsForDashboard(name: string): IWidget[] {
    let addToDetailDashboard = true;
    let addToSummaryDashboard = true;
    let addToAlarmsDashboard = true;
    const overrideProps = this.props.overrideProps;
    if (overrideProps != null) {
      addToDetailDashboard = overrideProps.addToDetailDashboard ?? true;
      addToSummaryDashboard = overrideProps.addToSummaryDashboard ?? true;
      addToAlarmsDashboard = overrideProps.addToAlarmDashboard ?? true;
    }
    if (addToDetailDashboard != false && name === DefaultDashboards.DETAIL) {
      return this.props.segment.widgets();
    }
    if (addToSummaryDashboard != false && name === DefaultDashboards.SUMMARY) {
      return this.props.segment.summaryWidgets();
    }
    if (addToAlarmsDashboard != false && name === DefaultDashboards.ALARMS) {
      return this.props.segment.alarmWidgets();
    }
    return [];
  }
}
