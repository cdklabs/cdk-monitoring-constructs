const { CloudWatchClient, GetMetricWidgetImageCommand } = require('@aws-sdk/client-cloudwatch');

const DOCS = `
          ## Display a CloudWatch bitmap graph
          Displays CloudWatch metrics as a bitmap, for faster display of metrics.

          ### Widget parameters
          Param | Description
          ---|---
          **graph** | The graph definition. Use the parameters from the **Source** tab in CloudWatch Console's **Metrics** page.

          ### Example parameters
          \`\`\` yaml
          graph:
            view: timeSeries
            metrics:
            - [ AWS/Lambda, Invocations ]
            region: ${process.env.AWS_REGION}
          \`\`\`
          `;

exports.handler = async (event) => {
    async function renderUsingCloudWatch(graph, width, height) {
        const client = new CloudWatchClient({
            signingRegion: graph.region,
            retryMode: 'standard',
        });
        const command = new GetMetricWidgetImageCommand({
            MetricWidget: JSON.stringify(graph),
        });
        const response = await client.send(command);
        const base64Image = Buffer.from(response.MetricWidgetImage).toString('base64');
        return `<img width="${width}" height="${height}" loading="lazy" src="data:image/png;base64,${base64Image}"/>`;
    }

    if (event.describe) {
        return DOCS;
    }

    const widgetContext = event.widgetContext;
    const timeRange = widgetContext.timeRange.zoom || widgetContext.timeRange;
    const start = new Date(timeRange.start).toISOString();
    const end = new Date(timeRange.end).toISOString();
    const width = widgetContext.width;
    const height = widgetContext.height;
    const graph = Object.assign(event.graph, {start, end, width, height});

    return renderUsingCloudWatch(graph, width, height);
};
