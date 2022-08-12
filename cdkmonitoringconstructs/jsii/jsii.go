// Package jsii contains the functionaility needed for jsii packages to
// initialize their dependencies and themselves. Users should never need to use this package
// directly. If you find you need to - please report a bug at
// https://github.com/aws/jsii/issues/new/choose
package jsii

import (
	_                       "embed"

	_jsii_                  "github.com/aws/jsii-runtime-go/runtime"

	awscdk                  "github.com/aws/aws-cdk-go/awscdk/v2/jsii"
	awscdkapigatewayv2alpha "github.com/aws/aws-cdk-go/awscdkapigatewayv2alpha/v2/jsii"
	awscdkappsyncalpha      "github.com/aws/aws-cdk-go/awscdkappsyncalpha/v2/jsii"
	awscdkredshiftalpha     "github.com/aws/aws-cdk-go/awscdkredshiftalpha/v2/jsii"
	awscdksyntheticsalpha   "github.com/aws/aws-cdk-go/awscdksyntheticsalpha/v2/jsii"
	constructs              "github.com/aws/constructs-go/constructs/v10/jsii"
)

//go:embed cdk-monitoring-constructs-0.0.0.tgz
var tarball []byte

// Initialize loads the necessary packages in the @jsii/kernel to support the enclosing module.
// The implementation is idempotent (and hence safe to be called over and over).
func Initialize() {
	// Ensure all dependencies are initialized
	awscdkapigatewayv2alpha.Initialize()
	awscdkappsyncalpha.Initialize()
	awscdkredshiftalpha.Initialize()
	awscdksyntheticsalpha.Initialize()
	awscdk.Initialize()
	constructs.Initialize()

	// Load this library into the kernel
	_jsii_.Load("cdk-monitoring-constructs", "0.0.0", tarball)
}
