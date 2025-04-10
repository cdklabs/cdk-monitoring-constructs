import { Duration, Stack } from "aws-cdk-lib";
import { Match, Template } from "aws-cdk-lib/assertions";
import { RestApi } from "aws-cdk-lib/aws-apigateway";
import { Topic } from "aws-cdk-lib/aws-sns";
import {
  AlarmWithAnnotation,
  ElastiCacheClusterType,
  MonitoringFacade,
  ScaleAlarms,
  ScaleAlarmsProps,
  noopAction,
  notifySns,
} from "../../../lib";

test("Given threshold multiplier, creates cloned monitors with more aggressive thresholds.", () => {
  const resources = makeFacade();

  addMonitors(resources);
  const clonedAlarms = resources.facade.cloneAlarms(
    resources.facade.createdAlarmsWithDisambiguator("Critical"),
    ScaleAlarms({
      disambiguator: "Rollback",
      thresholdMultiplier: 0.9,
    }),
  );

  verify(resources, clonedAlarms, {
    disambiguator: "Rollback",
    thresholdMultiplier: 0.9,
  });
});

test("Given threshold multiplier greater than 1.0, creates cloned monitors with more lax thresholds.", () => {
  const resources = makeFacade();

  addMonitors(resources);
  const clonedAlarms = resources.facade.cloneAlarms(
    resources.facade.createdAlarmsWithDisambiguator("Critical"),
    ScaleAlarms({
      disambiguator: "Rollback",
      thresholdMultiplier: 1.5,
    }),
  );

  verify(resources, clonedAlarms, {
    disambiguator: "Rollback",
    thresholdMultiplier: 1.5,
  });
});

test("Given datapointsToAlarm multiplier, creates cloned monitors with more aggressive datapoints to alarm and evaluation periods.", () => {
  const resources = makeFacade();

  addMonitors(resources);
  const clonedAlarms = resources.facade.cloneAlarms(
    resources.facade.createdAlarmsWithDisambiguator("Critical"),
    ScaleAlarms({
      disambiguator: "Rollback",
      datapointsToAlarmMultiplier: 0.3,
    }),
  );

  verify(resources, clonedAlarms, {
    disambiguator: "Rollback",
    datapointsToAlarmMultiplier: 0.3,
  });
});

test("Given datapointsToAlarm and evaluationPeriods multiplier, creates cloned monitors with more aggressive datapoints to alarm and evaluation periods.", () => {
  const resources = makeFacade();

  addMonitors(resources);
  const clonedAlarms = resources.facade.cloneAlarms(
    resources.facade.createdAlarmsWithDisambiguator("Critical"),
    ScaleAlarms({
      disambiguator: "Rollback",
      datapointsToAlarmMultiplier: 0.3,
      evaluationPeriodsMultiplier: 0.5,
    }),
  );

  verify(resources, clonedAlarms, {
    disambiguator: "Rollback",
    datapointsToAlarmMultiplier: 0.3,
    evaluationPeriodsMultiplier: 0.5,
  });
});

test("Given all inputs, creates cloned monitors with more aggressive properties.", () => {
  const resources = makeFacade();

  addMonitors(resources);
  const clonedAlarms = resources.facade.cloneAlarms(
    resources.facade.createdAlarmsWithDisambiguator("Critical"),
    ScaleAlarms({
      disambiguator: "Rollback",
      thresholdMultiplier: 0.8,
      datapointsToAlarmMultiplier: 0.3,
      evaluationPeriodsMultiplier: 0.5,
    }),
  );

  verify(resources, clonedAlarms, {
    disambiguator: "Rollback",
    thresholdMultiplier: 0.8,
    datapointsToAlarmMultiplier: 0.3,
    evaluationPeriodsMultiplier: 0.5,
  });
});

interface TestResources {
  readonly stack: Stack;
  readonly facade: MonitoringFacade;
  readonly onCriticalTopic: Topic;
  readonly onWarningTopic: Topic;
}

function makeFacade(): TestResources {
  const stack = new Stack();
  const onCriticalTopic = new Topic(stack, "OnCriticalTopic", {
    topicName: "Criticals",
  });
  const onWarningTopic = new Topic(stack, "OnWarningTopic", {
    topicName: "Warnings",
  });
  const facade = new MonitoringFacade(stack, "MonitoringFacade", {
    metricFactoryDefaults: {
      namespace: "MyNamespace",
    },
    alarmFactoryDefaults: {
      actionsEnabled: true,
      alarmNamePrefix: "MyApp",
      datapointsToAlarm: 5,
      disambiguatorAction: {
        Critical: notifySns(onCriticalTopic),
        Warning: notifySns(onWarningTopic),
      },
    },
  });

  return {
    stack,
    facade,
    onCriticalTopic,
    onWarningTopic,
  };
}

