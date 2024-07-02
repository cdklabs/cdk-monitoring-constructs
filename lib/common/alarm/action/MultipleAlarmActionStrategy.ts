import {
  AlarmActionStrategyProps,
  IAlarmActionStrategy,
} from "./IAlarmActionStrategy";

export function multipleActions(...actions: IAlarmActionStrategy[]) {
  return new MultipleAlarmActionStrategy(actions);
}

export function isMultipleAlarmActionStrategy(
  obj?: any,
): obj is MultipleAlarmActionStrategy {
  return !!(obj && obj instanceof MultipleAlarmActionStrategy);
}

/**
 * Alarm action strategy that combines multiple actions in the same order as they were given.
 */
export class MultipleAlarmActionStrategy implements IAlarmActionStrategy {
  readonly actions: IAlarmActionStrategy[];

  constructor(actions: IAlarmActionStrategy[]) {
    this.actions = actions;
  }

  addAlarmActions(props: AlarmActionStrategyProps): void {
    this.actions.forEach((action) => action.addAlarmActions(props));
  }

  /**
   * Returns list of alarm actions where any nested instances of MultipleAlarmActionStrategy
   * are flattened.
   *
   * @returns flattened list of alarm actions.
   */
  flattenedAlarmActions(): IAlarmActionStrategy[] {
    return this._flattenedAlarmActions(...this.actions);
  }

  private _flattenedAlarmActions(
    ...actions: IAlarmActionStrategy[]
  ): IAlarmActionStrategy[] {
    return actions.flatMap((action) => {
      if (isMultipleAlarmActionStrategy(action)) {
        return this._flattenedAlarmActions(action);
      }

      return [action];
    });
  }
}
