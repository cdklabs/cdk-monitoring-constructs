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

test("snapshot test: MonitoringAspect", () => {
  // GIVEN
  const stack = new Stack();

  new acm.Certificate(stack, "DummyCertificate", {
    domainName: "www.monitoring.cdk",
  });

  const api = new apigw.RestApi(stack, "DummyRestApi");
  api.root.addMethod("ANY");

  new apigwv2.HttpApi(stack, "DummyHttpApi", {
    apiName: "DummyHttpApi",
  });

  // WHEN
  const facade = new MonitoringFacade(stack, "MonitoringFacade", {
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
  facade.monitorScope(stack);

  // THEN
  expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});
