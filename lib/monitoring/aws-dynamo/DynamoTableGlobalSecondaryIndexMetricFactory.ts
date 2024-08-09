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
    return this.metricFactory.metric({
      metricName: "ProvisionedReadCapacityUnits",
      statistic: MetricStatistic.SUM,
      label: "Provisioned",
      dimensionsMap: this.dimensionsMap,
      namespace: DynamoDbNamespace,
      region: this.region,
      account: this.account,
    });
  }

  metricProvisionedWriteCapacityUnits() {
    return this.metricFactory.metric({
      metricName: "ProvisionedWriteCapacityUnits",
      statistic: MetricStatistic.SUM,
      label: "Provisioned",
      dimensionsMap: this.dimensionsMap,
      namespace: DynamoDbNamespace,
      region: this.region,
      account: this.account,
    });
  }

  metricConsumedReadCapacityUnits() {
    return this.metricFactory.createMetricMath(
      "consumed_rcu_sum/PERIOD(consumed_rcu_sum)",
      {
        consumed_rcu_sum: this.table.metricConsumedReadCapacityUnits({
          statistic: MetricStatistic.SUM,
          dimensionsMap: this.dimensionsMap,
          region: this.region,
          account: this.account,
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
          region: this.region,
          account: this.account,
        }),
      },
      "Consumed",
    );
  }

  metricIndexConsumedWriteUnitsMetric() {
    return this.metricFactory.metric({
      metricName: "OnlineIndexConsumedWriteCapacity",
      statistic: MetricStatistic.SUM,
      label: "Consumed by index",
      dimensionsMap: this.dimensionsMap,
      namespace: DynamoDbNamespace,
      region: this.region,
      account: this.account,
    });
  }

  metricThrottledReadRequestCount() {
    const readThrottles = this.metricFactory.metric({
      metricName: "ReadThrottleEvents",
      statistic: MetricStatistic.SUM,
      dimensionsMap: this.dimensionsMap,
      namespace: DynamoDbNamespace,
      region: this.region,
      account: this.account,
    });

    return this.metricFactory.createMetricMath(
      "FILL(readThrottles,0)",
      { readThrottles },
      "Read",
    );
  }

  metricThrottledWriteRequestCount() {
    const writeThrottles = this.metricFactory.metric({
      metricName: "WriteThrottleEvents",
      statistic: MetricStatistic.SUM,
      dimensionsMap: this.dimensionsMap,
      namespace: DynamoDbNamespace,
      region: this.region,
      account: this.account,
    });

    return this.metricFactory.createMetricMath(
      "FILL(writeThrottles,0)",
      { writeThrottles },
      "Write",
    );
  }

  metricThrottledIndexRequestCount() {
    const indexThrottles = this.metricFactory.metric({
      metricName: "OnlineIndexThrottleEvents",
      statistic: MetricStatistic.SUM,
      dimensionsMap: this.dimensionsMap,
      namespace: DynamoDbNamespace,
      region: this.region,
      account: this.account,
    });

    return this.metricFactory.createMetricMath(
      "FILL(indexThrottles,0)",
      { indexThrottles },
      "Index",
    );
  }
}
