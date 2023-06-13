/**
 * Strategy used to finalize dedupe string.
 */
export interface IAlarmDedupeStringProcessor {
    /**
     * Process the dedupe string which was specified by the user as an override.
     *
     * @param dedupeString
     * @return final dedupe string
     */
    processDedupeStringOverride(dedupeString: string): string;

    /**
     * Process the dedupe string which was auto-generated.
     *
     * @param dedupeString
     * @return final dedupe string
     */
    processDedupeString(dedupeString: string): string;
}

/**
 * Dedupe string processor that adds prefix and/or suffix to the dedupe string.
 */
export class ExtendDedupeString implements IAlarmDedupeStringProcessor {
    private readonly prefix: string;
    private readonly suffix: string;

    constructor(prefix?: string, suffix?: string) {
        this.prefix = prefix ?? "";
        this.suffix = suffix ?? "";
    }

    processDedupeString(dedupeString: string): string {
        return this.prefix + dedupeString + this.suffix;
    }

    processDedupeStringOverride(dedupeString: string): string {
        return this.prefix + dedupeString + this.suffix;
    }
}

/**
 * Default dedupe strategy - does not add any prefix nor suffix.
 */
export class DoNotModifyDedupeString extends ExtendDedupeString {
    // default constructor = no prefix, no suffix
}
