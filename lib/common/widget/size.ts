export const FullWidth = 24;
export const HalfWidth = FullWidth / 2;
export const ThirdWidth = FullWidth / 3;
export const QuarterWidth = FullWidth / 4;
export const HalfQuarterWidth = QuarterWidth / 2;
export const SixthWidth = FullWidth / 6;
export const TwoThirdsWidth = 2 * ThirdWidth;
export const ThreeQuartersWidth = 3 * QuarterWidth;

// Widget Heights

export const DefaultGraphWidgetHeight = 5;
export const DefaultTwoLinerGraphWidgetHeight = 6;
export const DefaultTwoLinerGraphWidgetHalfHeight = 3;
export const DefaultSummaryWidgetHeight = 6;
export const DefaultAlarmWidgetWidth = 6;
export const DefaultAlarmWidgetHeight = 4;
export const DefaultLogWidgetHeight = 7;

/**
 * Suggests the best widget width, given the total number of widgets.
 * The main point is to make widgets as wide as possible, while saving vertical space and minimizing number of gaps.
 *
 * @param numTotalWidgets total number of widgets to be placed
 */
export function recommendedWidgetWidth(numTotalWidgets: number) {
  function numRowsTaken(numItems: number, itemSize: number) {
    return Math.ceil((numItems * itemSize) / FullWidth);
  }

  const numItemsFixed = Math.max(1, numTotalWidgets);
  const widths = [QuarterWidth, ThirdWidth, HalfWidth, FullWidth];
  let i = 0;
  while (
    i < widths.length - 1 &&
    numRowsTaken(numItemsFixed, widths[i + 1]) ===
      numRowsTaken(numItemsFixed, widths[i])
  ) {
    i++;
  }
  return widths[i];
}
