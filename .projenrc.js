const { awscdk, DependencyType } = require("projen");

const CDK_VERSION = "1.123.0";
const CONSTRUCTS_VERSION = "3.3.69";

const project = new awscdk.AwsCdkConstructLibrary({
  name: "cdk-monitoring-constructs",
  repositoryUrl: "https://github.com/cdklabs/cdk-monitoring-constructs",
  author: "CDK Monitoring Constructs Team",
  authorAddress: "monitoring-cdk-constructs@amazon.com",
  defaultReleaseBranch: "main",

  cdkVersion: CDK_VERSION,
  cdkVersionPinning: true,

  cdkDependencies: ["monocdk"],
  cdkTestDependencies: ["@monocdk-experiment/assert"],

  srcdir: "lib",
  testdir: "test",

  // Non-standard includes/excludes
  tsconfig: {
    include: ["assets/**/*.ts"],
    exclude: ["dist/**/*.ts"],
  },

  // Artifact config: Python
  publishToPypi: {
    distName: "cdk-monitoring-constructs",
    module: "cdk_monitoring_constructs",
  },
  // Artifact config: C#
  publishToNuget: {
    packageId: "Cdklabs.CdkMonitoringConstructs",
    dotNetNamespace: "Cdklabs.CdkMonitoringConstructs",
  },
  // Artifact config: Java
  publishToMaven: {
    mavenGroupId: "io.github.cdklabs",
    javaPackage: "io.github.cdklabs.cdkmonitoringconstructs",
    mavenArtifactId: "cdkmonitoringconstructs",
    mavenEndpoint: "https://s01.oss.sonatype.org",
  },

  // Auto approval config
  autoApproveOptions: {
    allowedUsernames: ["cdklabs-automation"],
    secret: "GITHUB_TOKEN",
  },
  autoApproveUpgrades: true,

  // Code linting config
  prettier: true,
  prettierOptions: {
    arrowParens: "always",
    bracketSpacing: false,
    printWidth: 140,
    semi: true,
    tabWidth: 4,
    trailingComma: "all",
  },
});

// Projen doesn't handle monocdk properly; remove @aws-cdk manually
project.deps.removeDependency("@aws-cdk/core", DependencyType.PEER);
project.deps.removeDependency("@aws-cdk/core", DependencyType.RUNTIME);
project.deps.removeDependency("@aws-cdk/assert");
project.deps.removeDependency("@aws-cdk/assertions");

// Declare monocdk and constructs as peer dependencies
project.deps.removeDependency("monocdk", DependencyType.RUNTIME);
project.deps.removeDependency("constructs", DependencyType.RUNTIME);
project.deps.addDependency(`monocdk@^${CDK_VERSION}`, DependencyType.PEER);
project.deps.addDependency(
  `constructs@^${CONSTRUCTS_VERSION}`,
  DependencyType.PEER
);

// Pin to lowest version in dev dependencies to ensure compatability
project.deps.addDependency(`monocdk@${CDK_VERSION}`, DependencyType.DEVENV);
project.deps.addDependency(
  `constructs@${CONSTRUCTS_VERSION}`,
  DependencyType.DEVENV
);

// Add some other eslint rules followed across this project
project.eslint.addRules({
  "no-case-declarations": "off",
  "no-bitwise": "off",
  "no-shadow": "off",
  "@typescript-eslint/no-explicit-any": "off",
  "@typescript-eslint/no-shadow": "off",
  "@typescript-eslint/member-ordering": "off",
  "@typescript-eslint/explicit-module-boundary-types": "off",
  "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
  "prettier/prettier": "error",
});

project.synth();
