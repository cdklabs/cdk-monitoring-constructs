import { Lazy, Stack } from "aws-cdk-lib";

import { AwsConsoleUrlFactory, ElastiCacheClusterType } from "../../../lib";

const awsAccountId = "1234567890";
const awsAccountRegion = "eu-west-1";

test("getAwsConsoleUrl in Conduit", () => {
  const stack = new Stack();
  const factory = new AwsConsoleUrlFactory({ awsAccountId, awsAccountRegion });

  expect(stack.resolve(factory.getAwsConsoleUrl())).toEqual(
    "https://eu-west-1.console.aws.amazon.com"
  );

  expect(stack.resolve(factory.getAwsConsoleUrl("http://amazon.com"))).toEqual(
    "http://amazon.com"
  );
});

test("getCloudWatchLogGroupUrl", () => {
  const stack = new Stack();
  const factory = new AwsConsoleUrlFactory({ awsAccountId, awsAccountRegion });

  const expected =
    "https://eu-west-1.console.aws.amazon.com/cloudwatch/home?region=eu-west-1#logsV2:log-groups/log-group/DummyLogGroup";

  expect(
    stack.resolve(factory.getCloudWatchLogGroupUrl("DummyLogGroup"))
  ).toEqual(expected);
  expect(
    stack.resolve(
      factory.getCloudWatchLogGroupUrl(
        Lazy.string({ produce: () => "DummyLogGroup" })
      )
    )
  ).toEqual(expected);
});

test("getCodeBuildProjectUrl", () => {
  const stack = new Stack();
  const factory = new AwsConsoleUrlFactory({ awsAccountId, awsAccountRegion });

  const expected =
    "https://eu-west-1.console.aws.amazon.com/codebuild/home?region=eu-west-1#/projects/DummyProjectName";

  expect(
    stack.resolve(factory.getCodeBuildProjectUrl("DummyProjectName"))
  ).toEqual(expected);
  expect(
    stack.resolve(
      factory.getCodeBuildProjectUrl(
        Lazy.string({ produce: () => "DummyProjectName" })
      )
    )
  ).toEqual(expected);
});

test("getSnsTopicUrl", () => {
  const stack = new Stack();
  const factory = new AwsConsoleUrlFactory({ awsAccountId, awsAccountRegion });

  const expected =
    "https://eu-west-1.console.aws.amazon.com/sns/v3/home?region=eu-west-1#/topic/DummyTopicArn";

  expect(stack.resolve(factory.getSnsTopicUrl("DummyTopicArn"))).toEqual(
    expected
  );
  expect(
    stack.resolve(
      factory.getSnsTopicUrl(Lazy.string({ produce: () => "DummyTopicArn" }))
    )
  ).toEqual(expected);
});

test("getSqsQueueUrl", () => {
  const stack = new Stack();
  const factory = new AwsConsoleUrlFactory({ awsAccountId, awsAccountRegion });

  const expected =
    "https://eu-west-1.console.aws.amazon.com/sqs/v3/home?region=eu-west-1#/queues/DummyQueueUrl";

  expect(stack.resolve(factory.getSqsQueueUrl("DummyQueueUrl"))).toEqual(
    expected
  );
  expect(
    stack.resolve(
      factory.getSqsQueueUrl(Lazy.string({ produce: () => "DummyQueueUrl" }))
    )
  ).toEqual(expected);
});

test("getDynamoTableUrl", () => {
  const stack = new Stack();
  const factory = new AwsConsoleUrlFactory({ awsAccountId, awsAccountRegion });

  const expected =
    "https://eu-west-1.console.aws.amazon.com/dynamodb/home?region=eu-west-1#tables:selected=DummyTableName";

  expect(stack.resolve(factory.getDynamoTableUrl("DummyTableName"))).toEqual(
    expected
  );
  expect(
    stack.resolve(
      factory.getDynamoTableUrl(
        Lazy.string({ produce: () => "DummyTableName" })
      )
    )
  ).toEqual(expected);
});

