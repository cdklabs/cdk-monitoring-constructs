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

  widgetsForDashboard(name: string): IWidget[] {
    if (
      this.props.overrideProps?.addToDetailDashboard ||
      name === DefaultDashboards.DETAIL
    ) {
      return this.props.segment.widgets();
    }
    if (
      this.props.overrideProps?.addToSummaryDashboard ||
      name === DefaultDashboards.SUMMARY
    ) {
      return this.props.segment.summaryWidgets();
    }
    if (
      this.props.overrideProps?.addToAlarmDashboard ||
      name === DefaultDashboards.ALARMS
    ) {
      return this.props.segment.alarmWidgets();
    } else {
      return [];
    }
  }
}
