import { Stats } from "aws-cdk-lib/aws-cloudwatch";

import {
  Domain,
  OpenSearchBackportedMetrics,
} from "./OpenSearchBackportedMetrics";
import {
  MetricFactory,
  MetricStatistic,
  RateComputationMethod,
} from "../../common";

export interface OpenSearchClusterMetricFactoryProps {
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

export class OpenSearchClusterMetricFactory {
  protected readonly metricFactory: MetricFactory;
  protected readonly domainMetrics: OpenSearchBackportedMetrics;
  protected readonly fillTpsWithZeroes: boolean;
  protected readonly rateComputationMethod: RateComputationMethod;

  constructor(
    metricFactory: MetricFactory,
    props: OpenSearchClusterMetricFactoryProps
  ) {
    this.metricFactory = metricFactory;
    this.domainMetrics = new OpenSearchBackportedMetrics(props.domain);
    this.fillTpsWithZeroes = props.fillTpsWithZeroes ?? true;
    this.rateComputationMethod =
      props.rateComputationMethod ?? RateComputationMethod.AVERAGE;
  }

  metricSearchCount() {
    return this.domainMetrics.metric("SearchRate", {
      statistic: Stats.SUM,
    });
  }

  metricSearchRate() {
    return this.metricFactory.toRate(
      this.metricSearchCount(),
      this.rateComputationMethod,
      false,
      "requests",
      this.fillTpsWithZeroes
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
      this.fillTpsWithZeroes
    );
  }

  metricIndexingLatencyP50InMillis() {
    return this.metricFactory.adaptMetric(
      this.domainMetrics.metricIndexingLatency({
        statistic: MetricStatistic.P50,
        label: "P50",
      })
    );
  }

  metricIndexingLatencyP90InMillis() {
    return this.metricFactory.adaptMetric(
      this.domainMetrics.metricIndexingLatency({
        statistic: MetricStatistic.P90,
        label: "P90",
      })
    );
  }

  metricIndexingLatencyP99InMillis() {
    return this.metricFactory.adaptMetric(
      this.domainMetrics.metricIndexingLatency({
        statistic: MetricStatistic.P99,
        label: "P99",
      })
    );
  }

  metricSearchLatencyP50InMillis() {
    return this.metricFactory.adaptMetric(
      this.domainMetrics.metricSearchLatency({
        statistic: MetricStatistic.P50,
        label: "P50",
      })
    );
  }

  metricSearchLatencyP90InMillis() {
    return this.metricFactory.adaptMetric(
      this.domainMetrics.metricSearchLatency({
        statistic: MetricStatistic.P90,
        label: "P90",
      })
    );
  }

  metricSearchLatencyP99InMillis() {
    return this.metricFactory.adaptMetric(
      this.domainMetrics.metricSearchLatency({
        statistic: MetricStatistic.P99,
        label: "P99",
      })
    );
  }

  metricClusterStatusRed() {
    return this.metricFactory.adaptMetric(
      this.domainMetrics.metricClusterStatusRed({
        label: "Red",
      })
    );
  }

  metricClusterStatusYellow() {
    return this.metricFactory.adaptMetric(
      this.domainMetrics.metricClusterStatusYellow({
        label: "Yellow",
      })
    );
  }

  metricDiskSpaceUsageInPercent() {
    const used = this.domainMetrics.metric("ClusterUsedSpace", {
      statistic: Stats.SUM,
    });
    const free = this.domainMetrics.metric("FreeStorageSpace", {
      statistic: Stats.SUM,
    });
    return this.metricFactory.createMetricMath(
      "100 * (used/(used+free))",
      { used, free },
      "Disk Usage"
    );
  }

  metricCpuUsage() {
    return this.metricFactory.adaptMetric(
      this.domainMetrics.metricCPUUtilization({
        label: "CPU Usage",
      })
    );
  }

  metricMasterCpuUsage() {
    return this.metricFactory.adaptMetric(
      this.domainMetrics.metricMasterCPUUtilization({
        label: "Master CPU Usage",
      })
    );
  }

  metricJvmMemoryPressure() {
    return this.metricFactory.adaptMetric(
      this.domainMetrics.metricJVMMemoryPressure({
        label: "JVM Memory Pressure",
      })
    );
  }

  metricMasterJvmMemoryPressure() {
    return this.metricFactory.adaptMetric(
      this.domainMetrics.metricMasterJVMMemoryPressure({
        label: "Master JVM Memory Pressure",
      })
    );
  }

  metricClusterIndexWritesBlocked() {
    return this.metricFactory.adaptMetric(
      this.domainMetrics.metricClusterIndexWritesBlocked({
        label: "Index Writes Blocked",
      })
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
      })
    );
  }

  metricAutomatedSnapshotFailure() {
    return this.metricFactory.adaptMetric(
      this.domainMetrics.metricAutomatedSnapshotFailure({
        label: "Automated Snapshot Failures",
      })
    );
  }

  metricKmsKeyError() {
    return this.metricFactory.adaptMetric(
      this.domainMetrics.metricKMSKeyError({
        label: "KMS Key Error",
      })
    );
  }

  metricKmsKeyInaccessible() {
    return this.metricFactory.adaptMetric(
      this.domainMetrics.metricKMSKeyInaccessible({
        label: "KMS Key Inaccessible",
      })
    );
  }
}
