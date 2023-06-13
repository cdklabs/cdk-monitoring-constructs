import {
  ComparisonOperator,
  TreatMissingData,
} from "aws-cdk-lib/aws-cloudwatch";

import {
  AddAlarmProps,
  AlarmNamingStrategy,
  IAlarmDedupeStringProcessor,
} from "../../../lib";

const DummyTicketingAlarmProps: AddAlarmProps = {
  alarmNameSuffix: "CustomAlarmSuffix",
  alarmDescription: "This is a testing alarm.",
  threshold: 42,
  treatMissingData: TreatMissingData.BREACHING,
  comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD,
};

const DummyTicketingAlarmPropsWithDedupe: AddAlarmProps = {
  ...DummyTicketingAlarmProps,
  alarmDedupeStringSuffix: "TestingDedupe",
};

const DummyTicketingAlarmPropsWithDedupeAndDisambiguator: AddAlarmProps = {
  ...DummyTicketingAlarmPropsWithDedupe,
  alarmDedupeStringSuffix: "TestingDedupe",
  disambiguator: "TestingDisambiguator",
};

const DummyTicketingAlarmPropsWithDedupeOverride: AddAlarmProps = {
  ...DummyTicketingAlarmProps,
  dedupeStringOverride: "DedupeOverride",
};

const DummyTicketingAlarmPropsWithDedupeOverrideAndDisambiguator: AddAlarmProps =
  {
    ...DummyTicketingAlarmProps,
    dedupeStringOverride: "DedupeOverride",
    disambiguator: "TestingDisambiguator",
  };

const DummyTicketingAlarmPropsWithNameOverride: AddAlarmProps = {
  ...DummyTicketingAlarmProps,
  alarmNameOverride: "AlarmNameOverride",
};

test("no dedupe: getName returns expected value", () => {
  expect(
    new AlarmNamingStrategy("first", "second").getName(DummyTicketingAlarmProps)
  ).toBe("first-second-CustomAlarmSuffix");
});

test("no dedupe: getDedupeString returns undefined", () => {
  expect(
    new AlarmNamingStrategy("first", "second").getDedupeString(
      DummyTicketingAlarmProps
    )
  ).toBeUndefined();
});

test("no dedupe: getWidgetLabel returns expected value", () => {
  expect(
    new AlarmNamingStrategy("first", "second").getWidgetLabel(
      DummyTicketingAlarmProps
    )
  ).toBe("second CustomAlarmSuffix");
});

test("dedupe: getName returns expected value", () => {
  expect(
    new AlarmNamingStrategy("first", "second").getName(
      DummyTicketingAlarmPropsWithDedupe
    )
  ).toBe("first-second-CustomAlarmSuffix");
});

test("dedupe: getDedupeString returns expected value", () => {
  expect(
    new AlarmNamingStrategy("first", "second").getDedupeString(
      DummyTicketingAlarmPropsWithDedupe
    )
  ).toBe("first-second-TestingDedupe");
});

test("dedupe: getWidgetLabel returns expected value", () => {
  expect(
    new AlarmNamingStrategy("first", "second").getWidgetLabel(
      DummyTicketingAlarmPropsWithDedupe
    )
  ).toBe("second CustomAlarmSuffix");
});

test("dedupe: getDedupeString returns expected value with override", () => {
  expect(
    new AlarmNamingStrategy("first", "second").getDedupeString(
      DummyTicketingAlarmPropsWithDedupeOverride
    )
  ).toBe("DedupeOverride");
});

test("dedupe: getDedupeString returns expected value with override and disambiguator", () => {
  expect(
    new AlarmNamingStrategy("first", "second").getDedupeString(
      DummyTicketingAlarmPropsWithDedupeOverrideAndDisambiguator
    )
  ).toBe("DedupeOverride");
});

test("dedupe and disambiguator: getName returns expected value", () => {
  expect(
    new AlarmNamingStrategy("first", "second").getName(
      DummyTicketingAlarmPropsWithDedupeAndDisambiguator
    )
  ).toBe("first-second-CustomAlarmSuffix-TestingDisambiguator");
});

test("alarm name override: getName returns expected value", () => {
  expect(
    new AlarmNamingStrategy("first", "second").getName(
      DummyTicketingAlarmPropsWithNameOverride
    )
  ).toBe("AlarmNameOverride");
});

test("dedupe and disambiguator: getDedupeString returns expected value", () => {
  expect(
    new AlarmNamingStrategy("first", "second").getDedupeString(
      DummyTicketingAlarmPropsWithDedupeAndDisambiguator
    )
  ).toBe("first-second-TestingDedupe");
});

test("dedupe and disambiguator: getWidgetLabel returns expected value", () => {
  expect(
    new AlarmNamingStrategy("first", "second").getWidgetLabel(
      DummyTicketingAlarmPropsWithDedupeAndDisambiguator
    )
  ).toBe("second CustomAlarmSuffix TestingDisambiguator");
});

test("dedupe string gets processed: override", () => {
  class CustomStrategy implements IAlarmDedupeStringProcessor {
    processDedupeString(dedupeString: string): string {
      return "processed: " + dedupeString;
    }

    processDedupeStringOverride(dedupeString: string): string {
      return "processed as override: " + dedupeString;
    }
  }

  expect(
    new AlarmNamingStrategy(
      "first",
      "second",
      new CustomStrategy()
    ).getDedupeString({
      alarmNameSuffix: "FirstAlarm",
      alarmDedupeStringSuffix: "First",
    })
  ).toBe("processed: first-second-First");

  expect(
    new AlarmNamingStrategy(
      "first",
      "second",
      new CustomStrategy()
    ).getDedupeString({
      alarmNameSuffix: "SecondAlarm",
      alarmDedupeStringSuffix: "Second",
      dedupeStringOverride: "Dedupe",
    })
  ).toBe("processed as override: Dedupe");
});
