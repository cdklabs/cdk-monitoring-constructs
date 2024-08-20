import { IFunction } from "aws-cdk-lib/aws-lambda";

import {
  BaseMetricFactory,
  BaseMetricFactoryProps,
  MetricFactory,
  MetricStatistic,
} from "../../common";

const LambdaInsightsNamespace = "LambdaInsights";

export interface LambdaFunctionEnhancedMetricFactoryProps
  extends BaseMetricFactoryProps {
  readonly lambdaFunction: IFunction;
}

export class LambdaFunctionEnhancedMetricFactory extends BaseMetricFactory<LambdaFunctionEnhancedMetricFactoryProps> {
  protected readonly lambdaFunction: IFunction;

  constructor(
    metricFactory: MetricFactory,
    props: LambdaFunctionEnhancedMetricFactoryProps,
  ) {
    super(metricFactory, props);

    this.lambdaFunction = props.lambdaFunction;
  }

  enhancedMetricMaxCpuTotalTime() {
    return this.enhancedMetric(
      "cpu_total_time",
      MetricStatistic.MAX,
      "CPUTotalTime.Max",
    );
  }

  enhancedMetricP90CpuTotalTime() {
    return this.enhancedMetric(
      "cpu_total_time",
      MetricStatistic.P90,
      "CPUTotalTime.P90",
    );
  }

  enhancedMetricAvgCpuTotalTime() {
    return this.enhancedMetric(
      "cpu_total_time",
      MetricStatistic.AVERAGE,
      "CPUTotalTime.Avg",
    );
  }

  enhancedMetricMaxMemoryUtilization() {
    return this.enhancedMetric(
      "memory_utilization",
      MetricStatistic.MAX,
      "MemoryUtilization.Max",
    );
  }

  enhancedMetricP90MemoryUtilization() {
    return this.enhancedMetric(
      "memory_utilization",
      MetricStatistic.P90,
      "MemoryUtilization.P90",
    );
  }

  enhancedMetricAvgMemoryUtilization() {
    return this.enhancedMetric(
      "memory_utilization",
      MetricStatistic.AVERAGE,
      "MemoryUtilization.Avg",
    );
  }

  enhancedMetricFunctionCost() {
    return this.metricFactory.createMetricMath(
      "memory_utilization * duration",
      {
        memory_utilization: this.enhancedMetricMaxMemoryUtilization(),
        duration: this.enhancedMetricFunctionDuration(),
      },
      "Function Cost (avg: ${AVG}, max: ${MAX})",
    );
  }

  private enhancedMetricFunctionDuration() {
    return this.metricFactory.adaptMetric(
      this.lambdaFunction.metricDuration({
        statistic: MetricStatistic.SUM,
        region: this.region,
        account: this.account,
      }),
    );
  }

  private enhancedMetric(
    metricName: string,
    statistic: MetricStatistic,
    label: string,
  ) {
    const [functionName, functionVersion] =
      this.lambdaFunction.functionName.split(":");
    return this.metricFactory.metric({
      metricName,
      statistic,
      label,
      dimensionsMap: {
        function_name: functionName,
        version: functionVersion,
      },
      namespace: LambdaInsightsNamespace,
      region: this.region,
      account: this.account,
    });
  }
}
