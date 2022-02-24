import { SynthUtils } from "@monocdk-experiment/assert";
import { Stack } from "monocdk";
import { Certificate } from "monocdk/aws-certificatemanager";

import { CertificateManagerMonitoring } from "../../../lib";
import { TestMonitoringScope } from "../TestMonitoringScope";

test("snapshot test: no alarms", () => {
  const stack = new Stack();

  const certificate = new Certificate(stack, "Certificate1", {
    domainName: "www.monitoring.cdk",
  });

  const scope = new TestMonitoringScope(stack, "Scope");

  new CertificateManagerMonitoring(scope, {
    alarmFriendlyName: "Certificates",
    certificate,
  });

  expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});

test("snapshot test: all alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const certificate = new Certificate(stack, "Certificate1", {
    domainName: "www.monitoring.cdk",
  });

  let numAlarmsCreated = 0;

  new CertificateManagerMonitoring(scope, {
    alarmFriendlyName: "Certificates",
    certificate,
    addDaysToExpiryAlarm: {
      Warning: {
        minDaysToExpiry: 14,
      },
    },
    useCreatedAlarms: {
      consume(alarms) {
        numAlarmsCreated = alarms.length;
      },
    },
  });

  expect(numAlarmsCreated).toStrictEqual(1);
  expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});
