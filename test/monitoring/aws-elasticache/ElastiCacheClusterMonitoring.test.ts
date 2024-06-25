import { Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";

import {
  AlarmWithAnnotation,
  ElastiCacheClusterMonitoring,
  ElastiCacheClusterType,
} from "../../../lib";
import { TestMonitoringScope } from "../TestMonitoringScope";

const DummyMemcachedClusterId = "DummyMemcachedClusterId";
const DummyRedisClusterId = "DummyRedisClusterId";

test("snapshot test: no alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  new ElastiCacheClusterMonitoring(scope, {
    clusterType: ElastiCacheClusterType.MEMCACHED,
  });

  new ElastiCacheClusterMonitoring(scope, {
    clusterType: ElastiCacheClusterType.REDIS,
  });

  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot test: all alarms", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  let numAlarmsCreatedForMemcached = 0;
  let numAlarmsCreatedForRedis = 0;

  new ElastiCacheClusterMonitoring(scope, {
    clusterType: ElastiCacheClusterType.MEMCACHED,
    addCpuUsageAlarm: { Warning: { maxUsagePercent: 10 } },
    addMaxItemsCountAlarm: { Warning: { maxItemsCount: 20 } },
    addMaxEvictedItemsCountAlarm: { Warning: { maxItemsCount: 30 } },
    addMinFreeableMemoryAlarm: { Warning: { minFreeableMemoryInBytes: 40 } },
    addMaxUsedSwapMemoryAlarm: { Warning: { maxUsedSwapMemoryInBytes: 50 } },
    useCreatedAlarms: {
      consume(alarms: AlarmWithAnnotation[]) {
        numAlarmsCreatedForMemcached = alarms.length;
      },
    },
  });

  new ElastiCacheClusterMonitoring(scope, {
    clusterType: ElastiCacheClusterType.REDIS,
    addCpuUsageAlarm: { Warning: { maxUsagePercent: 11 } },
    addRedisEngineCpuUsageAlarm: { Warning: { maxUsagePercent: 10 } },
    addMaxItemsCountAlarm: { Warning: { maxItemsCount: 21 } },
    addMaxEvictedItemsCountAlarm: { Warning: { maxItemsCount: 31 } },
    addMinFreeableMemoryAlarm: { Warning: { minFreeableMemoryInBytes: 41 } },
    addMaxUsedSwapMemoryAlarm: { Warning: { maxUsedSwapMemoryInBytes: 51 } },
    useCreatedAlarms: {
      consume(alarms: AlarmWithAnnotation[]) {
        numAlarmsCreatedForRedis = alarms.length;
      },
    },
  });

  expect(numAlarmsCreatedForMemcached).toStrictEqual(5);
  expect(numAlarmsCreatedForRedis).toStrictEqual(6);
  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("snapshot test: cluster ID specified", () => {
  const stack = new Stack();

  const scope = new TestMonitoringScope(stack, "Scope");

  new ElastiCacheClusterMonitoring(scope, {
    clusterType: ElastiCacheClusterType.MEMCACHED,
    clusterId: DummyMemcachedClusterId,
    humanReadableName: DummyMemcachedClusterId,
    alarmFriendlyName: DummyMemcachedClusterId,
  });

  new ElastiCacheClusterMonitoring(scope, {
    clusterType: ElastiCacheClusterType.REDIS,
    clusterId: DummyRedisClusterId,
    humanReadableName: DummyRedisClusterId,
    alarmFriendlyName: DummyRedisClusterId,
  });

  expect(Template.fromStack(stack)).toMatchSnapshot();
});

test("validation test: redisEngineCpuUsageAlarm added for non-redis cluster ", () => {
  const stack = new Stack();
  const scope = new TestMonitoringScope(stack, "Scope");

  expect(
    () =>
      new ElastiCacheClusterMonitoring(scope, {
        clusterType: ElastiCacheClusterType.MEMCACHED,
        addRedisEngineCpuUsageAlarm: { Warning: { maxUsagePercent: 10 } },
      }),
  ).toThrowError(
    "It is only possible to alarm on Redis Engine CPU Usage for Redis clusters",
  );
});
