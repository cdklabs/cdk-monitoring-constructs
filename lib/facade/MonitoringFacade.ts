import { Aspects, Stack } from "aws-cdk-lib";
import { CompositeAlarm, IWidget } from "aws-cdk-lib/aws-cloudwatch";
import { Construct } from "constructs";

import { MonitoringAspectProps } from "./IMonitoringAspect";
import { MonitoringAspect } from "./MonitoringAspect";
import {
  AddCompositeAlarmProps,
  AlarmFactory,
  AlarmFactoryDefaults,
  AlarmWithAnnotation,
  AwsConsoleUrlFactory,
  MetricFactory,
  MetricFactoryDefaults,
  Monitoring,
  MonitoringScope,
} from "../common";
import {
  DefaultDashboardFactory,
  DefaultWidgetFactory,
  HeaderLevel,
  HeaderWidget,
  IDashboardSegment,
  IWidgetFactory,
  MonitoringDashboardsOverrideProps,
  SingleWidgetDashboardSegment,
} from "../dashboard";
import {
  IDynamicDashboardSegment,
  StaticSegmentDynamicAdapter,
} from "../dashboard/DynamicDashboardSegment";
import { IDynamicDashboardFactory } from "../dashboard/IDynamicDashboardFactory";
import {
  ApiGatewayMonitoring,
  ApiGatewayMonitoringProps,
  ApiGatewayV2HttpApiMonitoring,
  ApiGatewayV2HttpApiMonitoringProps,
  AppSyncMonitoring,
  AppSyncMonitoringProps,
  AutoScalingGroupMonitoring,
  AutoScalingGroupMonitoringProps,
  BillingMonitoring,
  BillingMonitoringProps,
  CertificateManagerMonitoring,
  CertificateManagerMonitoringProps,
  CloudFrontDistributionMonitoring,
  CloudFrontDistributionMonitoringProps,
  CodeBuildProjectMonitoring,
  CodeBuildProjectMonitoringProps,
  CustomMonitoring,
  CustomMonitoringProps,
  DocumentDbMonitoring,
  DocumentDbMonitoringProps,
  DynamoTableGlobalSecondaryIndexMonitoring,
  DynamoTableGlobalSecondaryIndexMonitoringProps,
  DynamoTableMonitoring,
  DynamoTableMonitoringProps,
  Ec2ApplicationLoadBalancerMonitoringProps,
  EC2Monitoring,
  EC2MonitoringProps,
  Ec2NetworkLoadBalancerMonitoringProps,
  Ec2ServiceMonitoring,
  Ec2ServiceMonitoringProps,
  ElastiCacheClusterMonitoring,
  ElastiCacheClusterMonitoringProps,
  FargateApplicationLoadBalancerMonitoringProps,
  FargateNetworkLoadBalancerMonitoringProps,
  FargateServiceMonitoring,
  FargateServiceMonitoringProps,
  getQueueProcessingEc2ServiceMonitoring,
  getQueueProcessingFargateServiceMonitoring,
  GlueJobMonitoring,
  GlueJobMonitoringProps,
  KinesisDataAnalyticsMonitoring,
  KinesisDataAnalyticsMonitoringProps,
  KinesisDataStreamMonitoring,
  KinesisDataStreamMonitoringProps,
  KinesisFirehoseMonitoring,
  KinesisFirehoseMonitoringProps,
  LambdaFunctionMonitoring,
  LambdaFunctionMonitoringProps,
  LogMonitoring,
  LogMonitoringProps,
  NetworkLoadBalancerMonitoring,
  NetworkLoadBalancerMonitoringProps,
  OpenSearchClusterMonitoring,
  OpenSearchClusterMonitoringProps,
  QueueProcessingEc2ServiceMonitoringProps,
  QueueProcessingFargateServiceMonitoringProps,
  RdsClusterMonitoring,
  RdsClusterMonitoringProps,
  RedshiftClusterMonitoring,
  RedshiftClusterMonitoringProps,
  S3BucketMonitoring,
  S3BucketMonitoringProps,
  SecretsManagerSecretMonitoring,
  SecretsManagerSecretMonitoringProps,
  SimpleEc2ServiceMonitoringProps,
  SimpleFargateServiceMonitoringProps,
  SnsTopicMonitoring,
  SnsTopicMonitoringProps,
  SqsQueueMonitoring,
  SqsQueueMonitoringProps,
  SqsQueueMonitoringWithDlq,
  SqsQueueMonitoringWithDlqProps,
  StepFunctionActivityMonitoring,
  StepFunctionActivityMonitoringProps,
  StepFunctionLambdaIntegrationMonitoring,
  StepFunctionLambdaIntegrationMonitoringProps,
  StepFunctionMonitoring,
  StepFunctionMonitoringProps,
  StepFunctionServiceIntegrationMonitoring,
  StepFunctionServiceIntegrationMonitoringProps,
  SyntheticsCanaryMonitoring,
  SyntheticsCanaryMonitoringProps,
  WafV2Monitoring,
  WafV2MonitoringProps,
} from "../monitoring";

