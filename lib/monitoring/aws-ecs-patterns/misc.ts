import {QueueProcessingEc2Service, QueueProcessingFargateService} from "aws-cdk-lib/aws-ecs-patterns";
import {IQueue} from "aws-cdk-lib/aws-sqs";

import {Ec2ServiceMonitoring} from "./Ec2ServiceMonitoring";
import {BaseFargateServiceAlarms, FargateServiceMonitoring} from "./FargateServiceMonitoring";
import {BaseMonitoringProps, MonitoringScope} from "../../common";
import {BaseDlqAlarms, BaseSqsQueueAlarms, SqsQueueMonitoring, SqsQueueMonitoringWithDlq} from "../aws-sqs";

interface BaseQueueProcessingServiceMonitoringProps extends BaseMonitoringProps {
    readonly addServiceAlarms?: BaseFargateServiceAlarms;
    readonly addQueueAlarms?: BaseSqsQueueAlarms;
    readonly addDeadLetterQueueAlarms?: BaseDlqAlarms;
}

export interface QueueProcessingFargateServiceMonitoringProps extends BaseQueueProcessingServiceMonitoringProps {
    readonly fargateService: QueueProcessingFargateService;
}

export interface QueueProcessingEc2ServiceMonitoringProps extends BaseQueueProcessingServiceMonitoringProps {
    readonly ec2Service: QueueProcessingEc2Service;
}

export function getQueueProcessingFargateServiceMonitoring(facade: MonitoringScope, props: QueueProcessingFargateServiceMonitoringProps) {
    return [
        new FargateServiceMonitoring(facade, {
            ...props,
            fargateService: props.fargateService.service,
            ...props.addServiceAlarms,
        }),
        getCommonQueueProcessingMonitoring(facade, props, props.fargateService.sqsQueue, props.fargateService.deadLetterQueue),
    ];
}

export function getQueueProcessingEc2ServiceMonitoring(facade: MonitoringScope, props: QueueProcessingEc2ServiceMonitoringProps) {
    return [
        new Ec2ServiceMonitoring(facade, {
            ...props,
            ec2Service: props.ec2Service.service,
            ...props.addServiceAlarms,
        }),
        getCommonQueueProcessingMonitoring(facade, props, props.ec2Service.sqsQueue, props.ec2Service.deadLetterQueue),
    ];
}

function getCommonQueueProcessingMonitoring(
    scope: MonitoringScope,
    props: BaseQueueProcessingServiceMonitoringProps,
    queue: IQueue,
    deadLetterQueue?: IQueue,
) {
    if (deadLetterQueue) {
        return new SqsQueueMonitoringWithDlq(scope, {
            ...props,
            queue,
            deadLetterQueue: deadLetterQueue!,
            ...props.addQueueAlarms,
            ...props.addDeadLetterQueueAlarms,
        });
    } else {
        return new SqsQueueMonitoring(scope, {
            ...props,
            queue,
            ...props.addDeadLetterQueueAlarms,
        });
    }
}
