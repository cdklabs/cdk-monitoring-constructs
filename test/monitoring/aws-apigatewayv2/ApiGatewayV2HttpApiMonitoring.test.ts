import { Duration, Stack } from "monocdk";
import { Template } from "monocdk/assertions";
import { HttpApi } from "monocdk/aws-apigatewayv2";

import {
  AlarmWithAnnotation,
  ApiGatewayV2HttpApiMonitoring,
} from "../../../lib";
import { TestMonitoringScope } from "../TestMonitoringScope";

test("snapshot test: no alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const testHttpApi = new HttpApi(stack, "testHttpApi", {
    apiName: "testHttpApi",
  });

  new ApiGatewayV2HttpApiMonitoring(scope, {
    api: testHttpApi,
    humanReadableName: "Dummy API Gateway for testing",
    alarmFriendlyName: "DummyApi",
  });

  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot test: all alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  let numAlarmsCreated = 0;

  const testHttpApi = new HttpApi(stack, "testHttpApi", {
    apiName: "testHttpApi",
  });

  new ApiGatewayV2HttpApiMonitoring(scope, {
    api: testHttpApi,
    humanReadableName: "Dummy API Gateway for testing",
    alarmFriendlyName: "DummyApi",
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
    addIntegrationLatencyP50Alarm: {
      Critical: {
        maxLatency: Duration.millis(110),
        datapointsToAlarm: 11,
      },
    },
    addIntegrationLatencyP90Alarm: {
      Critical: {
        maxLatency: Duration.millis(220),
        datapointsToAlarm: 22,
      },
    },
    addIntegrationLatencyP99Alarm: {
      Critical: {
        maxLatency: Duration.millis(330),
        datapointsToAlarm: 33,
      },
    },
    add4xxCountAlarm: {
      Warning: {
        maxErrorCount: 0.02,
        datapointsToAlarm: 10,
      },
    },
    add4xxRateAlarm: {
      Warning: {
        maxErrorRate: 0.01,
        datapointsToAlarm: 20,
      },
    },
    add5xxCountAlarm: {
      Warning: {
        maxErrorCount: 2,
        datapointsToAlarm: 11,
      },
    },
    add5xxRateAlarm: {
      Warning: {
        maxErrorRate: 1,
        datapointsToAlarm: 22,
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

  expect(numAlarmsCreated).toStrictEqual(12);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});
