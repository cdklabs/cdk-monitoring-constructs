import {AlarmSummaryMatrixWidget} from "../../../lib/dashboard/widget/UnofficialWidgets";

test("AlarmSummaryMatrixWidget: snapshot test", () => {
    const widget = new AlarmSummaryMatrixWidget({
        alarmArns: [
            "arn:aws:cloudwatch:us-west-2:123456789012:alarm:TestAlarm1",
            "arn:aws:cloudwatch:us-west-2:123456789012:alarm:TestAlarm2",
            "arn:aws:cloudwatch:us-west-2:123456789012:alarm:TestAlarm3",
        ],
    });

    expect(widget.toJson()).toMatchSnapshot();
});
