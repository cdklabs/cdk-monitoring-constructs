/**
 * Metric aggregation statistic to be used with the IMetric objects.
 *
 * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Statistics-definitions.html
 */
export enum MetricStatistic {
    /**
     * 50th percentile of all datapoints
     */
    P50 = "p50",
    /**
     * 70th percentile of all datapoints
     */
    P70 = "p70",
    /**
     * 90th percentile of all datapoints
     */
    P90 = "p90",
    /**
     * 95th percentile of all datapoints
     */
    P95 = "p95",
    /**
     * 99th percentile of all datapoints
     */
    P99 = "p99",
    /**
     * 99.9th percentile of all datapoints
     */
    P999 = "p99.9",
    /**
     * 99.99th percentile of all datapoints
     */
    P9999 = "p99.99",
    /**
     * 100th percentile of all datapoints
     */
    P100 = "p100",

    /**
     * trimmed mean; calculates the average after removing the 50% of data points with the highest values
     */
    TM50 = "tm50",
    /**
     * trimmed mean; calculates the average after removing the 30% of data points with the highest values
     */
    TM70 = "tm70",
    /**
     * trimmed mean; calculates the average after removing the 10% of data points with the highest values
     */
    TM90 = "tm90",
    /**
     * trimmed mean; calculates the average after removing the 5% of data points with the highest values
     */
    TM95 = "tm95",
    /**
     * trimmed mean; calculates the average after removing the 1% of data points with the highest values
     */
    TM99 = "tm99",
    /**
     * trimmed mean; calculates the average after removing the 0.1% of data points with the highest values
     */
    TM999 = "tm99.9",
    /**
     * trimmed mean; calculates the average after removing the 0.01% of data points with the highest values
     */
    TM9999 = "tm99.99",
    /**
     * trimmed mean; calculates the average after removing the 1% lowest data points and the 1% highest data points
     */
    TM99_BOTH = "TM(1%:99%)",
    /**
     * trimmed mean; calculates the average after removing the 5% lowest data points and the 5% highest data points
     */
    TM95_BOTH = "TM(5%:95%)",
    /**
     * trimmed mean; calculates the average after removing the 10% lowest data points and the 10% highest data points
     */
    TM90_BOTH = "TM(10%:90%)",
    /**
     * trimmed mean; calculates the average after removing the 15% lowest data points and the 15% highest data points
     */
    TM85_BOTH = "TM(15%:85%)",
    /**
     * trimmed mean; calculates the average after removing the 20% lowest data points and the 20% highest data points
     */
    TM80_BOTH = "TM(20%:80%)",
    /**
     * trimmed mean; calculates the average after removing the 25% lowest data points and the 25% highest data points
     */
    TM75_BOTH = "TM(25%:75%)",
    /**
     * trimmed mean; calculates the average after removing the 30% lowest data points and the 30% highest data points
     */
    TM70_BOTH = "TM(30%:70%)",

    /**
     * winsorized mean; calculates the average while treating the 50% of the highest values to be equal to the value at the 50th percentile
     */
    WM50 = "wm50",
    /**
     * winsorized mean; calculates the average while treating the 30% of the highest values to be equal to the value at the 70th percentile
     */
    WM70 = "wm70",
    /**
     * winsorized mean; calculates the average while treating the 10% of the highest values to be equal to the value at the 90th percentile
     */
    WM90 = "wm90",
    /**
     * winsorized mean; calculates the average while treating the 5% of the highest values to be equal to the value at the 95th percentile
     */
    WM95 = "wm95",
    /**
     * winsorized mean; calculates the average while treating the 1% of the highest values to be equal to the value at the 99th percentile
     */
    WM99 = "wm99",
    /**
     * winsorized mean; calculates the average while treating the 0.1% of the highest values to be equal to the value at the 99.9th percentile
     */
    WM999 = "wm99.9",
    /**
     * winsorized mean; calculates the average while treating the 0.01% of the highest values to be equal to the value at the 99.99th percentile
     */
    WM9999 = "wm99.99",
    /**
     * winsorized mean; calculates the average while treating the highest 1% of data points to be the value of the 99% boundary, and treating the lowest 1% of data points to be the value of the 1% boundary
     */
    WM99_BOTH = "WM(1%:99%)",
    /**
     * winsorized mean; calculates the average while treating the highest 5% of data points to be the value of the 95% boundary, and treating the lowest 5% of data points to be the value of the 5% boundary
     */
    WM95_BOTH = "WM(5%:95%)",
    /**
     * winsorized mean; calculates the average while treating the highest 10% of data points to be the value of the 90% boundary, and treating the lowest 10% of data points to be the value of the 10% boundary
     */
    WM90_BOTH = "WM(10%:90%)",
    /**
     * winsorized mean; calculates the average while treating the highest 15% of data points to be the value of the 85% boundary, and treating the lowest 15% of data points to be the value of the 15% boundary
     */
    WM85_BOTH = "WM(15%:85%)",
    /**
     * winsorized mean; calculates the average while treating the highest 20% of data points to be the value of the 80% boundary, and treating the lowest 20% of data points to be the value of the 20% boundary
     */
    WM80_BOTH = "WM(20%:80%)",
    /**
     * winsorized mean; calculates the average while treating the highest 25% of data points to be the value of the 75% boundary, and treating the lowest 25% of data points to be the value of the 25% boundary
     */
    WM75_BOTH = "WM(25%:75%)",
    /**
     * winsorized mean; calculates the average while treating the highest 30% of data points to be the value of the 70% boundary, and treating the lowest 30% of data points to be the value of the 30% boundary
     */
    WM70_BOTH = "WM(30%:70%)",

    /**
     * minimum of all datapoints
     */
    MIN = "Minimum",
    /**
     * maximum of all datapoints
     */
    MAX = "Maximum",
    /**
     * sum of all datapoints
     */
    SUM = "Sum",
    /**
     * average of all datapoints
     */
    AVERAGE = "Average",
    /**
     * number of datapoints
     */
    N = "SampleCount",
}
