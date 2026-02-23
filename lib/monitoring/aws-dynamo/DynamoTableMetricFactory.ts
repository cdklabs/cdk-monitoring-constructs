import { IMetric } from "aws-cdk-lib/aws-cloudwatch";
import { BillingMode, ITable, Operation } from "aws-cdk-lib/aws-dynamodb";

import {
  BaseMetricFactory,
  BaseMetricFactoryProps,
  MetricFactory,
  MetricStatistic,
} from "../../common";

const DynamoDbNamespace = "AWS/DynamoDB";
const ProvisionedLabel = "Provisioned";
const ConsumedLabel = "Consumed";
const ReadThrottleEventsLabel = "Read";
const WriteThrottleEventsLabel = "Write";

export interface DynamoTableMetricFactoryProps extends BaseMetricFactoryProps {
  /**
   * table to monitor
   */
  readonly table: ITable;
  /**
   * table billing mode
   *
   * @default - best effort auto-detection or PROVISIONED as a fallback
   */
  readonly billingMode?: BillingMode;
}

export class DynamoTableMetricFactory extends BaseMetricFactory<DynamoTableMetricFactoryProps> {
  protected readonly table: ITable;

  constructor(
    metricFactory: MetricFactory,
    props: DynamoTableMetricFactoryProps,
  ) {
    super(metricFactory, props);

    this.table = props.table;
  }

  metricProvisionedReadCapacityUnits() {
    return this.metricFactory.adaptMetric(
      this.table.metric("ProvisionedReadCapacityUnits", {
        label: ProvisionedLabel,
        statistic: MetricStatistic.AVERAGE,
        region: this.region,
        account: this.account,
      }),
    );
  }

  metricProvisionedWriteCapacityUnits() {
    return this.metricFactory.adaptMetric(
      this.table.metric("ProvisionedWriteCapacityUnits", {
        label: ProvisionedLabel,
        statistic: MetricStatistic.AVERAGE,
        region: this.region,
        account: this.account,
      }),
    );
  }

  metricConsumedReadCapacityUnits() {
    return this.metricFactory.createMetricMath(
      "consumed_rcu_sum/PERIOD(consumed_rcu_sum)",
      {
        consumed_rcu_sum: this.table.metricConsumedReadCapacityUnits({
          statistic: MetricStatistic.SUM,
          region: this.region,
          account: this.account,
        }),
      },
      ConsumedLabel,
    );
  }

  metricConsumedWriteCapacityUnits() {
    return this.metricFactory.createMetricMath(
      "consumed_wcu_sum/PERIOD(consumed_wcu_sum)",
      {
        consumed_wcu_sum: this.table.metricConsumedWriteCapacityUnits({
          statistic: MetricStatistic.SUM,
          region: this.region,
          account: this.account,
        }),
      },
      ConsumedLabel,
    );
  }

  metricReadCapacityUtilizationPercentage() {
    return this.metricFactory.createMetricMath(
      "100*(consumed_read_cap/provisioned_read_cap)",
      {
        consumed_read_cap: this.metricConsumedReadCapacityUnits(),
        provisioned_read_cap: this.metricProvisionedReadCapacityUnits(),
      },
      "Utilization",
    );
  }

  metricWriteCapacityUtilizationPercentage() {
    return this.metricFactory.createMetricMath(
      "100*(consumed_write_cap/provisioned_write_cap)",
      {
        consumed_write_cap: this.metricConsumedWriteCapacityUnits(),
        provisioned_write_cap: this.metricProvisionedWriteCapacityUnits(),
      },
      "Utilization",
    );
  }

  metricSearchAverageSuccessfulRequestLatencyInMillis() {
    // searches for all used operations
    return this.metricFactory.createMetricSearch(
      'MetricName="SuccessfulRequestLatency"',
      {
        TableName: this.table.tableName,
        Operation: undefined as unknown as string,
      },
      MetricStatistic.AVERAGE,
      DynamoDbNamespace,
      undefined,
      undefined,
      this.region,
      this.account,
    );
  }

  metricAverageSuccessfulRequestLatencyInMillis(operation: Operation) {
    return this.metricFactory.adaptMetric(
      this.table.metric("SuccessfulRequestLatency", {
        statistic: MetricStatistic.AVERAGE,
        label: operation,
        dimensionsMap: {
          TableName: this.table.tableName,
          Operation: operation,
        },
        region: this.region,
        account: this.account,
      }),
    );
  }

  metricThrottledReadRequestCount() {
    const readThrottles = this.metricFactory.adaptMetric(
      this.table.metric("ReadThrottleEvents", {
        statistic: MetricStatistic.SUM,
        label: ReadThrottleEventsLabel,
        region: this.region,
        account: this.account,
      }),
    );

    return this.metricFactory.createMetricMath(
      "FILL(readThrottles,0)",
      { readThrottles },
      ReadThrottleEventsLabel,
    );
  }

  metricThrottledWriteRequestCount() {
    const writeThrottles = this.metricFactory.adaptMetric(
      this.table.metric("WriteThrottleEvents", {
        statistic: MetricStatistic.SUM,
        label: WriteThrottleEventsLabel,
        region: this.region,
        account: this.account,
      }),
    );

    return this.metricFactory.createMetricMath(
      "FILL(writeThrottles,0)",
      { writeThrottles },
      WriteThrottleEventsLabel,
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
        dimensionsMap: {
          TableName: this.table.tableName,
          Operation: operation,
        },
        statistic: MetricStatistic.SUM,
        region: this.region,
        account: this.account,
      });

      const metricId = "systemError" + operation;
      usingMetrics[metricId] = this.metricFactory.adaptMetric(metric);
    });

    return this.metricFactory.createMetricMath(
      // the metric is not emitted until error happens
      Object.keys(usingMetrics).join("+"),
      usingMetrics,
      "System Errors",
    );
  }

  metricTimeToLiveDeletedItemCount() {
    return this.metricFactory.adaptMetric(
      this.table.metric("TimeToLiveDeletedItemCount", {
        label: "TTL Deleted Item Count",
        statistic: MetricStatistic.MAX,
        region: this.region,
        account: this.account,
      }),
    );
  }
}
