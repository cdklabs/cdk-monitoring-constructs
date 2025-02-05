import { KeyValueTableWidgetV2, KeyValue } from "../../../lib/dashboard/widget";

test("snapshot test", () => {
  const data: KeyValue[] = [
    { key: "name", value: "John Wick" },
    { key: "has", value: "a dog" },
  ];
  const widget = new KeyValueTableWidgetV2(data);

  expect(widget.toJson()).toMatchSnapshot();
});