function addMonitors(resources: TestResources) {
  resources.facade
    .addLargeHeader("My App Dashboard")
    .monitorApiGateway({
      api: RestApi.fromRestApiId(
        resources.stack,
        "ImportedRestApi",
        "MyRestApiId",
      ),
      add5XXFaultCountAlarm: {
        Critical: {
          maxErrorCount: 10,
        },
      },
      addLowTpsAlarm: {
        Critical: {
          minTps: 100,
        },
      },
      addLatencyP90Alarm: {
        Critical: {
          maxLatency: Duration.millis(750),
        },
      },
      addHighTpsAlarm: {
        Critical: {
          maxTps: 1000,
          period: Duration.minutes(60),
          datapointsToAlarm: 2,
        },
      },
    })
    .monitorElastiCacheCluster({
      clusterType: ElastiCacheClusterType.REDIS,
      addRedisEngineCpuUsageAlarm: {
        Critical: {
          maxUsagePercent: 0.85,
        },
        Warning: {
          maxUsagePercent: 0.7,
        },
      },
      addMaxEvictedItemsCountAlarm: {
        Warning: {
          maxItemsCount: 100,
        },
      },
    });
}

function verify(
  resources: TestResources,
  actualClonedAlarms: AlarmWithAnnotation[],
  expectedCloneConfiguration: ScaleAlarmsProps,
) {
  const facade = resources.facade;
  // Verify the requested monitors are created.
  expect(new Set(facade.createdAlarms().map((a) => a.disambiguator))).toEqual(
    new Set(["Critical", "Warning", "Rollback"]),
  );
  const criticalAlarms = facade.createdAlarmsWithDisambiguator("Critical");
  const expectedNumberOfCriticalAlarms = 5;
  expect(criticalAlarms.length).toBe(expectedNumberOfCriticalAlarms);
  expect(criticalAlarms.map((a) => a.action)).toEqual(
    expect.arrayContaining(
      Array(expectedNumberOfCriticalAlarms).fill(
        notifySns(resources.onCriticalTopic),
      ),
    ),
  );
  const warningAlarms = facade.createdAlarmsWithDisambiguator("Warning");
  const expectedNumberOfWarningAlarms = 2;
  expect(warningAlarms.length).toBe(expectedNumberOfWarningAlarms);
  expect(warningAlarms.map((a) => a.action)).toEqual(
    expect.arrayContaining(
      Array(expectedNumberOfWarningAlarms).fill(
        notifySns(resources.onWarningTopic),
      ),
    ),
  );

  // Verify the cloned monitors are also created.
  expect(actualClonedAlarms.length).toBe(expectedNumberOfCriticalAlarms);
  expect(actualClonedAlarms.map((a) => a.action)).toEqual(
    expect.arrayContaining(
      Array(expectedNumberOfCriticalAlarms).fill(noopAction()),
    ),
  );
  expect(actualClonedAlarms.map((a) => a.disambiguator)).toEqual(
    expect.arrayContaining(
      Array(expectedNumberOfCriticalAlarms).fill("Rollback"),
    ),
  );
  expect(facade.createdAlarmsWithDisambiguator("Rollback")).toEqual(
    actualClonedAlarms,
  );

  // Verify the templated alarms have the expected number of evaluation periods,
  // datapoints to alarm, and thresholds for both the requested alarms and their
  // clones (adjusted as configured).
  const template = Template.fromStack(resources.stack);

  const templateCriticalAlarms = template.findResources(
    "AWS::CloudWatch::Alarm",
    {
      Properties: {
        AlarmName: Match.stringLikeRegexp("-Critical$"),
        ActionsEnabled: true,
        AlarmActions: Match.anyValue(),
        AlarmDescription: Match.anyValue(),
        ComparisonOperator: Match.anyValue(),
        DatapointsToAlarm: Match.anyValue(),
        EvaluationPeriods: Match.anyValue(),
        Metrics: Match.anyValue(),
        Threshold: Match.anyValue(),
        TreatMissingData: Match.anyValue(),
      },
    },
  );

  // Expect cloned alarms to match the requested alarms in all ways
  // except for the configured variations.
  // Loop through each requested alarm and verify that a corresponding
  // clone exists with the expected properties.
  Object.values(templateCriticalAlarms).forEach((requestedAlarmCfn) => {
    const correspondingClones = template.findResources(
      "AWS::CloudWatch::Alarm",
      {
        Properties: {
          AlarmName: requestedAlarmCfn.Properties.AlarmName.replace(
            /-Critical$/,
            "-Rollback",
          ),
        },
      },
    );
    expect(Object.values(correspondingClones).length).toBe(1);
    const clonedAlarmCfn = Object.values(correspondingClones)[0];

    expect(clonedAlarmCfn.Properties.AlarmActions).toBe(undefined);

    const requestedPeriod = getMetricPeriod(
      requestedAlarmCfn.Properties.Metrics,
    );
    const clonedPeriod = getMetricPeriod(clonedAlarmCfn.Properties.Metrics);
    expect(clonedPeriod).toBeLessThanOrEqual(requestedPeriod);

    const scalingFactor = requestedPeriod / clonedPeriod;

    const expectedEvaluationPeriodMultiplier =
      expectedCloneConfiguration.evaluationPeriodsMultiplier ??
      expectedCloneConfiguration.datapointsToAlarmMultiplier ??
      1;
    const expectedEvaluationPeriods =
      requestedAlarmCfn.Properties.EvaluationPeriods *
      expectedEvaluationPeriodMultiplier *
      scalingFactor;
    expect(clonedAlarmCfn.Properties.EvaluationPeriods).toEqual(
      Math.round(expectedEvaluationPeriods),
    );

    const expectedDatapointsToAlarmMultiplier =
      expectedCloneConfiguration.datapointsToAlarmMultiplier ?? 1;
    const expectedDatapointsToAlarm =
      requestedAlarmCfn.Properties.DatapointsToAlarm *
      expectedDatapointsToAlarmMultiplier *
      scalingFactor;
    expect(clonedAlarmCfn.Properties.DatapointsToAlarm).toEqual(
      Math.round(expectedDatapointsToAlarm),
    );

    const thresholdMultiplierToUse =
      getThresholdMultiplierForTightening(
        requestedAlarmCfn.Properties.ComparisonOperator,
        expectedCloneConfiguration.thresholdMultiplier,
      ) *
      getThresholdMultiplierForPeriodScaling(
        requestedAlarmCfn.Properties.Metrics,
        scalingFactor,
      );
    const expectedThreshold =
      requestedAlarmCfn.Properties.Threshold * thresholdMultiplierToUse;
    expect(clonedAlarmCfn.Properties.Threshold).toBeCloseTo(expectedThreshold);

    expect(clonedAlarmCfn.Properties.Metrics).toEqual(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      requestedAlarmCfn.Properties.Metrics.map((mCfn: any) => {
        if (mCfn.MetricStat) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return {
            ...mCfn,
            MetricStat: {
              ...mCfn.MetricStat,
              Period: clonedPeriod,
            },
          };
        } else {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return mCfn;
        }
      }),
    );
  });

  // Snapshot verification
  expect(template).toMatchSnapshot();
}

