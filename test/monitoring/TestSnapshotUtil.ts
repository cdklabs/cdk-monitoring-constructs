/**
 * Executes a snapshot test for widgets, summary widgets and alarm widgets.
 * @param monitoring monitoring to test
 */
import { Monitoring } from "../../lib";

export function expectWidgetsToMatchSnapshot(monitoring: Monitoring) {
  monitoring
    .summaryWidgets()
    .forEach((widget) => expect(widget.toJson()).toMatchSnapshot());
  monitoring
    .alarmWidgets()
    .forEach((widget) => expect(widget.toJson()).toMatchSnapshot());
  monitoring
    .widgets()
    .forEach((widget) => expect(widget.toJson()).toMatchSnapshot());
}
