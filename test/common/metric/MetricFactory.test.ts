import { Duration, Stack } from "aws-cdk-lib";
import { Color, Metric } from "aws-cdk-lib/aws-cloudwatch";

import {
  MetricFactory,
  MetricFactoryDefaults,
  MetricStatistic,
  RateComputationMethod,
} from "../../../lib";

const DummyColor = "#abcdef";

test("deprecated createMetric method creates equivalent metrics", () => {
  const metricFactory = new MetricFactory({
    globalDefaults: {
      namespace: "GlobalNamespace",
    },
  });

  expect(
    metricFactory.createMetric(
      "Name",
      MetricStatistic.AVERAGE,
      "Label",
      { foo: "bar" },
      "Color",
      "Namespace",
      Duration.hours(6),
      "us-west-2",
      "1234",
    ),
  ).toEqual(
    metricFactory.metric({
      metricName: "Name",
      statistic: MetricStatistic.AVERAGE,
      label: "Label",
      dimensionsMap: { foo: "bar" },
      color: "Color",
      namespace: "Namespace",
      period: Duration.hours(6),
      region: "us-west-2",
      account: "1234",
    }),
  );

  expect(metricFactory.createMetric("Name", MetricStatistic.AVERAGE)).toEqual(
    metricFactory.metric({
      metricName: "Name",
      statistic: MetricStatistic.AVERAGE,
    }),
  );
});

test("createMetric without global namespace throws an error", () => {
  const metricFactory = new MetricFactory();

  expect(() =>
    metricFactory.metric({
      metricName: "DummyMetricName-NoOptionalParams",
      statistic: MetricStatistic.P90,
    }),
  ).toThrowError();
});

describe("snapshot test: global defaults", () => {
  function testMetric(props: MetricFactoryDefaults) {
    const metricFactory = new MetricFactory({
      globalDefaults: {
        namespace: "DummyNamespace",
        ...props,
      },
    });

    const metric = metricFactory.metric({
      metricName: "DummyMetricName",
      statistic: MetricStatistic.P90,
    });
    const metricMath = metricFactory.createMetricMath(
      "DummyExpression",
      {},
      "label",
    );
    const metricSearch = metricFactory.createMetricSearch(
      "DummyQuery",
      {},
      MetricStatistic.P90,
    );
    const metricAnomalyDetection = metricFactory.createMetricAnomalyDetection(
      new Metric({
        metricName: "DummyMetric1",
        namespace: "DummyNamespace",
      }),
      2,
      "label",
    );

    expect({
      metric,
      metricMath,
      metricSearch,
      metricAnomalyDetection,
    }).toMatchSnapshot();
  }

  test("with namespace", () => {
    testMetric({
      namespace: "CustomTestNamespace",
    });
  });

  test("with period", () => {
    testMetric({
      period: Duration.minutes(15),
    });
  });

  test("with region", () => {
    testMetric({
      region: "us-west-2",
    });
  });

  test("with account", () => {
    testMetric({
      account: "123456789",
    });
  });

  test("with multiple props", () => {
    testMetric({
      namespace: "CustomTestNamespace",
      period: Duration.minutes(15),
      region: "us-west-2",
      account: "123456789",
    });
  });
});

test("snapshot test: createMetric", () => {
  const metricFactory = new MetricFactory({
    globalDefaults: {
      namespace: "DummyNamespace",
    },
  });

  const metricWithNoOptionalParams = metricFactory.metric({
    metricName: "DummyMetricName-NoOptionalParams",
    statistic: MetricStatistic.P90,
  });

  expect(metricWithNoOptionalParams).toMatchSnapshot();

  const metricWithAllOptionalParams = metricFactory.metric({
    metricName: "DummyMetricName-AllOptionalParams",
    statistic: MetricStatistic.P90,
    label: "DummyLabel",
    dimensionsMap: { DummyDimension: "DummyDimensionValue" },
    color: DummyColor,
    namespace: "DummyNamespaceOverride",
  });

  expect(metricWithAllOptionalParams).toMatchSnapshot();

  const metricWithUndefinedDimensions = metricFactory.metric({
    metricName: "DummyMetricName-AllOptionalParams",
    statistic: MetricStatistic.P90,
    label: "DummyLabel",
    dimensionsMap: {
      DummyDimension: undefined as unknown as string,
      AnotherDummyDimension: undefined as unknown as string,
    },
    color: DummyColor,
    namespace: "DummyNamespaceOverride",
    period: Duration.minutes(15),
    region: "us-west-2",
    account: "123456789",
  });

  expect(metricWithUndefinedDimensions).toMatchSnapshot();
});

