import {KeyValueTableWidget} from "../../../lib/dashboard/widget";

test("snapshot test", () => {
    const data: [string, string][] = [
        ["name", "John Wick"],
        ["has", "a dog"],
    ];
    const widget = new KeyValueTableWidget(data);

    expect(widget.toJson()).toMatchSnapshot();
});
