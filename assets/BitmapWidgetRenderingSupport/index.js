const aws = require('aws-sdk');

const DOCS = `
          ## Display a CloudWatch bitmap graph
          Displays CloudWatch metrics as a bitmap, for faster display of metrics.

          ### Widget parameters
          Param | Description
          ---|---
          **graph** | The graph definition. Use the parameters from the **Source** tab in CloudWatch Console's **Metrics** page.
          **useMonitorPortal** (default = true) | Flag indicating whether we want to use MonitorPortal to render the graph. False will switch to CloudWatch API.

          ### Example parameters
          \`\`\` yaml
          useMonitorPortal: boolean
          graph:
            view: timeSeries
            metrics:
            - [ AWS/Lambda, Invocations ]
            region: ${process.env.AWS_REGION}
          \`\`\`
          `;

exports.handler = async (event) => {
    async function renderUsingCloudWatch(graph, width, height) {
        const params = {MetricWidget: JSON.stringify(graph)};
        const region = graph.region;
        const customBackoff = (retryCount) => {
            // Keep retrying with a random delay, long enough to overcome throttling from CW
            const delay = 300 + Math.floor(Math.random() * 500);
            console.log(`retry number ${retryCount} with a delay of ${delay} ms`);
            return delay;
        }
        const clientOptions = {
            region,
            // Keep retrying until the Lambda times out
            maxRetries: 99,
            retryDelayOptions: {customBackoff},
            httpOptions: {
                connectTimeout: 3 * 1000,
                timeout: 3 * 1000,
            },
        };
        const cloudwatch = new aws.CloudWatch(clientOptions);
        const image = await cloudwatch.getMetricWidgetImage(params).promise();
        const base64Image = Buffer.from(image.MetricWidgetImage).toString('base64');
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
