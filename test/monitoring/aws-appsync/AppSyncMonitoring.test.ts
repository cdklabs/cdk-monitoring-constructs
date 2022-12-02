import { GraphqlApi, IGraphqlApi } from "@aws-cdk/aws-appsync-alpha";
import { Duration, Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";

import { AlarmWithAnnotation, AppSyncMonitoring } from "../../../lib";
import { addMonitoringDashboardsToStack } from "../../utils/SnapshotUtil";
import { TestMonitoringScope } from "../TestMonitoringScope";

test("snapshot test: no alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const dummyApi = new GraphqlApi(stack, "testHttpApi", {
    name: "DummyApi",
  });

  const monitoring = new AppSyncMonitoring(scope, {
    api: dummyApi,
    humanReadableName: "Dummy API for testing",
    alarmFriendlyName: "DummyApi",
  });

  addMonitoringDashboardsToStack(stack, monitoring);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot test: no alarms with imported IGraphqlApi", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const dummyApi: IGraphqlApi = GraphqlApi.fromGraphqlApiAttributes(
    scope,
    "ImportedGraphQlApi",
    {
      graphqlApiId: "DummyApiFromElsewhere",
    }
  );

  const monitoring = new AppSyncMonitoring(scope, {
    api: dummyApi,
    humanReadableName: "Dummy API for testing",
    alarmFriendlyName: "DummyApi",
  });

  addMonitoringDashboardsToStack(stack, monitoring);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot test: all alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  let numAlarmsCreated = 0;

  const dummyApi = new GraphqlApi(stack, "testHttpApi", {
    name: "DummyApi",
  });

  const monitoring = new AppSyncMonitoring(scope, {
    api: dummyApi,
    humanReadableName: "Dummy API for testing",
    alarmFriendlyName: "DummyApi",
    addLatencyP50Alarm: {
      Warning: {
        maxLatency: Duration.millis(110),
      },
    },
    addLatencyP90Alarm: {
      Warning: {
        maxLatency: Duration.millis(220),
      },
    },
    addLatencyP99Alarm: {
      Warning: {
        maxLatency: Duration.millis(330),
      },
    },
    add4XXErrorCountAlarm: {
      Warning: {
        maxErrorCount: 0.02,
      },
    },
    add4XXErrorRateAlarm: {
      Warning: {
        maxErrorRate: 0.01,
      },
    },
    add5XXFaultCountAlarm: {
      Warning: {
        maxErrorCount: 2,
      },
    },
    add5XXFaultRateAlarm: {
      Warning: {
        maxErrorRate: 1,
      },
    },
    addLowTpsAlarm: {
      Warning: {
        minTps: 10,
      },
    },
    addHighTpsAlarm: {
      Warning: {
        maxTps: 100,
      },
    },
    useCreatedAlarms: {
      consume(alarms: AlarmWithAnnotation[]) {
        numAlarmsCreated = alarms.length;
      },
    },
  });

  addMonitoringDashboardsToStack(stack, monitoring);
  expect(numAlarmsCreated).toStrictEqual(9);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});