export interface MonitoringFacadeProps {
  /**
   * Defaults for metric factory.
   *
   * @default - empty (no preferences)
   */
  readonly metricFactoryDefaults?: MetricFactoryDefaults;

  /**
   * Defaults for alarm factory.
   *
   * @default - actions enabled, facade logical ID used as default alarm name prefix
   */
  readonly alarmFactoryDefaults?: AlarmFactoryDefaults;

  /**
   * Defaults for dashboard factory.
   *
   * @default - An instance of {@link DynamicDashboardFactory}; facade logical ID used as default name
   */
  readonly dashboardFactory?: IDynamicDashboardFactory;
}

/**
 * An implementation of a {@link MonitoringScope}.
 *
 * This acts as the convenient main entrypoint to monitor resources.
 */
export class MonitoringFacade extends MonitoringScope {
  protected readonly metricFactoryDefaults: MetricFactoryDefaults;
  protected readonly alarmFactoryDefaults: AlarmFactoryDefaults;
  public readonly dashboardFactory?: IDynamicDashboardFactory;
  protected readonly createdSegments: (
    | IDashboardSegment
    | IDynamicDashboardSegment
  )[];

  constructor(scope: Construct, id: string, props?: MonitoringFacadeProps) {
    super(scope, id);

    this.metricFactoryDefaults = props?.metricFactoryDefaults ?? {};
    this.alarmFactoryDefaults = props?.alarmFactoryDefaults ?? {
      alarmNamePrefix: id,
      actionsEnabled: true,
    };
    this.dashboardFactory =
      props?.dashboardFactory ??
      new DefaultDashboardFactory(scope, `${id}-Dashboards`, {
        dashboardNamePrefix: id,
      });

    this.createdSegments = [];
  }

  // FACTORIES
  // =========

  createAlarmFactory(alarmNamePrefix: string): AlarmFactory {
    return new AlarmFactory(this, {
      globalAlarmDefaults: this.alarmFactoryDefaults,
      globalMetricDefaults: this.metricFactoryDefaults,
      localAlarmNamePrefix: alarmNamePrefix,
    });
  }

  createAwsConsoleUrlFactory(): AwsConsoleUrlFactory {
    const stack = Stack.of(this);
    const awsAccountId = this.metricFactoryDefaults.account ?? stack.account;
    const awsAccountRegion = this.metricFactoryDefaults.region ?? stack.region;
    return new AwsConsoleUrlFactory({ awsAccountRegion, awsAccountId });
  }

  createMetricFactory(): MetricFactory {
    return new MetricFactory({ globalDefaults: this.metricFactoryDefaults });
  }

  createWidgetFactory(): IWidgetFactory {
    return new DefaultWidgetFactory();
  }

  // GENERIC
  // =======

  /**
   * Returns the created alarms across all the monitorings added up until now.
   */
  createdAlarms(): AlarmWithAnnotation[] {
    const alarms: AlarmWithAnnotation[] = [];
    this.createdSegments.forEach((monitoring) => {
      if (monitoring instanceof Monitoring) {
        alarms.push(...monitoring.createdAlarms());
      }
    });
    return alarms;
  }

