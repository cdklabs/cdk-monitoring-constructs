import { TextWidget } from "aws-cdk-lib/aws-cloudwatch";

import { FullWidth } from "../../common/widget";

export interface KeyValue {
  readonly key: string;
  readonly value: string;
}

/**
 * A widget that displays key-value pairs in a table format.
 */
export class KeyValueTableWidget extends TextWidget {
  /**
   * Creates a key-value table widget.
   * @param data An array of key-value pairs as objects
   */
  constructor(data: KeyValue[]) {
    super({
      width: FullWidth,
      height: 3,
      markdown: KeyValueTableWidget.toMarkdown(data),
    });
  }

  private static toMarkdown(data: KeyValue[]) {
    let headerRow = "";
    let subHeaderRow = "";
    let valueRow = "";

    data.forEach(({ key, value }) => {
      headerRow += "| " + key;
      subHeaderRow += "|---";
      valueRow += "| " + value;
    });

    return `${headerRow}\n${subHeaderRow}\n${valueRow}`;
  }
}
