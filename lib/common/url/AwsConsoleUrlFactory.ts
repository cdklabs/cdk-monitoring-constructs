import { IResolveContext, Lazy } from "aws-cdk-lib";

import { ElastiCacheClusterType } from "../../monitoring";

export interface AwsConsoleUrlFactoryProps {
  readonly awsAccountId: string;
  readonly awsAccountRegion: string;
}

export class AwsConsoleUrlFactory {
  protected readonly awsAccountId: string;
  protected readonly awsAccountRegion: string;

  constructor(props: AwsConsoleUrlFactoryProps) {
    this.awsAccountId = props.awsAccountId;
    this.awsAccountRegion = props.awsAccountRegion;
  }

  getAwsConsoleUrl(destinationUrl?: string): string | undefined {
    if (this.awsAccountId) {
      return Lazy.uncachedString({
        produce: (context) => {
          if (destinationUrl) {
            return this.getResolvedDestinationUrl(context, destinationUrl);
          }
          // simply go to the home page of the AWS console
          return `https://${this.awsAccountRegion}.console.aws.amazon.com`;
        },
      });
    }
    return undefined;
  }

  getCloudWatchLogGroupUrl(logGroupName: string): string | undefined {
    const region = this.awsAccountRegion;
    const destinationUrl = `https://${region}.console.aws.amazon.com/cloudwatch/home?region=${region}#logsV2:log-groups/log-group/${logGroupName}`;
    return this.getAwsConsoleUrl(destinationUrl);
  }

  getCodeBuildProjectUrl(projectName: string): string | undefined {
    const region = this.awsAccountRegion;
    const destinationUrl = `https://${region}.console.aws.amazon.com/codebuild/home?region=${region}#/projects/${projectName}`;
    return this.getAwsConsoleUrl(destinationUrl);
  }

  getSnsTopicUrl(topicArn: string): string | undefined {
    const region = this.awsAccountRegion;
    const destinationUrl = `https://${region}.console.aws.amazon.com/sns/v3/home?region=${region}#/topic/${topicArn}`;
    return this.getAwsConsoleUrl(destinationUrl);
  }

  getSqsQueueUrl(queueUrl: string): string | undefined {
    const region = this.awsAccountRegion;
    const destinationUrl = `https://${region}.console.aws.amazon.com/sqs/v2/home?region=${region}#/queues/${queueUrl}`;
    return this.getAwsConsoleUrl(destinationUrl);
  }

  getLambdaFunctionUrl(functionName: string): string | undefined {
    const region = this.awsAccountRegion;
    const destinationUrl = `https://${region}.console.aws.amazon.com/lambda/home?region=${region}#/functions/${functionName}`;
    return this.getAwsConsoleUrl(destinationUrl);
  }

  getDynamoTableUrl(tableName: string): string | undefined {
    const region = this.awsAccountRegion;
    const destinationUrl = `https://${region}.console.aws.amazon.com/dynamodb/home?region=${region}#tables:selected=${tableName}`;
    return this.getAwsConsoleUrl(destinationUrl);
  }

  getStateMachineUrl(stateMachineArn: string): string | undefined {
    const region = this.awsAccountRegion;
    const destinationUrl = `https://${region}.console.aws.amazon.com/states/home?region=${region}#/statemachines/view/${stateMachineArn}`;
    return this.getAwsConsoleUrl(destinationUrl);
  }

  getKinesisDataStreamUrl(streamName: string): string | undefined {
    const region = this.awsAccountRegion;
    const destinationUrl = `https://${region}.console.aws.amazon.com/kinesis/home?region=${region}#/streams/details/${streamName}/monitoring`;
    return this.getAwsConsoleUrl(destinationUrl);
  }

  getKinesisFirehoseDeliveryStreamUrl(streamName: string): string | undefined {
    const region = this.awsAccountRegion;
    const destinationUrl = `https://${region}.console.aws.amazon.com/firehose/home?region=${region}#/details/${streamName}/monitoring`;
    return this.getAwsConsoleUrl(destinationUrl);
  }

