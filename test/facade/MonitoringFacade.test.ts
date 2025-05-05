import { Duration, Stack } from "aws-cdk-lib";
import { Capture, Template, Match } from "aws-cdk-lib/assertions";
import { TextWidget, ComparisonOperator } from "aws-cdk-lib/aws-cloudwatch";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { Function } from "aws-cdk-lib/aws-lambda";
import { Topic } from "aws-cdk-lib/aws-sns";
import {
  DefaultDashboardFactory,
  DynamicDashboardFactory,
  MonitoringFacade,
  SingleWidgetDashboardSegment,
  noopAction,
  notifySns,
} from "../../lib";

describe("test of defaults", () => {
  test("only default dashboard gets created by default", () => {
    const stack = new Stack();
    new MonitoringFacade(stack, "Test");
    const result = Template.fromStack(stack);

    result.resourceCountIs("AWS::CloudWatch::Dashboard", 1);

    result.hasResourceProperties("AWS::CloudWatch::Dashboard", {
      DashboardName: "Test",
    });
  });

  test("handles multiple facades", () => {
    const stack = new Stack();
    new MonitoringFacade(stack, "Test1");
    new MonitoringFacade(stack, "Test2");
    new MonitoringFacade(stack, "Test3", {
      metricFactoryDefaults: {
        region: "us-west-2",
        account: "01234567890",
      },
    });
    const result = Template.fromStack(stack);

    result.resourceCountIs("AWS::CloudWatch::Dashboard", 3);

    result.hasResourceProperties("AWS::CloudWatch::Dashboard", {
      DashboardName: "Test1",
    });
    result.hasResourceProperties("AWS::CloudWatch::Dashboard", {
      DashboardName: "Test2",
    });
    result.hasResourceProperties("AWS::CloudWatch::Dashboard", {
      DashboardName: "Test3",
    });
  });

  test("handles dynamic dashboards", () => {
    const stack = new Stack();

    const dynamicDashboardFactory = new DynamicDashboardFactory(
      stack,
      "TestDynamicDashboardFactory",
      {
        dashboardNamePrefix: "testPrefix",
        dashboardConfigs: [{ name: "Dynamic1" }, { name: "Dynamic2" }],
      },
    );
    new MonitoringFacade(stack, "Test1", {
      dashboardFactory: dynamicDashboardFactory,
    });
    const result = Template.fromStack(stack);

    result.resourceCountIs("AWS::CloudWatch::Dashboard", 2);

    result.hasResourceProperties("AWS::CloudWatch::Dashboard", {
      DashboardName: "testPrefix-Dynamic1",
    });

    result.hasResourceProperties("AWS::CloudWatch::Dashboard", {
      DashboardName: "testPrefix-Dynamic2",
    });
  });

  test("typical usage", () => {
    const stack = new Stack();
    const onAlarmTopic = new Topic(stack, "OnAlarmTopic", {
      topicName: "Alarm",
    });
    const facade = new MonitoringFacade(stack, "MyAppFacade", {
      metricFactoryDefaults: {
        region: "us-east-1",
        account: "09876543210",
      },
      alarmFactoryDefaults: {
        alarmNamePrefix: "MyApp",
        actionsEnabled: true,
        action: notifySns(onAlarmTopic),
      },
    });

    facade
      .addLargeHeader("My App Dashboard")
      .monitorDynamoTable({
        table: Table.fromTableName(stack, "ImportedTable", "MyTableName"),
        addAverageSuccessfulGetItemLatencyAlarm: {
          Critical: {
            maxLatency: Duration.seconds(10),
          },
        },
      })
      .monitorDynamoTable({
        table: Table.fromTableArn(
          stack,
          "XaXrImportedTable",
          "arn:aws:dynamodb:us-west-2:01234567890:table/my-other-table",
        ),
        region: "us-west-2",
        account: "01234567890",
      })
      .monitorLambdaFunction({
        account: "01234567890",
        region: "us-west-2",
        lambdaFunction: Function.fromFunctionAttributes(
          stack,
          "XaXrImportedFunction",
          {
            functionArn: `arn:aws:lambda:us-west-2:01234567890:function:MyFunction`,
            sameEnvironment: false,
          },
        ),
      });

    expect(Template.fromStack(stack)).toMatchSnapshot();
  });

  test("SingleWidgetDashboardSegment is not displayed if addSegment overrides set to false", () => {
    // configure monitoring facade with dashboard factory which populates all three default dashboards
    const stack = new Stack();
    const dashboardFactory = new DefaultDashboardFactory(
      stack,
      "TestDashboardFactory",
      {
        dashboardNamePrefix: "testPrefix",
        createDashboard: true,
        createAlarmDashboard: true,
        createSummaryDashboard: true,
      },
    );
    const facade = new MonitoringFacade(stack, "Test", {
      dashboardFactory: dashboardFactory,
    });

    // add SingleWidgetDashboardSegment with default ctor args but use overrides to
    // direct exclusion from default dashboards
    facade.addSegment(
      new SingleWidgetDashboardSegment(
        new TextWidget({ markdown: "Simple Dashboard Segment" }),
      ),
      {
        addToAlarmDashboard: false,
        addToDetailDashboard: false,
        addToSummaryDashboard: false,
      },
    );

    // verify that the generated dashboards do not include the SingleWidgetDashboardSegment
    // due to override exclusion directives
    const result = Template.fromStack(stack);
    const dashboardCapture = new Capture();
    result.hasResourceProperties("AWS::CloudWatch::Dashboard", {
      DashboardBody: dashboardCapture,
    });

    do {
      const dashboardBody = JSON.parse(dashboardCapture.asString());
      expect(dashboardBody.widgets).toHaveLength(0);
    } while (dashboardCapture.next());
  });

  test("Given clone function, creates cloned monitors and returns them.", () => {
    const stack = new Stack();
    const onAlarmTopic = new Topic(stack, "OnAlarmTopic", {
      topicName: "Alarm",
    });
    const facade = new MonitoringFacade(stack, "MyAppFacade", {
      metricFactoryDefaults: {
        namespace: "MyNamespace",
      },
      alarmFactoryDefaults: {
        alarmNamePrefix: "MyApp",
        actionsEnabled: true,
        datapointsToAlarm: 5,
        disambiguatorAction: {
          Critical: notifySns(onAlarmTopic),
        },
      },
    });

    facade
      .addLargeHeader("My App Dashboard")
      .monitorDynamoTable({
        table: Table.fromTableName(stack, "ImportedTable", "MyTableName"),
        addAverageSuccessfulGetItemLatencyAlarm: {
          Critical: {
            maxLatency: Duration.seconds(10),
          },
          Warning: {
            maxLatency: Duration.seconds(5),
          },
        },
        addReadThrottledEventsCountAlarm: {
          Critical: {
            maxThrottledEventsThreshold: 100,
          },
        },
      })
      .monitorLambdaFunction({
        lambdaFunction: Function.fromFunctionAttributes(
          stack,
          "XaXrImportedFunction",
          {
            functionArn: `arn:aws:lambda:us-west-2:01234567890:function:MyFunction`,
            sameEnvironment: true,
          },
        ),
        addLowTpsAlarm: {
          Critical: {
            minTps: 1,
          },
          Warning: {
            minTps: 5,
          },
        },
        addFaultRateAlarm: {
          Critical: {
            maxErrorRate: 0.5,
          },
          Warning: {
            maxErrorRate: 0.25,
          },
        },
      });

    const criticalAlarms = facade.createdAlarmsWithDisambiguator("Critical");
    const clones = facade.cloneAlarms(criticalAlarms, (a) => {
      // Arbitrary user-supplied function to create new alarms based off other ones.
      if (
        a.alarmDefinition.addAlarmProps.comparisonOperator ==
        ComparisonOperator.GREATER_THAN_THRESHOLD
      ) {
        // Clone alarms that have an upper bound
        return {
          ...a.alarmDefinition.addAlarmProps,
          actionsEnabled: false,
          disambiguator: "UpperBoundCritical",
          alarmDescription: "Cloned alarm of " + a.alarmDescription,
          // Bump the threshold a bit
          threshold: a.alarmDefinition.addAlarmProps.threshold * 1.1,
          // Tighten the number of datapoints a bit
          datapointsToAlarm: a.alarmDefinition.datapointsToAlarm - 1,
          // Keep the same number of evaluation periods
          evaluationPeriods: a.alarmDefinition.evaluationPeriods,
        };
      } else {
        // Don't clone alarms that have a lower bound
        return undefined;
      }
    });

    const expectedNumberOfCriticalAlarms = 4;
    expect(criticalAlarms.length).toBe(expectedNumberOfCriticalAlarms);

    const expectedNumberOfWarningAlarms = 3;
    const warningAlarms = facade.createdAlarmsWithDisambiguator("Warning");
    expect(warningAlarms.length).toBe(expectedNumberOfWarningAlarms);

    const expectedNumberOfClonedAlarms = 3;
    expect(clones.length).toBe(expectedNumberOfClonedAlarms);
    clones.forEach((a) => expect(a.action).toEqual(noopAction()));
    clones.forEach((a) =>
      expect(a.disambiguator).toEqual("UpperBoundCritical"),
    );
    clones.forEach((cloneAlarm) => {
      const sourceAlarm = criticalAlarms.find(
        (a) => a.alarmDefinition.metric === cloneAlarm.alarmDefinition.metric,
      )!;
      expect(cloneAlarm.alarmDefinition.addAlarmProps.threshold).toBeCloseTo(
        sourceAlarm.alarmDefinition.addAlarmProps.threshold * 1.1,
      );
      expect(cloneAlarm.alarmDefinition.datapointsToAlarm).toEqual(
        sourceAlarm.alarmDefinition.datapointsToAlarm - 1,
      );
    });

    // Verify the templated alarms have the expected number of evaluation periods,
    // datapoints to alarm, and thresholds for both the requested alarms and their
    // clones (adjusted as configured).
    const template = Template.fromStack(stack);

    const templateAllAlarms = template.findResources("AWS::CloudWatch::Alarm");
    expect(Object.keys(templateAllAlarms).length).toBe(
      expectedNumberOfCriticalAlarms +
        expectedNumberOfWarningAlarms +
        expectedNumberOfClonedAlarms,
    );
    const templateCriticalAlarms = template.findResources(
      "AWS::CloudWatch::Alarm",
      {
        Properties: {
          AlarmName: Match.stringLikeRegexp("-Critical$"),
          ActionsEnabled: true,
          AlarmActions: Match.anyValue(),
          AlarmDescription: Match.anyValue(),
          ComparisonOperator: Match.anyValue(),
          DatapointsToAlarm: 5,
          EvaluationPeriods: 5,
          Metrics: Match.anyValue(),
          Threshold: Match.anyValue(),
          TreatMissingData: Match.anyValue(),
        },
      },
    );
    expect(Object.keys(templateCriticalAlarms).length).toBe(
      expectedNumberOfCriticalAlarms,
    );
    const templateWarningAlarms = template.findResources(
      "AWS::CloudWatch::Alarm",
      Match.objectLike({
        Properties: {
          AlarmName: Match.stringLikeRegexp("-Warning$"),
          ActionsEnabled: true,
          AlarmActions: Match.absent(),
          AlarmDescription: Match.anyValue(),
          ComparisonOperator: Match.anyValue(),
          DatapointsToAlarm: 5,
          EvaluationPeriods: 5,
          Metrics: Match.anyValue(),
          Threshold: Match.anyValue(),
          TreatMissingData: Match.anyValue(),
        },
      }),
    );
    expect(Object.keys(templateWarningAlarms).length).toBe(
      expectedNumberOfWarningAlarms,
    );
    const templateCloneAlarms = template.findResources(
      "AWS::CloudWatch::Alarm",
      Match.objectLike({
        Properties: {
          AlarmName: Match.stringLikeRegexp("-UpperBoundCritical$"),
          ActionsEnabled: false,
          AlarmActions: Match.absent(),
          AlarmDescription: Match.stringLikeRegexp("^Cloned alarm of "),
          ComparisonOperator: "GreaterThanThreshold",
          DatapointsToAlarm: 4,
          EvaluationPeriods: 5,
          Metrics: Match.anyValue(),
          Threshold: Match.anyValue(),
          TreatMissingData: Match.anyValue(),
        },
      }),
    );
    expect(Object.keys(templateCloneAlarms).length).toBe(
      expectedNumberOfClonedAlarms,
    );
    // Expect cloned alarms to match the requested alarms in all ways
    // except for the configured variations.
    expect(Object.values(templateCloneAlarms)).toEqual(
      Object.values(templateCriticalAlarms)
        .filter(
          (resource) =>
            resource.Properties.ComparisonOperator === "GreaterThanThreshold",
        )
        .map((resource) => {
          return {
            ...resource,
            Properties: {
              ...resource.Properties,
              // eslint-disable-next-line @typescript-eslint/no-unsafe-call
              AlarmName: resource.Properties.AlarmName.replace(
                /-Critical$/,
                "-UpperBoundCritical",
              ),
              ActionsEnabled: false,
              AlarmActions: undefined,
              AlarmDescription:
                "Cloned alarm of " + resource.Properties.AlarmDescription,
              Threshold: resource.Properties.Threshold * 1.1,
              DatapointsToAlarm: resource.Properties.DatapointsToAlarm - 1,
              EvaluationPeriods: resource.Properties.EvaluationPeriods,
            },
          };
        }),
    );

    // Snapshot verification
    expect(template).toMatchSnapshot();
  });

  test("createCompositeAlarmUsingTag creates a composite alarm from matching alarms", () => {
    const stack = new Stack();
    const onAlarmTopic = new Topic(stack, "OnAlarmTopicForComposites", {
      topicName: "CompositeAlarmTopic",
    });
    const facade = new MonitoringFacade(stack, "CompositeAlarmTestFacade", {
      metricFactoryDefaults: {
        namespace: "CompositeTest",
      },
      alarmFactoryDefaults: {
        alarmNamePrefix: "CompTest",
        actionsEnabled: true,
        datapointsToAlarm: 3,
        action: notifySns(onAlarmTopic),
      },
    });

    // Create a set of metric alarms with the same tag
    facade.monitorDynamoTable({
      table: Table.fromTableName(stack, "CompositeTestTable", "TestTable"),
      addAverageSuccessfulGetItemLatencyAlarm: {
        Critical: {
          maxLatency: Duration.seconds(10),
          customTags: ["comp-test-tag"],
        },
      },
      addReadThrottledEventsCountAlarm: {
        Critical: {
          maxThrottledEventsThreshold: 100,
          customTags: ["comp-test-tag"],
        },
      },
    });

    // Create first level composite alarm from metric alarms
    const firstLevelComposite = facade.createCompositeAlarmUsingTag(
      "comp-test-tag",
      {
        disambiguator: "FirstLevel",
        alarmNameSuffix: "FirstLevel",
        customTags: ["comp-test-nested"],
      },
      true, // allow nested composite alarms
    );

    expect(firstLevelComposite).toBeDefined();

    // Create more metric alarms with a different tag
    facade.monitorLambdaFunction({
      lambdaFunction: Function.fromFunctionAttributes(
        stack,
        "CompositeTestFunction",
        {
          functionArn: `arn:aws:lambda:us-west-2:01234567890:function:TestFunction`,
          sameEnvironment: true,
        },
      ),
      addFaultRateAlarm: {
        Critical: {
          maxErrorRate: 0.5,
          customTags: ["comp-test-nested"],
        },
      },
    });

    // Create second level composite alarm that includes metric alarms and the first level composite
    const secondLevelComposite = facade.createCompositeAlarmUsingTag(
      "comp-test-nested",
      {
        disambiguator: "SecondLevel",
        alarmNameSuffix: "SecondLevel",
      },
      true, // allow nested composite alarms
    );

    expect(secondLevelComposite).toBeDefined();

    // Verify the generated resources
    const template = Template.fromStack(stack);

    // Find first level composite alarm
    const firstLevelCompositeAlarm = template.findResources(
      "AWS::CloudWatch::CompositeAlarm",
      Match.objectLike({
        Properties: {
          AlarmName: Match.stringLikeRegexp("-FirstLevel$"),
          AlarmRule: Match.anyValue(),
        },
      }),
    );
    expect(Object.keys(firstLevelCompositeAlarm).length).toBe(1);

    // Find second level composite alarm
    const secondLevelCompositeAlarm = template.findResources(
      "AWS::CloudWatch::CompositeAlarm",
      Match.objectLike({
        Properties: {
          AlarmName: Match.stringLikeRegexp("-SecondLevel$"),
          AlarmRule: Match.anyValue(),
        },
      }),
    );
    expect(Object.keys(secondLevelCompositeAlarm).length).toBe(1);

    // Verify total number of alarms (3 metric alarms + 2 composite alarms)
    const allAlarms = [
      ...Object.keys(template.findResources("AWS::CloudWatch::Alarm")),
      ...Object.keys(template.findResources("AWS::CloudWatch::CompositeAlarm")),
    ];
    expect(allAlarms.length).toBe(5);

    // Snapshot verification
    expect(template).toMatchSnapshot();
  });

  test("composite alarms are not nested when allowNestedCompositeAlarms is false", () => {
    const stack = new Stack();
    const onAlarmTopic = new Topic(stack, "AlarmTopic");
    const facade = new MonitoringFacade(stack, "NestingTestFacade", {
      alarmFactoryDefaults: {
        alarmNamePrefix: "NestTest",
        actionsEnabled: true,
        action: notifySns(onAlarmTopic),
      },
    });

    // Create first set of metric alarms with the "FirstGroup" tag
    facade.monitorDynamoTable({
      table: Table.fromTableName(stack, "FirstGroupTable", "FirstGroupTable"),
      addAverageSuccessfulGetItemLatencyAlarm: {
        Critical: {
          maxLatency: Duration.seconds(10),
          customTags: ["FirstGroup"],
        },
      },
    });

    // Create first level composite alarm from the "FirstGroup" tag
    const firstLevelComposite = facade.createCompositeAlarmUsingTag(
      "FirstGroup",
      {
        disambiguator: "FirstLevel",
        alarmNameSuffix: "FirstLevel",
        customTags: ["FirstLevelTag"],
      },
    );
    expect(firstLevelComposite).toBeDefined();

    // Create second set of metric alarms
    facade.monitorLambdaFunction({
      lambdaFunction: Function.fromFunctionName(
        stack,
        "SecondGroupFunction",
        "SecondGroupFunction",
      ),
      addFaultRateAlarm: {
        Critical: {
          maxErrorRate: 0.1,
          customTags: ["FirstLevelTag"],
        },
      },
    });

    // Create second level composite alarm with allowNestedCompositeAlarms = false
    const secondLevelComposite = facade.createCompositeAlarmUsingTag(
      "FirstLevelTag",
      {
        disambiguator: "SecondLevel",
        alarmNameSuffix: "SecondLevel",
      },
      false, // Explicitly set allowNestedCompositeAlarms to false
    );
    expect(secondLevelComposite).toBeDefined();

    // Verify the resources in the resulting template
    const template = Template.fromStack(stack);

    // Check that both composite alarms exist
    const compositeAlarms = template.findResources(
      "AWS::CloudWatch::CompositeAlarm",
    );
    expect(Object.keys(compositeAlarms).length).toBe(2);

    // Find all the alarm ARNs that are referenced in the second level composite's AlarmRule
    let secondLevelCompositeLogicalId: string | undefined;

    // Find the logical ID of the second level composite alarm
    for (const [logicalId, resource] of Object.entries(compositeAlarms)) {
      if (resource.Properties?.AlarmName?.toString().includes("-SecondLevel")) {
        secondLevelCompositeLogicalId = logicalId;
        break;
      }
    }

    expect(secondLevelCompositeLogicalId).toBeDefined();

    // Get the AlarmRule from the second level composite alarm
    const secondLevelRule =
      compositeAlarms[secondLevelCompositeLogicalId!].Properties.AlarmRule;

    // Convert the rule to string for inspection
    const ruleString = JSON.stringify(secondLevelRule);

    // Verify the rule doesn't include a reference to the first level composite alarm
    // by checking it doesn't contain FirstLevel in the alarm name
    expect(ruleString).not.toContain("FirstLevel");

    // Total resources should be 2 metric alarms + 2 composite alarms = 4
    const allAlarms = [
      ...Object.keys(template.findResources("AWS::CloudWatch::Alarm")),
      ...Object.keys(template.findResources("AWS::CloudWatch::CompositeAlarm")),
    ];
    expect(allAlarms.length).toBe(4);

    // Snapshot verification
    expect(template).toMatchSnapshot();
  });
});