function getMetricPeriod(metricsCfn: any[]): number {
  const metricsWithPeriod = metricsCfn.filter((m) => m.MetricStat?.Period);
  // Assert that all these metrics are using the same period.
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-non-null-assertion
  expect(new Set(metricsWithPeriod.map((m) => m.MetricStat!.Period)).size).toBe(
    1,
  );
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return metricsWithPeriod[0].MetricStat.Period;
}

function getThresholdMultiplierForTightening(
  monitorComparisonOperatorCfn: string,
  configuredThresholdMultiplier?: number,
) {
  if (!configuredThresholdMultiplier) {
    return 1;
  } else if (
    monitorComparisonOperatorCfn.includes("LessThanLower") ||
    monitorComparisonOperatorCfn.includes("GreaterThanUpper")
  ) {
    return 1;
  } else if (monitorComparisonOperatorCfn.startsWith("LessThan")) {
    return 1 / configuredThresholdMultiplier;
  } else {
    return configuredThresholdMultiplier;
  }
}

function getThresholdMultiplierForPeriodScaling(
  metricsCfn: any[],
  scalingFactor: number,
) {
  if (metricsCfn.length === 1) {
    const metricStat = metricsCfn[0].MetricStat.Stat;
    if (metricStat === "Sum" || metricStat === "SampleCount") {
      return 1 / scalingFactor;
    }
  }
  return 1;
}
