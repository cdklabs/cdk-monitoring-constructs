# CDK Monitoring Constructs

⚠️ This package isn't ready for use yet! ⚠️

[![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/cdklabs/cdk-monitoring-constructs)
[![NPM version](https://badge.fury.io/js/cdk-monitoring-constructs.svg)](https://badge.fury.io/js/cdk-monitoring-constructs)
[![PyPI version](https://badge.fury.io/py/cdk-monitoring-constructs.svg)](https://badge.fury.io/py/cdk-monitoring-constructs)
[![NuGet version](https://badge.fury.io/nu/Cdklabs.CdkMonitoringConstructs.svg)](https://badge.fury.io/nu/Cdklabs.CdkMonitoringConstructs)
[![Maven Central](https://maven-badges.herokuapp.com/maven-central/io.github.cdklabs/cdkmonitoringconstructs/badge.svg)](https://maven-badges.herokuapp.com/maven-central/io.github.cdklabs/cdkmonitoringconstructs)
[![Mergify](https://img.shields.io/endpoint.svg?url=https://gh.mergify.io/badges/cdklabs/cdk-monitoring-constructs&style=flat)](https://mergify.io)

Easy-to-use CDK constructs for monitoring your AWS infrastructure.

* Easily add commonly-used alarms using predefined properties
* Generate concise Cloudwatch dashboards that indicate your alarms
* Extend the library with your own extensions or custom metrics
* Consume the library in multiple languages (see below)

## Usage

### TypeScript (NPM)

> https://www.npmjs.com/package/cdk-monitoring-constructs

Add the dependency to your `package.json`:

```json
{
  "dependencies": {
    "cdk-monitoring-constructs": "^0.0.11",

    // peer dependencies
    "constructs": "^3.3.69",
    "monocdk": "^1.123.0",

    // (your other dependencies)
  }
}
```

### Java

> https://mvnrepository.com/artifact/io.github.cdklabs/cdkmonitoringconstructs

#### Maven

Add the following Maven project to your `pom.xml`:

```xml
<dependency>
    <groupId>io.github.cdklabs</groupId>
    <artifactId>cdkmonitoringconstructs</artifactId>
    <version>0.0.11</version>
</dependency>
```

#### Gradle

```kotlin
implementation("io.github.cdklabs:cdkmonitoringconstructs:0.0.11")
```

### Python (PyPi)

> https://pypi.org/project/cdk-monitoring-constructs/

TODO: describe usage

### C# (Nuget)

> https://www.nuget.org/packages/Cdklabs.CdkMonitoringConstructs/

TODO: describe usage

## Features

See [API](API.md) for complete auto-generated documentation.

You can also browse the documentation at https://constructs.dev/packages/cdk-monitoring-constructs/

| Item | Monitoring | Alarms | Notes |
| ---- | ---------- | ------ | ----- |
| AWS API Gateway (REST API) (`.monitorApiGateway()`) | TPS, latency, errors | Latency, error count/rate |  To see metrics, you have to enable Advanced Monitoring |
| AWS API Gateway V2 (HTTP API) (`.monitorApiGatewayV2HttpApi()`) | TPS, latency, errors | Latency, error count/rate | To see route level metrics, you have to enable Advanced Monitoring|
| AWS AppSync (GraphQL API) (`.monitorAppSyncApi()`) | TPS, latency, errors | Latency, error count/rate, low/high TPS | |
| AWS Billing (`.monitorBilling()`) | AWS account cost | | [Requires enabling](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/gs_monitor_estimated_charges_with_cloudwatch.html#gs_turning_on_billing_metrics) the **Receive Billing Alerts** option in AWS Console / Billing Preferences |
| AWS Certificate Manager (`.monitorCertificate()`) | Certificate expiration | Days until expiration | |
| AWS CloudFront (`.monitorCloudFrontDistribution()`) | TPS, traffic, latency, errors | | |
| AWS CodeBuild (`.monitorCodeBuildProject()`) | Build counts (total, successful, failed), failed rate, duration | Failed build count/rate, duration | |
| AWS DynamoDB (`.monitorDynamoTable()`) | Read and write capacity provisioned / used | Consumed capacity, throttling, latency, errors | |
| AWS DynamoDB Global Secondary Index (`.monitorDynamoTableGlobalSecondaryIndex()`) | Read and write capacity, indexing progress, throttled events | | |
| AWS EC2 (`.monitorEC2Instances()`) | CPU, disk operations, network | | |
| AWS EC2 Auto Scaling Groups (`.monitorAutoScalingGroup()`) | Group size, instance status | | |
| AWS ECS (`.monitorFargateService()`, `.monitorEc2Service()`, `.monitorSimpleFargateService()`, `monitorSimpleEc2Service()`, `.monitorQueueProcessingFargateService()`, `.monitorQueueProcessingEc2Service()`) | System resources and task health | Unhealthy task count, running tasks count, CPU/memory usage, and bytes processed by load balancer (if any) | Use for ecs-patterns load balanced ec2/fargate constructs (NetworkLoadBalancedEc2Service, NetworkLoadBalancedFargateService, ApplicationLoadBalancedEc2Service, ApplicationLoadBalancedFargateService) |
| AWS ElastiCache (`.monitorElastiCacheCluster()`) | CPU/memory usage, evictions and connections | | |
| AWS Glue (`.monitorGlueJob()`) | Traffic, job status, memory/CPU usage | | |
| AWS Kinesis Data Analytics (`.monitorKinesisDataAnalytics`) | Up/Downtime, CPU/memory usage, KPU usage, checkpoint metrics, and garbage collection metrics | Downtime | |
| AWS Kinesis Data Stream (`.monitorKinesisDataStream()`) | Put/Get/Incoming Record/s and Throttling | Iterator max age | |
| AWS Kinesis Firehose (`.monitorKinesisFirehose()`) | Number of records, requests, latency | | |
| AWS Lambda (`.monitorLambdaFunction()`) | Latency, errors, iterator max age | Latency, errors, throttles, iterator max age | Optional Lambda Insights metrics (opt-in) support |
| AWS Load Balancing (`.monitorNetworkLoadBalancer()`, `.monitorFargateApplicationLoadBalancer()`, `.monitorFargateNetworkLoadBalancer()`, `.monitorEc2ApplicationLoadBalancer()`, `.monitorEc2NetworkLoadBalancer()`) | System resources and task health | Unhealthy task count, running tasks count, (for Fargate/Ec2 apps) CPU/memory usage | Use for FargateService or Ec2Service backed by a NetworkLoadBalancer or ApplicationLoadBalancer |
| AWS OpenSearch/Elasticsearch (`.monitorOpenSearchCluster()`, `.monitorElasticsearchCluster()`) | Indexing and search latency, disk/memory/CPU usage | Indexing and search latency, disk/memory/CPU usage, cluster status | |
| AWS RDS (`.monitorRdsCluster()`) | Query duration, connections, latency, disk/CPU usage | Disk and CPU usage | |
| AWS Redshift (`.monitorRedshiftCluster()`) | Query duration, connections, latency, disk/CPU usage | Disk and CPU usage | |
| AWS S3 Bucket (`.monitorS3Bucket()`) | Bucket size and number of objects | | |
| AWS SecretsManager (`.monitorSecretsManagerSecret()`) | Days since last rotation | Days since last rotation | Requires the `@aws-cdk/aws-secretsmanager:parseOwnedSecretName` [feature flag](https://docs.aws.amazon.com/cdk/latest/guide/featureflags.html) |
| AWS SNS Topic (`.monitorSnsTopic()`) | Message count, size, failed notifications | Failed notifications | |
| AWS SQS Queue (`.monitorSqsQueue()`, `.monitorSqsQueueWithDlq()`) | Message count, age, size | Message count, age, DLQ incoming messages | |
| AWS Step Functions (`.monitorStepFunction()`, `.monitorStepFunctionActivity()`, `monitorStepFunctionLambdaIntegration()`, `.monitorStepFunctionServiceIntegration()`) | Execution count and breakdown per state | Duration, failed, failed rate, aborted, throttled, timed out executions | |
| CloudWatch Logs (`.monitorLog()`) | Patterns present in the log group | | |
| Custom metrics (`.monitorCustom()`) | Addition of custom metrics into the dashboard (each group is a widget) | | Supports anomaly detection |

## Contributing/Security

See [CONTRIBUTING](CONTRIBUTING.md) for more information.

## License

This project is licensed under the Apache-2.0 License.
