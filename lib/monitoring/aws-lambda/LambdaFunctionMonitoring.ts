import {
  GraphWidget,
  HorizontalAnnotation,
  IWidget,
  Row,
} from "aws-cdk-lib/aws-cloudwatch";
import { CfnFunction, IFunction } from "aws-cdk-lib/aws-lambda";

import {
  AgeAlarmFactory,
  AlarmFactory,
  BaseMonitoringProps,
  CountAxisFromZero,
  DefaultGraphWidgetHeight,
  DefaultSummaryWidgetHeight,
  DurationThreshold,
  ErrorAlarmFactory,
  ErrorCountThreshold,
  ErrorRateThreshold,
  ErrorType,
  HighTpsThreshold,
  LatencyAlarmFactory,
  LatencyThreshold,
  LatencyType,
  LowTpsThreshold,
  MaxAgeThreshold,
  MegabyteMillisecondAxisFromZero,
  MetricWithAlarmSupport,
  Monitoring,
  MonitoringScope,
  PercentageAxisFromZeroToHundred,
  QuarterWidth,
  RateAxisFromZero,
  RunningTaskCountThreshold,
  RunningTaskRateThreshold,
  TaskHealthAlarmFactory,
  ThirdWidth,
  TimeAxisMillisFromZero,
  TpsAlarmFactory,
  UsageAlarmFactory,
  UsageThreshold,
  UsageType,
} from "../../common";
import {
  MonitoringHeaderWidget,
  MonitoringNamingStrategy,
} from "../../dashboard";
import { LambdaFunctionEnhancedMetricFactory } from "./LambdaFunctionEnhancedMetricFactory";
import {
  LambdaFunctionMetricFactory,
  LambdaFunctionMetricFactoryProps,
} from "./LambdaFunctionMetricFactory";

export interface LambdaFunctionMonitoringOptions extends BaseMonitoringProps {
  readonly addLatencyP50Alarm?: Record<string, LatencyThreshold>;
  readonly addLatencyP90Alarm?: Record<string, LatencyThreshold>;
  readonly addLatencyP99Alarm?: Record<string, LatencyThreshold>;

  readonly addFaultCountAlarm?: Record<string, ErrorCountThreshold>;
  readonly addFaultRateAlarm?: Record<string, ErrorRateThreshold>;

  readonly addLowTpsAlarm?: Record<string, LowTpsThreshold>;
  readonly addHighTpsAlarm?: Record<string, HighTpsThreshold>;

  readonly addThrottlesCountAlarm?: Record<string, ErrorCountThreshold>;
  readonly addThrottlesRateAlarm?: Record<string, ErrorRateThreshold>;

  readonly addConcurrentExecutionsCountAlarm?: Record<
    string,
    RunningTaskCountThreshold
  >;
  readonly addProvisionedConcurrencySpilloverInvocationsCountAlarm?: Record<
    string,
    RunningTaskCountThreshold
  >;
  readonly addProvisionedConcurrencySpilloverInvocationsRateAlarm?: Record<
    string,
    RunningTaskRateThreshold
  >;
  readonly addMaxIteratorAgeAlarm?: Record<string, MaxAgeThreshold>;

  // Enhanced CPU metrics that are all time-based and not percent based
  readonly addEnhancedMonitoringMaxCpuTotalTimeAlarm?: Record<
    string,
    DurationThreshold
  >;
  readonly addEnhancedMonitoringP90CpuTotalTimeAlarm?: Record<
    string,
    DurationThreshold
  >;
  readonly addEnhancedMonitoringAvgCpuTotalTimeAlarm?: Record<
    string,
    DurationThreshold
  >;

  // Enhanced memory metrics that are percent-based
  readonly addEnhancedMonitoringMaxMemoryUtilizationAlarm?: Record<
    string,
    UsageThreshold
  >;
  readonly addEnhancedMonitoringP90MemoryUtilizationAlarm?: Record<
    string,
    UsageThreshold
  >;
  readonly addEnhancedMonitoringAvgMemoryUtilizationAlarm?: Record<
    string,
    UsageThreshold
  >;
}

export interface LambdaFunctionMonitoringProps
  extends LambdaFunctionMetricFactoryProps,
    LambdaFunctionMonitoringOptions {}

export class LambdaFunctionMonitoring extends Monitoring {
  protected readonly title: string;
  protected readonly functionUrl?: string;

