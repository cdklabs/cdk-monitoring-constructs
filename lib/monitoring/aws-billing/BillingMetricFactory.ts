import {Duration} from "aws-cdk-lib";
import {IMetric, Metric} from "aws-cdk-lib/aws-cloudwatch";

import {MetricStatistic, MetricWithAlarmSupport, XaxrMathExpression} from "../../common";

export const BillingRegion = "us-east-1";
export const BillingCurrency = "USD";

const BillingNamespace = "AWS/Billing";
const BillingMetric = "EstimatedCharges";
const BillingPeriod = Duration.days(1);
const DefaultServiceLimit = 10;

export class BillingMetricFactory {
    metricSearchTopCostByServiceInUsd(): IMetric {
        // standard MathExpression class does not support region
        // TODO: revisit after migration to CDK 1.126.0

        const search = new XaxrMathExpression({
            period: BillingPeriod,
            region: BillingRegion,
            expression: `SEARCH('{${BillingNamespace},Currency,ServiceName} MetricName="${BillingMetric}"', 'Maximum', ${BillingPeriod.toSeconds()})`,
            usingMetrics: {},
            label: " ",
        });

        return new XaxrMathExpression({
            period: BillingPeriod,
            region: BillingRegion,
            expression: `SORT(search, MAX, DESC, ${DefaultServiceLimit})`,
            usingMetrics: {search},
            label: " ",
        });
    }

    metricTotalCostInUsd(): MetricWithAlarmSupport {
        // not using metric factory because we customize everything

        return new Metric({
            namespace: BillingNamespace,
            metricName: BillingMetric,
            dimensionsMap: {Currency: BillingCurrency},
            period: BillingPeriod,
            label: `Estimated Charges`,
            region: BillingRegion,
            statistic: MetricStatistic.MAX,
        });
    }
}
