import { Aspects, CfnResource, Stack } from "aws-cdk-lib";
import { IConstruct } from "constructs";

/**
 * Overwrite potentially unstable properties for unit testing purposes.
 *
 * @param stack stack to replace properties
 */
export function forceStableAssetKeys(stack: Stack) {
  Aspects.of(stack).add({
    visit({ node }: IConstruct) {
      if (node.defaultChild && CfnResource.isCfnResource(node.defaultChild)) {
        switch (node.defaultChild.cfnResourceType) {
          case "AWS::Lambda::Function":
            node.defaultChild.addPropertyOverride(
              "Code.S3Key",
              "Fixed key that does not depend on asset changes",
            );
            break;
        }
      }
    },
  });
}
