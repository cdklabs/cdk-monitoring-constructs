/**
 * Enumeration of different rate computation methods.
 */
export enum RateComputationMethod {
    /**
     * Number of occurrences relative to requests.
     * Less sensitive than per-second when TPS > 1.
     */
    AVERAGE,
    /**
     * Number of occurrences per second.
     * More sensitive than average when TPS > 1.
     */
    PER_SECOND,
    /**
     * Number of occurrences per minute.
     */
    PER_MINUTE,
    /**
     * Number of occurrences per hour.
     */
    PER_HOUR,
    /**
     * Number of occurrences per day.
     */
    PER_DAY,
}
