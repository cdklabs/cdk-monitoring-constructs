import { SynthUtils } from "@monocdk-experiment/assert";
import { Duration, Stack } from "monocdk";
import * as elasticsearch from "monocdk/aws-elasticsearch";
import * as opensearch from "monocdk/aws-opensearchservice";

import {
  AlarmWithAnnotation,
  OpenSearchClusterMonitoring,
  OpenSearchClusterStatus,
} from "../../../lib";
import { TestMonitoringScope } from "../TestMonitoringScope";

const stack = new Stack();
[
  new elasticsearch.CfnDomain(stack, "ElasticsearchCfnDomain", {
    domainName: "ElasticsearchCfnDomain",
  }),
  new elasticsearch.Domain(stack, "ElasticsearchDomain", {
    domainName: "ElasticsearchDomain",
    version: elasticsearch.ElasticsearchVersion.V7_7,
  }),
  new opensearch.CfnDomain(stack, "OpenSearchCfnDomain", {
    domainName: "OpenSearchCfnDomain",
  }),
  new opensearch.Domain(stack, "OpenSearchDomain", {
    domainName: "OpenSearchDomain",
    version: opensearch.EngineVersion.OPENSEARCH_1_0,
  }),
].forEach((domain) => {
  test(`snapshot test: no alarms for ${domain.node.id}`, () => {
    const scope = new TestMonitoringScope(
      stack,
      "Scope-NoAlarms-" + domain.node.id
    );

    new OpenSearchClusterMonitoring(scope, {
      domain,
    });

    expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
  });

  test(`snapshot test: all alarms for ${domain.node.id}`, () => {
    const scope = new TestMonitoringScope(
      stack,
      "Scope-AllAlarms-" + domain.node.id
    );

    let numAlarmsCreated = 0;

    new OpenSearchClusterMonitoring(scope, {
      domain,
      addIndexingLatencyP50Alarm: {
        Warning: {
          maxLatency: Duration.millis(500),
          evaluationPeriods: 10,
        },
      },
      addIndexingLatencyP90Alarm: {
        Warning: {
          maxLatency: Duration.millis(600),
        },
      },
      addIndexingLatencyP99Alarm: {
        Warning: {
          maxLatency: Duration.millis(700),
        },
      },
      addSearchLatencyP50Alarm: {
        Warning: {
          maxLatency: Duration.millis(500),
        },
      },
      addSearchLatencyP90Alarm: {
        Warning: {
          maxLatency: Duration.millis(600),
        },
      },
      addSearchLatencyP99Alarm: {
        Warning: {
          maxLatency: Duration.millis(700),
        },
      },
      addClusterStatusAlarm: {
        Warning: {
          status: OpenSearchClusterStatus.YELLOW,
        },
        Critical: {
          status: OpenSearchClusterStatus.RED,
        },
      },
      addDiskSpaceUsageAlarm: {
        Warning: {
          maxUsagePercent: 80,
        },
      },
      addCpuSpaceUsageAlarm: {
        Warning: {
          maxUsagePercent: 80,
        },
      },
      addMasterCpuSpaceUsageAlarm: {
        Warning: {
          maxUsagePercent: 80,
        },
      },
      addJvmMemoryPressureAlarm: {
        Warning: {
          maxUsagePercent: 80,
        },
      },
      addMasterJvmMemoryPressureAlarm: {
        Warning: {
          maxUsagePercent: 80,
        },
      },
      addClusterIndexWritesBlockedAlarm: {
        Warning: {
          maxBlockedWrites: 1,
        },
      },
      addClusterNodeCountAlarm: {
        Warning: {
          minNodes: 1,
        },
      },
      addClusterAutomatedSnapshotFailureAlarm: {
        Warning: {
          maxFailures: 1,
        },
      },
      addKmsKeyErrorAlarm: {
        Warning: {
          maxErrors: 1,
        },
      },
      addKmsKeyInaccessibleAlarm: {
        Warning: {
          maxAccessAttempts: 1,
        },
      },
      useCreatedAlarms: {
        consume(alarms: AlarmWithAnnotation[]) {
          numAlarmsCreated = alarms.length;
        },
      },
    });

    expect(numAlarmsCreated).toStrictEqual(18);
    expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
  });
});
