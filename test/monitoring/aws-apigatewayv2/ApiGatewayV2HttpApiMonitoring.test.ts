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
    addIntegrationLatencyP50Alarm: {
      Warning: {
        maxLatency: Duration.millis(150),
        datapointsToAlarm: 150,
      },
    },
    addIntegrationLatencyP70Alarm: {
      Warning: {
        maxLatency: Duration.millis(170),
        datapointsToAlarm: 170,
      },
    },
    addIntegrationLatencyP90Alarm: {
      Warning: {
        maxLatency: Duration.millis(190),
        datapointsToAlarm: 190,
      },
    },
    addIntegrationLatencyP95Alarm: {
      Warning: {
        maxLatency: Duration.millis(195),
        datapointsToAlarm: 195,
      },
    },
    addIntegrationLatencyP99Alarm: {
      Warning: {
        maxLatency: Duration.millis(199),
        datapointsToAlarm: 199,
      },
    },
    addIntegrationLatencyP999Alarm: {
      Warning: {
        maxLatency: Duration.millis(1999),
        datapointsToAlarm: 1999,
      },
    },
    addIntegrationLatencyP9999Alarm: {
      Warning: {
        maxLatency: Duration.millis(19999),
        datapointsToAlarm: 19999,
      },
    },
    addIntegrationLatencyP100Alarm: {
      Warning: {
        maxLatency: Duration.millis(1100),
        datapointsToAlarm: 1100,
      },
    },
    addIntegrationLatencyTM50Alarm: {
      Warning: {
        maxLatency: Duration.millis(250),
        datapointsToAlarm: 250,
      },
    },
    addIntegrationLatencyTM70Alarm: {
      Warning: {
        maxLatency: Duration.millis(270),
        datapointsToAlarm: 270,
      },
    },
    addIntegrationLatencyTM90Alarm: {
      Warning: {
        maxLatency: Duration.millis(290),
        datapointsToAlarm: 290,
      },
    },
    addIntegrationLatencyTM95Alarm: {
      Warning: {
        maxLatency: Duration.millis(295),
        datapointsToAlarm: 295,
      },
    },
    addIntegrationLatencyTM99Alarm: {
      Warning: {
        maxLatency: Duration.millis(299),
        datapointsToAlarm: 299,
      },
    },
    addIntegrationLatencyTM999Alarm: {
      Warning: {
        maxLatency: Duration.millis(2999),
        datapointsToAlarm: 2999,
      },
    },
    addIntegrationLatencyTM9999Alarm: {
      Warning: {
        maxLatency: Duration.millis(29999),
        datapointsToAlarm: 29999,
      },
    },
    addIntegrationLatencyAverageAlarm: {
      Warning: {
        maxLatency: Duration.millis(20),
        datapointsToAlarm: 20,
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

  expect(numAlarmsCreated).toStrictEqual(38);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});
