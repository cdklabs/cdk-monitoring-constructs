import { KeyValueTableWidgetV2 } from "./KeyValueTableWidgetV2";

/**
 * @deprecated Use {@link KeyValueTableWidgetV2} instead.
 *
 * This class is not compatable with JSII@5.x.
 */
export class KeyValueTableWidget extends KeyValueTableWidgetV2 {
  constructor(data: [string, string][]) {
    super(data.map(([key, value]) => ({ key, value })));
  }
}
