import { DimensionsMap } from "aws-cdk-lib/aws-cloudwatch";
import { ITable } from "aws-cdk-lib/aws-dynamodb";

import { MetricFactory, MetricStatistic } from "../../common";

const DynamoDbNamespace = "AWS/DynamoDB";

export interface DynamoTableGlobalSecondaryIndexMetricFactoryProps {
  readonly table: ITable;
  readonly globalSecondaryIndexName: string;
}

export class DynamoTableGlobalSecondaryIndexMetricFactory {
  protected readonly metricFactory: MetricFactory;
  protected readonly dimensionsMap: DimensionsMap;

  constructor(
    metricFactory: MetricFactory,
    props: DynamoTableGlobalSecondaryIndexMetricFactoryProps
  ) {
    this.metricFactory = metricFactory;
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
      DynamoDbNamespace
    );
  }

  metricProvisionedWriteCapacityUnits() {
    return this.metricFactory.createMetric(
      "ProvisionedWriteCapacityUnits",
      MetricStatistic.SUM,
      "Provisioned",
      this.dimensionsMap,
      undefined,
      DynamoDbNamespace
    );
  }

  metricConsumedReadCapacityUnits() {
    return this.metricFactory.createMetric(
      "ConsumedReadCapacityUnits",
      MetricStatistic.SUM,
      "Consumed",
      this.dimensionsMap,
      undefined,
      DynamoDbNamespace
    );
  }

  metricConsumedWriteCapacityUnits() {
    return this.metricFactory.createMetric(
      "ConsumedWriteCapacityUnits",
      MetricStatistic.SUM,
      "Consumed",
      this.dimensionsMap,
      undefined,
      DynamoDbNamespace
    );
  }

  metricIndexConsumedWriteUnitsMetric() {
    return this.metricFactory.createMetric(
      "OnlineIndexConsumedWriteCapacity",
      MetricStatistic.SUM,
      "Consumed by index",
      this.dimensionsMap,
      undefined,
      DynamoDbNamespace
    );
  }

  metricThrottledReadRequestCount() {
    const readThrottles = this.metricFactory.createMetric(
      "ReadThrottleEvents",
      MetricStatistic.SUM,
      undefined,
      this.dimensionsMap,
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
      this.dimensionsMap,
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
      this.dimensionsMap,
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
