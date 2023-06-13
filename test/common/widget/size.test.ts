import {
    FullWidth,
    HalfQuarterWidth,
    HalfWidth,
    QuarterWidth,
    SixthWidth,
    ThirdWidth,
    ThreeQuartersWidth,
    TwoThirdsWidth,
    recommendedWidgetWidth,
} from "../../../lib";

test("widget width recommendation", () => {
    // edge case
    expect(recommendedWidgetWidth(-1)).toStrictEqual(FullWidth);
    expect(recommendedWidgetWidth(0)).toStrictEqual(FullWidth);
    // typical cases
    expect(recommendedWidgetWidth(1)).toStrictEqual(FullWidth);
    expect(recommendedWidgetWidth(2)).toStrictEqual(HalfWidth);
    expect(recommendedWidgetWidth(3)).toStrictEqual(ThirdWidth);
    expect(recommendedWidgetWidth(4)).toStrictEqual(QuarterWidth);
    expect(recommendedWidgetWidth(5)).toStrictEqual(ThirdWidth);
    expect(recommendedWidgetWidth(6)).toStrictEqual(ThirdWidth);
    expect(recommendedWidgetWidth(7)).toStrictEqual(QuarterWidth);
    expect(recommendedWidgetWidth(8)).toStrictEqual(QuarterWidth);
    expect(recommendedWidgetWidth(9)).toStrictEqual(ThirdWidth);
    expect(recommendedWidgetWidth(10)).toStrictEqual(QuarterWidth);
    expect(recommendedWidgetWidth(11)).toStrictEqual(QuarterWidth);
    expect(recommendedWidgetWidth(12)).toStrictEqual(QuarterWidth);
    // extreme cases
    expect(recommendedWidgetWidth(100)).toStrictEqual(QuarterWidth);
    expect(recommendedWidgetWidth(1000)).toStrictEqual(QuarterWidth);
    expect(recommendedWidgetWidth(1001)).toStrictEqual(QuarterWidth);
    expect(recommendedWidgetWidth(1002)).toStrictEqual(QuarterWidth);
    expect(recommendedWidgetWidth(1003)).toStrictEqual(QuarterWidth);
    expect(recommendedWidgetWidth(1004)).toStrictEqual(QuarterWidth);
});

test("widget widths add up as their name promises", () => {
    expect(6 * SixthWidth).toStrictEqual(FullWidth);
    expect(4 * QuarterWidth).toStrictEqual(FullWidth);
    expect(3 * ThirdWidth).toStrictEqual(FullWidth);
    expect(2 * HalfWidth).toStrictEqual(FullWidth);
    expect(ThirdWidth + TwoThirdsWidth).toStrictEqual(FullWidth);
    expect(QuarterWidth + ThreeQuartersWidth).toStrictEqual(FullWidth);
    expect(2 * HalfQuarterWidth).toStrictEqual(QuarterWidth);
});
