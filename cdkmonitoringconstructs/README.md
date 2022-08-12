# CDK Monitoring Constructs

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

## Installation

<details><summary><strong>TypeScript</strong></summary>

> https://www.npmjs.com/package/cdk-monitoring-constructs

In your `package.json`:

```json
{
  "dependencies": {
    "cdk-monitoring-constructs": "^1.0.0",

    // peer dependencies of cdk-monitoring-constructs
    "@aws-cdk/aws-apigatewayv2-alpha": "^2.18.0-alpha.0",
    "@aws-cdk/aws-appsync-alpha": "^2.18.0-alpha.0",
    "@aws-cdk/aws-redshift-alpha": "^2.18.0-alpha.0",
    "@aws-cdk/aws-synthetics-alpha": "^2.18.0-alpha.0",
    "aws-cdk-lib": "^2.18.0",
    "constructs": "^10.0.5"

    // ...your other dependencies...
  }
}
```

</details><details><summary><strong>Java</strong></summary>

See https://mvnrepository.com/artifact/io.github.cdklabs/cdkmonitoringconstructs

</details><details><summary><strong>Python</strong></summary>

See https://pypi.org/project/cdk-monitoring-constructs/

</details><details><summary><strong>C#</strong></summary>

See https://www.nuget.org/packages/Cdklabs.CdkMonitoringConstructs/

</details><details><summary><strong>Golang</strong></summary>

Coming soon!

</details>

## Features

See [API](API.md) for complete auto-generated documentation.

You can also browse the documentation at https://constructs.dev/packages/cdk-monitoring-constructs/

