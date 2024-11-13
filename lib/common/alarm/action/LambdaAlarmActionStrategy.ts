import { LambdaAction } from "aws-cdk-lib/aws-cloudwatch-actions";
import { IAlias, IFunction, IVersion } from "aws-cdk-lib/aws-lambda";

import {
  AlarmActionStrategyProps,
  IAlarmActionStrategy,
} from "./IAlarmActionStrategy";

export function triggerLambda(
  lambdaFunction: IAlias | IVersion | IFunction,
): IAlarmActionStrategy {
  return new LambdaAlarmActionStrategy(lambdaFunction);
}

/**
 * Alarm action strategy that triggers a Lambda function.
 */
export class LambdaAlarmActionStrategy implements IAlarmActionStrategy {
  protected readonly lambdaFunction: IAlias | IVersion | IFunction;

  constructor(lambdaFunction: IAlias | IVersion | IFunction) {
    this.lambdaFunction = lambdaFunction;
  }

  addAlarmActions(props: AlarmActionStrategyProps): void {
    props.alarm.addAlarmAction(new LambdaAction(this.lambdaFunction));
  }
}
