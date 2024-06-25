import {
  ComparisonOperator,
  TreatMissingData,
} from "aws-cdk-lib/aws-cloudwatch";

import { AlarmFactory, CustomAlarmThreshold } from "../../alarm";
import { MetricWithAlarmSupport } from "../../metric";

export enum OpenSearchClusterStatus {
  RED = "red",
  YELLOW = "yellow",
}

export enum ElasticsearchClusterStatus {
  RED = "red",
  YELLOW = "yellow",
}

export interface OpenSearchClusterStatusCustomization
  extends CustomAlarmThreshold {
  readonly status: OpenSearchClusterStatus | ElasticsearchClusterStatus;
}

export interface OpenSearchClusterIndexWritesBlockedThreshold
  extends CustomAlarmThreshold {
  readonly maxBlockedWrites: number;
}

export interface OpenSearchClusterNodesThreshold extends CustomAlarmThreshold {
  readonly minNodes: number;
}

export interface OpenSearchClusterAutomatedSnapshotFailureThreshold
  extends CustomAlarmThreshold {
  readonly maxFailures: number;
}

export interface OpenSearchKmsKeyErrorThreshold extends CustomAlarmThreshold {
  readonly maxErrors: number;
}

export interface OpenSearchKmsKeyInaccessibleThreshold
  extends CustomAlarmThreshold {
  readonly maxAccessAttempts: number;
}

export class OpenSearchClusterAlarmFactory {
  protected readonly alarmFactory: AlarmFactory;

  constructor(alarmFactory: AlarmFactory) {
    this.alarmFactory = alarmFactory;
  }

  addClusterStatusAlarm(
    metric: MetricWithAlarmSupport,
    props: OpenSearchClusterStatusCustomization,
    disambiguator?: string,
  ) {
    return this.alarmFactory.addAlarm(metric, {
      treatMissingData:
        props.treatMissingDataOverride ?? TreatMissingData.BREACHING,
      comparisonOperator:
        props.comparisonOperatorOverride ??
        ComparisonOperator.GREATER_THAN_THRESHOLD,
      ...props,
      disambiguator,
      threshold: 0,
      alarmNameSuffix: "ClusterStatus",
      alarmDescription: `Cluster is in ${props.status} status`,
      // we will dedupe any kind of message count issue to the same ticket
      alarmDedupeStringSuffix: "ESClusterStatus",
    });
  }

  addClusterIndexWritesBlockedAlarm(
    metric: MetricWithAlarmSupport,
    props: OpenSearchClusterIndexWritesBlockedThreshold,
    disambiguator?: string,
  ) {
    return this.alarmFactory.addAlarm(metric, {
      treatMissingData:
        props.treatMissingDataOverride ?? TreatMissingData.BREACHING,
      comparisonOperator:
        props.comparisonOperatorOverride ??
        ComparisonOperator.GREATER_THAN_THRESHOLD,
      ...props,
      disambiguator,
      threshold: props.maxBlockedWrites,
      alarmNameSuffix: "ClusterIndexWritesBlocked",
      alarmDescription: "Cluster writes are blocked",
      // we will dedupe any kind of message count issue to the same ticket
      alarmDedupeStringSuffix: "ESClusterWritesBlocked",
    });
  }

  addClusterNodeCountAlarm(
    metric: MetricWithAlarmSupport,
    props: OpenSearchClusterNodesThreshold,
    disambiguator?: string,
  ) {
    return this.alarmFactory.addAlarm(metric, {
      treatMissingData:
        props.treatMissingDataOverride ?? TreatMissingData.BREACHING,
      comparisonOperator:
        props.comparisonOperatorOverride ??
        ComparisonOperator.LESS_THAN_THRESHOLD,
      ...props,
      disambiguator,
      threshold: props.minNodes,
      alarmNameSuffix: "Nodes",
      alarmDescription: "Cluster node count is too low",
      // we will dedupe any kind of message count issue to the same ticket
      alarmDedupeStringSuffix: "ESClusterNodeCount",
    });
  }

  addAutomatedSnapshotFailureAlarm(
    metric: MetricWithAlarmSupport,
    props: OpenSearchClusterAutomatedSnapshotFailureThreshold,
    disambiguator?: string,
  ) {
    return this.alarmFactory.addAlarm(metric, {
      treatMissingData:
        props.treatMissingDataOverride ?? TreatMissingData.BREACHING,
      comparisonOperator:
        props.comparisonOperatorOverride ??
        ComparisonOperator.GREATER_THAN_THRESHOLD,
      ...props,
      disambiguator,
      threshold: props.maxFailures,
      alarmNameSuffix: "AutomatedSnapshotFailure",
      alarmDescription: "Cluster automated snapshots are failing",
      // we will dedupe any kind of message count issue to the same ticket
      alarmDedupeStringSuffix: "ESClusterAutomatedSnapshots",
    });
  }

  addKmsKeyErrorAlarm(
    metric: MetricWithAlarmSupport,
    props: OpenSearchKmsKeyErrorThreshold,
    disambiguator?: string,
  ) {
    return this.alarmFactory.addAlarm(metric, {
      treatMissingData:
        props.treatMissingDataOverride ?? TreatMissingData.BREACHING,
      comparisonOperator:
        props.comparisonOperatorOverride ??
        ComparisonOperator.GREATER_THAN_THRESHOLD,
      ...props,
      disambiguator,
      threshold: props.maxErrors,
      alarmNameSuffix: "KMSKeyError",
      alarmDescription: "Cluster KMS keys are throwing errors",
      // we will dedupe any kind of message count issue to the same ticket
      alarmDedupeStringSuffix: "ESClusterKmsKeyError",
    });
  }

  addKmsKeyInaccessibleAlarm(
    metric: MetricWithAlarmSupport,
    props: OpenSearchKmsKeyInaccessibleThreshold,
    disambiguator?: string,
  ) {
    return this.alarmFactory.addAlarm(metric, {
      treatMissingData:
        props.treatMissingDataOverride ?? TreatMissingData.BREACHING,
      comparisonOperator:
        props.comparisonOperatorOverride ??
        ComparisonOperator.GREATER_THAN_THRESHOLD,
      ...props,
      disambiguator,
      threshold: props.maxAccessAttempts,
      alarmNameSuffix: "KMSKeyInaccessible",
      alarmDescription: "Cluster KMS keys are inaccessible",
      // we will dedupe any kind of message count issue to the same ticket
      alarmDedupeStringSuffix: "ESClusterKmsKeyInaccessible",
    });
  }
}
