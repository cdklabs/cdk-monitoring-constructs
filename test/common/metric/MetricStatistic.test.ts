import { MetricStatistic } from "../../../lib/common/metric";

describe("MetricStatistic", () => {
  describe("TrimmedSum (TS) basic statistics", () => {
    test.each([
      ["TS50", "ts50"],
      ["TS70", "ts70"],
      ["TS90", "ts90"],
      ["TS95", "ts95"],
      ["TS99", "ts99"],
      ["TS999", "ts99.9"],
      ["TS9999", "ts99.99"],
    ])("%s should have value %s", (key, expectedValue) => {
      expect(MetricStatistic[key as keyof typeof MetricStatistic]).toEqual(
        expectedValue,
      );
    });
  });

  describe("TrimmedSum (TS) bidirectional statistics", () => {
    test.each([
      ["TS99_BOTH", "TS(1%:99%)"],
      ["TS95_BOTH", "TS(5%:95%)"],
      ["TS90_BOTH", "TS(10%:90%)"],
      ["TS85_BOTH", "TS(15%:85%)"],
      ["TS80_BOTH", "TS(20%:80%)"],
      ["TS75_BOTH", "TS(25%:75%)"],
      ["TS70_BOTH", "TS(30%:70%)"],
    ])("%s should have value %s", (key, expectedValue) => {
      expect(MetricStatistic[key as keyof typeof MetricStatistic]).toEqual(
        expectedValue,
      );
    });
  });

  describe("TrimmedSum (TS) top-range statistics", () => {
    test.each([
      ["TS95_TOP", "TS(95%:100%)"],
      ["TS99_TOP", "TS(99%:100%)"],
      ["TS999_TOP", "TS(99.9%:100%)"],
      ["TS9999_TOP", "TS(99.99%:100%)"],
    ])("%s should have value %s", (key, expectedValue) => {
      expect(MetricStatistic[key as keyof typeof MetricStatistic]).toEqual(
        expectedValue,
      );
    });
  });

  describe("TrimmedSum statistics follow same pattern as TrimmedMean", () => {
    test("TS basic stats use lowercase shorthand like TM basic stats", () => {
      expect(MetricStatistic.TM90).toEqual("tm90");
      expect(MetricStatistic.TS90).toEqual("ts90");
    });

    test("TS _BOTH stats use uppercase range syntax like TM _BOTH stats", () => {
      expect(MetricStatistic.TM95_BOTH).toEqual("TM(5%:95%)");
      expect(MetricStatistic.TS95_BOTH).toEqual("TS(5%:95%)");
    });

    test("TS _TOP stats use uppercase range syntax like TM _TOP stats", () => {
      expect(MetricStatistic.TM99_TOP).toEqual("TM(99%:100%)");
      expect(MetricStatistic.TS99_TOP).toEqual("TS(99%:100%)");
    });
  });
});