| Item | Monitoring | Alarms | Notes |
| ---- | ---------- | ------ | ----- |
| AWS API Gateway (REST API) (`.monitorApiGateway()`) | TPS, latency, errors | Latency, error count/rate, low/high TPS | To see metrics, you have to enable Advanced Monitoring |
| AWS API Gateway V2 (HTTP API) (`.monitorApiGatewayV2HttpApi()`) | TPS, latency, errors | Latency, error count/rate, low/high TPS | To see route level metrics, you have to enable Advanced Monitoring |
| AWS AppSync (GraphQL API) (`.monitorAppSyncApi()`) | TPS, latency, errors | Latency, error count/rate, low/high TPS | |
| AWS Billing (`.monitorBilling()`) | AWS account cost | | [Requires enabling](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/gs_monitor_estimated_charges_with_cloudwatch.html#gs_turning_on_billing_metrics) the **Receive Billing Alerts** option in AWS Console / Billing Preferences |
| AWS Certificate Manager (`.monitorCertificate()`) | Certificate expiration | Days until expiration | |
| AWS CloudFront (`.monitorCloudFrontDistribution()`) | TPS, traffic, latency, errors | Error rate, low/high TPS | |
| AWS CloudWatch Logs (`.monitorLog()`) | Patterns present in the log group | | |
| AWS CloudWatch Synthetics Canary (`.monitorSyntheticsCanary()`) | Latency, error count/rate | Error count/rate, latency | |
| AWS CodeBuild (`.monitorCodeBuildProject()`) | Build counts (total, successful, failed), failed rate, duration | Failed build count/rate, duration | |
| AWS DocumentDB (`.monitorDocumentDbCluster()`) | CPU, throttling, read/write latency, transactions, cursors | CPU | |
| AWS DynamoDB (`.monitorDynamoTable()`) | Read and write capacity provisioned / used | Consumed capacity, throttling, latency, errors | |
| AWS DynamoDB Global Secondary Index (`.monitorDynamoTableGlobalSecondaryIndex()`) | Read and write capacity, indexing progress, throttled events | | |
| AWS EC2 (`.monitorEC2Instances()`) | CPU, disk operations, network | | |
| AWS EC2 Auto Scaling Groups (`.monitorAutoScalingGroup()`) | Group size, instance status | | |
| AWS ECS (`.monitorFargateService()`, `.monitorEc2Service()`, `.monitorSimpleFargateService()`, `monitorSimpleEc2Service()`, `.monitorQueueProcessingFargateService()`, `.monitorQueueProcessingEc2Service()`) | System resources and task health | Unhealthy task count, running tasks count, CPU/memory usage, and bytes processed by load balancer (if any) | Use for ecs-patterns load balanced ec2/fargate constructs (NetworkLoadBalancedEc2Service, NetworkLoadBalancedFargateService, ApplicationLoadBalancedEc2Service, ApplicationLoadBalancedFargateService) |
| AWS ElastiCache (`.monitorElastiCacheCluster()`) | CPU/memory usage, evictions and connections | CPU, memory, items count | |
| AWS Glue (`.monitorGlueJob()`) | Traffic, job status, memory/CPU usage | Failed/killed task count/rate | |
| AWS Kinesis Data Analytics (`.monitorKinesisDataAnalytics`) | Up/Downtime, CPU/memory usage, KPU usage, checkpoint metrics, and garbage collection metrics | Downtime, full restart count | |
| AWS Kinesis Data Stream (`.monitorKinesisDataStream()`) | Put/Get/Incoming Record/s and Throttling | Throttling, throughput, iterator max age | |
| AWS Kinesis Firehose (`.monitorKinesisFirehose()`) | Number of records, requests, latency, throttling | Throttling | |
| AWS Lambda (`.monitorLambdaFunction()`) | Latency, errors, iterator max age | Latency, errors, throttles, iterator max age | Optional Lambda Insights metrics (opt-in) support |
| AWS Load Balancing (`.monitorNetworkLoadBalancer()`, `.monitorFargateApplicationLoadBalancer()`, `.monitorFargateNetworkLoadBalancer()`, `.monitorEc2ApplicationLoadBalancer()`, `.monitorEc2NetworkLoadBalancer()`) | System resources and task health | Unhealthy task count, running tasks count, (for Fargate/Ec2 apps) CPU/memory usage | Use for FargateService or Ec2Service backed by a NetworkLoadBalancer or ApplicationLoadBalancer |
| AWS OpenSearch/Elasticsearch (`.monitorOpenSearchCluster()`, `.monitorElasticsearchCluster()`) | Indexing and search latency, disk/memory/CPU usage | Indexing and search latency, disk/memory/CPU usage, cluster status, KMS keys | |
| AWS RDS (`.monitorRdsCluster()`) | Query duration, connections, latency, disk/CPU usage | Disk and CPU usage | |
| AWS Redshift (`.monitorRedshiftCluster()`) | Query duration, connections, latency, disk/CPU usage | Disk and CPU usage | |
| AWS S3 Bucket (`.monitorS3Bucket()`) | Bucket size and number of objects | | |
| AWS SecretsManager (`.monitorSecretsManagerSecret()`) | Days since last rotation | Days since last change or rotation | |
| AWS SNS Topic (`.monitorSnsTopic()`) | Message count, size, failed notifications | Failed notifications, min/max published messages | |
| AWS SQS Queue (`.monitorSqsQueue()`, `.monitorSqsQueueWithDlq()`) | Message count, age, size | Message count, age, DLQ incoming messages | |
| AWS Step Functions (`.monitorStepFunction()`, `.monitorStepFunctionActivity()`, `monitorStepFunctionLambdaIntegration()`, `.monitorStepFunctionServiceIntegration()`) | Execution count and breakdown per state | Duration, failed, failed rate, aborted, throttled, timed out executions | |
| AWS Web Application Firewall (`.monitorWebApplicationFirewallAcl()`) | Allowed/blocked requests | | |
| Custom metrics (`.monitorCustom()`) | Addition of custom metrics into the dashboard (each group is a widget) | | Supports anomaly detection |

## Getting started

### Create monitoring stack and facade

*Important note*: **Please, do NOT import anything from the `/dist/lib` package.** This is unsupported and might break any time.

Create an instance of `MonitoringFacade`, which is the main entry point:

```go
export interface MonitoringStackProps extends DeploymentStackProps {
  // ...
}

export class MonitoringStack extends DeploymentStack {
  constructor(parent: App, name: string, props: MonitoringStackProps) {
    super(parent, name, props);

    const monitoring = new MonitoringFacade(this, "Monitoring", {
      // Defaults are provided for these, but they can be customized as desired
      metricFactoryDefaults: { ... },
      alarmFactoryDefaults: { ... },
      dashboardFactory: { ... },
    });

    // Monitor your resources
    monitoring
      .addLargeHeader("Storage")
      .monitorDynamoTable({ /* table1 */ })
      .monitorDynamoTable({ /* table2 */ })
      .monitorDynamoTable({ /* table3 */ })
      // etc.
  }
}
```

### Set up your monitoring

Once the facade is created, you can use it to call methods like `.monitorLambdaFunction()` and chain them together to define your monitors.

You can also use facade methods to add your own widgets, headers of various sizes, and more.

### Customize actions

Alarms should have an action setup, otherwise they are not very useful. Currently, we support notifying an SNS queue.

```go
const onAlarmTopic = new Topic(this, "AlarmTopic");

const monitoring = new MonitoringFacade(this, "Monitoring", {
  // ...other props
  alarmFactoryDefaults: {
    // ....other props
    action: new SnsAlarmActionStrategy({ onAlarmTopic }),
  },
});
```

You can override the default topic for any alarm like this:

```go
monitoring
  .monitorSomething(something, {
    addSomeAlarm: {
      Warning: {
        // ...other props
        threshold: 42,
        actionOverride: new SnsAlarmActionStrategy({ onAlarmTopic }),
      }
    }
  });
```

### Custom metrics

For simply adding some custom metrics, you can use `.monitorCustom()` and specify your own title and metric groups.
Each metric group will be rendered as a single graph widget, and all widgets will be placed next to each other.
All the widgets will have the same size, which is chosen based on the number of groups to maximize dashboard space usage.

Custom metric monitoring can be created for simple metrics, simple metrics with anomaly detection and search metrics.
The first two also support alarming.

Below we are listing a couple of examples. Let us assume that there are three existing metric variables: `m1`, `m2`, `m3`.
They can either be created by hand (`new Metric({...})`) or (preferably) by using `metricFactory` (that can be obtained from facade).
The advantage of using the shared `metricFactory` is that you do not need to worry about period, etc.

```go
// create metrics manually
const m1 = new Metric(/* ... */);
```

```go
const metricFactory = monitoringFacade.createMetricFactory();

// create metrics using metric factory
const m1 = metricFactory.createMetric(/* ... */);
```

#### Example: metric with anomaly detection

In this case, only one metric is supported.
Multiple metrics cannot be rendered with anomaly detection in a single widget due to a CloudWatch limitation.

```go
monitorCustom({
  title: "Metric with anomaly detection",
  metrics: [
    {
      metric: m1,
      anomalyDetectionStandardDeviationToRender: 3
    }
  ]
})
```

Adding an alarm:

```go
monitorCustom({
  title: "Metric with anomaly detection and alarm",
  metrics: [
    {
      metric: m1,
      alarmFriendlyName: "MetricWithAnomalyDetectionAlarm",
      anomalyDetectionStandardDeviationToRender: 3,
      addAlarmOnAnomaly: {
        Warning: {
          standardDeviationForAlarm: 4,
          alarmWhenAboveTheBand: true,
          alarmWhenBelowTheBand: true
        }
      }
    }
  ]
})
```

#### Example: search metrics

```go
monitorCustom({
  title: "Metric search",
  metrics: [
    {
      searchQuery: "My.Prefix.",
      dimensionsMap: {
        FirstDimension: "FirstDimensionValue",
        // Allow any value for the given dimension (pardon the weird typing to satisfy DimensionsMap)
        SecondDimension: undefined as unknown as string
      }
    }
  ]
})
```

Search metric does not support setting an alarm, that is a CloudWatch limitation.

### Custom monitoring segment

If you want even more flexibility, you can create your own Dashboard Segment.

This is a general procedure on how to do it:

1. Extend the `Monitoring` class
2. Override the `widgets()` method (and/or similar ones)
3. Leverage the metric factor and alarm factory, provided by the base class (you can create additional factories, if you will)
4. Add all alarms to `.addAlarm()` so they are visible to the user and being placed on the alarm summary dashboard

Both of these monitoring base classes are dashboard segments, so you can add them to your monitoring by calling `.addSegment()`.

### Monitoring Scopes

With CDK Monitoring Constructs, you can monitor complete CDK construct scopes. It will automatically discover all monitorable resources within the scope (recursively)) and add them to your dashboard.

```go
monitoring.monitorScope(stack);
```

You can also specify default alarms for any specific resource and disable automatic monitoring for it as well.

```go
monitoring.monitorScope(stack, {
  lambda: {
    props: {
      addLatencyP50Alarm: {
        Critical: { maxLatency: Duration.seconds(10) },
      },
    },
  },

  // Some resources that aren't dependent on nodes (e.g. general metrics across instances/account) may be included
  // by default, but can be explicitly disabled.
  billing: { enabled: false },
  ec2: { enabled: false },
  elasticCache: { enabled: false },
});
```

## Contributing/Security

See [CONTRIBUTING](CONTRIBUTING.md) for more information.

## License

This project is licensed under the Apache-2.0 License.
