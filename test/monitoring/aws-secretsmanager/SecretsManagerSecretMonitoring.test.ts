import { App, Duration, Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { Secret } from "aws-cdk-lib/aws-secretsmanager";

import {
  AlarmWithAnnotation,
  SecretsManagerMetricsPublisher,
  SecretsManagerSecretMonitoring,
} from "../../../lib";
import { forceStableAssetKeys } from "../../utils/StableTestKeys";
import { TestMonitoringScope } from "../TestMonitoringScope";

beforeEach(() => {
  // reset cached publisher instances before each test
  // test stacks have duplicate uniqueIds since they don't belong to a single construct tree
  (SecretsManagerMetricsPublisher as any).instances = {};
});

afterAll = beforeEach;

test("snapshot test", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const secret1 = new Secret(stack, "Secret1");
  const secret2 = new Secret(stack, "Secret2");
  const secret3 = new Secret(stack, "Secret3");

  let numAlarmsCreated = 0;

  let lambdaFunction1: IFunction;
  new SecretsManagerSecretMonitoring(scope, {
    secret: secret1,
    addDaysSinceLastChangeAlarm: {
      Warning: {
        maxDaysSinceUpdate: 30,
        period: Duration.days(1),
      },
      Critical: {
        maxDaysSinceUpdate: 60,
        period: Duration.days(1),
      },
    },
    useCreatedAlarms: {
      consume(alarms: AlarmWithAnnotation[]) {
        numAlarmsCreated += alarms.length;
      },
    },
    usePublisher: {
      consume(lambdaFunction: IFunction) {
        lambdaFunction1 = lambdaFunction;
      },
    },
  });

  let lambdaFunction2: IFunction;
  new SecretsManagerSecretMonitoring(scope, {
    secret: secret2,
    addDaysSinceLastRotationAlarm: {
      Warning: {
        maxDaysSinceUpdate: 30,
        period: Duration.days(1),
      },
    },
    useCreatedAlarms: {
      consume(alarms: AlarmWithAnnotation[]) {
        numAlarmsCreated += alarms.length;
      },
    },
    usePublisher: {
      consume(lambdaFunction: IFunction) {
        lambdaFunction2 = lambdaFunction;
      },
    },
  });

  let lambdaFunction3: IFunction;
  new SecretsManagerSecretMonitoring(scope, {
    secret: secret3,
    addDaysSinceLastChangeAlarm: {
      Warning: {
        maxDaysSinceUpdate: 30,
        period: Duration.days(1),
      },
    },
    showLastRotationWidget: true,
    useCreatedAlarms: {
      consume(alarms: AlarmWithAnnotation[]) {
        numAlarmsCreated += alarms.length;
      },
    },
    usePublisher: {
      consume(lambdaFunction: IFunction) {
        lambdaFunction3 = lambdaFunction;
      },
    },
  });

  expect(numAlarmsCreated).toStrictEqual(4);

  // All the same instance since multiple publishers shouldn't be created
  expect(lambdaFunction1!).toBe(lambdaFunction2!);
  expect(lambdaFunction2!).toBe(lambdaFunction3!);

  forceStableAssetKeys(stack);

  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("each stack in an app gets its own publisher instance", () => {
  const app = new App();
  for (const stack of [new Stack(app, "Stack1"), new Stack(app, "Stack2")]) {
    const scope = new TestMonitoringScope(stack, "Scope");

    new SecretsManagerSecretMonitoring(scope, {
      secret: new Secret(stack, "Secret1"),
    });

    if (stack.node.id === "Stack2") {
      new SecretsManagerSecretMonitoring(scope, {
        secret: new Secret(stack, "Secret2"),
      });
    }

    forceStableAssetKeys(stack);

    expect(Template.fromStack(stack)).toMatchSnapshot();
  }
});
