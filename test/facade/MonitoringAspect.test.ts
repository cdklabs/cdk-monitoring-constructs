import { App, Duration, SecretValue, Stack } from "monocdk";
import { Template } from "monocdk/assertions";
import * as apigw from "monocdk/aws-apigateway";
import * as apigwv2 from "monocdk/aws-apigatewayv2";
import * as appsync from "monocdk/aws-appsync";
import * as autoscaling from "monocdk/aws-autoscaling";
import * as acm from "monocdk/aws-certificatemanager";
import * as cloudfront from "monocdk/aws-cloudfront";
import * as cloudfrontOrigins from "monocdk/aws-cloudfront-origins";
import * as codebuild from "monocdk/aws-codebuild";
import * as dynamodb from "monocdk/aws-dynamodb";
import * as ec2 from "monocdk/aws-ec2";
import * as elasticache from "monocdk/aws-elasticache";
import * as elasticsearch from "monocdk/aws-elasticsearch";
import * as glue from "monocdk/aws-glue";
import * as kinesis from "monocdk/aws-kinesis";
import * as kinesisanalytics from "monocdk/aws-kinesisanalytics";
import * as kinesisfirehose from "monocdk/aws-kinesisfirehose";
import * as lambda from "monocdk/aws-lambda";
import * as opensearch from "monocdk/aws-opensearchservice";
import * as rds from "monocdk/aws-rds";
import * as redshift from "monocdk/aws-redshift";
import * as s3 from "monocdk/aws-s3";
import * as secretsmanager from "monocdk/aws-secretsmanager";
import * as sns from "monocdk/aws-sns";
import * as sqs from "monocdk/aws-sqs";
import * as stepfunctions from "monocdk/aws-stepfunctions";
import * as synthetics from "monocdk/aws-synthetics";
import {CfnWebACL} from "monocdk/aws-wafv2";

import {
  DefaultDashboardFactory,
  DashboardRenderingPreference,
  MonitoringFacade,
  MonitoringAspectProps,
} from "../../lib";

function createDummyMonitoringFacade(stack: Stack): MonitoringFacade {
  return new MonitoringFacade(stack, "MonitoringFacade", {
    alarmFactoryDefaults: {
      alarmNamePrefix: "DummyMonitoring",
      actionsEnabled: true,
    },
    metricFactoryDefaults: {
      namespace: "DummyNamespace",
    },
    dashboardFactory: new DefaultDashboardFactory(stack, "DashboardFactory", {
      dashboardNamePrefix: "DummyDashboard",
      createDashboard: true,
      createSummaryDashboard: true,
      createAlarmDashboard: true,
      renderingPreference: DashboardRenderingPreference.INTERACTIVE_ONLY,
    }),
  });
}

