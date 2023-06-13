import {Duration} from "aws-cdk-lib";
import {DimensionsMap, Metric, MetricOptions, Statistic} from "aws-cdk-lib/aws-cloudwatch";
import * as elasticsearch from "aws-cdk-lib/aws-elasticsearch";
import * as opensearch from "aws-cdk-lib/aws-opensearchservice";

const ElasticsearchNamespace = "AWS/ES";

export type Domain = opensearch.CfnDomain | opensearch.IDomain | elasticsearch.CfnDomain | elasticsearch.IDomain;

/**
 * Backported set of metric functions added in @aws-cdk/aws-elasticsearch@1.65.0.
 * @see https://github.com/aws/aws-cdk/pull/8369
 *
 * TODO: can be removed after upgrade to 1.73.0, which includes bugfixes for the
 * latency p99 metrics.
 * @see https://github.com/aws/aws-cdk/releases/tag/v1.73.0
 */
export class OpenSearchBackportedMetrics {
    protected readonly dimensionsMap: DimensionsMap;

    constructor(domain: Domain) {
        this.dimensionsMap = {
            ClientId: domain.stack.account,
            DomainName: domain.domainName!,
        };
    }

    /**
     * Return the given named metric for this Domain.
     */
    metric(metricName: string, props?: MetricOptions): Metric {
        return new Metric({
            namespace: ElasticsearchNamespace,
            metricName,
            dimensionsMap: this.dimensionsMap,
            ...props,
        });
    }

    /**
     * Metric for the time the cluster status is red.
     *
     * @default - maximum over 5 minutes
     */
    metricClusterStatusRed(props?: MetricOptions): Metric {
        return this.metric("ClusterStatus.red", {
            statistic: Statistic.MAXIMUM,
            ...props,
        });
    }

    /**
     * Metric for the time the cluster status is yellow.
     *
     * @default - maximum over 5 minutes
     */
    metricClusterStatusYellow(props?: MetricOptions): Metric {
        return this.metric("ClusterStatus.yellow", {
            statistic: Statistic.MAXIMUM,
            ...props,
        });
    }

    /**
     * Metric for the storage space of nodes in the cluster.
     *
     * @default - minimum over 5 minutes
     */
    metricFreeStorageSpace(props?: MetricOptions): Metric {
        return this.metric("FreeStorageSpace", {
            statistic: Statistic.MINIMUM,
            ...props,
        });
    }

    /**
     * Metric for the cluster blocking index writes.
     *
     * @default - maximum over 1 minute
     */
    metricClusterIndexWritesBlocked(props?: MetricOptions): Metric {
        return this.metric("ClusterIndexWritesBlocked", {
            statistic: Statistic.MAXIMUM,
            period: Duration.minutes(1),
            ...props,
        });
    }

    /**
     * Metric for the cluster blocking index writes.
     *
     * @default - maximum over 1 minute
     *
     * @deprecated use metricClusterIndexWritesBlocked instead.
     */
    metricClusterIndexWriteBlocked(props?: MetricOptions): Metric {
        return this.metricClusterIndexWritesBlocked(props);
    }

    /**
     * Metric for the number of nodes.
     *
     * @default - minimum over 1 hour
     */
    metricNodes(props?: MetricOptions): Metric {
        return this.metric("Nodes", {
            statistic: Statistic.MINIMUM,
            period: Duration.hours(1),
            ...props,
        });
    }

    /**
     * Metric for automated snapshot failures.
     *
     * @default - maximum over 5 minutes
     */
    metricAutomatedSnapshotFailure(props?: MetricOptions): Metric {
        return this.metric("AutomatedSnapshotFailure", {
            statistic: Statistic.MAXIMUM,
            ...props,
        });
    }

    /**
     * Metric for CPU utilization.
     *
     * @default - maximum over 5 minutes
     */
    metricCPUUtilization(props?: MetricOptions): Metric {
        return this.metric("CPUUtilization", {
            statistic: Statistic.MAXIMUM,
            ...props,
        });
    }

    /**
     * Metric for JVM memory pressure.
     *
     * @default - maximum over 5 minutes
     */
    metricJVMMemoryPressure(props?: MetricOptions): Metric {
        return this.metric("JVMMemoryPressure", {
            statistic: Statistic.MAXIMUM,
            ...props,
        });
    }

    /**
     * Metric for master CPU utilization.
     *
     * @default - maximum over 5 minutes
     */
    metricMasterCPUUtilization(props?: MetricOptions): Metric {
        return this.metric("MasterCPUUtilization", {
            statistic: Statistic.MAXIMUM,
            ...props,
        });
    }

    /**
     * Metric for master JVM memory pressure.
     *
     * @default - maximum over 5 minutes
     */
    metricMasterJVMMemoryPressure(props?: MetricOptions): Metric {
        return this.metric("MasterJVMMemoryPressure", {
            statistic: Statistic.MAXIMUM,
            ...props,
        });
    }

    /**
     * Metric for KMS key errors.
     *
     * @default - maximum over 5 minutes
     */
    metricKMSKeyError(props?: MetricOptions): Metric {
        return this.metric("KMSKeyError", {
            statistic: Statistic.MAXIMUM,
            ...props,
        });
    }

    /**
     * Metric for KMS key being inaccessible.
     *
     * @default - maximum over 5 minutes
     */
    metricKMSKeyInaccessible(props?: MetricOptions): Metric {
        return this.metric("KMSKeyInaccessible", {
            statistic: Statistic.MAXIMUM,
            ...props,
        });
    }

    /**
     * Metric for number of searchable documents.
     *
     * @default - maximum over 5 minutes
     */
    metricSearchableDocuments(props?: MetricOptions): Metric {
        return this.metric("SearchableDocuments", {
            statistic: Statistic.MAXIMUM,
            ...props,
        });
    }

    /**
     * Metric for search latency.
     *
     * @default - p99 over 5 minutes
     */
    metricSearchLatency(props?: MetricOptions): Metric {
        return this.metric("SearchLatency", {statistic: "p99", ...props});
    }

    /**
     * Metric for indexing latency.
     *
     * @default - p99 over 5 minutes
     */
    metricIndexingLatency(props?: MetricOptions): Metric {
        return this.metric("IndexingLatency", {statistic: "p99", ...props});
    }
}