  /**
   * Returns a subset of created alarms that are marked by a specific custom tag.
   * @param customTag tag to filter alarms by
   */
  createdAlarmsWithTag(customTag: string): AlarmWithAnnotation[] {
    return this.createdAlarms().filter((alarm) =>
      alarm.customTags?.includes(customTag)
    );
  }

  /**
   * Returns a subset of created alarms that are marked by a specific disambiguator.
   * @param disambiguator disambiguator to filter alarms by
   */
  createdAlarmsWithDisambiguator(disambiguator: string): AlarmWithAnnotation[] {
    return this.createdAlarms().filter(
      (alarm) => alarm.disambiguator === disambiguator
    );
  }

  /**
   * Finds a subset of created alarms that are marked by a specific custom tag and creates a composite alarm.
   * This composite alarm is created with an 'OR' condition, so it triggers with any child alarm.
   * NOTE: This composite alarm is not added among other alarms, so it is not returned by createdAlarms() calls.
   *
   * @param customTag tag to filter alarms by
   * @param props customization options
   */
  createCompositeAlarmUsingTag(
    customTag: string,
    props?: AddCompositeAlarmProps
  ): CompositeAlarm | undefined {
    const alarms = this.createdAlarmsWithTag(customTag);
    if (alarms.length > 0) {
      const disambiguator = props?.disambiguator ?? customTag;
      const alarmFactory = this.createAlarmFactory("Composite");
      return alarmFactory.addCompositeAlarm(alarms, {
        ...(props ?? {}),
        disambiguator,
      });
    }
    return undefined;
  }

  /**
   * Finds a subset of created alarms that are marked by a specific disambiguator and creates a composite alarm.
   * This composite alarm is created with an 'OR' condition, so it triggers with any child alarm.
   * NOTE: This composite alarm is not added among other alarms, so it is not returned by createdAlarms() calls.
   *
   * @param alarmDisambiguator disambiguator to filter alarms by
   * @param props customization options
   */
  createCompositeAlarmUsingDisambiguator(
    alarmDisambiguator: string,
    props?: AddCompositeAlarmProps
  ): CompositeAlarm | undefined {
    const alarms = this.createdAlarmsWithDisambiguator(alarmDisambiguator);
    if (alarms.length > 0) {
      const disambiguator = props?.disambiguator ?? alarmDisambiguator;
      const alarmFactory = this.createAlarmFactory("Composite");
      return alarmFactory.addCompositeAlarm(alarms, {
        ...(props ?? {}),
        disambiguator,
      });
    }
    return undefined;
  }

  /**
   * Returns the created monitorings added up until now.
   */
  createdMonitorings(): Monitoring[] {
    return this.createdSegments
      .filter((s) => s instanceof Monitoring)
      .map((s) => s as Monitoring);
  }

  /**
   * Adds a dashboard segment which returns dynamic content depending on dashboard type.
   * @param segment dynamic segment to add.
   */
  addDynamicSegment(segment: IDynamicDashboardSegment) {
    this.dashboardFactory?.addDynamicSegment(segment);
    this.createdSegments.push(segment);
  }

  /**
   * Adds a dashboard segment to go on one of the {@link DefaultDashboards}.
   * @param segment segment to add
   * @param overrideProps props to specify which default dashboards this segment is added to.
   */
  addSegment(
    segment: IDashboardSegment,
    overrideProps?: MonitoringDashboardsOverrideProps
  ) {
    const adaptedSegment = new StaticSegmentDynamicAdapter({
      segment,
      overrideProps,
    });
    this.dashboardFactory?.addDynamicSegment(adaptedSegment);

    this.createdSegments.push(segment);
    return this;
  }

  addLargeHeader(text: string, addToSummary?: boolean, addToAlarm?: boolean) {
    this.addWidget(
      new HeaderWidget(text, HeaderLevel.LARGE),
      addToSummary ?? false,
      addToAlarm ?? false
    );
    return this;
  }

