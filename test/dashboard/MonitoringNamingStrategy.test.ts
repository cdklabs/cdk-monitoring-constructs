import { CfnWaitCondition, Stack } from "aws-cdk-lib";
import { AttributeType, CfnTable, Table } from "aws-cdk-lib/aws-dynamodb";

import { MonitoringNamingStrategy } from "../../lib/dashboard/MonitoringNamingStrategy";

test("empty string is not alarm friendly", () => {
  expect(MonitoringNamingStrategy.isAlarmFriendly("")).toBeFalsy();
});

test("string with spaces is not alarm friendly", () => {
  expect(
    MonitoringNamingStrategy.isAlarmFriendly("This is not valid")
  ).toBeFalsy();
});

test("string with comma is not alarm friendly", () => {
  expect(
    MonitoringNamingStrategy.isAlarmFriendly("This,Is,Not,Friendly")
  ).toBeFalsy();
});

test("this string is alarm friendly", () => {
  expect(
    MonitoringNamingStrategy.isAlarmFriendly("This_is__Valid-Alarm-Name")
  ).toBeTruthy();
});

test("for empty naming strategy, all outputs are undefined", () => {
  const namingStrategy = new MonitoringNamingStrategy({});

  const stack = new Stack();

  expect(() =>
    stack.resolve(namingStrategy.resolveHumanReadableName())
  ).toThrowError(
    "Resolution error: Insufficient information provided for naming the alarms and/or monitoring section: " +
      "Please provide alarmFriendlyName, humanReadableName, or namedConstruct as a fallback."
  );
  expect(() =>
    stack.resolve(namingStrategy.resolveAlarmFriendlyName())
  ).toThrowError(
    "Insufficient information provided for naming the alarms and/or monitoring section: " +
      "Please provide alarmFriendlyName, humanReadableName, or namedConstruct as a fallback"
  );
});

test("fallback name only (alarm friendly)", () => {
  const namingStrategy = new MonitoringNamingStrategy({
    fallbackConstructName: "FallbackName_AlarmFriendly",
  });

  const stack = new Stack();

  expect(stack.resolve(namingStrategy.resolveHumanReadableName())).toEqual(
    "FallbackName_AlarmFriendly"
  );
  expect(stack.resolve(namingStrategy.resolveAlarmFriendlyName())).toEqual(
    "FallbackName_AlarmFriendly"
  );
});

test("fallback name only (not alarm friendly)", () => {
  const namingStrategy = new MonitoringNamingStrategy({
    fallbackConstructName: "--- not friendly ---",
  });

  const stack = new Stack();

  expect(stack.resolve(namingStrategy.resolveHumanReadableName())).toEqual(
    "--- not friendly ---"
  );
  expect(() =>
    stack.resolve(namingStrategy.resolveAlarmFriendlyName())
  ).toThrowError(
    "Insufficient information provided for naming the alarms and/or monitoring section: " +
      "Please provide alarmFriendlyName, humanReadableName, or namedConstruct as a fallback"
  );
});

test("fallback to construct (alarm friendly ID)", () => {
  const namingStrategy = new MonitoringNamingStrategy({
    namedConstruct: new CfnWaitCondition(new Stack(), "DummyConstructId"),
  });

  const stack = new Stack();

  expect(stack.resolve(namingStrategy.resolveHumanReadableName())).toEqual(
    "DummyConstructId"
  );
  expect(stack.resolve(namingStrategy.resolveAlarmFriendlyName())).toEqual(
    "DummyConstructId"
  );
});

test("fallback to construct (not alarm friendly ID)", () => {
  const namingStrategy = new MonitoringNamingStrategy({
    namedConstruct: new CfnWaitCondition(new Stack(), "Not Alarm Friendly!!!"),
  });

  const stack = new Stack();

  expect(stack.resolve(namingStrategy.resolveHumanReadableName())).toEqual(
    "Not Alarm Friendly!!!"
  );
  expect(() =>
    stack.resolve(namingStrategy.resolveAlarmFriendlyName())
  ).toThrowError(
    "Insufficient information provided for naming the alarms and/or monitoring section: " +
      "Please provide alarmFriendlyName, humanReadableName, or namedConstruct as a fallback"
  );
});

test("should use node ID for non-named DDB", () => {
  const stack = new Stack();

  const namingStrategy = new MonitoringNamingStrategy({
    namedConstruct: new Table(stack, "TableId", {
      partitionKey: { type: AttributeType.STRING, name: "id" },
    }),
  });

  expect(stack.resolve(namingStrategy.resolveHumanReadableName())).toEqual(
    "TableId"
  );
  expect(stack.resolve(namingStrategy.resolveAlarmFriendlyName())).toEqual(
    "TableId"
  );
});

test("should use node ID for named DDB", () => {
  const stack = new Stack();

  const namingStrategy = new MonitoringNamingStrategy({
    namedConstruct: new Table(stack, "TableId", {
      partitionKey: { type: AttributeType.STRING, name: "id" },
      tableName: "TableName",
    }),
  });

  expect(stack.resolve(namingStrategy.resolveHumanReadableName())).toEqual(
    "TableId"
  );
  expect(stack.resolve(namingStrategy.resolveAlarmFriendlyName())).toEqual(
    "TableId"
  );
});

test("should use table name for named DDB when defined as fallback", () => {
  const stack = new Stack();

  const table = new Table(stack, "TableId", {
    partitionKey: { type: AttributeType.STRING, name: "id" },
    tableName: "TableName",
  });

  const namingStrategy = new MonitoringNamingStrategy({
    namedConstruct: table,
    fallbackConstructName: (table.node.defaultChild as CfnTable)?.tableName,
  });

  expect(stack.resolve(namingStrategy.resolveHumanReadableName())).toEqual(
    "TableName"
  );
  expect(stack.resolve(namingStrategy.resolveAlarmFriendlyName())).toEqual(
    "TableName"
  );
});
