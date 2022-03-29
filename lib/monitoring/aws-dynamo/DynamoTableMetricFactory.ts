import { IMetric } from "monocdk/aws-cloudwatch";
import { ITable, Operation } from "monocdk/aws-dynamodb";

import { MetricFactory, MetricStatistic } from "../../common";

const DynamoDbNamespace = "AWS/DynamoDB";
const ProvisionedReadCapacityUnitsMetric = "ProvisionedReadCapacityUnits";
const ProvisionedWriteCapacityUnitsMetric = "ProvisionedWriteCapacityUnits";
const ProvisionedLabel = "Provisioned";
const ConsumedLabel = "Consumed";
const ReadThrottleEventsLabel = "Read";
const WriteThrottleEventsLabel = "Write";
const SystemErrorsLabel = "System Errors";

export interface DynamoTableMetricFactoryProps {
  readonly table: ITable;
}

export class DynamoTableMetricFactory {
  protected readonly metricFactory: MetricFactory;
  protected readonly table: ITable;

  constructor(
    metricFactory: MetricFactory,
    props: DynamoTableMetricFactoryProps
  ) {
    this.metricFactory = metricFactory;
    this.table = props.table;
  }

  metricProvisionedReadCapacityUnits() {
    return this.metricFactory.adaptMetric(
      this.table.metric(ProvisionedReadCapacityUnitsMetric, {
        label: ProvisionedLabel,
        statistic: MetricStatistic.AVERAGE,
      })
    );
  }

  metricProvisionedWriteCapacityUnits() {
    return this.metricFactory.adaptMetric(
      this.table.metric(ProvisionedWriteCapacityUnitsMetric, {
        label: ProvisionedLabel,
        statistic: MetricStatistic.AVERAGE,
      })
    );
  }

  metricConsumedReadCapacityUnits() {
    return this.metricFactory.createMetricMath(
      "consumed_rcu_sum/PERIOD(consumed_rcu_sum)",
      {
        consumed_rcu_sum: this.table.metricConsumedReadCapacityUnits({
          statistic: MetricStatistic.SUM,
        }),
      },
      ConsumedLabel
    );
  }

  metricConsumedWriteCapacityUnits() {
    return this.metricFactory.createMetricMath(
      "consumed_wcu_sum/PERIOD(consumed_wcu_sum)",
      {
        consumed_wcu_sum: this.table.metricConsumedWriteCapacityUnits({
          statistic: MetricStatistic.SUM,
        }),
      },
      ConsumedLabel
    );
  }

  metricReadCapacityUtilizationPercentage() {
    return this.metricFactory.createMetricMath(
      "100*(consumed_read_cap/provisioned_read_cap)",
      {
        consumed_read_cap: this.metricConsumedReadCapacityUnits(),
        provisioned_read_cap: this.metricProvisionedReadCapacityUnits(),
      },
      "Utilization"
    );
  }

  metricWriteCapacityUtilizationPercentage() {
    return this.metricFactory.createMetricMath(
      "100*(consumed_write_cap/provisioned_write_cap)",
      {
        consumed_write_cap: this.metricConsumedWriteCapacityUnits(),
        provisioned_write_cap: this.metricProvisionedWriteCapacityUnits(),
      },
      "Utilization"
    );
  }

  metricSearchAverageSuccessfulRequestLatencyInMillis() {
    // searches for all used operations
    return this.metricFactory.createMetricSearch(
      'MetricName="SuccessfulRequestLatency"',
      {
        TableName: this.table.tableName,
        Operation: undefined,
      },
      MetricStatistic.AVERAGE,
      DynamoDbNamespace
    );
  }

  metricAverageSuccessfulRequestLatencyInMillis(operation: Operation) {
    return this.table.metric("SuccessfulRequestLatency", {
      statistic: MetricStatistic.AVERAGE,
      label: operation,
      dimensions: {
        TableName: this.table.tableName,
        Operation: operation,
      },
    });
  }

  metricThrottledReadRequestCount() {
    const readThrottles = this.metricFactory.adaptMetric(
      this.table.metric("ReadThrottleEvents", {
        statistic: MetricStatistic.SUM,
        label: ReadThrottleEventsLabel,
      })
    );

    return this.metricFactory.createMetricMath(
      "FILL(readThrottles,0)",
      { readThrottles },
      ReadThrottleEventsLabel
    );
  }

  metricThrottledWriteRequestCount() {
    const writeThrottles = this.metricFactory.adaptMetric(
      this.table.metric("WriteThrottleEvents", {
        statistic: MetricStatistic.SUM,
        label: WriteThrottleEventsLabel,
      })
    );

    return this.metricFactory.createMetricMath(
      "FILL(writeThrottles,0)",
      { writeThrottles },
      WriteThrottleEventsLabel
    );
  }

  /**
   * This represents the number of requests that resulted in a 500 (server error) error code.
   * It summarizes across the basic CRUD operations:
   * GetItem, BatchGetItem, Scan, Query, GetRecords, PutItem, DeleteItem, UpdateItem, BatchWriteItem
   *
   * It’s usually equal to zero.
   */
  metricSystemErrorsCount() {
    const crudOperations = [
      Operation.GET_ITEM,
      Operation.BATCH_GET_ITEM,
      Operation.SCAN,
      Operation.QUERY,
      Operation.GET_RECORDS,
      Operation.PUT_ITEM,
      Operation.DELETE_ITEM,
      Operation.UPDATE_ITEM,
      Operation.BATCH_WRITE_ITEM,
    ];
    const usingMetrics: Record<string, IMetric> = {};

    crudOperations.forEach((operation) => {
      const metric = this.table.metric("SystemErrors", {
        dimensions: { TableName: this.table.tableName, Operation: operation },
        statistic: MetricStatistic.SUM,
      });

      const metricId = "systemError" + operation;
      usingMetrics[metricId] = this.metricFactory.adaptMetric(metric);
    });

    return this.metricFactory.createMetricMath(
      // the metric is not emitted until error happens
      Object.keys(usingMetrics).join("+"),
      usingMetrics,
      SystemErrorsLabel
    );
  }
}
