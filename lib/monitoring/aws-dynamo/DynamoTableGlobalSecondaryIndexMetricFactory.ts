import { DimensionHash } from "monocdk/aws-cloudwatch";
import { ITable } from "monocdk/aws-dynamodb";

import { MetricFactory, MetricStatistic } from "../../common";

const DynamoDbNamespace = "AWS/DynamoDB";

export interface DynamoTableGlobalSecondaryIndexMetricFactoryProps {
  readonly table: ITable;
  readonly globalSecondaryIndexName: string;
}

export class DynamoTableGlobalSecondaryIndexMetricFactory {
  protected readonly metricFactory: MetricFactory;
  protected readonly dimensions: DimensionHash;

  constructor(
    metricFactory: MetricFactory,
    props: DynamoTableGlobalSecondaryIndexMetricFactoryProps
  ) {
    this.metricFactory = metricFactory;
    this.dimensions = {
      TableName: props.table.tableName,
      GlobalSecondaryIndexName: props.globalSecondaryIndexName,
    };
  }

  metricProvisionedReadCapacityUnits() {
    return this.metricFactory.createMetric(
      "ProvisionedReadCapacityUnits",
      MetricStatistic.SUM,
      "Provisioned",
      this.dimensions,
      undefined,
      DynamoDbNamespace
    );
  }

  metricProvisionedWriteCapacityUnits() {
    return this.metricFactory.createMetric(
      "ProvisionedWriteCapacityUnits",
      MetricStatistic.SUM,
      "Provisioned",
      this.dimensions,
      undefined,
      DynamoDbNamespace
    );
  }

  metricConsumedReadCapacityUnits() {
    return this.metricFactory.createMetric(
      "ConsumedReadCapacityUnits",
      MetricStatistic.SUM,
      "Consumed",
      this.dimensions,
      undefined,
      DynamoDbNamespace
    );
  }

  metricConsumedWriteCapacityUnits() {
    return this.metricFactory.createMetric(
      "ConsumedWriteCapacityUnits",
      MetricStatistic.SUM,
      "Consumed",
      this.dimensions,
      undefined,
      DynamoDbNamespace
    );
  }

  metricIndexConsumedWriteUnitsMetric() {
    return this.metricFactory.createMetric(
      "OnlineIndexConsumedWriteCapacity",
      MetricStatistic.SUM,
      "Consumed by index",
      this.dimensions,
      undefined,
      DynamoDbNamespace
    );
  }

  metricThrottledReadRequestCount() {
    const readThrottles = this.metricFactory.createMetric(
      "ReadThrottleEvents",
      MetricStatistic.SUM,
      undefined,
      this.dimensions,
      undefined,
      DynamoDbNamespace
    );

    return this.metricFactory.createMetricMath(
      "FILL(readThrottles,0)",
      { readThrottles },
      "Read"
    );
  }

  metricThrottledWriteRequestCount() {
    const writeThrottles = this.metricFactory.createMetric(
      "WriteThrottleEvents",
      MetricStatistic.SUM,
      undefined,
      this.dimensions,
      undefined,
      DynamoDbNamespace
    );

    return this.metricFactory.createMetricMath(
      "FILL(writeThrottles,0)",
      { writeThrottles },
      "Write"
    );
  }

  metricThrottledIndexRequestCount() {
    const indexThrottles = this.metricFactory.createMetric(
      "OnlineIndexThrottleEvents",
      MetricStatistic.SUM,
      undefined,
      this.dimensions,
      undefined,
      DynamoDbNamespace
    );

    return this.metricFactory.createMetricMath(
      "FILL(indexThrottles,0)",
      { indexThrottles },
      "Index"
    );
  }
}
