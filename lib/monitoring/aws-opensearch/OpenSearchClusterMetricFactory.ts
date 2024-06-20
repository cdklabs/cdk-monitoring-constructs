import { Stats } from "aws-cdk-lib/aws-cloudwatch";

import {
  Domain,
  OpenSearchBackportedMetrics,
} from "./OpenSearchBackportedMetrics";
import {
  BaseMetricFactory,
  BaseMetricFactoryProps,
  MetricFactory,
  MetricStatistic,
  RateComputationMethod,
} from "../../common";

export interface OpenSearchClusterMetricFactoryProps
  extends BaseMetricFactoryProps {
  readonly domain: Domain;
  /**
   * @default - true
   */
  readonly fillTpsWithZeroes?: boolean;
  /**
   * @default - average
   */
  readonly rateComputationMethod?: RateComputationMethod;
}

export class OpenSearchClusterMetricFactory extends BaseMetricFactory<OpenSearchClusterMetricFactoryProps> {
  protected readonly domainMetrics: OpenSearchBackportedMetrics;
  protected readonly fillTpsWithZeroes: boolean;
  protected readonly rateComputationMethod: RateComputationMethod;

  constructor(
    metricFactory: MetricFactory,
    props: OpenSearchClusterMetricFactoryProps,
  ) {
    super(metricFactory, props);

    this.domainMetrics = new OpenSearchBackportedMetrics(props.domain);
    this.fillTpsWithZeroes = props.fillTpsWithZeroes ?? true;
    this.rateComputationMethod =
      props.rateComputationMethod ?? RateComputationMethod.AVERAGE;
  }

  metricSearchCount() {
    return this.domainMetrics.metric("SearchRate", {
      statistic: Stats.SUM,
      region: this.region,
      account: this.account,
    });
  }

  metricSearchRate() {
    return this.metricFactory.toRate(
      this.metricSearchCount(),
      this.rateComputationMethod,
      false,
      "requests",
      this.fillTpsWithZeroes,
    );
  }

  /**
   * @deprecated use metricSearchRate
   */
  metricTps() {
    return this.metricFactory.toRate(
      this.metricSearchCount(),
      RateComputationMethod.PER_SECOND,
      false,
      "requests",
      this.fillTpsWithZeroes,
    );
  }

  metricIndexingLatencyP50InMillis() {
    return this.metricFactory.adaptMetric(
      this.domainMetrics.metricIndexingLatency({
        statistic: MetricStatistic.P50,
        label: "P50",
        region: this.region,
        account: this.account,
      }),
    );
  }

  metricIndexingLatencyP90InMillis() {
    return this.metricFactory.adaptMetric(
      this.domainMetrics.metricIndexingLatency({
        statistic: MetricStatistic.P90,
        label: "P90",
        region: this.region,
        account: this.account,
      }),
    );
  }

  metricIndexingLatencyP99InMillis() {
    return this.metricFactory.adaptMetric(
      this.domainMetrics.metricIndexingLatency({
        statistic: MetricStatistic.P99,
        label: "P99",
        region: this.region,
        account: this.account,
      }),
    );
  }

  metricSearchLatencyP50InMillis() {
    return this.metricFactory.adaptMetric(
      this.domainMetrics.metricSearchLatency({
        statistic: MetricStatistic.P50,
        label: "P50",
        region: this.region,
        account: this.account,
      }),
    );
  }

  metricSearchLatencyP90InMillis() {
    return this.metricFactory.adaptMetric(
      this.domainMetrics.metricSearchLatency({
        statistic: MetricStatistic.P90,
        label: "P90",
        region: this.region,
        account: this.account,
      }),
    );
  }

  metricSearchLatencyP99InMillis() {
    return this.metricFactory.adaptMetric(
      this.domainMetrics.metricSearchLatency({
        statistic: MetricStatistic.P99,
        label: "P99",
        region: this.region,
        account: this.account,
      }),
    );
  }

  metricClusterStatusRed() {
    return this.metricFactory.adaptMetric(
      this.domainMetrics.metricClusterStatusRed({
        label: "Red",
        region: this.region,
        account: this.account,
      }),
    );
  }

  metricClusterStatusYellow() {
    return this.metricFactory.adaptMetric(
      this.domainMetrics.metricClusterStatusYellow({
        label: "Yellow",
        region: this.region,
        account: this.account,
      }),
    );
  }

  metricDiskSpaceUsageInPercent() {
    const used = this.domainMetrics.metric("ClusterUsedSpace", {
      statistic: Stats.SUM,
      region: this.region,
      account: this.account,
    });
    const free = this.domainMetrics.metric("FreeStorageSpace", {
      statistic: Stats.SUM,
      region: this.region,
      account: this.account,
    });
    return this.metricFactory.createMetricMath(
      "100 * (used/(used+free))",
      { used, free },
      "Disk Usage",
    );
  }

  metricCpuUsage() {
    return this.metricFactory.adaptMetric(
      this.domainMetrics.metricCPUUtilization({
        label: "CPU Usage",
        region: this.region,
        account: this.account,
      }),
    );
  }

  metricMasterCpuUsage() {
    return this.metricFactory.adaptMetric(
      this.domainMetrics.metricMasterCPUUtilization({
        label: "Master CPU Usage",
        region: this.region,
        account: this.account,
      }),
    );
  }

  metricJvmMemoryPressure() {
    return this.metricFactory.adaptMetric(
      this.domainMetrics.metricJVMMemoryPressure({
        label: "JVM Memory Pressure",
        region: this.region,
        account: this.account,
      }),
    );
  }

  metricMasterJvmMemoryPressure() {
    return this.metricFactory.adaptMetric(
      this.domainMetrics.metricMasterJVMMemoryPressure({
        label: "Master JVM Memory Pressure",
        region: this.region,
        account: this.account,
      }),
    );
  }

  metricClusterIndexWritesBlocked() {
    return this.metricFactory.adaptMetric(
      this.domainMetrics.metricClusterIndexWritesBlocked({
        label: "Index Writes Blocked",
        region: this.region,
        account: this.account,
      }),
    );
  }

  /**
   * @deprecated use metricClusterIndexWritesBlocked instead
   */
  metricClusterIndexWriteBlocked() {
    return this.metricClusterIndexWritesBlocked();
  }

  metricNodes() {
    return this.metricFactory.adaptMetric(
      this.domainMetrics.metricNodes({
        label: "Nodes",
        region: this.region,
        account: this.account,
      }),
    );
  }

  metricAutomatedSnapshotFailure() {
    return this.metricFactory.adaptMetric(
      this.domainMetrics.metricAutomatedSnapshotFailure({
        label: "Automated Snapshot Failures",
        region: this.region,
        account: this.account,
      }),
    );
  }

  metricKmsKeyError() {
    return this.metricFactory.adaptMetric(
      this.domainMetrics.metricKMSKeyError({
        label: "KMS Key Error",
        region: this.region,
        account: this.account,
      }),
    );
  }

  metricKmsKeyInaccessible() {
    return this.metricFactory.adaptMetric(
      this.domainMetrics.metricKMSKeyInaccessible({
        label: "KMS Key Inaccessible",
        region: this.region,
        account: this.account,
      }),
    );
  }
}