test("snapshot test: createMetricMath", () => {
  const metricFactory = new MetricFactory({
    globalDefaults: {
      namespace: "DummyNamespace",
    },
  });

  const a = metricFactory.metric({
    metricName: "a",
    statistic: MetricStatistic.SUM,
  });
  const b = metricFactory.metric({
    metricName: "b",
    statistic: MetricStatistic.SUM,
  });

  const metricWithNoOptionalParams = metricFactory.createMetricMath(
    "a+b",
    { a, b },
    "a and b",
  );

  expect(metricWithNoOptionalParams).toMatchSnapshot();

  const metricWithAllOptionalParams = metricFactory.createMetricMath(
    "a+b",
    { a, b },
    "a and b",
    DummyColor,
  );

  expect(metricWithAllOptionalParams).toMatchSnapshot();
});

test("snapshot test: toRate with detail", () => {
  const stack = new Stack();
  const metricFactory = new MetricFactory(
    {
      globalDefaults: {
        namespace: "DummyNamespace",
      },
    },
    stack,
  );

  const metric = metricFactory.metric({
    metricName: "Metric",
    statistic: MetricStatistic.SUM,
    label: "Label",
    color: Color.ORANGE,
    namespace: "Namespace",
    region: "eu-west-1",
    account: "01234567890",
  });

  const metricAverage = metricFactory.toRate(
    metric,
    RateComputationMethod.AVERAGE,
    true,
  );
  expect(metricAverage).toMatchSnapshot();

  const metricAverageWithAccount = metricFactory.toRate(
    metric.with({ account: "1111111111" }),
    RateComputationMethod.AVERAGE,
    true,
  );
  expect(metricAverageWithAccount).toMatchSnapshot();

  const metricPerSecond = metricFactory.toRate(
    metric,
    RateComputationMethod.PER_SECOND,
    true,
  );
  expect(metricPerSecond).toMatchSnapshot();

  const metricPerMinute = metricFactory.toRate(
    metric,
    RateComputationMethod.PER_MINUTE,
    true,
  );
  expect(metricPerMinute).toMatchSnapshot();

  const metricPerHour = metricFactory.toRate(
    metric,
    RateComputationMethod.PER_HOUR,
    true,
  );
  expect(metricPerHour).toMatchSnapshot();

  const metricPerDay = metricFactory.toRate(
    metric,
    RateComputationMethod.PER_DAY,
    true,
  );
  expect(metricPerDay).toMatchSnapshot();
});

test("snapshot test: toRate without detail", () => {
  const metricFactory = new MetricFactory({
    globalDefaults: {
      namespace: "DummyNamespace",
    },
  });

  const metric = metricFactory.metric({
    metricName: "Metric",
    statistic: MetricStatistic.SUM,
    label: "Label",
  });

  const metricAverage = metricFactory.toRate(
    metric,
    RateComputationMethod.AVERAGE,
    false,
  );
  expect(metricAverage).toMatchSnapshot();

  const metricPerSecond = metricFactory.toRate(
    metric,
    RateComputationMethod.PER_SECOND,
    false,
  );
  expect(metricPerSecond).toMatchSnapshot();

  const metricPerMinute = metricFactory.toRate(
    metric,
    RateComputationMethod.PER_MINUTE,
    false,
  );
  expect(metricPerMinute).toMatchSnapshot();

  const metricPerHour = metricFactory.toRate(
    metric,
    RateComputationMethod.PER_HOUR,
    false,
  );
  expect(metricPerHour).toMatchSnapshot();

  const metricPerDay = metricFactory.toRate(
    metric,
    RateComputationMethod.PER_DAY,
    false,
  );
  expect(metricPerDay).toMatchSnapshot();
});

