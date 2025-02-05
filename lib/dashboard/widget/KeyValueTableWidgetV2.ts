import { TextWidget } from "aws-cdk-lib/aws-cloudwatch";

import { FullWidth } from "../../common/widget";

export interface KeyValue {
  readonly key: string;
  readonly value: string;
}

export class KeyValueTableWidgetV2 extends TextWidget {
  constructor(data: KeyValue[]) {
    super({
      width: FullWidth,
      height: 3,
      markdown: KeyValueTableWidgetV2.toMarkdown(data),
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
