import {
  OpsItemCategory,
  OpsItemSeverity,
  SsmAction,
} from "aws-cdk-lib/aws-cloudwatch-actions";
import {
  AlarmActionStrategyProps,
  IAlarmActionStrategy,
} from "./IAlarmActionStrategy";

/**
 * Creates an AWS OpsCenter OpsItem with critical severity.
 *
 * @param category optional category (no category by default)
 */
export function createCriticalSeverityOpsItem(category?: OpsItemCategory) {
  return createOpsItem(OpsItemSeverity.CRITICAL, category);
}

/**
 * Creates an AWS OpsCenter OpsItem with high severity.
 *
 * @param category optional category (no category by default)
 */
export function createHighSeverityOpsItem(category?: OpsItemCategory) {
  return createOpsItem(OpsItemSeverity.HIGH, category);
}

/**
 * Creates an AWS OpsCenter OpsItem with medium severity.
 *
 * @param category optional category (no category by default)
 */
export function createMediumSeverityOpsItem(category?: OpsItemCategory) {
  return createOpsItem(OpsItemSeverity.MEDIUM, category);
}

/**
 * Creates an AWS OpsCenter OpsItem with low severity.
 *
 * @param category optional category (no category by default)
 */
export function createLowSeverityOpsItem(category?: OpsItemCategory) {
  return createOpsItem(OpsItemSeverity.LOW, category);
}

/**
 * Creates an AWS OpsCenter OpsItem.
 *
 * @param severity desired item severity
 * @param category optional category (no category by default)
 */
export function createOpsItem(
  severity: OpsItemSeverity,
  category?: OpsItemCategory
) {
  return new OpsItemAlarmActionStrategy(severity, category);
}

/**
 * Alarm action strategy that creates an AWS OpsCenter OpsItem.
 */
export class OpsItemAlarmActionStrategy implements IAlarmActionStrategy {
  /**
   * OPS Item Severity
   */
  readonly severity: OpsItemSeverity;

  /**
   * OPS Item Category
   */
  readonly category?: OpsItemCategory;

  constructor(severity: OpsItemSeverity, category?: OpsItemCategory) {
    this.severity = severity;
    this.category = category;
  }

  addAlarmActions(props: AlarmActionStrategyProps): void {
    props.alarm.addAlarmAction(new SsmAction(this.severity, this.category));
  }
}
