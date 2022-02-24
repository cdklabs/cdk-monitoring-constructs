import { ConcreteWidget, MetricWidgetProps } from "monocdk/aws-cloudwatch";

import { FullWidth } from "../../common/widget";

export interface AlarmSummaryMatrixWidgetProps extends MetricWidgetProps {
  readonly alarmArns: string[];
}

export interface AlarmSummaryMatrixWidgetPropertiesJson {
  readonly title?: string;
  readonly alarms: string[];
}

export class AlarmSummaryMatrixWidget extends ConcreteWidget {
  protected readonly props: AlarmSummaryMatrixWidgetProps;

  constructor(props: AlarmSummaryMatrixWidgetProps) {
    super(props.width ?? FullWidth, props.height ?? 2);
    this.props = props;
  }

  toJson(): any[] {
    return [
      {
        type: "alarm",
        width: this.width,
        height: this.height,
        x: this.x,
        y: this.y,
        properties: {
          title: this.props.title,
          alarms: this.props.alarmArns,
        },
      },
    ];
  }
}
