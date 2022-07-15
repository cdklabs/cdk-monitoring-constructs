import { IWidget, LogQueryWidget } from "aws-cdk-lib/aws-cloudwatch";

import {
  BaseMonitoringProps,
  DefaultLogWidgetHeight,
  FullWidth,
  Monitoring,
  MonitoringScope,
} from "../../common";
import { MonitoringHeaderWidget } from "../../dashboard";

const DefaultLimit = 10;

export interface LogMonitoringProps extends BaseMonitoringProps {
  /**
   * name of the log group to analyze for the given pattern
   */
  readonly logGroupName: string;

  /**
   * pattern to show, e.g. "ERROR"
   */
  readonly pattern: string;

  /**
   * widget title
   *
   * @default - auto-generated title based on the pattern and limit
   */
  readonly title?: string;

  /**
   * number of log messages to search for
   *
   * @default - 10
   */
  readonly limit?: number;
}

/**
 * Monitors a CloudWatch log group for various patterns.
 */
export class LogMonitoring extends Monitoring {
  protected readonly pattern: string;
  protected readonly logGroupName: string;
  protected readonly logGroupUrl?: string;
  protected readonly title?: string;
  protected readonly limit: number;

  constructor(scope: MonitoringScope, props: LogMonitoringProps) {
    super(scope);

    this.pattern = props.pattern;
    this.title = props.title;
    this.limit = props.limit ?? DefaultLimit;
    this.logGroupName = props.logGroupName;
    this.logGroupUrl = scope
      .createAwsConsoleUrlFactory()
      .getCloudWatchLogGroupUrl(props.logGroupName);
  }

  widgets(): IWidget[] {
    return [
      new MonitoringHeaderWidget({
        family: "Log Group",
        title: this.logGroupName,
        goToLinkUrl: this.logGroupUrl,
      }),
      // Log Query Results
      new LogQueryWidget({
        logGroupNames: [this.logGroupName],
        height: this.resolveRecommendedHeight(this.limit),
        width: FullWidth,
        title: this.title ?? `Find ${this.pattern} (limit = ${this.limit})`,
        /**
         * https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax.html
         */
        queryLines: [
          "fields @timestamp, @logStream, @message",
          `filter @message like /${this.pattern}/`,
          "sort @timestamp desc",
          `limit ${this.limit}`,
        ],
      }),
    ];
  }

  protected resolveRecommendedHeight(numRows: number) {
    const heightPerLine = 1;
    const recommendedHeight = heightPerLine * numRows;
    return Math.max(recommendedHeight, DefaultLogWidgetHeight);
  }
}
