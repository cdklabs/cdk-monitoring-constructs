const { awscdk } = require('projen');
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'CDK Monitoring Constructs Team',
  authorAddress: 'monitoring-cdk-constructs@amazon.com',
  cdkVersion: '2.1.0',
  defaultReleaseBranch: 'main',
  name: 'cdk-monitoring-constructs',
  repositoryUrl: 'git@github.com:cdklabs/cdk-monitoring-constructs.git',

  // deps: [],                /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
});
project.synth();