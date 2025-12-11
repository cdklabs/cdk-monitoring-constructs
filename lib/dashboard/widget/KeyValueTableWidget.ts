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
  constructor(data: KeyValue[]);

  /**
   * Creates a key-value table widget.
   * @param data An array of key-value pairs as tuples
   *
   * @deprecated Use the KeyValue[] constructor instead. This tuple format is not compatible with JSII 5.x and will be removed in the next major version.
   */
  constructor(data: [string, string][]);

  constructor(data: KeyValue[] | [string, string][]) {
    const normalizedData = KeyValueTableWidget.normalizeData(data);
    super({
      width: FullWidth,
      height: 3,
      markdown: KeyValueTableWidget.toMarkdown(normalizedData),
    });
  }

  private static normalizeData(
    data: KeyValue[] | [string, string][],
  ): KeyValue[] {
    if (data.length === 0) {
      return [];
    }

    // Check if it's a tuple array by inspecting the first element
    if (Array.isArray(data[0])) {
      return (data as [string, string][]).map(([key, value]) => ({
        key,
        value,
      }));
    }

    return data as KeyValue[];
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
