import { IConstruct, IAspect } from "monocdk";
import * as apigw from "monocdk/aws-apigateway";
import * as apigwv2 from "monocdk/aws-apigatewayv2";
import * as appsync from "monocdk/aws-appsync";
import * as autoscaling from "monocdk/aws-autoscaling";
import * as acm from "monocdk/aws-certificatemanager";
import * as cloudfront from "monocdk/aws-cloudfront";
import * as codebuild from "monocdk/aws-codebuild";
import * as dynamodb from "monocdk/aws-dynamodb";
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
import * as wafv2 from "monocdk/aws-wafv2";

import { ElastiCacheClusterType } from "../monitoring";
import { MonitoringAspectProps, MonitoringAspectType } from "./aspect-types";
import { MonitoringFacade } from "./MonitoringFacade";

/**
 * A CDK aspect that adds support for monitoring all resources within scope.
 */
export class MonitoringAspect implements IAspect {
  /**
   * Whether or not we've added a monitoring to the scope for node independent monitorings.
   */
  private addedNodeIndependentMonitoringToScope = false;

  constructor(
    private readonly monitoringFacade: MonitoringFacade,
    private readonly props: MonitoringAspectProps = {}
  ) {}

  public visit(node: IConstruct): void {
    this.monitorAcm(node);
    this.monitorApiGateway(node);
    this.monitorApiGatewayV2(node);
    this.monitorAppSync(node);
    this.monitorAutoScalingGroup(node);
    this.monitorCloudFront(node);
    this.monitorCodeBuild(node);
    this.monitorDynamoDb(node);
    this.monitorGlue(node);
    this.monitorKinesisAnalytics(node);
    this.monitorKinesisDataStream(node);
    this.monitorKinesisFirehose(node);
    this.monitorLambda(node);
    this.monitorOpenSearch(node);
    this.monitorRds(node);
    this.monitorRedshift(node);
    this.monitorS3(node);
    this.monitorSecretsManager(node);
    this.monitorSns(node);
    this.monitorSqs(node);
    this.monitorStepFunctions(node);
    this.monitorSyntheticsCanaries(node);
    this.monitorWebApplicationFirewallV2Acls(node);

    if (!this.addedNodeIndependentMonitoringToScope) {
      this.addedNodeIndependentMonitoringToScope = true;

      this.monitorEc2();
      this.monitorBilling();
      this.monitorElasticCache();
    }
  }

  private getMonitoringDetails<T>(
    aspectOptions?: MonitoringAspectType<T>
  ): [boolean, T?] {
    const isEnabled = aspectOptions?.enabled ?? true;
    const props = aspectOptions?.props;
    return [isEnabled, props];
  }

  private monitorAcm(node: IConstruct) {
    const [isEnabled, props] = this.getMonitoringDetails(this.props.acm);
    if (isEnabled && node instanceof acm.Certificate) {
      this.monitoringFacade.monitorCertificate({
        certificate: node,
        alarmFriendlyName: node.node.path,
        ...props,
      });
    }
  }

  private monitorApiGateway(node: IConstruct) {
    const [isEnabled, props] = this.getMonitoringDetails(this.props.apiGateway);
    if (isEnabled && node instanceof apigw.RestApi) {
      this.monitoringFacade.monitorApiGateway({
        api: node,
        ...props,
      });
    }
  }

  private monitorApiGatewayV2(node: IConstruct) {
    const [isEnabled, props] = this.getMonitoringDetails(
      this.props.apiGatewayV2
    );
    if (isEnabled && node instanceof apigwv2.HttpApi) {
      this.monitoringFacade.monitorApiGatewayV2HttpApi({
        api: node,
        ...props,
      });
    }
  }

  private monitorAppSync(node: IConstruct) {
    const [isEnabled, props] = this.getMonitoringDetails(this.props.appSync);
    if (isEnabled && node instanceof appsync.GraphqlApi) {
      this.monitoringFacade.monitorAppSyncApi({
        api: node,
        alarmFriendlyName: node.node.path,
        ...props,
      });
    }
  }

