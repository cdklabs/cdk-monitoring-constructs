import { Duration } from "aws-cdk-lib";
import { Metric } from "aws-cdk-lib/aws-cloudwatch";

import {
  MetricFactory,
  MetricFactoryDefaults,
  MetricStatistic,
  RateComputationMethod,
} from "../../../lib";

const DummyColor = "#abcdef";

test("createMetric without global namespace throws an error", () => {
  const metricFactory = new MetricFactory();

  expect(() =>
    metricFactory.createMetric(
      "DummyMetricName-NoOptionalParams",
      MetricStatistic.P90
    )
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

    const metric = metricFactory.createMetric(
      "DummyMetricName",
      MetricStatistic.P90
    );
    const metricMath = metricFactory.createMetricMath(
      "DummyExpression",
      {},
      "label"
    );
    const metricSearch = metricFactory.createMetricSearch(
      "DummyQuery",
      {},
      MetricStatistic.P90
    );
    const metricAnomalyDetection = metricFactory.createMetricAnomalyDetection(
      new Metric({
        metricName: "DummyMetric1",
        namespace: "DummyNamespace",
      }),
      2,
      "label"
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

  const metricWithNoOptionalParams = metricFactory.createMetric(
    "DummyMetricName-NoOptionalParams",
    MetricStatistic.P90
  );

  expect(metricWithNoOptionalParams).toMatchSnapshot();

  const metricWithAllOptionalParams = metricFactory.createMetric(
    "DummyMetricName-AllOptionalParams",
    MetricStatistic.P90,
    "DummyLabel",
    { DummyDimension: "DummyDimensionValue" },
    DummyColor,
    "DummyNamespaceOverride"
  );

  expect(metricWithAllOptionalParams).toMatchSnapshot();

  const metricWithUndefinedDimensions = metricFactory.createMetric(
    "DummyMetricName-AllOptionalParams",
    MetricStatistic.P90,
    "DummyLabel",
    {
      DummyDimension: undefined as unknown as string,
      AnotherDummyDimension: undefined as unknown as string,
    },
    DummyColor,
    "DummyNamespaceOverride",
    Duration.minutes(15),
    "us-west-2",
    "123456789"
  );

  expect(metricWithUndefinedDimensions).toMatchSnapshot();
});

test("snapshot test: createMetricMath", () => {
  const metricFactory = new MetricFactory({
    globalDefaults: {
      namespace: "DummyNamespace",
    },
  });

  const a = metricFactory.createMetric("a", MetricStatistic.SUM);
  const b = metricFactory.createMetric("b", MetricStatistic.SUM);

  const metricWithNoOptionalParams = metricFactory.createMetricMath(
    "a+b",
    { a, b },
    "a and b"
  );

  expect(metricWithNoOptionalParams).toMatchSnapshot();

  const metricWithAllOptionalParams = metricFactory.createMetricMath(
    "a+b",
    { a, b },
    "a and b",
    DummyColor
  );

  expect(metricWithAllOptionalParams).toMatchSnapshot();
});

test("snapshot test: toRate with detail", () => {
  const metricFactory = new MetricFactory({
    globalDefaults: {
      namespace: "DummyNamespace",
    },
  });

  const metric = metricFactory.createMetric(
    "Metric",
    MetricStatistic.SUM,
    "Label"
  );

  const metricAverage = metricFactory.toRate(
    metric,
    RateComputationMethod.AVERAGE,
    true
  );
  expect(metricAverage).toMatchSnapshot();

  const metricPerSecond = metricFactory.toRate(
    metric,
    RateComputationMethod.PER_SECOND,
    true
  );
  expect(metricPerSecond).toMatchSnapshot();

  const metricPerMinute = metricFactory.toRate(
    metric,
    RateComputationMethod.PER_MINUTE,
    true
  );
  expect(metricPerMinute).toMatchSnapshot();

  const metricPerHour = metricFactory.toRate(
    metric,
    RateComputationMethod.PER_HOUR,
    true
  );
  expect(metricPerHour).toMatchSnapshot();

  const metricPerDay = metricFactory.toRate(
    metric,
    RateComputationMethod.PER_DAY,
    true
  );
  expect(metricPerDay).toMatchSnapshot();
});

test("snapshot test: toRate without detail", () => {
  const metricFactory = new MetricFactory({
    globalDefaults: {
      namespace: "DummyNamespace",
    },
  });

  const metric = metricFactory.createMetric(
    "Metric",
    MetricStatistic.SUM,
    "Label"
  );

  const metricAverage = metricFactory.toRate(
    metric,
    RateComputationMethod.AVERAGE,
    false
  );
  expect(metricAverage).toMatchSnapshot();

  const metricPerSecond = metricFactory.toRate(
    metric,
    RateComputationMethod.PER_SECOND,
    false
  );
  expect(metricPerSecond).toMatchSnapshot();

  const metricPerMinute = metricFactory.toRate(
    metric,
    RateComputationMethod.PER_MINUTE,
    false
  );
  expect(metricPerMinute).toMatchSnapshot();

  const metricPerHour = metricFactory.toRate(
    metric,
    RateComputationMethod.PER_HOUR,
    false
  );
  expect(metricPerHour).toMatchSnapshot();

  const metricPerDay = metricFactory.toRate(
    metric,
    RateComputationMethod.PER_DAY,
    false
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
    MetricStatistic.SUM
  );

  expect(metricWithNoOptionalParams).toMatchSnapshot();

  const metricWithAllOptionalParams = metricFactory.createMetricSearch(
    "MyMetricPrefix-",
    { DummyDimension: "DummyDimensionValue" },
    MetricStatistic.SUM,
    "DummyNamespaceOverride"
  );

  expect(metricWithAllOptionalParams).toMatchSnapshot();

  const metricWithUndefinedDimensions = metricFactory.createMetricSearch(
    "MyMetricPrefix-",
    {
      DummyUndefinedDimension: undefined as unknown as string,
      DummyDefinedDimension: "DummyDimensionValue",
    },
    MetricStatistic.SUM,
    "DummyNamespaceOverride"
  );

  expect(metricWithUndefinedDimensions).toMatchSnapshot();

  const metricWithEmptyDimensions = metricFactory.createMetricSearch(
    "MyMetricPrefix-",
    {},
    MetricStatistic.SUM,
    "DummyNamespaceOverride"
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
    "DummyLabel"
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
    metricFactory.multiplyMetric(metric, 0.5, "DummyLabel")
  ).toThrowError();
  expect(() =>
    metricFactory.divideMetric(metric, 0.6, "DummyLabel")
  ).toThrowError();

  expect(metricFactory.multiplyMetric(metric, 1, "DummyLabel")).toStrictEqual(
    metric
  );
  expect(metricFactory.divideMetric(metric, 1, "DummyLabel")).toStrictEqual(
    metric
  );

  expect(
    metricFactory.multiplyMetric(metric, 42, "DummyLabel")
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
    metricFactory.sanitizeMetricExpressionIdSuffix("Name With Spaces")
  ).toStrictEqual("NameWithSpaces");
  expect(
    metricFactory.sanitizeMetricExpressionIdSuffix("-Hyphen_Underscore")
  ).toStrictEqual("Hyphen_Underscore");
  expect(
    metricFactory.sanitizeMetricExpressionIdSuffix("Alpha1234567890Numeric")
  ).toStrictEqual("Alpha1234567890Numeric");
  expect(
    metricFactory.sanitizeMetricExpressionIdSuffix(
      "Some Weird Characters: +ěščřžýáíé='"
    )
  ).toStrictEqual("SomeWeirdCharacters");
});
