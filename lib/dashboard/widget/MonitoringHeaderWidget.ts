import {HeaderLevel, HeaderWidget} from "./HeaderWidget";

export interface MonitoringHeaderWidgetProps {
    readonly title: string;
    readonly family?: string;
    readonly goToLinkUrl?: string;
    readonly description?: string;
    readonly descriptionHeight?: number;
}

export class MonitoringHeaderWidget extends HeaderWidget {
    constructor(props: MonitoringHeaderWidgetProps) {
        super(MonitoringHeaderWidget.getText(props), HeaderLevel.SMALL, props.description, props.descriptionHeight);
    }

    private static getText(props: MonitoringHeaderWidgetProps): string {
        let title = props.title;

        if (props.goToLinkUrl) {
            title = `[${title}](${props.goToLinkUrl})`;
        }

        if (props.family) {
            title = `${props.family} **${title}**`;
        }

        return title;
    }
}