  protected readonly namingStrategy: MonitoringNamingStrategy;
  protected readonly metricFactory: LambdaFunctionMetricFactory;
  protected readonly alarmFactory: AlarmFactory;
  protected readonly errorAlarmFactory: ErrorAlarmFactory;
  protected readonly latencyAlarmFactory: LatencyAlarmFactory;
  protected readonly tpsAlarmFactory: TpsAlarmFactory;
  protected readonly taskHealthAlarmFactory: TaskHealthAlarmFactory;
  protected readonly ageAlarmFactory: AgeAlarmFactory;
  protected readonly usageAlarmFactory: UsageAlarmFactory;

  protected readonly latencyAnnotations: HorizontalAnnotation[];
  protected readonly errorCountAnnotations: HorizontalAnnotation[];
  protected readonly errorRateAnnotations: HorizontalAnnotation[];
  protected readonly invocationCountAnnotations: HorizontalAnnotation[];
  protected readonly invocationRateAnnotations: HorizontalAnnotation[];
  protected readonly tpsAnnotations: HorizontalAnnotation[];
  protected readonly cpuTotalTimeAnnotations: HorizontalAnnotation[];
  protected readonly memoryUsageAnnotations: HorizontalAnnotation[];
  protected readonly maxIteratorAgeAnnotations: HorizontalAnnotation[];

  protected readonly tpsMetric: MetricWithAlarmSupport;
  protected readonly p50LatencyMetric: MetricWithAlarmSupport;
  protected readonly p90LatencyMetric: MetricWithAlarmSupport;
  protected readonly p99LatencyMetric: MetricWithAlarmSupport;
  protected readonly faultCountMetric: MetricWithAlarmSupport;
  protected readonly faultRateMetric: MetricWithAlarmSupport;
  protected readonly invocationCountMetric: MetricWithAlarmSupport;
  protected readonly throttlesCountMetric: MetricWithAlarmSupport;
  protected readonly throttlesRateMetric: MetricWithAlarmSupport;
  protected readonly concurrentExecutionsCountMetric: MetricWithAlarmSupport;
  protected readonly provisionedConcurrencySpilloverInvocationsCountMetric: MetricWithAlarmSupport;
  protected readonly provisionedConcurrencySpilloverInvocationsRateMetric: MetricWithAlarmSupport;
  protected readonly maxIteratorAgeMetric: MetricWithAlarmSupport;

  protected readonly lambdaInsightsEnabled: boolean;
  protected readonly enhancedMetricFactory?: LambdaFunctionEnhancedMetricFactory;
  protected readonly enhancedMonitoringMaxCpuTotalTimeMetric?: MetricWithAlarmSupport;
  protected readonly enhancedMonitoringP90CpuTotalTimeMetric?: MetricWithAlarmSupport;
  protected readonly enhancedMonitoringAvgCpuTotalTimeMetric?: MetricWithAlarmSupport;
  protected readonly enhancedMonitoringMaxMemoryUtilizationMetric?: MetricWithAlarmSupport;
  protected readonly enhancedMonitoringP90MemoryUtilizationMetric?: MetricWithAlarmSupport;
  protected readonly enhancedMonitoringAvgMemoryUtilizationMetric?: MetricWithAlarmSupport;
  protected readonly enhancedMetricFunctionCostMetric?: MetricWithAlarmSupport;

