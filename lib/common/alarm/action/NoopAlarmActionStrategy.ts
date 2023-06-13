import {AlarmActionStrategyProps, IAlarmActionStrategy} from "./IAlarmActionStrategy";

export function noopAction() {
    return new NoopAlarmActionStrategy();
}

/**
 * Alarm action strategy that does not add any actions.
 */
export class NoopAlarmActionStrategy implements IAlarmActionStrategy {
    addAlarmActions(_props: AlarmActionStrategyProps): void {
        // No action to create.
    }
}
