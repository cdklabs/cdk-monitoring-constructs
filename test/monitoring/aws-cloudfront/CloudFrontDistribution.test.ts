import { Stack } from "monocdk";
import { Template } from "monocdk/assertions";
import { Distribution } from "monocdk/aws-cloudfront";
import { S3Origin } from "monocdk/aws-cloudfront-origins";
import { ComparisonOperator } from "monocdk/aws-cloudwatch";
import { Bucket } from "monocdk/aws-s3";

import {
  AlarmWithAnnotation,
  CloudFrontDistributionMonitoring,
} from "../../../lib";
import { TestMonitoringScope } from "../TestMonitoringScope";

test("snapshot test", () => {
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
    addError4xxRate: {
      Warning: {
        maxErrorRate: 1,
        datapointsToAlarm: 10,
      },
    },
    addError5xxRate: {
      Warning: {
        maxErrorRate: 1,
        datapointsToAlarm: 10,
      },
    },
    addLowTpsAlarm: {
      Warning: {
        minTps: 0,
        datapointsToAlarm: 1,
        comparisonOperatorOverride:
          ComparisonOperator.LESS_THAN_OR_EQUAL_TO_THRESHOLD,
      },
    },
    addHighTpsAlarm: {
      Warning: {
        maxTps: 20,
        datapointsToAlarm: 1,
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
