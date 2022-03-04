import { IConstruct, IAspect } from "monocdk";
import * as apigw from "monocdk/aws-apigateway";
import * as apigwv2 from "monocdk/aws-apigatewayv2";
import * as acm from "monocdk/aws-certificatemanager";

import { MonitoringAspectProps } from "./aspect-types";
import { MonitoringFacade } from "./MonitoringFacade";

/**
 * A CDK aspect that adds support for monitoring all resources within scope.
 */
export class MonitoringAspect implements IAspect {
  constructor(
    private readonly monitoringFacade: MonitoringFacade,
    private readonly props: MonitoringAspectProps = {}
  ) {}

  public visit(node: IConstruct): void {
    this.monitorAcmCertificate(node);
    this.monitorApiGateway(node);
    this.monitorApiGatewayV2HttpApi(node);
  }

  private monitorAcmCertificate(node: IConstruct) {
    const doMonitor = this.props.acm ?? true;
    if (doMonitor && node instanceof acm.Certificate) {
      this.monitoringFacade.monitorCertificate({
        certificate: node,
        alarmFriendlyName: node.node.path,
        ...this.props.defaultAcmMonitoringProps,
      });
    }
  }

  private monitorApiGateway(node: IConstruct) {
    const doMonitor = this.props.apiGateway ?? true;
    if (doMonitor && node instanceof apigw.RestApi) {
      this.monitoringFacade.monitorApiGateway({
        api: node,
        ...this.props.defaultApiGatewayMonitoringProps,
      });
    }
  }

  private monitorApiGatewayV2HttpApi(node: IConstruct) {
    const doMonitor = this.props.apiGatewayV2 ?? true;
    if (doMonitor && node instanceof apigwv2.HttpApi) {
      this.monitoringFacade.monitorApiGatewayV2HttpApi({
        api: node,
        ...this.props.defaultApiGatewayV2HttpApiMonitoringProps,
      });
    }
  }
}

export * from "./aspect-types";
