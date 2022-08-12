package cdkmonitoringconstructs

import (
	"reflect"

	_jsii_ "github.com/aws/jsii-runtime-go/runtime"
)

func init() {
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.AddAlarmProps",
		reflect.TypeOf((*AddAlarmProps)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.AddCompositeAlarmProps",
		reflect.TypeOf((*AddCompositeAlarmProps)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.AgeAlarmFactory",
		reflect.TypeOf((*AgeAlarmFactory)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "addDaysSinceUpdateAlarm", GoMethod: "AddDaysSinceUpdateAlarm"},
			_jsii_.MemberMethod{JsiiMethod: "addDaysToExpiryAlarm", GoMethod: "AddDaysToExpiryAlarm"},
			_jsii_.MemberMethod{JsiiMethod: "addIteratorMaxAgeAlarm", GoMethod: "AddIteratorMaxAgeAlarm"},
			_jsii_.MemberProperty{JsiiProperty: "alarmFactory", GoGetter: "AlarmFactory"},
		},
		func() interface{} {
			return &jsiiProxy_AgeAlarmFactory{}
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.AlarmActionStrategyProps",
		reflect.TypeOf((*AlarmActionStrategyProps)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.AlarmAnnotationStrategyProps",
		reflect.TypeOf((*AlarmAnnotationStrategyProps)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.AlarmFactory",
		reflect.TypeOf((*AlarmFactory)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "addAlarm", GoMethod: "AddAlarm"},
			_jsii_.MemberMethod{JsiiMethod: "addCompositeAlarm", GoMethod: "AddCompositeAlarm"},
			_jsii_.MemberProperty{JsiiProperty: "alarmNamingStrategy", GoGetter: "AlarmNamingStrategy"},
			_jsii_.MemberProperty{JsiiProperty: "alarmScope", GoGetter: "AlarmScope"},
			_jsii_.MemberMethod{JsiiMethod: "createAnnotation", GoMethod: "CreateAnnotation"},
			_jsii_.MemberMethod{JsiiMethod: "determineActionsEnabled", GoMethod: "DetermineActionsEnabled"},
			_jsii_.MemberMethod{JsiiMethod: "determineCompositeAlarmRule", GoMethod: "DetermineCompositeAlarmRule"},
			_jsii_.MemberMethod{JsiiMethod: "generateDescription", GoMethod: "GenerateDescription"},
			_jsii_.MemberProperty{JsiiProperty: "globalAlarmDefaults", GoGetter: "GlobalAlarmDefaults"},
			_jsii_.MemberProperty{JsiiProperty: "globalMetricDefaults", GoGetter: "GlobalMetricDefaults"},
			_jsii_.MemberMethod{JsiiMethod: "joinDescriptionParts", GoMethod: "JoinDescriptionParts"},
			_jsii_.MemberProperty{JsiiProperty: "shouldUseDefaultDedupeForError", GoGetter: "ShouldUseDefaultDedupeForError"},
			_jsii_.MemberProperty{JsiiProperty: "shouldUseDefaultDedupeForLatency", GoGetter: "ShouldUseDefaultDedupeForLatency"},
		},
		func() interface{} {
			return &jsiiProxy_AlarmFactory{}
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.AlarmFactoryDefaults",
		reflect.TypeOf((*AlarmFactoryDefaults)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.AlarmFactoryProps",
		reflect.TypeOf((*AlarmFactoryProps)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.AlarmMatrixWidget",
		reflect.TypeOf((*AlarmMatrixWidget)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberProperty{JsiiProperty: "height", GoGetter: "Height"},
			_jsii_.MemberMethod{JsiiMethod: "position", GoMethod: "Position"},
			_jsii_.MemberMethod{JsiiMethod: "toJson", GoMethod: "ToJson"},
			_jsii_.MemberProperty{JsiiProperty: "width", GoGetter: "Width"},
			_jsii_.MemberProperty{JsiiProperty: "x", GoGetter: "X"},
			_jsii_.MemberProperty{JsiiProperty: "y", GoGetter: "Y"},
		},
		func() interface{} {
			j := jsiiProxy_AlarmMatrixWidget{}
			_jsii_.InitJsiiProxy(&j.Type__awscloudwatchAlarmStatusWidget)
			return &j
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.AlarmMatrixWidgetProps",
		reflect.TypeOf((*AlarmMatrixWidgetProps)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.AlarmMetadata",
		reflect.TypeOf((*AlarmMetadata)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.AlarmNamingInput",
		reflect.TypeOf((*AlarmNamingInput)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.AlarmNamingStrategy",
		reflect.TypeOf((*AlarmNamingStrategy)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberProperty{JsiiProperty: "dedupeStringStrategy", GoGetter: "DedupeStringStrategy"},
			_jsii_.MemberMethod{JsiiMethod: "getDedupeString", GoMethod: "GetDedupeString"},
			_jsii_.MemberMethod{JsiiMethod: "getName", GoMethod: "GetName"},
			_jsii_.MemberMethod{JsiiMethod: "getWidgetLabel", GoMethod: "GetWidgetLabel"},
			_jsii_.MemberProperty{JsiiProperty: "globalPrefix", GoGetter: "GlobalPrefix"},
			_jsii_.MemberMethod{JsiiMethod: "joinDistinct", GoMethod: "JoinDistinct"},
			_jsii_.MemberProperty{JsiiProperty: "localPrefix", GoGetter: "LocalPrefix"},
		},
		func() interface{} {
			return &jsiiProxy_AlarmNamingStrategy{}
		},
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.AlarmSummaryMatrixWidget",
		reflect.TypeOf((*AlarmSummaryMatrixWidget)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberProperty{JsiiProperty: "height", GoGetter: "Height"},
			_jsii_.MemberMethod{JsiiMethod: "position", GoMethod: "Position"},
			_jsii_.MemberProperty{JsiiProperty: "props", GoGetter: "Props"},
			_jsii_.MemberMethod{JsiiMethod: "toJson", GoMethod: "ToJson"},
			_jsii_.MemberProperty{JsiiProperty: "width", GoGetter: "Width"},
			_jsii_.MemberProperty{JsiiProperty: "x", GoGetter: "X"},
			_jsii_.MemberProperty{JsiiProperty: "y", GoGetter: "Y"},
		},
		func() interface{} {
			j := jsiiProxy_AlarmSummaryMatrixWidget{}
			_jsii_.InitJsiiProxy(&j.Type__awscloudwatchConcreteWidget)
			return &j
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.AlarmSummaryMatrixWidgetPropertiesJson",
		reflect.TypeOf((*AlarmSummaryMatrixWidgetPropertiesJson)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.AlarmSummaryMatrixWidgetProps",
		reflect.TypeOf((*AlarmSummaryMatrixWidgetProps)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.AlarmWithAnnotation",
		reflect.TypeOf((*AlarmWithAnnotation)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.AnomalyDetectingAlarmFactory",
		reflect.TypeOf((*AnomalyDetectingAlarmFactory)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "addAlarmWhenOutOfBand", GoMethod: "AddAlarmWhenOutOfBand"},
			_jsii_.MemberProperty{JsiiProperty: "alarmFactory", GoGetter: "AlarmFactory"},
		},
		func() interface{} {
			return &jsiiProxy_AnomalyDetectingAlarmFactory{}
		},
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.AnomalyDetectionMathExpression",
		reflect.TypeOf((*AnomalyDetectionMathExpression)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberProperty{JsiiProperty: "color", GoGetter: "Color"},
			_jsii_.MemberMethod{JsiiMethod: "createAlarm", GoMethod: "CreateAlarm"},
			_jsii_.MemberProperty{JsiiProperty: "expression", GoGetter: "Expression"},
			_jsii_.MemberProperty{JsiiProperty: "label", GoGetter: "Label"},
			_jsii_.MemberProperty{JsiiProperty: "period", GoGetter: "Period"},
			_jsii_.MemberProperty{JsiiProperty: "searchAccount", GoGetter: "SearchAccount"},
			_jsii_.MemberProperty{JsiiProperty: "searchRegion", GoGetter: "SearchRegion"},
			_jsii_.MemberMethod{JsiiMethod: "toMetricConfig", GoMethod: "ToMetricConfig"},
			_jsii_.MemberMethod{JsiiMethod: "toString", GoMethod: "ToString"},
			_jsii_.MemberProperty{JsiiProperty: "usingMetrics", GoGetter: "UsingMetrics"},
			_jsii_.MemberMethod{JsiiMethod: "with", GoMethod: "With"},
		},
		func() interface{} {
			j := jsiiProxy_AnomalyDetectionMathExpression{}
			_jsii_.InitJsiiProxy(&j.Type__awscloudwatchMathExpression)
			return &j
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.AnomalyDetectionThreshold",
		reflect.TypeOf((*AnomalyDetectionThreshold)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.ApiGatewayMetricFactory",
		reflect.TypeOf((*ApiGatewayMetricFactory)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberProperty{JsiiProperty: "dimensionsMap", GoGetter: "DimensionsMap"},
			_jsii_.MemberProperty{JsiiProperty: "fillTpsWithZeroes", GoGetter: "FillTpsWithZeroes"},
			_jsii_.MemberMethod{JsiiMethod: "metric4XXErrorCount", GoMethod: "Metric4XXErrorCount"},
			_jsii_.MemberMethod{JsiiMethod: "metric4XXErrorRate", GoMethod: "Metric4XXErrorRate"},
			_jsii_.MemberMethod{JsiiMethod: "metric5XXFaultCount", GoMethod: "Metric5XXFaultCount"},
			_jsii_.MemberMethod{JsiiMethod: "metric5XXFaultRate", GoMethod: "Metric5XXFaultRate"},
			_jsii_.MemberProperty{JsiiProperty: "metricFactory", GoGetter: "MetricFactory"},
			_jsii_.MemberMethod{JsiiMethod: "metricInvocationCount", GoMethod: "MetricInvocationCount"},
			_jsii_.MemberMethod{JsiiMethod: "metricInvocationRate", GoMethod: "MetricInvocationRate"},
			_jsii_.MemberMethod{JsiiMethod: "metricLatencyInMillis", GoMethod: "MetricLatencyInMillis"},
			_jsii_.MemberMethod{JsiiMethod: "metricLatencyP50InMillis", GoMethod: "MetricLatencyP50InMillis"},
			_jsii_.MemberMethod{JsiiMethod: "metricLatencyP90InMillis", GoMethod: "MetricLatencyP90InMillis"},
			_jsii_.MemberMethod{JsiiMethod: "metricLatencyP99InMillis", GoMethod: "MetricLatencyP99InMillis"},
			_jsii_.MemberMethod{JsiiMethod: "metricTps", GoMethod: "MetricTps"},
			_jsii_.MemberProperty{JsiiProperty: "rateComputationMethod", GoGetter: "RateComputationMethod"},
		},
		func() interface{} {
			return &jsiiProxy_ApiGatewayMetricFactory{}
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.ApiGatewayMetricFactoryProps",
		reflect.TypeOf((*ApiGatewayMetricFactoryProps)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.ApiGatewayMonitoring",
		reflect.TypeOf((*ApiGatewayMonitoring)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "addAlarm", GoMethod: "AddAlarm"},
			_jsii_.MemberProperty{JsiiProperty: "alarmFactory", GoGetter: "AlarmFactory"},
			_jsii_.MemberProperty{JsiiProperty: "alarms", GoGetter: "Alarms"},
			_jsii_.MemberMethod{JsiiMethod: "alarmWidgets", GoMethod: "AlarmWidgets"},
			_jsii_.MemberMethod{JsiiMethod: "createAlarmFactory", GoMethod: "CreateAlarmFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createdAlarms", GoMethod: "CreatedAlarms"},
			_jsii_.MemberMethod{JsiiMethod: "createErrorCountWidget", GoMethod: "CreateErrorCountWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createErrorRateWidget", GoMethod: "CreateErrorRateWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createLatencyWidget", GoMethod: "CreateLatencyWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createMetricFactory", GoMethod: "CreateMetricFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createTitleWidget", GoMethod: "CreateTitleWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createTpsWidget", GoMethod: "CreateTpsWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createWidgetFactory", GoMethod: "CreateWidgetFactory"},
			_jsii_.MemberProperty{JsiiProperty: "error4XXCountMetric", GoGetter: "Error4XXCountMetric"},
			_jsii_.MemberProperty{JsiiProperty: "error4XXRateMetric", GoGetter: "Error4XXRateMetric"},
			_jsii_.MemberProperty{JsiiProperty: "errorAlarmFactory", GoGetter: "ErrorAlarmFactory"},
			_jsii_.MemberProperty{JsiiProperty: "errorCountAnnotations", GoGetter: "ErrorCountAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "errorRateAnnotations", GoGetter: "ErrorRateAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "fault5XXCountMetric", GoGetter: "Fault5XXCountMetric"},
			_jsii_.MemberProperty{JsiiProperty: "fault5XXRateMetric", GoGetter: "Fault5XXRateMetric"},
			_jsii_.MemberProperty{JsiiProperty: "latencyAlarmFactory", GoGetter: "LatencyAlarmFactory"},
			_jsii_.MemberProperty{JsiiProperty: "latencyAnnotations", GoGetter: "LatencyAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "latencyMetrics", GoGetter: "LatencyMetrics"},
			_jsii_.MemberProperty{JsiiProperty: "latencyTypesToRender", GoGetter: "LatencyTypesToRender"},
			_jsii_.MemberProperty{JsiiProperty: "localAlarmNamePrefixOverride", GoGetter: "LocalAlarmNamePrefixOverride"},
			_jsii_.MemberProperty{JsiiProperty: "scope", GoGetter: "Scope"},
			_jsii_.MemberMethod{JsiiMethod: "summaryWidgets", GoMethod: "SummaryWidgets"},
			_jsii_.MemberProperty{JsiiProperty: "title", GoGetter: "Title"},
			_jsii_.MemberProperty{JsiiProperty: "tpsAlarmFactory", GoGetter: "TpsAlarmFactory"},
			_jsii_.MemberProperty{JsiiProperty: "tpsAnnotations", GoGetter: "TpsAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "tpsMetric", GoGetter: "TpsMetric"},
			_jsii_.MemberMethod{JsiiMethod: "widgets", GoMethod: "Widgets"},
		},
		func() interface{} {
			j := jsiiProxy_ApiGatewayMonitoring{}
			_jsii_.InitJsiiProxy(&j.jsiiProxy_Monitoring)
			return &j
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.ApiGatewayMonitoringOptions",
		reflect.TypeOf((*ApiGatewayMonitoringOptions)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.ApiGatewayMonitoringProps",
		reflect.TypeOf((*ApiGatewayMonitoringProps)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.ApiGatewayV2HttpApiMetricFactory",
		reflect.TypeOf((*ApiGatewayV2HttpApiMetricFactory)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberProperty{JsiiProperty: "dimensionsMap", GoGetter: "DimensionsMap"},
			_jsii_.MemberProperty{JsiiProperty: "fillTpsWithZeroes", GoGetter: "FillTpsWithZeroes"},
			_jsii_.MemberMethod{JsiiMethod: "metric4xxCount", GoMethod: "Metric4xxCount"},
			_jsii_.MemberMethod{JsiiMethod: "metric4xxRate", GoMethod: "Metric4xxRate"},
			_jsii_.MemberMethod{JsiiMethod: "metric5xxCount", GoMethod: "Metric5xxCount"},
			_jsii_.MemberMethod{JsiiMethod: "metric5xxRate", GoMethod: "Metric5xxRate"},
			_jsii_.MemberProperty{JsiiProperty: "metricFactory", GoGetter: "MetricFactory"},
			_jsii_.MemberMethod{JsiiMethod: "metricIntegrationLatencyInMillis", GoMethod: "MetricIntegrationLatencyInMillis"},
			_jsii_.MemberMethod{JsiiMethod: "metricIntegrationLatencyP50InMillis", GoMethod: "MetricIntegrationLatencyP50InMillis"},
			_jsii_.MemberMethod{JsiiMethod: "metricIntegrationLatencyP90InMillis", GoMethod: "MetricIntegrationLatencyP90InMillis"},
			_jsii_.MemberMethod{JsiiMethod: "metricIntegrationLatencyP99InMillis", GoMethod: "MetricIntegrationLatencyP99InMillis"},
			_jsii_.MemberMethod{JsiiMethod: "metricInvocationCount", GoMethod: "MetricInvocationCount"},
			_jsii_.MemberMethod{JsiiMethod: "metricInvocationRate", GoMethod: "MetricInvocationRate"},
			_jsii_.MemberMethod{JsiiMethod: "metricLatencyInMillis", GoMethod: "MetricLatencyInMillis"},
			_jsii_.MemberMethod{JsiiMethod: "metricLatencyP50InMillis", GoMethod: "MetricLatencyP50InMillis"},
			_jsii_.MemberMethod{JsiiMethod: "metricLatencyP90InMillis", GoMethod: "MetricLatencyP90InMillis"},
			_jsii_.MemberMethod{JsiiMethod: "metricLatencyP99InMillis", GoMethod: "MetricLatencyP99InMillis"},
			_jsii_.MemberMethod{JsiiMethod: "metricTps", GoMethod: "MetricTps"},
			_jsii_.MemberProperty{JsiiProperty: "rateComputationMethod", GoGetter: "RateComputationMethod"},
		},
		func() interface{} {
			return &jsiiProxy_ApiGatewayV2HttpApiMetricFactory{}
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.ApiGatewayV2HttpApiMetricFactoryProps",
		reflect.TypeOf((*ApiGatewayV2HttpApiMetricFactoryProps)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.ApiGatewayV2HttpApiMonitoring",
		reflect.TypeOf((*ApiGatewayV2HttpApiMonitoring)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "addAlarm", GoMethod: "AddAlarm"},
			_jsii_.MemberProperty{JsiiProperty: "alarmFactory", GoGetter: "AlarmFactory"},
			_jsii_.MemberProperty{JsiiProperty: "alarms", GoGetter: "Alarms"},
			_jsii_.MemberMethod{JsiiMethod: "alarmWidgets", GoMethod: "AlarmWidgets"},
			_jsii_.MemberMethod{JsiiMethod: "createAlarmFactory", GoMethod: "CreateAlarmFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createdAlarms", GoMethod: "CreatedAlarms"},
			_jsii_.MemberMethod{JsiiMethod: "createErrorCountWidget", GoMethod: "CreateErrorCountWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createErrorRateWidget", GoMethod: "CreateErrorRateWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createLatencyWidget", GoMethod: "CreateLatencyWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createMetricFactory", GoMethod: "CreateMetricFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createTitleWidget", GoMethod: "CreateTitleWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createTpsWidget", GoMethod: "CreateTpsWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createWidgetFactory", GoMethod: "CreateWidgetFactory"},
			_jsii_.MemberProperty{JsiiProperty: "error4xxCountMetric", GoGetter: "Error4xxCountMetric"},
			_jsii_.MemberProperty{JsiiProperty: "error4xxRateMetric", GoGetter: "Error4xxRateMetric"},
			_jsii_.MemberProperty{JsiiProperty: "error5xxCountMetric", GoGetter: "Error5xxCountMetric"},
			_jsii_.MemberProperty{JsiiProperty: "error5xxRateMetric", GoGetter: "Error5xxRateMetric"},
			_jsii_.MemberProperty{JsiiProperty: "errorAlarmFactory", GoGetter: "ErrorAlarmFactory"},
			_jsii_.MemberProperty{JsiiProperty: "errorCountAnnotations", GoGetter: "ErrorCountAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "errorRateAnnotations", GoGetter: "ErrorRateAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "integrationLatencyMetrics", GoGetter: "IntegrationLatencyMetrics"},
			_jsii_.MemberProperty{JsiiProperty: "latencyAlarmFactory", GoGetter: "LatencyAlarmFactory"},
			_jsii_.MemberProperty{JsiiProperty: "latencyAnnotations", GoGetter: "LatencyAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "latencyMetrics", GoGetter: "LatencyMetrics"},
			_jsii_.MemberProperty{JsiiProperty: "latencyTypesToRender", GoGetter: "LatencyTypesToRender"},
			_jsii_.MemberProperty{JsiiProperty: "localAlarmNamePrefixOverride", GoGetter: "LocalAlarmNamePrefixOverride"},
			_jsii_.MemberProperty{JsiiProperty: "scope", GoGetter: "Scope"},
			_jsii_.MemberMethod{JsiiMethod: "summaryWidgets", GoMethod: "SummaryWidgets"},
			_jsii_.MemberProperty{JsiiProperty: "title", GoGetter: "Title"},
			_jsii_.MemberProperty{JsiiProperty: "tpsAlarmFactory", GoGetter: "TpsAlarmFactory"},
			_jsii_.MemberProperty{JsiiProperty: "tpsAnnotations", GoGetter: "TpsAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "tpsMetric", GoGetter: "TpsMetric"},
			_jsii_.MemberMethod{JsiiMethod: "widgets", GoMethod: "Widgets"},
		},
		func() interface{} {
			j := jsiiProxy_ApiGatewayV2HttpApiMonitoring{}
			_jsii_.InitJsiiProxy(&j.jsiiProxy_Monitoring)
			return &j
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.ApiGatewayV2HttpApiMonitoringProps",
		reflect.TypeOf((*ApiGatewayV2HttpApiMonitoringProps)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.ApiGatewayV2MonitoringOptions",
		reflect.TypeOf((*ApiGatewayV2MonitoringOptions)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.AppSyncMetricFactory",
		reflect.TypeOf((*AppSyncMetricFactory)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberProperty{JsiiProperty: "dimensionsMap", GoGetter: "DimensionsMap"},
			_jsii_.MemberProperty{JsiiProperty: "fillTpsWithZeroes", GoGetter: "FillTpsWithZeroes"},
			_jsii_.MemberMethod{JsiiMethod: "metric4XXErrorCount", GoMethod: "Metric4XXErrorCount"},
			_jsii_.MemberMethod{JsiiMethod: "metric4XXErrorRate", GoMethod: "Metric4XXErrorRate"},
			_jsii_.MemberMethod{JsiiMethod: "metric5XXFaultCount", GoMethod: "Metric5XXFaultCount"},
			_jsii_.MemberMethod{JsiiMethod: "metric5XXFaultRate", GoMethod: "Metric5XXFaultRate"},
			_jsii_.MemberProperty{JsiiProperty: "metricFactory", GoGetter: "MetricFactory"},
			_jsii_.MemberMethod{JsiiMethod: "metricLatencyP50InMillis", GoMethod: "MetricLatencyP50InMillis"},
			_jsii_.MemberMethod{JsiiMethod: "metricLatencyP90InMillis", GoMethod: "MetricLatencyP90InMillis"},
			_jsii_.MemberMethod{JsiiMethod: "metricLatencyP99InMillis", GoMethod: "MetricLatencyP99InMillis"},
			_jsii_.MemberMethod{JsiiMethod: "metricRequestCount", GoMethod: "MetricRequestCount"},
			_jsii_.MemberMethod{JsiiMethod: "metricRequestRate", GoMethod: "MetricRequestRate"},
			_jsii_.MemberMethod{JsiiMethod: "metricTps", GoMethod: "MetricTps"},
			_jsii_.MemberProperty{JsiiProperty: "rateComputationMethod", GoGetter: "RateComputationMethod"},
		},
		func() interface{} {
			return &jsiiProxy_AppSyncMetricFactory{}
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.AppSyncMetricFactoryProps",
		reflect.TypeOf((*AppSyncMetricFactoryProps)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.AppSyncMonitoring",
		reflect.TypeOf((*AppSyncMonitoring)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "addAlarm", GoMethod: "AddAlarm"},
			_jsii_.MemberProperty{JsiiProperty: "alarmFactory", GoGetter: "AlarmFactory"},
			_jsii_.MemberProperty{JsiiProperty: "alarms", GoGetter: "Alarms"},
			_jsii_.MemberMethod{JsiiMethod: "alarmWidgets", GoMethod: "AlarmWidgets"},
			_jsii_.MemberMethod{JsiiMethod: "createAlarmFactory", GoMethod: "CreateAlarmFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createdAlarms", GoMethod: "CreatedAlarms"},
			_jsii_.MemberMethod{JsiiMethod: "createErrorCountWidget", GoMethod: "CreateErrorCountWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createErrorRateWidget", GoMethod: "CreateErrorRateWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createLatencyWidget", GoMethod: "CreateLatencyWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createMetricFactory", GoMethod: "CreateMetricFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createTpsWidget", GoMethod: "CreateTpsWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createtTitleWidget", GoMethod: "CreatetTitleWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createWidgetFactory", GoMethod: "CreateWidgetFactory"},
			_jsii_.MemberProperty{JsiiProperty: "error4xxCountMetric", GoGetter: "Error4xxCountMetric"},
			_jsii_.MemberProperty{JsiiProperty: "error4xxRateMetric", GoGetter: "Error4xxRateMetric"},
			_jsii_.MemberProperty{JsiiProperty: "errorAlarmFactory", GoGetter: "ErrorAlarmFactory"},
			_jsii_.MemberProperty{JsiiProperty: "errorCountAnnotations", GoGetter: "ErrorCountAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "errorRateAnnotations", GoGetter: "ErrorRateAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "fault5xxCountMetric", GoGetter: "Fault5xxCountMetric"},
			_jsii_.MemberProperty{JsiiProperty: "fault5xxRateMetric", GoGetter: "Fault5xxRateMetric"},
			_jsii_.MemberProperty{JsiiProperty: "latencyAlarmFactory", GoGetter: "LatencyAlarmFactory"},
			_jsii_.MemberProperty{JsiiProperty: "latencyAnnotations", GoGetter: "LatencyAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "localAlarmNamePrefixOverride", GoGetter: "LocalAlarmNamePrefixOverride"},
			_jsii_.MemberProperty{JsiiProperty: "metricFactory", GoGetter: "MetricFactory"},
			_jsii_.MemberProperty{JsiiProperty: "namingStrategy", GoGetter: "NamingStrategy"},
			_jsii_.MemberProperty{JsiiProperty: "p50LatencyMetric", GoGetter: "P50LatencyMetric"},
			_jsii_.MemberProperty{JsiiProperty: "p90LatencyMetric", GoGetter: "P90LatencyMetric"},
			_jsii_.MemberProperty{JsiiProperty: "p99LatencyMetric", GoGetter: "P99LatencyMetric"},
			_jsii_.MemberProperty{JsiiProperty: "scope", GoGetter: "Scope"},
			_jsii_.MemberMethod{JsiiMethod: "summaryWidgets", GoMethod: "SummaryWidgets"},
			_jsii_.MemberProperty{JsiiProperty: "title", GoGetter: "Title"},
			_jsii_.MemberProperty{JsiiProperty: "tpsAlarmFactory", GoGetter: "TpsAlarmFactory"},
			_jsii_.MemberProperty{JsiiProperty: "tpsAnnotations", GoGetter: "TpsAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "tpsMetric", GoGetter: "TpsMetric"},
			_jsii_.MemberMethod{JsiiMethod: "widgets", GoMethod: "Widgets"},
		},
		func() interface{} {
			j := jsiiProxy_AppSyncMonitoring{}
			_jsii_.InitJsiiProxy(&j.jsiiProxy_Monitoring)
			return &j
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.AppSyncMonitoringOptions",
		reflect.TypeOf((*AppSyncMonitoringOptions)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.AppSyncMonitoringProps",
		reflect.TypeOf((*AppSyncMonitoringProps)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.ApplicationLoadBalancerMetricFactory",
		reflect.TypeOf((*ApplicationLoadBalancerMetricFactory)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberProperty{JsiiProperty: "applicationLoadBalancer", GoGetter: "ApplicationLoadBalancer"},
			_jsii_.MemberProperty{JsiiProperty: "applicationTargetGroup", GoGetter: "ApplicationTargetGroup"},
			_jsii_.MemberMethod{JsiiMethod: "metricActiveConnectionCount", GoMethod: "MetricActiveConnectionCount"},
			_jsii_.MemberProperty{JsiiProperty: "metricFactory", GoGetter: "MetricFactory"},
			_jsii_.MemberMethod{JsiiMethod: "metricHealthyTaskCount", GoMethod: "MetricHealthyTaskCount"},
			_jsii_.MemberMethod{JsiiMethod: "metricHealthyTaskInPercent", GoMethod: "MetricHealthyTaskInPercent"},
			_jsii_.MemberMethod{JsiiMethod: "metricNewConnectionCount", GoMethod: "MetricNewConnectionCount"},
			_jsii_.MemberMethod{JsiiMethod: "metricProcessedBytesMin", GoMethod: "MetricProcessedBytesMin"},
			_jsii_.MemberMethod{JsiiMethod: "metricUnhealthyTaskCount", GoMethod: "MetricUnhealthyTaskCount"},
		},
		func() interface{} {
			j := jsiiProxy_ApplicationLoadBalancerMetricFactory{}
			_jsii_.InitJsiiProxy(&j.jsiiProxy_ILoadBalancerMetricFactory)
			return &j
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.ApplicationLoadBalancerMetricFactoryProps",
		reflect.TypeOf((*ApplicationLoadBalancerMetricFactoryProps)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.AutoScalingGroupMetricFactory",
		reflect.TypeOf((*AutoScalingGroupMetricFactory)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberProperty{JsiiProperty: "dimensionsMap", GoGetter: "DimensionsMap"},
			_jsii_.MemberProperty{JsiiProperty: "metricFactory", GoGetter: "MetricFactory"},
			_jsii_.MemberMethod{JsiiMethod: "metricGroupDesiredCapacity", GoMethod: "MetricGroupDesiredCapacity"},
			_jsii_.MemberMethod{JsiiMethod: "metricGroupInServiceInstances", GoMethod: "MetricGroupInServiceInstances"},
			_jsii_.MemberMethod{JsiiMethod: "metricGroupMaxSize", GoMethod: "MetricGroupMaxSize"},
			_jsii_.MemberMethod{JsiiMethod: "metricGroupMinSize", GoMethod: "MetricGroupMinSize"},
			_jsii_.MemberMethod{JsiiMethod: "metricGroupPendingInstances", GoMethod: "MetricGroupPendingInstances"},
			_jsii_.MemberMethod{JsiiMethod: "metricGroupStandbyInstances", GoMethod: "MetricGroupStandbyInstances"},
			_jsii_.MemberMethod{JsiiMethod: "metricGroupTerminatingInstances", GoMethod: "MetricGroupTerminatingInstances"},
			_jsii_.MemberMethod{JsiiMethod: "metricGroupTotalInstances", GoMethod: "MetricGroupTotalInstances"},
		},
		func() interface{} {
			return &jsiiProxy_AutoScalingGroupMetricFactory{}
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.AutoScalingGroupMetricFactoryProps",
		reflect.TypeOf((*AutoScalingGroupMetricFactoryProps)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.AutoScalingGroupMonitoring",
		reflect.TypeOf((*AutoScalingGroupMonitoring)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "addAlarm", GoMethod: "AddAlarm"},
			_jsii_.MemberProperty{JsiiProperty: "alarms", GoGetter: "Alarms"},
			_jsii_.MemberMethod{JsiiMethod: "alarmWidgets", GoMethod: "AlarmWidgets"},
			_jsii_.MemberMethod{JsiiMethod: "createAlarmFactory", GoMethod: "CreateAlarmFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createdAlarms", GoMethod: "CreatedAlarms"},
			_jsii_.MemberMethod{JsiiMethod: "createGroupSizeWidget", GoMethod: "CreateGroupSizeWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createGroupStatusWidget", GoMethod: "CreateGroupStatusWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createMetricFactory", GoMethod: "CreateMetricFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createTitleWidget", GoMethod: "CreateTitleWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createWidgetFactory", GoMethod: "CreateWidgetFactory"},
			_jsii_.MemberProperty{JsiiProperty: "groupDesiredSizeMetric", GoGetter: "GroupDesiredSizeMetric"},
			_jsii_.MemberProperty{JsiiProperty: "groupMaxSizeMetric", GoGetter: "GroupMaxSizeMetric"},
			_jsii_.MemberProperty{JsiiProperty: "groupMinSizeMetric", GoGetter: "GroupMinSizeMetric"},
			_jsii_.MemberProperty{JsiiProperty: "instancesInServiceMetric", GoGetter: "InstancesInServiceMetric"},
			_jsii_.MemberProperty{JsiiProperty: "instancesPendingMetric", GoGetter: "InstancesPendingMetric"},
			_jsii_.MemberProperty{JsiiProperty: "instancesStandbyMetric", GoGetter: "InstancesStandbyMetric"},
			_jsii_.MemberProperty{JsiiProperty: "instancesTerminatingMetric", GoGetter: "InstancesTerminatingMetric"},
			_jsii_.MemberProperty{JsiiProperty: "instancesTotalMetric", GoGetter: "InstancesTotalMetric"},
			_jsii_.MemberProperty{JsiiProperty: "localAlarmNamePrefixOverride", GoGetter: "LocalAlarmNamePrefixOverride"},
			_jsii_.MemberProperty{JsiiProperty: "scope", GoGetter: "Scope"},
			_jsii_.MemberMethod{JsiiMethod: "summaryWidgets", GoMethod: "SummaryWidgets"},
			_jsii_.MemberProperty{JsiiProperty: "title", GoGetter: "Title"},
			_jsii_.MemberMethod{JsiiMethod: "widgets", GoMethod: "Widgets"},
		},
		func() interface{} {
			j := jsiiProxy_AutoScalingGroupMonitoring{}
			_jsii_.InitJsiiProxy(&j.jsiiProxy_Monitoring)
			return &j
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.AutoScalingGroupMonitoringOptions",
		reflect.TypeOf((*AutoScalingGroupMonitoringOptions)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.AutoScalingGroupMonitoringProps",
		reflect.TypeOf((*AutoScalingGroupMonitoringProps)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.AvailabilityThreshold",
		reflect.TypeOf((*AvailabilityThreshold)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.AwsConsoleUrlFactory",
		reflect.TypeOf((*AwsConsoleUrlFactory)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberProperty{JsiiProperty: "awsAccountId", GoGetter: "AwsAccountId"},
			_jsii_.MemberProperty{JsiiProperty: "awsAccountRegion", GoGetter: "AwsAccountRegion"},
			_jsii_.MemberMethod{JsiiMethod: "getApiGatewayUrl", GoMethod: "GetApiGatewayUrl"},
			_jsii_.MemberMethod{JsiiMethod: "getAwsConsoleUrl", GoMethod: "GetAwsConsoleUrl"},
			_jsii_.MemberMethod{JsiiMethod: "getCloudFrontDistributionUrl", GoMethod: "GetCloudFrontDistributionUrl"},
			_jsii_.MemberMethod{JsiiMethod: "getCloudWatchLogGroupUrl", GoMethod: "GetCloudWatchLogGroupUrl"},
			_jsii_.MemberMethod{JsiiMethod: "getCodeBuildProjectUrl", GoMethod: "GetCodeBuildProjectUrl"},
			_jsii_.MemberMethod{JsiiMethod: "getDocumentDbClusterUrl", GoMethod: "GetDocumentDbClusterUrl"},
			_jsii_.MemberMethod{JsiiMethod: "getDynamoTableUrl", GoMethod: "GetDynamoTableUrl"},
			_jsii_.MemberMethod{JsiiMethod: "getElastiCacheClusterUrl", GoMethod: "GetElastiCacheClusterUrl"},
			_jsii_.MemberMethod{JsiiMethod: "getKinesisAnalyticsUrl", GoMethod: "GetKinesisAnalyticsUrl"},
			_jsii_.MemberMethod{JsiiMethod: "getKinesisDataStreamUrl", GoMethod: "GetKinesisDataStreamUrl"},
			_jsii_.MemberMethod{JsiiMethod: "getKinesisFirehoseDeliveryStreamUrl", GoMethod: "GetKinesisFirehoseDeliveryStreamUrl"},
			_jsii_.MemberMethod{JsiiMethod: "getLambdaFunctionUrl", GoMethod: "GetLambdaFunctionUrl"},
			_jsii_.MemberMethod{JsiiMethod: "getOpenSearchClusterUrl", GoMethod: "GetOpenSearchClusterUrl"},
			_jsii_.MemberMethod{JsiiMethod: "getRdsClusterUrl", GoMethod: "GetRdsClusterUrl"},
			_jsii_.MemberMethod{JsiiMethod: "getRedshiftClusterUrl", GoMethod: "GetRedshiftClusterUrl"},
			_jsii_.MemberMethod{JsiiMethod: "getResolvedDestinationUrl", GoMethod: "GetResolvedDestinationUrl"},
			_jsii_.MemberMethod{JsiiMethod: "getS3BucketUrl", GoMethod: "GetS3BucketUrl"},
			_jsii_.MemberMethod{JsiiMethod: "getSnsTopicUrl", GoMethod: "GetSnsTopicUrl"},
			_jsii_.MemberMethod{JsiiMethod: "getSqsQueueUrl", GoMethod: "GetSqsQueueUrl"},
			_jsii_.MemberMethod{JsiiMethod: "getStateMachineUrl", GoMethod: "GetStateMachineUrl"},
		},
		func() interface{} {
			return &jsiiProxy_AwsConsoleUrlFactory{}
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.AwsConsoleUrlFactoryProps",
		reflect.TypeOf((*AwsConsoleUrlFactoryProps)(nil)).Elem(),
	)
	_jsii_.RegisterEnum(
		"cdk-monitoring-constructs.AxisPosition",
		reflect.TypeOf((*AxisPosition)(nil)).Elem(),
		map[string]interface{}{
			"LEFT": AxisPosition_LEFT,
			"RIGHT": AxisPosition_RIGHT,
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.BaseDlqAlarms",
		reflect.TypeOf((*BaseDlqAlarms)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.BaseEc2ServiceAlarms",
		reflect.TypeOf((*BaseEc2ServiceAlarms)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.BaseFargateServiceAlarms",
		reflect.TypeOf((*BaseFargateServiceAlarms)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.BaseMonitoringProps",
		reflect.TypeOf((*BaseMonitoringProps)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.BaseServiceMetricFactory",
		reflect.TypeOf((*BaseServiceMetricFactory)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "metricClusterCpuUtilisationInPercent", GoMethod: "MetricClusterCpuUtilisationInPercent"},
			_jsii_.MemberMethod{JsiiMethod: "metricClusterMemoryUtilisationInPercent", GoMethod: "MetricClusterMemoryUtilisationInPercent"},
			_jsii_.MemberProperty{JsiiProperty: "metricFactory", GoGetter: "MetricFactory"},
			_jsii_.MemberMethod{JsiiMethod: "metricRunningTaskCount", GoMethod: "MetricRunningTaskCount"},
			_jsii_.MemberProperty{JsiiProperty: "service", GoGetter: "Service"},
		},
		func() interface{} {
			return &jsiiProxy_BaseServiceMetricFactory{}
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.BaseServiceMetricFactoryProps",
		reflect.TypeOf((*BaseServiceMetricFactoryProps)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.BaseSqsQueueAlarms",
		reflect.TypeOf((*BaseSqsQueueAlarms)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.BillingMetricFactory",
		reflect.TypeOf((*BillingMetricFactory)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "metricSearchTopCostByServiceInUsd", GoMethod: "MetricSearchTopCostByServiceInUsd"},
			_jsii_.MemberMethod{JsiiMethod: "metricTotalCostInUsd", GoMethod: "MetricTotalCostInUsd"},
		},
		func() interface{} {
			return &jsiiProxy_BillingMetricFactory{}
		},
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.BillingMonitoring",
		reflect.TypeOf((*BillingMonitoring)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "addAlarm", GoMethod: "AddAlarm"},
			_jsii_.MemberProperty{JsiiProperty: "alarms", GoGetter: "Alarms"},
			_jsii_.MemberMethod{JsiiMethod: "alarmWidgets", GoMethod: "AlarmWidgets"},
			_jsii_.MemberProperty{JsiiProperty: "costByServiceMetric", GoGetter: "CostByServiceMetric"},
			_jsii_.MemberMethod{JsiiMethod: "createAlarmFactory", GoMethod: "CreateAlarmFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createChargesByServiceWidget", GoMethod: "CreateChargesByServiceWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createdAlarms", GoMethod: "CreatedAlarms"},
			_jsii_.MemberMethod{JsiiMethod: "createMetricFactory", GoMethod: "CreateMetricFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createTitleWidget", GoMethod: "CreateTitleWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createTotalChargesWidget", GoMethod: "CreateTotalChargesWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createWidgetFactory", GoMethod: "CreateWidgetFactory"},
			_jsii_.MemberProperty{JsiiProperty: "localAlarmNamePrefixOverride", GoGetter: "LocalAlarmNamePrefixOverride"},
			_jsii_.MemberProperty{JsiiProperty: "scope", GoGetter: "Scope"},
			_jsii_.MemberMethod{JsiiMethod: "summaryWidgets", GoMethod: "SummaryWidgets"},
			_jsii_.MemberProperty{JsiiProperty: "totalCostMetric", GoGetter: "TotalCostMetric"},
			_jsii_.MemberMethod{JsiiMethod: "widgets", GoMethod: "Widgets"},
		},
		func() interface{} {
			j := jsiiProxy_BillingMonitoring{}
			_jsii_.InitJsiiProxy(&j.jsiiProxy_Monitoring)
			return &j
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.BillingMonitoringOptions",
		reflect.TypeOf((*BillingMonitoringOptions)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.BillingMonitoringProps",
		reflect.TypeOf((*BillingMonitoringProps)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.BitmapDashboard",
		reflect.TypeOf((*BitmapDashboard)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "addWidgets", GoMethod: "AddWidgets"},
			_jsii_.MemberMethod{JsiiMethod: "applyRemovalPolicy", GoMethod: "ApplyRemovalPolicy"},
			_jsii_.MemberMethod{JsiiMethod: "asBitmap", GoMethod: "AsBitmap"},
			_jsii_.MemberMethod{JsiiMethod: "asBitmaps", GoMethod: "AsBitmaps"},
			_jsii_.MemberProperty{JsiiProperty: "bitmapRenderingSupport", GoGetter: "BitmapRenderingSupport"},
			_jsii_.MemberProperty{JsiiProperty: "env", GoGetter: "Env"},
			_jsii_.MemberMethod{JsiiMethod: "generatePhysicalName", GoMethod: "GeneratePhysicalName"},
			_jsii_.MemberMethod{JsiiMethod: "getResourceArnAttribute", GoMethod: "GetResourceArnAttribute"},
			_jsii_.MemberMethod{JsiiMethod: "getResourceNameAttribute", GoMethod: "GetResourceNameAttribute"},
			_jsii_.MemberProperty{JsiiProperty: "node", GoGetter: "Node"},
			_jsii_.MemberProperty{JsiiProperty: "physicalName", GoGetter: "PhysicalName"},
			_jsii_.MemberProperty{JsiiProperty: "stack", GoGetter: "Stack"},
			_jsii_.MemberMethod{JsiiMethod: "toString", GoMethod: "ToString"},
		},
		func() interface{} {
			j := jsiiProxy_BitmapDashboard{}
			_jsii_.InitJsiiProxy(&j.Type__awscloudwatchDashboard)
			return &j
		},
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.BitmapWidgetRenderingSupport",
		reflect.TypeOf((*BitmapWidgetRenderingSupport)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "asBitmap", GoMethod: "AsBitmap"},
			_jsii_.MemberMethod{JsiiMethod: "getWidgetProperties", GoMethod: "GetWidgetProperties"},
			_jsii_.MemberProperty{JsiiProperty: "handler", GoGetter: "Handler"},
			_jsii_.MemberProperty{JsiiProperty: "node", GoGetter: "Node"},
			_jsii_.MemberMethod{JsiiMethod: "toString", GoMethod: "ToString"},
		},
		func() interface{} {
			j := jsiiProxy_BitmapWidgetRenderingSupport{}
			_jsii_.InitJsiiProxy(&j.Type__constructsConstruct)
			return &j
		},
	)
	_jsii_.RegisterEnum(
		"cdk-monitoring-constructs.CapacityType",
		reflect.TypeOf((*CapacityType)(nil)).Elem(),
		map[string]interface{}{
			"READ": CapacityType_READ,
			"WRITE": CapacityType_WRITE,
		},
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.CertificateManagerMetricFactory",
		reflect.TypeOf((*CertificateManagerMetricFactory)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberProperty{JsiiProperty: "dimensionsMap", GoGetter: "DimensionsMap"},
			_jsii_.MemberMethod{JsiiMethod: "metricDaysToExpiry", GoMethod: "MetricDaysToExpiry"},
			_jsii_.MemberProperty{JsiiProperty: "metricFactory", GoGetter: "MetricFactory"},
		},
		func() interface{} {
			return &jsiiProxy_CertificateManagerMetricFactory{}
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.CertificateManagerMetricFactoryProps",
		reflect.TypeOf((*CertificateManagerMetricFactoryProps)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.CertificateManagerMonitoring",
		reflect.TypeOf((*CertificateManagerMonitoring)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "addAlarm", GoMethod: "AddAlarm"},
			_jsii_.MemberProperty{JsiiProperty: "alarms", GoGetter: "Alarms"},
			_jsii_.MemberMethod{JsiiMethod: "alarmWidgets", GoMethod: "AlarmWidgets"},
			_jsii_.MemberMethod{JsiiMethod: "createAlarmFactory", GoMethod: "CreateAlarmFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createdAlarms", GoMethod: "CreatedAlarms"},
			_jsii_.MemberMethod{JsiiMethod: "createDaysToExpiryWidget", GoMethod: "CreateDaysToExpiryWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createMetricFactory", GoMethod: "CreateMetricFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createTitleWidget", GoMethod: "CreateTitleWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createWidgetFactory", GoMethod: "CreateWidgetFactory"},
			_jsii_.MemberProperty{JsiiProperty: "daysToExpiryAnnotations", GoGetter: "DaysToExpiryAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "daysToExpiryMetric", GoGetter: "DaysToExpiryMetric"},
			_jsii_.MemberProperty{JsiiProperty: "localAlarmNamePrefixOverride", GoGetter: "LocalAlarmNamePrefixOverride"},
			_jsii_.MemberProperty{JsiiProperty: "scope", GoGetter: "Scope"},
			_jsii_.MemberMethod{JsiiMethod: "summaryWidgets", GoMethod: "SummaryWidgets"},
			_jsii_.MemberProperty{JsiiProperty: "title", GoGetter: "Title"},
			_jsii_.MemberMethod{JsiiMethod: "widgets", GoMethod: "Widgets"},
		},
		func() interface{} {
			j := jsiiProxy_CertificateManagerMonitoring{}
			_jsii_.InitJsiiProxy(&j.jsiiProxy_Monitoring)
			return &j
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.CertificateManagerMonitoringOptions",
		reflect.TypeOf((*CertificateManagerMonitoringOptions)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.CertificateManagerMonitoringProps",
		reflect.TypeOf((*CertificateManagerMonitoringProps)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.CloudFrontDistributionMetricFactory",
		reflect.TypeOf((*CloudFrontDistributionMetricFactory)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "metric4xxErrorRateAverage", GoMethod: "Metric4xxErrorRateAverage"},
			_jsii_.MemberMethod{JsiiMethod: "metric5xxErrorRateAverage", GoMethod: "Metric5xxErrorRateAverage"},
			_jsii_.MemberMethod{JsiiMethod: "metricCacheHitRateAverageInPercent", GoMethod: "MetricCacheHitRateAverageInPercent"},
			_jsii_.MemberMethod{JsiiMethod: "metricRequestCount", GoMethod: "MetricRequestCount"},
			_jsii_.MemberMethod{JsiiMethod: "metricRequestRate", GoMethod: "MetricRequestRate"},
			_jsii_.MemberMethod{JsiiMethod: "metricRequestTps", GoMethod: "MetricRequestTps"},
			_jsii_.MemberMethod{JsiiMethod: "metricTotalBytesDownloaded", GoMethod: "MetricTotalBytesDownloaded"},
			_jsii_.MemberMethod{JsiiMethod: "metricTotalBytesUploaded", GoMethod: "MetricTotalBytesUploaded"},
			_jsii_.MemberMethod{JsiiMethod: "metricTotalErrorRateAverage", GoMethod: "MetricTotalErrorRateAverage"},
		},
		func() interface{} {
			return &jsiiProxy_CloudFrontDistributionMetricFactory{}
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.CloudFrontDistributionMetricFactoryProps",
		reflect.TypeOf((*CloudFrontDistributionMetricFactoryProps)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.CloudFrontDistributionMonitoring",
		reflect.TypeOf((*CloudFrontDistributionMonitoring)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "addAlarm", GoMethod: "AddAlarm"},
			_jsii_.MemberProperty{JsiiProperty: "additionalMetricsEnabled", GoGetter: "AdditionalMetricsEnabled"},
			_jsii_.MemberProperty{JsiiProperty: "alarmFactory", GoGetter: "AlarmFactory"},
			_jsii_.MemberProperty{JsiiProperty: "alarms", GoGetter: "Alarms"},
			_jsii_.MemberMethod{JsiiMethod: "alarmWidgets", GoMethod: "AlarmWidgets"},
			_jsii_.MemberProperty{JsiiProperty: "cacheHitRate", GoGetter: "CacheHitRate"},
			_jsii_.MemberMethod{JsiiMethod: "createAlarmFactory", GoMethod: "CreateAlarmFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createCacheWidget", GoMethod: "CreateCacheWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createdAlarms", GoMethod: "CreatedAlarms"},
			_jsii_.MemberMethod{JsiiMethod: "createErrorRateWidget", GoMethod: "CreateErrorRateWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createMetricFactory", GoMethod: "CreateMetricFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createTitleWidget", GoMethod: "CreateTitleWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createTpsWidget", GoMethod: "CreateTpsWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createTrafficWidget", GoMethod: "CreateTrafficWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createWidgetFactory", GoMethod: "CreateWidgetFactory"},
			_jsii_.MemberProperty{JsiiProperty: "downloadedBytesMetric", GoGetter: "DownloadedBytesMetric"},
			_jsii_.MemberProperty{JsiiProperty: "error4xxRate", GoGetter: "Error4xxRate"},
			_jsii_.MemberProperty{JsiiProperty: "error5xxRate", GoGetter: "Error5xxRate"},
			_jsii_.MemberProperty{JsiiProperty: "errorAlarmFactory", GoGetter: "ErrorAlarmFactory"},
			_jsii_.MemberProperty{JsiiProperty: "errorRateAnnotations", GoGetter: "ErrorRateAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "localAlarmNamePrefixOverride", GoGetter: "LocalAlarmNamePrefixOverride"},
			_jsii_.MemberProperty{JsiiProperty: "namingStrategy", GoGetter: "NamingStrategy"},
			_jsii_.MemberProperty{JsiiProperty: "scope", GoGetter: "Scope"},
			_jsii_.MemberMethod{JsiiMethod: "summaryWidgets", GoMethod: "SummaryWidgets"},
			_jsii_.MemberProperty{JsiiProperty: "tpsAlarmFactory", GoGetter: "TpsAlarmFactory"},
			_jsii_.MemberProperty{JsiiProperty: "tpsAnnotations", GoGetter: "TpsAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "tpsMetric", GoGetter: "TpsMetric"},
			_jsii_.MemberProperty{JsiiProperty: "uploadedBytesMetric", GoGetter: "UploadedBytesMetric"},
			_jsii_.MemberMethod{JsiiMethod: "widgets", GoMethod: "Widgets"},
		},
		func() interface{} {
			j := jsiiProxy_CloudFrontDistributionMonitoring{}
			_jsii_.InitJsiiProxy(&j.jsiiProxy_Monitoring)
			return &j
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.CloudFrontDistributionMonitoringOptions",
		reflect.TypeOf((*CloudFrontDistributionMonitoringOptions)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.CloudFrontDistributionMonitoringProps",
		reflect.TypeOf((*CloudFrontDistributionMonitoringProps)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.CodeBuildProjectMetricFactory",
		reflect.TypeOf((*CodeBuildProjectMetricFactory)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberProperty{JsiiProperty: "dimensionsMap", GoGetter: "DimensionsMap"},
			_jsii_.MemberMethod{JsiiMethod: "metricBuildCount", GoMethod: "MetricBuildCount"},
			_jsii_.MemberMethod{JsiiMethod: "metricDurationP50InSeconds", GoMethod: "MetricDurationP50InSeconds"},
			_jsii_.MemberMethod{JsiiMethod: "metricDurationP90InSeconds", GoMethod: "MetricDurationP90InSeconds"},
			_jsii_.MemberMethod{JsiiMethod: "metricDurationP99InSeconds", GoMethod: "MetricDurationP99InSeconds"},
			_jsii_.MemberProperty{JsiiProperty: "metricFactory", GoGetter: "MetricFactory"},
			_jsii_.MemberMethod{JsiiMethod: "metricFailedBuildCount", GoMethod: "MetricFailedBuildCount"},
			_jsii_.MemberMethod{JsiiMethod: "metricFailedBuildRate", GoMethod: "MetricFailedBuildRate"},
			_jsii_.MemberMethod{JsiiMethod: "metricSucceededBuildCount", GoMethod: "MetricSucceededBuildCount"},
			_jsii_.MemberProperty{JsiiProperty: "project", GoGetter: "Project"},
		},
		func() interface{} {
			return &jsiiProxy_CodeBuildProjectMetricFactory{}
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.CodeBuildProjectMetricFactoryProps",
		reflect.TypeOf((*CodeBuildProjectMetricFactoryProps)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.CodeBuildProjectMonitoring",
		reflect.TypeOf((*CodeBuildProjectMonitoring)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "addAlarm", GoMethod: "AddAlarm"},
			_jsii_.MemberProperty{JsiiProperty: "alarms", GoGetter: "Alarms"},
			_jsii_.MemberMethod{JsiiMethod: "alarmWidgets", GoMethod: "AlarmWidgets"},
			_jsii_.MemberProperty{JsiiProperty: "buildCountMetric", GoGetter: "BuildCountMetric"},
			_jsii_.MemberMethod{JsiiMethod: "createAlarmFactory", GoMethod: "CreateAlarmFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createBuildCountsWidget", GoMethod: "CreateBuildCountsWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createdAlarms", GoMethod: "CreatedAlarms"},
			_jsii_.MemberMethod{JsiiMethod: "createDurationWidget", GoMethod: "CreateDurationWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createFailedBuildRateWidget", GoMethod: "CreateFailedBuildRateWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createMetricFactory", GoMethod: "CreateMetricFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createTitleWidget", GoMethod: "CreateTitleWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createWidgetFactory", GoMethod: "CreateWidgetFactory"},
			_jsii_.MemberProperty{JsiiProperty: "durationAlarmFactory", GoGetter: "DurationAlarmFactory"},
			_jsii_.MemberProperty{JsiiProperty: "durationAnnotations", GoGetter: "DurationAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "durationP50InSecondsMetric", GoGetter: "DurationP50InSecondsMetric"},
			_jsii_.MemberProperty{JsiiProperty: "durationP90InSecondsMetric", GoGetter: "DurationP90InSecondsMetric"},
			_jsii_.MemberProperty{JsiiProperty: "durationP99InSecondsMetric", GoGetter: "DurationP99InSecondsMetric"},
			_jsii_.MemberProperty{JsiiProperty: "errorAlarmFactory", GoGetter: "ErrorAlarmFactory"},
			_jsii_.MemberProperty{JsiiProperty: "errorCountAnnotations", GoGetter: "ErrorCountAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "errorRateAnnotations", GoGetter: "ErrorRateAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "failedBuildCountMetric", GoGetter: "FailedBuildCountMetric"},
			_jsii_.MemberProperty{JsiiProperty: "failedBuildRateMetric", GoGetter: "FailedBuildRateMetric"},
			_jsii_.MemberProperty{JsiiProperty: "localAlarmNamePrefixOverride", GoGetter: "LocalAlarmNamePrefixOverride"},
			_jsii_.MemberProperty{JsiiProperty: "projectUrl", GoGetter: "ProjectUrl"},
			_jsii_.MemberMethod{JsiiMethod: "resolveProjectName", GoMethod: "ResolveProjectName"},
			_jsii_.MemberProperty{JsiiProperty: "scope", GoGetter: "Scope"},
			_jsii_.MemberProperty{JsiiProperty: "succeededBuildCountMetric", GoGetter: "SucceededBuildCountMetric"},
			_jsii_.MemberMethod{JsiiMethod: "summaryWidgets", GoMethod: "SummaryWidgets"},
			_jsii_.MemberProperty{JsiiProperty: "title", GoGetter: "Title"},
			_jsii_.MemberMethod{JsiiMethod: "widgets", GoMethod: "Widgets"},
		},
		func() interface{} {
			j := jsiiProxy_CodeBuildProjectMonitoring{}
			_jsii_.InitJsiiProxy(&j.jsiiProxy_Monitoring)
			return &j
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.CodeBuildProjectMonitoringOptions",
		reflect.TypeOf((*CodeBuildProjectMonitoringOptions)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.CodeBuildProjectMonitoringProps",
		reflect.TypeOf((*CodeBuildProjectMonitoringProps)(nil)).Elem(),
	)
	_jsii_.RegisterEnum(
		"cdk-monitoring-constructs.CompositeAlarmOperator",
		reflect.TypeOf((*CompositeAlarmOperator)(nil)).Elem(),
		map[string]interface{}{
			"AND": CompositeAlarmOperator_AND,
			"OR": CompositeAlarmOperator_OR,
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.ConsumedCapacityThreshold",
		reflect.TypeOf((*ConsumedCapacityThreshold)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.CustomAlarmFactory",
		reflect.TypeOf((*CustomAlarmFactory)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "addCustomAlarm", GoMethod: "AddCustomAlarm"},
			_jsii_.MemberProperty{JsiiProperty: "alarmFactory", GoGetter: "AlarmFactory"},
		},
		func() interface{} {
			return &jsiiProxy_CustomAlarmFactory{}
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.CustomAlarmThreshold",
		reflect.TypeOf((*CustomAlarmThreshold)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.CustomEc2ServiceMonitoringProps",
		reflect.TypeOf((*CustomEc2ServiceMonitoringProps)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.CustomFargateServiceMonitoringProps",
		reflect.TypeOf((*CustomFargateServiceMonitoringProps)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.CustomMetricGroup",
		reflect.TypeOf((*CustomMetricGroup)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.CustomMetricGroupWithAnnotations",
		reflect.TypeOf((*CustomMetricGroupWithAnnotations)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.CustomMetricSearch",
		reflect.TypeOf((*CustomMetricSearch)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.CustomMetricWithAlarm",
		reflect.TypeOf((*CustomMetricWithAlarm)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.CustomMetricWithAnomalyDetection",
		reflect.TypeOf((*CustomMetricWithAnomalyDetection)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.CustomMonitoring",
		reflect.TypeOf((*CustomMonitoring)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "addAlarm", GoMethod: "AddAlarm"},
			_jsii_.MemberProperty{JsiiProperty: "alarms", GoGetter: "Alarms"},
			_jsii_.MemberMethod{JsiiMethod: "alarmWidgets", GoMethod: "AlarmWidgets"},
			_jsii_.MemberProperty{JsiiProperty: "anomalyDetectingAlarmFactory", GoGetter: "AnomalyDetectingAlarmFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createAlarmFactory", GoMethod: "CreateAlarmFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createdAlarms", GoMethod: "CreatedAlarms"},
			_jsii_.MemberMethod{JsiiMethod: "createMetricFactory", GoMethod: "CreateMetricFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createWidgetFactory", GoMethod: "CreateWidgetFactory"},
			_jsii_.MemberProperty{JsiiProperty: "customAlarmFactory", GoGetter: "CustomAlarmFactory"},
			_jsii_.MemberProperty{JsiiProperty: "description", GoGetter: "Description"},
			_jsii_.MemberProperty{JsiiProperty: "descriptionWidgetHeight", GoGetter: "DescriptionWidgetHeight"},
			_jsii_.MemberProperty{JsiiProperty: "localAlarmNamePrefixOverride", GoGetter: "LocalAlarmNamePrefixOverride"},
			_jsii_.MemberProperty{JsiiProperty: "metricGroups", GoGetter: "MetricGroups"},
			_jsii_.MemberProperty{JsiiProperty: "scope", GoGetter: "Scope"},
			_jsii_.MemberMethod{JsiiMethod: "summaryWidgets", GoMethod: "SummaryWidgets"},
			_jsii_.MemberProperty{JsiiProperty: "title", GoGetter: "Title"},
			_jsii_.MemberMethod{JsiiMethod: "widgets", GoMethod: "Widgets"},
		},
		func() interface{} {
			j := jsiiProxy_CustomMonitoring{}
			_jsii_.InitJsiiProxy(&j.jsiiProxy_Monitoring)
			return &j
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.CustomMonitoringProps",
		reflect.TypeOf((*CustomMonitoringProps)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.CustomThreshold",
		reflect.TypeOf((*CustomThreshold)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.CustomWidget",
		reflect.TypeOf((*CustomWidget)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberProperty{JsiiProperty: "height", GoGetter: "Height"},
			_jsii_.MemberMethod{JsiiMethod: "position", GoMethod: "Position"},
			_jsii_.MemberMethod{JsiiMethod: "toJson", GoMethod: "ToJson"},
			_jsii_.MemberProperty{JsiiProperty: "width", GoGetter: "Width"},
			_jsii_.MemberProperty{JsiiProperty: "x", GoGetter: "X"},
			_jsii_.MemberProperty{JsiiProperty: "y", GoGetter: "Y"},
		},
		func() interface{} {
			j := jsiiProxy_CustomWidget{}
			_jsii_.InitJsiiProxy(&j.Type__awscloudwatchConcreteWidget)
			return &j
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.CustomWidgetProps",
		reflect.TypeOf((*CustomWidgetProps)(nil)).Elem(),
	)
	_jsii_.RegisterEnum(
		"cdk-monitoring-constructs.DashboardRenderingPreference",
		reflect.TypeOf((*DashboardRenderingPreference)(nil)).Elem(),
		map[string]interface{}{
			"INTERACTIVE_ONLY": DashboardRenderingPreference_INTERACTIVE_ONLY,
			"BITMAP_ONLY": DashboardRenderingPreference_BITMAP_ONLY,
			"INTERACTIVE_AND_BITMAP": DashboardRenderingPreference_INTERACTIVE_AND_BITMAP,
		},
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.DashboardWithBitmapCopy",
		reflect.TypeOf((*DashboardWithBitmapCopy)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "addWidgets", GoMethod: "AddWidgets"},
			_jsii_.MemberMethod{JsiiMethod: "applyRemovalPolicy", GoMethod: "ApplyRemovalPolicy"},
			_jsii_.MemberProperty{JsiiProperty: "bitmapCopy", GoGetter: "BitmapCopy"},
			_jsii_.MemberProperty{JsiiProperty: "env", GoGetter: "Env"},
			_jsii_.MemberMethod{JsiiMethod: "generatePhysicalName", GoMethod: "GeneratePhysicalName"},
			_jsii_.MemberMethod{JsiiMethod: "getResourceArnAttribute", GoMethod: "GetResourceArnAttribute"},
			_jsii_.MemberMethod{JsiiMethod: "getResourceNameAttribute", GoMethod: "GetResourceNameAttribute"},
			_jsii_.MemberProperty{JsiiProperty: "node", GoGetter: "Node"},
			_jsii_.MemberProperty{JsiiProperty: "physicalName", GoGetter: "PhysicalName"},
			_jsii_.MemberProperty{JsiiProperty: "stack", GoGetter: "Stack"},
			_jsii_.MemberMethod{JsiiMethod: "toString", GoMethod: "ToString"},
		},
		func() interface{} {
			j := jsiiProxy_DashboardWithBitmapCopy{}
			_jsii_.InitJsiiProxy(&j.Type__awscloudwatchDashboard)
			return &j
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.DaysSinceUpdateThreshold",
		reflect.TypeOf((*DaysSinceUpdateThreshold)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.DaysToExpiryThreshold",
		reflect.TypeOf((*DaysToExpiryThreshold)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.DefaultAlarmAnnotationStrategy",
		reflect.TypeOf((*DefaultAlarmAnnotationStrategy)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "createAnnotation", GoMethod: "CreateAnnotation"},
			_jsii_.MemberMethod{JsiiMethod: "createAnnotationToFill", GoMethod: "CreateAnnotationToFill"},
			_jsii_.MemberMethod{JsiiMethod: "getAlarmingRangeShade", GoMethod: "GetAlarmingRangeShade"},
		},
		func() interface{} {
			j := jsiiProxy_DefaultAlarmAnnotationStrategy{}
			_jsii_.InitJsiiProxy(&j.jsiiProxy_FillingAlarmAnnotationStrategy)
			return &j
		},
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.DefaultDashboardFactory",
		reflect.TypeOf((*DefaultDashboardFactory)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "addSegment", GoMethod: "AddSegment"},
			_jsii_.MemberProperty{JsiiProperty: "alarmDashboard", GoGetter: "AlarmDashboard"},
			_jsii_.MemberProperty{JsiiProperty: "anyDashboardCreated", GoGetter: "AnyDashboardCreated"},
			_jsii_.MemberMethod{JsiiMethod: "createdAlarmDashboard", GoMethod: "CreatedAlarmDashboard"},
			_jsii_.MemberMethod{JsiiMethod: "createDashboard", GoMethod: "CreateDashboard"},
			_jsii_.MemberMethod{JsiiMethod: "createdDashboard", GoMethod: "CreatedDashboard"},
			_jsii_.MemberMethod{JsiiMethod: "createdSummaryDashboard", GoMethod: "CreatedSummaryDashboard"},
			_jsii_.MemberProperty{JsiiProperty: "dashboard", GoGetter: "Dashboard"},
			_jsii_.MemberProperty{JsiiProperty: "node", GoGetter: "Node"},
			_jsii_.MemberProperty{JsiiProperty: "summaryDashboard", GoGetter: "SummaryDashboard"},
			_jsii_.MemberMethod{JsiiMethod: "toString", GoMethod: "ToString"},
		},
		func() interface{} {
			j := jsiiProxy_DefaultDashboardFactory{}
			_jsii_.InitJsiiProxy(&j.Type__constructsConstruct)
			_jsii_.InitJsiiProxy(&j.jsiiProxy_IDashboardFactory)
			return &j
		},
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.DefaultWidgetFactory",
		reflect.TypeOf((*DefaultWidgetFactory)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "createAlarmDetailWidget", GoMethod: "CreateAlarmDetailWidget"},
		},
		func() interface{} {
			j := jsiiProxy_DefaultWidgetFactory{}
			_jsii_.InitJsiiProxy(&j.jsiiProxy_IWidgetFactory)
			return &j
		},
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.DoNotModifyDedupeString",
		reflect.TypeOf((*DoNotModifyDedupeString)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "processDedupeString", GoMethod: "ProcessDedupeString"},
			_jsii_.MemberMethod{JsiiMethod: "processDedupeStringOverride", GoMethod: "ProcessDedupeStringOverride"},
		},
		func() interface{} {
			j := jsiiProxy_DoNotModifyDedupeString{}
			_jsii_.InitJsiiProxy(&j.jsiiProxy_ExtendDedupeString)
			return &j
		},
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.DocumentDbMetricFactory",
		reflect.TypeOf((*DocumentDbMetricFactory)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberProperty{JsiiProperty: "clusterIdentifier", GoGetter: "ClusterIdentifier"},
			_jsii_.MemberProperty{JsiiProperty: "dimensionsMap", GoGetter: "DimensionsMap"},
			_jsii_.MemberMethod{JsiiMethod: "metricAverageCpuUsageInPercent", GoMethod: "MetricAverageCpuUsageInPercent"},
			_jsii_.MemberProperty{JsiiProperty: "metricFactory", GoGetter: "MetricFactory"},
			_jsii_.MemberMethod{JsiiMethod: "metricMaxConnectionCount", GoMethod: "MetricMaxConnectionCount"},
			_jsii_.MemberMethod{JsiiMethod: "metricMaxCursorCount", GoMethod: "MetricMaxCursorCount"},
			_jsii_.MemberMethod{JsiiMethod: "metricMaxTransactionOpenCount", GoMethod: "MetricMaxTransactionOpenCount"},
			_jsii_.MemberMethod{JsiiMethod: "metricOperationsThrottledDueLowMemoryCount", GoMethod: "MetricOperationsThrottledDueLowMemoryCount"},
			_jsii_.MemberMethod{JsiiMethod: "metricReadLatencyInMillis", GoMethod: "MetricReadLatencyInMillis"},
			_jsii_.MemberMethod{JsiiMethod: "metricWriteLatencyInMillis", GoMethod: "MetricWriteLatencyInMillis"},
		},
		func() interface{} {
			return &jsiiProxy_DocumentDbMetricFactory{}
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.DocumentDbMetricFactoryProps",
		reflect.TypeOf((*DocumentDbMetricFactoryProps)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.DocumentDbMonitoring",
		reflect.TypeOf((*DocumentDbMonitoring)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "addAlarm", GoMethod: "AddAlarm"},
			_jsii_.MemberProperty{JsiiProperty: "alarms", GoGetter: "Alarms"},
			_jsii_.MemberMethod{JsiiMethod: "alarmWidgets", GoMethod: "AlarmWidgets"},
			_jsii_.MemberProperty{JsiiProperty: "connectionsMetric", GoGetter: "ConnectionsMetric"},
			_jsii_.MemberProperty{JsiiProperty: "cpuUsageMetric", GoGetter: "CpuUsageMetric"},
			_jsii_.MemberMethod{JsiiMethod: "createAlarmFactory", GoMethod: "CreateAlarmFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createConnectionsWidget", GoMethod: "CreateConnectionsWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createdAlarms", GoMethod: "CreatedAlarms"},
			_jsii_.MemberMethod{JsiiMethod: "createLatencyWidget", GoMethod: "CreateLatencyWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createMetricFactory", GoMethod: "CreateMetricFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createResourceUsageWidget", GoMethod: "CreateResourceUsageWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createTitleWidget", GoMethod: "CreateTitleWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createTransactionsWidget", GoMethod: "CreateTransactionsWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createWidgetFactory", GoMethod: "CreateWidgetFactory"},
			_jsii_.MemberProperty{JsiiProperty: "cursorsMetric", GoGetter: "CursorsMetric"},
			_jsii_.MemberProperty{JsiiProperty: "localAlarmNamePrefixOverride", GoGetter: "LocalAlarmNamePrefixOverride"},
			_jsii_.MemberProperty{JsiiProperty: "readLatencyMetric", GoGetter: "ReadLatencyMetric"},
			_jsii_.MemberProperty{JsiiProperty: "scope", GoGetter: "Scope"},
			_jsii_.MemberMethod{JsiiMethod: "summaryWidgets", GoMethod: "SummaryWidgets"},
			_jsii_.MemberProperty{JsiiProperty: "throttledMetric", GoGetter: "ThrottledMetric"},
			_jsii_.MemberProperty{JsiiProperty: "title", GoGetter: "Title"},
			_jsii_.MemberProperty{JsiiProperty: "transactionsMetric", GoGetter: "TransactionsMetric"},
			_jsii_.MemberProperty{JsiiProperty: "url", GoGetter: "Url"},
			_jsii_.MemberProperty{JsiiProperty: "usageAlarmFactory", GoGetter: "UsageAlarmFactory"},
			_jsii_.MemberProperty{JsiiProperty: "usageAnnotations", GoGetter: "UsageAnnotations"},
			_jsii_.MemberMethod{JsiiMethod: "widgets", GoMethod: "Widgets"},
			_jsii_.MemberProperty{JsiiProperty: "writeLatencyMetric", GoGetter: "WriteLatencyMetric"},
		},
		func() interface{} {
			j := jsiiProxy_DocumentDbMonitoring{}
			_jsii_.InitJsiiProxy(&j.jsiiProxy_Monitoring)
			return &j
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.DocumentDbMonitoringOptions",
		reflect.TypeOf((*DocumentDbMonitoringOptions)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.DocumentDbMonitoringProps",
		reflect.TypeOf((*DocumentDbMonitoringProps)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.DoubleAxisGraphWidget",
		reflect.TypeOf((*DoubleAxisGraphWidget)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "addLeftMetric", GoMethod: "AddLeftMetric"},
			_jsii_.MemberMethod{JsiiMethod: "addRightMetric", GoMethod: "AddRightMetric"},
			_jsii_.MemberProperty{JsiiProperty: "height", GoGetter: "Height"},
			_jsii_.MemberMethod{JsiiMethod: "position", GoMethod: "Position"},
			_jsii_.MemberMethod{JsiiMethod: "toJson", GoMethod: "ToJson"},
			_jsii_.MemberProperty{JsiiProperty: "width", GoGetter: "Width"},
			_jsii_.MemberProperty{JsiiProperty: "x", GoGetter: "X"},
			_jsii_.MemberProperty{JsiiProperty: "y", GoGetter: "Y"},
		},
		func() interface{} {
			j := jsiiProxy_DoubleAxisGraphWidget{}
			_jsii_.InitJsiiProxy(&j.Type__awscloudwatchGraphWidget)
			return &j
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.DoubleAxisGraphWidgetProps",
		reflect.TypeOf((*DoubleAxisGraphWidgetProps)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.DurationThreshold",
		reflect.TypeOf((*DurationThreshold)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.DynamoAlarmFactory",
		reflect.TypeOf((*DynamoAlarmFactory)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "addConsumedCapacityAlarm", GoMethod: "AddConsumedCapacityAlarm"},
			_jsii_.MemberMethod{JsiiMethod: "addThrottledEventsAlarm", GoMethod: "AddThrottledEventsAlarm"},
			_jsii_.MemberProperty{JsiiProperty: "alarmFactory", GoGetter: "AlarmFactory"},
		},
		func() interface{} {
			return &jsiiProxy_DynamoAlarmFactory{}
		},
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.DynamoTableGlobalSecondaryIndexMetricFactory",
		reflect.TypeOf((*DynamoTableGlobalSecondaryIndexMetricFactory)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberProperty{JsiiProperty: "dimensionsMap", GoGetter: "DimensionsMap"},
			_jsii_.MemberMethod{JsiiMethod: "metricConsumedReadCapacityUnits", GoMethod: "MetricConsumedReadCapacityUnits"},
			_jsii_.MemberMethod{JsiiMethod: "metricConsumedWriteCapacityUnits", GoMethod: "MetricConsumedWriteCapacityUnits"},
			_jsii_.MemberProperty{JsiiProperty: "metricFactory", GoGetter: "MetricFactory"},
			_jsii_.MemberMethod{JsiiMethod: "metricIndexConsumedWriteUnitsMetric", GoMethod: "MetricIndexConsumedWriteUnitsMetric"},
			_jsii_.MemberMethod{JsiiMethod: "metricProvisionedReadCapacityUnits", GoMethod: "MetricProvisionedReadCapacityUnits"},
			_jsii_.MemberMethod{JsiiMethod: "metricProvisionedWriteCapacityUnits", GoMethod: "MetricProvisionedWriteCapacityUnits"},
			_jsii_.MemberMethod{JsiiMethod: "metricThrottledIndexRequestCount", GoMethod: "MetricThrottledIndexRequestCount"},
			_jsii_.MemberMethod{JsiiMethod: "metricThrottledReadRequestCount", GoMethod: "MetricThrottledReadRequestCount"},
			_jsii_.MemberMethod{JsiiMethod: "metricThrottledWriteRequestCount", GoMethod: "MetricThrottledWriteRequestCount"},
		},
		func() interface{} {
			return &jsiiProxy_DynamoTableGlobalSecondaryIndexMetricFactory{}
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.DynamoTableGlobalSecondaryIndexMetricFactoryProps",
		reflect.TypeOf((*DynamoTableGlobalSecondaryIndexMetricFactoryProps)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.DynamoTableGlobalSecondaryIndexMonitoring",
		reflect.TypeOf((*DynamoTableGlobalSecondaryIndexMonitoring)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "addAlarm", GoMethod: "AddAlarm"},
			_jsii_.MemberProperty{JsiiProperty: "alarms", GoGetter: "Alarms"},
			_jsii_.MemberMethod{JsiiMethod: "alarmWidgets", GoMethod: "AlarmWidgets"},
			_jsii_.MemberProperty{JsiiProperty: "consumedReadUnitsMetric", GoGetter: "ConsumedReadUnitsMetric"},
			_jsii_.MemberProperty{JsiiProperty: "consumedWriteUnitsMetric", GoGetter: "ConsumedWriteUnitsMetric"},
			_jsii_.MemberMethod{JsiiMethod: "createAlarmFactory", GoMethod: "CreateAlarmFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createdAlarms", GoMethod: "CreatedAlarms"},
			_jsii_.MemberMethod{JsiiMethod: "createMetricFactory", GoMethod: "CreateMetricFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createReadCapacityWidget", GoMethod: "CreateReadCapacityWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createThrottlesWidget", GoMethod: "CreateThrottlesWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createTitleWidget", GoMethod: "CreateTitleWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createWidgetFactory", GoMethod: "CreateWidgetFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createWriteCapacityWidget", GoMethod: "CreateWriteCapacityWidget"},
			_jsii_.MemberProperty{JsiiProperty: "indexConsumedWriteUnitsMetric", GoGetter: "IndexConsumedWriteUnitsMetric"},
			_jsii_.MemberProperty{JsiiProperty: "indexThrottleCountMetric", GoGetter: "IndexThrottleCountMetric"},
			_jsii_.MemberProperty{JsiiProperty: "localAlarmNamePrefixOverride", GoGetter: "LocalAlarmNamePrefixOverride"},
			_jsii_.MemberProperty{JsiiProperty: "provisionedReadUnitsMetric", GoGetter: "ProvisionedReadUnitsMetric"},
			_jsii_.MemberProperty{JsiiProperty: "provisionedWriteUnitsMetric", GoGetter: "ProvisionedWriteUnitsMetric"},
			_jsii_.MemberProperty{JsiiProperty: "readThrottleCountMetric", GoGetter: "ReadThrottleCountMetric"},
			_jsii_.MemberProperty{JsiiProperty: "scope", GoGetter: "Scope"},
			_jsii_.MemberMethod{JsiiMethod: "summaryWidgets", GoMethod: "SummaryWidgets"},
			_jsii_.MemberProperty{JsiiProperty: "tableUrl", GoGetter: "TableUrl"},
			_jsii_.MemberProperty{JsiiProperty: "title", GoGetter: "Title"},
			_jsii_.MemberMethod{JsiiMethod: "widgets", GoMethod: "Widgets"},
			_jsii_.MemberProperty{JsiiProperty: "writeThrottleCountMetric", GoGetter: "WriteThrottleCountMetric"},
		},
		func() interface{} {
			j := jsiiProxy_DynamoTableGlobalSecondaryIndexMonitoring{}
			_jsii_.InitJsiiProxy(&j.jsiiProxy_Monitoring)
			return &j
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.DynamoTableGlobalSecondaryIndexMonitoringProps",
		reflect.TypeOf((*DynamoTableGlobalSecondaryIndexMonitoringProps)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.DynamoTableMetricFactory",
		reflect.TypeOf((*DynamoTableMetricFactory)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "metricAverageSuccessfulRequestLatencyInMillis", GoMethod: "MetricAverageSuccessfulRequestLatencyInMillis"},
			_jsii_.MemberMethod{JsiiMethod: "metricConsumedReadCapacityUnits", GoMethod: "MetricConsumedReadCapacityUnits"},
			_jsii_.MemberMethod{JsiiMethod: "metricConsumedWriteCapacityUnits", GoMethod: "MetricConsumedWriteCapacityUnits"},
			_jsii_.MemberProperty{JsiiProperty: "metricFactory", GoGetter: "MetricFactory"},
			_jsii_.MemberMethod{JsiiMethod: "metricProvisionedReadCapacityUnits", GoMethod: "MetricProvisionedReadCapacityUnits"},
			_jsii_.MemberMethod{JsiiMethod: "metricProvisionedWriteCapacityUnits", GoMethod: "MetricProvisionedWriteCapacityUnits"},
			_jsii_.MemberMethod{JsiiMethod: "metricReadCapacityUtilizationPercentage", GoMethod: "MetricReadCapacityUtilizationPercentage"},
			_jsii_.MemberMethod{JsiiMethod: "metricSearchAverageSuccessfulRequestLatencyInMillis", GoMethod: "MetricSearchAverageSuccessfulRequestLatencyInMillis"},
			_jsii_.MemberMethod{JsiiMethod: "metricSystemErrorsCount", GoMethod: "MetricSystemErrorsCount"},
			_jsii_.MemberMethod{JsiiMethod: "metricThrottledReadRequestCount", GoMethod: "MetricThrottledReadRequestCount"},
			_jsii_.MemberMethod{JsiiMethod: "metricThrottledWriteRequestCount", GoMethod: "MetricThrottledWriteRequestCount"},
			_jsii_.MemberMethod{JsiiMethod: "metricWriteCapacityUtilizationPercentage", GoMethod: "MetricWriteCapacityUtilizationPercentage"},
			_jsii_.MemberProperty{JsiiProperty: "table", GoGetter: "Table"},
		},
		func() interface{} {
			return &jsiiProxy_DynamoTableMetricFactory{}
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.DynamoTableMetricFactoryProps",
		reflect.TypeOf((*DynamoTableMetricFactoryProps)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.DynamoTableMonitoring",
		reflect.TypeOf((*DynamoTableMonitoring)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "addAlarm", GoMethod: "AddAlarm"},
			_jsii_.MemberProperty{JsiiProperty: "alarmFactory", GoGetter: "AlarmFactory"},
			_jsii_.MemberProperty{JsiiProperty: "alarms", GoGetter: "Alarms"},
			_jsii_.MemberMethod{JsiiMethod: "alarmWidgets", GoMethod: "AlarmWidgets"},
			_jsii_.MemberProperty{JsiiProperty: "averagePerOperationLatencyMetrics", GoGetter: "AveragePerOperationLatencyMetrics"},
			_jsii_.MemberProperty{JsiiProperty: "consumedReadUnitsMetric", GoGetter: "ConsumedReadUnitsMetric"},
			_jsii_.MemberProperty{JsiiProperty: "consumedWriteUnitsMetric", GoGetter: "ConsumedWriteUnitsMetric"},
			_jsii_.MemberMethod{JsiiMethod: "createAlarmFactory", GoMethod: "CreateAlarmFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createdAlarms", GoMethod: "CreatedAlarms"},
			_jsii_.MemberMethod{JsiiMethod: "createErrorsWidget", GoMethod: "CreateErrorsWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createLatencyWidget", GoMethod: "CreateLatencyWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createMetricFactory", GoMethod: "CreateMetricFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createReadCapacityWidget", GoMethod: "CreateReadCapacityWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createThrottlesWidget", GoMethod: "CreateThrottlesWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createTitleWidget", GoMethod: "CreateTitleWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createWidgetFactory", GoMethod: "CreateWidgetFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createWriteCapacityWidget", GoMethod: "CreateWriteCapacityWidget"},
			_jsii_.MemberProperty{JsiiProperty: "dynamoCapacityAlarmFactory", GoGetter: "DynamoCapacityAlarmFactory"},
			_jsii_.MemberProperty{JsiiProperty: "dynamoReadCapacityAnnotations", GoGetter: "DynamoReadCapacityAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "dynamoWriteCapacityAnnotations", GoGetter: "DynamoWriteCapacityAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "errorAlarmFactory", GoGetter: "ErrorAlarmFactory"},
			_jsii_.MemberProperty{JsiiProperty: "errorCountAnnotations", GoGetter: "ErrorCountAnnotations"},
			_jsii_.MemberMethod{JsiiMethod: "forEachOperationLatencyAlarmDefinition", GoMethod: "ForEachOperationLatencyAlarmDefinition"},
			_jsii_.MemberProperty{JsiiProperty: "latencyAlarmFactory", GoGetter: "LatencyAlarmFactory"},
			_jsii_.MemberProperty{JsiiProperty: "latencyAnnotations", GoGetter: "LatencyAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "latencyAverageSearchMetrics", GoGetter: "LatencyAverageSearchMetrics"},
			_jsii_.MemberProperty{JsiiProperty: "localAlarmNamePrefixOverride", GoGetter: "LocalAlarmNamePrefixOverride"},
			_jsii_.MemberProperty{JsiiProperty: "provisionedReadUnitsMetric", GoGetter: "ProvisionedReadUnitsMetric"},
			_jsii_.MemberProperty{JsiiProperty: "provisionedWriteUnitsMetric", GoGetter: "ProvisionedWriteUnitsMetric"},
			_jsii_.MemberProperty{JsiiProperty: "readCapacityUsageMetric", GoGetter: "ReadCapacityUsageMetric"},
			_jsii_.MemberProperty{JsiiProperty: "readThrottleCountMetric", GoGetter: "ReadThrottleCountMetric"},
			_jsii_.MemberProperty{JsiiProperty: "scope", GoGetter: "Scope"},
			_jsii_.MemberMethod{JsiiMethod: "summaryWidgets", GoMethod: "SummaryWidgets"},
			_jsii_.MemberProperty{JsiiProperty: "systemErrorMetric", GoGetter: "SystemErrorMetric"},
			_jsii_.MemberProperty{JsiiProperty: "tableBillingMode", GoGetter: "TableBillingMode"},
			_jsii_.MemberProperty{JsiiProperty: "tableUrl", GoGetter: "TableUrl"},
			_jsii_.MemberProperty{JsiiProperty: "throttledEventsAnnotations", GoGetter: "ThrottledEventsAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "title", GoGetter: "Title"},
			_jsii_.MemberMethod{JsiiMethod: "widgets", GoMethod: "Widgets"},
			_jsii_.MemberProperty{JsiiProperty: "writeCapacityUsageMetric", GoGetter: "WriteCapacityUsageMetric"},
			_jsii_.MemberProperty{JsiiProperty: "writeThrottleCountMetric", GoGetter: "WriteThrottleCountMetric"},
		},
		func() interface{} {
			j := jsiiProxy_DynamoTableMonitoring{}
			_jsii_.InitJsiiProxy(&j.jsiiProxy_Monitoring)
			return &j
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.DynamoTableMonitoringOptions",
		reflect.TypeOf((*DynamoTableMonitoringOptions)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.DynamoTableMonitoringProps",
		reflect.TypeOf((*DynamoTableMonitoringProps)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.EC2MetricFactory",
		reflect.TypeOf((*EC2MetricFactory)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "metricAverageCpuUtilisationPercent", GoMethod: "MetricAverageCpuUtilisationPercent"},
			_jsii_.MemberMethod{JsiiMethod: "metricAverageDiskReadBytes", GoMethod: "MetricAverageDiskReadBytes"},
			_jsii_.MemberMethod{JsiiMethod: "metricAverageDiskReadOps", GoMethod: "MetricAverageDiskReadOps"},
			_jsii_.MemberMethod{JsiiMethod: "metricAverageDiskWriteBytes", GoMethod: "MetricAverageDiskWriteBytes"},
			_jsii_.MemberMethod{JsiiMethod: "metricAverageDiskWriteOps", GoMethod: "MetricAverageDiskWriteOps"},
			_jsii_.MemberMethod{JsiiMethod: "metricAverageNetworkInRateBytes", GoMethod: "MetricAverageNetworkInRateBytes"},
			_jsii_.MemberMethod{JsiiMethod: "metricAverageNetworkOutRateBytes", GoMethod: "MetricAverageNetworkOutRateBytes"},
			_jsii_.MemberProperty{JsiiProperty: "metricFactory", GoGetter: "MetricFactory"},
			_jsii_.MemberProperty{JsiiProperty: "strategy", GoGetter: "Strategy"},
		},
		func() interface{} {
			return &jsiiProxy_EC2MetricFactory{}
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.EC2MetricFactoryProps",
		reflect.TypeOf((*EC2MetricFactoryProps)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.EC2Monitoring",
		reflect.TypeOf((*EC2Monitoring)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "addAlarm", GoMethod: "AddAlarm"},
			_jsii_.MemberProperty{JsiiProperty: "alarms", GoGetter: "Alarms"},
			_jsii_.MemberMethod{JsiiMethod: "alarmWidgets", GoMethod: "AlarmWidgets"},
			_jsii_.MemberProperty{JsiiProperty: "cpuUtilisationMetrics", GoGetter: "CpuUtilisationMetrics"},
			_jsii_.MemberMethod{JsiiMethod: "createAlarmFactory", GoMethod: "CreateAlarmFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createCpuWidget", GoMethod: "CreateCpuWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createdAlarms", GoMethod: "CreatedAlarms"},
			_jsii_.MemberMethod{JsiiMethod: "createDiskOpsWidget", GoMethod: "CreateDiskOpsWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createDiskWidget", GoMethod: "CreateDiskWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createMetricFactory", GoMethod: "CreateMetricFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createNetworkWidget", GoMethod: "CreateNetworkWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createTitleWidget", GoMethod: "CreateTitleWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createWidgetFactory", GoMethod: "CreateWidgetFactory"},
			_jsii_.MemberProperty{JsiiProperty: "diskReadBytesMetrics", GoGetter: "DiskReadBytesMetrics"},
			_jsii_.MemberProperty{JsiiProperty: "diskReadOpsMetrics", GoGetter: "DiskReadOpsMetrics"},
			_jsii_.MemberProperty{JsiiProperty: "diskWriteBytesMetrics", GoGetter: "DiskWriteBytesMetrics"},
			_jsii_.MemberProperty{JsiiProperty: "diskWriteOpsMetrics", GoGetter: "DiskWriteOpsMetrics"},
			_jsii_.MemberProperty{JsiiProperty: "family", GoGetter: "Family"},
			_jsii_.MemberProperty{JsiiProperty: "localAlarmNamePrefixOverride", GoGetter: "LocalAlarmNamePrefixOverride"},
			_jsii_.MemberProperty{JsiiProperty: "networkInMetrics", GoGetter: "NetworkInMetrics"},
			_jsii_.MemberProperty{JsiiProperty: "networkOutMetrics", GoGetter: "NetworkOutMetrics"},
			_jsii_.MemberProperty{JsiiProperty: "scope", GoGetter: "Scope"},
			_jsii_.MemberMethod{JsiiMethod: "summaryWidgets", GoMethod: "SummaryWidgets"},
			_jsii_.MemberProperty{JsiiProperty: "title", GoGetter: "Title"},
			_jsii_.MemberMethod{JsiiMethod: "widgets", GoMethod: "Widgets"},
		},
		func() interface{} {
			j := jsiiProxy_EC2Monitoring{}
			_jsii_.InitJsiiProxy(&j.jsiiProxy_Monitoring)
			return &j
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.EC2MonitoringOptions",
		reflect.TypeOf((*EC2MonitoringOptions)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.EC2MonitoringProps",
		reflect.TypeOf((*EC2MonitoringProps)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.Ec2ApplicationLoadBalancerMonitoringProps",
		reflect.TypeOf((*Ec2ApplicationLoadBalancerMonitoringProps)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.Ec2NetworkLoadBalancerMonitoringProps",
		reflect.TypeOf((*Ec2NetworkLoadBalancerMonitoringProps)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.Ec2ServiceMonitoring",
		reflect.TypeOf((*Ec2ServiceMonitoring)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberProperty{JsiiProperty: "activeTcpFlowCountMetric", GoGetter: "ActiveTcpFlowCountMetric"},
			_jsii_.MemberMethod{JsiiMethod: "addAlarm", GoMethod: "AddAlarm"},
			_jsii_.MemberProperty{JsiiProperty: "alarms", GoGetter: "Alarms"},
			_jsii_.MemberMethod{JsiiMethod: "alarmWidgets", GoMethod: "AlarmWidgets"},
			_jsii_.MemberProperty{JsiiProperty: "baseServiceMetricFactory", GoGetter: "BaseServiceMetricFactory"},
			_jsii_.MemberProperty{JsiiProperty: "cpuUsageAnnotations", GoGetter: "CpuUsageAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "cpuUtilisationMetric", GoGetter: "CpuUtilisationMetric"},
			_jsii_.MemberMethod{JsiiMethod: "createAlarmFactory", GoMethod: "CreateAlarmFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createCpuWidget", GoMethod: "CreateCpuWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createdAlarms", GoMethod: "CreatedAlarms"},
			_jsii_.MemberMethod{JsiiMethod: "createMemoryWidget", GoMethod: "CreateMemoryWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createMetricFactory", GoMethod: "CreateMetricFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createTaskHealthWidget", GoMethod: "CreateTaskHealthWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createTitleWidget", GoMethod: "CreateTitleWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createTpcFlowsWidget", GoMethod: "CreateTpcFlowsWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createWidgetFactory", GoMethod: "CreateWidgetFactory"},
			_jsii_.MemberProperty{JsiiProperty: "healthyTaskCountMetric", GoGetter: "HealthyTaskCountMetric"},
			_jsii_.MemberProperty{JsiiProperty: "healthyTaskPercentMetric", GoGetter: "HealthyTaskPercentMetric"},
			_jsii_.MemberProperty{JsiiProperty: "loadBalancerMetricFactory", GoGetter: "LoadBalancerMetricFactory"},
			_jsii_.MemberProperty{JsiiProperty: "localAlarmNamePrefixOverride", GoGetter: "LocalAlarmNamePrefixOverride"},
			_jsii_.MemberProperty{JsiiProperty: "memoryUsageAnnotations", GoGetter: "MemoryUsageAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "memoryUtilisationMetric", GoGetter: "MemoryUtilisationMetric"},
			_jsii_.MemberProperty{JsiiProperty: "metricFactory", GoGetter: "MetricFactory"},
			_jsii_.MemberProperty{JsiiProperty: "newTcpFlowCountMetric", GoGetter: "NewTcpFlowCountMetric"},
			_jsii_.MemberProperty{JsiiProperty: "processedBytesAnnotations", GoGetter: "ProcessedBytesAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "processedBytesMetric", GoGetter: "ProcessedBytesMetric"},
			_jsii_.MemberProperty{JsiiProperty: "runningTaskCountMetric", GoGetter: "RunningTaskCountMetric"},
			_jsii_.MemberProperty{JsiiProperty: "scope", GoGetter: "Scope"},
			_jsii_.MemberMethod{JsiiMethod: "summaryWidgets", GoMethod: "SummaryWidgets"},
			_jsii_.MemberProperty{JsiiProperty: "taskHealthAlarmFactory", GoGetter: "TaskHealthAlarmFactory"},
			_jsii_.MemberProperty{JsiiProperty: "taskHealthAnnotations", GoGetter: "TaskHealthAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "throughputAlarmFactory", GoGetter: "ThroughputAlarmFactory"},
			_jsii_.MemberProperty{JsiiProperty: "title", GoGetter: "Title"},
			_jsii_.MemberProperty{JsiiProperty: "unhealthyTaskCountMetric", GoGetter: "UnhealthyTaskCountMetric"},
			_jsii_.MemberProperty{JsiiProperty: "usageAlarmFactory", GoGetter: "UsageAlarmFactory"},
			_jsii_.MemberMethod{JsiiMethod: "widgets", GoMethod: "Widgets"},
		},
		func() interface{} {
			j := jsiiProxy_Ec2ServiceMonitoring{}
			_jsii_.InitJsiiProxy(&j.jsiiProxy_Monitoring)
			return &j
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.Ec2ServiceMonitoringProps",
		reflect.TypeOf((*Ec2ServiceMonitoringProps)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.ElastiCacheAlarmFactory",
		reflect.TypeOf((*ElastiCacheAlarmFactory)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "addMaxEvictedItemsCountAlarm", GoMethod: "AddMaxEvictedItemsCountAlarm"},
			_jsii_.MemberMethod{JsiiMethod: "addMaxItemsCountAlarm", GoMethod: "AddMaxItemsCountAlarm"},
			_jsii_.MemberMethod{JsiiMethod: "addMaxUsedSwapMemoryAlarm", GoMethod: "AddMaxUsedSwapMemoryAlarm"},
			_jsii_.MemberMethod{JsiiMethod: "addMinFreeableMemoryAlarm", GoMethod: "AddMinFreeableMemoryAlarm"},
			_jsii_.MemberProperty{JsiiProperty: "alarmFactory", GoGetter: "AlarmFactory"},
		},
		func() interface{} {
			return &jsiiProxy_ElastiCacheAlarmFactory{}
		},
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.ElastiCacheClusterMetricFactory",
		reflect.TypeOf((*ElastiCacheClusterMetricFactory)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberProperty{JsiiProperty: "dimensionsMap", GoGetter: "DimensionsMap"},
			_jsii_.MemberMethod{JsiiMethod: "metricAverageCachedItemsSizeInBytes", GoMethod: "MetricAverageCachedItemsSizeInBytes"},
			_jsii_.MemberMethod{JsiiMethod: "metricAverageConnections", GoMethod: "MetricAverageConnections"},
			_jsii_.MemberMethod{JsiiMethod: "metricAverageFreeableMemoryInBytes", GoMethod: "MetricAverageFreeableMemoryInBytes"},
			_jsii_.MemberMethod{JsiiMethod: "metricAverageSwapUsageInBytes", GoMethod: "MetricAverageSwapUsageInBytes"},
			_jsii_.MemberMethod{JsiiMethod: "metricAverageUnusedMemoryInBytes", GoMethod: "MetricAverageUnusedMemoryInBytes"},
			_jsii_.MemberMethod{JsiiMethod: "metricEvictions", GoMethod: "MetricEvictions"},
			_jsii_.MemberProperty{JsiiProperty: "metricFactory", GoGetter: "MetricFactory"},
			_jsii_.MemberMethod{JsiiMethod: "metricMaxCpuUtilizationInPercent", GoMethod: "MetricMaxCpuUtilizationInPercent"},
			_jsii_.MemberMethod{JsiiMethod: "metricMaxItemCount", GoMethod: "MetricMaxItemCount"},
			_jsii_.MemberMethod{JsiiMethod: "metricNetworkBytesIn", GoMethod: "MetricNetworkBytesIn"},
			_jsii_.MemberMethod{JsiiMethod: "metricNetworkBytesOut", GoMethod: "MetricNetworkBytesOut"},
		},
		func() interface{} {
			return &jsiiProxy_ElastiCacheClusterMetricFactory{}
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.ElastiCacheClusterMetricFactoryProps",
		reflect.TypeOf((*ElastiCacheClusterMetricFactoryProps)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.ElastiCacheClusterMonitoring",
		reflect.TypeOf((*ElastiCacheClusterMonitoring)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "addAlarm", GoMethod: "AddAlarm"},
			_jsii_.MemberProperty{JsiiProperty: "alarms", GoGetter: "Alarms"},
			_jsii_.MemberMethod{JsiiMethod: "alarmWidgets", GoMethod: "AlarmWidgets"},
			_jsii_.MemberProperty{JsiiProperty: "clusterUrl", GoGetter: "ClusterUrl"},
			_jsii_.MemberProperty{JsiiProperty: "connectionsMetric", GoGetter: "ConnectionsMetric"},
			_jsii_.MemberProperty{JsiiProperty: "cpuUsageAnnotations", GoGetter: "CpuUsageAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "cpuUsageMetric", GoGetter: "CpuUsageMetric"},
			_jsii_.MemberMethod{JsiiMethod: "createAlarmFactory", GoMethod: "CreateAlarmFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createConnectionsWidget", GoMethod: "CreateConnectionsWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createCpuUsageWidget", GoMethod: "CreateCpuUsageWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createdAlarms", GoMethod: "CreatedAlarms"},
			_jsii_.MemberMethod{JsiiMethod: "createItemCountWidget", GoMethod: "CreateItemCountWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createMemoryUsageWidget", GoMethod: "CreateMemoryUsageWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createMetricFactory", GoMethod: "CreateMetricFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createTitleWidget", GoMethod: "CreateTitleWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createWidgetFactory", GoMethod: "CreateWidgetFactory"},
			_jsii_.MemberProperty{JsiiProperty: "elastiCacheAlarmFactory", GoGetter: "ElastiCacheAlarmFactory"},
			_jsii_.MemberProperty{JsiiProperty: "evictedItemsCountAnnotations", GoGetter: "EvictedItemsCountAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "freeableMemoryMetric", GoGetter: "FreeableMemoryMetric"},
			_jsii_.MemberProperty{JsiiProperty: "itemsCountAnnotations", GoGetter: "ItemsCountAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "itemsCountMetrics", GoGetter: "ItemsCountMetrics"},
			_jsii_.MemberProperty{JsiiProperty: "itemsEvictedMetrics", GoGetter: "ItemsEvictedMetrics"},
			_jsii_.MemberProperty{JsiiProperty: "itemsMemoryMetric", GoGetter: "ItemsMemoryMetric"},
			_jsii_.MemberProperty{JsiiProperty: "localAlarmNamePrefixOverride", GoGetter: "LocalAlarmNamePrefixOverride"},
			_jsii_.MemberProperty{JsiiProperty: "memoryUsageAnnotations", GoGetter: "MemoryUsageAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "scope", GoGetter: "Scope"},
			_jsii_.MemberMethod{JsiiMethod: "summaryWidgets", GoMethod: "SummaryWidgets"},
			_jsii_.MemberProperty{JsiiProperty: "swapMemoryMetric", GoGetter: "SwapMemoryMetric"},
			_jsii_.MemberProperty{JsiiProperty: "title", GoGetter: "Title"},
			_jsii_.MemberProperty{JsiiProperty: "unusedMemoryMetric", GoGetter: "UnusedMemoryMetric"},
			_jsii_.MemberProperty{JsiiProperty: "usageAlarmFactory", GoGetter: "UsageAlarmFactory"},
			_jsii_.MemberMethod{JsiiMethod: "widgets", GoMethod: "Widgets"},
		},
		func() interface{} {
			j := jsiiProxy_ElastiCacheClusterMonitoring{}
			_jsii_.InitJsiiProxy(&j.jsiiProxy_Monitoring)
			return &j
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.ElastiCacheClusterMonitoringOptions",
		reflect.TypeOf((*ElastiCacheClusterMonitoringOptions)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.ElastiCacheClusterMonitoringProps",
		reflect.TypeOf((*ElastiCacheClusterMonitoringProps)(nil)).Elem(),
	)
	_jsii_.RegisterEnum(
		"cdk-monitoring-constructs.ElastiCacheClusterType",
		reflect.TypeOf((*ElastiCacheClusterType)(nil)).Elem(),
		map[string]interface{}{
			"MEMCACHED": ElastiCacheClusterType_MEMCACHED,
			"REDIS": ElastiCacheClusterType_REDIS,
		},
	)
	_jsii_.RegisterEnum(
		"cdk-monitoring-constructs.ElasticsearchClusterStatus",
		reflect.TypeOf((*ElasticsearchClusterStatus)(nil)).Elem(),
		map[string]interface{}{
			"RED": ElasticsearchClusterStatus_RED,
			"YELLOW": ElasticsearchClusterStatus_YELLOW,
		},
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.ErrorAlarmFactory",
		reflect.TypeOf((*ErrorAlarmFactory)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "addErrorCountAlarm", GoMethod: "AddErrorCountAlarm"},
			_jsii_.MemberMethod{JsiiMethod: "addErrorRateAlarm", GoMethod: "AddErrorRateAlarm"},
			_jsii_.MemberProperty{JsiiProperty: "alarmFactory", GoGetter: "AlarmFactory"},
		},
		func() interface{} {
			return &jsiiProxy_ErrorAlarmFactory{}
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.ErrorCountThreshold",
		reflect.TypeOf((*ErrorCountThreshold)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.ErrorRateThreshold",
		reflect.TypeOf((*ErrorRateThreshold)(nil)).Elem(),
	)
	_jsii_.RegisterEnum(
		"cdk-monitoring-constructs.ErrorType",
		reflect.TypeOf((*ErrorType)(nil)).Elem(),
		map[string]interface{}{
			"FAULT": ErrorType_FAULT,
			"ERROR": ErrorType_ERROR,
			"SYSTEM_ERROR": ErrorType_SYSTEM_ERROR,
			"USER_ERROR": ErrorType_USER_ERROR,
			"FAILURE": ErrorType_FAILURE,
			"ABORTED": ErrorType_ABORTED,
			"THROTTLED": ErrorType_THROTTLED,
			"TIMED_OUT": ErrorType_TIMED_OUT,
			"READ_ERROR": ErrorType_READ_ERROR,
			"WRITE_ERROR": ErrorType_WRITE_ERROR,
			"EXPIRED": ErrorType_EXPIRED,
			"KILLED": ErrorType_KILLED,
		},
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.ExtendDedupeString",
		reflect.TypeOf((*ExtendDedupeString)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "processDedupeString", GoMethod: "ProcessDedupeString"},
			_jsii_.MemberMethod{JsiiMethod: "processDedupeStringOverride", GoMethod: "ProcessDedupeStringOverride"},
		},
		func() interface{} {
			j := jsiiProxy_ExtendDedupeString{}
			_jsii_.InitJsiiProxy(&j.jsiiProxy_IAlarmDedupeStringProcessor)
			return &j
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.FargateApplicationLoadBalancerMonitoringProps",
		reflect.TypeOf((*FargateApplicationLoadBalancerMonitoringProps)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.FargateNetworkLoadBalancerMonitoringProps",
		reflect.TypeOf((*FargateNetworkLoadBalancerMonitoringProps)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.FargateServiceMonitoring",
		reflect.TypeOf((*FargateServiceMonitoring)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberProperty{JsiiProperty: "activeTcpFlowCountMetric", GoGetter: "ActiveTcpFlowCountMetric"},
			_jsii_.MemberMethod{JsiiMethod: "addAlarm", GoMethod: "AddAlarm"},
			_jsii_.MemberProperty{JsiiProperty: "alarms", GoGetter: "Alarms"},
			_jsii_.MemberMethod{JsiiMethod: "alarmWidgets", GoMethod: "AlarmWidgets"},
			_jsii_.MemberProperty{JsiiProperty: "baseServiceMetricFactory", GoGetter: "BaseServiceMetricFactory"},
			_jsii_.MemberProperty{JsiiProperty: "cpuUsageAnnotations", GoGetter: "CpuUsageAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "cpuUtilisationMetric", GoGetter: "CpuUtilisationMetric"},
			_jsii_.MemberMethod{JsiiMethod: "createAlarmFactory", GoMethod: "CreateAlarmFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createCpuWidget", GoMethod: "CreateCpuWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createdAlarms", GoMethod: "CreatedAlarms"},
			_jsii_.MemberMethod{JsiiMethod: "createMemoryWidget", GoMethod: "CreateMemoryWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createMetricFactory", GoMethod: "CreateMetricFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createTaskHealthWidget", GoMethod: "CreateTaskHealthWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createTitleWidget", GoMethod: "CreateTitleWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createTpcFlowsWidget", GoMethod: "CreateTpcFlowsWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createWidgetFactory", GoMethod: "CreateWidgetFactory"},
			_jsii_.MemberProperty{JsiiProperty: "healthyTaskCountMetric", GoGetter: "HealthyTaskCountMetric"},
			_jsii_.MemberProperty{JsiiProperty: "healthyTaskPercentMetric", GoGetter: "HealthyTaskPercentMetric"},
			_jsii_.MemberProperty{JsiiProperty: "loadBalancerMetricFactory", GoGetter: "LoadBalancerMetricFactory"},
			_jsii_.MemberProperty{JsiiProperty: "localAlarmNamePrefixOverride", GoGetter: "LocalAlarmNamePrefixOverride"},
			_jsii_.MemberProperty{JsiiProperty: "memoryUsageAnnotations", GoGetter: "MemoryUsageAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "memoryUtilisationMetric", GoGetter: "MemoryUtilisationMetric"},
			_jsii_.MemberProperty{JsiiProperty: "metricFactory", GoGetter: "MetricFactory"},
			_jsii_.MemberProperty{JsiiProperty: "newTcpFlowCountMetric", GoGetter: "NewTcpFlowCountMetric"},
			_jsii_.MemberProperty{JsiiProperty: "processedBytesAnnotations", GoGetter: "ProcessedBytesAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "processedBytesMetric", GoGetter: "ProcessedBytesMetric"},
			_jsii_.MemberProperty{JsiiProperty: "runningTaskCountMetric", GoGetter: "RunningTaskCountMetric"},
			_jsii_.MemberProperty{JsiiProperty: "scope", GoGetter: "Scope"},
			_jsii_.MemberMethod{JsiiMethod: "summaryWidgets", GoMethod: "SummaryWidgets"},
			_jsii_.MemberProperty{JsiiProperty: "taskHealthAlarmFactory", GoGetter: "TaskHealthAlarmFactory"},
			_jsii_.MemberProperty{JsiiProperty: "taskHealthAnnotations", GoGetter: "TaskHealthAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "throughputAlarmFactory", GoGetter: "ThroughputAlarmFactory"},
			_jsii_.MemberProperty{JsiiProperty: "title", GoGetter: "Title"},
			_jsii_.MemberProperty{JsiiProperty: "unhealthyTaskCountMetric", GoGetter: "UnhealthyTaskCountMetric"},
			_jsii_.MemberProperty{JsiiProperty: "usageAlarmFactory", GoGetter: "UsageAlarmFactory"},
			_jsii_.MemberMethod{JsiiMethod: "widgets", GoMethod: "Widgets"},
		},
		func() interface{} {
			j := jsiiProxy_FargateServiceMonitoring{}
			_jsii_.InitJsiiProxy(&j.jsiiProxy_Monitoring)
			return &j
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.FargateServiceMonitoringProps",
		reflect.TypeOf((*FargateServiceMonitoringProps)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.FillingAlarmAnnotationStrategy",
		reflect.TypeOf((*FillingAlarmAnnotationStrategy)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "createAnnotation", GoMethod: "CreateAnnotation"},
			_jsii_.MemberMethod{JsiiMethod: "createAnnotationToFill", GoMethod: "CreateAnnotationToFill"},
			_jsii_.MemberMethod{JsiiMethod: "getAlarmingRangeShade", GoMethod: "GetAlarmingRangeShade"},
		},
		func() interface{} {
			j := jsiiProxy_FillingAlarmAnnotationStrategy{}
			_jsii_.InitJsiiProxy(&j.jsiiProxy_IAlarmAnnotationStrategy)
			return &j
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.FullRestartCountThreshold",
		reflect.TypeOf((*FullRestartCountThreshold)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.GlueJobMetricFactory",
		reflect.TypeOf((*GlueJobMetricFactory)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberProperty{JsiiProperty: "dimensionsMap", GoGetter: "DimensionsMap"},
			_jsii_.MemberMethod{JsiiMethod: "metricActiveExecutorsAverage", GoMethod: "MetricActiveExecutorsAverage"},
			_jsii_.MemberMethod{JsiiMethod: "metricAverageExecutorCpuUsagePercentage", GoMethod: "MetricAverageExecutorCpuUsagePercentage"},
			_jsii_.MemberMethod{JsiiMethod: "metricAverageExecutorMemoryUsagePercentage", GoMethod: "MetricAverageExecutorMemoryUsagePercentage"},
			_jsii_.MemberMethod{JsiiMethod: "metricCompletedStagesSum", GoMethod: "MetricCompletedStagesSum"},
			_jsii_.MemberMethod{JsiiMethod: "metricCompletedTasksSum", GoMethod: "MetricCompletedTasksSum"},
			_jsii_.MemberProperty{JsiiProperty: "metricFactory", GoGetter: "MetricFactory"},
			_jsii_.MemberMethod{JsiiMethod: "metricFailedTasksRate", GoMethod: "MetricFailedTasksRate"},
			_jsii_.MemberMethod{JsiiMethod: "metricFailedTasksSum", GoMethod: "MetricFailedTasksSum"},
			_jsii_.MemberMethod{JsiiMethod: "metricKilledTasksRate", GoMethod: "MetricKilledTasksRate"},
			_jsii_.MemberMethod{JsiiMethod: "metricKilledTasksSum", GoMethod: "MetricKilledTasksSum"},
			_jsii_.MemberMethod{JsiiMethod: "metricMaximumNeededExecutors", GoMethod: "MetricMaximumNeededExecutors"},
			_jsii_.MemberMethod{JsiiMethod: "metricTotalReadBytesFromS3", GoMethod: "MetricTotalReadBytesFromS3"},
			_jsii_.MemberMethod{JsiiMethod: "metricTotalWrittenBytesToS3", GoMethod: "MetricTotalWrittenBytesToS3"},
			_jsii_.MemberProperty{JsiiProperty: "rateComputationMethod", GoGetter: "RateComputationMethod"},
			_jsii_.MemberProperty{JsiiProperty: "typeCountDimensionsMap", GoGetter: "TypeCountDimensionsMap"},
		},
		func() interface{} {
			return &jsiiProxy_GlueJobMetricFactory{}
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.GlueJobMetricFactoryProps",
		reflect.TypeOf((*GlueJobMetricFactoryProps)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.GlueJobMonitoring",
		reflect.TypeOf((*GlueJobMonitoring)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberProperty{JsiiProperty: "activeExecutorsMetric", GoGetter: "ActiveExecutorsMetric"},
			_jsii_.MemberMethod{JsiiMethod: "addAlarm", GoMethod: "AddAlarm"},
			_jsii_.MemberProperty{JsiiProperty: "alarmFactory", GoGetter: "AlarmFactory"},
			_jsii_.MemberProperty{JsiiProperty: "alarms", GoGetter: "Alarms"},
			_jsii_.MemberMethod{JsiiMethod: "alarmWidgets", GoMethod: "AlarmWidgets"},
			_jsii_.MemberProperty{JsiiProperty: "bytesReadFromS3Metric", GoGetter: "BytesReadFromS3Metric"},
			_jsii_.MemberProperty{JsiiProperty: "bytesWrittenToS3Metric", GoGetter: "BytesWrittenToS3Metric"},
			_jsii_.MemberProperty{JsiiProperty: "completedStagesMetric", GoGetter: "CompletedStagesMetric"},
			_jsii_.MemberProperty{JsiiProperty: "cpuUsageMetric", GoGetter: "CpuUsageMetric"},
			_jsii_.MemberMethod{JsiiMethod: "createAlarmFactory", GoMethod: "CreateAlarmFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createdAlarms", GoMethod: "CreatedAlarms"},
			_jsii_.MemberMethod{JsiiMethod: "createDataMovementWidget", GoMethod: "CreateDataMovementWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createErrorCountWidget", GoMethod: "CreateErrorCountWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createErrorRateWidget", GoMethod: "CreateErrorRateWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createJobExecutionWidget", GoMethod: "CreateJobExecutionWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createMetricFactory", GoMethod: "CreateMetricFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createTitleWidget", GoMethod: "CreateTitleWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createUtilizationWidget", GoMethod: "CreateUtilizationWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createWidgetFactory", GoMethod: "CreateWidgetFactory"},
			_jsii_.MemberProperty{JsiiProperty: "errorAlarmFactory", GoGetter: "ErrorAlarmFactory"},
			_jsii_.MemberProperty{JsiiProperty: "errorCountAnnotations", GoGetter: "ErrorCountAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "errorRateAnnotations", GoGetter: "ErrorRateAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "failedTaskCountMetric", GoGetter: "FailedTaskCountMetric"},
			_jsii_.MemberProperty{JsiiProperty: "failedTaskRateMetric", GoGetter: "FailedTaskRateMetric"},
			_jsii_.MemberProperty{JsiiProperty: "heapMemoryUsageMetric", GoGetter: "HeapMemoryUsageMetric"},
			_jsii_.MemberProperty{JsiiProperty: "killedTaskCountMetric", GoGetter: "KilledTaskCountMetric"},
			_jsii_.MemberProperty{JsiiProperty: "killedTaskRateMetric", GoGetter: "KilledTaskRateMetric"},
			_jsii_.MemberProperty{JsiiProperty: "localAlarmNamePrefixOverride", GoGetter: "LocalAlarmNamePrefixOverride"},
			_jsii_.MemberProperty{JsiiProperty: "neededExecutorsMetric", GoGetter: "NeededExecutorsMetric"},
			_jsii_.MemberProperty{JsiiProperty: "scope", GoGetter: "Scope"},
			_jsii_.MemberMethod{JsiiMethod: "summaryWidgets", GoMethod: "SummaryWidgets"},
			_jsii_.MemberProperty{JsiiProperty: "title", GoGetter: "Title"},
			_jsii_.MemberMethod{JsiiMethod: "widgets", GoMethod: "Widgets"},
		},
		func() interface{} {
			j := jsiiProxy_GlueJobMonitoring{}
			_jsii_.InitJsiiProxy(&j.jsiiProxy_Monitoring)
			return &j
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.GlueJobMonitoringOptions",
		reflect.TypeOf((*GlueJobMonitoringOptions)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.GlueJobMonitoringProps",
		reflect.TypeOf((*GlueJobMonitoringProps)(nil)).Elem(),
	)
	_jsii_.RegisterEnum(
		"cdk-monitoring-constructs.GraphWidgetType",
		reflect.TypeOf((*GraphWidgetType)(nil)).Elem(),
		map[string]interface{}{
			"LINE": GraphWidgetType_LINE,
			"STACKED_AREA": GraphWidgetType_STACKED_AREA,
			"PIE": GraphWidgetType_PIE,
			"BAR": GraphWidgetType_BAR,
			"SINGLE_VALUE": GraphWidgetType_SINGLE_VALUE,
		},
	)
	_jsii_.RegisterEnum(
		"cdk-monitoring-constructs.HeaderLevel",
		reflect.TypeOf((*HeaderLevel)(nil)).Elem(),
		map[string]interface{}{
			"LARGE": HeaderLevel_LARGE,
			"MEDIUM": HeaderLevel_MEDIUM,
			"SMALL": HeaderLevel_SMALL,
		},
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.HeaderWidget",
		reflect.TypeOf((*HeaderWidget)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberProperty{JsiiProperty: "height", GoGetter: "Height"},
			_jsii_.MemberMethod{JsiiMethod: "position", GoMethod: "Position"},
			_jsii_.MemberMethod{JsiiMethod: "toJson", GoMethod: "ToJson"},
			_jsii_.MemberProperty{JsiiProperty: "width", GoGetter: "Width"},
			_jsii_.MemberProperty{JsiiProperty: "x", GoGetter: "X"},
			_jsii_.MemberProperty{JsiiProperty: "y", GoGetter: "Y"},
		},
		func() interface{} {
			j := jsiiProxy_HeaderWidget{}
			_jsii_.InitJsiiProxy(&j.Type__awscloudwatchTextWidget)
			return &j
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.HealthyTaskCountThreshold",
		reflect.TypeOf((*HealthyTaskCountThreshold)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.HealthyTaskPercentThreshold",
		reflect.TypeOf((*HealthyTaskPercentThreshold)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.HighMessagesPublishedThreshold",
		reflect.TypeOf((*HighMessagesPublishedThreshold)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.HighTpsThreshold",
		reflect.TypeOf((*HighTpsThreshold)(nil)).Elem(),
	)
	_jsii_.RegisterInterface(
		"cdk-monitoring-constructs.IAlarmActionStrategy",
		reflect.TypeOf((*IAlarmActionStrategy)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "addAlarmActions", GoMethod: "AddAlarmActions"},
		},
		func() interface{} {
			return &jsiiProxy_IAlarmActionStrategy{}
		},
	)
	_jsii_.RegisterInterface(
		"cdk-monitoring-constructs.IAlarmAnnotationStrategy",
		reflect.TypeOf((*IAlarmAnnotationStrategy)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "createAnnotation", GoMethod: "CreateAnnotation"},
		},
		func() interface{} {
			return &jsiiProxy_IAlarmAnnotationStrategy{}
		},
	)
	_jsii_.RegisterInterface(
		"cdk-monitoring-constructs.IAlarmConsumer",
		reflect.TypeOf((*IAlarmConsumer)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "consume", GoMethod: "Consume"},
		},
		func() interface{} {
			return &jsiiProxy_IAlarmConsumer{}
		},
	)
	_jsii_.RegisterInterface(
		"cdk-monitoring-constructs.IAlarmDedupeStringProcessor",
		reflect.TypeOf((*IAlarmDedupeStringProcessor)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "processDedupeString", GoMethod: "ProcessDedupeString"},
			_jsii_.MemberMethod{JsiiMethod: "processDedupeStringOverride", GoMethod: "ProcessDedupeStringOverride"},
		},
		func() interface{} {
			return &jsiiProxy_IAlarmDedupeStringProcessor{}
		},
	)
	_jsii_.RegisterInterface(
		"cdk-monitoring-constructs.IDashboardFactory",
		reflect.TypeOf((*IDashboardFactory)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "addSegment", GoMethod: "AddSegment"},
			_jsii_.MemberMethod{JsiiMethod: "createdAlarmDashboard", GoMethod: "CreatedAlarmDashboard"},
			_jsii_.MemberMethod{JsiiMethod: "createdDashboard", GoMethod: "CreatedDashboard"},
			_jsii_.MemberMethod{JsiiMethod: "createdSummaryDashboard", GoMethod: "CreatedSummaryDashboard"},
		},
		func() interface{} {
			return &jsiiProxy_IDashboardFactory{}
		},
	)
	_jsii_.RegisterInterface(
		"cdk-monitoring-constructs.IDashboardFactoryProps",
		reflect.TypeOf((*IDashboardFactoryProps)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberProperty{JsiiProperty: "overrideProps", GoGetter: "OverrideProps"},
			_jsii_.MemberProperty{JsiiProperty: "segment", GoGetter: "Segment"},
		},
		func() interface{} {
			return &jsiiProxy_IDashboardFactoryProps{}
		},
	)
	_jsii_.RegisterInterface(
		"cdk-monitoring-constructs.IDashboardSegment",
		reflect.TypeOf((*IDashboardSegment)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "alarmWidgets", GoMethod: "AlarmWidgets"},
			_jsii_.MemberMethod{JsiiMethod: "summaryWidgets", GoMethod: "SummaryWidgets"},
			_jsii_.MemberMethod{JsiiMethod: "widgets", GoMethod: "Widgets"},
		},
		func() interface{} {
			return &jsiiProxy_IDashboardSegment{}
		},
	)
	_jsii_.RegisterInterface(
		"cdk-monitoring-constructs.IEC2MetricFactoryStrategy",
		reflect.TypeOf((*IEC2MetricFactoryStrategy)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "createMetrics", GoMethod: "CreateMetrics"},
		},
		func() interface{} {
			return &jsiiProxy_IEC2MetricFactoryStrategy{}
		},
	)
	_jsii_.RegisterInterface(
		"cdk-monitoring-constructs.ILoadBalancerMetricFactory",
		reflect.TypeOf((*ILoadBalancerMetricFactory)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "metricActiveConnectionCount", GoMethod: "MetricActiveConnectionCount"},
			_jsii_.MemberMethod{JsiiMethod: "metricHealthyTaskCount", GoMethod: "MetricHealthyTaskCount"},
			_jsii_.MemberMethod{JsiiMethod: "metricHealthyTaskInPercent", GoMethod: "MetricHealthyTaskInPercent"},
			_jsii_.MemberMethod{JsiiMethod: "metricNewConnectionCount", GoMethod: "MetricNewConnectionCount"},
			_jsii_.MemberMethod{JsiiMethod: "metricProcessedBytesMin", GoMethod: "MetricProcessedBytesMin"},
			_jsii_.MemberMethod{JsiiMethod: "metricUnhealthyTaskCount", GoMethod: "MetricUnhealthyTaskCount"},
		},
		func() interface{} {
			return &jsiiProxy_ILoadBalancerMetricFactory{}
		},
	)
	_jsii_.RegisterInterface(
		"cdk-monitoring-constructs.IWidgetFactory",
		reflect.TypeOf((*IWidgetFactory)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "createAlarmDetailWidget", GoMethod: "CreateAlarmDetailWidget"},
		},
		func() interface{} {
			return &jsiiProxy_IWidgetFactory{}
		},
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.KeyValueTableWidget",
		reflect.TypeOf((*KeyValueTableWidget)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberProperty{JsiiProperty: "height", GoGetter: "Height"},
			_jsii_.MemberMethod{JsiiMethod: "position", GoMethod: "Position"},
			_jsii_.MemberMethod{JsiiMethod: "toJson", GoMethod: "ToJson"},
			_jsii_.MemberProperty{JsiiProperty: "width", GoGetter: "Width"},
			_jsii_.MemberProperty{JsiiProperty: "x", GoGetter: "X"},
			_jsii_.MemberProperty{JsiiProperty: "y", GoGetter: "Y"},
		},
		func() interface{} {
			j := jsiiProxy_KeyValueTableWidget{}
			_jsii_.InitJsiiProxy(&j.Type__awscloudwatchTextWidget)
			return &j
		},
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.KinesisAlarmFactory",
		reflect.TypeOf((*KinesisAlarmFactory)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "addIteratorMaxAgeAlarm", GoMethod: "AddIteratorMaxAgeAlarm"},
			_jsii_.MemberMethod{JsiiMethod: "addProvisionedReadThroughputExceededAlarm", GoMethod: "AddProvisionedReadThroughputExceededAlarm"},
			_jsii_.MemberMethod{JsiiMethod: "addProvisionedWriteThroughputExceededAlarm", GoMethod: "AddProvisionedWriteThroughputExceededAlarm"},
			_jsii_.MemberMethod{JsiiMethod: "addPutRecordsFailedAlarm", GoMethod: "AddPutRecordsFailedAlarm"},
			_jsii_.MemberMethod{JsiiMethod: "addPutRecordsThrottledAlarm", GoMethod: "AddPutRecordsThrottledAlarm"},
			_jsii_.MemberProperty{JsiiProperty: "alarmFactory", GoGetter: "AlarmFactory"},
		},
		func() interface{} {
			return &jsiiProxy_KinesisAlarmFactory{}
		},
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.KinesisDataAnalyticsAlarmFactory",
		reflect.TypeOf((*KinesisDataAnalyticsAlarmFactory)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "addDowntimeAlarm", GoMethod: "AddDowntimeAlarm"},
			_jsii_.MemberMethod{JsiiMethod: "addFullRestartAlarm", GoMethod: "AddFullRestartAlarm"},
			_jsii_.MemberProperty{JsiiProperty: "alarmFactory", GoGetter: "AlarmFactory"},
		},
		func() interface{} {
			return &jsiiProxy_KinesisDataAnalyticsAlarmFactory{}
		},
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.KinesisDataAnalyticsMetricFactory",
		reflect.TypeOf((*KinesisDataAnalyticsMetricFactory)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberProperty{JsiiProperty: "dimensionsMap", GoGetter: "DimensionsMap"},
			_jsii_.MemberMethod{JsiiMethod: "metricCpuUtilizationPercent", GoMethod: "MetricCpuUtilizationPercent"},
			_jsii_.MemberMethod{JsiiMethod: "metricDowntimeMs", GoMethod: "MetricDowntimeMs"},
			_jsii_.MemberProperty{JsiiProperty: "metricFactory", GoGetter: "MetricFactory"},
			_jsii_.MemberMethod{JsiiMethod: "metricFullRestartsCount", GoMethod: "MetricFullRestartsCount"},
			_jsii_.MemberMethod{JsiiMethod: "metricHeapMemoryUtilizationPercent", GoMethod: "MetricHeapMemoryUtilizationPercent"},
			_jsii_.MemberMethod{JsiiMethod: "metricKPUsCount", GoMethod: "MetricKPUsCount"},
			_jsii_.MemberMethod{JsiiMethod: "metricLastCheckpointDurationMs", GoMethod: "MetricLastCheckpointDurationMs"},
			_jsii_.MemberMethod{JsiiMethod: "metricLastCheckpointSizeBytes", GoMethod: "MetricLastCheckpointSizeBytes"},
			_jsii_.MemberMethod{JsiiMethod: "metricNumberOfFailedCheckpointsCount", GoMethod: "MetricNumberOfFailedCheckpointsCount"},
			_jsii_.MemberMethod{JsiiMethod: "metricOldGenerationGCCount", GoMethod: "MetricOldGenerationGCCount"},
			_jsii_.MemberMethod{JsiiMethod: "metricOldGenerationGCTimeMs", GoMethod: "MetricOldGenerationGCTimeMs"},
			_jsii_.MemberMethod{JsiiMethod: "metricUptimeMs", GoMethod: "MetricUptimeMs"},
		},
		func() interface{} {
			return &jsiiProxy_KinesisDataAnalyticsMetricFactory{}
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.KinesisDataAnalyticsMetricFactoryProps",
		reflect.TypeOf((*KinesisDataAnalyticsMetricFactoryProps)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.KinesisDataAnalyticsMonitoring",
		reflect.TypeOf((*KinesisDataAnalyticsMonitoring)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "addAlarm", GoMethod: "AddAlarm"},
			_jsii_.MemberProperty{JsiiProperty: "alarms", GoGetter: "Alarms"},
			_jsii_.MemberMethod{JsiiMethod: "alarmWidgets", GoMethod: "AlarmWidgets"},
			_jsii_.MemberProperty{JsiiProperty: "cpuUtilizationPercentMetric", GoGetter: "CpuUtilizationPercentMetric"},
			_jsii_.MemberMethod{JsiiMethod: "createAlarmFactory", GoMethod: "CreateAlarmFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createdAlarms", GoMethod: "CreatedAlarms"},
			_jsii_.MemberMethod{JsiiMethod: "createDownTimeWidget", GoMethod: "CreateDownTimeWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createFullRestartsWidget", GoMethod: "CreateFullRestartsWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createGarbageCollectionWidget", GoMethod: "CreateGarbageCollectionWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createKPUWidget", GoMethod: "CreateKPUWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createLastCheckpointDurationWidget", GoMethod: "CreateLastCheckpointDurationWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createLastCheckpointSizeWidget", GoMethod: "CreateLastCheckpointSizeWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createMetricFactory", GoMethod: "CreateMetricFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createNumberOfFailedCheckpointsWidget", GoMethod: "CreateNumberOfFailedCheckpointsWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createResourceUtilizationWidget", GoMethod: "CreateResourceUtilizationWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createTitleWidget", GoMethod: "CreateTitleWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createWidgetFactory", GoMethod: "CreateWidgetFactory"},
			_jsii_.MemberProperty{JsiiProperty: "downtimeAnnotations", GoGetter: "DowntimeAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "downtimeMsMetric", GoGetter: "DowntimeMsMetric"},
			_jsii_.MemberProperty{JsiiProperty: "fullRestartAnnotations", GoGetter: "FullRestartAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "fullRestartsCountMetric", GoGetter: "FullRestartsCountMetric"},
			_jsii_.MemberProperty{JsiiProperty: "heapMemoryUtilizationPercentMetric", GoGetter: "HeapMemoryUtilizationPercentMetric"},
			_jsii_.MemberProperty{JsiiProperty: "kdaAlarmFactory", GoGetter: "KdaAlarmFactory"},
			_jsii_.MemberProperty{JsiiProperty: "kinesisDataAnalyticsUrl", GoGetter: "KinesisDataAnalyticsUrl"},
			_jsii_.MemberProperty{JsiiProperty: "kpusCountMetric", GoGetter: "KpusCountMetric"},
			_jsii_.MemberProperty{JsiiProperty: "lastCheckpointDurationMsMetric", GoGetter: "LastCheckpointDurationMsMetric"},
			_jsii_.MemberProperty{JsiiProperty: "lastCheckpointSizeBytesMetric", GoGetter: "LastCheckpointSizeBytesMetric"},
			_jsii_.MemberProperty{JsiiProperty: "localAlarmNamePrefixOverride", GoGetter: "LocalAlarmNamePrefixOverride"},
			_jsii_.MemberProperty{JsiiProperty: "numberOfFailedCheckpointsCountMetric", GoGetter: "NumberOfFailedCheckpointsCountMetric"},
			_jsii_.MemberProperty{JsiiProperty: "oldGenerationGCCountMetric", GoGetter: "OldGenerationGCCountMetric"},
			_jsii_.MemberProperty{JsiiProperty: "oldGenerationGCTimeMsMetric", GoGetter: "OldGenerationGCTimeMsMetric"},
			_jsii_.MemberProperty{JsiiProperty: "scope", GoGetter: "Scope"},
			_jsii_.MemberMethod{JsiiMethod: "summaryWidgets", GoMethod: "SummaryWidgets"},
			_jsii_.MemberProperty{JsiiProperty: "title", GoGetter: "Title"},
			_jsii_.MemberMethod{JsiiMethod: "widgets", GoMethod: "Widgets"},
		},
		func() interface{} {
			j := jsiiProxy_KinesisDataAnalyticsMonitoring{}
			_jsii_.InitJsiiProxy(&j.jsiiProxy_Monitoring)
			return &j
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.KinesisDataAnalyticsMonitoringOptions",
		reflect.TypeOf((*KinesisDataAnalyticsMonitoringOptions)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.KinesisDataAnalyticsMonitoringProps",
		reflect.TypeOf((*KinesisDataAnalyticsMonitoringProps)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.KinesisDataStreamMetricFactory",
		reflect.TypeOf((*KinesisDataStreamMetricFactory)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberProperty{JsiiProperty: "dimensionsMap", GoGetter: "DimensionsMap"},
			_jsii_.MemberProperty{JsiiProperty: "metricFactory", GoGetter: "MetricFactory"},
			_jsii_.MemberMethod{JsiiMethod: "metricGetRecordsIteratorAgeMaxMs", GoMethod: "MetricGetRecordsIteratorAgeMaxMs"},
			_jsii_.MemberMethod{JsiiMethod: "metricGetRecordsLatencyAverageMs", GoMethod: "MetricGetRecordsLatencyAverageMs"},
			_jsii_.MemberMethod{JsiiMethod: "metricGetRecordsSuccessCount", GoMethod: "MetricGetRecordsSuccessCount"},
			_jsii_.MemberMethod{JsiiMethod: "metricGetRecordsSumBytes", GoMethod: "MetricGetRecordsSumBytes"},
			_jsii_.MemberMethod{JsiiMethod: "metricGetRecordsSumCount", GoMethod: "MetricGetRecordsSumCount"},
			_jsii_.MemberMethod{JsiiMethod: "metricIncomingDataSumBytes", GoMethod: "MetricIncomingDataSumBytes"},
			_jsii_.MemberMethod{JsiiMethod: "metricIncomingDataSumCount", GoMethod: "MetricIncomingDataSumCount"},
			_jsii_.MemberMethod{JsiiMethod: "metricPutRecordLatencyAverageMs", GoMethod: "MetricPutRecordLatencyAverageMs"},
			_jsii_.MemberMethod{JsiiMethod: "metricPutRecordsFailedRecordsCount", GoMethod: "MetricPutRecordsFailedRecordsCount"},
			_jsii_.MemberMethod{JsiiMethod: "metricPutRecordsLatencyAverageMs", GoMethod: "MetricPutRecordsLatencyAverageMs"},
			_jsii_.MemberMethod{JsiiMethod: "metricPutRecordsSuccessCount", GoMethod: "MetricPutRecordsSuccessCount"},
			_jsii_.MemberMethod{JsiiMethod: "metricPutRecordsSuccessfulRecordsCount", GoMethod: "MetricPutRecordsSuccessfulRecordsCount"},
			_jsii_.MemberMethod{JsiiMethod: "metricPutRecordsSumBytes", GoMethod: "MetricPutRecordsSumBytes"},
			_jsii_.MemberMethod{JsiiMethod: "metricPutRecordsThrottledRecordsCount", GoMethod: "MetricPutRecordsThrottledRecordsCount"},
			_jsii_.MemberMethod{JsiiMethod: "metricPutRecordsTotalRecordsCount", GoMethod: "MetricPutRecordsTotalRecordsCount"},
			_jsii_.MemberMethod{JsiiMethod: "metricPutRecordSuccessCount", GoMethod: "MetricPutRecordSuccessCount"},
			_jsii_.MemberMethod{JsiiMethod: "metricPutRecordSumBytes", GoMethod: "MetricPutRecordSumBytes"},
			_jsii_.MemberMethod{JsiiMethod: "metricReadProvisionedThroughputExceededPercent", GoMethod: "MetricReadProvisionedThroughputExceededPercent"},
			_jsii_.MemberMethod{JsiiMethod: "metricWriteProvisionedThroughputExceededPercent", GoMethod: "MetricWriteProvisionedThroughputExceededPercent"},
		},
		func() interface{} {
			return &jsiiProxy_KinesisDataStreamMetricFactory{}
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.KinesisDataStreamMetricFactoryProps",
		reflect.TypeOf((*KinesisDataStreamMetricFactoryProps)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.KinesisDataStreamMonitoring",
		reflect.TypeOf((*KinesisDataStreamMonitoring)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "addAlarm", GoMethod: "AddAlarm"},
			_jsii_.MemberProperty{JsiiProperty: "ageAnnotations", GoGetter: "AgeAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "alarms", GoGetter: "Alarms"},
			_jsii_.MemberMethod{JsiiMethod: "alarmWidgets", GoMethod: "AlarmWidgets"},
			_jsii_.MemberMethod{JsiiMethod: "createAlarmFactory", GoMethod: "CreateAlarmFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createCapacityWidget", GoMethod: "CreateCapacityWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createdAlarms", GoMethod: "CreatedAlarms"},
			_jsii_.MemberMethod{JsiiMethod: "createIncomingDataWidget", GoMethod: "CreateIncomingDataWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createIteratorAgeWidget", GoMethod: "CreateIteratorAgeWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createLatencyWidget", GoMethod: "CreateLatencyWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createMetricFactory", GoMethod: "CreateMetricFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createOperationWidget", GoMethod: "CreateOperationWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createRecordNumberWidget", GoMethod: "CreateRecordNumberWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createRecordSizeWidget", GoMethod: "CreateRecordSizeWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createSecondAdditionalRow", GoMethod: "CreateSecondAdditionalRow"},
			_jsii_.MemberMethod{JsiiMethod: "createTitleWidget", GoMethod: "CreateTitleWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createWidgetFactory", GoMethod: "CreateWidgetFactory"},
			_jsii_.MemberProperty{JsiiProperty: "incomingDataSumBytesMetric", GoGetter: "IncomingDataSumBytesMetric"},
			_jsii_.MemberProperty{JsiiProperty: "incomingDataSumCountMetric", GoGetter: "IncomingDataSumCountMetric"},
			_jsii_.MemberProperty{JsiiProperty: "kinesisAlarmFactory", GoGetter: "KinesisAlarmFactory"},
			_jsii_.MemberProperty{JsiiProperty: "localAlarmNamePrefixOverride", GoGetter: "LocalAlarmNamePrefixOverride"},
			_jsii_.MemberProperty{JsiiProperty: "metricGetRecordsIteratorAge", GoGetter: "MetricGetRecordsIteratorAge"},
			_jsii_.MemberProperty{JsiiProperty: "metricGetRecordsLatencyAverage", GoGetter: "MetricGetRecordsLatencyAverage"},
			_jsii_.MemberProperty{JsiiProperty: "metricGetRecordsSuccessCount", GoGetter: "MetricGetRecordsSuccessCount"},
			_jsii_.MemberProperty{JsiiProperty: "metricGetRecordsSumCount", GoGetter: "MetricGetRecordsSumCount"},
			_jsii_.MemberProperty{JsiiProperty: "metricGetRecordSumBytes", GoGetter: "MetricGetRecordSumBytes"},
			_jsii_.MemberProperty{JsiiProperty: "provisionedCapacityAnnotations", GoGetter: "ProvisionedCapacityAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "putRecordLatencyAverageMetric", GoGetter: "PutRecordLatencyAverageMetric"},
			_jsii_.MemberProperty{JsiiProperty: "putRecordsFailedRecordsCountMetric", GoGetter: "PutRecordsFailedRecordsCountMetric"},
			_jsii_.MemberProperty{JsiiProperty: "putRecordsLatencyAverageMetric", GoGetter: "PutRecordsLatencyAverageMetric"},
			_jsii_.MemberProperty{JsiiProperty: "putRecordsSuccessCountMetric", GoGetter: "PutRecordsSuccessCountMetric"},
			_jsii_.MemberProperty{JsiiProperty: "putRecordsSuccessfulRecordsCountMetric", GoGetter: "PutRecordsSuccessfulRecordsCountMetric"},
			_jsii_.MemberProperty{JsiiProperty: "putRecordsSumBytesMetric", GoGetter: "PutRecordsSumBytesMetric"},
			_jsii_.MemberProperty{JsiiProperty: "putRecordsThrottledRecordsCountMetric", GoGetter: "PutRecordsThrottledRecordsCountMetric"},
			_jsii_.MemberProperty{JsiiProperty: "putRecordsTotalRecordsCountMetric", GoGetter: "PutRecordsTotalRecordsCountMetric"},
			_jsii_.MemberProperty{JsiiProperty: "putRecordSuccessCountMetric", GoGetter: "PutRecordSuccessCountMetric"},
			_jsii_.MemberProperty{JsiiProperty: "putRecordSumBytesMetric", GoGetter: "PutRecordSumBytesMetric"},
			_jsii_.MemberProperty{JsiiProperty: "readProvisionedThroughputExceededMetric", GoGetter: "ReadProvisionedThroughputExceededMetric"},
			_jsii_.MemberProperty{JsiiProperty: "recordCountAnnotations", GoGetter: "RecordCountAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "scope", GoGetter: "Scope"},
			_jsii_.MemberProperty{JsiiProperty: "streamUrl", GoGetter: "StreamUrl"},
			_jsii_.MemberMethod{JsiiMethod: "summaryWidgets", GoMethod: "SummaryWidgets"},
			_jsii_.MemberProperty{JsiiProperty: "title", GoGetter: "Title"},
			_jsii_.MemberMethod{JsiiMethod: "widgets", GoMethod: "Widgets"},
			_jsii_.MemberProperty{JsiiProperty: "writeProvisionedThroughputExceededMetric", GoGetter: "WriteProvisionedThroughputExceededMetric"},
		},
		func() interface{} {
			j := jsiiProxy_KinesisDataStreamMonitoring{}
			_jsii_.InitJsiiProxy(&j.jsiiProxy_Monitoring)
			return &j
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.KinesisDataStreamMonitoringOptions",
		reflect.TypeOf((*KinesisDataStreamMonitoringOptions)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.KinesisDataStreamMonitoringProps",
		reflect.TypeOf((*KinesisDataStreamMonitoringProps)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.KinesisFirehoseMetricFactory",
		reflect.TypeOf((*KinesisFirehoseMetricFactory)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberProperty{JsiiProperty: "dimensionsMap", GoGetter: "DimensionsMap"},
			_jsii_.MemberMethod{JsiiMethod: "metricBytesPerSecondLimit", GoMethod: "MetricBytesPerSecondLimit"},
			_jsii_.MemberProperty{JsiiProperty: "metricFactory", GoGetter: "MetricFactory"},
			_jsii_.MemberMethod{JsiiMethod: "metricFailedConversionCount", GoMethod: "MetricFailedConversionCount"},
			_jsii_.MemberMethod{JsiiMethod: "metricIncomingBytes", GoMethod: "MetricIncomingBytes"},
			_jsii_.MemberMethod{JsiiMethod: "metricIncomingBytesToLimitRate", GoMethod: "MetricIncomingBytesToLimitRate"},
			_jsii_.MemberMethod{JsiiMethod: "metricIncomingPutRequests", GoMethod: "MetricIncomingPutRequests"},
			_jsii_.MemberMethod{JsiiMethod: "metricIncomingPutRequestsToLimitRate", GoMethod: "MetricIncomingPutRequestsToLimitRate"},
			_jsii_.MemberMethod{JsiiMethod: "metricIncomingRecordCount", GoMethod: "MetricIncomingRecordCount"},
			_jsii_.MemberMethod{JsiiMethod: "metricIncomingRecordsToLimitRate", GoMethod: "MetricIncomingRecordsToLimitRate"},
			_jsii_.MemberMethod{JsiiMethod: "metricPutRecordBatchLatencyP90InMillis", GoMethod: "MetricPutRecordBatchLatencyP90InMillis"},
			_jsii_.MemberMethod{JsiiMethod: "metricPutRecordLatencyP90InMillis", GoMethod: "MetricPutRecordLatencyP90InMillis"},
			_jsii_.MemberMethod{JsiiMethod: "metricPutRequestsPerSecondLimit", GoMethod: "MetricPutRequestsPerSecondLimit"},
			_jsii_.MemberMethod{JsiiMethod: "metricRecordsPerSecondLimit", GoMethod: "MetricRecordsPerSecondLimit"},
			_jsii_.MemberMethod{JsiiMethod: "metricSuccessfulConversionCount", GoMethod: "MetricSuccessfulConversionCount"},
			_jsii_.MemberMethod{JsiiMethod: "metricThrottledRecordCount", GoMethod: "MetricThrottledRecordCount"},
		},
		func() interface{} {
			return &jsiiProxy_KinesisFirehoseMetricFactory{}
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.KinesisFirehoseMetricFactoryProps",
		reflect.TypeOf((*KinesisFirehoseMetricFactoryProps)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.KinesisFirehoseMonitoring",
		reflect.TypeOf((*KinesisFirehoseMonitoring)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "addAlarm", GoMethod: "AddAlarm"},
			_jsii_.MemberProperty{JsiiProperty: "alarms", GoGetter: "Alarms"},
			_jsii_.MemberMethod{JsiiMethod: "alarmWidgets", GoMethod: "AlarmWidgets"},
			_jsii_.MemberMethod{JsiiMethod: "createAlarmFactory", GoMethod: "CreateAlarmFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createConversionWidget", GoMethod: "CreateConversionWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createdAlarms", GoMethod: "CreatedAlarms"},
			_jsii_.MemberMethod{JsiiMethod: "createIncomingRecordWidget", GoMethod: "CreateIncomingRecordWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createLatencyWidget", GoMethod: "CreateLatencyWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createLimitWidget", GoMethod: "CreateLimitWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createMetricFactory", GoMethod: "CreateMetricFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createTitleWidget", GoMethod: "CreateTitleWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createWidgetFactory", GoMethod: "CreateWidgetFactory"},
			_jsii_.MemberProperty{JsiiProperty: "failedConversionMetric", GoGetter: "FailedConversionMetric"},
			_jsii_.MemberProperty{JsiiProperty: "incomingBytesMetric", GoGetter: "IncomingBytesMetric"},
			_jsii_.MemberProperty{JsiiProperty: "incomingBytesToLimitRate", GoGetter: "IncomingBytesToLimitRate"},
			_jsii_.MemberProperty{JsiiProperty: "incomingPutRequestsToLimitRate", GoGetter: "IncomingPutRequestsToLimitRate"},
			_jsii_.MemberProperty{JsiiProperty: "incomingRecordsMetric", GoGetter: "IncomingRecordsMetric"},
			_jsii_.MemberProperty{JsiiProperty: "incomingRecordsToLimitRate", GoGetter: "IncomingRecordsToLimitRate"},
			_jsii_.MemberProperty{JsiiProperty: "kinesisAlarmFactory", GoGetter: "KinesisAlarmFactory"},
			_jsii_.MemberProperty{JsiiProperty: "localAlarmNamePrefixOverride", GoGetter: "LocalAlarmNamePrefixOverride"},
			_jsii_.MemberProperty{JsiiProperty: "putRecordBatchLatency", GoGetter: "PutRecordBatchLatency"},
			_jsii_.MemberProperty{JsiiProperty: "putRecordLatency", GoGetter: "PutRecordLatency"},
			_jsii_.MemberProperty{JsiiProperty: "recordCountAnnotations", GoGetter: "RecordCountAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "scope", GoGetter: "Scope"},
			_jsii_.MemberProperty{JsiiProperty: "streamUrl", GoGetter: "StreamUrl"},
			_jsii_.MemberProperty{JsiiProperty: "successfulConversionMetric", GoGetter: "SuccessfulConversionMetric"},
			_jsii_.MemberMethod{JsiiMethod: "summaryWidgets", GoMethod: "SummaryWidgets"},
			_jsii_.MemberProperty{JsiiProperty: "throttledRecordsMetric", GoGetter: "ThrottledRecordsMetric"},
			_jsii_.MemberProperty{JsiiProperty: "title", GoGetter: "Title"},
			_jsii_.MemberMethod{JsiiMethod: "widgets", GoMethod: "Widgets"},
		},
		func() interface{} {
			j := jsiiProxy_KinesisFirehoseMonitoring{}
			_jsii_.InitJsiiProxy(&j.jsiiProxy_Monitoring)
			return &j
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.KinesisFirehoseMonitoringOptions",
		reflect.TypeOf((*KinesisFirehoseMonitoringOptions)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.KinesisFirehoseMonitoringProps",
		reflect.TypeOf((*KinesisFirehoseMonitoringProps)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.LambdaFunctionEnhancedMetricFactory",
		reflect.TypeOf((*LambdaFunctionEnhancedMetricFactory)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "enhancedMetricAvgCpuTotalTime", GoMethod: "EnhancedMetricAvgCpuTotalTime"},
			_jsii_.MemberMethod{JsiiMethod: "enhancedMetricAvgMemoryUtilization", GoMethod: "EnhancedMetricAvgMemoryUtilization"},
			_jsii_.MemberMethod{JsiiMethod: "enhancedMetricFunctionCost", GoMethod: "EnhancedMetricFunctionCost"},
			_jsii_.MemberMethod{JsiiMethod: "enhancedMetricMaxCpuTotalTime", GoMethod: "EnhancedMetricMaxCpuTotalTime"},
			_jsii_.MemberMethod{JsiiMethod: "enhancedMetricMaxMemoryUtilization", GoMethod: "EnhancedMetricMaxMemoryUtilization"},
			_jsii_.MemberMethod{JsiiMethod: "enhancedMetricP90CpuTotalTime", GoMethod: "EnhancedMetricP90CpuTotalTime"},
			_jsii_.MemberMethod{JsiiMethod: "enhancedMetricP90MemoryUtilization", GoMethod: "EnhancedMetricP90MemoryUtilization"},
			_jsii_.MemberProperty{JsiiProperty: "lambdaFunction", GoGetter: "LambdaFunction"},
			_jsii_.MemberProperty{JsiiProperty: "metricFactory", GoGetter: "MetricFactory"},
		},
		func() interface{} {
			return &jsiiProxy_LambdaFunctionEnhancedMetricFactory{}
		},
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.LambdaFunctionMetricFactory",
		reflect.TypeOf((*LambdaFunctionMetricFactory)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberProperty{JsiiProperty: "fillTpsWithZeroes", GoGetter: "FillTpsWithZeroes"},
			_jsii_.MemberProperty{JsiiProperty: "lambdaFunction", GoGetter: "LambdaFunction"},
			_jsii_.MemberMethod{JsiiMethod: "metricConcurrentExecutions", GoMethod: "MetricConcurrentExecutions"},
			_jsii_.MemberProperty{JsiiProperty: "metricFactory", GoGetter: "MetricFactory"},
			_jsii_.MemberMethod{JsiiMethod: "metricFaultCount", GoMethod: "MetricFaultCount"},
			_jsii_.MemberMethod{JsiiMethod: "metricFaultRate", GoMethod: "MetricFaultRate"},
			_jsii_.MemberMethod{JsiiMethod: "metricInvocationCount", GoMethod: "MetricInvocationCount"},
			_jsii_.MemberMethod{JsiiMethod: "metricInvocationRate", GoMethod: "MetricInvocationRate"},
			_jsii_.MemberMethod{JsiiMethod: "metricLatencyP50InMillis", GoMethod: "MetricLatencyP50InMillis"},
			_jsii_.MemberMethod{JsiiMethod: "metricLatencyP90InMillis", GoMethod: "MetricLatencyP90InMillis"},
			_jsii_.MemberMethod{JsiiMethod: "metricLatencyP99InMillis", GoMethod: "MetricLatencyP99InMillis"},
			_jsii_.MemberMethod{JsiiMethod: "metricMaxIteratorAgeInMillis", GoMethod: "MetricMaxIteratorAgeInMillis"},
			_jsii_.MemberMethod{JsiiMethod: "metricProvisionedConcurrencySpilloverInvocations", GoMethod: "MetricProvisionedConcurrencySpilloverInvocations"},
			_jsii_.MemberMethod{JsiiMethod: "metricProvisionedConcurrencySpilloverRate", GoMethod: "MetricProvisionedConcurrencySpilloverRate"},
			_jsii_.MemberMethod{JsiiMethod: "metricThrottlesCount", GoMethod: "MetricThrottlesCount"},
			_jsii_.MemberMethod{JsiiMethod: "metricThrottlesRate", GoMethod: "MetricThrottlesRate"},
			_jsii_.MemberMethod{JsiiMethod: "metricTps", GoMethod: "MetricTps"},
			_jsii_.MemberProperty{JsiiProperty: "rateComputationMethod", GoGetter: "RateComputationMethod"},
		},
		func() interface{} {
			return &jsiiProxy_LambdaFunctionMetricFactory{}
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.LambdaFunctionMetricFactoryProps",
		reflect.TypeOf((*LambdaFunctionMetricFactoryProps)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.LambdaFunctionMonitoring",
		reflect.TypeOf((*LambdaFunctionMonitoring)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "addAlarm", GoMethod: "AddAlarm"},
			_jsii_.MemberProperty{JsiiProperty: "ageAlarmFactory", GoGetter: "AgeAlarmFactory"},
			_jsii_.MemberProperty{JsiiProperty: "alarmFactory", GoGetter: "AlarmFactory"},
			_jsii_.MemberProperty{JsiiProperty: "alarms", GoGetter: "Alarms"},
			_jsii_.MemberMethod{JsiiMethod: "alarmWidgets", GoMethod: "AlarmWidgets"},
			_jsii_.MemberProperty{JsiiProperty: "concurrentExecutionsCountMetric", GoGetter: "ConcurrentExecutionsCountMetric"},
			_jsii_.MemberProperty{JsiiProperty: "cpuTotalTimeAnnotations", GoGetter: "CpuTotalTimeAnnotations"},
			_jsii_.MemberMethod{JsiiMethod: "createAlarmFactory", GoMethod: "CreateAlarmFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createdAlarms", GoMethod: "CreatedAlarms"},
			_jsii_.MemberMethod{JsiiMethod: "createErrorCountWidget", GoMethod: "CreateErrorCountWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createErrorRateWidget", GoMethod: "CreateErrorRateWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createInvocationWidget", GoMethod: "CreateInvocationWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createIteratorAgeWidget", GoMethod: "CreateIteratorAgeWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createLambdaInsightsCpuWidget", GoMethod: "CreateLambdaInsightsCpuWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createLambdaInsightsFunctionCostWidget", GoMethod: "CreateLambdaInsightsFunctionCostWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createLambdaInsightsMemoryWidget", GoMethod: "CreateLambdaInsightsMemoryWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createLatencyWidget", GoMethod: "CreateLatencyWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createMetricFactory", GoMethod: "CreateMetricFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createRateWidget", GoMethod: "CreateRateWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createTitleWidget", GoMethod: "CreateTitleWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createTpsWidget", GoMethod: "CreateTpsWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createWidgetFactory", GoMethod: "CreateWidgetFactory"},
			_jsii_.MemberProperty{JsiiProperty: "enhancedMetricFactory", GoGetter: "EnhancedMetricFactory"},
			_jsii_.MemberProperty{JsiiProperty: "enhancedMetricFunctionCostMetric", GoGetter: "EnhancedMetricFunctionCostMetric"},
			_jsii_.MemberProperty{JsiiProperty: "enhancedMonitoringAvgCpuTotalTimeMetric", GoGetter: "EnhancedMonitoringAvgCpuTotalTimeMetric"},
			_jsii_.MemberProperty{JsiiProperty: "enhancedMonitoringAvgMemoryUtilizationMetric", GoGetter: "EnhancedMonitoringAvgMemoryUtilizationMetric"},
			_jsii_.MemberProperty{JsiiProperty: "enhancedMonitoringMaxCpuTotalTimeMetric", GoGetter: "EnhancedMonitoringMaxCpuTotalTimeMetric"},
			_jsii_.MemberProperty{JsiiProperty: "enhancedMonitoringMaxMemoryUtilizationMetric", GoGetter: "EnhancedMonitoringMaxMemoryUtilizationMetric"},
			_jsii_.MemberProperty{JsiiProperty: "enhancedMonitoringP90CpuTotalTimeMetric", GoGetter: "EnhancedMonitoringP90CpuTotalTimeMetric"},
			_jsii_.MemberProperty{JsiiProperty: "enhancedMonitoringP90MemoryUtilizationMetric", GoGetter: "EnhancedMonitoringP90MemoryUtilizationMetric"},
			_jsii_.MemberProperty{JsiiProperty: "errorAlarmFactory", GoGetter: "ErrorAlarmFactory"},
			_jsii_.MemberProperty{JsiiProperty: "errorCountAnnotations", GoGetter: "ErrorCountAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "errorRateAnnotations", GoGetter: "ErrorRateAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "faultCountMetric", GoGetter: "FaultCountMetric"},
			_jsii_.MemberProperty{JsiiProperty: "faultRateMetric", GoGetter: "FaultRateMetric"},
			_jsii_.MemberProperty{JsiiProperty: "functionUrl", GoGetter: "FunctionUrl"},
			_jsii_.MemberProperty{JsiiProperty: "invocationCountAnnotations", GoGetter: "InvocationCountAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "invocationCountMetric", GoGetter: "InvocationCountMetric"},
			_jsii_.MemberProperty{JsiiProperty: "invocationRateAnnotations", GoGetter: "InvocationRateAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "lambdaInsightsEnabled", GoGetter: "LambdaInsightsEnabled"},
			_jsii_.MemberProperty{JsiiProperty: "latencyAlarmFactory", GoGetter: "LatencyAlarmFactory"},
			_jsii_.MemberProperty{JsiiProperty: "latencyAnnotations", GoGetter: "LatencyAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "localAlarmNamePrefixOverride", GoGetter: "LocalAlarmNamePrefixOverride"},
			_jsii_.MemberProperty{JsiiProperty: "maxIteratorAgeAnnotations", GoGetter: "MaxIteratorAgeAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "maxIteratorAgeMetric", GoGetter: "MaxIteratorAgeMetric"},
			_jsii_.MemberProperty{JsiiProperty: "memoryUsageAnnotations", GoGetter: "MemoryUsageAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "metricFactory", GoGetter: "MetricFactory"},
			_jsii_.MemberProperty{JsiiProperty: "namingStrategy", GoGetter: "NamingStrategy"},
			_jsii_.MemberProperty{JsiiProperty: "p50LatencyMetric", GoGetter: "P50LatencyMetric"},
			_jsii_.MemberProperty{JsiiProperty: "p90LatencyMetric", GoGetter: "P90LatencyMetric"},
			_jsii_.MemberProperty{JsiiProperty: "p99LatencyMetric", GoGetter: "P99LatencyMetric"},
			_jsii_.MemberProperty{JsiiProperty: "provisionedConcurrencySpilloverInvocationsCountMetric", GoGetter: "ProvisionedConcurrencySpilloverInvocationsCountMetric"},
			_jsii_.MemberProperty{JsiiProperty: "provisionedConcurrencySpilloverInvocationsRateMetric", GoGetter: "ProvisionedConcurrencySpilloverInvocationsRateMetric"},
			_jsii_.MemberProperty{JsiiProperty: "scope", GoGetter: "Scope"},
			_jsii_.MemberMethod{JsiiMethod: "summaryWidgets", GoMethod: "SummaryWidgets"},
			_jsii_.MemberProperty{JsiiProperty: "taskHealthAlarmFactory", GoGetter: "TaskHealthAlarmFactory"},
			_jsii_.MemberProperty{JsiiProperty: "throttlesCountMetric", GoGetter: "ThrottlesCountMetric"},
			_jsii_.MemberProperty{JsiiProperty: "throttlesRateMetric", GoGetter: "ThrottlesRateMetric"},
			_jsii_.MemberProperty{JsiiProperty: "title", GoGetter: "Title"},
			_jsii_.MemberProperty{JsiiProperty: "tpsAlarmFactory", GoGetter: "TpsAlarmFactory"},
			_jsii_.MemberProperty{JsiiProperty: "tpsAnnotations", GoGetter: "TpsAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "tpsMetric", GoGetter: "TpsMetric"},
			_jsii_.MemberProperty{JsiiProperty: "usageAlarmFactory", GoGetter: "UsageAlarmFactory"},
			_jsii_.MemberMethod{JsiiMethod: "widgets", GoMethod: "Widgets"},
		},
		func() interface{} {
			j := jsiiProxy_LambdaFunctionMonitoring{}
			_jsii_.InitJsiiProxy(&j.jsiiProxy_Monitoring)
			return &j
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.LambdaFunctionMonitoringOptions",
		reflect.TypeOf((*LambdaFunctionMonitoringOptions)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.LambdaFunctionMonitoringProps",
		reflect.TypeOf((*LambdaFunctionMonitoringProps)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.LatencyAlarmFactory",
		reflect.TypeOf((*LatencyAlarmFactory)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "addDurationAlarm", GoMethod: "AddDurationAlarm"},
			_jsii_.MemberMethod{JsiiMethod: "addIntegrationLatencyAlarm", GoMethod: "AddIntegrationLatencyAlarm"},
			_jsii_.MemberMethod{JsiiMethod: "addJvmGarbageCollectionDurationAlarm", GoMethod: "AddJvmGarbageCollectionDurationAlarm"},
			_jsii_.MemberMethod{JsiiMethod: "addLatencyAlarm", GoMethod: "AddLatencyAlarm"},
			_jsii_.MemberProperty{JsiiProperty: "alarmFactory", GoGetter: "AlarmFactory"},
		},
		func() interface{} {
			return &jsiiProxy_LatencyAlarmFactory{}
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.LatencyThreshold",
		reflect.TypeOf((*LatencyThreshold)(nil)).Elem(),
	)
	_jsii_.RegisterEnum(
		"cdk-monitoring-constructs.LatencyType",
		reflect.TypeOf((*LatencyType)(nil)).Elem(),
		map[string]interface{}{
			"P50": LatencyType_P50,
			"P70": LatencyType_P70,
			"P90": LatencyType_P90,
			"P95": LatencyType_P95,
			"P99": LatencyType_P99,
			"P999": LatencyType_P999,
			"P9999": LatencyType_P9999,
			"P100": LatencyType_P100,
			"TM50": LatencyType_TM50,
			"TM70": LatencyType_TM70,
			"TM90": LatencyType_TM90,
			"TM95": LatencyType_TM95,
			"TM99": LatencyType_TM99,
			"TM999": LatencyType_TM999,
			"TM9999": LatencyType_TM9999,
			"AVERAGE": LatencyType_AVERAGE,
		},
	)
	_jsii_.RegisterEnum(
		"cdk-monitoring-constructs.LogLevel",
		reflect.TypeOf((*LogLevel)(nil)).Elem(),
		map[string]interface{}{
			"ERROR": LogLevel_ERROR,
			"CRITICAL": LogLevel_CRITICAL,
			"FATAL": LogLevel_FATAL,
		},
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.LogLevelAlarmFactory",
		reflect.TypeOf((*LogLevelAlarmFactory)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "addLogCountAlarm", GoMethod: "AddLogCountAlarm"},
			_jsii_.MemberProperty{JsiiProperty: "alarmFactory", GoGetter: "AlarmFactory"},
		},
		func() interface{} {
			return &jsiiProxy_LogLevelAlarmFactory{}
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.LogLevelCountThreshold",
		reflect.TypeOf((*LogLevelCountThreshold)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.LogMonitoring",
		reflect.TypeOf((*LogMonitoring)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "addAlarm", GoMethod: "AddAlarm"},
			_jsii_.MemberProperty{JsiiProperty: "alarms", GoGetter: "Alarms"},
			_jsii_.MemberMethod{JsiiMethod: "alarmWidgets", GoMethod: "AlarmWidgets"},
			_jsii_.MemberMethod{JsiiMethod: "createAlarmFactory", GoMethod: "CreateAlarmFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createdAlarms", GoMethod: "CreatedAlarms"},
			_jsii_.MemberMethod{JsiiMethod: "createMetricFactory", GoMethod: "CreateMetricFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createWidgetFactory", GoMethod: "CreateWidgetFactory"},
			_jsii_.MemberProperty{JsiiProperty: "limit", GoGetter: "Limit"},
			_jsii_.MemberProperty{JsiiProperty: "localAlarmNamePrefixOverride", GoGetter: "LocalAlarmNamePrefixOverride"},
			_jsii_.MemberProperty{JsiiProperty: "logGroupName", GoGetter: "LogGroupName"},
			_jsii_.MemberProperty{JsiiProperty: "logGroupUrl", GoGetter: "LogGroupUrl"},
			_jsii_.MemberProperty{JsiiProperty: "pattern", GoGetter: "Pattern"},
			_jsii_.MemberMethod{JsiiMethod: "resolveRecommendedHeight", GoMethod: "ResolveRecommendedHeight"},
			_jsii_.MemberProperty{JsiiProperty: "scope", GoGetter: "Scope"},
			_jsii_.MemberMethod{JsiiMethod: "summaryWidgets", GoMethod: "SummaryWidgets"},
			_jsii_.MemberProperty{JsiiProperty: "title", GoGetter: "Title"},
			_jsii_.MemberMethod{JsiiMethod: "widgets", GoMethod: "Widgets"},
		},
		func() interface{} {
			j := jsiiProxy_LogMonitoring{}
			_jsii_.InitJsiiProxy(&j.jsiiProxy_Monitoring)
			return &j
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.LogMonitoringProps",
		reflect.TypeOf((*LogMonitoringProps)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.LowMessagesPublishedThreshold",
		reflect.TypeOf((*LowMessagesPublishedThreshold)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.LowTpsThreshold",
		reflect.TypeOf((*LowTpsThreshold)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.MaxAgeThreshold",
		reflect.TypeOf((*MaxAgeThreshold)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.MaxDowntimeThreshold",
		reflect.TypeOf((*MaxDowntimeThreshold)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.MaxIncomingMessagesCountThreshold",
		reflect.TypeOf((*MaxIncomingMessagesCountThreshold)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.MaxItemsCountThreshold",
		reflect.TypeOf((*MaxItemsCountThreshold)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.MaxIteratorAgeThreshold",
		reflect.TypeOf((*MaxIteratorAgeThreshold)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.MaxMessageAgeThreshold",
		reflect.TypeOf((*MaxMessageAgeThreshold)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.MaxMessageCountThreshold",
		reflect.TypeOf((*MaxMessageCountThreshold)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.MaxTimeToDrainThreshold",
		reflect.TypeOf((*MaxTimeToDrainThreshold)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.MaxUsedSwapMemoryThreshold",
		reflect.TypeOf((*MaxUsedSwapMemoryThreshold)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.MetricFactory",
		reflect.TypeOf((*MetricFactory)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "adaptMetric", GoMethod: "AdaptMetric"},
			_jsii_.MemberMethod{JsiiMethod: "adaptMetricPreservingPeriod", GoMethod: "AdaptMetricPreservingPeriod"},
			_jsii_.MemberMethod{JsiiMethod: "addAdditionalDimensions", GoMethod: "AddAdditionalDimensions"},
			_jsii_.MemberMethod{JsiiMethod: "createMetric", GoMethod: "CreateMetric"},
			_jsii_.MemberMethod{JsiiMethod: "createMetricAnomalyDetection", GoMethod: "CreateMetricAnomalyDetection"},
			_jsii_.MemberMethod{JsiiMethod: "createMetricMath", GoMethod: "CreateMetricMath"},
			_jsii_.MemberMethod{JsiiMethod: "createMetricSearch", GoMethod: "CreateMetricSearch"},
			_jsii_.MemberMethod{JsiiMethod: "divideMetric", GoMethod: "DivideMetric"},
			_jsii_.MemberMethod{JsiiMethod: "getNamespaceWithFallback", GoMethod: "GetNamespaceWithFallback"},
			_jsii_.MemberProperty{JsiiProperty: "globalDefaults", GoGetter: "GlobalDefaults"},
			_jsii_.MemberMethod{JsiiMethod: "multiplyMetric", GoMethod: "MultiplyMetric"},
			_jsii_.MemberMethod{JsiiMethod: "sanitizeMetricExpressionIdSuffix", GoMethod: "SanitizeMetricExpressionIdSuffix"},
			_jsii_.MemberMethod{JsiiMethod: "toRate", GoMethod: "ToRate"},
		},
		func() interface{} {
			return &jsiiProxy_MetricFactory{}
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.MetricFactoryDefaults",
		reflect.TypeOf((*MetricFactoryDefaults)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.MetricFactoryProps",
		reflect.TypeOf((*MetricFactoryProps)(nil)).Elem(),
	)
	_jsii_.RegisterEnum(
		"cdk-monitoring-constructs.MetricStatistic",
		reflect.TypeOf((*MetricStatistic)(nil)).Elem(),
		map[string]interface{}{
			"P50": MetricStatistic_P50,
			"P70": MetricStatistic_P70,
			"P90": MetricStatistic_P90,
			"P95": MetricStatistic_P95,
			"P99": MetricStatistic_P99,
			"P999": MetricStatistic_P999,
			"P9999": MetricStatistic_P9999,
			"P100": MetricStatistic_P100,
			"TM50": MetricStatistic_TM50,
			"TM70": MetricStatistic_TM70,
			"TM90": MetricStatistic_TM90,
			"TM95": MetricStatistic_TM95,
			"TM99": MetricStatistic_TM99,
			"TM999": MetricStatistic_TM999,
			"TM9999": MetricStatistic_TM9999,
			"TM99_BOTH": MetricStatistic_TM99_BOTH,
			"TM95_BOTH": MetricStatistic_TM95_BOTH,
			"TM90_BOTH": MetricStatistic_TM90_BOTH,
			"TM85_BOTH": MetricStatistic_TM85_BOTH,
			"TM80_BOTH": MetricStatistic_TM80_BOTH,
			"TM75_BOTH": MetricStatistic_TM75_BOTH,
			"TM70_BOTH": MetricStatistic_TM70_BOTH,
			"WM50": MetricStatistic_WM50,
			"WM70": MetricStatistic_WM70,
			"WM90": MetricStatistic_WM90,
			"WM95": MetricStatistic_WM95,
			"WM99": MetricStatistic_WM99,
			"WM999": MetricStatistic_WM999,
			"WM9999": MetricStatistic_WM9999,
			"WM99_BOTH": MetricStatistic_WM99_BOTH,
			"WM95_BOTH": MetricStatistic_WM95_BOTH,
			"WM90_BOTH": MetricStatistic_WM90_BOTH,
			"WM85_BOTH": MetricStatistic_WM85_BOTH,
			"WM80_BOTH": MetricStatistic_WM80_BOTH,
			"WM75_BOTH": MetricStatistic_WM75_BOTH,
			"WM70_BOTH": MetricStatistic_WM70_BOTH,
			"MIN": MetricStatistic_MIN,
			"MAX": MetricStatistic_MAX,
			"SUM": MetricStatistic_SUM,
			"AVERAGE": MetricStatistic_AVERAGE,
			"N": MetricStatistic_N,
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.MinFreeableMemoryThreshold",
		reflect.TypeOf((*MinFreeableMemoryThreshold)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.MinIncomingMessagesCountThreshold",
		reflect.TypeOf((*MinIncomingMessagesCountThreshold)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.MinMessageCountThreshold",
		reflect.TypeOf((*MinMessageCountThreshold)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.MinProcessedBytesThreshold",
		reflect.TypeOf((*MinProcessedBytesThreshold)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.MinRunningTaskCountThreshold",
		reflect.TypeOf((*MinRunningTaskCountThreshold)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.Monitoring",
		reflect.TypeOf((*Monitoring)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "addAlarm", GoMethod: "AddAlarm"},
			_jsii_.MemberProperty{JsiiProperty: "alarms", GoGetter: "Alarms"},
			_jsii_.MemberMethod{JsiiMethod: "alarmWidgets", GoMethod: "AlarmWidgets"},
			_jsii_.MemberMethod{JsiiMethod: "createAlarmFactory", GoMethod: "CreateAlarmFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createdAlarms", GoMethod: "CreatedAlarms"},
			_jsii_.MemberMethod{JsiiMethod: "createMetricFactory", GoMethod: "CreateMetricFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createWidgetFactory", GoMethod: "CreateWidgetFactory"},
			_jsii_.MemberProperty{JsiiProperty: "localAlarmNamePrefixOverride", GoGetter: "LocalAlarmNamePrefixOverride"},
			_jsii_.MemberProperty{JsiiProperty: "scope", GoGetter: "Scope"},
			_jsii_.MemberMethod{JsiiMethod: "summaryWidgets", GoMethod: "SummaryWidgets"},
			_jsii_.MemberMethod{JsiiMethod: "widgets", GoMethod: "Widgets"},
		},
		func() interface{} {
			j := jsiiProxy_Monitoring{}
			_jsii_.InitJsiiProxy(&j.jsiiProxy_IDashboardSegment)
			return &j
		},
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.MonitoringAspect",
		reflect.TypeOf((*MonitoringAspect)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "visit", GoMethod: "Visit"},
		},
		func() interface{} {
			j := jsiiProxy_MonitoringAspect{}
			_jsii_.InitJsiiProxy(&j.Type__awscdkIAspect)
			return &j
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.MonitoringAspectProps",
		reflect.TypeOf((*MonitoringAspectProps)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.MonitoringAspectType",
		reflect.TypeOf((*MonitoringAspectType)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.MonitoringDashboardsOverrideProps",
		reflect.TypeOf((*MonitoringDashboardsOverrideProps)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.MonitoringDashboardsProps",
		reflect.TypeOf((*MonitoringDashboardsProps)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.MonitoringFacade",
		reflect.TypeOf((*MonitoringFacade)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "addLargeHeader", GoMethod: "AddLargeHeader"},
			_jsii_.MemberMethod{JsiiMethod: "addMediumHeader", GoMethod: "AddMediumHeader"},
			_jsii_.MemberMethod{JsiiMethod: "addSegment", GoMethod: "AddSegment"},
			_jsii_.MemberMethod{JsiiMethod: "addSmallHeader", GoMethod: "AddSmallHeader"},
			_jsii_.MemberMethod{JsiiMethod: "addWidget", GoMethod: "AddWidget"},
			_jsii_.MemberProperty{JsiiProperty: "alarmFactoryDefaults", GoGetter: "AlarmFactoryDefaults"},
			_jsii_.MemberMethod{JsiiMethod: "createAlarmFactory", GoMethod: "CreateAlarmFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createAwsConsoleUrlFactory", GoMethod: "CreateAwsConsoleUrlFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createCompositeAlarmUsingDisambiguator", GoMethod: "CreateCompositeAlarmUsingDisambiguator"},
			_jsii_.MemberMethod{JsiiMethod: "createCompositeAlarmUsingTag", GoMethod: "CreateCompositeAlarmUsingTag"},
			_jsii_.MemberMethod{JsiiMethod: "createdAlarmDashboard", GoMethod: "CreatedAlarmDashboard"},
			_jsii_.MemberMethod{JsiiMethod: "createdAlarms", GoMethod: "CreatedAlarms"},
			_jsii_.MemberMethod{JsiiMethod: "createdAlarmsWithDisambiguator", GoMethod: "CreatedAlarmsWithDisambiguator"},
			_jsii_.MemberMethod{JsiiMethod: "createdAlarmsWithTag", GoMethod: "CreatedAlarmsWithTag"},
			_jsii_.MemberMethod{JsiiMethod: "createdDashboard", GoMethod: "CreatedDashboard"},
			_jsii_.MemberMethod{JsiiMethod: "createdMonitorings", GoMethod: "CreatedMonitorings"},
			_jsii_.MemberProperty{JsiiProperty: "createdSegments", GoGetter: "CreatedSegments"},
			_jsii_.MemberMethod{JsiiMethod: "createdSummaryDashboard", GoMethod: "CreatedSummaryDashboard"},
			_jsii_.MemberMethod{JsiiMethod: "createMetricFactory", GoMethod: "CreateMetricFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createWidgetFactory", GoMethod: "CreateWidgetFactory"},
			_jsii_.MemberProperty{JsiiProperty: "dashboardFactory", GoGetter: "DashboardFactory"},
			_jsii_.MemberProperty{JsiiProperty: "metricFactoryDefaults", GoGetter: "MetricFactoryDefaults"},
			_jsii_.MemberMethod{JsiiMethod: "monitorApiGateway", GoMethod: "MonitorApiGateway"},
			_jsii_.MemberMethod{JsiiMethod: "monitorApiGatewayV2HttpApi", GoMethod: "MonitorApiGatewayV2HttpApi"},
			_jsii_.MemberMethod{JsiiMethod: "monitorAppSyncApi", GoMethod: "MonitorAppSyncApi"},
			_jsii_.MemberMethod{JsiiMethod: "monitorAutoScalingGroup", GoMethod: "MonitorAutoScalingGroup"},
			_jsii_.MemberMethod{JsiiMethod: "monitorBilling", GoMethod: "MonitorBilling"},
			_jsii_.MemberMethod{JsiiMethod: "monitorCertificate", GoMethod: "MonitorCertificate"},
			_jsii_.MemberMethod{JsiiMethod: "monitorCloudFrontDistribution", GoMethod: "MonitorCloudFrontDistribution"},
			_jsii_.MemberMethod{JsiiMethod: "monitorCodeBuildProject", GoMethod: "MonitorCodeBuildProject"},
			_jsii_.MemberMethod{JsiiMethod: "monitorCustom", GoMethod: "MonitorCustom"},
			_jsii_.MemberMethod{JsiiMethod: "monitorDocumentDbCluster", GoMethod: "MonitorDocumentDbCluster"},
			_jsii_.MemberMethod{JsiiMethod: "monitorDynamoTable", GoMethod: "MonitorDynamoTable"},
			_jsii_.MemberMethod{JsiiMethod: "monitorDynamoTableGlobalSecondaryIndex", GoMethod: "MonitorDynamoTableGlobalSecondaryIndex"},
			_jsii_.MemberMethod{JsiiMethod: "monitorEc2ApplicationLoadBalancer", GoMethod: "MonitorEc2ApplicationLoadBalancer"},
			_jsii_.MemberMethod{JsiiMethod: "monitorEC2Instances", GoMethod: "MonitorEC2Instances"},
			_jsii_.MemberMethod{JsiiMethod: "monitorEc2NetworkLoadBalancer", GoMethod: "MonitorEc2NetworkLoadBalancer"},
			_jsii_.MemberMethod{JsiiMethod: "monitorEc2Service", GoMethod: "MonitorEc2Service"},
			_jsii_.MemberMethod{JsiiMethod: "monitorElastiCacheCluster", GoMethod: "MonitorElastiCacheCluster"},
			_jsii_.MemberMethod{JsiiMethod: "monitorElasticsearchCluster", GoMethod: "MonitorElasticsearchCluster"},
			_jsii_.MemberMethod{JsiiMethod: "monitorFargateApplicationLoadBalancer", GoMethod: "MonitorFargateApplicationLoadBalancer"},
			_jsii_.MemberMethod{JsiiMethod: "monitorFargateNetworkLoadBalancer", GoMethod: "MonitorFargateNetworkLoadBalancer"},
			_jsii_.MemberMethod{JsiiMethod: "monitorFargateService", GoMethod: "MonitorFargateService"},
			_jsii_.MemberMethod{JsiiMethod: "monitorGlueJob", GoMethod: "MonitorGlueJob"},
			_jsii_.MemberMethod{JsiiMethod: "monitorKinesisDataAnalytics", GoMethod: "MonitorKinesisDataAnalytics"},
			_jsii_.MemberMethod{JsiiMethod: "monitorKinesisDataStream", GoMethod: "MonitorKinesisDataStream"},
			_jsii_.MemberMethod{JsiiMethod: "monitorKinesisFirehose", GoMethod: "MonitorKinesisFirehose"},
			_jsii_.MemberMethod{JsiiMethod: "monitorLambdaFunction", GoMethod: "MonitorLambdaFunction"},
			_jsii_.MemberMethod{JsiiMethod: "monitorLog", GoMethod: "MonitorLog"},
			_jsii_.MemberMethod{JsiiMethod: "monitorNetworkLoadBalancer", GoMethod: "MonitorNetworkLoadBalancer"},
			_jsii_.MemberMethod{JsiiMethod: "monitorOpenSearchCluster", GoMethod: "MonitorOpenSearchCluster"},
			_jsii_.MemberMethod{JsiiMethod: "monitorQueueProcessingEc2Service", GoMethod: "MonitorQueueProcessingEc2Service"},
			_jsii_.MemberMethod{JsiiMethod: "monitorQueueProcessingFargateService", GoMethod: "MonitorQueueProcessingFargateService"},
			_jsii_.MemberMethod{JsiiMethod: "monitorRdsCluster", GoMethod: "MonitorRdsCluster"},
			_jsii_.MemberMethod{JsiiMethod: "monitorRedshiftCluster", GoMethod: "MonitorRedshiftCluster"},
			_jsii_.MemberMethod{JsiiMethod: "monitorS3Bucket", GoMethod: "MonitorS3Bucket"},
			_jsii_.MemberMethod{JsiiMethod: "monitorScope", GoMethod: "MonitorScope"},
			_jsii_.MemberMethod{JsiiMethod: "monitorSecretsManagerSecret", GoMethod: "MonitorSecretsManagerSecret"},
			_jsii_.MemberMethod{JsiiMethod: "monitorSimpleEc2Service", GoMethod: "MonitorSimpleEc2Service"},
			_jsii_.MemberMethod{JsiiMethod: "monitorSimpleFargateService", GoMethod: "MonitorSimpleFargateService"},
			_jsii_.MemberMethod{JsiiMethod: "monitorSnsTopic", GoMethod: "MonitorSnsTopic"},
			_jsii_.MemberMethod{JsiiMethod: "monitorSqsQueue", GoMethod: "MonitorSqsQueue"},
			_jsii_.MemberMethod{JsiiMethod: "monitorSqsQueueWithDlq", GoMethod: "MonitorSqsQueueWithDlq"},
			_jsii_.MemberMethod{JsiiMethod: "monitorStepFunction", GoMethod: "MonitorStepFunction"},
			_jsii_.MemberMethod{JsiiMethod: "monitorStepFunctionActivity", GoMethod: "MonitorStepFunctionActivity"},
			_jsii_.MemberMethod{JsiiMethod: "monitorStepFunctionLambdaIntegration", GoMethod: "MonitorStepFunctionLambdaIntegration"},
			_jsii_.MemberMethod{JsiiMethod: "monitorStepFunctionServiceIntegration", GoMethod: "MonitorStepFunctionServiceIntegration"},
			_jsii_.MemberMethod{JsiiMethod: "monitorSyntheticsCanary", GoMethod: "MonitorSyntheticsCanary"},
			_jsii_.MemberMethod{JsiiMethod: "monitorWebApplicationFirewallAclV2", GoMethod: "MonitorWebApplicationFirewallAclV2"},
			_jsii_.MemberProperty{JsiiProperty: "node", GoGetter: "Node"},
			_jsii_.MemberMethod{JsiiMethod: "toString", GoMethod: "ToString"},
		},
		func() interface{} {
			j := jsiiProxy_MonitoringFacade{}
			_jsii_.InitJsiiProxy(&j.jsiiProxy_MonitoringScope)
			return &j
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.MonitoringFacadeProps",
		reflect.TypeOf((*MonitoringFacadeProps)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.MonitoringHeaderWidget",
		reflect.TypeOf((*MonitoringHeaderWidget)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberProperty{JsiiProperty: "height", GoGetter: "Height"},
			_jsii_.MemberMethod{JsiiMethod: "position", GoMethod: "Position"},
			_jsii_.MemberMethod{JsiiMethod: "toJson", GoMethod: "ToJson"},
			_jsii_.MemberProperty{JsiiProperty: "width", GoGetter: "Width"},
			_jsii_.MemberProperty{JsiiProperty: "x", GoGetter: "X"},
			_jsii_.MemberProperty{JsiiProperty: "y", GoGetter: "Y"},
		},
		func() interface{} {
			j := jsiiProxy_MonitoringHeaderWidget{}
			_jsii_.InitJsiiProxy(&j.jsiiProxy_HeaderWidget)
			return &j
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.MonitoringHeaderWidgetProps",
		reflect.TypeOf((*MonitoringHeaderWidgetProps)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.MonitoringNamingStrategy",
		reflect.TypeOf((*MonitoringNamingStrategy)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberProperty{JsiiProperty: "input", GoGetter: "Input"},
			_jsii_.MemberMethod{JsiiMethod: "resolveAlarmFriendlyName", GoMethod: "ResolveAlarmFriendlyName"},
			_jsii_.MemberMethod{JsiiMethod: "resolveHumanReadableName", GoMethod: "ResolveHumanReadableName"},
		},
		func() interface{} {
			return &jsiiProxy_MonitoringNamingStrategy{}
		},
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.MonitoringScope",
		reflect.TypeOf((*MonitoringScope)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "createAlarmFactory", GoMethod: "CreateAlarmFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createAwsConsoleUrlFactory", GoMethod: "CreateAwsConsoleUrlFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createMetricFactory", GoMethod: "CreateMetricFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createWidgetFactory", GoMethod: "CreateWidgetFactory"},
			_jsii_.MemberProperty{JsiiProperty: "node", GoGetter: "Node"},
			_jsii_.MemberMethod{JsiiMethod: "toString", GoMethod: "ToString"},
		},
		func() interface{} {
			j := jsiiProxy_MonitoringScope{}
			_jsii_.InitJsiiProxy(&j.Type__constructsConstruct)
			return &j
		},
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.MultipleAlarmActionStrategy",
		reflect.TypeOf((*MultipleAlarmActionStrategy)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberProperty{JsiiProperty: "actions", GoGetter: "Actions"},
			_jsii_.MemberMethod{JsiiMethod: "addAlarmActions", GoMethod: "AddAlarmActions"},
		},
		func() interface{} {
			j := jsiiProxy_MultipleAlarmActionStrategy{}
			_jsii_.InitJsiiProxy(&j.jsiiProxy_IAlarmActionStrategy)
			return &j
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.NameResolutionInput",
		reflect.TypeOf((*NameResolutionInput)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.NetworkLoadBalancerMetricFactory",
		reflect.TypeOf((*NetworkLoadBalancerMetricFactory)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "metricActiveConnectionCount", GoMethod: "MetricActiveConnectionCount"},
			_jsii_.MemberProperty{JsiiProperty: "metricFactory", GoGetter: "MetricFactory"},
			_jsii_.MemberMethod{JsiiMethod: "metricHealthyTaskCount", GoMethod: "MetricHealthyTaskCount"},
			_jsii_.MemberMethod{JsiiMethod: "metricHealthyTaskInPercent", GoMethod: "MetricHealthyTaskInPercent"},
			_jsii_.MemberMethod{JsiiMethod: "metricNewConnectionCount", GoMethod: "MetricNewConnectionCount"},
			_jsii_.MemberMethod{JsiiMethod: "metricProcessedBytesMin", GoMethod: "MetricProcessedBytesMin"},
			_jsii_.MemberMethod{JsiiMethod: "metricUnhealthyTaskCount", GoMethod: "MetricUnhealthyTaskCount"},
			_jsii_.MemberProperty{JsiiProperty: "networkLoadBalancer", GoGetter: "NetworkLoadBalancer"},
			_jsii_.MemberProperty{JsiiProperty: "networkTargetGroup", GoGetter: "NetworkTargetGroup"},
		},
		func() interface{} {
			j := jsiiProxy_NetworkLoadBalancerMetricFactory{}
			_jsii_.InitJsiiProxy(&j.jsiiProxy_ILoadBalancerMetricFactory)
			return &j
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.NetworkLoadBalancerMetricFactoryProps",
		reflect.TypeOf((*NetworkLoadBalancerMetricFactoryProps)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.NetworkLoadBalancerMonitoring",
		reflect.TypeOf((*NetworkLoadBalancerMonitoring)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberProperty{JsiiProperty: "activeTcpFlowCountMetric", GoGetter: "ActiveTcpFlowCountMetric"},
			_jsii_.MemberMethod{JsiiMethod: "addAlarm", GoMethod: "AddAlarm"},
			_jsii_.MemberProperty{JsiiProperty: "alarms", GoGetter: "Alarms"},
			_jsii_.MemberMethod{JsiiMethod: "alarmWidgets", GoMethod: "AlarmWidgets"},
			_jsii_.MemberMethod{JsiiMethod: "createAlarmFactory", GoMethod: "CreateAlarmFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createdAlarms", GoMethod: "CreatedAlarms"},
			_jsii_.MemberMethod{JsiiMethod: "createMetricFactory", GoMethod: "CreateMetricFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createTaskHealthWidget", GoMethod: "CreateTaskHealthWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createTcpFlowsWidget", GoMethod: "CreateTcpFlowsWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createTitleWidget", GoMethod: "CreateTitleWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createWidgetFactory", GoMethod: "CreateWidgetFactory"},
			_jsii_.MemberProperty{JsiiProperty: "healthyTaskCountMetric", GoGetter: "HealthyTaskCountMetric"},
			_jsii_.MemberProperty{JsiiProperty: "healthyTaskPercentMetric", GoGetter: "HealthyTaskPercentMetric"},
			_jsii_.MemberProperty{JsiiProperty: "humanReadableName", GoGetter: "HumanReadableName"},
			_jsii_.MemberProperty{JsiiProperty: "localAlarmNamePrefixOverride", GoGetter: "LocalAlarmNamePrefixOverride"},
			_jsii_.MemberProperty{JsiiProperty: "metricFactory", GoGetter: "MetricFactory"},
			_jsii_.MemberProperty{JsiiProperty: "newTcpFlowCountMetric", GoGetter: "NewTcpFlowCountMetric"},
			_jsii_.MemberProperty{JsiiProperty: "processedBytesAnnotations", GoGetter: "ProcessedBytesAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "processedBytesMetric", GoGetter: "ProcessedBytesMetric"},
			_jsii_.MemberProperty{JsiiProperty: "scope", GoGetter: "Scope"},
			_jsii_.MemberMethod{JsiiMethod: "summaryWidgets", GoMethod: "SummaryWidgets"},
			_jsii_.MemberProperty{JsiiProperty: "taskHealthAlarmFactory", GoGetter: "TaskHealthAlarmFactory"},
			_jsii_.MemberProperty{JsiiProperty: "taskHealthAnnotations", GoGetter: "TaskHealthAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "throughputAlarmFactory", GoGetter: "ThroughputAlarmFactory"},
			_jsii_.MemberProperty{JsiiProperty: "unhealthyTaskCountMetric", GoGetter: "UnhealthyTaskCountMetric"},
			_jsii_.MemberMethod{JsiiMethod: "widgets", GoMethod: "Widgets"},
		},
		func() interface{} {
			j := jsiiProxy_NetworkLoadBalancerMonitoring{}
			_jsii_.InitJsiiProxy(&j.jsiiProxy_Monitoring)
			return &j
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.NetworkLoadBalancerMonitoringProps",
		reflect.TypeOf((*NetworkLoadBalancerMonitoringProps)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.NoopAlarmActionStrategy",
		reflect.TypeOf((*NoopAlarmActionStrategy)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "addAlarmActions", GoMethod: "AddAlarmActions"},
		},
		func() interface{} {
			j := jsiiProxy_NoopAlarmActionStrategy{}
			_jsii_.InitJsiiProxy(&j.jsiiProxy_IAlarmActionStrategy)
			return &j
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.NotificationsFailedThreshold",
		reflect.TypeOf((*NotificationsFailedThreshold)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.OpenSearchBackportedMetrics",
		reflect.TypeOf((*OpenSearchBackportedMetrics)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberProperty{JsiiProperty: "dimensionsMap", GoGetter: "DimensionsMap"},
			_jsii_.MemberMethod{JsiiMethod: "metric", GoMethod: "Metric"},
			_jsii_.MemberMethod{JsiiMethod: "metricAutomatedSnapshotFailure", GoMethod: "MetricAutomatedSnapshotFailure"},
			_jsii_.MemberMethod{JsiiMethod: "metricClusterIndexWriteBlocked", GoMethod: "MetricClusterIndexWriteBlocked"},
			_jsii_.MemberMethod{JsiiMethod: "metricClusterIndexWritesBlocked", GoMethod: "MetricClusterIndexWritesBlocked"},
			_jsii_.MemberMethod{JsiiMethod: "metricClusterStatusRed", GoMethod: "MetricClusterStatusRed"},
			_jsii_.MemberMethod{JsiiMethod: "metricClusterStatusYellow", GoMethod: "MetricClusterStatusYellow"},
			_jsii_.MemberMethod{JsiiMethod: "metricCPUUtilization", GoMethod: "MetricCPUUtilization"},
			_jsii_.MemberMethod{JsiiMethod: "metricFreeStorageSpace", GoMethod: "MetricFreeStorageSpace"},
			_jsii_.MemberMethod{JsiiMethod: "metricIndexingLatency", GoMethod: "MetricIndexingLatency"},
			_jsii_.MemberMethod{JsiiMethod: "metricJVMMemoryPressure", GoMethod: "MetricJVMMemoryPressure"},
			_jsii_.MemberMethod{JsiiMethod: "metricKMSKeyError", GoMethod: "MetricKMSKeyError"},
			_jsii_.MemberMethod{JsiiMethod: "metricKMSKeyInaccessible", GoMethod: "MetricKMSKeyInaccessible"},
			_jsii_.MemberMethod{JsiiMethod: "metricMasterCPUUtilization", GoMethod: "MetricMasterCPUUtilization"},
			_jsii_.MemberMethod{JsiiMethod: "metricMasterJVMMemoryPressure", GoMethod: "MetricMasterJVMMemoryPressure"},
			_jsii_.MemberMethod{JsiiMethod: "metricNodes", GoMethod: "MetricNodes"},
			_jsii_.MemberMethod{JsiiMethod: "metricSearchableDocuments", GoMethod: "MetricSearchableDocuments"},
			_jsii_.MemberMethod{JsiiMethod: "metricSearchLatency", GoMethod: "MetricSearchLatency"},
		},
		func() interface{} {
			return &jsiiProxy_OpenSearchBackportedMetrics{}
		},
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.OpenSearchClusterAlarmFactory",
		reflect.TypeOf((*OpenSearchClusterAlarmFactory)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "addAutomatedSnapshotFailureAlarm", GoMethod: "AddAutomatedSnapshotFailureAlarm"},
			_jsii_.MemberMethod{JsiiMethod: "addClusterIndexWritesBlockedAlarm", GoMethod: "AddClusterIndexWritesBlockedAlarm"},
			_jsii_.MemberMethod{JsiiMethod: "addClusterNodeCountAlarm", GoMethod: "AddClusterNodeCountAlarm"},
			_jsii_.MemberMethod{JsiiMethod: "addClusterStatusAlarm", GoMethod: "AddClusterStatusAlarm"},
			_jsii_.MemberMethod{JsiiMethod: "addKmsKeyErrorAlarm", GoMethod: "AddKmsKeyErrorAlarm"},
			_jsii_.MemberMethod{JsiiMethod: "addKmsKeyInaccessibleAlarm", GoMethod: "AddKmsKeyInaccessibleAlarm"},
			_jsii_.MemberProperty{JsiiProperty: "alarmFactory", GoGetter: "AlarmFactory"},
		},
		func() interface{} {
			return &jsiiProxy_OpenSearchClusterAlarmFactory{}
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.OpenSearchClusterAutomatedSnapshotFailureThreshold",
		reflect.TypeOf((*OpenSearchClusterAutomatedSnapshotFailureThreshold)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.OpenSearchClusterIndexWritesBlockedThreshold",
		reflect.TypeOf((*OpenSearchClusterIndexWritesBlockedThreshold)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.OpenSearchClusterMetricFactory",
		reflect.TypeOf((*OpenSearchClusterMetricFactory)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberProperty{JsiiProperty: "domainMetrics", GoGetter: "DomainMetrics"},
			_jsii_.MemberProperty{JsiiProperty: "fillTpsWithZeroes", GoGetter: "FillTpsWithZeroes"},
			_jsii_.MemberMethod{JsiiMethod: "metricAutomatedSnapshotFailure", GoMethod: "MetricAutomatedSnapshotFailure"},
			_jsii_.MemberMethod{JsiiMethod: "metricClusterIndexWriteBlocked", GoMethod: "MetricClusterIndexWriteBlocked"},
			_jsii_.MemberMethod{JsiiMethod: "metricClusterIndexWritesBlocked", GoMethod: "MetricClusterIndexWritesBlocked"},
			_jsii_.MemberMethod{JsiiMethod: "metricClusterStatusRed", GoMethod: "MetricClusterStatusRed"},
			_jsii_.MemberMethod{JsiiMethod: "metricClusterStatusYellow", GoMethod: "MetricClusterStatusYellow"},
			_jsii_.MemberMethod{JsiiMethod: "metricCpuUsage", GoMethod: "MetricCpuUsage"},
			_jsii_.MemberMethod{JsiiMethod: "metricDiskSpaceUsageInPercent", GoMethod: "MetricDiskSpaceUsageInPercent"},
			_jsii_.MemberProperty{JsiiProperty: "metricFactory", GoGetter: "MetricFactory"},
			_jsii_.MemberMethod{JsiiMethod: "metricIndexingLatencyP50InMillis", GoMethod: "MetricIndexingLatencyP50InMillis"},
			_jsii_.MemberMethod{JsiiMethod: "metricIndexingLatencyP90InMillis", GoMethod: "MetricIndexingLatencyP90InMillis"},
			_jsii_.MemberMethod{JsiiMethod: "metricIndexingLatencyP99InMillis", GoMethod: "MetricIndexingLatencyP99InMillis"},
			_jsii_.MemberMethod{JsiiMethod: "metricJvmMemoryPressure", GoMethod: "MetricJvmMemoryPressure"},
			_jsii_.MemberMethod{JsiiMethod: "metricKmsKeyError", GoMethod: "MetricKmsKeyError"},
			_jsii_.MemberMethod{JsiiMethod: "metricKmsKeyInaccessible", GoMethod: "MetricKmsKeyInaccessible"},
			_jsii_.MemberMethod{JsiiMethod: "metricMasterCpuUsage", GoMethod: "MetricMasterCpuUsage"},
			_jsii_.MemberMethod{JsiiMethod: "metricMasterJvmMemoryPressure", GoMethod: "MetricMasterJvmMemoryPressure"},
			_jsii_.MemberMethod{JsiiMethod: "metricNodes", GoMethod: "MetricNodes"},
			_jsii_.MemberMethod{JsiiMethod: "metricSearchCount", GoMethod: "MetricSearchCount"},
			_jsii_.MemberMethod{JsiiMethod: "metricSearchLatencyP50InMillis", GoMethod: "MetricSearchLatencyP50InMillis"},
			_jsii_.MemberMethod{JsiiMethod: "metricSearchLatencyP90InMillis", GoMethod: "MetricSearchLatencyP90InMillis"},
			_jsii_.MemberMethod{JsiiMethod: "metricSearchLatencyP99InMillis", GoMethod: "MetricSearchLatencyP99InMillis"},
			_jsii_.MemberMethod{JsiiMethod: "metricSearchRate", GoMethod: "MetricSearchRate"},
			_jsii_.MemberMethod{JsiiMethod: "metricTps", GoMethod: "MetricTps"},
			_jsii_.MemberProperty{JsiiProperty: "rateComputationMethod", GoGetter: "RateComputationMethod"},
		},
		func() interface{} {
			return &jsiiProxy_OpenSearchClusterMetricFactory{}
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.OpenSearchClusterMetricFactoryProps",
		reflect.TypeOf((*OpenSearchClusterMetricFactoryProps)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.OpenSearchClusterMonitoring",
		reflect.TypeOf((*OpenSearchClusterMonitoring)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "addAlarm", GoMethod: "AddAlarm"},
			_jsii_.MemberProperty{JsiiProperty: "alarms", GoGetter: "Alarms"},
			_jsii_.MemberMethod{JsiiMethod: "alarmWidgets", GoMethod: "AlarmWidgets"},
			_jsii_.MemberProperty{JsiiProperty: "automatedSnapshotFailureMetric", GoGetter: "AutomatedSnapshotFailureMetric"},
			_jsii_.MemberProperty{JsiiProperty: "clusterAlarmFactory", GoGetter: "ClusterAlarmFactory"},
			_jsii_.MemberProperty{JsiiProperty: "clusterAnnotations", GoGetter: "ClusterAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "clusterStatusRedMetric", GoGetter: "ClusterStatusRedMetric"},
			_jsii_.MemberProperty{JsiiProperty: "clusterStatusYellowMetric", GoGetter: "ClusterStatusYellowMetric"},
			_jsii_.MemberProperty{JsiiProperty: "cpuUsageMetric", GoGetter: "CpuUsageMetric"},
			_jsii_.MemberMethod{JsiiMethod: "createAlarmFactory", GoMethod: "CreateAlarmFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createdAlarms", GoMethod: "CreatedAlarms"},
			_jsii_.MemberMethod{JsiiMethod: "createMetricFactory", GoMethod: "CreateMetricFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createWidgetFactory", GoMethod: "CreateWidgetFactory"},
			_jsii_.MemberProperty{JsiiProperty: "diskSpaceUsageMetric", GoGetter: "DiskSpaceUsageMetric"},
			_jsii_.MemberProperty{JsiiProperty: "indexingLatencyAlarmFactory", GoGetter: "IndexingLatencyAlarmFactory"},
			_jsii_.MemberProperty{JsiiProperty: "indexingLatencyAnnotations", GoGetter: "IndexingLatencyAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "indexWriteBlockedMetric", GoGetter: "IndexWriteBlockedMetric"},
			_jsii_.MemberProperty{JsiiProperty: "jvmMemoryPressureMetric", GoGetter: "JvmMemoryPressureMetric"},
			_jsii_.MemberProperty{JsiiProperty: "kmsKeyErrorMetric", GoGetter: "KmsKeyErrorMetric"},
			_jsii_.MemberProperty{JsiiProperty: "kmsKeyInaccessibleMetric", GoGetter: "KmsKeyInaccessibleMetric"},
			_jsii_.MemberProperty{JsiiProperty: "localAlarmNamePrefixOverride", GoGetter: "LocalAlarmNamePrefixOverride"},
			_jsii_.MemberProperty{JsiiProperty: "masterCpuUsageMetric", GoGetter: "MasterCpuUsageMetric"},
			_jsii_.MemberProperty{JsiiProperty: "masterJvmMemoryPressureMetric", GoGetter: "MasterJvmMemoryPressureMetric"},
			_jsii_.MemberProperty{JsiiProperty: "masterUsageAnnotations", GoGetter: "MasterUsageAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "nodeAnnotations", GoGetter: "NodeAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "nodesMetric", GoGetter: "NodesMetric"},
			_jsii_.MemberProperty{JsiiProperty: "p50IndexingLatencyMetric", GoGetter: "P50IndexingLatencyMetric"},
			_jsii_.MemberProperty{JsiiProperty: "p50SearchLatencyMetric", GoGetter: "P50SearchLatencyMetric"},
			_jsii_.MemberProperty{JsiiProperty: "p90IndexingLatencyMetric", GoGetter: "P90IndexingLatencyMetric"},
			_jsii_.MemberProperty{JsiiProperty: "p90SearchLatencyMetric", GoGetter: "P90SearchLatencyMetric"},
			_jsii_.MemberProperty{JsiiProperty: "p99IndexingLatencyMetric", GoGetter: "P99IndexingLatencyMetric"},
			_jsii_.MemberProperty{JsiiProperty: "p99SearchLatencyMetric", GoGetter: "P99SearchLatencyMetric"},
			_jsii_.MemberProperty{JsiiProperty: "scope", GoGetter: "Scope"},
			_jsii_.MemberProperty{JsiiProperty: "searchLatencyAlarmFactory", GoGetter: "SearchLatencyAlarmFactory"},
			_jsii_.MemberProperty{JsiiProperty: "searchLatencyAnnotations", GoGetter: "SearchLatencyAnnotations"},
			_jsii_.MemberMethod{JsiiMethod: "summaryWidgets", GoMethod: "SummaryWidgets"},
			_jsii_.MemberProperty{JsiiProperty: "title", GoGetter: "Title"},
			_jsii_.MemberProperty{JsiiProperty: "tpsMetric", GoGetter: "TpsMetric"},
			_jsii_.MemberProperty{JsiiProperty: "url", GoGetter: "Url"},
			_jsii_.MemberProperty{JsiiProperty: "usageAlarmFactory", GoGetter: "UsageAlarmFactory"},
			_jsii_.MemberProperty{JsiiProperty: "usageAnnotations", GoGetter: "UsageAnnotations"},
			_jsii_.MemberMethod{JsiiMethod: "widgets", GoMethod: "Widgets"},
		},
		func() interface{} {
			j := jsiiProxy_OpenSearchClusterMonitoring{}
			_jsii_.InitJsiiProxy(&j.jsiiProxy_Monitoring)
			return &j
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.OpenSearchClusterMonitoringOptions",
		reflect.TypeOf((*OpenSearchClusterMonitoringOptions)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.OpenSearchClusterMonitoringProps",
		reflect.TypeOf((*OpenSearchClusterMonitoringProps)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.OpenSearchClusterNodesThreshold",
		reflect.TypeOf((*OpenSearchClusterNodesThreshold)(nil)).Elem(),
	)
	_jsii_.RegisterEnum(
		"cdk-monitoring-constructs.OpenSearchClusterStatus",
		reflect.TypeOf((*OpenSearchClusterStatus)(nil)).Elem(),
		map[string]interface{}{
			"RED": OpenSearchClusterStatus_RED,
			"YELLOW": OpenSearchClusterStatus_YELLOW,
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.OpenSearchClusterStatusCustomization",
		reflect.TypeOf((*OpenSearchClusterStatusCustomization)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.OpenSearchKmsKeyErrorThreshold",
		reflect.TypeOf((*OpenSearchKmsKeyErrorThreshold)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.OpenSearchKmsKeyInaccessibleThreshold",
		reflect.TypeOf((*OpenSearchKmsKeyInaccessibleThreshold)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.OpsItemAlarmActionStrategy",
		reflect.TypeOf((*OpsItemAlarmActionStrategy)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "addAlarmActions", GoMethod: "AddAlarmActions"},
			_jsii_.MemberProperty{JsiiProperty: "category", GoGetter: "Category"},
			_jsii_.MemberProperty{JsiiProperty: "severity", GoGetter: "Severity"},
		},
		func() interface{} {
			j := jsiiProxy_OpsItemAlarmActionStrategy{}
			_jsii_.InitJsiiProxy(&j.jsiiProxy_IAlarmActionStrategy)
			return &j
		},
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.QueueAlarmFactory",
		reflect.TypeOf((*QueueAlarmFactory)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "addMaxQueueIncomingMessagesCountAlarm", GoMethod: "AddMaxQueueIncomingMessagesCountAlarm"},
			_jsii_.MemberMethod{JsiiMethod: "addMaxQueueMessageAgeAlarm", GoMethod: "AddMaxQueueMessageAgeAlarm"},
			_jsii_.MemberMethod{JsiiMethod: "addMaxQueueMessageCountAlarm", GoMethod: "AddMaxQueueMessageCountAlarm"},
			_jsii_.MemberMethod{JsiiMethod: "addMaxQueueTimeToDrainMessagesAlarm", GoMethod: "AddMaxQueueTimeToDrainMessagesAlarm"},
			_jsii_.MemberMethod{JsiiMethod: "addMinQueueIncomingMessagesCountAlarm", GoMethod: "AddMinQueueIncomingMessagesCountAlarm"},
			_jsii_.MemberMethod{JsiiMethod: "addMinQueueMessageCountAlarm", GoMethod: "AddMinQueueMessageCountAlarm"},
			_jsii_.MemberProperty{JsiiProperty: "alarmFactory", GoGetter: "AlarmFactory"},
		},
		func() interface{} {
			return &jsiiProxy_QueueAlarmFactory{}
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.QueueProcessingEc2ServiceMonitoringProps",
		reflect.TypeOf((*QueueProcessingEc2ServiceMonitoringProps)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.QueueProcessingFargateServiceMonitoringProps",
		reflect.TypeOf((*QueueProcessingFargateServiceMonitoringProps)(nil)).Elem(),
	)
	_jsii_.RegisterEnum(
		"cdk-monitoring-constructs.RateComputationMethod",
		reflect.TypeOf((*RateComputationMethod)(nil)).Elem(),
		map[string]interface{}{
			"AVERAGE": RateComputationMethod_AVERAGE,
			"PER_SECOND": RateComputationMethod_PER_SECOND,
			"PER_MINUTE": RateComputationMethod_PER_MINUTE,
			"PER_HOUR": RateComputationMethod_PER_HOUR,
			"PER_DAY": RateComputationMethod_PER_DAY,
		},
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.RdsClusterMetricFactory",
		reflect.TypeOf((*RdsClusterMetricFactory)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberProperty{JsiiProperty: "clusterIdentifier", GoGetter: "ClusterIdentifier"},
			_jsii_.MemberProperty{JsiiProperty: "dimensionsMap", GoGetter: "DimensionsMap"},
			_jsii_.MemberMethod{JsiiMethod: "metricAverageCpuUsageInPercent", GoMethod: "MetricAverageCpuUsageInPercent"},
			_jsii_.MemberMethod{JsiiMethod: "metricCommitLatencyP90InMillis", GoMethod: "MetricCommitLatencyP90InMillis"},
			_jsii_.MemberMethod{JsiiMethod: "metricDeleteLatencyP90InMillis", GoMethod: "MetricDeleteLatencyP90InMillis"},
			_jsii_.MemberMethod{JsiiMethod: "metricDiskSpaceUsageInPercent", GoMethod: "MetricDiskSpaceUsageInPercent"},
			_jsii_.MemberProperty{JsiiProperty: "metricFactory", GoGetter: "MetricFactory"},
			_jsii_.MemberMethod{JsiiMethod: "metricFreeStorageInBytes", GoMethod: "MetricFreeStorageInBytes"},
			_jsii_.MemberMethod{JsiiMethod: "metricInsertLatencyP90InMillis", GoMethod: "MetricInsertLatencyP90InMillis"},
			_jsii_.MemberMethod{JsiiMethod: "metricSelectLatencyP90InMillis", GoMethod: "MetricSelectLatencyP90InMillis"},
			_jsii_.MemberMethod{JsiiMethod: "metricTotalConnectionCount", GoMethod: "MetricTotalConnectionCount"},
			_jsii_.MemberMethod{JsiiMethod: "metricUpdateLatencyP90InMillis", GoMethod: "MetricUpdateLatencyP90InMillis"},
			_jsii_.MemberMethod{JsiiMethod: "metricUsedStorageInBytes", GoMethod: "MetricUsedStorageInBytes"},
		},
		func() interface{} {
			return &jsiiProxy_RdsClusterMetricFactory{}
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.RdsClusterMetricFactoryProps",
		reflect.TypeOf((*RdsClusterMetricFactoryProps)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.RdsClusterMonitoring",
		reflect.TypeOf((*RdsClusterMonitoring)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "addAlarm", GoMethod: "AddAlarm"},
			_jsii_.MemberProperty{JsiiProperty: "alarms", GoGetter: "Alarms"},
			_jsii_.MemberMethod{JsiiMethod: "alarmWidgets", GoMethod: "AlarmWidgets"},
			_jsii_.MemberProperty{JsiiProperty: "commitLatencyMetric", GoGetter: "CommitLatencyMetric"},
			_jsii_.MemberProperty{JsiiProperty: "connectionsMetric", GoGetter: "ConnectionsMetric"},
			_jsii_.MemberProperty{JsiiProperty: "cpuUsageMetric", GoGetter: "CpuUsageMetric"},
			_jsii_.MemberMethod{JsiiMethod: "createAlarmFactory", GoMethod: "CreateAlarmFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createConnectionsWidget", GoMethod: "CreateConnectionsWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createCpuAndDiskUsageWidget", GoMethod: "CreateCpuAndDiskUsageWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createdAlarms", GoMethod: "CreatedAlarms"},
			_jsii_.MemberMethod{JsiiMethod: "createLatencyWidget", GoMethod: "CreateLatencyWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createMetricFactory", GoMethod: "CreateMetricFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createTitleWidget", GoMethod: "CreateTitleWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createWidgetFactory", GoMethod: "CreateWidgetFactory"},
			_jsii_.MemberProperty{JsiiProperty: "deleteLatencyMetric", GoGetter: "DeleteLatencyMetric"},
			_jsii_.MemberProperty{JsiiProperty: "diskSpaceUsageMetric", GoGetter: "DiskSpaceUsageMetric"},
			_jsii_.MemberProperty{JsiiProperty: "insertLatencyMetric", GoGetter: "InsertLatencyMetric"},
			_jsii_.MemberProperty{JsiiProperty: "localAlarmNamePrefixOverride", GoGetter: "LocalAlarmNamePrefixOverride"},
			_jsii_.MemberProperty{JsiiProperty: "scope", GoGetter: "Scope"},
			_jsii_.MemberProperty{JsiiProperty: "selectLatencyMetric", GoGetter: "SelectLatencyMetric"},
			_jsii_.MemberMethod{JsiiMethod: "summaryWidgets", GoMethod: "SummaryWidgets"},
			_jsii_.MemberProperty{JsiiProperty: "title", GoGetter: "Title"},
			_jsii_.MemberProperty{JsiiProperty: "updateLatencyMetric", GoGetter: "UpdateLatencyMetric"},
			_jsii_.MemberProperty{JsiiProperty: "url", GoGetter: "Url"},
			_jsii_.MemberProperty{JsiiProperty: "usageAlarmFactory", GoGetter: "UsageAlarmFactory"},
			_jsii_.MemberProperty{JsiiProperty: "usageAnnotations", GoGetter: "UsageAnnotations"},
			_jsii_.MemberMethod{JsiiMethod: "widgets", GoMethod: "Widgets"},
		},
		func() interface{} {
			j := jsiiProxy_RdsClusterMonitoring{}
			_jsii_.InitJsiiProxy(&j.jsiiProxy_Monitoring)
			return &j
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.RdsClusterMonitoringOptions",
		reflect.TypeOf((*RdsClusterMonitoringOptions)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.RdsClusterMonitoringProps",
		reflect.TypeOf((*RdsClusterMonitoringProps)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.RecordsFailedThreshold",
		reflect.TypeOf((*RecordsFailedThreshold)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.RecordsThrottledThreshold",
		reflect.TypeOf((*RecordsThrottledThreshold)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.RedshiftClusterMetricFactory",
		reflect.TypeOf((*RedshiftClusterMetricFactory)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberProperty{JsiiProperty: "dimensionsMap", GoGetter: "DimensionsMap"},
			_jsii_.MemberMethod{JsiiMethod: "metricAverageCpuUsageInPercent", GoMethod: "MetricAverageCpuUsageInPercent"},
			_jsii_.MemberMethod{JsiiMethod: "metricAverageDiskSpaceUsageInPercent", GoMethod: "MetricAverageDiskSpaceUsageInPercent"},
			_jsii_.MemberProperty{JsiiProperty: "metricFactory", GoGetter: "MetricFactory"},
			_jsii_.MemberMethod{JsiiMethod: "metricLongQueryDurationP90InMillis", GoMethod: "MetricLongQueryDurationP90InMillis"},
			_jsii_.MemberMethod{JsiiMethod: "metricMaintenanceModeEnabled", GoMethod: "MetricMaintenanceModeEnabled"},
			_jsii_.MemberMethod{JsiiMethod: "metricMediumQueryDurationP90InMillis", GoMethod: "MetricMediumQueryDurationP90InMillis"},
			_jsii_.MemberMethod{JsiiMethod: "metricReadLatencyP90InMillis", GoMethod: "MetricReadLatencyP90InMillis"},
			_jsii_.MemberMethod{JsiiMethod: "metricShortQueryDurationP90InMillis", GoMethod: "MetricShortQueryDurationP90InMillis"},
			_jsii_.MemberMethod{JsiiMethod: "metricTotalConnectionCount", GoMethod: "MetricTotalConnectionCount"},
			_jsii_.MemberMethod{JsiiMethod: "metricWriteLatencyP90InMillis", GoMethod: "MetricWriteLatencyP90InMillis"},
		},
		func() interface{} {
			return &jsiiProxy_RedshiftClusterMetricFactory{}
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.RedshiftClusterMetricFactoryProps",
		reflect.TypeOf((*RedshiftClusterMetricFactoryProps)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.RedshiftClusterMonitoring",
		reflect.TypeOf((*RedshiftClusterMonitoring)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "addAlarm", GoMethod: "AddAlarm"},
			_jsii_.MemberProperty{JsiiProperty: "alarms", GoGetter: "Alarms"},
			_jsii_.MemberMethod{JsiiMethod: "alarmWidgets", GoMethod: "AlarmWidgets"},
			_jsii_.MemberProperty{JsiiProperty: "connectionsMetric", GoGetter: "ConnectionsMetric"},
			_jsii_.MemberProperty{JsiiProperty: "cpuUsageMetric", GoGetter: "CpuUsageMetric"},
			_jsii_.MemberMethod{JsiiMethod: "createAlarmFactory", GoMethod: "CreateAlarmFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createConnectionsWidget", GoMethod: "CreateConnectionsWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createCpuAndDiskUsageWidget", GoMethod: "CreateCpuAndDiskUsageWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createdAlarms", GoMethod: "CreatedAlarms"},
			_jsii_.MemberMethod{JsiiMethod: "createLatencyWidget", GoMethod: "CreateLatencyWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createMaintenanceWidget", GoMethod: "CreateMaintenanceWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createMetricFactory", GoMethod: "CreateMetricFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createQueryDurationWidget", GoMethod: "CreateQueryDurationWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createTitleWidget", GoMethod: "CreateTitleWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createWidgetFactory", GoMethod: "CreateWidgetFactory"},
			_jsii_.MemberProperty{JsiiProperty: "diskSpaceUsageMetric", GoGetter: "DiskSpaceUsageMetric"},
			_jsii_.MemberProperty{JsiiProperty: "localAlarmNamePrefixOverride", GoGetter: "LocalAlarmNamePrefixOverride"},
			_jsii_.MemberProperty{JsiiProperty: "longQueryDurationMetric", GoGetter: "LongQueryDurationMetric"},
			_jsii_.MemberProperty{JsiiProperty: "maintenanceModeMetric", GoGetter: "MaintenanceModeMetric"},
			_jsii_.MemberProperty{JsiiProperty: "mediumQueryDurationMetric", GoGetter: "MediumQueryDurationMetric"},
			_jsii_.MemberProperty{JsiiProperty: "readLatencyMetric", GoGetter: "ReadLatencyMetric"},
			_jsii_.MemberProperty{JsiiProperty: "scope", GoGetter: "Scope"},
			_jsii_.MemberProperty{JsiiProperty: "shortQueryDurationMetric", GoGetter: "ShortQueryDurationMetric"},
			_jsii_.MemberMethod{JsiiMethod: "summaryWidgets", GoMethod: "SummaryWidgets"},
			_jsii_.MemberProperty{JsiiProperty: "title", GoGetter: "Title"},
			_jsii_.MemberProperty{JsiiProperty: "url", GoGetter: "Url"},
			_jsii_.MemberProperty{JsiiProperty: "usageAlarmFactory", GoGetter: "UsageAlarmFactory"},
			_jsii_.MemberProperty{JsiiProperty: "usageAnnotations", GoGetter: "UsageAnnotations"},
			_jsii_.MemberMethod{JsiiMethod: "widgets", GoMethod: "Widgets"},
			_jsii_.MemberProperty{JsiiProperty: "writeLatencyMetric", GoGetter: "WriteLatencyMetric"},
		},
		func() interface{} {
			j := jsiiProxy_RedshiftClusterMonitoring{}
			_jsii_.InitJsiiProxy(&j.jsiiProxy_Monitoring)
			return &j
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.RedshiftClusterMonitoringOptions",
		reflect.TypeOf((*RedshiftClusterMonitoringOptions)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.RedshiftClusterMonitoringProps",
		reflect.TypeOf((*RedshiftClusterMonitoringProps)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.RunningTaskCountThreshold",
		reflect.TypeOf((*RunningTaskCountThreshold)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.RunningTaskRateThreshold",
		reflect.TypeOf((*RunningTaskRateThreshold)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.S3BucketMetricFactory",
		reflect.TypeOf((*S3BucketMetricFactory)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "metricBucketSizeBytes", GoMethod: "MetricBucketSizeBytes"},
			_jsii_.MemberProperty{JsiiProperty: "metricFactory", GoGetter: "MetricFactory"},
			_jsii_.MemberMethod{JsiiMethod: "metricNumberOfObjects", GoMethod: "MetricNumberOfObjects"},
			_jsii_.MemberProperty{JsiiProperty: "props", GoGetter: "Props"},
		},
		func() interface{} {
			return &jsiiProxy_S3BucketMetricFactory{}
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.S3BucketMetricFactoryProps",
		reflect.TypeOf((*S3BucketMetricFactoryProps)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.S3BucketMonitoring",
		reflect.TypeOf((*S3BucketMonitoring)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "addAlarm", GoMethod: "AddAlarm"},
			_jsii_.MemberProperty{JsiiProperty: "alarms", GoGetter: "Alarms"},
			_jsii_.MemberMethod{JsiiMethod: "alarmWidgets", GoMethod: "AlarmWidgets"},
			_jsii_.MemberProperty{JsiiProperty: "bucketSizeBytesMetric", GoGetter: "BucketSizeBytesMetric"},
			_jsii_.MemberMethod{JsiiMethod: "createAlarmFactory", GoMethod: "CreateAlarmFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createdAlarms", GoMethod: "CreatedAlarms"},
			_jsii_.MemberMethod{JsiiMethod: "createMetricFactory", GoMethod: "CreateMetricFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createWidgetFactory", GoMethod: "CreateWidgetFactory"},
			_jsii_.MemberProperty{JsiiProperty: "localAlarmNamePrefixOverride", GoGetter: "LocalAlarmNamePrefixOverride"},
			_jsii_.MemberProperty{JsiiProperty: "numberOfObjectsMetric", GoGetter: "NumberOfObjectsMetric"},
			_jsii_.MemberProperty{JsiiProperty: "scope", GoGetter: "Scope"},
			_jsii_.MemberMethod{JsiiMethod: "summaryWidgets", GoMethod: "SummaryWidgets"},
			_jsii_.MemberProperty{JsiiProperty: "title", GoGetter: "Title"},
			_jsii_.MemberProperty{JsiiProperty: "url", GoGetter: "Url"},
			_jsii_.MemberMethod{JsiiMethod: "widgets", GoMethod: "Widgets"},
		},
		func() interface{} {
			j := jsiiProxy_S3BucketMonitoring{}
			_jsii_.InitJsiiProxy(&j.jsiiProxy_Monitoring)
			return &j
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.S3BucketMonitoringOptions",
		reflect.TypeOf((*S3BucketMonitoringOptions)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.S3BucketMonitoringProps",
		reflect.TypeOf((*S3BucketMonitoringProps)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.SecretsManagerMetricsPublisher",
		reflect.TypeOf((*SecretsManagerMetricsPublisher)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "addSecret", GoMethod: "AddSecret"},
			_jsii_.MemberProperty{JsiiProperty: "node", GoGetter: "Node"},
			_jsii_.MemberMethod{JsiiMethod: "toString", GoMethod: "ToString"},
		},
		func() interface{} {
			j := jsiiProxy_SecretsManagerMetricsPublisher{}
			_jsii_.InitJsiiProxy(&j.Type__constructsConstruct)
			return &j
		},
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.SecretsManagerSecretMetricFactory",
		reflect.TypeOf((*SecretsManagerSecretMetricFactory)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberProperty{JsiiProperty: "dimensionsMap", GoGetter: "DimensionsMap"},
			_jsii_.MemberMethod{JsiiMethod: "metricDaysSinceLastChange", GoMethod: "MetricDaysSinceLastChange"},
			_jsii_.MemberMethod{JsiiMethod: "metricDaysSinceLastRotation", GoMethod: "MetricDaysSinceLastRotation"},
			_jsii_.MemberProperty{JsiiProperty: "metricFactory", GoGetter: "MetricFactory"},
			_jsii_.MemberProperty{JsiiProperty: "secret", GoGetter: "Secret"},
		},
		func() interface{} {
			return &jsiiProxy_SecretsManagerSecretMetricFactory{}
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.SecretsManagerSecretMetricFactoryProps",
		reflect.TypeOf((*SecretsManagerSecretMetricFactoryProps)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.SecretsManagerSecretMonitoring",
		reflect.TypeOf((*SecretsManagerSecretMonitoring)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "addAlarm", GoMethod: "AddAlarm"},
			_jsii_.MemberProperty{JsiiProperty: "alarms", GoGetter: "Alarms"},
			_jsii_.MemberMethod{JsiiMethod: "alarmWidgets", GoMethod: "AlarmWidgets"},
			_jsii_.MemberMethod{JsiiMethod: "createAlarmFactory", GoMethod: "CreateAlarmFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createdAlarms", GoMethod: "CreatedAlarms"},
			_jsii_.MemberMethod{JsiiMethod: "createMetricFactory", GoMethod: "CreateMetricFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createWidgetFactory", GoMethod: "CreateWidgetFactory"},
			_jsii_.MemberProperty{JsiiProperty: "localAlarmNamePrefixOverride", GoGetter: "LocalAlarmNamePrefixOverride"},
			_jsii_.MemberProperty{JsiiProperty: "scope", GoGetter: "Scope"},
			_jsii_.MemberMethod{JsiiMethod: "summaryWidgets", GoMethod: "SummaryWidgets"},
			_jsii_.MemberProperty{JsiiProperty: "title", GoGetter: "Title"},
			_jsii_.MemberMethod{JsiiMethod: "widgets", GoMethod: "Widgets"},
		},
		func() interface{} {
			j := jsiiProxy_SecretsManagerSecretMonitoring{}
			_jsii_.InitJsiiProxy(&j.jsiiProxy_Monitoring)
			return &j
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.SecretsManagerSecretMonitoringOptions",
		reflect.TypeOf((*SecretsManagerSecretMonitoringOptions)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.SecretsManagerSecretMonitoringProps",
		reflect.TypeOf((*SecretsManagerSecretMonitoringProps)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.SimpleEc2ServiceMonitoringProps",
		reflect.TypeOf((*SimpleEc2ServiceMonitoringProps)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.SimpleFargateServiceMonitoringProps",
		reflect.TypeOf((*SimpleFargateServiceMonitoringProps)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.SingleAxisGraphWidget",
		reflect.TypeOf((*SingleAxisGraphWidget)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "addLeftMetric", GoMethod: "AddLeftMetric"},
			_jsii_.MemberMethod{JsiiMethod: "addRightMetric", GoMethod: "AddRightMetric"},
			_jsii_.MemberProperty{JsiiProperty: "height", GoGetter: "Height"},
			_jsii_.MemberMethod{JsiiMethod: "position", GoMethod: "Position"},
			_jsii_.MemberMethod{JsiiMethod: "toJson", GoMethod: "ToJson"},
			_jsii_.MemberProperty{JsiiProperty: "width", GoGetter: "Width"},
			_jsii_.MemberProperty{JsiiProperty: "x", GoGetter: "X"},
			_jsii_.MemberProperty{JsiiProperty: "y", GoGetter: "Y"},
		},
		func() interface{} {
			j := jsiiProxy_SingleAxisGraphWidget{}
			_jsii_.InitJsiiProxy(&j.Type__awscloudwatchGraphWidget)
			return &j
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.SingleAxisGraphWidgetProps",
		reflect.TypeOf((*SingleAxisGraphWidgetProps)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.SingleWidgetDashboardSegment",
		reflect.TypeOf((*SingleWidgetDashboardSegment)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberProperty{JsiiProperty: "addToAlarm", GoGetter: "AddToAlarm"},
			_jsii_.MemberProperty{JsiiProperty: "addToSummary", GoGetter: "AddToSummary"},
			_jsii_.MemberMethod{JsiiMethod: "alarmWidgets", GoMethod: "AlarmWidgets"},
			_jsii_.MemberMethod{JsiiMethod: "summaryWidgets", GoMethod: "SummaryWidgets"},
			_jsii_.MemberProperty{JsiiProperty: "widget", GoGetter: "Widget"},
			_jsii_.MemberMethod{JsiiMethod: "widgets", GoMethod: "Widgets"},
		},
		func() interface{} {
			j := jsiiProxy_SingleWidgetDashboardSegment{}
			_jsii_.InitJsiiProxy(&j.jsiiProxy_IDashboardSegment)
			return &j
		},
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.SnsAlarmActionStrategy",
		reflect.TypeOf((*SnsAlarmActionStrategy)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "addAlarmActions", GoMethod: "AddAlarmActions"},
			_jsii_.MemberProperty{JsiiProperty: "onAlarmTopic", GoGetter: "OnAlarmTopic"},
			_jsii_.MemberProperty{JsiiProperty: "onInsufficientDataTopic", GoGetter: "OnInsufficientDataTopic"},
			_jsii_.MemberProperty{JsiiProperty: "onOkTopic", GoGetter: "OnOkTopic"},
		},
		func() interface{} {
			j := jsiiProxy_SnsAlarmActionStrategy{}
			_jsii_.InitJsiiProxy(&j.jsiiProxy_IAlarmActionStrategy)
			return &j
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.SnsAlarmActionStrategyProps",
		reflect.TypeOf((*SnsAlarmActionStrategyProps)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.SnsTopicMetricFactory",
		reflect.TypeOf((*SnsTopicMetricFactory)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "metricAverageMessageSizeInBytes", GoMethod: "MetricAverageMessageSizeInBytes"},
			_jsii_.MemberProperty{JsiiProperty: "metricFactory", GoGetter: "MetricFactory"},
			_jsii_.MemberMethod{JsiiMethod: "metricIncomingMessageCount", GoMethod: "MetricIncomingMessageCount"},
			_jsii_.MemberMethod{JsiiMethod: "metricNumberOfNotificationsFailed", GoMethod: "MetricNumberOfNotificationsFailed"},
			_jsii_.MemberMethod{JsiiMethod: "metricOutgoingMessageCount", GoMethod: "MetricOutgoingMessageCount"},
			_jsii_.MemberProperty{JsiiProperty: "topic", GoGetter: "Topic"},
		},
		func() interface{} {
			return &jsiiProxy_SnsTopicMetricFactory{}
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.SnsTopicMetricFactoryProps",
		reflect.TypeOf((*SnsTopicMetricFactoryProps)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.SnsTopicMonitoring",
		reflect.TypeOf((*SnsTopicMonitoring)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "addAlarm", GoMethod: "AddAlarm"},
			_jsii_.MemberProperty{JsiiProperty: "alarms", GoGetter: "Alarms"},
			_jsii_.MemberMethod{JsiiMethod: "alarmWidgets", GoMethod: "AlarmWidgets"},
			_jsii_.MemberMethod{JsiiMethod: "createAlarmFactory", GoMethod: "CreateAlarmFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createdAlarms", GoMethod: "CreatedAlarms"},
			_jsii_.MemberMethod{JsiiMethod: "createMessageCountWidget", GoMethod: "CreateMessageCountWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createMessageFailedWidget", GoMethod: "CreateMessageFailedWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createMessageSizeWidget", GoMethod: "CreateMessageSizeWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createMetricFactory", GoMethod: "CreateMetricFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createTitleWidget", GoMethod: "CreateTitleWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createWidgetFactory", GoMethod: "CreateWidgetFactory"},
			_jsii_.MemberProperty{JsiiProperty: "failedDeliveryAnnotations", GoGetter: "FailedDeliveryAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "incomingMessagesAnnotations", GoGetter: "IncomingMessagesAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "incomingMessagesMetric", GoGetter: "IncomingMessagesMetric"},
			_jsii_.MemberProperty{JsiiProperty: "localAlarmNamePrefixOverride", GoGetter: "LocalAlarmNamePrefixOverride"},
			_jsii_.MemberProperty{JsiiProperty: "messagesFailedMetric", GoGetter: "MessagesFailedMetric"},
			_jsii_.MemberProperty{JsiiProperty: "messageSizeMetric", GoGetter: "MessageSizeMetric"},
			_jsii_.MemberProperty{JsiiProperty: "outgoingMessagesMetric", GoGetter: "OutgoingMessagesMetric"},
			_jsii_.MemberProperty{JsiiProperty: "scope", GoGetter: "Scope"},
			_jsii_.MemberMethod{JsiiMethod: "summaryWidgets", GoMethod: "SummaryWidgets"},
			_jsii_.MemberProperty{JsiiProperty: "title", GoGetter: "Title"},
			_jsii_.MemberProperty{JsiiProperty: "topicAlarmFactory", GoGetter: "TopicAlarmFactory"},
			_jsii_.MemberProperty{JsiiProperty: "topicUrl", GoGetter: "TopicUrl"},
			_jsii_.MemberMethod{JsiiMethod: "widgets", GoMethod: "Widgets"},
		},
		func() interface{} {
			j := jsiiProxy_SnsTopicMonitoring{}
			_jsii_.InitJsiiProxy(&j.jsiiProxy_Monitoring)
			return &j
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.SnsTopicMonitoringOptions",
		reflect.TypeOf((*SnsTopicMonitoringOptions)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.SnsTopicMonitoringProps",
		reflect.TypeOf((*SnsTopicMonitoringProps)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.SqsQueueMetricFactory",
		reflect.TypeOf((*SqsQueueMetricFactory)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "metricApproximateAgeOfOldestMessageInSeconds", GoMethod: "MetricApproximateAgeOfOldestMessageInSeconds"},
			_jsii_.MemberMethod{JsiiMethod: "metricApproximateVisibleMessageCount", GoMethod: "MetricApproximateVisibleMessageCount"},
			_jsii_.MemberMethod{JsiiMethod: "metricAverageMessageSizeInBytes", GoMethod: "MetricAverageMessageSizeInBytes"},
			_jsii_.MemberMethod{JsiiMethod: "metricConsumptionRate", GoMethod: "MetricConsumptionRate"},
			_jsii_.MemberMethod{JsiiMethod: "metricDeletedMessageCount", GoMethod: "MetricDeletedMessageCount"},
			_jsii_.MemberProperty{JsiiProperty: "metricFactory", GoGetter: "MetricFactory"},
			_jsii_.MemberMethod{JsiiMethod: "metricIncomingMessageCount", GoMethod: "MetricIncomingMessageCount"},
			_jsii_.MemberMethod{JsiiMethod: "metricProductionRate", GoMethod: "MetricProductionRate"},
			_jsii_.MemberMethod{JsiiMethod: "metricTimeToDrain", GoMethod: "MetricTimeToDrain"},
			_jsii_.MemberProperty{JsiiProperty: "queue", GoGetter: "Queue"},
		},
		func() interface{} {
			return &jsiiProxy_SqsQueueMetricFactory{}
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.SqsQueueMetricFactoryProps",
		reflect.TypeOf((*SqsQueueMetricFactoryProps)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.SqsQueueMonitoring",
		reflect.TypeOf((*SqsQueueMonitoring)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "addAlarm", GoMethod: "AddAlarm"},
			_jsii_.MemberProperty{JsiiProperty: "ageAnnotations", GoGetter: "AgeAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "alarms", GoGetter: "Alarms"},
			_jsii_.MemberMethod{JsiiMethod: "alarmWidgets", GoMethod: "AlarmWidgets"},
			_jsii_.MemberProperty{JsiiProperty: "consumptionRateMetric", GoGetter: "ConsumptionRateMetric"},
			_jsii_.MemberProperty{JsiiProperty: "countAnnotations", GoGetter: "CountAnnotations"},
			_jsii_.MemberMethod{JsiiMethod: "createAlarmFactory", GoMethod: "CreateAlarmFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createdAlarms", GoMethod: "CreatedAlarms"},
			_jsii_.MemberMethod{JsiiMethod: "createMessageAgeWidget", GoMethod: "CreateMessageAgeWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createMessageCountWidget", GoMethod: "CreateMessageCountWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createMessageSizeWidget", GoMethod: "CreateMessageSizeWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createMetricFactory", GoMethod: "CreateMetricFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createProducerAndConsumerRateWidget", GoMethod: "CreateProducerAndConsumerRateWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createTimeToDrainWidget", GoMethod: "CreateTimeToDrainWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createTitleWidget", GoMethod: "CreateTitleWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createWidgetFactory", GoMethod: "CreateWidgetFactory"},
			_jsii_.MemberProperty{JsiiProperty: "deletedMessagesMetric", GoGetter: "DeletedMessagesMetric"},
			_jsii_.MemberProperty{JsiiProperty: "incomingMessagesMetric", GoGetter: "IncomingMessagesMetric"},
			_jsii_.MemberProperty{JsiiProperty: "localAlarmNamePrefixOverride", GoGetter: "LocalAlarmNamePrefixOverride"},
			_jsii_.MemberProperty{JsiiProperty: "messageSizeMetric", GoGetter: "MessageSizeMetric"},
			_jsii_.MemberProperty{JsiiProperty: "oldestMessageAgeMetric", GoGetter: "OldestMessageAgeMetric"},
			_jsii_.MemberProperty{JsiiProperty: "productionRateMetric", GoGetter: "ProductionRateMetric"},
			_jsii_.MemberProperty{JsiiProperty: "queueAlarmFactory", GoGetter: "QueueAlarmFactory"},
			_jsii_.MemberProperty{JsiiProperty: "queueUrl", GoGetter: "QueueUrl"},
			_jsii_.MemberMethod{JsiiMethod: "resolveQueueName", GoMethod: "ResolveQueueName"},
			_jsii_.MemberProperty{JsiiProperty: "scope", GoGetter: "Scope"},
			_jsii_.MemberMethod{JsiiMethod: "summaryWidgets", GoMethod: "SummaryWidgets"},
			_jsii_.MemberProperty{JsiiProperty: "timeToDrainAnnotations", GoGetter: "TimeToDrainAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "timeToDrainMetric", GoGetter: "TimeToDrainMetric"},
			_jsii_.MemberProperty{JsiiProperty: "title", GoGetter: "Title"},
			_jsii_.MemberProperty{JsiiProperty: "visibleMessagesMetric", GoGetter: "VisibleMessagesMetric"},
			_jsii_.MemberMethod{JsiiMethod: "widgets", GoMethod: "Widgets"},
		},
		func() interface{} {
			j := jsiiProxy_SqsQueueMonitoring{}
			_jsii_.InitJsiiProxy(&j.jsiiProxy_Monitoring)
			return &j
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.SqsQueueMonitoringOptions",
		reflect.TypeOf((*SqsQueueMonitoringOptions)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.SqsQueueMonitoringProps",
		reflect.TypeOf((*SqsQueueMonitoringProps)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.SqsQueueMonitoringWithDlq",
		reflect.TypeOf((*SqsQueueMonitoringWithDlq)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "addAlarm", GoMethod: "AddAlarm"},
			_jsii_.MemberProperty{JsiiProperty: "addDeadLetterQueueToSummaryDashboard", GoGetter: "AddDeadLetterQueueToSummaryDashboard"},
			_jsii_.MemberProperty{JsiiProperty: "ageAnnotations", GoGetter: "AgeAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "alarms", GoGetter: "Alarms"},
			_jsii_.MemberMethod{JsiiMethod: "alarmWidgets", GoMethod: "AlarmWidgets"},
			_jsii_.MemberProperty{JsiiProperty: "consumptionRateMetric", GoGetter: "ConsumptionRateMetric"},
			_jsii_.MemberProperty{JsiiProperty: "countAnnotations", GoGetter: "CountAnnotations"},
			_jsii_.MemberMethod{JsiiMethod: "createAlarmFactory", GoMethod: "CreateAlarmFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createdAlarms", GoMethod: "CreatedAlarms"},
			_jsii_.MemberMethod{JsiiMethod: "createDeadLetterMessageAgeWidget", GoMethod: "CreateDeadLetterMessageAgeWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createDeadLetterMessageCountWidget", GoMethod: "CreateDeadLetterMessageCountWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createDeadLetterTitleWidget", GoMethod: "CreateDeadLetterTitleWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createMessageAgeWidget", GoMethod: "CreateMessageAgeWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createMessageCountWidget", GoMethod: "CreateMessageCountWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createMessageSizeWidget", GoMethod: "CreateMessageSizeWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createMetricFactory", GoMethod: "CreateMetricFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createProducerAndConsumerRateWidget", GoMethod: "CreateProducerAndConsumerRateWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createTimeToDrainWidget", GoMethod: "CreateTimeToDrainWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createTitleWidget", GoMethod: "CreateTitleWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createWidgetFactory", GoMethod: "CreateWidgetFactory"},
			_jsii_.MemberProperty{JsiiProperty: "deadLetterAgeAnnotations", GoGetter: "DeadLetterAgeAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "deadLetterCountAnnotations", GoGetter: "DeadLetterCountAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "deadLetterQueueAlarmFactory", GoGetter: "DeadLetterQueueAlarmFactory"},
			_jsii_.MemberProperty{JsiiProperty: "deadLetterQueueIncomingMessagesMetric", GoGetter: "DeadLetterQueueIncomingMessagesMetric"},
			_jsii_.MemberProperty{JsiiProperty: "deadLetterQueueOldestMessageAgeMetric", GoGetter: "DeadLetterQueueOldestMessageAgeMetric"},
			_jsii_.MemberProperty{JsiiProperty: "deadLetterQueueVisibleMessagesMetric", GoGetter: "DeadLetterQueueVisibleMessagesMetric"},
			_jsii_.MemberProperty{JsiiProperty: "deadLetterTitle", GoGetter: "DeadLetterTitle"},
			_jsii_.MemberProperty{JsiiProperty: "deadLetterUrl", GoGetter: "DeadLetterUrl"},
			_jsii_.MemberProperty{JsiiProperty: "deletedMessagesMetric", GoGetter: "DeletedMessagesMetric"},
			_jsii_.MemberProperty{JsiiProperty: "incomingMessagesMetric", GoGetter: "IncomingMessagesMetric"},
			_jsii_.MemberProperty{JsiiProperty: "localAlarmNamePrefixOverride", GoGetter: "LocalAlarmNamePrefixOverride"},
			_jsii_.MemberProperty{JsiiProperty: "messageSizeMetric", GoGetter: "MessageSizeMetric"},
			_jsii_.MemberProperty{JsiiProperty: "oldestMessageAgeMetric", GoGetter: "OldestMessageAgeMetric"},
			_jsii_.MemberProperty{JsiiProperty: "productionRateMetric", GoGetter: "ProductionRateMetric"},
			_jsii_.MemberProperty{JsiiProperty: "queueAlarmFactory", GoGetter: "QueueAlarmFactory"},
			_jsii_.MemberProperty{JsiiProperty: "queueUrl", GoGetter: "QueueUrl"},
			_jsii_.MemberMethod{JsiiMethod: "resolveQueueName", GoMethod: "ResolveQueueName"},
			_jsii_.MemberProperty{JsiiProperty: "scope", GoGetter: "Scope"},
			_jsii_.MemberMethod{JsiiMethod: "summaryWidgets", GoMethod: "SummaryWidgets"},
			_jsii_.MemberProperty{JsiiProperty: "timeToDrainAnnotations", GoGetter: "TimeToDrainAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "timeToDrainMetric", GoGetter: "TimeToDrainMetric"},
			_jsii_.MemberProperty{JsiiProperty: "title", GoGetter: "Title"},
			_jsii_.MemberProperty{JsiiProperty: "visibleMessagesMetric", GoGetter: "VisibleMessagesMetric"},
			_jsii_.MemberMethod{JsiiMethod: "widgets", GoMethod: "Widgets"},
		},
		func() interface{} {
			j := jsiiProxy_SqsQueueMonitoringWithDlq{}
			_jsii_.InitJsiiProxy(&j.jsiiProxy_SqsQueueMonitoring)
			return &j
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.SqsQueueMonitoringWithDlqProps",
		reflect.TypeOf((*SqsQueueMonitoringWithDlqProps)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.StepFunctionActivityMetricFactory",
		reflect.TypeOf((*StepFunctionActivityMetricFactory)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberProperty{JsiiProperty: "dimensionsMap", GoGetter: "DimensionsMap"},
			_jsii_.MemberMethod{JsiiMethod: "metricActivitiesFailed", GoMethod: "MetricActivitiesFailed"},
			_jsii_.MemberMethod{JsiiMethod: "metricActivitiesFailedRate", GoMethod: "MetricActivitiesFailedRate"},
			_jsii_.MemberMethod{JsiiMethod: "metricActivitiesHeartbeatTimedOut", GoMethod: "MetricActivitiesHeartbeatTimedOut"},
			_jsii_.MemberMethod{JsiiMethod: "metricActivitiesScheduled", GoMethod: "MetricActivitiesScheduled"},
			_jsii_.MemberMethod{JsiiMethod: "metricActivitiesStarted", GoMethod: "MetricActivitiesStarted"},
			_jsii_.MemberMethod{JsiiMethod: "metricActivitiesSucceeded", GoMethod: "MetricActivitiesSucceeded"},
			_jsii_.MemberMethod{JsiiMethod: "metricActivitiesTimedOut", GoMethod: "MetricActivitiesTimedOut"},
			_jsii_.MemberMethod{JsiiMethod: "metricActivityRunTimeP50InMillis", GoMethod: "MetricActivityRunTimeP50InMillis"},
			_jsii_.MemberMethod{JsiiMethod: "metricActivityRunTimeP90InMillis", GoMethod: "MetricActivityRunTimeP90InMillis"},
			_jsii_.MemberMethod{JsiiMethod: "metricActivityRunTimeP99InMillis", GoMethod: "MetricActivityRunTimeP99InMillis"},
			_jsii_.MemberMethod{JsiiMethod: "metricActivityScheduleTimeP50InMillis", GoMethod: "MetricActivityScheduleTimeP50InMillis"},
			_jsii_.MemberMethod{JsiiMethod: "metricActivityScheduleTimeP90InMillis", GoMethod: "MetricActivityScheduleTimeP90InMillis"},
			_jsii_.MemberMethod{JsiiMethod: "metricActivityScheduleTimeP99InMillis", GoMethod: "MetricActivityScheduleTimeP99InMillis"},
			_jsii_.MemberMethod{JsiiMethod: "metricActivityTimeP50InMillis", GoMethod: "MetricActivityTimeP50InMillis"},
			_jsii_.MemberMethod{JsiiMethod: "metricActivityTimeP90InMillis", GoMethod: "MetricActivityTimeP90InMillis"},
			_jsii_.MemberMethod{JsiiMethod: "metricActivityTimeP99InMillis", GoMethod: "MetricActivityTimeP99InMillis"},
			_jsii_.MemberProperty{JsiiProperty: "metricFactory", GoGetter: "MetricFactory"},
			_jsii_.MemberProperty{JsiiProperty: "rateComputationMethod", GoGetter: "RateComputationMethod"},
		},
		func() interface{} {
			return &jsiiProxy_StepFunctionActivityMetricFactory{}
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.StepFunctionActivityMetricFactoryProps",
		reflect.TypeOf((*StepFunctionActivityMetricFactoryProps)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.StepFunctionActivityMonitoring",
		reflect.TypeOf((*StepFunctionActivityMonitoring)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "addAlarm", GoMethod: "AddAlarm"},
			_jsii_.MemberProperty{JsiiProperty: "alarms", GoGetter: "Alarms"},
			_jsii_.MemberMethod{JsiiMethod: "alarmWidgets", GoMethod: "AlarmWidgets"},
			_jsii_.MemberMethod{JsiiMethod: "createAlarmFactory", GoMethod: "CreateAlarmFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createdAlarms", GoMethod: "CreatedAlarms"},
			_jsii_.MemberMethod{JsiiMethod: "createMetricFactory", GoMethod: "CreateMetricFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createWidgetFactory", GoMethod: "CreateWidgetFactory"},
			_jsii_.MemberProperty{JsiiProperty: "durationAlarmFactory", GoGetter: "DurationAlarmFactory"},
			_jsii_.MemberProperty{JsiiProperty: "durationAnnotations", GoGetter: "DurationAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "errorAlarmFactory", GoGetter: "ErrorAlarmFactory"},
			_jsii_.MemberProperty{JsiiProperty: "errorCountAnnotations", GoGetter: "ErrorCountAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "errorRateAnnotations", GoGetter: "ErrorRateAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "failedActivitiesMetric", GoGetter: "FailedActivitiesMetric"},
			_jsii_.MemberProperty{JsiiProperty: "failedActivitiesRateMetric", GoGetter: "FailedActivitiesRateMetric"},
			_jsii_.MemberProperty{JsiiProperty: "heartbeatTimedOutActivitiesMetrics", GoGetter: "HeartbeatTimedOutActivitiesMetrics"},
			_jsii_.MemberProperty{JsiiProperty: "localAlarmNamePrefixOverride", GoGetter: "LocalAlarmNamePrefixOverride"},
			_jsii_.MemberProperty{JsiiProperty: "p50DurationMetric", GoGetter: "P50DurationMetric"},
			_jsii_.MemberProperty{JsiiProperty: "p90DurationMetric", GoGetter: "P90DurationMetric"},
			_jsii_.MemberProperty{JsiiProperty: "p99DurationMetric", GoGetter: "P99DurationMetric"},
			_jsii_.MemberProperty{JsiiProperty: "scheduledActivitiesMetric", GoGetter: "ScheduledActivitiesMetric"},
			_jsii_.MemberProperty{JsiiProperty: "scope", GoGetter: "Scope"},
			_jsii_.MemberProperty{JsiiProperty: "startedActivitiesMetric", GoGetter: "StartedActivitiesMetric"},
			_jsii_.MemberProperty{JsiiProperty: "succeededActivitiesMetric", GoGetter: "SucceededActivitiesMetric"},
			_jsii_.MemberMethod{JsiiMethod: "summaryWidgets", GoMethod: "SummaryWidgets"},
			_jsii_.MemberProperty{JsiiProperty: "timedOutActivitiesMetrics", GoGetter: "TimedOutActivitiesMetrics"},
			_jsii_.MemberProperty{JsiiProperty: "title", GoGetter: "Title"},
			_jsii_.MemberMethod{JsiiMethod: "widgets", GoMethod: "Widgets"},
		},
		func() interface{} {
			j := jsiiProxy_StepFunctionActivityMonitoring{}
			_jsii_.InitJsiiProxy(&j.jsiiProxy_Monitoring)
			return &j
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.StepFunctionActivityMonitoringProps",
		reflect.TypeOf((*StepFunctionActivityMonitoringProps)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.StepFunctionLambdaIntegrationMetricFactory",
		reflect.TypeOf((*StepFunctionLambdaIntegrationMetricFactory)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberProperty{JsiiProperty: "dimensionsMap", GoGetter: "DimensionsMap"},
			_jsii_.MemberProperty{JsiiProperty: "metricFactory", GoGetter: "MetricFactory"},
			_jsii_.MemberMethod{JsiiMethod: "metricFunctionRunTimeP50InMillis", GoMethod: "MetricFunctionRunTimeP50InMillis"},
			_jsii_.MemberMethod{JsiiMethod: "metricFunctionRunTimeP90InMillis", GoMethod: "MetricFunctionRunTimeP90InMillis"},
			_jsii_.MemberMethod{JsiiMethod: "metricFunctionRunTimeP99InMillis", GoMethod: "MetricFunctionRunTimeP99InMillis"},
			_jsii_.MemberMethod{JsiiMethod: "metricFunctionScheduleTimeP50InMillis", GoMethod: "MetricFunctionScheduleTimeP50InMillis"},
			_jsii_.MemberMethod{JsiiMethod: "metricFunctionScheduleTimeP90InMillis", GoMethod: "MetricFunctionScheduleTimeP90InMillis"},
			_jsii_.MemberMethod{JsiiMethod: "metricFunctionScheduleTimeP99InMillis", GoMethod: "MetricFunctionScheduleTimeP99InMillis"},
			_jsii_.MemberMethod{JsiiMethod: "metricFunctionsFailed", GoMethod: "MetricFunctionsFailed"},
			_jsii_.MemberMethod{JsiiMethod: "metricFunctionsFailedRate", GoMethod: "MetricFunctionsFailedRate"},
			_jsii_.MemberMethod{JsiiMethod: "metricFunctionsScheduled", GoMethod: "MetricFunctionsScheduled"},
			_jsii_.MemberMethod{JsiiMethod: "metricFunctionsStarted", GoMethod: "MetricFunctionsStarted"},
			_jsii_.MemberMethod{JsiiMethod: "metricFunctionsSucceeded", GoMethod: "MetricFunctionsSucceeded"},
			_jsii_.MemberMethod{JsiiMethod: "metricFunctionsTimedOut", GoMethod: "MetricFunctionsTimedOut"},
			_jsii_.MemberMethod{JsiiMethod: "metricFunctionTimeP50InMillis", GoMethod: "MetricFunctionTimeP50InMillis"},
			_jsii_.MemberMethod{JsiiMethod: "metricFunctionTimeP90InMillis", GoMethod: "MetricFunctionTimeP90InMillis"},
			_jsii_.MemberMethod{JsiiMethod: "metricFunctionTimeP99InMillis", GoMethod: "MetricFunctionTimeP99InMillis"},
			_jsii_.MemberProperty{JsiiProperty: "rateComputationMethod", GoGetter: "RateComputationMethod"},
		},
		func() interface{} {
			return &jsiiProxy_StepFunctionLambdaIntegrationMetricFactory{}
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.StepFunctionLambdaIntegrationMetricFactoryProps",
		reflect.TypeOf((*StepFunctionLambdaIntegrationMetricFactoryProps)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.StepFunctionLambdaIntegrationMonitoring",
		reflect.TypeOf((*StepFunctionLambdaIntegrationMonitoring)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "addAlarm", GoMethod: "AddAlarm"},
			_jsii_.MemberProperty{JsiiProperty: "alarms", GoGetter: "Alarms"},
			_jsii_.MemberMethod{JsiiMethod: "alarmWidgets", GoMethod: "AlarmWidgets"},
			_jsii_.MemberMethod{JsiiMethod: "createAlarmFactory", GoMethod: "CreateAlarmFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createdAlarms", GoMethod: "CreatedAlarms"},
			_jsii_.MemberMethod{JsiiMethod: "createMetricFactory", GoMethod: "CreateMetricFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createWidgetFactory", GoMethod: "CreateWidgetFactory"},
			_jsii_.MemberProperty{JsiiProperty: "durationAlarmFactory", GoGetter: "DurationAlarmFactory"},
			_jsii_.MemberProperty{JsiiProperty: "durationAnnotations", GoGetter: "DurationAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "errorAlarmFactory", GoGetter: "ErrorAlarmFactory"},
			_jsii_.MemberProperty{JsiiProperty: "errorCountAnnotations", GoGetter: "ErrorCountAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "errorRateAnnotations", GoGetter: "ErrorRateAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "failedFunctionRateMetric", GoGetter: "FailedFunctionRateMetric"},
			_jsii_.MemberProperty{JsiiProperty: "failedFunctionsMetric", GoGetter: "FailedFunctionsMetric"},
			_jsii_.MemberProperty{JsiiProperty: "functionUrl", GoGetter: "FunctionUrl"},
			_jsii_.MemberProperty{JsiiProperty: "localAlarmNamePrefixOverride", GoGetter: "LocalAlarmNamePrefixOverride"},
			_jsii_.MemberProperty{JsiiProperty: "p50DurationMetric", GoGetter: "P50DurationMetric"},
			_jsii_.MemberProperty{JsiiProperty: "p90DurationMetric", GoGetter: "P90DurationMetric"},
			_jsii_.MemberProperty{JsiiProperty: "p99DurationMetric", GoGetter: "P99DurationMetric"},
			_jsii_.MemberProperty{JsiiProperty: "scheduledFunctionsMetric", GoGetter: "ScheduledFunctionsMetric"},
			_jsii_.MemberProperty{JsiiProperty: "scope", GoGetter: "Scope"},
			_jsii_.MemberProperty{JsiiProperty: "startedFunctionsMetric", GoGetter: "StartedFunctionsMetric"},
			_jsii_.MemberProperty{JsiiProperty: "succeededFunctionsMetric", GoGetter: "SucceededFunctionsMetric"},
			_jsii_.MemberMethod{JsiiMethod: "summaryWidgets", GoMethod: "SummaryWidgets"},
			_jsii_.MemberProperty{JsiiProperty: "timedOutFunctionsMetrics", GoGetter: "TimedOutFunctionsMetrics"},
			_jsii_.MemberProperty{JsiiProperty: "title", GoGetter: "Title"},
			_jsii_.MemberMethod{JsiiMethod: "widgets", GoMethod: "Widgets"},
		},
		func() interface{} {
			j := jsiiProxy_StepFunctionLambdaIntegrationMonitoring{}
			_jsii_.InitJsiiProxy(&j.jsiiProxy_Monitoring)
			return &j
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.StepFunctionLambdaIntegrationMonitoringProps",
		reflect.TypeOf((*StepFunctionLambdaIntegrationMonitoringProps)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.StepFunctionMetricFactory",
		reflect.TypeOf((*StepFunctionMetricFactory)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberProperty{JsiiProperty: "dimensionsMap", GoGetter: "DimensionsMap"},
			_jsii_.MemberMethod{JsiiMethod: "metricExecutionsAborted", GoMethod: "MetricExecutionsAborted"},
			_jsii_.MemberMethod{JsiiMethod: "metricExecutionsFailed", GoMethod: "MetricExecutionsFailed"},
			_jsii_.MemberMethod{JsiiMethod: "metricExecutionsFailedRate", GoMethod: "MetricExecutionsFailedRate"},
			_jsii_.MemberMethod{JsiiMethod: "metricExecutionsStarted", GoMethod: "MetricExecutionsStarted"},
			_jsii_.MemberMethod{JsiiMethod: "metricExecutionsSucceeded", GoMethod: "MetricExecutionsSucceeded"},
			_jsii_.MemberMethod{JsiiMethod: "metricExecutionsTimedOut", GoMethod: "MetricExecutionsTimedOut"},
			_jsii_.MemberMethod{JsiiMethod: "metricExecutionThrottled", GoMethod: "MetricExecutionThrottled"},
			_jsii_.MemberMethod{JsiiMethod: "metricExecutionTimeP50InMillis", GoMethod: "MetricExecutionTimeP50InMillis"},
			_jsii_.MemberMethod{JsiiMethod: "metricExecutionTimeP90InMillis", GoMethod: "MetricExecutionTimeP90InMillis"},
			_jsii_.MemberMethod{JsiiMethod: "metricExecutionTimeP99InMillis", GoMethod: "MetricExecutionTimeP99InMillis"},
			_jsii_.MemberProperty{JsiiProperty: "metricFactory", GoGetter: "MetricFactory"},
			_jsii_.MemberProperty{JsiiProperty: "rateComputationMethod", GoGetter: "RateComputationMethod"},
		},
		func() interface{} {
			return &jsiiProxy_StepFunctionMetricFactory{}
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.StepFunctionMetricFactoryProps",
		reflect.TypeOf((*StepFunctionMetricFactoryProps)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.StepFunctionMonitoring",
		reflect.TypeOf((*StepFunctionMonitoring)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberProperty{JsiiProperty: "abortedExecutionsMetric", GoGetter: "AbortedExecutionsMetric"},
			_jsii_.MemberMethod{JsiiMethod: "addAlarm", GoMethod: "AddAlarm"},
			_jsii_.MemberProperty{JsiiProperty: "alarms", GoGetter: "Alarms"},
			_jsii_.MemberMethod{JsiiMethod: "alarmWidgets", GoMethod: "AlarmWidgets"},
			_jsii_.MemberMethod{JsiiMethod: "createAlarmFactory", GoMethod: "CreateAlarmFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createdAlarms", GoMethod: "CreatedAlarms"},
			_jsii_.MemberMethod{JsiiMethod: "createMetricFactory", GoMethod: "CreateMetricFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createWidgetFactory", GoMethod: "CreateWidgetFactory"},
			_jsii_.MemberProperty{JsiiProperty: "durationAlarmFactory", GoGetter: "DurationAlarmFactory"},
			_jsii_.MemberProperty{JsiiProperty: "durationAnnotations", GoGetter: "DurationAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "errorAlarmFactory", GoGetter: "ErrorAlarmFactory"},
			_jsii_.MemberProperty{JsiiProperty: "errorCountAnnotations", GoGetter: "ErrorCountAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "errorRateAnnotations", GoGetter: "ErrorRateAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "failedExecutionRateMetric", GoGetter: "FailedExecutionRateMetric"},
			_jsii_.MemberProperty{JsiiProperty: "failedExecutionsMetric", GoGetter: "FailedExecutionsMetric"},
			_jsii_.MemberProperty{JsiiProperty: "localAlarmNamePrefixOverride", GoGetter: "LocalAlarmNamePrefixOverride"},
			_jsii_.MemberProperty{JsiiProperty: "p50DurationMetric", GoGetter: "P50DurationMetric"},
			_jsii_.MemberProperty{JsiiProperty: "p90DurationMetric", GoGetter: "P90DurationMetric"},
			_jsii_.MemberProperty{JsiiProperty: "p99DurationMetric", GoGetter: "P99DurationMetric"},
			_jsii_.MemberProperty{JsiiProperty: "scope", GoGetter: "Scope"},
			_jsii_.MemberProperty{JsiiProperty: "startedExecutionsMetric", GoGetter: "StartedExecutionsMetric"},
			_jsii_.MemberProperty{JsiiProperty: "stateMachineUrl", GoGetter: "StateMachineUrl"},
			_jsii_.MemberProperty{JsiiProperty: "succeededExecutionsMetric", GoGetter: "SucceededExecutionsMetric"},
			_jsii_.MemberMethod{JsiiMethod: "summaryWidgets", GoMethod: "SummaryWidgets"},
			_jsii_.MemberProperty{JsiiProperty: "taskHealthAlarmFactory", GoGetter: "TaskHealthAlarmFactory"},
			_jsii_.MemberProperty{JsiiProperty: "throttledExecutionsMetric", GoGetter: "ThrottledExecutionsMetric"},
			_jsii_.MemberProperty{JsiiProperty: "timedOutExecutionsMetrics", GoGetter: "TimedOutExecutionsMetrics"},
			_jsii_.MemberProperty{JsiiProperty: "title", GoGetter: "Title"},
			_jsii_.MemberMethod{JsiiMethod: "widgets", GoMethod: "Widgets"},
		},
		func() interface{} {
			j := jsiiProxy_StepFunctionMonitoring{}
			_jsii_.InitJsiiProxy(&j.jsiiProxy_Monitoring)
			return &j
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.StepFunctionMonitoringOptions",
		reflect.TypeOf((*StepFunctionMonitoringOptions)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.StepFunctionMonitoringProps",
		reflect.TypeOf((*StepFunctionMonitoringProps)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.StepFunctionServiceIntegrationMetricFactory",
		reflect.TypeOf((*StepFunctionServiceIntegrationMetricFactory)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberProperty{JsiiProperty: "dimensionsMap", GoGetter: "DimensionsMap"},
			_jsii_.MemberProperty{JsiiProperty: "metricFactory", GoGetter: "MetricFactory"},
			_jsii_.MemberMethod{JsiiMethod: "metricServiceIntegrationRunTimeP50InMillis", GoMethod: "MetricServiceIntegrationRunTimeP50InMillis"},
			_jsii_.MemberMethod{JsiiMethod: "metricServiceIntegrationRunTimeP90InMillis", GoMethod: "MetricServiceIntegrationRunTimeP90InMillis"},
			_jsii_.MemberMethod{JsiiMethod: "metricServiceIntegrationRunTimeP99InMillis", GoMethod: "MetricServiceIntegrationRunTimeP99InMillis"},
			_jsii_.MemberMethod{JsiiMethod: "metricServiceIntegrationScheduleTimeP50InMillis", GoMethod: "MetricServiceIntegrationScheduleTimeP50InMillis"},
			_jsii_.MemberMethod{JsiiMethod: "metricServiceIntegrationScheduleTimeP90InMillis", GoMethod: "MetricServiceIntegrationScheduleTimeP90InMillis"},
			_jsii_.MemberMethod{JsiiMethod: "metricServiceIntegrationScheduleTimeP99InMillis", GoMethod: "MetricServiceIntegrationScheduleTimeP99InMillis"},
			_jsii_.MemberMethod{JsiiMethod: "metricServiceIntegrationsFailed", GoMethod: "MetricServiceIntegrationsFailed"},
			_jsii_.MemberMethod{JsiiMethod: "metricServiceIntegrationsFailedRate", GoMethod: "MetricServiceIntegrationsFailedRate"},
			_jsii_.MemberMethod{JsiiMethod: "metricServiceIntegrationsScheduled", GoMethod: "MetricServiceIntegrationsScheduled"},
			_jsii_.MemberMethod{JsiiMethod: "metricServiceIntegrationsStarted", GoMethod: "MetricServiceIntegrationsStarted"},
			_jsii_.MemberMethod{JsiiMethod: "metricServiceIntegrationsSucceeded", GoMethod: "MetricServiceIntegrationsSucceeded"},
			_jsii_.MemberMethod{JsiiMethod: "metricServiceIntegrationsTimedOut", GoMethod: "MetricServiceIntegrationsTimedOut"},
			_jsii_.MemberMethod{JsiiMethod: "metricServiceIntegrationTimeP50InMillis", GoMethod: "MetricServiceIntegrationTimeP50InMillis"},
			_jsii_.MemberMethod{JsiiMethod: "metricServiceIntegrationTimeP90InMillis", GoMethod: "MetricServiceIntegrationTimeP90InMillis"},
			_jsii_.MemberMethod{JsiiMethod: "metricServiceIntegrationTimeP99InMillis", GoMethod: "MetricServiceIntegrationTimeP99InMillis"},
			_jsii_.MemberProperty{JsiiProperty: "rateComputationMethod", GoGetter: "RateComputationMethod"},
		},
		func() interface{} {
			return &jsiiProxy_StepFunctionServiceIntegrationMetricFactory{}
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.StepFunctionServiceIntegrationMetricFactoryProps",
		reflect.TypeOf((*StepFunctionServiceIntegrationMetricFactoryProps)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.StepFunctionServiceIntegrationMonitoring",
		reflect.TypeOf((*StepFunctionServiceIntegrationMonitoring)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "addAlarm", GoMethod: "AddAlarm"},
			_jsii_.MemberProperty{JsiiProperty: "alarms", GoGetter: "Alarms"},
			_jsii_.MemberMethod{JsiiMethod: "alarmWidgets", GoMethod: "AlarmWidgets"},
			_jsii_.MemberMethod{JsiiMethod: "createAlarmFactory", GoMethod: "CreateAlarmFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createdAlarms", GoMethod: "CreatedAlarms"},
			_jsii_.MemberMethod{JsiiMethod: "createMetricFactory", GoMethod: "CreateMetricFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createWidgetFactory", GoMethod: "CreateWidgetFactory"},
			_jsii_.MemberProperty{JsiiProperty: "durationAlarmFactory", GoGetter: "DurationAlarmFactory"},
			_jsii_.MemberProperty{JsiiProperty: "durationAnnotations", GoGetter: "DurationAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "errorAlarmFactory", GoGetter: "ErrorAlarmFactory"},
			_jsii_.MemberProperty{JsiiProperty: "errorCountAnnotations", GoGetter: "ErrorCountAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "errorRateAnnotations", GoGetter: "ErrorRateAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "failedServiceIntegrationRateMetric", GoGetter: "FailedServiceIntegrationRateMetric"},
			_jsii_.MemberProperty{JsiiProperty: "failedServiceIntegrationsMetric", GoGetter: "FailedServiceIntegrationsMetric"},
			_jsii_.MemberProperty{JsiiProperty: "localAlarmNamePrefixOverride", GoGetter: "LocalAlarmNamePrefixOverride"},
			_jsii_.MemberProperty{JsiiProperty: "p50DurationMetric", GoGetter: "P50DurationMetric"},
			_jsii_.MemberProperty{JsiiProperty: "p90DurationMetric", GoGetter: "P90DurationMetric"},
			_jsii_.MemberProperty{JsiiProperty: "p99DurationMetric", GoGetter: "P99DurationMetric"},
			_jsii_.MemberProperty{JsiiProperty: "scheduledServiceIntegrationsMetric", GoGetter: "ScheduledServiceIntegrationsMetric"},
			_jsii_.MemberProperty{JsiiProperty: "scope", GoGetter: "Scope"},
			_jsii_.MemberProperty{JsiiProperty: "startedServiceIntegrationsMetric", GoGetter: "StartedServiceIntegrationsMetric"},
			_jsii_.MemberProperty{JsiiProperty: "succeededServiceIntegrationsMetric", GoGetter: "SucceededServiceIntegrationsMetric"},
			_jsii_.MemberMethod{JsiiMethod: "summaryWidgets", GoMethod: "SummaryWidgets"},
			_jsii_.MemberProperty{JsiiProperty: "timedOutServiceIntegrationsMetrics", GoGetter: "TimedOutServiceIntegrationsMetrics"},
			_jsii_.MemberProperty{JsiiProperty: "title", GoGetter: "Title"},
			_jsii_.MemberMethod{JsiiMethod: "widgets", GoMethod: "Widgets"},
		},
		func() interface{} {
			j := jsiiProxy_StepFunctionServiceIntegrationMonitoring{}
			_jsii_.InitJsiiProxy(&j.jsiiProxy_Monitoring)
			return &j
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.StepFunctionServiceIntegrationMonitoringProps",
		reflect.TypeOf((*StepFunctionServiceIntegrationMonitoringProps)(nil)).Elem(),
	)
	_jsii_.RegisterEnum(
		"cdk-monitoring-constructs.StorageType",
		reflect.TypeOf((*StorageType)(nil)).Elem(),
		map[string]interface{}{
			"DEEP_ARCHIVE_OBJECT_OVERHEAD": StorageType_DEEP_ARCHIVE_OBJECT_OVERHEAD,
			"DEEP_ARCHIVE_S3_OBJECT_OVERHEAD": StorageType_DEEP_ARCHIVE_S3_OBJECT_OVERHEAD,
			"DEEP_ARCHIVE_STAGING_STORAGE": StorageType_DEEP_ARCHIVE_STAGING_STORAGE,
			"DEEP_ARCHIVE_STORAGE": StorageType_DEEP_ARCHIVE_STORAGE,
			"GLACIER_OBJECT_OVERHEAD": StorageType_GLACIER_OBJECT_OVERHEAD,
			"GLACIER_S3_OBJECT_OVERHEAD": StorageType_GLACIER_S3_OBJECT_OVERHEAD,
			"GLACIER_STAGING_STORAGE": StorageType_GLACIER_STAGING_STORAGE,
			"GLACIER_STORAGE": StorageType_GLACIER_STORAGE,
			"INTELLIGENT_TIERING_FA_STORAGE": StorageType_INTELLIGENT_TIERING_FA_STORAGE,
			"INTELLIGENT_TIERING_IA_STORAGE": StorageType_INTELLIGENT_TIERING_IA_STORAGE,
			"ONE_ZONE_IA_SIZE_OVERHEAD": StorageType_ONE_ZONE_IA_SIZE_OVERHEAD,
			"ONE_ZONE_IA_STORAGE": StorageType_ONE_ZONE_IA_STORAGE,
			"REDUCED_REDUNDANCY_STORAGE": StorageType_REDUCED_REDUNDANCY_STORAGE,
			"STANDARD_IA_SIZE_OVERHEAD": StorageType_STANDARD_IA_SIZE_OVERHEAD,
			"STANDARD_IA_STORAGE": StorageType_STANDARD_IA_STORAGE,
			"STANDARD_STORAGE": StorageType_STANDARD_STORAGE,
		},
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.SyntheticsCanaryMetricFactory",
		reflect.TypeOf((*SyntheticsCanaryMetricFactory)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberProperty{JsiiProperty: "canary", GoGetter: "Canary"},
			_jsii_.MemberProperty{JsiiProperty: "dimensionsMap", GoGetter: "DimensionsMap"},
			_jsii_.MemberMethod{JsiiMethod: "metric4xxErrorCount", GoMethod: "Metric4xxErrorCount"},
			_jsii_.MemberMethod{JsiiMethod: "metric4xxErrorRate", GoMethod: "Metric4xxErrorRate"},
			_jsii_.MemberMethod{JsiiMethod: "metric5xxFaultCount", GoMethod: "Metric5xxFaultCount"},
			_jsii_.MemberMethod{JsiiMethod: "metric5xxFaultRate", GoMethod: "Metric5xxFaultRate"},
			_jsii_.MemberProperty{JsiiProperty: "metricFactory", GoGetter: "MetricFactory"},
			_jsii_.MemberMethod{JsiiMethod: "metricLatencyAverageInMillis", GoMethod: "MetricLatencyAverageInMillis"},
			_jsii_.MemberMethod{JsiiMethod: "metricSuccessInPercent", GoMethod: "MetricSuccessInPercent"},
			_jsii_.MemberProperty{JsiiProperty: "rateComputationMethod", GoGetter: "RateComputationMethod"},
		},
		func() interface{} {
			return &jsiiProxy_SyntheticsCanaryMetricFactory{}
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.SyntheticsCanaryMetricFactoryProps",
		reflect.TypeOf((*SyntheticsCanaryMetricFactoryProps)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.SyntheticsCanaryMonitoring",
		reflect.TypeOf((*SyntheticsCanaryMonitoring)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "addAlarm", GoMethod: "AddAlarm"},
			_jsii_.MemberProperty{JsiiProperty: "alarms", GoGetter: "Alarms"},
			_jsii_.MemberMethod{JsiiMethod: "alarmWidgets", GoMethod: "AlarmWidgets"},
			_jsii_.MemberProperty{JsiiProperty: "averageLatencyMetric", GoGetter: "AverageLatencyMetric"},
			_jsii_.MemberMethod{JsiiMethod: "createAlarmFactory", GoMethod: "CreateAlarmFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createdAlarms", GoMethod: "CreatedAlarms"},
			_jsii_.MemberMethod{JsiiMethod: "createErrorCountWidget", GoMethod: "CreateErrorCountWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createErrorRateWidget", GoMethod: "CreateErrorRateWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createLatencyWidget", GoMethod: "CreateLatencyWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createMetricFactory", GoMethod: "CreateMetricFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createTitleWidget", GoMethod: "CreateTitleWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createWidgetFactory", GoMethod: "CreateWidgetFactory"},
			_jsii_.MemberProperty{JsiiProperty: "errorAlarmFactory", GoGetter: "ErrorAlarmFactory"},
			_jsii_.MemberProperty{JsiiProperty: "errorCountAnnotations", GoGetter: "ErrorCountAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "errorCountMetric", GoGetter: "ErrorCountMetric"},
			_jsii_.MemberProperty{JsiiProperty: "errorRateAnnotations", GoGetter: "ErrorRateAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "errorRateMetric", GoGetter: "ErrorRateMetric"},
			_jsii_.MemberProperty{JsiiProperty: "faultCountMetric", GoGetter: "FaultCountMetric"},
			_jsii_.MemberProperty{JsiiProperty: "faultRateMetric", GoGetter: "FaultRateMetric"},
			_jsii_.MemberProperty{JsiiProperty: "humanReadableName", GoGetter: "HumanReadableName"},
			_jsii_.MemberProperty{JsiiProperty: "latencyAlarmFactory", GoGetter: "LatencyAlarmFactory"},
			_jsii_.MemberProperty{JsiiProperty: "latencyAnnotations", GoGetter: "LatencyAnnotations"},
			_jsii_.MemberProperty{JsiiProperty: "localAlarmNamePrefixOverride", GoGetter: "LocalAlarmNamePrefixOverride"},
			_jsii_.MemberProperty{JsiiProperty: "scope", GoGetter: "Scope"},
			_jsii_.MemberMethod{JsiiMethod: "summaryWidgets", GoMethod: "SummaryWidgets"},
			_jsii_.MemberMethod{JsiiMethod: "widgets", GoMethod: "Widgets"},
		},
		func() interface{} {
			j := jsiiProxy_SyntheticsCanaryMonitoring{}
			_jsii_.InitJsiiProxy(&j.jsiiProxy_Monitoring)
			return &j
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.SyntheticsCanaryMonitoringOptions",
		reflect.TypeOf((*SyntheticsCanaryMonitoringOptions)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.SyntheticsCanaryMonitoringProps",
		reflect.TypeOf((*SyntheticsCanaryMonitoringProps)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.TaskHealthAlarmFactory",
		reflect.TypeOf((*TaskHealthAlarmFactory)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "addAvailabilityAlarm", GoMethod: "AddAvailabilityAlarm"},
			_jsii_.MemberMethod{JsiiMethod: "addHealthyTaskCountAlarm", GoMethod: "AddHealthyTaskCountAlarm"},
			_jsii_.MemberMethod{JsiiMethod: "addHealthyTaskPercentAlarm", GoMethod: "AddHealthyTaskPercentAlarm"},
			_jsii_.MemberMethod{JsiiMethod: "addMinRunningTaskCountAlarm", GoMethod: "AddMinRunningTaskCountAlarm"},
			_jsii_.MemberMethod{JsiiMethod: "addRunningTaskCountAlarm", GoMethod: "AddRunningTaskCountAlarm"},
			_jsii_.MemberMethod{JsiiMethod: "addRunningTaskRateAlarm", GoMethod: "AddRunningTaskRateAlarm"},
			_jsii_.MemberMethod{JsiiMethod: "addUnhealthyTaskCountAlarm", GoMethod: "AddUnhealthyTaskCountAlarm"},
			_jsii_.MemberProperty{JsiiProperty: "alarmFactory", GoGetter: "AlarmFactory"},
		},
		func() interface{} {
			return &jsiiProxy_TaskHealthAlarmFactory{}
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.ThrottledEventsThreshold",
		reflect.TypeOf((*ThrottledEventsThreshold)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.ThroughputAlarmFactory",
		reflect.TypeOf((*ThroughputAlarmFactory)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "addMinProcessedBytesAlarm", GoMethod: "AddMinProcessedBytesAlarm"},
			_jsii_.MemberProperty{JsiiProperty: "alarmFactory", GoGetter: "AlarmFactory"},
		},
		func() interface{} {
			return &jsiiProxy_ThroughputAlarmFactory{}
		},
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.TopicAlarmFactory",
		reflect.TypeOf((*TopicAlarmFactory)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "addMaxMessagesPublishedAlarm", GoMethod: "AddMaxMessagesPublishedAlarm"},
			_jsii_.MemberMethod{JsiiMethod: "addMessageNotificationsFailedAlarm", GoMethod: "AddMessageNotificationsFailedAlarm"},
			_jsii_.MemberMethod{JsiiMethod: "addMinMessagesPublishedAlarm", GoMethod: "AddMinMessagesPublishedAlarm"},
			_jsii_.MemberProperty{JsiiProperty: "alarmFactory", GoGetter: "AlarmFactory"},
		},
		func() interface{} {
			return &jsiiProxy_TopicAlarmFactory{}
		},
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.TpsAlarmFactory",
		reflect.TypeOf((*TpsAlarmFactory)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "addMaxTpsAlarm", GoMethod: "AddMaxTpsAlarm"},
			_jsii_.MemberMethod{JsiiMethod: "addMinTpsAlarm", GoMethod: "AddMinTpsAlarm"},
			_jsii_.MemberProperty{JsiiProperty: "alarmFactory", GoGetter: "AlarmFactory"},
		},
		func() interface{} {
			return &jsiiProxy_TpsAlarmFactory{}
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.UnhealthyTaskCountThreshold",
		reflect.TypeOf((*UnhealthyTaskCountThreshold)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.UsageAlarmFactory",
		reflect.TypeOf((*UsageAlarmFactory)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "addMaxCpuUsagePercentAlarm", GoMethod: "AddMaxCpuUsagePercentAlarm"},
			_jsii_.MemberMethod{JsiiMethod: "addMaxDiskUsagePercentAlarm", GoMethod: "AddMaxDiskUsagePercentAlarm"},
			_jsii_.MemberMethod{JsiiMethod: "addMaxFileDescriptorPercentAlarm", GoMethod: "AddMaxFileDescriptorPercentAlarm"},
			_jsii_.MemberMethod{JsiiMethod: "addMaxHeapMemoryAfterGCUsagePercentAlarm", GoMethod: "AddMaxHeapMemoryAfterGCUsagePercentAlarm"},
			_jsii_.MemberMethod{JsiiMethod: "addMaxMasterCpuUsagePercentAlarm", GoMethod: "AddMaxMasterCpuUsagePercentAlarm"},
			_jsii_.MemberMethod{JsiiMethod: "addMaxMasterMemoryUsagePercentAlarm", GoMethod: "AddMaxMasterMemoryUsagePercentAlarm"},
			_jsii_.MemberMethod{JsiiMethod: "addMaxMemoryUsagePercentAlarm", GoMethod: "AddMaxMemoryUsagePercentAlarm"},
			_jsii_.MemberMethod{JsiiMethod: "addMaxThreadCountUsageAlarm", GoMethod: "AddMaxThreadCountUsageAlarm"},
			_jsii_.MemberMethod{JsiiMethod: "addMemoryUsagePercentAlarm", GoMethod: "AddMemoryUsagePercentAlarm"},
			_jsii_.MemberProperty{JsiiProperty: "alarmFactory", GoGetter: "AlarmFactory"},
		},
		func() interface{} {
			return &jsiiProxy_UsageAlarmFactory{}
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.UsageCountThreshold",
		reflect.TypeOf((*UsageCountThreshold)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.UsageThreshold",
		reflect.TypeOf((*UsageThreshold)(nil)).Elem(),
	)
	_jsii_.RegisterEnum(
		"cdk-monitoring-constructs.UsageType",
		reflect.TypeOf((*UsageType)(nil)).Elem(),
		map[string]interface{}{
			"P50": UsageType_P50,
			"P70": UsageType_P70,
			"P90": UsageType_P90,
			"P99": UsageType_P99,
			"P999": UsageType_P999,
			"P9999": UsageType_P9999,
			"P100": UsageType_P100,
			"AVERAGE": UsageType_AVERAGE,
			"MAX": UsageType_MAX,
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.UserProvidedNames",
		reflect.TypeOf((*UserProvidedNames)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.WafV2MetricFactory",
		reflect.TypeOf((*WafV2MetricFactory)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberProperty{JsiiProperty: "dimensions", GoGetter: "Dimensions"},
			_jsii_.MemberMethod{JsiiMethod: "metricAllowedRequests", GoMethod: "MetricAllowedRequests"},
			_jsii_.MemberMethod{JsiiMethod: "metricBlockedRequests", GoMethod: "MetricBlockedRequests"},
			_jsii_.MemberMethod{JsiiMethod: "metricBlockedRequestsRate", GoMethod: "MetricBlockedRequestsRate"},
			_jsii_.MemberProperty{JsiiProperty: "metricFactory", GoGetter: "MetricFactory"},
		},
		func() interface{} {
			return &jsiiProxy_WafV2MetricFactory{}
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.WafV2MetricFactoryProps",
		reflect.TypeOf((*WafV2MetricFactoryProps)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.WafV2Monitoring",
		reflect.TypeOf((*WafV2Monitoring)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "addAlarm", GoMethod: "AddAlarm"},
			_jsii_.MemberProperty{JsiiProperty: "alarms", GoGetter: "Alarms"},
			_jsii_.MemberMethod{JsiiMethod: "alarmWidgets", GoMethod: "AlarmWidgets"},
			_jsii_.MemberProperty{JsiiProperty: "allowedRequestsMetric", GoGetter: "AllowedRequestsMetric"},
			_jsii_.MemberProperty{JsiiProperty: "blockedRequestsMetric", GoGetter: "BlockedRequestsMetric"},
			_jsii_.MemberProperty{JsiiProperty: "blockedRequestsRateMetric", GoGetter: "BlockedRequestsRateMetric"},
			_jsii_.MemberMethod{JsiiMethod: "createAlarmFactory", GoMethod: "CreateAlarmFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createAllowedRequestsWidget", GoMethod: "CreateAllowedRequestsWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createBlockedRequestsRateWidget", GoMethod: "CreateBlockedRequestsRateWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createBlockedRequestsWidget", GoMethod: "CreateBlockedRequestsWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createdAlarms", GoMethod: "CreatedAlarms"},
			_jsii_.MemberMethod{JsiiMethod: "createMetricFactory", GoMethod: "CreateMetricFactory"},
			_jsii_.MemberMethod{JsiiMethod: "createTitleWidget", GoMethod: "CreateTitleWidget"},
			_jsii_.MemberMethod{JsiiMethod: "createWidgetFactory", GoMethod: "CreateWidgetFactory"},
			_jsii_.MemberProperty{JsiiProperty: "humanReadableName", GoGetter: "HumanReadableName"},
			_jsii_.MemberProperty{JsiiProperty: "localAlarmNamePrefixOverride", GoGetter: "LocalAlarmNamePrefixOverride"},
			_jsii_.MemberProperty{JsiiProperty: "scope", GoGetter: "Scope"},
			_jsii_.MemberMethod{JsiiMethod: "summaryWidgets", GoMethod: "SummaryWidgets"},
			_jsii_.MemberMethod{JsiiMethod: "widgets", GoMethod: "Widgets"},
		},
		func() interface{} {
			j := jsiiProxy_WafV2Monitoring{}
			_jsii_.InitJsiiProxy(&j.jsiiProxy_Monitoring)
			return &j
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.WafV2MonitoringOptions",
		reflect.TypeOf((*WafV2MonitoringOptions)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.WafV2MonitoringProps",
		reflect.TypeOf((*WafV2MonitoringProps)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-monitoring-constructs.XaxrMathExpression",
		reflect.TypeOf((*XaxrMathExpression)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberMethod{JsiiMethod: "toMetricConfig", GoMethod: "ToMetricConfig"},
			_jsii_.MemberMethod{JsiiMethod: "with", GoMethod: "With"},
		},
		func() interface{} {
			j := jsiiProxy_XaxrMathExpression{}
			_jsii_.InitJsiiProxy(&j.Type__awscloudwatchIMetric)
			return &j
		},
	)
	_jsii_.RegisterStruct(
		"cdk-monitoring-constructs.XaxrMathExpressionProps",
		reflect.TypeOf((*XaxrMathExpressionProps)(nil)).Elem(),
	)
}
