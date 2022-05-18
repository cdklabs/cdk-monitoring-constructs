import { Duration, Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { BuildSpec, Project } from "aws-cdk-lib/aws-codebuild";

import { AlarmWithAnnotation, CodeBuildProjectMonitoring } from "../../../lib";
import { addMonitoringDashboardsToStack } from "../../utils/SnapshotUtil";
import { TestMonitoringScope } from "../TestMonitoringScope";

test("snapshot test: all alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const project = new Project(stack, "Project", {
    projectName: "TheProject",
    buildSpec: BuildSpec.fromObject({
      version: "0.2",
      phases: {
        build: {
          commands: ["echo hello"],
        },
      },
    }),
  });

  let numAlarmsCreated = 0;

  const monitoring = new CodeBuildProjectMonitoring(scope, {
    project,
    addDurationP99Alarm: {
      Warning: {
        maxDuration: Duration.minutes(10),
      },
    },
    addDurationP90Alarm: {
      Warning: {
        maxDuration: Duration.minutes(2),
      },
    },
    addDurationP50Alarm: {
      Warning: {
        maxDuration: Duration.minutes(1),
      },
    },
    addFailedBuildCountAlarm: {
      Warning: {
        maxErrorCount: 1,
      },
    },
    addFailedBuildRateAlarm: {
      Warning: {
        maxErrorRate: 0.1,
      },
    },
    useCreatedAlarms: {
      consume(alarms: AlarmWithAnnotation[]) {
        numAlarmsCreated = alarms.length;
      },
    },
  });

  addMonitoringDashboardsToStack(stack, monitoring);
  expect(numAlarmsCreated).toStrictEqual(5);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});
