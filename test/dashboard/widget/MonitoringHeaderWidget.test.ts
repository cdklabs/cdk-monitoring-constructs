import { MonitoringHeaderWidget } from "../../../lib/dashboard/widget/MonitoringHeaderWidget";

test("snapshot test: title only", () => {
  const widget = new MonitoringHeaderWidget({
    title: "DummyTitle",
  });

  expect(widget.toJson()).toMatchSnapshot();
});

test("snapshot test: title and family", () => {
  const widget = new MonitoringHeaderWidget({
    title: "DummyTitle",
    family: "DummyFamily",
  });

  expect(widget.toJson()).toMatchSnapshot();
});

test("snapshot test: with link", () => {
  const widget = new MonitoringHeaderWidget({
    title: "DummyTitle",
    family: "DummyFamily",
    goToLinkUrl: "http://amazon.com",
  });

  expect(widget.toJson()).toMatchSnapshot();
});

test("snapshot test: with link and custom text", () => {
  const widget = new MonitoringHeaderWidget({
    title: "DummyTitle",
    family: "DummyFamily",
    goToLinkUrl: "http://amazon.com",
  });

  expect(widget.toJson()).toMatchSnapshot();
});
