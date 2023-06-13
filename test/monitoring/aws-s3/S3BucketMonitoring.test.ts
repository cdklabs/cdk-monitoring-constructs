import { Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { Bucket } from "aws-cdk-lib/aws-s3";

import { S3BucketMonitoring, StorageType } from "../../../lib";
import { addMonitoringDashboardsToStack } from "../../utils/SnapshotUtil";
import { TestMonitoringScope } from "../TestMonitoringScope";

test("snapshot test: no alarms", () => {
  // GIVEN
  const stack = new Stack();
  const bucket = new Bucket(stack, "TestBucket");

  const scope = new TestMonitoringScope(stack, "Scope");

  // WHEN
  const monitoring = new S3BucketMonitoring(scope, {
    bucket,
  });

  // THEN
  addMonitoringDashboardsToStack(stack, monitoring);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot test: override StorageType with IntelligentTieringFAStorage", () => {
  // GIVEN
  const stack = new Stack();
  const bucket = new Bucket(stack, "TestBucket");

  const scope = new TestMonitoringScope(stack, "Scope");

  // WHEN
  const monitoring = new S3BucketMonitoring(scope, {
    bucket: bucket,
    storageType: StorageType.INTELLIGENT_TIERING_FA_STORAGE,
  });

  // THEN
  addMonitoringDashboardsToStack(stack, monitoring);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});
