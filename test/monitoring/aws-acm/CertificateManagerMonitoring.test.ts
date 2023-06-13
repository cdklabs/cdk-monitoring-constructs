import { Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";

import { CertificateManagerMonitoring } from "../../../lib";
import { addMonitoringDashboardsToStack } from "../../utils/SnapshotUtil";
import { TestMonitoringScope } from "../TestMonitoringScope";

test("snapshot test: no alarms", () => {
  const stack = new Stack();

  const certificate = new Certificate(stack, "Certificate1", {
    domainName: "www.monitoring.cdk",
  });

  const scope = new TestMonitoringScope(stack, "Scope");

  const monitoring = new CertificateManagerMonitoring(scope, {
    alarmFriendlyName: "Certificates",
    certificate,
  });

  addMonitoringDashboardsToStack(stack, monitoring);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot test: all alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  const certificate = new Certificate(stack, "Certificate1", {
    domainName: "www.monitoring.cdk",
  });

  let numAlarmsCreated = 0;

  const monitoring = new CertificateManagerMonitoring(scope, {
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

  addMonitoringDashboardsToStack(stack, monitoring);
  expect(numAlarmsCreated).toStrictEqual(1);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});
