import { Duration, Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { Color, ComparisonOperator } from "aws-cdk-lib/aws-cloudwatch";
import {
  Function,
  InlineCode,
  LayerVersion,
  Runtime,
} from "aws-cdk-lib/aws-lambda";

import { AlarmWithAnnotation, LambdaFunctionMonitoring } from "../../../lib";
import { addMonitoringDashboardsToStack } from "../../utils/SnapshotUtil";
import { TestMonitoringScope } from "../TestMonitoringScope";

test("snapshot test: default iterator and no alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const lambdaFunction = new Function(stack, "Function", {
    functionName: "DummyLambda",
    runtime: Runtime.NODEJS_18_X,
    code: InlineCode.fromInline("{}"),
    handler: "Dummy::handler",
  });

  const monitoring = new LambdaFunctionMonitoring(scope, {
    lambdaFunction,
    humanReadableName: "Dummy Lambda for testing",
    alarmFriendlyName: "DummyLambda",
  });
  addMonitoringDashboardsToStack(stack, monitoring);

  // alternative: use reference
  new LambdaFunctionMonitoring(scope, {
    lambdaFunction: Function.fromFunctionAttributes(stack, "DummyFunctionRef", {
      functionArn:
        "arn:aws:lambda:us-west-2:123456789012:function:DummyFunctionRef",
    }),
  });

  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot test: non-iterator and no alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const lambdaFunction = new Function(stack, "Function", {
    functionName: "DummyLambda",
    runtime: Runtime.NODEJS_18_X,
    code: InlineCode.fromInline("{}"),
    handler: "Dummy::handler",
  });

  const monitoring = new LambdaFunctionMonitoring(scope, {
    lambdaFunction,
    humanReadableName: "Dummy Lambda for testing",
    alarmFriendlyName: "DummyLambda",
    isIterator: false,
  });

  addMonitoringDashboardsToStack(stack, monitoring);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot test: all alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const lambdaFunction = new Function(stack, "Function", {
    functionName: "DummyLambda",
    runtime: Runtime.NODEJS_18_X,
    code: InlineCode.fromInline("{}"),
    handler: "Dummy::handler",
  });

  let numAlarmsCreated = 0;

  const monitoring = new LambdaFunctionMonitoring(scope, {
    lambdaFunction,
    humanReadableName: "Dummy Lambda for testing",
    alarmFriendlyName: "DummyLambda",
    isOffsetLag: true,
    addFaultRateAlarm: {
      Warning: {
        maxErrorRate: 1,
        datapointsToAlarm: 10,
      },
    },
    addFaultCountAlarm: {
      Warning: {
        maxErrorCount: 2,
        datapointsToAlarm: 20,
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
    addMaxLatencyAlarm: {
      Warning: {
        maxLatency: Duration.seconds(60),
      },
    },
    addLowTpsAlarm: {
      Warning: {
        minTps: 0,
        datapointsToAlarm: 1,
        comparisonOperatorOverride:
          ComparisonOperator.LESS_THAN_OR_EQUAL_TO_THRESHOLD,
      },
    },
    addHighTpsAlarm: {
      Warning: {
        maxTps: 20,
        datapointsToAlarm: 1,
      },
    },
    addThrottlesRateAlarm: {
      Warning: {
        maxErrorRate: 1,
        datapointsToAlarm: 10,
      },
    },
    addThrottlesCountAlarm: {
      Warning: {
        maxErrorCount: 2,
        datapointsToAlarm: 20,
      },
    },
    addMinInvocationsCountAlarm: {
      Warning: {
        minCount: 5,
        datapointsToAlarm: 30,
      },
    },
    addConcurrentExecutionsCountAlarm: {
      Warning: {
        maxRunningTasks: 10,
      },
    },
    addProvisionedConcurrencySpilloverInvocationsCountAlarm: {
      Critical: {
        maxRunningTasks: 5,
      },
    },
    addMaxIteratorAgeAlarm: {
      Warning: {
        maxAgeInMillis: 1_000_000,
      },
    },
    addMaxOffsetLagAlarm: {
      Warning: {
        maxOffsetLag: 100,
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

test("snapshot test: all alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const lambdaFunction = new Function(stack, "Function", {
    functionName: "DummyLambda",
    runtime: Runtime.NODEJS_18_X,
    code: InlineCode.fromInline("{}"),
    handler: "Dummy::handler",
    layers: [
      LayerVersion.fromLayerVersionArn(
        stack,
        "LambdaInsightsEnhancedMonitoring",
        `arn:aws:lambda:us-west-1:580247275435:layer:LambdaInsightsExtension:14`,
      ),
    ],
  });

  new LambdaFunctionMonitoring(scope, {
    lambdaFunction,
    humanReadableName: "Dummy Lambda for testing",
    alarmFriendlyName: "DummyLambda",
    lambdaInsightsEnabled: true,
  });

  const lambdaFunctionAlias = lambdaFunction.addAlias("live", {
    provisionedConcurrentExecutions: 1,
  });

  new LambdaFunctionMonitoring(scope, {
    lambdaFunction: lambdaFunctionAlias,
    humanReadableName: "Dummy Lambda for testing",
    alarmFriendlyName: "DummyLambda",
    lambdaInsightsEnabled: true,
  });

  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot test: all alarms, alarmPrefix on error dedupeString", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const lambdaFunction = new Function(stack, "Function", {
    functionName: "DummyLambda",
    runtime: Runtime.NODEJS_18_X,
    code: InlineCode.fromInline("{}"),
    handler: "Dummy::handler",
  });

  let numAlarmsCreated = 0;

  const monitoring = new LambdaFunctionMonitoring(scope, {
    lambdaFunction,
    humanReadableName: "Dummy Lambda for testing",
    alarmFriendlyName: "DummyLambda",
    lambdaInsightsEnabled: true,
    addFaultRateAlarm: {
      Warning: {
        maxErrorRate: 1,
        datapointsToAlarm: 10,
        overrideAnnotationVisibility: false,
      },
    },
    addFaultCountAlarm: {
      Warning: {
        maxErrorCount: 2,
        datapointsToAlarm: 20,
        overrideAnnotationColor: Color.BROWN,
        overrideAnnotationLabel: "Custom annotation label",
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
    addMaxLatencyAlarm: {
      Warning: {
        maxLatency: Duration.seconds(60),
      },
    },
    addLowTpsAlarm: {
      Warning: {
        minTps: 0,
        datapointsToAlarm: 1,
        comparisonOperatorOverride:
          ComparisonOperator.LESS_THAN_OR_EQUAL_TO_THRESHOLD,
      },
    },
    addHighTpsAlarm: {
      Warning: {
        maxTps: 20,
        datapointsToAlarm: 1,
      },
    },
    addThrottlesRateAlarm: {
      Warning: {
        maxErrorRate: 1,
        datapointsToAlarm: 10,
      },
    },
    addThrottlesCountAlarm: {
      Warning: {
        maxErrorCount: 2,
        datapointsToAlarm: 20,
      },
    },
    addMinInvocationsCountAlarm: {
      Warning: {
        minCount: 5,
        datapointsToAlarm: 30,
      },
    },
    addConcurrentExecutionsCountAlarm: {
      Warning: {
        maxRunningTasks: 10,
      },
    },
    addProvisionedConcurrencySpilloverInvocationsCountAlarm: {
      Critical: {
        maxRunningTasks: 5,
      },
    },
    addMaxIteratorAgeAlarm: {
      Warning: {
        maxAgeInMillis: 1_000_000,
      },
    },
    addEnhancedMonitoringMaxCpuTotalTimeAlarm: {
      Warning: {
        maxDuration: Duration.millis(100),
      },
    },
    addEnhancedMonitoringP90CpuTotalTimeAlarm: {
      Warning: {
        maxDuration: Duration.millis(100),
      },
    },
    addEnhancedMonitoringAvgCpuTotalTimeAlarm: {
      Warning: {
        maxDuration: Duration.millis(100),
      },
    },
    addEnhancedMonitoringMaxMemoryUtilizationAlarm: {
      Warning: {
        maxUsagePercent: 50,
      },
    },
    addEnhancedMonitoringP90MemoryUtilizationAlarm: {
      Warning: {
        maxUsagePercent: 50,
      },
    },
    addEnhancedMonitoringAvgMemoryUtilizationAlarm: {
      Warning: {
        maxUsagePercent: 50,
      },
    },
    useCreatedAlarms: {
      consume(alarms: AlarmWithAnnotation[]) {
        numAlarmsCreated = alarms.length;
      },
    },
  });

  addMonitoringDashboardsToStack(stack, monitoring);
  expect(numAlarmsCreated).toStrictEqual(20);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot test: all alarms, alarmPrefix on latency dedupeString", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const lambdaFunction = new Function(stack, "Function", {
    functionName: "DummyLambda",
    runtime: Runtime.NODEJS_18_X,
    code: InlineCode.fromInline("{}"),
    handler: "Dummy::handler",
  });

  let numAlarmsCreated = 0;

  const monitoring = new LambdaFunctionMonitoring(scope, {
    lambdaFunction,
    humanReadableName: "Dummy Lambda for testing",
    alarmFriendlyName: "DummyLambda",
    lambdaInsightsEnabled: true,
    addFaultRateAlarm: {
      Warning: {
        maxErrorRate: 1,
        datapointsToAlarm: 10,
      },
    },
    addFaultCountAlarm: {
      Warning: {
        maxErrorCount: 2,
        datapointsToAlarm: 20,
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
    addMaxLatencyAlarm: {
      Warning: {
        maxLatency: Duration.seconds(60),
      },
    },
    addLowTpsAlarm: {
      Warning: {
        minTps: 0,
        datapointsToAlarm: 1,
        comparisonOperatorOverride:
          ComparisonOperator.LESS_THAN_OR_EQUAL_TO_THRESHOLD,
      },
    },
    addHighTpsAlarm: {
      Warning: {
        maxTps: 20,
        datapointsToAlarm: 1,
      },
    },
    addThrottlesRateAlarm: {
      Warning: {
        maxErrorRate: 1,
        datapointsToAlarm: 10,
      },
    },
    addThrottlesCountAlarm: {
      Warning: {
        maxErrorCount: 2,
        datapointsToAlarm: 20,
      },
    },
    addMinInvocationsCountAlarm: {
      Warning: {
        minCount: 5,
        datapointsToAlarm: 30,
      },
    },
    addConcurrentExecutionsCountAlarm: {
      Warning: {
        maxRunningTasks: 10,
      },
    },
    addProvisionedConcurrencySpilloverInvocationsCountAlarm: {
      Critical: {
        maxRunningTasks: 5,
      },
    },
    addMaxIteratorAgeAlarm: {
      Warning: {
        maxAgeInMillis: 1_000_000,
      },
    },
    addEnhancedMonitoringMaxCpuTotalTimeAlarm: {
      Warning: {
        maxDuration: Duration.millis(100),
      },
    },
    addEnhancedMonitoringP90CpuTotalTimeAlarm: {
      Warning: {
        maxDuration: Duration.millis(100),
      },
    },
    addEnhancedMonitoringAvgCpuTotalTimeAlarm: {
      Warning: {
        maxDuration: Duration.millis(100),
      },
    },
    addEnhancedMonitoringMaxMemoryUtilizationAlarm: {
      Warning: {
        maxUsagePercent: 50,
      },
    },
    addEnhancedMonitoringP90MemoryUtilizationAlarm: {
      Warning: {
        maxUsagePercent: 50,
      },
    },
    addEnhancedMonitoringAvgMemoryUtilizationAlarm: {
      Warning: {
        maxUsagePercent: 50,
      },
    },
    useCreatedAlarms: {
      consume(alarms: AlarmWithAnnotation[]) {
        numAlarmsCreated = alarms.length;
      },
    },
  });

  addMonitoringDashboardsToStack(stack, monitoring);
  expect(numAlarmsCreated).toStrictEqual(20);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("throws error if attempting to create iterator age alarm if not an iterator", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const lambdaFunction = new Function(stack, "Function", {
    functionName: "DummyLambda",
    runtime: Runtime.NODEJS_18_X,
    code: InlineCode.fromInline("{}"),
    handler: "Dummy::handler",
  });

  expect(
    () =>
      new LambdaFunctionMonitoring(scope, {
        lambdaFunction,
        humanReadableName: "Dummy Lambda for testing",
        alarmFriendlyName: "DummyLambda",
        isIterator: false,
        addMaxIteratorAgeAlarm: {
          Warning: {
            maxAgeInMillis: 1_000_000,
          },
        },
      }),
  ).toThrow(
    "addMaxIteratorAgeAlarm is not applicable if isIterator is not true",
  );
});

test("throws error if attempting to create offsetLag alarm if not an offsetLag Lambda", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const lambdaFunction = new Function(stack, "Function", {
    functionName: "DummyLambda",
    runtime: Runtime.NODEJS_18_X,
    code: InlineCode.fromInline("{}"),
    handler: "Dummy::handler",
  });

  expect(
    () =>
      new LambdaFunctionMonitoring(scope, {
        lambdaFunction,
        humanReadableName: "Dummy Lambda for testing",
        alarmFriendlyName: "DummyLambda",
        addMaxOffsetLagAlarm: {
          Warning: {
            maxOffsetLag: 100,
          },
        },
      }),
  ).toThrow(
    "addMaxOffsetLagAlarm is not applicable if isOffsetLag is not true",
  );
});

test("doesn't create alarms for enhanced Lambda Insights metrics if not enabled", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const lambdaFunction = new Function(stack, "Function", {
    functionName: "DummyLambda",
    runtime: Runtime.NODEJS_18_X,
    code: InlineCode.fromInline("{}"),
    handler: "Dummy::handler",
  });

  let numAlarmsCreated = 0;

  new LambdaFunctionMonitoring(scope, {
    lambdaFunction,
    humanReadableName: "Dummy Lambda for testing",
    alarmFriendlyName: "DummyLambda",
    lambdaInsightsEnabled: false,
    addEnhancedMonitoringMaxCpuTotalTimeAlarm: {
      Warning: {
        maxDuration: Duration.millis(100),
      },
    },
    addEnhancedMonitoringP90CpuTotalTimeAlarm: {
      Warning: {
        maxDuration: Duration.millis(100),
      },
    },
    addEnhancedMonitoringAvgCpuTotalTimeAlarm: {
      Warning: {
        maxDuration: Duration.millis(100),
      },
    },
    addEnhancedMonitoringMaxMemoryUtilizationAlarm: {
      Warning: {
        maxUsagePercent: 50,
      },
    },
    addEnhancedMonitoringP90MemoryUtilizationAlarm: {
      Warning: {
        maxUsagePercent: 50,
      },
    },
    addEnhancedMonitoringAvgMemoryUtilizationAlarm: {
      Warning: {
        maxUsagePercent: 50,
      },
    },
    useCreatedAlarms: {
      consume(alarms: AlarmWithAnnotation[]) {
        numAlarmsCreated = alarms.length;
      },
    },
  });

  expect(numAlarmsCreated).toStrictEqual(0);
});
