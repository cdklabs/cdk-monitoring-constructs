import { SynthUtils } from "@monocdk-experiment/assert";
import { Stack } from "monocdk";
import { Distribution } from "monocdk/aws-cloudfront";
import { S3Origin } from "monocdk/aws-cloudfront-origins";
import { Bucket } from "monocdk/aws-s3";

import { CloudFrontDistributionMonitoring } from "../../../lib";
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

  expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});
