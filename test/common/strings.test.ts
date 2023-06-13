import {capitalizeFirstLetter, capitalizeFirstLetterOnly, getHashForMetricExpressionId, removeBracketsWithDynamicLabels} from "../../lib";

test("capitalize first letter", () => {
    expect(capitalizeFirstLetter("")).toStrictEqual("");
    expect(capitalizeFirstLetter("a")).toStrictEqual("A");
    expect(capitalizeFirstLetter("aa")).toStrictEqual("Aa");
    expect(capitalizeFirstLetter("Aa")).toStrictEqual("Aa");
    expect(capitalizeFirstLetter("AA")).toStrictEqual("AA");
});

test("capitalize first letter only", () => {
    expect(capitalizeFirstLetterOnly("")).toStrictEqual("");
    expect(capitalizeFirstLetterOnly("a")).toStrictEqual("A");
    expect(capitalizeFirstLetterOnly("aa")).toStrictEqual("Aa");
    expect(capitalizeFirstLetterOnly("Aa")).toStrictEqual("Aa");
    expect(capitalizeFirstLetterOnly("AA")).toStrictEqual("Aa");
});

test("removeBracketsWithDynamicLabels: empty string", () => {
    expect(removeBracketsWithDynamicLabels("")).toEqual("");
});

test("removeBracketsWithDynamicLabels: plain string", () => {
    expect(removeBracketsWithDynamicLabels("abc")).toEqual("abc");
});

test("removeBracketsWithDynamicLabels: plain string with brackets (no placeholders)", () => {
    expect(removeBracketsWithDynamicLabels("a (b) c")).toEqual("a (b) c");
});

test("removeBracketsWithDynamicLabels: string with single removal", () => {
    expect(removeBracketsWithDynamicLabels("a (b: ${c}) d")).toEqual("a d");
});

test("removeBracketsWithDynamicLabels: string with multiple removals", () => {
    expect(removeBracketsWithDynamicLabels("a (b: ${c}) (d: ${e}) f")).toEqual("a f");
});

test("getMetricExpressionIdUsingHash: empty string", () => {
    expect(getHashForMetricExpressionId("")).toStrictEqual("f56f10af2d6c9");
});

test("getMetricExpressionIdUsingHash: plain string", () => {
    expect(getHashForMetricExpressionId("Hello world!")).toStrictEqual("ff4e5fadf3425");
});
