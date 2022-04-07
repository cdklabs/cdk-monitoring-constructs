import { Aspects, Stack } from "aws-cdk-lib";
import {
  AwsSolutionsChecks,
  HIPAASecurityChecks,
  NIST80053R5Checks,
  PCIDSS321Checks,
} from "cdk-nag";

/**
 * Executes the automatic linters on the given stack.
 * @param stack stack to lint
 */
export function lintStack(stack: Stack) {
  Aspects.of(stack).add(new AwsSolutionsChecks({ verbose: true }));
  Aspects.of(stack).add(new NIST80053R5Checks({ verbose: true }));
  Aspects.of(stack).add(new HIPAASecurityChecks({ verbose: true }));
  Aspects.of(stack).add(new PCIDSS321Checks({ verbose: true }));
}
