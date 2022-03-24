import * as path from "path";

import { Construct, Duration, Names } from "monocdk";
import { Rule, RuleTargetInput, Schedule } from "monocdk/aws-events";
import { LambdaFunction } from "monocdk/aws-events-targets";
import { Effect, PolicyStatement } from "monocdk/aws-iam";
import { Code, Function, IFunction, Runtime } from "monocdk/aws-lambda";
import { RetentionDays } from "monocdk/aws-logs";
import { ISecret } from "monocdk/aws-secretsmanager";

import { MonitoringScope } from "../../common";
import { SecretsManagerSecretMetricFactory } from "./SecretsManagerSecretMetricFactory";

export class SecretsManagerMetricsPublisher extends Construct {
  private static instances: Record<string, SecretsManagerMetricsPublisher> = {};
  private readonly lambda: IFunction;
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
          "SecretsManagerMetricsPublisher"
        )
      ),
      description:
        "Custom metrics publisher for SecretsManager Secrets (MonitoringCDKConstructs)",
      handler: "index.handler",
      memorySize: 128,
      runtime: Runtime.NODEJS_14_X,
      timeout: Duration.seconds(60),
      logRetention: RetentionDays.ONE_DAY,
    });

    this.lambda.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ["secretsmanager:DescribeSecret"],
        resources: ["*"],
      })
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
      })
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
      })
    );
  }
}
