import type { IWidget } from "aws-cdk-lib/aws-cloudwatch";
import { GraphWidget } from "aws-cdk-lib/aws-cloudwatch";

import type { OpenSearchServerlessIndexMetricFactoryProps } from "./OpenSearchServerlessIndexMetricFactory";
import { OpenSearchServerlessIndexMetricFactory } from "./OpenSearchServerlessIndexMetricFactory";
import {
  BaseMonitoringProps,
  MetricWithAlarmSupport,
  Monitoring,
  MonitoringScope,
  FullWidth,
  DefaultGraphWidgetHeight,
  CountAxisFromZero,
} from "../../common";
import {
  MonitoringNamingStrategy,
  MonitoringHeaderWidget,
} from "../../dashboard";

export type OpenSearchServerlessIndexMonitoringOptions = BaseMonitoringProps;

export interface OpenSearchServerlessIndexMonitoringProps
  extends OpenSearchServerlessIndexMetricFactoryProps,
    OpenSearchServerlessIndexMonitoringOptions {}

/**
 * @experimental This is subject to change if an L2 construct becomes available.
 */
export class OpenSearchServerlessIndexMonitoring extends Monitoring {
  readonly title: string;

  readonly metricIndexSearchableDocuments: MetricWithAlarmSupport;

  constructor(
    scope: MonitoringScope,
    props: OpenSearchServerlessIndexMonitoringProps,
  ) {
    super(scope, props);

    const namingStrategy = new MonitoringNamingStrategy({
      ...props,
      fallbackConstructName: props.indexName,
    });
    this.title = namingStrategy.resolveHumanReadableName();

    const metricFactory = new OpenSearchServerlessIndexMetricFactory(
      scope.createMetricFactory(),
      props,
    );

    this.metricIndexSearchableDocuments =
      metricFactory.metricIndexSearchableDocuments();

    props.useCreatedAlarms?.consume(this.createdAlarms());
  }

  summaryWidgets(): IWidget[] {
    return this.widgets();
  }

  widgets(): IWidget[] {
    return [
      this.createTitleWidget(),
      this.createDocumentsWidget(FullWidth, DefaultGraphWidgetHeight),
    ];
  }

  protected createTitleWidget(): IWidget {
    return new MonitoringHeaderWidget({
      family: "OpenSearch Serverless Index",
      title: this.title,
      // TODO: add goToLinkUrl for AWS Console
    });
  }

  protected createDocumentsWidget(width: number, height: number): IWidget {
    return new GraphWidget({
      width,
      height,
      title: "Documents",
      left: [this.metricIndexSearchableDocuments],
      leftYAxis: CountAxisFromZero,
    });
  }
}
