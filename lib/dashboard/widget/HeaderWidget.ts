import {TextWidget} from "aws-cdk-lib/aws-cloudwatch";

import {FullWidth} from "../../common/widget";

export enum HeaderLevel {
    LARGE,
    MEDIUM,
    SMALL,
}

export class HeaderWidget extends TextWidget {
    constructor(text: string, level?: HeaderLevel, description?: string, descriptionHeight?: number) {
        super({
            width: FullWidth,
            height: HeaderWidget.calculateHeight(description, descriptionHeight),
            markdown: HeaderWidget.toMarkdown(text, level ?? HeaderLevel.LARGE, description),
        });
    }

    private static calculateHeight(description?: string, descriptionHeight?: number) {
        let result = 1;
        if (description) {
            result += descriptionHeight ?? 1;
        }
        return result;
    }

    private static toMarkdown(text: string, level: HeaderLevel, description?: string) {
        const parts = [this.toHeaderMarkdown(text, level)];
        if (description) {
            parts.push(description);
        }
        return parts.join("\n\n");
    }

    private static toHeaderMarkdown(text: string, level: HeaderLevel) {
        return "#".repeat(level + 1) + " " + text;
    }
}
