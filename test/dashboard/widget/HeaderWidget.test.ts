import {HeaderLevel, HeaderWidget} from "../../../lib/dashboard/widget";

test("snapshot test - title only", () => {
    const widget = new HeaderWidget("text");

    expect(widget.toJson()).toMatchSnapshot();
});

test("snapshot test - title and description, no custom height", () => {
    const widget = new HeaderWidget("text", HeaderLevel.LARGE, "description");

    expect(widget.toJson()).toMatchSnapshot();
});

test("snapshot test - title and description, with custom height", () => {
    const widget = new HeaderWidget("text", HeaderLevel.LARGE, "very long description", 5);

    expect(widget.toJson()).toMatchSnapshot();
});
