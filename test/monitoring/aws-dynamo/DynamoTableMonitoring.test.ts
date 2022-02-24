import { SynthUtils } from "@monocdk-experiment/assert";
import { Duration, Stack } from "monocdk";
import { AttributeType, Table } from "monocdk/aws-dynamodb";

import { AlarmWithAnnotation, DynamoTableMonitoring } from "../../../lib";
import { TestMonitoringScope } from "../TestMonitoringScope";

test("snapshot test: no alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const table = new Table(stack, "Table", {
    tableName: "DummyTable",
    partitionKey: {
      name: "id",
      type: AttributeType.STRING,
    },
  });

  new DynamoTableMonitoring(scope, {
    table,
  });

  // alternative: use reference

  new DynamoTableMonitoring(scope, {
    table: Table.fromTableAttributes(stack, "DummyTableRef", {
      tableName: "DummyTableRef",
    }),
  });

  expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});

test("snapshot test: all alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const table = new Table(stack, "Table", {
    tableName: "DummyTable",
    partitionKey: {
      name: "id",
      type: AttributeType.STRING,
    },
  });

  let numAlarmsCreated = 0;

  new DynamoTableMonitoring(scope, {
    table,
    addConsumedWriteCapacityAlarm: {
      Warning: {
        maxConsumedCapacityUnits: 100,
        evaluationPeriods: 6,
      },
    },
    addConsumedReadCapacityAlarm: {
      Warning: {
        maxConsumedCapacityUnits: 100,
        evaluationPeriods: 7,
      },
    },
    addSystemErrorCountAlarm: {
      Warning: {
        maxErrorCount: 5,
        evaluationPeriods: 8,
      },
    },
    addReadThrottledEventsCountAlarm: {
      Warning: {
        maxThrottledEventsThreshold: 5,
      },
    },
    addWriteThrottledEventsCountAlarm: {
      Warning: {
        maxThrottledEventsThreshold: 5,
      },
    },
    addAverageSuccessfulGetRecordsLatencyAlarm: {
      Warning: {
        maxLatency: Duration.millis(500),
      },
    },
    addAverageSuccessfulQueryLatencyAlarm: {
      Warning: {
        maxLatency: Duration.millis(501),
      },
    },
    addAverageSuccessfulScanLatencyAlarm: {
      Warning: {
        maxLatency: Duration.millis(502),
      },
    },
    addAverageSuccessfulPutItemLatencyAlarm: {
      Warning: {
        maxLatency: Duration.millis(503),
      },
    },
    addAverageSuccessfulGetItemLatencyAlarm: {
      Warning: {
        maxLatency: Duration.millis(504),
      },
    },
    addAverageSuccessfulUpdateItemLatencyAlarm: {
      Warning: {
        maxLatency: Duration.millis(505),
      },
    },
    addAverageSuccessfulDeleteItemLatencyAlarm: {
      Warning: {
        maxLatency: Duration.millis(506),
      },
    },
    addAverageSuccessfulBatchGetItemLatencyAlarm: {
      Warning: {
        maxLatency: Duration.millis(507),
      },
    },
    addAverageSuccessfulBatchWriteItemLatencyAlarm: {
      Warning: {
        maxLatency: Duration.millis(508),
      },
    },
    useCreatedAlarms: {
      consume(alarms: AlarmWithAnnotation[]) {
        numAlarmsCreated = alarms.length;
      },
    },
  });

  expect(numAlarmsCreated).toStrictEqual(14);
  expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});
