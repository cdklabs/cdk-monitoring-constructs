import { IConstruct, IAspect } from "monocdk";
import * as apigw from "monocdk/aws-apigateway";
import * as apigwv2 from "monocdk/aws-apigatewayv2";
import * as acm from "monocdk/aws-certificatemanager";

import { MonitoringFacade } from "./MonitoringFacade";

export interface MonitoringAspectProps {
  /**
   * Automatically monitor ACM Certificats in the scope
   */
  readonly acm?: boolean;

  /**
   * Automatically monitor API Gateway Rest Apis in the scope
   * @default true
   */
  readonly apiGateway?: boolean;

  /**
   * Automatically monitor API Gateway HTTP Apis in the scope
   * @default true
   */
  readonly apiGatewayV2?: boolean;
}

/**
 * A CDK aspect that adds support for monitoring all resources within scope.
 */
export class MonitoringAspect implements IAspect {
  constructor(
    private readonly monitoringFacade: MonitoringFacade,
    private readonly props: MonitoringAspectProps = {}
  ) {}

  public visit(node: IConstruct): void {
    const monitorAcmCertificate = this.props.acm ?? true;
    if (monitorAcmCertificate && node instanceof acm.Certificate) {
      this.monitoringFacade.monitorCertificate({
        certificate: node,
        alarmFriendlyName: node.node.path,
      });
    }

    const monitorApiGateway = this.props.apiGateway ?? true;
    if (monitorApiGateway && node instanceof apigw.RestApi) {
      this.monitoringFacade.monitorApiGateway({ api: node });
    }

    const monitorApiGatewayV2 = this.props.apiGatewayV2 ?? true;
    if (monitorApiGatewayV2 && node instanceof apigwv2.HttpApi) {
      this.monitoringFacade.monitorApiGatewayV2HttpApi({ api: node });
    }
  }
}
