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

    // https://github.com/aws/aws-cdk/issues/10540#issuecomment-725222564
    const cfnAlarm = alarm.node.defaultChild as CfnAlarm;
    cfnAlarm.addPropertyDeletionOverride("Threshold");
    (cfnAlarm.metrics as CfnAlarm.MetricDataQueryProperty[]).forEach(
      (metric, index) => {
        if (metric.expression) {
          cfnAlarm.thresholdMetricId = metric.id;
        }
        cfnAlarm.addPropertyOverride(`Metrics.${index}.ReturnData`, true);
      }
    );

    return alarm;
  }
}
