import {
  ApiGatewayMonitoringOptions,
  ApiGatewayV2MonitoringOptions,
  AppSyncMonitoringOptions,
  AutoScalingGroupMonitoringOptions,
  BillingMonitoringOptions,
  CertificateManagerMonitoringOptions,
  CloudFrontDistributionMonitoringOptions,
  CodeBuildProjectMonitoringOptions,
  DocumentDbMonitoringOptions,
  DynamoTableMonitoringOptions,
  EC2MonitoringOptions,
  ElastiCacheClusterMonitoringOptions,
  GlueJobMonitoringOptions,
  KinesisDataAnalyticsMonitoringOptions,
  KinesisDataStreamMonitoringOptions,
  KinesisFirehoseMonitoringOptions,
  LambdaFunctionMonitoringOptions,
  OpenSearchClusterMonitoringOptions,
  RdsClusterMonitoringOptions,
  RedshiftClusterMonitoringOptions,
  S3BucketMonitoringOptions,
  SecretsManagerSecretMonitoringOptions,
  SnsTopicMonitoringOptions,
  SqsQueueMonitoringOptions,
  StepFunctionMonitoringOptions,
  SyntheticsCanaryMonitoringOptions,
  WafV2MonitoringOptions,
} from "../monitoring";

export interface MonitoringAspectType<T> {
  /**
   * If the monitoring aspect is enabled for this resource.
   * @default - true
   */
  readonly enabled?: boolean;

  /**
   * The monitoring props for this resource.
   * @default - none
   */
  readonly props?: T;
}

export interface MonitoringAspectProps {
  readonly acm?: MonitoringAspectType<CertificateManagerMonitoringOptions>;
  readonly apiGateway?: MonitoringAspectType<ApiGatewayMonitoringOptions>;
  readonly apiGatewayV2?: MonitoringAspectType<ApiGatewayV2MonitoringOptions>;
  readonly appSync?: MonitoringAspectType<AppSyncMonitoringOptions>;
  readonly autoScalingGroup?: MonitoringAspectType<AutoScalingGroupMonitoringOptions>;
  readonly billing?: MonitoringAspectType<BillingMonitoringOptions>;
  readonly cloudFront?: MonitoringAspectType<CloudFrontDistributionMonitoringOptions>;
  readonly codeBuild?: MonitoringAspectType<CodeBuildProjectMonitoringOptions>;
  readonly documentDb?: MonitoringAspectType<DocumentDbMonitoringOptions>;
  readonly dynamoDB?: MonitoringAspectType<DynamoTableMonitoringOptions>;
  readonly ec2?: MonitoringAspectType<EC2MonitoringOptions>;
  readonly elasticCache?: MonitoringAspectType<ElastiCacheClusterMonitoringOptions>;
  readonly glue?: MonitoringAspectType<GlueJobMonitoringOptions>;
  readonly kinesisDataAnalytics?: MonitoringAspectType<KinesisDataAnalyticsMonitoringOptions>;
  readonly kinesisDataStream?: MonitoringAspectType<KinesisDataStreamMonitoringOptions>;
  readonly kinesisFirehose?: MonitoringAspectType<KinesisFirehoseMonitoringOptions>;
  readonly lambda?: MonitoringAspectType<LambdaFunctionMonitoringOptions>;
  readonly openSearch?: MonitoringAspectType<OpenSearchClusterMonitoringOptions>;
  readonly rds?: MonitoringAspectType<RdsClusterMonitoringOptions>;
  readonly redshift?: MonitoringAspectType<RedshiftClusterMonitoringOptions>;
  readonly s3?: MonitoringAspectType<S3BucketMonitoringOptions>;
  readonly secretsManager?: MonitoringAspectType<SecretsManagerSecretMonitoringOptions>;
  readonly sns?: MonitoringAspectType<SnsTopicMonitoringOptions>;
  readonly sqs?: MonitoringAspectType<SqsQueueMonitoringOptions>;
  readonly stepFunctions?: MonitoringAspectType<StepFunctionMonitoringOptions>;
  readonly syntheticsCanaries?: MonitoringAspectType<SyntheticsCanaryMonitoringOptions>;
  readonly webApplicationFirewallAclV2?: MonitoringAspectType<WafV2MonitoringOptions>;
}
