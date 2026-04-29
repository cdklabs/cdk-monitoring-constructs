import { Duration, Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import * as elasticsearch from "aws-cdk-lib/aws-elasticsearch";
import * as opensearch from "aws-cdk-lib/aws-opensearchservice";

import {
  AlarmWithAnnotation,
  OpenSearchClusterMonitoring,
  OpenSearchClusterStatus,
} from "../../../lib";
import { TestMonitoringScope } from "../TestMonitoringScope";

interface DomainConfig {
  readonly id: string;
  readonly create: (stack: Stack) => any;
}

const domainConfigs: DomainConfig[] = [
  {
    id: "ElasticsearchCfnDomain",
    create: (stack) =>
      new elasticsearch.CfnDomain(stack, "ElasticsearchCfnDomain", {
        domainName: "es-cfn-domain",
      }),
  },
  {
    id: "ElasticsearchDomain",
    create: (stack) =>
      new elasticsearch.Domain(stack, "ElasticsearchDomain", {
        domainName: "es-domain",
        version: elasticsearch.ElasticsearchVersion.V7_7,
      }),
  },
  {
    id: "OpenSearchCfnDomain",
    create: (stack) =>
      new opensearch.CfnDomain(stack, "OpenSearchCfnDomain", {
        domainName: "os-cfn-domain",
      }),
  },
  {
    id: "OpenSearchDomain",
    create: (stack) =>
      new opensearch.Domain(stack, "OpenSearchDomain", {
        domainName: "os-domain",
        version: opensearch.EngineVersion.OPENSEARCH_1_0,
      }),
  },
];

domainConfigs.forEach(({ id, create }) => {
  test(`snapshot test: no alarms for ${id}`, () => {
    const stack = new Stack();
    const domain = create(stack);

    const scope = new TestMonitoringScope(stack, "Scope-NoAlarms-" + id);

    new OpenSearchClusterMonitoring(scope, {
      domain,
    });

    expect(Template.fromStack(stack)).toMatchSnapshot();
  });

  test(`snapshot test: all alarms for ${id}`, () => {
    const stack = new Stack();
    const domain = create(stack);

    const scope = new TestMonitoringScope(stack, "Scope-AllAlarms-" + id);

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
    expect(Template.fromStack(stack)).toMatchSnapshot();
  });
});
