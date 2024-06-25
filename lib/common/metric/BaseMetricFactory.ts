import { MetricFactory } from "./MetricFactory";

export interface BaseMetricFactoryProps {
  // TODO: this will eventually include other common things like account/region
}

export abstract class BaseMetricFactory<
  PropsType extends BaseMetricFactoryProps
> {
  protected readonly metricFactory: MetricFactory;

  constructor(metricFactory: MetricFactory, _props: PropsType) {
    this.metricFactory = metricFactory;
  }
}
