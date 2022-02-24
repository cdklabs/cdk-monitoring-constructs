import { Statistic } from "monocdk/aws-cloudwatch";

import {
  MetricFactory,
  MetricStatistic,
  RateComputationMethod,
} from "../../common";
import {
  Domain,
  OpenSearchBackportedMetrics,
} from "./OpenSearchBackportedMetrics";

export interface OpenSearchClusterMetricFactoryProps {
  readonly domain: Domain;
  /**
   * @default true
   */
  readonly fillTpsWithZeroes?: boolean;
}

export class OpenSearchClusterMetricFactory {
  protected readonly metricFactory: MetricFactory;
  protected readonly domainMetrics: OpenSearchBackportedMetrics;
  protected readonly fillTpsWithZeroes: boolean;

  constructor(
    metricFactory: MetricFactory,
    props: OpenSearchClusterMetricFactoryProps
  ) {
    this.metricFactory = metricFactory;
    this.domainMetrics = new OpenSearchBackportedMetrics(props.domain);
    this.fillTpsWithZeroes = props.fillTpsWithZeroes ?? true;
  }

  metricTps() {
    // TODO: rename to metricInvocationRate and use rateComputationMethod
    const requests = this.domainMetrics.metric("SearchRate", {
      statistic: Statistic.SUM,
    });
    return this.metricFactory.toRate(
      requests,
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
      statistic: Statistic.SUM,
    });
    const free = this.domainMetrics.metric("FreeStorageSpace", {
      statistic: Statistic.SUM,
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

  metricClusterIndexWriteBlocked() {
    return this.metricFactory.adaptMetric(
      this.domainMetrics.metricClusterIndexWriteBlocked({
        label: "Index Writes Blocked",
      })
    );
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
