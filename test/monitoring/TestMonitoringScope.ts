import { Construct } from "monocdk";
import { AlarmWidget, IWidget } from "monocdk/aws-cloudwatch";

import {
  AlarmFactory,
  AlarmFactoryDefaults,
  AlarmWithAnnotation,
  AwsConsoleUrlFactory,
  IWidgetFactory,
  MetricFactory,
  MetricFactoryDefaults,
  MonitoringScope,
  noopAction,
} from "../../lib";

const DummyAwsAccountId = "1234567890";
const DummyAwsAccountRegion = "eu-west-1";
const DummyGlobalMetricDefaults: MetricFactoryDefaults = {
  namespace: "DummyNamespace",
};
const DummyGlobalAlarmDefaults: AlarmFactoryDefaults = {
  alarmNamePrefix: "Test",
  datapointsToAlarm: 3,
  actionsEnabled: true,
  action: noopAction(),
};
const DefaultAlarmWidgetWidth = 24 / 4;
const DefaultAlarmWidgetHeight = 24 / 6;

class TestAlarmFactory extends AlarmFactory {
  constructor(scope: Construct, localAlarmNamePrefix: string) {
    super(scope, {
      localAlarmNamePrefix,
      globalAlarmDefaults: DummyGlobalAlarmDefaults,
      globalMetricDefaults: DummyGlobalMetricDefaults,
    });
  }
}

class TestWidgetFactory implements IWidgetFactory {
  createAlarmDetailWidget(alarm: AlarmWithAnnotation): IWidget {
    return new AlarmWidget({
      alarm: alarm.alarm,
      width: DefaultAlarmWidgetWidth,
      height: DefaultAlarmWidgetHeight,
    });
  }
}

export class TestMonitoringScope extends MonitoringScope {
  constructor(scope: Construct, id: string) {
    super(scope, id);
  }

  createAlarmFactory(alarmNamePrefix: string): AlarmFactory {
    return new TestAlarmFactory(this, alarmNamePrefix);
  }

  createAwsConsoleUrlFactory(): AwsConsoleUrlFactory {
    return new AwsConsoleUrlFactory({
      awsAccountId: DummyAwsAccountId,
      awsAccountRegion: DummyAwsAccountRegion,
    });
  }

  createMetricFactory(): MetricFactory {
    return new MetricFactory({ globalDefaults: DummyGlobalMetricDefaults });
  }

  createWidgetFactory(): IWidgetFactory {
    return new TestWidgetFactory();
  }
}
