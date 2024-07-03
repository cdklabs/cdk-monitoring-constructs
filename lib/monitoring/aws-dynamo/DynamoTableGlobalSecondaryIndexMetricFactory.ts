import { DimensionsMap } from "aws-cdk-lib/aws-cloudwatch";
import { ITable } from "aws-cdk-lib/aws-dynamodb";

import {
  BaseMetricFactory,
  BaseMetricFactoryProps,
  MetricFactory,
  MetricStatistic,
} from "../../common";

const DynamoDbNamespace = "AWS/DynamoDB";

export interface DynamoTableGlobalSecondaryIndexMetricFactoryProps
  extends BaseMetricFactoryProps {
  readonly table: ITable;
  readonly globalSecondaryIndexName: string;
}

export class DynamoTableGlobalSecondaryIndexMetricFactory extends BaseMetricFactory<DynamoTableGlobalSecondaryIndexMetricFactoryProps> {
  protected readonly table: ITable;
  protected readonly dimensionsMap: DimensionsMap;

  constructor(
    metricFactory: MetricFactory,
    props: DynamoTableGlobalSecondaryIndexMetricFactoryProps,
  ) {
    super(metricFactory, props);

    this.table = props.table;
    this.dimensionsMap = {
      TableName: props.table.tableName,
      GlobalSecondaryIndexName: props.globalSecondaryIndexName,
    };
  }

  metricProvisionedReadCapacityUnits() {
    return this.metricFactory.createMetric(
      "ProvisionedReadCapacityUnits",
      MetricStatistic.SUM,
      "Provisioned",
      this.dimensionsMap,
      undefined,
      DynamoDbNamespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricProvisionedWriteCapacityUnits() {
    return this.metricFactory.createMetric(
      "ProvisionedWriteCapacityUnits",
      MetricStatistic.SUM,
      "Provisioned",
      this.dimensionsMap,
      undefined,
      DynamoDbNamespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricConsumedReadCapacityUnits() {
    return this.metricFactory.createMetricMath(
      "consumed_rcu_sum/PERIOD(consumed_rcu_sum)",
      {
        consumed_rcu_sum: this.table.metricConsumedReadCapacityUnits({
          statistic: MetricStatistic.SUM,
          dimensionsMap: this.dimensionsMap,
        }),
      },
      "Consumed",
    );
  }

  metricConsumedWriteCapacityUnits() {
    return this.metricFactory.createMetricMath(
      "consumed_wcu_sum/PERIOD(consumed_wcu_sum)",
      {
        consumed_wcu_sum: this.table.metricConsumedWriteCapacityUnits({
          statistic: MetricStatistic.SUM,
          dimensionsMap: this.dimensionsMap,
        }),
      },
      "Consumed",
    );
  }

  metricIndexConsumedWriteUnitsMetric() {
    return this.metricFactory.createMetric(
      "OnlineIndexConsumedWriteCapacity",
      MetricStatistic.SUM,
      "Consumed by index",
      this.dimensionsMap,
      undefined,
      DynamoDbNamespace,
      undefined,
      this.region,
      this.account,
    );
  }

  metricThrottledReadRequestCount() {
    const readThrottles = this.metricFactory.createMetric(
      "ReadThrottleEvents",
      MetricStatistic.SUM,
      undefined,
      this.dimensionsMap,
      undefined,
      DynamoDbNamespace,
      undefined,
      this.region,
      this.account,
    );

    return this.metricFactory.createMetricMath(
      "FILL(readThrottles,0)",
      { readThrottles },
      "Read",
    );
  }

  metricThrottledWriteRequestCount() {
    const writeThrottles = this.metricFactory.createMetric(
      "WriteThrottleEvents",
      MetricStatistic.SUM,
      undefined,
      this.dimensionsMap,
      undefined,
      DynamoDbNamespace,
      undefined,
      this.region,
      this.account,
    );

    return this.metricFactory.createMetricMath(
      "FILL(writeThrottles,0)",
      { writeThrottles },
      "Write",
    );
  }

  metricThrottledIndexRequestCount() {
    const indexThrottles = this.metricFactory.createMetric(
      "OnlineIndexThrottleEvents",
      MetricStatistic.SUM,
      undefined,
      this.dimensionsMap,
      undefined,
      DynamoDbNamespace,
      undefined,
      this.region,
      this.account,
    );

    return this.metricFactory.createMetricMath(
      "FILL(indexThrottles,0)",
      { indexThrottles },
      "Index",
    );
  }
}