describe("MonitoringAspect", () => {
  const defaultAspectProps: MonitoringAspectProps = {
    billing: { enabled: false },
    ec2: { enabled: false },
    elasticCache: { enabled: false },
  };

  test("ACM", () => {
    // GIVEN
    const stack = new Stack();
    const facade = createDummyMonitoringFacade(stack);

    new acm.Certificate(stack, "DummyCertificate", {
      domainName: "www.monitoring.cdk",
    });

    // WHEN
    facade.monitorScope(stack, defaultAspectProps);

    // THEN
    expect(Template.fromStack(stack)).toMatchSnapshot();
  });

  test("API Gateway", () => {
    // GIVEN
    const stack = new Stack();
    const facade = createDummyMonitoringFacade(stack);

    const api = new apigw.RestApi(stack, "DummyRestApi");
    api.root.addMethod("ANY");

    // WHEN
    facade.monitorScope(stack, defaultAspectProps);

    // THEN
    expect(Template.fromStack(stack)).toMatchSnapshot();
  });

  test("API Gateway V2", () => {
    // GIVEN
    const stack = new Stack();
    const facade = createDummyMonitoringFacade(stack);

    new apigwv2.HttpApi(stack, "DummyHttpApi", {
      apiName: "DummyHttpApi",
    });

    // WHEN
    facade.monitorScope(stack, defaultAspectProps);

    // THEN
    expect(Template.fromStack(stack)).toMatchSnapshot();
  });

  test("AppSync", () => {
    // GIVEN
    const stack = new Stack();
    const facade = createDummyMonitoringFacade(stack);

    new appsync.GraphqlApi(stack, "DummyGraphqlApi", {
      name: "DummyGraphqlApi",
    });

    // WHEN
    facade.monitorScope(stack, defaultAspectProps);

    // THEN
    expect(Template.fromStack(stack)).toMatchSnapshot();
  });

  test("AutoScaling", () => {
    // GIVEN
    const stack = new Stack();
    const facade = createDummyMonitoringFacade(stack);

    const vpc = new ec2.Vpc(stack, "Vpc");
    new autoscaling.AutoScalingGroup(stack, "ASG", {
      autoScalingGroupName: "DummyASG",
      vpc,
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.M4,
        ec2.InstanceSize.LARGE
      ),
      machineImage: ec2.MachineImage.latestAmazonLinux(),
      minCapacity: 1,
      maxCapacity: 10,
      desiredCapacity: 5,
    });

    // WHEN
    facade.monitorScope(stack, defaultAspectProps);

    // THEN
    expect(Template.fromStack(stack)).toMatchSnapshot();
  });

  test("Billing", () => {
    // GIVEN
    const stack = new Stack();
    const facade = createDummyMonitoringFacade(stack);

    // WHEN
    facade.monitorScope(stack, {
      ...defaultAspectProps,
      billing: { enabled: true },
    });

    // THEN
    expect(Template.fromStack(stack)).toMatchSnapshot();
  });

  test("CloudFront", () => {
    // GIVEN
    const stack = new Stack();
    const facade = createDummyMonitoringFacade(stack);

    const bucket = new s3.Bucket(stack, "Bucket");
    new cloudfront.Distribution(stack, "Distribution", {
      defaultBehavior: {
        origin: new cloudfrontOrigins.S3Origin(bucket),
      },
    });

    // WHEN
    facade.monitorScope(stack, defaultAspectProps);

    // THEN
    expect(Template.fromStack(stack)).toMatchSnapshot();
  });

  test("CodeBuild", () => {
    // GIVEN
    const stack = new Stack();
    const facade = createDummyMonitoringFacade(stack);

    new codebuild.Project(stack, "DummyProject", {
      source: codebuild.Source.gitHub({
        owner: "monocdk",
        repo: "monocdk",
      }),
    });

    // WHEN
    facade.monitorScope(stack, defaultAspectProps);

    // THEN
    expect(Template.fromStack(stack)).toMatchSnapshot();
  });

  test("DynamoDB", () => {
    // GIVEN
    const stack = new Stack();
    const facade = createDummyMonitoringFacade(stack);

    new dynamodb.Table(stack, "DummyTable", {
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
    });

    // WHEN
    facade.monitorScope(stack, defaultAspectProps);

    // THEN
    expect(Template.fromStack(stack)).toMatchSnapshot();
  });

  test("EC2", () => {
    // GIVEN
    const stack = new Stack();
    const facade = createDummyMonitoringFacade(stack);

    const vpc = new ec2.Vpc(stack, "Vpc");
    new ec2.Instance(stack, "DummyInstance", {
      vpc,
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.M4,
        ec2.InstanceSize.LARGE
      ),
      machineImage: ec2.MachineImage.latestAmazonLinux(),
    });

    // WHEN
    facade.monitorScope(stack, {
      ...defaultAspectProps,
      ec2: { enabled: true },
    });

    // THEN
    expect(Template.fromStack(stack)).toMatchSnapshot();
  });

  test("ElasticCache", () => {
    // GIVEN
    const stack = new Stack();
    const facade = createDummyMonitoringFacade(stack);

    new elasticache.CfnCacheCluster(stack, "DummyCacheCluster", {
      cacheNodeType: "cache.t2.micro",
      engine: "memcached",
      numCacheNodes: 1,
    });

    // WHEN
    facade.monitorScope(stack, {
      ...defaultAspectProps,
      elasticCache: { enabled: true },
    });

    // THEN
    expect(Template.fromStack(stack)).toMatchSnapshot();
  });

  test("Glue", () => {
    // GIVEN
    const stack = new Stack();
    const facade = createDummyMonitoringFacade(stack);

    new glue.CfnJob(stack, "DummyJob", {
      name: "DummyJob",
      description: "Dummy Job",
      command: {
        name: "test",
        scriptLocation: "s3://bucket/script.py",
      },
      role: "arn:aws:iam::123456789012:role/service-role/GlueServiceRole-1A2B3C4D",
    });

    // WHEN
    facade.monitorScope(stack, defaultAspectProps);

    // THEN
    expect(Template.fromStack(stack)).toMatchSnapshot();
  });

  describe("Kinesis", () => {
    test("DataStream", () => {
      // GIVEN
      const stack = new Stack();
      const facade = createDummyMonitoringFacade(stack);

      new kinesis.Stream(stack, "DummyStream", {
        shardCount: 1,
      });

      // WHEN
      facade.monitorScope(stack, defaultAspectProps);

      // THEN
      expect(Template.fromStack(stack)).toMatchSnapshot();
    });

    test("DataAnalytics", () => {
      // GIVEN
      const stack = new Stack();
      const facade = createDummyMonitoringFacade(stack);
      const creationStack = [stack.stackName];

      new kinesisanalytics.CfnApplication(stack, "DummyAnalyticsApplication", {
        inputs: [
          {
            creationStack,
            namePrefix: "DummyStream",
            inputSchema: {
              recordColumns: [
                {
                  name: "fdsf",
                  sqlType: "safas",
                  creationStack,
                },
              ],
              creationStack,
              recordFormat: {
                creationStack,
                recordFormatType: "JSON",
              },
            },
          },
        ],
      });

      // WHEN
      facade.monitorScope(stack, defaultAspectProps);

      // THEN
      expect(Template.fromStack(stack)).toMatchSnapshot();
    });

    test("Firehose", () => {
      // GIVEN
      const stack = new Stack();
      const facade = createDummyMonitoringFacade(stack);

      new kinesisfirehose.CfnDeliveryStream(stack, "DummyDeliveryStream");

      // WHEN
      facade.monitorScope(stack, defaultAspectProps);

      // THEN
      expect(Template.fromStack(stack)).toMatchSnapshot();
    });
  });

  test("Lambda", () => {
    // GIVEN
    const stack = new Stack();
    const facade = createDummyMonitoringFacade(stack);

    new lambda.Function(stack, "DummyFunction", {
      code: lambda.Code.fromInline("lambda"),
      handler: "index.handler",
      runtime: lambda.Runtime.NODEJS_12_X,
    });

    // WHEN
    facade.monitorScope(stack, defaultAspectProps);

    // THEN
    expect(Template.fromStack(stack)).toMatchSnapshot();
  });

  test("OpenSearch", () => {
    // GIVEN
    const stack = new Stack();
    const facade = createDummyMonitoringFacade(stack);

    new opensearch.Domain(stack, "DummyOSDomain", {
      domainName: "dummy-os-domain",
      version: opensearch.EngineVersion.ELASTICSEARCH_7_10,
    });
    new elasticsearch.Domain(stack, "DummyESDomain", {
      version: elasticsearch.ElasticsearchVersion.V7_10,
    });

    // WHEN
    facade.monitorScope(stack, defaultAspectProps);

    // THEN
    expect(Template.fromStack(stack)).toMatchSnapshot();
  });

  test("RDS", () => {
    // GIVEN
    const app = new App({
      context: {
        "@aws-cdk/aws-secretsmanager:parseOwnedSecretName": true,
      },
    });
    const stack = new Stack(app);
    const facade = createDummyMonitoringFacade(stack);

    const vpc = new ec2.Vpc(stack, "Vpc");
    new rds.DatabaseCluster(stack, "DummyDBCluster", {
      engine: rds.DatabaseClusterEngine.AURORA_MYSQL,
      instanceProps: {
        vpc,
      },
    });

    // WHEN
    facade.monitorScope(stack, defaultAspectProps);

    // THEN
    expect(Template.fromStack(stack)).toMatchSnapshot();
  });

  test("RedShift", () => {
    // GIVEN
    const stack = new Stack();
    const facade = createDummyMonitoringFacade(stack);

    const vpc = new ec2.Vpc(stack, "Vpc");
    new redshift.Cluster(stack, "DummyCluster", {
      masterUser: {
        masterUsername: "admin",
        masterPassword: SecretValue.plainText("password"),
      },
      vpc,
    });

    // WHEN
    facade.monitorScope(stack, defaultAspectProps);

    // THEN
    expect(Template.fromStack(stack)).toMatchSnapshot();
  });

  test("S3", () => {
    // GIVEN
    const stack = new Stack();
    const facade = createDummyMonitoringFacade(stack);

    new s3.Bucket(stack, "DummyBucket");

    // WHEN
    facade.monitorScope(stack, defaultAspectProps);

    // THEN
    expect(Template.fromStack(stack)).toMatchSnapshot();
  });

  test("SecretsManager", () => {
    // GIVEN
    const app = new App({
      context: {
        "@aws-cdk/aws-secretsmanager:parseOwnedSecretName": true,
      },
    });
    const stack = new Stack(app);
    const facade = createDummyMonitoringFacade(stack);

    new secretsmanager.Secret(stack, "DummySecret");

    // WHEN
    facade.monitorScope(stack, defaultAspectProps);

    // THEN
    expect(Template.fromStack(stack)).toMatchSnapshot();
  });

  test("SNS", () => {
    // GIVEN
    const stack = new Stack();
    const facade = createDummyMonitoringFacade(stack);

    new sns.Topic(stack, "DummyTopic");

    // WHEN
    facade.monitorScope(stack, defaultAspectProps);

    // THEN
    expect(Template.fromStack(stack)).toMatchSnapshot();
  });

  test("SQS", () => {
    // GIVEN
    const stack = new Stack();
    const facade = createDummyMonitoringFacade(stack);

    new sqs.Queue(stack, "DummyQueue");

    // WHEN
    facade.monitorScope(stack, defaultAspectProps);

    // THEN
    expect(Template.fromStack(stack)).toMatchSnapshot();
  });

  test("StepFunctions", () => {
    // GIVEN
    const stack = new Stack();
    const facade = createDummyMonitoringFacade(stack);

    new stepfunctions.StateMachine(stack, "DummyStateMachine", {
      definition: new stepfunctions.Pass(stack, "DummyStep"),
    });

    // WHEN
    facade.monitorScope(stack, defaultAspectProps);

    // THEN
    expect(Template.fromStack(stack)).toMatchSnapshot();
  });

  test("Canaries", () => {
    // GIVEN
    const stack = new Stack();
    const facade = createDummyMonitoringFacade(stack);

    new synthetics.Canary(stack, "Canary", {
      schedule: synthetics.Schedule.rate(Duration.minutes(5)),
      test: synthetics.Test.custom({
        code: synthetics.Code.fromInline("/* nothing */"),
        handler: "index.handler",
      }),
      runtime: synthetics.Runtime.SYNTHETICS_NODEJS_2_0,
    });

    // WHEN
    facade.monitorScope(stack, defaultAspectProps);

    // THEN
    expect(Template.fromStack(stack)).toMatchSnapshot();
  });

  test("WAF v2", () => {
    // GIVEN
    const stack = new Stack();
    const facade = createDummyMonitoringFacade(stack);

    new CfnWebACL(stack, "DummyAcl", {
      defaultAction: { allow: {} },
      scope: "REGIONAL",
      visibilityConfig: {
        sampledRequestsEnabled: true,
        cloudWatchMetricsEnabled: true,
        metricName: "DummyMetricName",
      },
    });

    // WHEN
    facade.monitorScope(stack, defaultAspectProps);

    // THEN
    expect(Template.fromStack(stack)).toMatchSnapshot();
  });
});
