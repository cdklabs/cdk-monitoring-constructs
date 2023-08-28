import { Duration } from "aws-cdk-lib";
import { IMetric, MathExpression, Metric } from "aws-cdk-lib/aws-cloudwatch";

import { MetricStatistic, MetricWithAlarmSupport } from "../../common";

export const BillingRegion = "us-east-1";
export const BillingCurrency = "USD";

const BillingNamespace = "AWS/Billing";
const BillingMetric = "EstimatedCharges";
const BillingPeriod = Duration.days(1);
const DefaultServiceLimit = 10;

export class BillingMetricFactory {
  metricSearchTopCostByServiceInUsd(): IMetric {
    const search = new MathExpression({
      period: BillingPeriod,
      searchRegion: BillingRegion,
      expression: `SEARCH('{${BillingNamespace},Currency,ServiceName} MetricName="${BillingMetric}"', 'Maximum', ${BillingPeriod.toSeconds()})`,
      usingMetrics: {},
      label: " ",
    });

    return new MathExpression({
      period: BillingPeriod,
      searchRegion: BillingRegion,
      expression: `SORT(search, MAX, DESC, ${DefaultServiceLimit})`,
      usingMetrics: { search },
      label: " ",
    });
  }

  metricTotalCostInUsd(): MetricWithAlarmSupport {
    // not using metric factory because we customize everything

    return new Metric({
      namespace: BillingNamespace,
      metricName: BillingMetric,
      dimensionsMap: { Currency: BillingCurrency },
      period: BillingPeriod,
      label: `Estimated Charges`,
      region: BillingRegion,
      statistic: MetricStatistic.MAX,
    });
  }
}
