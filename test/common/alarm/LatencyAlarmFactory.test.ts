import { Duration, Stack } from "aws-cdk-lib";
import { Metric } from "aws-cdk-lib/aws-cloudwatch";
import { Construct } from "constructs";

import {
  AlarmFactory,
  AlarmFactoryDefaults,
  LatencyAlarmFactory,
  LatencyType,
  MetricFactoryDefaults,
  noopAction,
} from "../../../lib";

const stack = new Stack();
const construct = new Construct(stack, "SampleConstruct");

const globalMetricDefaults: MetricFactoryDefaults = {
  namespace: "DummyNamespace",
};
const globalAlarmDefaults: AlarmFactoryDefaults = {
  alarmNamePrefix: "DummyServiceAlarms",
  actionsEnabled: true,
  datapointsToAlarm: 6,
  // we do not care about alarm actions in this test
  action: noopAction(),
};
const factory = new AlarmFactory(construct, {
  globalMetricDefaults,
  globalAlarmDefaults,
  localAlarmNamePrefix: "prefix",
});

const metric = new Metric({
  metricName: "DummyMetric1",
  namespace: "DummyCustomNamespace",
  dimensionsMap: { CustomDimension: "CustomDimensionValue" },
});

const latencyAlarmFactory = new LatencyAlarmFactory(factory);

test("addLatencyAlarm: non-integral millisecond thresholds do not throw error", () => {
  latencyAlarmFactory.addLatencyAlarm(metric, LatencyType.P99, {
    maxLatency: Duration.millis(0.5),
  });
});

test("addIntegrationLatencyAlarm: non-integral millisecond thresholds do not throw error", () => {
  latencyAlarmFactory.addIntegrationLatencyAlarm(metric, LatencyType.P99, {
    maxLatency: Duration.millis(2.5),
  });
});

test("addDurationAlarm: non-integral millisecond durations do not throw error", () => {
  latencyAlarmFactory.addDurationAlarm(metric, LatencyType.P99, {
    maxDuration: Duration.millis(0.5),
  });
});

test("addJvmGarbageCollectionDurationAlarm: non-integral millisecond durations do not throw error", () => {
  latencyAlarmFactory.addJvmGarbageCollectionDurationAlarm(
    metric,
    LatencyType.P99,
    {
      maxDuration: Duration.millis(2.5),
    },
  );
});