  constructor(scope: MonitoringScope, props: LambdaFunctionMonitoringProps) {
    super(scope, props);

    this.namingStrategy = new MonitoringNamingStrategy({
      ...props,
      namedConstruct: props.lambdaFunction,
      fallbackConstructName: this.resolveFunctionName(props.lambdaFunction),
    });

    this.title = this.namingStrategy.resolveHumanReadableName();
    this.functionUrl = scope
      .createAwsConsoleUrlFactory()
      .getLambdaFunctionUrl(props.lambdaFunction.functionName);

    this.alarmFactory = this.createAlarmFactory(
      this.namingStrategy.resolveAlarmFriendlyName()
    );
    this.errorAlarmFactory = new ErrorAlarmFactory(this.alarmFactory);
    this.latencyAlarmFactory = new LatencyAlarmFactory(this.alarmFactory);
    this.tpsAlarmFactory = new TpsAlarmFactory(this.alarmFactory);
    this.taskHealthAlarmFactory = new TaskHealthAlarmFactory(this.alarmFactory);
    this.ageAlarmFactory = new AgeAlarmFactory(this.alarmFactory);
    this.usageAlarmFactory = new UsageAlarmFactory(this.alarmFactory);

    this.latencyAnnotations = [];
    this.errorCountAnnotations = [];
    this.errorRateAnnotations = [];
    this.invocationCountAnnotations = [];
    this.invocationRateAnnotations = [];
    this.tpsAnnotations = [];
    this.cpuTotalTimeAnnotations = [];
    this.memoryUsageAnnotations = [];
    this.maxIteratorAgeAnnotations = [];

    this.metricFactory = new LambdaFunctionMetricFactory(
      scope.createMetricFactory(),
      props
    );
    this.tpsMetric = this.metricFactory.metricTps();
    this.p50LatencyMetric = this.metricFactory.metricLatencyP50InMillis();
    this.p90LatencyMetric = this.metricFactory.metricLatencyP90InMillis();
    this.p99LatencyMetric = this.metricFactory.metricLatencyP99InMillis();
    this.faultCountMetric = this.metricFactory.metricFaultCount();
    this.faultRateMetric = this.metricFactory.metricFaultRate();
    this.invocationCountMetric = this.metricFactory.metricInvocationCount();
    this.throttlesCountMetric = this.metricFactory.metricThrottlesCount();
    this.throttlesRateMetric = this.metricFactory.metricThrottlesRate();
    this.concurrentExecutionsCountMetric =
      this.metricFactory.metricConcurrentExecutions();
    this.provisionedConcurrencySpilloverInvocationsCountMetric =
      this.metricFactory.metricProvisionedConcurrencySpilloverInvocations();
    this.provisionedConcurrencySpilloverInvocationsRateMetric =
      this.metricFactory.metricProvisionedConcurrencySpilloverRate();
    this.maxIteratorAgeMetric =
      this.metricFactory.metricMaxIteratorAgeInMillis();

    this.lambdaInsightsEnabled = props.lambdaInsightsEnabled ?? false;
    if (props.lambdaInsightsEnabled) {
      this.enhancedMetricFactory = new LambdaFunctionEnhancedMetricFactory(
        scope.createMetricFactory(),
        props.lambdaFunction
      );
      this.enhancedMonitoringMaxCpuTotalTimeMetric =
        this.enhancedMetricFactory.enhancedMetricMaxCpuTotalTime();
      this.enhancedMonitoringP90CpuTotalTimeMetric =
        this.enhancedMetricFactory.enhancedMetricP90CpuTotalTime();
      this.enhancedMonitoringAvgCpuTotalTimeMetric =
        this.enhancedMetricFactory.enhancedMetricAvgCpuTotalTime();
      this.enhancedMonitoringMaxMemoryUtilizationMetric =
        this.enhancedMetricFactory.enhancedMetricMaxMemoryUtilization();
      this.enhancedMonitoringP90MemoryUtilizationMetric =
        this.enhancedMetricFactory.enhancedMetricP90MemoryUtilization();
      this.enhancedMonitoringAvgMemoryUtilizationMetric =
        this.enhancedMetricFactory.enhancedMetricAvgMemoryUtilization();
      this.enhancedMetricFunctionCostMetric =
        this.enhancedMetricFactory.enhancedMetricFunctionCost();

      for (const disambiguator in props.addEnhancedMonitoringMaxCpuTotalTimeAlarm) {
        const alarmProps =
          props.addEnhancedMonitoringMaxCpuTotalTimeAlarm[disambiguator];
        const createdAlarm = this.latencyAlarmFactory.addDurationAlarm(
          /* eslint-disable @typescript-eslint/no-non-null-assertion */
          this.enhancedMonitoringMaxCpuTotalTimeMetric!,
          /* eslint-enable @typescript-eslint/no-non-null-assertion */
          LatencyType.P100,
          alarmProps,
          disambiguator
        );
        this.cpuTotalTimeAnnotations.push(createdAlarm.annotation);
        this.addAlarm(createdAlarm);
      }
      for (const disambiguator in props.addEnhancedMonitoringP90CpuTotalTimeAlarm) {
        const alarmProps =
          props.addEnhancedMonitoringP90CpuTotalTimeAlarm[disambiguator];
        const createdAlarm = this.latencyAlarmFactory.addDurationAlarm(
          /* eslint-disable @typescript-eslint/no-non-null-assertion */
          this.enhancedMonitoringP90CpuTotalTimeMetric!,
          /* eslint-enable @typescript-eslint/no-non-null-assertion */
          LatencyType.P90,
          alarmProps,
          disambiguator
        );
        this.cpuTotalTimeAnnotations.push(createdAlarm.annotation);
        this.addAlarm(createdAlarm);
      }
      for (const disambiguator in props.addEnhancedMonitoringAvgCpuTotalTimeAlarm) {
        const alarmProps =
          props.addEnhancedMonitoringAvgCpuTotalTimeAlarm[disambiguator];
        const createdAlarm = this.latencyAlarmFactory.addDurationAlarm(
          /* eslint-disable @typescript-eslint/no-non-null-assertion */
          this.enhancedMonitoringAvgCpuTotalTimeMetric!,
          /* eslint-enable @typescript-eslint/no-non-null-assertion */
          LatencyType.AVERAGE,
          alarmProps,
          disambiguator
        );
        this.cpuTotalTimeAnnotations.push(createdAlarm.annotation);
        this.addAlarm(createdAlarm);
      }
      for (const disambiguator in props.addEnhancedMonitoringMaxMemoryUtilizationAlarm) {
        const alarmProps =
          props.addEnhancedMonitoringMaxMemoryUtilizationAlarm[disambiguator];
        const createdAlarm =
          this.usageAlarmFactory.addMaxMemoryUsagePercentAlarm(
            /* eslint-disable @typescript-eslint/no-non-null-assertion */
            this.enhancedMonitoringMaxMemoryUtilizationMetric!,
            /* eslint-enable @typescript-eslint/no-non-null-assertion */
            alarmProps,
            disambiguator
          );
        this.memoryUsageAnnotations.push(createdAlarm.annotation);
        this.addAlarm(createdAlarm);
      }
      for (const disambiguator in props.addEnhancedMonitoringP90MemoryUtilizationAlarm) {
        const alarmProps =
          props.addEnhancedMonitoringP90MemoryUtilizationAlarm[disambiguator];
        const createdAlarm = this.usageAlarmFactory.addMemoryUsagePercentAlarm(
          /* eslint-disable @typescript-eslint/no-non-null-assertion */
          this.enhancedMonitoringP90MemoryUtilizationMetric!,
          /* eslint-enable @typescript-eslint/no-non-null-assertion */
          alarmProps,
          UsageType.P90,
          disambiguator
        );
        this.memoryUsageAnnotations.push(createdAlarm.annotation);
        this.addAlarm(createdAlarm);
      }
      for (const disambiguator in props.addEnhancedMonitoringAvgMemoryUtilizationAlarm) {
        const alarmProps =
          props.addEnhancedMonitoringAvgMemoryUtilizationAlarm[disambiguator];
        const createdAlarm = this.usageAlarmFactory.addMemoryUsagePercentAlarm(
          /* eslint-disable @typescript-eslint/no-non-null-assertion */
          this.enhancedMonitoringAvgMemoryUtilizationMetric!,
          /* eslint-enable @typescript-eslint/no-non-null-assertion */
          alarmProps,
          UsageType.AVERAGE,
          disambiguator
        );
        this.memoryUsageAnnotations.push(createdAlarm.annotation);
        this.addAlarm(createdAlarm);
      }
    }

    for (const disambiguator in props.addLatencyP50Alarm) {
      const alarmProps = props.addLatencyP50Alarm[disambiguator];
      const createdAlarm = this.latencyAlarmFactory.addLatencyAlarm(
        this.p50LatencyMetric,
        LatencyType.P50,
        alarmProps,
        disambiguator
      );
      this.latencyAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }
    for (const disambiguator in props.addLatencyP90Alarm) {
      const alarmProps = props.addLatencyP90Alarm[disambiguator];
      const createdAlarm = this.latencyAlarmFactory.addLatencyAlarm(
        this.p90LatencyMetric,
        LatencyType.P90,
        alarmProps,
        disambiguator
      );
      this.latencyAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }
    for (const disambiguator in props.addLatencyP99Alarm) {
      const alarmProps = props.addLatencyP99Alarm[disambiguator];
      const createdAlarm = this.latencyAlarmFactory.addLatencyAlarm(
        this.p99LatencyMetric,
        LatencyType.P99,
        alarmProps,
        disambiguator
      );
      this.latencyAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }
    for (const disambiguator in props.addFaultCountAlarm) {
      const alarmProps = props.addFaultCountAlarm[disambiguator];
      const createdAlarm = this.errorAlarmFactory.addErrorCountAlarm(
        this.faultCountMetric,
        ErrorType.FAULT,
        alarmProps,
        disambiguator
      );
      this.errorCountAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }
    for (const disambiguator in props.addFaultRateAlarm) {
      const alarmProps = props.addFaultRateAlarm[disambiguator];
      const createdAlarm = this.errorAlarmFactory.addErrorRateAlarm(
        this.faultRateMetric,
        ErrorType.FAULT,
        alarmProps,
        disambiguator
      );
      this.errorRateAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }
    for (const disambiguator in props.addLowTpsAlarm) {
      const alarmProps = props.addLowTpsAlarm[disambiguator];
      const createdAlarm = this.tpsAlarmFactory.addMinTpsAlarm(
        this.tpsMetric,
        alarmProps,
        disambiguator
      );
      this.tpsAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }
    for (const disambiguator in props.addHighTpsAlarm) {
      const alarmProps = props.addHighTpsAlarm[disambiguator];
      const createdAlarm = this.tpsAlarmFactory.addMaxTpsAlarm(
        this.tpsMetric,
        alarmProps,
        disambiguator
      );
      this.tpsAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }
    for (const disambiguator in props.addThrottlesCountAlarm) {
      const alarmProps = props.addThrottlesCountAlarm[disambiguator];
      const createdAlarm = this.errorAlarmFactory.addErrorCountAlarm(
        this.throttlesCountMetric,
        ErrorType.THROTTLED,
        alarmProps,
        disambiguator
      );
      this.invocationCountAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }
    for (const disambiguator in props.addThrottlesRateAlarm) {
      const alarmProps = props.addThrottlesRateAlarm[disambiguator];
      const createdAlarm = this.errorAlarmFactory.addErrorRateAlarm(
        this.throttlesRateMetric,
        ErrorType.THROTTLED,
        alarmProps,
        disambiguator
      );
      this.invocationRateAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }
    for (const disambiguator in props.addConcurrentExecutionsCountAlarm) {
      const alarmProps = props.addConcurrentExecutionsCountAlarm[disambiguator];
      const createdAlarm = this.taskHealthAlarmFactory.addRunningTaskCountAlarm(
        this.concurrentExecutionsCountMetric,
        alarmProps,
        disambiguator
      );
      this.invocationCountAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }
    for (const disambiguator in props.addProvisionedConcurrencySpilloverInvocationsCountAlarm) {
      const alarmProps =
        props.addProvisionedConcurrencySpilloverInvocationsCountAlarm[
          disambiguator
        ];
      const createdAlarm = this.taskHealthAlarmFactory.addRunningTaskCountAlarm(
        this.provisionedConcurrencySpilloverInvocationsCountMetric,
        alarmProps,
        disambiguator
      );
      this.invocationCountAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }
    for (const disambiguator in props.addProvisionedConcurrencySpilloverInvocationsRateAlarm) {
      const alarmProps =
        props.addProvisionedConcurrencySpilloverInvocationsRateAlarm[
          disambiguator
        ];
      const createdAlarm = this.taskHealthAlarmFactory.addRunningTaskRateAlarm(
        this.provisionedConcurrencySpilloverInvocationsRateMetric,
        alarmProps,
        disambiguator
      );
      this.invocationRateAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }
    for (const disambiguator in props.addMaxIteratorAgeAlarm) {
      const alarmProps = props.addMaxIteratorAgeAlarm[disambiguator];
      const createdAlarm = this.ageAlarmFactory.addIteratorMaxAgeAlarm(
        this.maxIteratorAgeMetric,
        alarmProps,
        disambiguator
      );
      this.maxIteratorAgeAnnotations.push(createdAlarm.annotation);
      this.addAlarm(createdAlarm);
    }

    props.useCreatedAlarms?.consume(this.createdAlarms());
  }

