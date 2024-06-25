import {
  Alarm,
  CfnAlarm,
  CreateAlarmOptions,
  MathExpression,
  MathExpressionOptions,
  MathExpressionProps,
} from "aws-cdk-lib/aws-cloudwatch";
import { Construct } from "constructs";

/**
 * Captures specific MathExpression for anomaly detection, for which alarm generation is different.
 * Added to overcome certain CDK limitations at the time of writing.
 * @see https://github.com/aws/aws-cdk/issues/10540
 */
export class AnomalyDetectionMathExpression extends MathExpression {
  constructor(props: MathExpressionProps) {
    super(props);
  }

  with(props: MathExpressionOptions): MathExpression {
    return new AnomalyDetectionMathExpression({
      expression: this.expression,
      usingMetrics: this.usingMetrics,
      label: props.label ?? this.label,
      color: props.color ?? this.color,
      period: props.period ?? this.period,
    });
  }

  createAlarm(scope: Construct, id: string, props: CreateAlarmOptions): Alarm {
    const alarm = super.createAlarm(scope, id, props);

    // `usingMetrics` of an anomaly detection alarm can only ever have one entry.
    // Should the entry be a math expression, the math expression can have its own `usingMetrics`.
    const finalExpressionId = Object.keys(this.usingMetrics)[0];

    // https://github.com/aws/aws-cdk/issues/10540#issuecomment-725222564
    const cfnAlarm = alarm.node.defaultChild as CfnAlarm;
    cfnAlarm.addPropertyDeletionOverride("Threshold");
    (cfnAlarm.metrics as CfnAlarm.MetricDataQueryProperty[]).forEach(
      (metric, index) => {
        // To create an anomaly detection alarm, returned data should be set to true on two MetricDataQueryProperty(s):
        // 1. The metric or math expression that is being evaluated for anomaly detection (eg. expr_1)
        // 2. The actual expression of anomaly detection (eg. ANOMALY_DETECTION_BAND(expr_1, 1))
        let returnData = false;

        if (metric.expression?.includes("ANOMALY_DETECTION_BAND")) {
          // thresholdMetricId is the ID of the ANOMALY_DETECTION_BAND function used as the threshold for the alarm.
          cfnAlarm.thresholdMetricId = metric.id;
          returnData = true;
        } else if (metric.id === finalExpressionId) {
          returnData = true;
        }

        cfnAlarm.addPropertyOverride(`Metrics.${index}.ReturnData`, returnData);
      },
    );

    return alarm;
  }
}
