import { YAxisProps } from "aws-cdk-lib/aws-cloudwatch";

/**
 * Y-Axis showing percentage, ranged from 0.
 */
export const PercentageAxisFromZero: YAxisProps = {
  min: 0,
  label: "%",
  showUnits: false,
};

/**
 * Y-Axis showing percentage, ranged from 0 to 100.
 */
export const PercentageAxisFromZeroToHundred: YAxisProps = {
  min: 0,
  max: 100,
  label: "%",
  showUnits: false,
};

/**
 * Y-Axis showing time in milliseconds, ranged from 0.
 */
export const TimeAxisMillisFromZero: YAxisProps = {
  min: 0,
  label: "ms",
  showUnits: false,
};

/**
 * Y-Axis showing time in seconds, ranged from 0.
 */
export const TimeAxisSecondsFromZero: YAxisProps = {
  min: 0,
  label: "sec",
  showUnits: false,
};

/**
 * Y-Axis showing time in minutes, ranged from 0.
 */
export const TimeAxisMinutesFromZero: YAxisProps = {
  min: 0,
  label: "min",
  showUnits: false,
};

/**
 * Y-Axis showing count, ranged from 0.
 */
export const CountAxisFromZero: YAxisProps = {
  min: 0,
  label: "Count",
  showUnits: false,
};

/**
 * Y-Axis showing count, ranged from 1.
 */
export const CountAxisFromOne: YAxisProps = {
  min: 1,
  label: "Count",
  showUnits: false,
};

/**
 * Y-Axis showing boolean, ranged from 0 to 1, where 1 means TRUE.
 */
export const BooleanAxisFromZeroToOne: YAxisProps = {
  min: 0,
  max: 1,
  label: "1 = True",
  showUnits: false,
};

/**
 * Y-Axis showing rate (relative count), ranged from 0.
 */
export const RateAxisFromZero: YAxisProps = {
  min: 0,
  label: "Rate",
  showUnits: false,
};

/**
 * Y-Axis showing rate (relative count), ranged from 0 to 1.
 */
export const RateAxisFromZeroToOne: YAxisProps = {
  min: 0,
  max: 1,
  label: "Rate",
  showUnits: false,
};

/**
 * Y-Axis showing size in bytes, ranged from 0.
 */
export const SizeAxisBytesFromZero: YAxisProps = {
  min: 0,
  label: "bytes",
  showUnits: false,
};

/**
 * Y-Axis showing size in kilobytes, ranged from 0.
 */
export const SizeAxisKiloBytesFromZero: YAxisProps = {
  min: 0,
  label: "kB",
  showUnits: false,
};

/**
 * Y-Axis showing size in megabytes, ranged from 0.
 */
export const SizeAxisMegaBytesFromZero: YAxisProps = {
  min: 0,
  label: "MB",
  showUnits: false,
};

/**
 * Y-Axis showing size in gigabytes, ranged from 0.
 */
export const SizeAxisGigaBytesFromZero: YAxisProps = {
  min: 0,
  label: "GB",
  showUnits: false,
};

/**
 * Y-Axis showing cost in Megabyte Millisecond, ranged from 0.
 */
export const MegabyteMillisecondAxisFromZero: YAxisProps = {
  min: 0,
  label: "MB*ms",
  showUnits: false,
};

/**
 * Y-Axis showing cost in USD, ranged from 0.
 */
export const CurrencyAxisUsdFromZero: YAxisProps = {
  min: 0,
  label: "USD",
  showUnits: false,
};