  summaryWidgets(): IWidget[] {
    return [
      this.createTitleWidget(),
      this.createTpsWidget(ThirdWidth, DefaultSummaryWidgetHeight),
      this.createLatencyWidget(ThirdWidth, DefaultSummaryWidgetHeight),
      this.createErrorRateWidget(ThirdWidth, DefaultSummaryWidgetHeight),
    ];
  }

  widgets(): IWidget[] {
    const widgets = [
      this.createTitleWidget(),
      new Row(
        this.createTpsWidget(QuarterWidth, DefaultGraphWidgetHeight),
        this.createLatencyWidget(QuarterWidth, DefaultGraphWidgetHeight),
        this.createErrorRateWidget(QuarterWidth, DefaultGraphWidgetHeight),
        this.createRateWidget(QuarterWidth, DefaultGraphWidgetHeight)
      ),
      new Row(
        this.createInvocationWidget(ThirdWidth, DefaultGraphWidgetHeight),
        this.createIteratorAgeWidget(ThirdWidth, DefaultGraphWidgetHeight),
        this.createErrorCountWidget(ThirdWidth, DefaultGraphWidgetHeight)
      ),
    ];

    if (this.lambdaInsightsEnabled) {
      widgets.push(
        new Row(
          this.createLambdaInsightsCpuWidget(
            ThirdWidth,
            DefaultGraphWidgetHeight
          ),
          this.createLambdaInsightsMemoryWidget(
            ThirdWidth,
            DefaultGraphWidgetHeight
          ),
          this.createLambdaInsightsFunctionCostWidget(
            ThirdWidth,
            DefaultGraphWidgetHeight
          )
        )
      );
    }

    return widgets;
  }

