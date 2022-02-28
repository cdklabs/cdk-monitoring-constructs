import {
  AlarmActionStrategyProps,
  IAlarmActionStrategy,
} from "./IAlarmActionStrategy";

export function multipleActions(...actions: IAlarmActionStrategy[]) {
  return new MultipleAlarmActionStrategy(actions);
}

/**
 * Alarm action strategy that combines multiple actions in the same order as they were given.
 */
export class MultipleAlarmActionStrategy implements IAlarmActionStrategy {
  protected readonly actions: IAlarmActionStrategy[];

  constructor(actions: IAlarmActionStrategy[]) {
    this.actions = actions;
  }

  addAlarmActions(props: AlarmActionStrategyProps): void {
    this.actions.forEach((action) => action.addAlarmActions(props));
  }
}