test("getLambdaFunctionUrl", () => {
  const stack = new Stack();
  const factory = new AwsConsoleUrlFactory({ awsAccountId, awsAccountRegion });

  const expected =
    "https://eu-west-1.console.aws.amazon.com/lambda/home?region=eu-west-1#/functions/DummyFunctionName";

  expect(
    stack.resolve(factory.getLambdaFunctionUrl("DummyFunctionName"))
  ).toEqual(expected);
  expect(
    stack.resolve(
      factory.getLambdaFunctionUrl(
        Lazy.string({ produce: () => "DummyFunctionName" })
      )
    )
  ).toEqual(expected);
});

test("getStateMachineUrl", () => {
  const stack = new Stack();
  const factory = new AwsConsoleUrlFactory({ awsAccountId, awsAccountRegion });

  const expected =
    "https://eu-west-1.console.aws.amazon.com/states/home?region=eu-west-1#/statemachines/view/DummyArn";

  expect(stack.resolve(factory.getStateMachineUrl("DummyArn"))).toEqual(
    expected
  );
  expect(
    stack.resolve(
      factory.getStateMachineUrl(Lazy.string({ produce: () => "DummyArn" }))
    )
  ).toEqual(expected);
});

test("getKinesisDataStreamUrl", () => {
  const stack = new Stack();
  const factory = new AwsConsoleUrlFactory({ awsAccountId, awsAccountRegion });

  const expected =
    "https://eu-west-1.console.aws.amazon.com/kinesis/home?region=eu-west-1#/streams/details/DummyStream/monitoring";

  expect(stack.resolve(factory.getKinesisDataStreamUrl("DummyStream"))).toEqual(
    expected
  );
  expect(
    stack.resolve(
      factory.getKinesisDataStreamUrl(
        Lazy.string({ produce: () => "DummyStream" })
      )
    )
  ).toEqual(expected);
});

test("getKinesisFirehoseDeliveryStreamUrl", () => {
  const stack = new Stack();
  const factory = new AwsConsoleUrlFactory({ awsAccountId, awsAccountRegion });

  const expected =
    "https://eu-west-1.console.aws.amazon.com/firehose/home?region=eu-west-1#/details/DummyStream/monitoring";

  expect(
    stack.resolve(factory.getKinesisFirehoseDeliveryStreamUrl("DummyStream"))
  ).toEqual(expected);
  expect(
    stack.resolve(
      factory.getKinesisFirehoseDeliveryStreamUrl(
        Lazy.string({ produce: () => "DummyStream" })
      )
    )
  ).toEqual(expected);
});

test("getS3BucketUrl", () => {
  const stack = new Stack();
  const factory = new AwsConsoleUrlFactory({ awsAccountId, awsAccountRegion });

  const expected =
    "https://s3.console.aws.amazon.com/s3/buckets/DummyBucket?region=eu-west-1&tab=metrics";

  expect(stack.resolve(factory.getS3BucketUrl("DummyBucket"))).toEqual(
    expected
  );
  expect(
    stack.resolve(
      factory.getS3BucketUrl(Lazy.string({ produce: () => "DummyBucket" }))
    )
  ).toEqual(expected);
});

test("getApiGatewayUrl", () => {
  const stack = new Stack();
  const factory = new AwsConsoleUrlFactory({ awsAccountId, awsAccountRegion });

  const expected =
    "https://eu-west-1.console.aws.amazon.com/apigateway/home?region=eu-west-1#/apis/DummyApiId/dashboard";

  expect(stack.resolve(factory.getApiGatewayUrl("DummyApiId"))).toEqual(
    expected
  );
  expect(
    stack.resolve(
      factory.getApiGatewayUrl(Lazy.string({ produce: () => "DummyApiId" }))
    )
  ).toEqual(expected);
});

test("getRdsClusterUrl", () => {
  const stack = new Stack();
  const factory = new AwsConsoleUrlFactory({ awsAccountId, awsAccountRegion });

  const expected =
    "https://eu-west-1.console.aws.amazon.com/rds/home?region=eu-west-1#database:id=DummyClusterId;is-cluster=true;tab=monitoring";

  expect(stack.resolve(factory.getRdsClusterUrl("DummyClusterId"))).toEqual(
    expected
  );
  expect(
    stack.resolve(
      factory.getRdsClusterUrl(Lazy.string({ produce: () => "DummyClusterId" }))
    )
  ).toEqual(expected);
});