  addMediumHeader(text: string, addToSummary?: boolean, addToAlarm?: boolean) {
    this.addWidget(
      new HeaderWidget(text, HeaderLevel.MEDIUM),
      addToSummary ?? false,
      addToAlarm ?? false
    );
    return this;
  }

  addSmallHeader(text: string, addToSummary?: boolean, addToAlarm?: boolean) {
    this.addWidget(
      new HeaderWidget(text, HeaderLevel.SMALL),
      addToSummary ?? false,
      addToAlarm ?? false
    );
    return this;
  }

  addWidget(widget: IWidget, addToSummary?: boolean, addToAlarm?: boolean) {
    this.addSegment(
      new SingleWidgetDashboardSegment(widget, addToSummary, addToAlarm)
    );
    return this;
  }

  // RESOURCE MONITORING
  // ===================

  /**
   * Uses an aspect to automatically monitor all resources in the given scope.
   *
   * @param scope Scope with resources to monitor.
   * @param aspectProps Optional configuration.
   *
   * @experimental
   */
  monitorScope(scope: Construct, aspectProps?: MonitoringAspectProps) {
    const aspect = new MonitoringAspect(this, aspectProps);
    Aspects.of(scope).add(aspect);
  }

  monitorApiGateway(props: ApiGatewayMonitoringProps) {
    const segment = new ApiGatewayMonitoring(this, props);
    this.addSegment(segment, props);
    return this;
  }

  monitorApiGatewayV2HttpApi(props: ApiGatewayV2HttpApiMonitoringProps) {
    const segment = new ApiGatewayV2HttpApiMonitoring(this, props);
    this.addSegment(segment, props);
    return this;
  }

  monitorAppSyncApi(props: AppSyncMonitoringProps) {
    const segment = new AppSyncMonitoring(this, props);
    this.addSegment(segment, props);
    return this;
  }

  monitorCertificate(props: CertificateManagerMonitoringProps) {
    const segment = new CertificateManagerMonitoring(this, props);
    this.addSegment(segment, props);
    return this;
  }

  monitorCloudFrontDistribution(props: CloudFrontDistributionMonitoringProps) {
    const segment = new CloudFrontDistributionMonitoring(this, props);
    this.addSegment(segment, props);
    return this;
  }

  monitorCodeBuildProject(props: CodeBuildProjectMonitoringProps) {
    const segment = new CodeBuildProjectMonitoring(this, props);
    this.addSegment(segment, props);
    return this;
  }

  monitorDocumentDbCluster(props: DocumentDbMonitoringProps) {
    const segment = new DocumentDbMonitoring(this, props);
    this.addSegment(segment, props);
    return this;
  }

  monitorDynamoTable(props: DynamoTableMonitoringProps) {
    const segment = new DynamoTableMonitoring(this, props);
    this.addSegment(segment, props);
    return this;
  }

  monitorDynamoTableGlobalSecondaryIndex(
    props: DynamoTableGlobalSecondaryIndexMonitoringProps
  ) {
    const segment = new DynamoTableGlobalSecondaryIndexMonitoring(this, props);
    this.addSegment(segment, props);
    return this;
  }

  monitorEC2Instances(props: EC2MonitoringProps) {
    const segment = new EC2Monitoring(this, props);
    this.addSegment(segment, props);
    return this;
  }

  monitorElasticsearchCluster(props: OpenSearchClusterMonitoringProps) {
    const segment = new OpenSearchClusterMonitoring(this, props);
    this.addSegment(segment, props);
    return this;
  }

  monitorOpenSearchCluster(props: OpenSearchClusterMonitoringProps) {
    const segment = new OpenSearchClusterMonitoring(this, props);
    this.addSegment(segment, props);
    return this;
  }

  monitorElastiCacheCluster(props: ElastiCacheClusterMonitoringProps) {
    const segment = new ElastiCacheClusterMonitoring(this, props);
    this.addSegment(segment, props);
    return this;
  }

