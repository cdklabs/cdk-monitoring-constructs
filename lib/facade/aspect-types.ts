import {
  ApiGatewayMonitoringOptions,
  ApiGatewayV2MonitoringOptions,
  CertificateManagerMonitoringOptions,
} from "../monitoring";

export interface MonitoringAspectProps {
  /**
   * Automatically monitor ACM Certificates in the scope
   * @default true
   */
  readonly acm?: boolean;

  /**
   * Default properties for ACM Certificates Monitoring
   * @default - none
   */
  readonly defaultAcmMonitoringProps?: CertificateManagerMonitoringOptions;

  /**
   * Automatically monitor API Gateway Rest Apis in the scope
   * @default true
   */
  readonly apiGateway?: boolean;

  /**
   * Default properties for API Gateway Rest Apis Monitoring
   * @default - none
   */
  readonly defaultApiGatewayMonitoringProps?: ApiGatewayMonitoringOptions;

  /**
   * Automatically monitor API Gateway HTTP Apis in the scope
   * @default true
   */
  readonly apiGatewayV2?: boolean;

  /**
   * Default properties for API Gateway HTTP Apis Monitoring
   * @default - none
   */
  readonly defaultApiGatewayV2HttpApiMonitoringProps?: ApiGatewayV2MonitoringOptions;
}
