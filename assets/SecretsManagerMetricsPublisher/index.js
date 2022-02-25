const aws = require("aws-sdk");

const region = process.env.AWS_REGION;
const millisPerDay = 1000 * 60 * 60 * 24;

const clientOptions = {
    region,
    maxRetries: 5,
    httpOptions: {
        connectTimeout: 3 * 1000,
        timeout: 3 * 1000,
    },
};

const cloudwatch = new aws.CloudWatch(clientOptions);
const sm = new aws.SecretsManager(clientOptions);

function daysSince(date, now = Date.now()) {
    const millis = now - date.getTime();
    const days = millis / millisPerDay;
    return Math.floor(days);
}

exports.handler = async (event, context) => {
    console.debug("event:", JSON.stringify(event));
    console.debug("context:", JSON.stringify(context));

    console.info(`retrieving secret: ${event.secretId}`);
    const secret = await sm
        .describeSecret({
            SecretId: event.secretId,
        })
        .promise();

    console.debug("found secret: ", JSON.stringify(secret));
    if (!secret.Name || !secret.CreatedDate) {
        throw new Error("invalid secret response");
    }

    // use retrieved secret name in case secretId was an arn
    const secretName = secret.Name;
    const lastChangedDate = secret.LastChangedDate ?? secret.CreatedDate;
    const lastRotatedDate = secret.LastRotatedDate ?? secret.CreatedDate;
    const now = Date.now();

    const metricData = [
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
    ];

    const params = {
        Namespace: "SecretsManager",
        MetricData: metricData,
    };

    console.debug("putMetricData params: ", JSON.stringify(params));

    console.info(`publishing metrics for secret: ${event.secretId}`);
    await cloudwatch.putMetricData(params).promise();

    return Promise.resolve();
};
