import {
  KeyValueTableWidget,
  KeyValueTableWidgetV2,
  KeyValue,
} from "../../../lib/dashboard/widget";

test("snapshot test", () => {
  const data: KeyValue[] = [
    { key: "name", value: "John Wick" },
    { key: "has", value: "a dog" },
  ];
  const widget = new KeyValueTableWidget(data);
  const widgetV2 = new KeyValueTableWidgetV2(data);

  expect(widget.toJson()).toMatchSnapshot();
  expect(widget.toJson()).toEqual(widgetV2.toJson());
});

test("snapshot test with deprecated constructor", () => {
  const data: [string, string][] = [
    ["name", "John Wick"],
    ["has", "a dog"],
  ];
  const widget = new KeyValueTableWidget(data);
  const widgetV2 = new KeyValueTableWidgetV2(data);

  expect(widget.toJson()).toMatchSnapshot();
  expect(widget.toJson()).toEqual(widgetV2.toJson());
});
