import {Stack} from "aws-cdk-lib";
import {Template} from "aws-cdk-lib/assertions";
import {Alarm, Metric} from "aws-cdk-lib/aws-cloudwatch";
import {OpsItemCategory, OpsItemSeverity} from "aws-cdk-lib/aws-cloudwatch-actions";

import {OpsItemAlarmActionStrategy} from "../../../../lib";

test("snapshot test", () => {
    const stack = new Stack();
    const alarm = new Alarm(stack, "DummyAlarm", {
        evaluationPeriods: 1,
        threshold: 0,
        metric: new Metric({namespace: "Dummy", metricName: "Dummy"}),
    });
    const action = new OpsItemAlarmActionStrategy(OpsItemSeverity.LOW, OpsItemCategory.AVAILABILITY);
    action.addAlarmActions({alarm, action});

    expect(Template.fromStack(stack)).toMatchSnapshot();
});
