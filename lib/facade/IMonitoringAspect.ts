import {
  ApiGatewayMonitoringOptions,
  ApiGatewayV2MonitoringOptions,
  AppSyncMonitoringOptions,
  AuroraClusterMonitoringOptions,
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
  RdsInstanceMonitoringOptions,
  RedshiftClusterMonitoringOptions,
  S3BucketMonitoringOptions,
  SecretsManagerSecretMonitoringOptions,
  SnsTopicMonitoringOptions,
  SqsQueueMonitoringOptions,
  StepFunctionMonitoringOptions,
  SyntheticsCanaryMonitoringOptions,
  WafV2MonitoringOptions,
} from "../monitoring";

/**
 * @deprecated Extend {@link BaseMonitoringAspectType} instead.
 *
 * This type is not compatable with JSII@5.x and will be removed in the next major version.
 */
export type MonitoringAspectType<T> = BaseMonitoringAspectType & {
  readonly props?: T;
};

export interface BaseMonitoringAspectType {
  /**
   * If the monitoring aspect is enabled for this resource.
   * @default - true
   */
  readonly enabled?: boolean;
}

export interface CertificateManagerAspectType extends BaseMonitoringAspectType {
  readonly props?: CertificateManagerMonitoringOptions;
}

export interface ApiGatewayAspectType extends BaseMonitoringAspectType {
  readonly props?: ApiGatewayMonitoringOptions;
}

export interface ApiGatewayV2AspectType extends BaseMonitoringAspectType {
  readonly props?: ApiGatewayV2MonitoringOptions;
}

export interface AppSyncAspectType extends BaseMonitoringAspectType {
  readonly props?: AppSyncMonitoringOptions;
}

export interface AuroraClusterAspectType extends BaseMonitoringAspectType {
  readonly props?: AuroraClusterMonitoringOptions;
}

export interface AutoScalingGroupAspectType extends BaseMonitoringAspectType {
  readonly props?: AutoScalingGroupMonitoringOptions;
}

export interface BillingAspectType extends BaseMonitoringAspectType {
  readonly props?: BillingMonitoringOptions;
}

export interface CloudFrontAspectType extends BaseMonitoringAspectType {
  readonly props?: CloudFrontDistributionMonitoringOptions;
}

export interface CodeBuildAspectType extends BaseMonitoringAspectType {
  readonly props?: CodeBuildProjectMonitoringOptions;
}

export interface DocumentDbAspectType extends BaseMonitoringAspectType {
  readonly props?: DocumentDbMonitoringOptions;
}

export interface DynamoTableAspectType extends BaseMonitoringAspectType {
  readonly props?: DynamoTableMonitoringOptions;
}

export interface EC2AspectType extends BaseMonitoringAspectType {
  readonly props?: EC2MonitoringOptions;
}

export interface ElastiCacheAspectType extends BaseMonitoringAspectType {
  readonly props?: ElastiCacheClusterMonitoringOptions;
}

export interface GlueJobAspectType extends BaseMonitoringAspectType {
  readonly props?: GlueJobMonitoringOptions;
}

export interface KinesisDataAnalyticsAspectType
  extends BaseMonitoringAspectType {
  readonly props?: KinesisDataAnalyticsMonitoringOptions;
}

export interface KinesisDataStreamAspectType extends BaseMonitoringAspectType {
  readonly props?: KinesisDataStreamMonitoringOptions;
}

export interface KinesisFirehoseAspectType extends BaseMonitoringAspectType {
  readonly props?: KinesisFirehoseMonitoringOptions;
}

export interface LambdaFunctionAspectType extends BaseMonitoringAspectType {
  readonly props?: LambdaFunctionMonitoringOptions;
}

export interface OpenSearchClusterAspectType extends BaseMonitoringAspectType {
  readonly props?: OpenSearchClusterMonitoringOptions;
}

export interface RdsClusterAspectType extends BaseMonitoringAspectType {
  readonly props?: RdsClusterMonitoringOptions;
}

export interface RdsInstanceAspectType extends BaseMonitoringAspectType {
  readonly props?: RdsInstanceMonitoringOptions;
}

export interface RedshiftClusterAspectType extends BaseMonitoringAspectType {
  readonly props?: RedshiftClusterMonitoringOptions;
}

export interface S3BucketAspectType extends BaseMonitoringAspectType {
  readonly props?: S3BucketMonitoringOptions;
}

export interface SecretsManagerSecretAspectType
  extends BaseMonitoringAspectType {
  readonly props?: SecretsManagerSecretMonitoringOptions;
}

export interface SnsTopicAspectType extends BaseMonitoringAspectType {
  readonly props?: SnsTopicMonitoringOptions;
}

export interface SqsQueueAspectType extends BaseMonitoringAspectType {
  readonly props?: SqsQueueMonitoringOptions;
}

export interface StepFunctionAspectType extends BaseMonitoringAspectType {
  readonly props?: StepFunctionMonitoringOptions;
}

export interface SyntheticsCanaryAspectType extends BaseMonitoringAspectType {
  readonly props?: SyntheticsCanaryMonitoringOptions;
}

export interface WafV2AspectType extends BaseMonitoringAspectType {
  readonly props?: WafV2MonitoringOptions;
}

export interface MonitoringAspectProps {
  readonly acm?: CertificateManagerAspectType;
  readonly apiGateway?: ApiGatewayAspectType;
  readonly apiGatewayV2?: ApiGatewayV2AspectType;
  readonly appSync?: AppSyncAspectType;
  readonly auroraCluster?: AuroraClusterAspectType;
  readonly autoScalingGroup?: AutoScalingGroupAspectType;
  readonly billing?: BillingAspectType;
  readonly cloudFront?: CloudFrontAspectType;
  readonly codeBuild?: CodeBuildAspectType;
  readonly documentDb?: DocumentDbAspectType;
  readonly dynamoDB?: DynamoTableAspectType;
  readonly ec2?: EC2AspectType;
  readonly elasticCache?: ElastiCacheAspectType;
  readonly glue?: GlueJobAspectType;
  readonly kinesisDataAnalytics?: KinesisDataAnalyticsAspectType;
  readonly kinesisDataStream?: KinesisDataStreamAspectType;
  readonly kinesisFirehose?: KinesisFirehoseAspectType;
  readonly lambda?: LambdaFunctionAspectType;
  readonly openSearch?: OpenSearchClusterAspectType;
  /**
   * @deprecated Use {@link rdsCluster} instead.
   */
  readonly rds?: RdsClusterAspectType;
  readonly rdsCluster?: RdsClusterAspectType;
  readonly rdsInstance?: RdsInstanceAspectType;
  readonly redshift?: RedshiftClusterAspectType;
  readonly s3?: S3BucketAspectType;
  readonly secretsManager?: SecretsManagerSecretAspectType;
  readonly sns?: SnsTopicAspectType;
  readonly sqs?: SqsQueueAspectType;
  readonly stepFunctions?: StepFunctionAspectType;
  readonly syntheticsCanaries?: SyntheticsCanaryAspectType;
  readonly webApplicationFirewallAclV2?: WafV2AspectType;
}
