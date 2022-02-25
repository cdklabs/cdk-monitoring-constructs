import { HeaderLevel, HeaderWidget } from "./HeaderWidget";

export interface MonitoringHeaderWidgetProps {
  readonly title: string;
  readonly family?: string;
  readonly goToLinkUrl?: string;
}

export class MonitoringHeaderWidget extends HeaderWidget {
  constructor(props: MonitoringHeaderWidgetProps) {
    super(MonitoringHeaderWidget.getText(props), HeaderLevel.SMALL);
  }

  private static getText(props: MonitoringHeaderWidgetProps): string {
    let title = props.title;

    if (props.goToLinkUrl) {
      title = `[${title}](${props.goToLinkUrl})`;
    }

    if (props.family) {
      return `${props.family} **${title}**`;
    }

    return title;
  }
}