  private monitorAutoScalingGroup(node: IConstruct) {
    const [isEnabled, props] = this.getMonitoringDetails(
      this.props.autoScalingGroup
    );
    if (isEnabled && node instanceof autoscaling.AutoScalingGroup) {
      this.monitoringFacade.monitorAutoScalingGroup({
        autoScalingGroup: node,
        ...props,
      });
    }
  }

  private monitorBilling() {
    const [isEnabled, props] = this.getMonitoringDetails(this.props.billing);
    if (isEnabled) {
      this.monitoringFacade.monitorBilling({
        ...props,
        alarmFriendlyName: "Billing",
      });
    }
  }

  private monitorCloudFront(node: IConstruct) {
    const [isEnabled, props] = this.getMonitoringDetails(this.props.cloudFront);
    if (isEnabled && node instanceof cloudfront.Distribution) {
      this.monitoringFacade.monitorCloudFrontDistribution({
        distribution: node,
        ...props,
      });
    }
  }

  private monitorCodeBuild(node: IConstruct) {
    const [isEnabled, props] = this.getMonitoringDetails(this.props.codeBuild);
    if (isEnabled && node instanceof codebuild.Project) {
      this.monitoringFacade.monitorCodeBuildProject({
        project: node,
        ...props,
      });
    }
  }

  private monitorDynamoDb(node: IConstruct) {
    const [isEnabled, props] = this.getMonitoringDetails(this.props.dynamoDB);
    if (isEnabled && node instanceof dynamodb.Table) {
      this.monitoringFacade.monitorDynamoTable({
        table: node,
        ...props,
      });
    }
  }

  private monitorEc2() {
    const [isEnabled, props] = this.getMonitoringDetails(this.props.ec2);
    if (isEnabled) {
      this.monitoringFacade.monitorEC2Instances({
        ...props,
      });
    }
  }

  private monitorElasticCache() {
    const [isEnabled, props] = this.getMonitoringDetails(
      this.props.elasticCache
    );
    if (isEnabled) {
      this.monitoringFacade.monitorElastiCacheCluster({
        clusterType: ElastiCacheClusterType.MEMCACHED,
        ...props,
      });
      this.monitoringFacade.monitorElastiCacheCluster({
        clusterType: ElastiCacheClusterType.REDIS,
        ...props,
      });
    }
  }

  private monitorGlue(node: IConstruct) {
    const [isEnabled, props] = this.getMonitoringDetails(this.props.glue);
    if (isEnabled && node instanceof glue.CfnJob) {
      this.monitoringFacade.monitorGlueJob({
        jobName: node.name!,
        ...props,
      });
    }
  }

  private monitorKinesisAnalytics(node: IConstruct) {
    const [isEnabled, props] = this.getMonitoringDetails(
      this.props.kinesisDataAnalytics
    );
    if (isEnabled && node instanceof kinesisanalytics.CfnApplication) {
      this.monitoringFacade.monitorKinesisDataAnalytics({
        application: node.applicationName!,
        alarmFriendlyName: node.node.path,
        ...props,
      });
    }
  }

  private monitorKinesisDataStream(node: IConstruct) {
    const [isEnabled, props] = this.getMonitoringDetails(
      this.props.kinesisDataStream
    );
    if (isEnabled && node instanceof kinesis.CfnStream) {
      this.monitoringFacade.monitorKinesisDataStream({
        streamName: node.name!,
        alarmFriendlyName: node.node.path,
        ...props,
      });
    }
  }

  private monitorKinesisFirehose(node: IConstruct) {
    const [isEnabled, props] = this.getMonitoringDetails(
      this.props.kinesisFirehose
    );
    if (isEnabled && node instanceof kinesisfirehose.CfnDeliveryStream) {
      this.monitoringFacade.monitorKinesisFirehose({
        deliveryStreamName: node.deliveryStreamName!,
        alarmFriendlyName: node.node.path,
        ...props,
      });
    }
  }

