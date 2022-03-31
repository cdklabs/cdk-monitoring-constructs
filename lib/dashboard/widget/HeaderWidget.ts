import { TextWidget } from "aws-cdk-lib/aws-cloudwatch";

import { FullWidth } from "../../common/widget";

export enum HeaderLevel {
  LARGE,
  MEDIUM,
  SMALL,
}

export class HeaderWidget extends TextWidget {
  constructor(text: string, level?: HeaderLevel) {
    super({
      width: FullWidth,
      height: 1,
      markdown: HeaderWidget.toMarkdown(text, level ?? HeaderLevel.LARGE),
    });
  }

  private static toMarkdown(text: string, level: HeaderLevel) {
    return "#".repeat(level + 1) + " " + text;
  }
}
