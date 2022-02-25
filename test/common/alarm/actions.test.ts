import { ABSENT, haveResource } from "@monocdk-experiment/assert";
import { expect as cdkExpect } from "@monocdk-experiment/assert/lib/expect";
import { Stack } from "monocdk";
import { ComparisonOperator, Metric } from "monocdk/aws-cloudwatch";
import { Topic } from "monocdk/aws-sns";

import { CustomMonitoring, notifySns } from "../../../lib";
import { TestMonitoringScope } from "../../monitoring/TestMonitoringScope";

const namespace = "DummyCustomNamespace";
const dimensions = { CustomDimension: "CustomDimensionValue" };

test("test actions", () => {
  const stack = new Stack();
  const scope = new TestMonitoringScope(stack, "Scope");
  const onAlarmTopic = new Topic(stack, "OnAlarmTopic", { topicName: "Alarm" });
  const onOkTopic = new Topic(stack, "OnOkTopic", { topicName: "OK" });
  const onNoDataTopic = new Topic(stack, "OnNoDataTopic", {
    topicName: "NoData",
  });

  new CustomMonitoring(scope, {
    alarmFriendlyName: "DummyAlarmName",
    humanReadableName: "DummyName",
    description: "This is a very long description.",
    metricGroups: [
      {
        title: "DummyGroup1",
        metrics: [
          {
            metric: new Metric({
              metricName: "DummyMetric1",
              namespace,
              dimensions,
            }),
            alarmFriendlyName: "AlarmForDummyMetric1",
            addAlarm: {
              NoActionOverride: {
                threshold: 90,
                comparisonOperator: ComparisonOperator.LESS_THAN_THRESHOLD,
              },
              SimpleSnsAction: {
                actionOverride: notifySns(onAlarmTopic),
                threshold: 50,
                comparisonOperator: ComparisonOperator.LESS_THAN_THRESHOLD,
              },
              ComplexSnsAction: {
                actionOverride: notifySns(
                  onAlarmTopic,
                  onOkTopic,
                  onNoDataTopic
                ),
                threshold: 50,
                comparisonOperator: ComparisonOperator.LESS_THAN_THRESHOLD,
              },
            },
          },
        ],
      },
    ],
  });

  cdkExpect(stack).to(
    haveResource("AWS::CloudWatch::Alarm", {
      AlarmName: "Test-DummyAlarmName-AlarmForDummyMetric1-NoActionOverride",
      AlarmActions: ABSENT,
      OKActions: ABSENT,
      InsufficientDataActions: ABSENT,
    })
  );
  cdkExpect(stack).to(
    haveResource("AWS::CloudWatch::Alarm", {
      AlarmName: "Test-DummyAlarmName-AlarmForDummyMetric1-SimpleSnsAction",
      AlarmActions: [{ Ref: "OnAlarmTopicF22649A2" }],
      OKActions: ABSENT,
      InsufficientDataActions: ABSENT,
    })
  );
  cdkExpect(stack).to(
    haveResource("AWS::CloudWatch::Alarm", {
      AlarmName: "Test-DummyAlarmName-AlarmForDummyMetric1-ComplexSnsAction",
      AlarmActions: [{ Ref: "OnAlarmTopicF22649A2" }],
      OKActions: [{ Ref: "OnOkTopic5903F4A2" }],
      InsufficientDataActions: [{ Ref: "OnNoDataTopic5F9CF206" }],
    })
  );
});
