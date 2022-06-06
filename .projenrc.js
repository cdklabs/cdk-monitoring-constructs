const { awscdk, DependencyType, javascript } = require("projen");
const { workflows } = require("projen/lib/github");

const CDK_VERSION = "1.123.0";
const CONSTRUCTS_VERSION = "3.3.69";

const project = new awscdk.AwsCdkConstructLibrary({
  name: "cdk-monitoring-constructs",
  repositoryUrl: "https://github.com/cdklabs/cdk-monitoring-constructs",
  author: "CDK Monitoring Constructs Team",
  authorAddress: "monitoring-cdk-constructs@amazon.com",
  keywords: ["cloudwatch", "monitoring"],

  defaultReleaseBranch: "main",
  majorVersion: 1,
  releaseBranches: {
    monocdk: {
      majorVersion: 0,
    },
  },
  stability: "experimental",

  cdkVersion: CDK_VERSION,
  cdkVersionPinning: true,

  cdkDependencies: ["monocdk"],

  srcdir: "lib",
  testdir: "test",

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
  depsUpgradeOptions: {
    workflowOptions: {
      schedule: javascript.UpgradeDependenciesSchedule.NEVER,
    },
  },

  pullRequestTemplateContents: [
    `Fixes #

---

_By submitting this pull request, I confirm that my contribution is made under the terms of the Apache-2.0 license_`,
  ],

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

// https://github.com/DefinitelyTyped/DefinitelyTyped/discussions/60310
project.deps.addDependency("@types/prettier@2.6.0", DependencyType.DEVENV);

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

// Don't need to include the TypeScript source files in the tarball; the transpiled JS files and
// typing files are sufficient.
project.addPackageIgnore("*.ts");
project.addPackageIgnore("!*.d.ts");

project.release.addJobs({
  notify_slack: {
    name: "Send Slack notification",
    runsOn: "ubuntu-latest",
    permissions: {
      actions: workflows.JobPermission.READ,
    },
    needs: [
      "release",
      "release_github",
      "release_maven",
      "release_npm",
      "release_nuget",
      "release_pypi",
    ],
    steps: [
      {
        name: "Get release",
        id: "get_release",
        uses: "cardinalby/git-get-release-action@v1",
        env: {
          GITHUB_TOKEN: "${{ github.token }}",
        },
      },
      {
        name: "Send notification",
        uses: "slackapi/slack-github-action@v1.18.0",
        with: {
          payload: `{"html_url": "\${{ steps.get_release.outputs.html_url }}", "tag_name": "\${{ steps.get_release.outputs.tag_name }}"}`,
        },
        env: {
          SLACK_WEBHOOK_URL: "${{ secrets.SLACK_WEBHOOK_URL }}",
        },
      },
    ],
  },
});

project.synth();