  getKinesisAnalyticsUrl(application: string): string | undefined {
    const region = this.awsAccountRegion;
    const destinationUrl = `https://${region}.console.aws.amazon.com/kinesisanalytics/home?region=${region}#/details?applicationName=${application}`;
    return this.getAwsConsoleUrl(destinationUrl);
  }

  getS3BucketUrl(bucketName: string): string | undefined {
    const region = this.awsAccountRegion;
    const destinationUrl = `https://s3.console.aws.amazon.com/s3/buckets/${bucketName}?region=${region}&tab=metrics`;
    return this.getAwsConsoleUrl(destinationUrl);
  }

  getApiGatewayUrl(restApiId: string): string | undefined {
    const region = this.awsAccountRegion;
    const destinationUrl = `https://${region}.console.aws.amazon.com/apigateway/home?region=${region}#/apis/${restApiId}/dashboard`;
    return this.getAwsConsoleUrl(destinationUrl);
  }

  getRdsClusterUrl(clusterId: string): string | undefined {
    const region = this.awsAccountRegion;
    const destinationUrl = `https://${region}.console.aws.amazon.com/rds/home?region=${region}#database:id=${clusterId};is-cluster=true;tab=monitoring`;
    return this.getAwsConsoleUrl(destinationUrl);
  }

  getRedshiftClusterUrl(clusterId: string): string | undefined {
    const region = this.awsAccountRegion;
    const destinationUrl = `https://${region}.console.aws.amazon.com/redshiftv2/home?region=${region}#cluster-details?cluster=${clusterId}`;
    return this.getAwsConsoleUrl(destinationUrl);
  }

  getOpenSearchClusterUrl(domainName: string): string | undefined {
    const region = this.awsAccountRegion;
    const destinationUrl = `https://${region}.console.aws.amazon.com/es/home?region=${region}#domain:resource=${domainName};action=dashboard;tab=TAB_CLUSTER_HEALTH_ID_V2`;
    return this.getAwsConsoleUrl(destinationUrl);
  }

  getCloudFrontDistributionUrl(distributionId: string): string | undefined {
    const destinationUrl = `https://console.aws.amazon.com/cloudfront/v2/home#/monitoring/${distributionId}`;
    return this.getAwsConsoleUrl(destinationUrl);
  }

  getElastiCacheClusterUrl(
    clusterId: string,
    clusterType: ElastiCacheClusterType
  ): string | undefined {
    const region = this.awsAccountRegion;
    switch (clusterType) {
      case ElastiCacheClusterType.MEMCACHED:
        const destinationUrlMemcached = `https://${region}.console.aws.amazon.com/elasticache/home?region=${region}#memcached-nodes:id=${clusterId};nodes`;
        return this.getAwsConsoleUrl(destinationUrlMemcached);
      case ElastiCacheClusterType.REDIS:
        const destinationUrlRedis = `https://${region}.console.aws.amazon.com/elasticache/home?region=${region}#redis-shards:redis-id=${clusterId}`;
        return this.getAwsConsoleUrl(destinationUrlRedis);
      default:
        throw new Error(`Invalid cache type: ${clusterType}`);
    }
  }

  getDocumentDbClusterUrl(clusterId: string): string | undefined {
    const region = this.awsAccountRegion;
    const destinationUrl = `https://${region}.console.aws.amazon.com/docdb/home?region=${region}#cluster-details/${clusterId}`;
    return this.getAwsConsoleUrl(destinationUrl);
  }

  /**
   * Resolves a destination URL within a resolution context.
   * @param context The resolution context.
   * @param destinationUrl The destination URL to resolve since it may contain CDK tokens.
   * @see https://docs.aws.amazon.com/cdk/latest/guide/tokens.html
   */
  protected getResolvedDestinationUrl(
    context: IResolveContext,
    destinationUrl: string
  ): string {
    let resolvedDestination = context.resolve(destinationUrl);

    if (typeof resolvedDestination !== "string") {
      // keep unresolved since we do not know how to deal with objects
      resolvedDestination = destinationUrl;
    }

    return resolvedDestination;
  }
}
