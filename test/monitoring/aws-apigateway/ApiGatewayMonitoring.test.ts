import { Duration, Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { IRestApi, RestApi } from "aws-cdk-lib/aws-apigateway";

import { AlarmWithAnnotation, ApiGatewayMonitoring } from "../../../lib";
import { addMonitoringDashboardsToStack } from "../../utils/SnapshotUtil";
import { TestMonitoringScope } from "../TestMonitoringScope";

test("snapshot test: no alarms", () => {
  const stack = new Stack();
  const api = new RestApi(stack, "DummyApi");
  api.root.addMethod("ANY");

  const scope = new TestMonitoringScope(stack, "Scope");

  const monitoring = new ApiGatewayMonitoring(scope, {
    api,
    humanReadableName: "Dummy API Gateway for testing",
    alarmFriendlyName: "DummyApi",
  });

  addMonitoringDashboardsToStack(stack, monitoring);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot test: all alarms", () => {
  const stack = new Stack();
  const api = new RestApi(stack, "DummyApi");
  api.root.addMethod("ANY");

  const scope = new TestMonitoringScope(stack, "Scope");

  let numAlarmsCreated = 0;

  const monitoring = new ApiGatewayMonitoring(scope, {
    api,
    humanReadableName: "Dummy API Gateway for testing",
    alarmFriendlyName: "DummyApi",
    add5XXFaultRateAlarm: {
      Warning: {
        maxErrorRate: 1,
        datapointsToAlarm: 10,
      },
    },
    add5XXFaultCountAlarm: {
      Warning: {
        maxErrorCount: 2,
        datapointsToAlarm: 20,
      },
    },
    add4XXErrorRateAlarm: {
      Warning: {
        maxErrorRate: 0.01,
        datapointsToAlarm: 11,
      },
    },
    add4XXErrorCountAlarm: {
      Warning: {
        maxErrorCount: 0.02,
        datapointsToAlarm: 22,
      },
    },
    addLatencyP50Alarm: {
      Warning: {
        maxLatency: Duration.millis(150),
        datapointsToAlarm: 150,
      },
    },
    addLatencyP70Alarm: {
      Warning: {
        maxLatency: Duration.millis(170),
        datapointsToAlarm: 170,
      },
    },
    addLatencyP90Alarm: {
      Warning: {
        maxLatency: Duration.millis(190),
        datapointsToAlarm: 190,
      },
    },
    addLatencyP95Alarm: {
      Warning: {
        maxLatency: Duration.millis(195),
        datapointsToAlarm: 195,
      },
    },
    addLatencyP99Alarm: {
      Warning: {
        maxLatency: Duration.millis(199),
        datapointsToAlarm: 199,
      },
    },
    addLatencyP999Alarm: {
      Warning: {
        maxLatency: Duration.millis(1999),
        datapointsToAlarm: 1999,
      },
    },
    addLatencyP9999Alarm: {
      Warning: {
        maxLatency: Duration.millis(19999),
        datapointsToAlarm: 19999,
      },
    },
    addLatencyP100Alarm: {
      Warning: {
        maxLatency: Duration.millis(1100),
        datapointsToAlarm: 1100,
      },
    },
    addLatencyTM50Alarm: {
      Warning: {
        maxLatency: Duration.millis(250),
        datapointsToAlarm: 250,
      },
    },
    addLatencyTM70Alarm: {
      Warning: {
        maxLatency: Duration.millis(270),
        datapointsToAlarm: 270,
      },
    },
    addLatencyTM90Alarm: {
      Warning: {
        maxLatency: Duration.millis(290),
        datapointsToAlarm: 290,
      },
    },
    addLatencyTM95Alarm: {
      Warning: {
        maxLatency: Duration.millis(295),
        datapointsToAlarm: 295,
      },
    },
    addLatencyTM99Alarm: {
      Warning: {
        maxLatency: Duration.millis(299),
        datapointsToAlarm: 299,
      },
    },
    addLatencyTM999Alarm: {
      Warning: {
        maxLatency: Duration.millis(2999),
        datapointsToAlarm: 2999,
      },
    },
    addLatencyTM9999Alarm: {
      Warning: {
        maxLatency: Duration.millis(29999),
        datapointsToAlarm: 29999,
      },
    },
    addLatencyAverageAlarm: {
      Warning: {
        maxLatency: Duration.millis(20),
        datapointsToAlarm: 20,
      },
    },
    addLowTpsAlarm: {
      Warning: { minTps: 1 },
    },
    addHighTpsAlarm: {
      Warning: { maxTps: 10 },
    },
    useCreatedAlarms: {
      consume(alarms: AlarmWithAnnotation[]) {
        numAlarmsCreated = alarms.length;
      },
    },
  });

  addMonitoringDashboardsToStack(stack, monitoring);
  expect(numAlarmsCreated).toStrictEqual(22);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot test: all alarms using interface", () => {
  const stack = new Stack();
  const api: IRestApi = RestApi.fromRestApiId(
    stack,
    "ThisShouldBeTheApiName",
    "thisIsNotUsed"
  );

  const scope = new TestMonitoringScope(stack, "Scope");

  let numAlarmsCreated = 0;

  const monitoring = new ApiGatewayMonitoring(scope, {
    api,
    humanReadableName: "Dummy API Gateway for testing",
    alarmFriendlyName: "DummyApi",
    add5XXFaultRateAlarm: {
      Warning: {
        maxErrorRate: 1,
        datapointsToAlarm: 10,
      },
    },
    add5XXFaultCountAlarm: {
      Warning: {
        maxErrorCount: 2,
        datapointsToAlarm: 20,
      },
    },
    add4XXErrorRateAlarm: {
      Warning: {
        maxErrorRate: 0.01,
        datapointsToAlarm: 11,
      },
    },
    add4XXErrorCountAlarm: {
      Warning: {
        maxErrorCount: 0.02,
        datapointsToAlarm: 22,
      },
    },
    addLatencyP50Alarm: {
      Warning: {
        maxLatency: Duration.millis(150),
        datapointsToAlarm: 150,
      },
    },
    addLatencyP70Alarm: {
      Warning: {
        maxLatency: Duration.millis(170),
        datapointsToAlarm: 170,
      },
    },
    addLatencyP90Alarm: {
      Warning: {
        maxLatency: Duration.millis(190),
        datapointsToAlarm: 190,
      },
    },
    addLatencyP95Alarm: {
      Warning: {
        maxLatency: Duration.millis(195),
        datapointsToAlarm: 195,
      },
    },
    addLatencyP99Alarm: {
      Warning: {
        maxLatency: Duration.millis(199),
        datapointsToAlarm: 199,
      },
    },
    addLatencyP999Alarm: {
      Warning: {
        maxLatency: Duration.millis(1999),
        datapointsToAlarm: 1999,
      },
    },
    addLatencyP9999Alarm: {
      Warning: {
        maxLatency: Duration.millis(19999),
        datapointsToAlarm: 19999,
      },
    },
    addLatencyP100Alarm: {
      Warning: {
        maxLatency: Duration.millis(1100),
        datapointsToAlarm: 1100,
      },
    },
    addLatencyTM50Alarm: {
      Warning: {
        maxLatency: Duration.millis(250),
        datapointsToAlarm: 250,
      },
    },
    addLatencyTM70Alarm: {
      Warning: {
        maxLatency: Duration.millis(270),
        datapointsToAlarm: 270,
      },
    },
    addLatencyTM90Alarm: {
      Warning: {
        maxLatency: Duration.millis(290),
        datapointsToAlarm: 290,
      },
    },
    addLatencyTM95Alarm: {
      Warning: {
        maxLatency: Duration.millis(295),
        datapointsToAlarm: 295,
      },
    },
    addLatencyTM99Alarm: {
      Warning: {
        maxLatency: Duration.millis(299),
        datapointsToAlarm: 299,
      },
    },
    addLatencyTM999Alarm: {
      Warning: {
        maxLatency: Duration.millis(2999),
        datapointsToAlarm: 2999,
      },
    },
    addLatencyTM9999Alarm: {
      Warning: {
        maxLatency: Duration.millis(29999),
        datapointsToAlarm: 29999,
      },
    },
    addLatencyAverageAlarm: {
      Warning: {
        maxLatency: Duration.millis(20),
        datapointsToAlarm: 20,
      },
    },
    addLowTpsAlarm: {
      Warning: { minTps: 1 },
    },
    addHighTpsAlarm: {
      Warning: { maxTps: 10 },
    },
    useCreatedAlarms: {
      consume(alarms: AlarmWithAnnotation[]) {
        numAlarmsCreated = alarms.length;
      },
    },
  });

  addMonitoringDashboardsToStack(stack, monitoring);
  expect(numAlarmsCreated).toStrictEqual(22);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});