  monitorGlueJob(props: GlueJobMonitoringProps) {
    const segment = new GlueJobMonitoring(this, props);
    this.addSegment(segment, props);
    return this;
  }

  monitorFargateService(props: FargateServiceMonitoringProps) {
    const segment = new FargateServiceMonitoring(this, {
      ...props,
      fargateService: props.fargateService.service,
      loadBalancer: props.fargateService.loadBalancer,
      targetGroup: props.fargateService.targetGroup,
    });
    this.addSegment(segment, props);
    return this;
  }

  monitorSimpleFargateService(props: SimpleFargateServiceMonitoringProps) {
    const segment = new FargateServiceMonitoring(this, {
      ...props,
      fargateService: props.fargateService,
    });
    this.addSegment(segment, props);
    return this;
  }

  monitorFargateNetworkLoadBalancer(
    props: FargateNetworkLoadBalancerMonitoringProps
  ) {
    const segment = new FargateServiceMonitoring(this, {
      ...props,
      fargateService: props.fargateService,
      loadBalancer: props.networkLoadBalancer,
      targetGroup: props.networkTargetGroup,
    });
    this.addSegment(segment, props);
    return this;
  }

  monitorFargateApplicationLoadBalancer(
    props: FargateApplicationLoadBalancerMonitoringProps
  ) {
    const segment = new FargateServiceMonitoring(this, {
      ...props,
      fargateService: props.fargateService,
      loadBalancer: props.applicationLoadBalancer,
      targetGroup: props.applicationTargetGroup,
    });
    this.addSegment(segment, props);
    return this;
  }

  monitorEc2Service(props: Ec2ServiceMonitoringProps) {
    const segment = new Ec2ServiceMonitoring(this, {
      ...props,
      ec2Service: props.ec2Service.service,
      loadBalancer: props.ec2Service.loadBalancer,
      targetGroup: props.ec2Service.targetGroup,
    });
    this.addSegment(segment, props);
    return this;
  }

  monitorSimpleEc2Service(props: SimpleEc2ServiceMonitoringProps) {
    const segment = new Ec2ServiceMonitoring(this, {
      ...props,
      ec2Service: props.ec2Service,
    });
    this.addSegment(segment, props);
    return this;
  }

  monitorEc2NetworkLoadBalancer(props: Ec2NetworkLoadBalancerMonitoringProps) {
    const segment = new Ec2ServiceMonitoring(this, {
      ...props,
      ec2Service: props.ec2Service,
      loadBalancer: props.networkLoadBalancer,
      targetGroup: props.networkTargetGroup,
    });
    this.addSegment(segment, props);
    return this;
  }

  monitorEc2ApplicationLoadBalancer(
    props: Ec2ApplicationLoadBalancerMonitoringProps
  ) {
    const segment = new Ec2ServiceMonitoring(this, {
      ...props,
      ec2Service: props.ec2Service,
      loadBalancer: props.applicationLoadBalancer,
      targetGroup: props.applicationTargetGroup,
    });
    this.addSegment(segment, props);
    return this;
  }

  monitorQueueProcessingFargateService(
    props: QueueProcessingFargateServiceMonitoringProps
  ) {
    getQueueProcessingFargateServiceMonitoring(this, props).forEach((segment) =>
      this.addSegment(segment)
    );
    return this;
  }

  monitorQueueProcessingEc2Service(
    props: QueueProcessingEc2ServiceMonitoringProps
  ) {
    getQueueProcessingEc2ServiceMonitoring(this, props).forEach((segment) =>
      this.addSegment(segment)
    );
    return this;
  }

  monitorAutoScalingGroup(props: AutoScalingGroupMonitoringProps) {
    const segment = new AutoScalingGroupMonitoring(this, props);
    this.addSegment(segment, props);
    return this;
  }

  monitorKinesisFirehose(props: KinesisFirehoseMonitoringProps) {
    const segment = new KinesisFirehoseMonitoring(this, props);
    this.addSegment(segment, props);
    return this;
  }

