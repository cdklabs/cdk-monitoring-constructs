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

> Repository: https://www.npmjs.com/package/cdk-monitoring-constructs

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

### Java (Maven)

> Repository: https://mvnrepository.com/artifact/io.github.cdklabs/cdkmonitoringconstructs

Add the following Maven project to your `pom.xml`:

```xml
<dependency>
    <groupId>io.github.cdklabs</groupId>
    <artifactId>cdkmonitoringconstructs</artifactId>
    <version>0.0.11</version>
</dependency>
```

### Python (PyPi)

> Repository: https://pypi.org/project/cdk-monitoring-constructs/

TODO: describe usage

### C# (Nuget)

> Repository: https://www.nuget.org/packages/Cdklabs.CdkMonitoringConstructs/

TODO: describe usage

## Documentation

See [API](API.md) for complete auto-generated documentation.

## Contributing/Security

See [CONTRIBUTING](CONTRIBUTING.md) for more information.

## Features

- AWS API Gateway (REST API) (`.monitorApiGateway()`)
    - **To see metrics, you have to enable Advanced Monitoring**
    - monitoring of TPS, latency, errors
    - alarm on latency, error count/rate
- AWS API Gateway V2 (HTTP API) (`.monitorApiGatewayV2HttpApi()`)
    - **To see route level metrics, you have to enable Advanced Monitoring**
    - monitoring of TPS, latency, errors
    - alarm on latency, error count/rate
- AWS AppSync (GraphQL API) (`.monitorAppSyncApi()`)
    - monitoring of TPS, latency, errors
    - alarm on latency, error count/rate, low/high TPS
- AWS Certificate Manager (`.monitorCertificate()`)
    - monitoring of certificate expiration
    - alarm on days until expiration
- AWS CloudFront (`.monitorCloudFrontDistribution()`)
    - monitoring of TPS, traffic, latency, errors
    - no alarms supported yet
- AWS CodeBuild (`.monitorCodeBuildProject()`)
    - monitoring of build counts (total, successful, failed), failed rate, duration
    - alarm on failed build count/rate, duration
- AWS DynamoDB (`.monitorDynamoTable()`)
    - monitoring of read and write capacity provisioned / used
    - alarm on consumed capacity, throttling, latency, errors
- AWS DynamoDB Global Secondary Index (`.monitorDynamoTableGlobalSecondaryIndex()`)
    - monitoring of read and write capacity, indexing progress, throttled events
    - no alarm support yet
- AWS EC2 (`.monitorEC2Instances()`)
    - monitoring of CPU, disk operations, network
    - no alarms supported yet
- AWS EC2 Auto Scaling Groups (`.monitorAutoScalingGroup()`)
    - monitoring of group size, instance status
    - no alarms supported yet
- AWS ECS (`.monitorFargateService()`, `.monitorEc2Service()`, `.monitorSimpleFargateService()`, `monitorSimpleEc2Service()`, `.monitorQueueProcessingFargateService()`, `.monitorQueueProcessingEc2Service()`)
    - monitoring of system resources and task health
    - alarm on unhealthy task count, running tasks count, CPU/memory usage, and bytes processed by load balancer (if any)
    - use for ecs-patterns load balanced ec2/fargate constructs (NetworkLoadBalancedEc2Service, NetworkLoadBalancedFargateService, ApplicationLoadBalancedEc2Service, ApplicationLoadBalancedFargateService)
- AWS ElastiCache (`.monitorElastiCacheCluster()`)
    - monitoring of CPU/memory usage, evictions and connections
    - no alarms supported yet
- AWS Glue (`.monitorGlueJob()`)
    - monitoring of traffic, job status, memory/CPU usage
    - no alarms supported yet
- AWS Kinesis Data Analytics (`.monitorKinesisDataAnalytics`)
    - monitoring of Up/Downtime, CPU/memory usage, KPU usage, checkpoint metrics, and garbage collection metrics
    - alarm on downtime
- AWS Kinesis Data Stream (`.monitorKinesisDataStream()`)
    - monitoring of Put/Get/Incoming Record/s and Throttling
    - alarm on iterator max age
- AWS Kinesis Firehose (`.monitorKinesisFirehose()`)
    - monitoring of number of records, requests, latency
    - no alarms supported yet
- AWS Lambda (`.monitorLambdaFunction()`)
    - monitoring of latency, errors, iterator max age
    - alarm on latency, errors, throttles, iterator max age
    - monitoring of Lambda Insights metrics (opt-in)
- AWS Load Balancing (`.monitorNetworkLoadBalancer()`, `.monitorFargateApplicationLoadBalancer()`, `.monitorFargateNetworkLoadBalancer()`, `.monitorEc2ApplicationLoadBalancer()`, `.monitorEc2NetworkLoadBalancer()`)
    - monitoring of system resources and task health
    - alarm on unhealthy task count, running tasks count, (for Fargate/Ec2 apps) CPU/memory usage
    - use for FargateService or Ec2Service backed by a NetworkLoadBalancer or ApplicationLoadBalancer.
- AWS OpenSearch/Elasticsearch (`.monitorOpenSearchCluster()`/`.monitorElasticsearchCluster()`)
    - monitoring of indexing and search latency, disk/memory/CPU usage
    - alarm on indexing and search latency, disk/memory/CPU usage, cluster status
- AWS RDS (`.monitorRdsCluster()`)
    - monitoring of query duration, connections, latency, disk/CPU usage
    - alarm on disk and CPU usage
- AWS Redshift (`.monitorRedshiftCluster()`)
    - monitoring of query duration, connections, latency, disk/CPU usage
    - alarm on disk and CPU usage
- AWS S3 Bucket (`.monitorS3Bucket()`)
    - monitoring of bucket size and number of objects
    - no alarms supported yet
- AWS SecretsManager (`.monitorSecretsManagerSecret()`)
    - monitoring of days since last rotation
    - alarm on days since last rotation
    - requires the `@aws-cdk/aws-secretsmanager:parseOwnedSecretName` [feature flag](https://docs.aws.amazon.com/cdk/latest/guide/featureflags.html)
- AWS SNS Topic (`.monitorSnsTopic()`)
    - monitoring of message count, size, failed notifications
    - alarm on failed notifications
- AWS SQS Queue (`.monitorSqsQueue()`, `.monitorSqsQueueWithDlq()`)
    - monitoring of message count, age, size
    - alarm on message count, age
    - the same alarms for dead letter queue (DLQ)
    - DLQ alarm on incoming messages
- AWS Step Functions (`.monitorStepFunction()`, `.monitorStepFunctionActivity()`,
  `.monitorStepFunctionLambdaIntegration()`, `.monitorStepFunctionServiceIntegration()`)
    - monitoring of execution count and breakdown per state
    - alarms on duration, failed, failed rate, aborted, throttled, timed out executions
- AWS Billing (`.monitorBilling()`)
    - monitoring AWS account cost ([you need to enable](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/gs_monitor_estimated_charges_with_cloudwatch.html#gs_turning_on_billing_metrics) the **Receive Billing Alerts** option in AWS Console / Billing Preferences)
    - no alarms support yet
- CloudWatch Logs (`.monitorLog()`)
    - monitoring of patterns present in the log group
- Custom metrics (`.monitorCustom()`)
    - simple addition of custom metrics into the dashboard (each group is a widget)
    - supports anomaly detection

## License

This project is licensed under the Apache-2.0 License.
