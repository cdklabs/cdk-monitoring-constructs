import * as redshift from "@aws-cdk/aws-redshift-alpha";
import { IAspect } from "aws-cdk-lib";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import * as apigwv2 from "aws-cdk-lib/aws-apigatewayv2";
import * as appsync from "aws-cdk-lib/aws-appsync";
import * as autoscaling from "aws-cdk-lib/aws-autoscaling";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as codebuild from "aws-cdk-lib/aws-codebuild";
import * as docdb from "aws-cdk-lib/aws-docdb";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as elasticsearch from "aws-cdk-lib/aws-elasticsearch";
import * as glue from "aws-cdk-lib/aws-glue";
import * as kinesis from "aws-cdk-lib/aws-kinesis";
import * as kinesisanalytics from "aws-cdk-lib/aws-kinesisanalytics";
import * as kinesisfirehose from "aws-cdk-lib/aws-kinesisfirehose";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as opensearch from "aws-cdk-lib/aws-opensearchservice";
import * as rds from "aws-cdk-lib/aws-rds";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import * as sns from "aws-cdk-lib/aws-sns";
import * as sqs from "aws-cdk-lib/aws-sqs";
import * as stepfunctions from "aws-cdk-lib/aws-stepfunctions";
import * as synthetics from "aws-cdk-lib/aws-synthetics";
import * as wafv2 from "aws-cdk-lib/aws-wafv2";
import { IConstruct } from "constructs";

import {
  MonitoringAspectProps,
  MonitoringAspectType,
} from "./IMonitoringAspect";
import { MonitoringFacade } from "./MonitoringFacade";
import { ElastiCacheClusterType } from "../monitoring";

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
    this.monitorAuroraCluster(node);
    this.monitorAutoScalingGroup(node);
    this.monitorCloudFront(node);
    this.monitorCodeBuild(node);
    this.monitorDocumentDb(node);
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
        apiStage: node.deploymentStage.stageName,
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

  private monitorAuroraCluster(node: IConstruct) {
    const [isEnabled, props] = this.getMonitoringDetails(
      this.props.auroraCluster
    );
    if (isEnabled && node instanceof rds.ServerlessCluster) {
      this.monitoringFacade.monitorAuroraCluster({
        cluster: node,
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

  private monitorDocumentDb(node: IConstruct) {
    const [isEnabled, props] = this.getMonitoringDetails(this.props.documentDb);
    if (isEnabled && node instanceof docdb.DatabaseCluster) {
      this.monitoringFacade.monitorDocumentDbCluster({
        cluster: node,
        alarmFriendlyName: node.node.path,
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
        cluster: node,
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
