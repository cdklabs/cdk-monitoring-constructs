import {AlarmWidget, IWidget} from "aws-cdk-lib/aws-cloudwatch";

import {IWidgetFactory} from "./IWidgetFactory";
import {AlarmWithAnnotation, DefaultAlarmWidgetHeight, DefaultAlarmWidgetWidth} from "../common";

export class DefaultWidgetFactory implements IWidgetFactory {
    createAlarmDetailWidget(alarm: AlarmWithAnnotation): IWidget {
        return new AlarmWidget({
            alarm: alarm.alarm,
            title: alarm.alarmLabel,
            width: DefaultAlarmWidgetWidth,
            height: DefaultAlarmWidgetHeight,
        });
    }
}
