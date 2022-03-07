import { Duration, Stack } from "monocdk";
import { Template } from "monocdk/assertions";
import { RestApi } from "monocdk/aws-apigateway";

import { AlarmWithAnnotation, ApiGatewayMonitoring } from "../../../lib";
import { TestMonitoringScope } from "../TestMonitoringScope";

test("snapshot test: no alarms", () => {
  const stack = new Stack();
  const api = new RestApi(stack, "DummyApi");
  api.root.addMethod("ANY");

  const scope = new TestMonitoringScope(stack, "Scope");

  new ApiGatewayMonitoring(scope, {
    api,
    humanReadableName: "Dummy API Gateway for testing",
    alarmFriendlyName: "DummyApi",
  });

  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot test: all alarms", () => {
  const stack = new Stack();
  const api = new RestApi(stack, "DummyApi");
  api.root.addMethod("ANY");

  const scope = new TestMonitoringScope(stack, "Scope");

  let numAlarmsCreated = 0;

  new ApiGatewayMonitoring(scope, {
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
        maxLatency: Duration.millis(110),
        datapointsToAlarm: 11,
      },
    },
    addLatencyP90Alarm: {
      Warning: {
        maxLatency: Duration.millis(220),
        datapointsToAlarm: 22,
      },
    },
    addLatencyP99Alarm: {
      Warning: {
        maxLatency: Duration.millis(330),
        datapointsToAlarm: 33,
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

  expect(numAlarmsCreated).toStrictEqual(9);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot test: all alarms without alarmFriendlyName", () => {
  const stack = new Stack();
  const api = new RestApi(stack, "DummyApi");
  api.root.addMethod("ANY");

  const scope = new TestMonitoringScope(stack, "Scope");

  let numAlarmsCreated = 0;

  new ApiGatewayMonitoring(scope, {
    api,
    apiMethod: "GET",
    apiResource: "dummy/resource",
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
        maxLatency: Duration.millis(110),
        datapointsToAlarm: 11,
      },
    },
    addLatencyP90Alarm: {
      Warning: {
        maxLatency: Duration.millis(220),
        datapointsToAlarm: 22,
      },
    },
    addLatencyP99Alarm: {
      Warning: {
        maxLatency: Duration.millis(330),
        datapointsToAlarm: 33,
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

  expect(numAlarmsCreated).toStrictEqual(9);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});
