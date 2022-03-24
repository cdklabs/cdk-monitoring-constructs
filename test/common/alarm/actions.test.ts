import { Stack } from "aws-cdk-lib";
import { Match, Template } from "aws-cdk-lib/assertions";
import { ComparisonOperator, Metric } from "aws-cdk-lib/aws-cloudwatch";
import { Topic } from "aws-cdk-lib/aws-sns";

import { CustomMonitoring, notifySns } from "../../../lib";
import { TestMonitoringScope } from "../../monitoring/TestMonitoringScope";

const namespace = "DummyCustomNamespace";
const dimensionsMap = { CustomDimension: "CustomDimensionValue" };

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
              dimensionsMap,
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

  const template = Template.fromStack(stack);
  template.hasResourceProperties("AWS::CloudWatch::Alarm", {
    AlarmName: "Test-DummyAlarmName-AlarmForDummyMetric1-NoActionOverride",
    AlarmActions: Match.absent(),
    OKActions: Match.absent(),
    InsufficientDataActions: Match.absent(),
  });
  template.hasResourceProperties("AWS::CloudWatch::Alarm", {
    AlarmName: "Test-DummyAlarmName-AlarmForDummyMetric1-SimpleSnsAction",
    AlarmActions: [{ Ref: "OnAlarmTopicF22649A2" }],
    OKActions: Match.absent(),
    InsufficientDataActions: Match.absent(),
  });
  template.hasResourceProperties("AWS::CloudWatch::Alarm", {
    AlarmName: "Test-DummyAlarmName-AlarmForDummyMetric1-ComplexSnsAction",
    AlarmActions: [{ Ref: "OnAlarmTopicF22649A2" }],
    OKActions: [{ Ref: "OnOkTopic5903F4A2" }],
    InsufficientDataActions: [{ Ref: "OnNoDataTopic5F9CF206" }],
  });
});
