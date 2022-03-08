import { Stack } from "monocdk";
import { Template } from "monocdk/assertions";
import { Distribution } from "monocdk/aws-cloudfront";
import { S3Origin } from "monocdk/aws-cloudfront-origins";
import { Bucket } from "monocdk/aws-s3";

import {
  AlarmWithAnnotation,
  CloudFrontDistributionMonitoring,
} from "../../../lib";
import { TestMonitoringScope } from "../TestMonitoringScope";

test("snapshot test: no alarms", () => {
  const stack = new Stack();
  const bucket = new Bucket(stack, "Bucket");
  const distribution = new Distribution(stack, "Distribution", {
    defaultBehavior: {
      origin: new S3Origin(bucket),
    },
  });

  const scope = new TestMonitoringScope(stack, "Scope");

  new CloudFrontDistributionMonitoring(scope, { distribution });

  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot test: all alarms", () => {
  const stack = new Stack();
  const bucket = new Bucket(stack, "Bucket");
  const distribution = new Distribution(stack, "Distribution", {
    defaultBehavior: {
      origin: new S3Origin(bucket),
    },
  });

  const scope = new TestMonitoringScope(stack, "Scope");

  let numAlarmsCreated = 0;

  new CloudFrontDistributionMonitoring(scope, {
    distribution,
    addLowTpsAlarm: {
      Warning: {
        minTps: 10,
      },
    },
    addHighTpsAlarm: {
      Warning: {
        maxTps: 20,
      },
    },
    addError4xxRate: {
      Warning: {
        maxErrorRate: 0.5,
      },
    },
    addFault5xxRate: {
      Warning: {
        maxErrorRate: 0.8,
      },
    },
    useCreatedAlarms: {
      consume(alarms: AlarmWithAnnotation[]) {
        numAlarmsCreated = alarms.length;
      },
    },
  });

  expect(numAlarmsCreated).toStrictEqual(4);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});