test("snapshot test: createMetricSearch", () => {
  const metricFactory = new MetricFactory({
    globalDefaults: {
      namespace: "DummyNamespace",
    },
  });

  const metricWithNoOptionalParams = metricFactory.createMetricSearch(
    "MyMetricPrefix-",
    { DummyDimension: "DummyDimensionValue" },
    MetricStatistic.SUM,
  );

  expect(metricWithNoOptionalParams).toMatchSnapshot();

  const metricWithAllOptionalParams = metricFactory.createMetricSearch(
    "MyMetricPrefix-",
    { DummyDimension: "DummyDimensionValue" },
    MetricStatistic.SUM,
    "DummyNamespaceOverride",
  );

  expect(metricWithAllOptionalParams).toMatchSnapshot();

  const metricWithUndefinedDimensions = metricFactory.createMetricSearch(
    "MyMetricPrefix-",
    {
      DummyUndefinedDimension: undefined as unknown as string,
      DummyDefinedDimension: "DummyDimensionValue",
    },
    MetricStatistic.SUM,
    "DummyNamespaceOverride",
  );

  expect(metricWithUndefinedDimensions).toMatchSnapshot();

  const metricWithEmptyDimensions = metricFactory.createMetricSearch(
    "MyMetricPrefix-",
    {},
    MetricStatistic.SUM,
    "DummyNamespaceOverride",
  );

  expect(metricWithEmptyDimensions).toMatchSnapshot();
});

test("snapshot test: createMetricAnomalyDetection", () => {
  const metricFactory = new MetricFactory({
    globalDefaults: {
      namespace: "DummyNamespace",
    },
  });

  const metric = new Metric({
    namespace: "DummyNamespace",
    metricName: "DummyMetric",
  });

  const anomaly = metricFactory.createMetricAnomalyDetection(
    metric,
    2,
    "DummyLabel",
  );

  expect(anomaly).toMatchSnapshot();
});

test("multiply/divide metric produces expected result", () => {
  const metricFactory = new MetricFactory({
    globalDefaults: {
      namespace: "DummyNamespace",
    },
  });

  const metric = new Metric({
    namespace: "DummyNamespace",
    metricName: "DummyMetric",
  });

  expect(() =>
    metricFactory.multiplyMetric(metric, 0.5, "DummyLabel"),
  ).toThrowError();
  expect(() =>
    metricFactory.divideMetric(metric, 0.6, "DummyLabel"),
  ).toThrowError();

  expect(metricFactory.multiplyMetric(metric, 1, "DummyLabel")).toStrictEqual(
    metric,
  );
  expect(metricFactory.divideMetric(metric, 1, "DummyLabel")).toStrictEqual(
    metric,
  );

  expect(
    metricFactory.multiplyMetric(metric, 42, "DummyLabel"),
  ).toMatchSnapshot();
  expect(metricFactory.divideMetric(metric, 5, "DummyLabel")).toMatchSnapshot();
});

test("sanitizeMetricExpressionIdSuffix removes unwanted characters", () => {
  const metricFactory = new MetricFactory({
    globalDefaults: {
      namespace: "DummyNamespace",
    },
  });

  expect(
    metricFactory.sanitizeMetricExpressionIdSuffix("Name With Spaces"),
  ).toStrictEqual("NameWithSpaces");
  expect(
    metricFactory.sanitizeMetricExpressionIdSuffix("-Hyphen_Underscore"),
  ).toStrictEqual("Hyphen_Underscore");
  expect(
    metricFactory.sanitizeMetricExpressionIdSuffix("Alpha1234567890Numeric"),
  ).toStrictEqual("Alpha1234567890Numeric");
  expect(
    metricFactory.sanitizeMetricExpressionIdSuffix(
      "Some Weird Characters: +ěščřžýáíé='",
    ),
  ).toStrictEqual("SomeWeirdCharacters");
});