  monitorKinesisDataStream(props: KinesisDataStreamMonitoringProps) {
    const segment = new KinesisDataStreamMonitoring(this, props);
    this.addSegment(segment, props);
    return this;
  }

  monitorKinesisDataAnalytics(props: KinesisDataAnalyticsMonitoringProps) {
    const segment = new KinesisDataAnalyticsMonitoring(this, props);
    this.addSegment(segment, props);
    return this;
  }

  monitorLambdaFunction(props: LambdaFunctionMonitoringProps) {
    const segment = new LambdaFunctionMonitoring(this, props);
    this.addSegment(segment, props);
    return this;
  }

  monitorNetworkLoadBalancer(props: NetworkLoadBalancerMonitoringProps) {
    const segment = new NetworkLoadBalancerMonitoring(this, props);
    this.addSegment(segment, props);
    return this;
  }

  monitorRdsCluster(props: RdsClusterMonitoringProps) {
    const segment = new RdsClusterMonitoring(this, props);
    this.addSegment(segment, props);
    return this;
  }

  monitorRedshiftCluster(props: RedshiftClusterMonitoringProps) {
    const segment = new RedshiftClusterMonitoring(this, props);
    this.addSegment(segment, props);
    return this;
  }

  monitorSecretsManagerSecret(props: SecretsManagerSecretMonitoringProps) {
    const segment = new SecretsManagerSecretMonitoring(this, props);
    this.addSegment(segment, props);
    return this;
  }

  monitorSnsTopic(props: SnsTopicMonitoringProps) {
    const segment = new SnsTopicMonitoring(this, props);
    this.addSegment(segment, props);
    return this;
  }

  monitorSqsQueue(props: SqsQueueMonitoringProps) {
    const segment = new SqsQueueMonitoring(this, props);
    this.addSegment(segment, props);
    return this;
  }

  monitorSqsQueueWithDlq(props: SqsQueueMonitoringWithDlqProps) {
    const segment = new SqsQueueMonitoringWithDlq(this, props);
    this.addSegment(segment, props);
    return this;
  }

  monitorStepFunction(props: StepFunctionMonitoringProps) {
    const segment = new StepFunctionMonitoring(this, props);
    this.addSegment(segment, props);
    return this;
  }

  monitorStepFunctionActivity(props: StepFunctionActivityMonitoringProps) {
    const segment = new StepFunctionActivityMonitoring(this, props);
    this.addSegment(segment, props);
    return this;
  }

  monitorStepFunctionLambdaIntegration(
    props: StepFunctionLambdaIntegrationMonitoringProps
  ) {
    const segment = new StepFunctionLambdaIntegrationMonitoring(this, props);
    this.addSegment(segment, props);
    return this;
  }

  monitorStepFunctionServiceIntegration(
    props: StepFunctionServiceIntegrationMonitoringProps
  ) {
    const segment = new StepFunctionServiceIntegrationMonitoring(this, props);
    this.addSegment(segment, props);
    return this;
  }

  monitorS3Bucket(props: S3BucketMonitoringProps) {
    const segment = new S3BucketMonitoring(this, props);
    this.addSegment(segment, props);
    return this;
  }

  monitorLog(props: LogMonitoringProps) {
    const segment = new LogMonitoring(this, props);
    this.addSegment(segment, props);
    return this;
  }

  monitorSyntheticsCanary(props: SyntheticsCanaryMonitoringProps) {
    const segment = new SyntheticsCanaryMonitoring(this, props);
    this.addSegment(segment, props);
    return this;
  }

  monitorWebApplicationFirewallAclV2(props: WafV2MonitoringProps) {
    const segment = new WafV2Monitoring(this, props);
    this.addSegment(segment, props);
    return this;
  }

  monitorBilling(props?: BillingMonitoringProps) {
    const segment = new BillingMonitoring(this, props ?? {});
    this.addSegment(segment, props);
    return this;
  }

  monitorCustom(props: CustomMonitoringProps) {
    const segment = new CustomMonitoring(this, props);
    this.addSegment(segment, props);
    return this;
  }
}
