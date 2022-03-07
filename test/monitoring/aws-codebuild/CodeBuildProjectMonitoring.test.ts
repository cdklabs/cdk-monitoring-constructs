import { Duration, Stack } from "monocdk";
import { Template } from "monocdk/assertions";
import { BuildSpec, Project } from "monocdk/aws-codebuild";

import { AlarmWithAnnotation, CodeBuildProjectMonitoring } from "../../../lib";
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

  new CodeBuildProjectMonitoring(scope, {
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

  expect(numAlarmsCreated).toStrictEqual(5);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});
