import {
  IMetric,
  MathExpression,
  MathExpressionOptions,
  MathExpressionProps,
  MetricConfig,
} from "aws-cdk-lib/aws-cloudwatch";

/**
 * Custom wrapper class for MathExpressionProps that supports account and region customization.
 * @see https://github.com/aws/aws-cdk/issues/9039
 */
export interface XaxrMathExpressionProps extends MathExpressionProps {
  /**
   * (experimental) Account which this metric comes from.
   *
   * @default - Deployment account.
   * @experimental
   */
  readonly account?: string;

  /**
   * (experimental) Region which this metric comes from.
   *
   * @default - Deployment region.
   * @experimental
   */
  readonly region?: string;
}

// TODO: remove this as a breaking change
/**
 * Custom wrapper class for MathExpression that supports account and region specification.
 * @see https://github.com/aws/aws-cdk/issues/9039
 *
 * @deprecated Use MathExpression from aws-cdk-lib/aws-cloudwatch instead.
 */
export class XaxrMathExpression implements IMetric {
  private props: XaxrMathExpressionProps;
  private mathExpression: MathExpression;

  constructor(props: XaxrMathExpressionProps) {
    this.props = props;
    this.mathExpression = new MathExpression(props);
  }

  /**
   * @deprecated Use MathExpression from aws-cdk-lib/aws-cloudwatch instead.
   */
  with(options: MathExpressionOptions): IMetric {
    return new MathExpression({
      ...this.props,
      ...options,
      searchAccount: this.props.account,
      searchRegion: this.props.region,
    });
  }

  /**
   * @deprecated Use MathExpression from aws-cdk-lib/aws-cloudwatch instead.
   */
  toMetricConfig(): MetricConfig {
    return this.mathExpression.toMetricConfig();
  }
}
