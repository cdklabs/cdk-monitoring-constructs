const { CloudWatchClient, PutMetricDataCommand } = require('@aws-sdk/client-cloudwatch');
const { SecretsManagerClient, DescribeSecretCommand } = require('@aws-sdk/client-secrets-manager');

const region = process.env.AWS_REGION;
const millisPerDay = 1000 * 60 * 60 * 24;

const clientOptions = {
    signingRegion: region,
    retryMode: 'standard',
};

const cloudwatchClient = new CloudWatchClient(clientOptions);
const secretsManagerClient = new SecretsManagerClient(clientOptions);

function daysSince(date, now = Date.now()) {
    const millis = now - date.getTime();
    const days = millis / millisPerDay;
    return Math.floor(days);
}

exports.handler = async (event, context) => {
    console.info(`Retrieving secret for event ${JSON.stringify(event)}`);
    console.debug(`context: ${JSON.stringify(context)}`);

    const secret = await secretsManagerClient.send(
        new DescribeSecretCommand({
            SecretId: event.secretId,
        })
    );

    console.debug(`Found secret: ${JSON.stringify(secret)}`);
    if (!secret.Name || !secret.CreatedDate) {
        throw new Error("Invalid secret response");
    }

    // use retrieved secret name in case secretId was an arn
    const secretName = secret.Name;
    const lastChangedDate = secret.LastChangedDate ?? secret.CreatedDate;
    const lastRotatedDate = secret.LastRotatedDate ?? secret.CreatedDate;
    const now = Date.now();

    const params = {
        Namespace: "SecretsManager",
        MetricData: [
            {
                MetricName: "DaysSinceLastChange",
                Dimensions: [
                    {
                        Name: "SecretName",
                        Value: secretName,
                    },
                ],
                Unit: "Count",
                Value: daysSince(lastChangedDate, now),
            },
            {
                MetricName: "DaysSinceLastRotation",
                Dimensions: [
                    {
                        Name: "SecretName",
                        Value: secretName,
                    },
                ],
                Unit: "Count",
                Value: daysSince(lastRotatedDate, now),
            },
        ],
    };
    console.debug(`putMetricData params: ${JSON.stringify(params)}`);
    console.info(`Publishing metrics for secret "${event.secretId}"`);
    const command = new PutMetricDataCommand(params);
    await cloudwatchClient.send(command);

    return Promise.resolve();
};