  private monitorLambda(node: IConstruct) {
    const [isEnabled, props] = this.getMonitoringDetails(this.props.lambda);
    if (isEnabled && node instanceof lambda.Function) {
      this.monitoringFacade.monitorLambdaFunction({
        lambdaFunction: node,
        ...props,
      });
    }
  }

  private monitorOpenSearch(node: IConstruct) {
    const [isEnabled, props] = this.getMonitoringDetails(this.props.openSearch);
    if (
      isEnabled &&
      (node instanceof elasticsearch.Domain ||
        node instanceof elasticsearch.CfnDomain ||
        node instanceof opensearch.Domain ||
        node instanceof opensearch.CfnDomain)
    ) {
      this.monitoringFacade.monitorOpenSearchCluster({
        domain: node,
        ...props,
      });
    }
  }

  private monitorRds(node: IConstruct) {
    const [isEnabled, props] = this.getMonitoringDetails(this.props.rds);
    if (isEnabled && node instanceof rds.DatabaseCluster) {
      this.monitoringFacade.monitorRdsCluster({
        clusterIdentifier: node.clusterIdentifier,
        alarmFriendlyName: node.node.path,
        ...props,
      });
    }
  }

  private monitorRedshift(node: IConstruct) {
    const [isEnabled, props] = this.getMonitoringDetails(this.props.redshift);
    if (isEnabled && node instanceof redshift.Cluster) {
      this.monitoringFacade.monitorRedshiftCluster({
        clusterIdentifier: node.clusterName,
        alarmFriendlyName: node.node.path,
        ...props,
      });
    }
  }

  private monitorS3(node: IConstruct) {
    const [isEnabled, props] = this.getMonitoringDetails(this.props.s3);
    if (isEnabled && node instanceof s3.Bucket) {
      this.monitoringFacade.monitorS3Bucket({
        bucket: node,
        ...props,
      });
    }
  }

  private monitorSecretsManager(node: IConstruct) {
    const [isEnabled, props] = this.getMonitoringDetails(
      this.props.secretsManager
    );
    if (isEnabled && node instanceof secretsmanager.Secret) {
      this.monitoringFacade.monitorSecretsManagerSecret({
        secret: node,
        ...props,
      });
    }
  }

  private monitorSns(node: IConstruct) {
    const [isEnabled, props] = this.getMonitoringDetails(this.props.sns);
    if (isEnabled && node instanceof sns.Topic) {
      this.monitoringFacade.monitorSnsTopic({
        topic: node,
        ...props,
      });
    }
  }

  private monitorSqs(node: IConstruct) {
    const [isEnabled, props] = this.getMonitoringDetails(this.props.sqs);
    if (isEnabled && node instanceof sqs.Queue) {
      this.monitoringFacade.monitorSqsQueue({
        queue: node,
        ...props,
      });
    }
  }

  private monitorStepFunctions(node: IConstruct) {
    const [isEnabled, props] = this.getMonitoringDetails(
      this.props.stepFunctions
    );
    if (isEnabled && node instanceof stepfunctions.StateMachine) {
      this.monitoringFacade.monitorStepFunction({
        stateMachine: node,
        ...props,
      });
    }
  }

  private monitorSyntheticsCanaries(node: IConstruct) {
    const [isEnabled, props] = this.getMonitoringDetails(
      this.props.syntheticsCanaries
    );
    if (isEnabled && node instanceof synthetics.Canary) {
      this.monitoringFacade.monitorSyntheticsCanary({
        canary: node,
        ...props,
      });
    }
  }

  private monitorWebApplicationFirewallV2Acls(node: IConstruct) {
    const [isEnabled, props] = this.getMonitoringDetails(
      this.props.webApplicationFirewallAclV2
    );
    if (isEnabled && node instanceof wafv2.CfnWebACL) {
      this.monitoringFacade.monitorWebApplicationFirewallAclV2({
        acl: node,
        ...props,
      });
    }
  }
}

export * from "./aspect-types";