test("getRedshiftClusterUrl", () => {
  const stack = new Stack();
  const factory = new AwsConsoleUrlFactory({ awsAccountId, awsAccountRegion });

  const expected =
    "https://eu-west-1.console.aws.amazon.com/redshiftv2/home?region=eu-west-1#cluster-details?cluster=DummyClusterId";

  expect(
    stack.resolve(factory.getRedshiftClusterUrl("DummyClusterId"))
  ).toEqual(expected);
  expect(
    stack.resolve(
      factory.getRedshiftClusterUrl(
        Lazy.string({ produce: () => "DummyClusterId" })
      )
    )
  ).toEqual(expected);
});

test("getOpenSearchClusterUrl", () => {
  const stack = new Stack();
  const factory = new AwsConsoleUrlFactory({ awsAccountId, awsAccountRegion });

  const expected =
    "https://eu-west-1.console.aws.amazon.com/es/home?region=eu-west-1#domain:resource=DummyDomainName;action=dashboard;tab=TAB_CLUSTER_HEALTH_ID_V2";

  expect(
    stack.resolve(factory.getOpenSearchClusterUrl("DummyDomainName"))
  ).toEqual(expected);
  expect(
    stack.resolve(
      factory.getOpenSearchClusterUrl(
        Lazy.string({ produce: () => "DummyDomainName" })
      )
    )
  ).toEqual(expected);
});

test("getElastiCacheClusterUrl (memcached)", () => {
  const stack = new Stack();
  const factory = new AwsConsoleUrlFactory({ awsAccountId, awsAccountRegion });

  const expected =
    "https://eu-west-1.console.aws.amazon.com/elasticache/home?region=eu-west-1#/memcached/DummyDomainName";

  expect(
    stack.resolve(
      factory.getElastiCacheClusterUrl(
        "DummyDomainName",
        ElastiCacheClusterType.MEMCACHED
      )
    )
  ).toEqual(expected);
  const lazyClusterId = Lazy.string({ produce: () => "DummyDomainName" });
  expect(
    stack.resolve(
      factory.getElastiCacheClusterUrl(
        lazyClusterId,
        ElastiCacheClusterType.MEMCACHED
      )
    )
  ).toEqual(expected);
});

test("getElastiCacheClusterUrl (redis)", () => {
  const stack = new Stack();
  const factory = new AwsConsoleUrlFactory({ awsAccountId, awsAccountRegion });

  const expected =
    "https://eu-west-1.console.aws.amazon.com/elasticache/home?region=eu-west-1#/redis/DummyDomainName";

  expect(
    stack.resolve(
      factory.getElastiCacheClusterUrl(
        "DummyDomainName",
        ElastiCacheClusterType.REDIS
      )
    )
  ).toEqual(expected);
  const lazyClusterId = Lazy.string({ produce: () => "DummyDomainName" });
  expect(
    stack.resolve(
      factory.getElastiCacheClusterUrl(
        lazyClusterId,
        ElastiCacheClusterType.REDIS
      )
    )
  ).toEqual(expected);
});

test("getCloudFrontDistributionUrl", () => {
  const stack = new Stack();
  const factory = new AwsConsoleUrlFactory({ awsAccountId, awsAccountRegion });

  const expected =
    "https://console.aws.amazon.com/cloudfront/v2/home#/monitoring/DummyDistributionId";

  expect(
    stack.resolve(factory.getCloudFrontDistributionUrl("DummyDistributionId"))
  ).toEqual(expected);
  expect(
    stack.resolve(
      factory.getCloudFrontDistributionUrl(
        Lazy.string({ produce: () => "DummyDistributionId" })
      )
    )
  ).toEqual(expected);
});

test("getDocumentDbClusterUrl", () => {
  const stack = new Stack();
  const factory = new AwsConsoleUrlFactory({ awsAccountId, awsAccountRegion });

  const expected =
    "https://eu-west-1.console.aws.amazon.com/docdb/home?region=eu-west-1#cluster-details/DummyDocDbClusterId";

  expect(
    stack.resolve(factory.getDocumentDbClusterUrl("DummyDocDbClusterId"))
  ).toEqual(expected);
  expect(
    stack.resolve(
      factory.getDocumentDbClusterUrl(
        Lazy.string({ produce: () => "DummyDocDbClusterId" })
      )
    )
  ).toEqual(expected);
});
