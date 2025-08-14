import { Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";

import {
  AlarmWithAnnotation,
  OpenSearchIngestionPipelineMonitoring,
} from "../../../lib";
import { addMonitoringDashboardsToStack } from "../../utils/SnapshotUtil";
import { TestMonitoringScope } from "../TestMonitoringScope";

test("snapshot test: no alarms", () => {
  const stack = new Stack();
  const scope = new TestMonitoringScope(stack, "Scope");

  const monitoring = new OpenSearchIngestionPipelineMonitoring(scope, {
    pipelineName: "PipelineName",
    subPipelineName: "SubPipelineName",
    sink: "Sink",
    source: "Source",
  });

  addMonitoringDashboardsToStack(stack, monitoring);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot test: all alarms", () => {
  const stack = new Stack();
  const scope = new TestMonitoringScope(stack, "Scope");

  let numAlarmsCreated = 0;

  const monitoring = new OpenSearchIngestionPipelineMonitoring(scope, {
    pipelineName: "PipelineName",
    subPipelineName: "SubPipelineName",
    sink: "Sink",
    source: "Source",
    addMaxDlqS3CountAlarm: {
      Warning: {
        maxCount: 0,
      },
    },
    useCreatedAlarms: {
      consume(alarms: AlarmWithAnnotation[]) {
        numAlarmsCreated = alarms.length;
      },
    },
  });

  addMonitoringDashboardsToStack(stack, monitoring);
  expect(numAlarmsCreated).toStrictEqual(1);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});
