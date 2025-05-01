import * as path from "path";

import { Duration, Names } from "aws-cdk-lib";
import { Rule, RuleTargetInput, Schedule } from "aws-cdk-lib/aws-events";
import { LambdaFunction } from "aws-cdk-lib/aws-events-targets";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import {
  Code,
  determineLatestNodeRuntime,
  Function,
  IFunction,
} from "aws-cdk-lib/aws-lambda";
import { RetentionDays } from "aws-cdk-lib/aws-logs";
import { ISecret } from "aws-cdk-lib/aws-secretsmanager";
import { Construct } from "constructs";

import { SecretsManagerSecretMetricFactory } from "./SecretsManagerSecretMetricFactory";
import { MonitoringScope } from "../../common";

export class SecretsManagerMetricsPublisher extends Construct {
  private static instances: Record<string, SecretsManagerMetricsPublisher> = {};
  public readonly lambda: IFunction;

  private constructor(scope: MonitoringScope) {
    super(scope, "SecretsManagerMetricsPublisher");

    this.lambda = new Function(this, "Lambda", {
      code: Code.fromAsset(
        path.join(
          __dirname,
          "..",
          "..",
          "..",
          "assets",
          "SecretsManagerMetricsPublisher",
        ),
      ),
      description:
        "Custom metrics publisher for SecretsManager Secrets (cdk-monitoring-constructs)",
      handler: "index.handler",
      memorySize: 128,
      runtime: determineLatestNodeRuntime(this),
      timeout: Duration.seconds(60),
      logRetention: RetentionDays.ONE_DAY,
    });

    this.lambda.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ["secretsmanager:DescribeSecret"],
        resources: ["*"],
      }),
    );

    this.lambda.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ["cloudwatch:PutMetricData"],
        resources: ["*"],
        conditions: {
          StringEquals: {
            "cloudwatch:namespace": SecretsManagerSecretMetricFactory.Namespace,
          },
        },
      }),
    );
  }

  static getInstance(scope: MonitoringScope) {
    const key = Names.nodeUniqueId(scope.node);
    let instance = SecretsManagerMetricsPublisher.instances[key];
    if (!instance) {
      instance = new SecretsManagerMetricsPublisher(scope);
      SecretsManagerMetricsPublisher.instances[key] = instance;
    }

    return instance;
  }

  addSecret(secret: ISecret): void {
    // run 1/hr so alarms can recover automatically
    const rule = new Rule(this, `RuleFor${Names.nodeUniqueId(secret.node)}`, {
      schedule: Schedule.cron({
        minute: "0",
      }),
    });

    rule.addTarget(
      new LambdaFunction(this.lambda, {
        event: RuleTargetInput.fromObject({
          secretId: secret.secretArn,
        }),
      }),
    );
  }
}
