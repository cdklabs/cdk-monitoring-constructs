import { Duration, Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { TreatMissingData } from "aws-cdk-lib/aws-cloudwatch";
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";

import { AlarmWithAnnotation, DynamoTableMonitoring } from "../../../lib";
import { addMonitoringDashboardsToStack } from "../../utils/SnapshotUtil";
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

  const monitoring = new DynamoTableMonitoring(scope, {
    table,
  });

  addMonitoringDashboardsToStack(stack, monitoring);
  expect(Template.fromStack(stack)).toMatchSnapshot();
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

  const monitoring = new DynamoTableMonitoring(scope, {
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
    addMinTimeToLiveDeletedItemCountAlarm: {
      Warning: {
        minCount: 5,
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

  addMonitoringDashboardsToStack(stack, monitoring);
  expect(numAlarmsCreated).toStrictEqual(15);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot test: pay-per-request, no alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const table = new Table(stack, "Table", {
    tableName: "DummyTable",
    billingMode: BillingMode.PAY_PER_REQUEST,
    partitionKey: {
      name: "id",
      type: AttributeType.STRING,
    },
  });

  const monitoring = new DynamoTableMonitoring(scope, {
    table,
  });

  addMonitoringDashboardsToStack(stack, monitoring);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot test: pay-per-request, all alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const table = new Table(stack, "Table", {
    tableName: "DummyTable",
    billingMode: BillingMode.PAY_PER_REQUEST,
    partitionKey: {
      name: "id",
      type: AttributeType.STRING,
    },
  });

  let numAlarmsCreated = 0;

  const monitoring = new DynamoTableMonitoring(scope, {
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
    addMinTimeToLiveDeletedItemCountAlarm: {
      Warning: {
        minCount: 5,
        treatMissingDataOverride: TreatMissingData.MISSING,
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

  addMonitoringDashboardsToStack(stack, monitoring);
  expect(numAlarmsCreated).toStrictEqual(15);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});
