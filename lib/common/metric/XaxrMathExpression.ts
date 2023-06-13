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

/**
 * Custom wrapper class for MathExpression that supports account and region specification.
 * @see https://github.com/aws/aws-cdk/issues/9039
 */
export class XaxrMathExpression implements IMetric {
  private props: XaxrMathExpressionProps;
  private mathExpression: MathExpression;

  constructor(props: XaxrMathExpressionProps) {
    this.props = props;
    this.mathExpression = new MathExpression(props);
  }

  with(options: MathExpressionOptions): IMetric {
    return new XaxrMathExpression({
      ...this.props,
      ...options,
    });
  }

  toMetricConfig(): MetricConfig {
    const defaultMetricConfig = this.mathExpression.toMetricConfig();
    return {
      ...defaultMetricConfig,
      renderingProperties: {
        ...defaultMetricConfig.renderingProperties,
        accountId: this.props.account,
        region: this.props.region,
      },
    };
  }
}