  protected createTitleWidget() {
    return new MonitoringHeaderWidget({
      family: "Lambda Function",
      title: this.title,
      goToLinkUrl: this.functionUrl,
    });
  }

  protected createTpsWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "TPS",
      left: [this.tpsMetric],
      leftYAxis: RateAxisFromZero,
      leftAnnotations: this.tpsAnnotations,
    });
  }

  protected createLatencyWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Latency",
      left: [
        this.p50LatencyMetric,
        this.p90LatencyMetric,
        this.p99LatencyMetric,
      ],
      leftYAxis: TimeAxisMillisFromZero,
      leftAnnotations: this.latencyAnnotations,
    });
  }

  protected createErrorCountWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Errors",
      left: [this.faultCountMetric],
      leftYAxis: CountAxisFromZero,
      leftAnnotations: this.errorCountAnnotations,
    });
  }

  protected createErrorRateWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Errors (rate)",
      left: [this.faultRateMetric],
      leftYAxis: RateAxisFromZero,
      leftAnnotations: this.errorRateAnnotations,
    });
  }

  protected createRateWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Rates",
      left: [
        this.throttlesRateMetric,
        this.provisionedConcurrencySpilloverInvocationsRateMetric,
      ],
      leftYAxis: RateAxisFromZero,
      leftAnnotations: this.invocationRateAnnotations,
    });
  }

  protected createInvocationWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Invocations",
      left: [
        this.invocationCountMetric,
        this.throttlesCountMetric,
        this.concurrentExecutionsCountMetric,
        this.provisionedConcurrencySpilloverInvocationsCountMetric,
      ],
      leftYAxis: CountAxisFromZero,
      leftAnnotations: this.invocationCountAnnotations,
    });
  }

  protected createIteratorAgeWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Iterator",
      left: [this.maxIteratorAgeMetric],
      leftYAxis: TimeAxisMillisFromZero,
      leftAnnotations: this.maxIteratorAgeAnnotations,
    });
  }

  protected createLambdaInsightsCpuWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "CPU Total Time",
      left: [
        /* eslint-disable @typescript-eslint/no-non-null-assertion */
        this.enhancedMonitoringMaxCpuTotalTimeMetric!,
        this.enhancedMonitoringP90CpuTotalTimeMetric!,
        this.enhancedMonitoringAvgCpuTotalTimeMetric!,
        /* eslint-enable @typescript-eslint/no-non-null-assertion */
      ],
      leftYAxis: TimeAxisMillisFromZero,
    });
  }

  protected createLambdaInsightsMemoryWidget(width: number, height: number) {
    return new GraphWidget({
      width,
      height,
      title: "Memory Utilization",
      left: [
        /* eslint-disable @typescript-eslint/no-non-null-assertion */
        this.enhancedMonitoringMaxMemoryUtilizationMetric!,
        this.enhancedMonitoringP90MemoryUtilizationMetric!,
        this.enhancedMonitoringAvgMemoryUtilizationMetric!,
        /* eslint-enable @typescript-eslint/no-non-null-assertion */
      ],
      leftYAxis: PercentageAxisFromZeroToHundred,
    });
  }

  protected createLambdaInsightsFunctionCostWidget(
    width: number,
    height: number
  ) {
    return new GraphWidget({
      width,
      height,
      title: "Function Cost",
      /* eslint-disable @typescript-eslint/no-non-null-assertion */
      left: [this.enhancedMetricFunctionCostMetric!],
      /* eslint-enable @typescript-eslint/no-non-null-assertion */
      leftYAxis: MegabyteMillisecondAxisFromZero,
    });
  }

  private resolveFunctionName(lambdaFunction: IFunction): string | undefined {
    // try to take the name (if specified) instead of token
    return (lambdaFunction.node.defaultChild as CfnFunction)?.functionName;
  }
}
