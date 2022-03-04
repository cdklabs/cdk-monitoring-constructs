import { SynthUtils } from "@monocdk-experiment/assert";
import { Stack } from "monocdk";
import * as apigw from "monocdk/aws-apigateway";
import * as apigwv2 from "monocdk/aws-apigatewayv2";
import * as acm from "monocdk/aws-certificatemanager";

import {
  DefaultDashboardFactory,
  DashboardRenderingPreference,
  MonitoringFacade,
} from "../../lib";

function createDummyMonitoringFacade(stack: Stack): MonitoringFacade {
  return new MonitoringFacade(stack, "MonitoringFacade", {
    alarmFactoryDefaults: {
      alarmNamePrefix: "DummyMonitoring",
      actionsEnabled: true,
    },
    metricFactoryDefaults: {
      namespace: "DummyNamespace",
    },
    dashboardFactory: new DefaultDashboardFactory(stack, "DashboardFactory", {
      dashboardNamePrefix: "DummyDashboard",
      createDashboard: true,
      createSummaryDashboard: true,
      createAlarmDashboard: true,
      renderingPreference: DashboardRenderingPreference.INTERACTIVE_ONLY,
    }),
  });
}

describe("MonitoringAspect", () => {
  test("ACM", () => {
    // GIVEN
    const stack = new Stack();
    const facade = createDummyMonitoringFacade(stack);
    new acm.Certificate(stack, "DummyCertificate", {
      domainName: "www.monitoring.cdk",
    });

    // WHEN
    facade.monitorScope(stack);

    // THEN
    expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
  });

  test("API Gateway", () => {
    // GIVEN
    const stack = new Stack();
    const facade = createDummyMonitoringFacade(stack);
    const api = new apigw.RestApi(stack, "DummyRestApi");
    api.root.addMethod("ANY");

    // WHEN
    facade.monitorScope(stack);

    // THEN
    expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
  });

  test("API Gateway V2", () => {
    // GIVEN
    const stack = new Stack();
    const facade = createDummyMonitoringFacade(stack);
    new apigwv2.HttpApi(stack, "DummyHttpApi", {
      apiName: "DummyHttpApi",
    });

    // WHEN
    facade.monitorScope(stack);

    // THEN
    expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
  });
});
