import { SynthUtils } from "@monocdk-experiment/assert";
import { Stack } from "monocdk";
import { Bucket } from "monocdk/aws-s3";

import { S3BucketMonitoring, StorageType } from "../../../lib";
import { TestMonitoringScope } from "../TestMonitoringScope";

test("snapshot test: no alarms", () => {
  // GIVEN
  const stack = new Stack();
  const bucket = new Bucket(stack, "TestBucket");

  const scope = new TestMonitoringScope(stack, "Scope");

  // WHEN
  new S3BucketMonitoring(scope, {
    bucket,
  });

  // THEN
  expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});

test("snapshot test: override StorageType with IntelligentTieringFAStorage", () => {
  // GIVEN
  const stack = new Stack();
  const bucket = new Bucket(stack, "TestBucket");

  const scope = new TestMonitoringScope(stack, "Scope");

  // WHEN
  new S3BucketMonitoring(scope, {
    bucket: bucket,
    storageType: StorageType.INTELLIGENT_TIERING_FA_STORAGE,
  });

  // THEN
  expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});
