import { KeyValueTableWidgetV2 } from "./KeyValueTableWidgetV2";

/**
 * @deprecated Use {@link KeyValueTableWidgetV2} instead.
 */
export class KeyValueTableWidget extends KeyValueTableWidgetV2 {
  constructor(data: [string, string][]) {
    super(data.map(([key, value]) => ({ key, value })));
  }
}
