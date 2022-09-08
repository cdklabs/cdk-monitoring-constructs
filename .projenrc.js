const { awscdk, javascript, DependencyType } = require("projen");
const { workflows } = require("projen/lib/github");

const CDK_VERSION = "2.18.0";

const project = new awscdk.AwsCdkConstructLibrary({
  name: "cdk-monitoring-constructs",
  repositoryUrl: "https://github.com/cdklabs/cdk-monitoring-constructs",
  author: "CDK Monitoring Constructs Team",
  authorAddress: "monitoring-cdk-constructs@amazon.com",
  keywords: ["cloudwatch", "monitoring"],

  defaultReleaseBranch: "main",
  majorVersion: 1,
  stability: "experimental",

  cdkVersion: CDK_VERSION,

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
  // TODO: https://github.com/cdklabs/cdk-monitoring-constructs/issues/21
  // Artifact config: Go
  // publishToGo: {
  //   moduleName: "github.com/cdklabs/cdk-monitoring-constructs",
  // },

  // Auto approval config
  autoApproveOptions: {
    allowedUsernames: ["cdklabs-automation"],
    secret: "GITHUB_TOKEN",
  },
  autoApproveUpgrades: true,
  depsUpgradeOptions: {
    workflowOptions: {
      schedule: javascript.UpgradeDependenciesSchedule.expressions([
        "0 0 * * 1",
      ]),
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

// Experimental modules
[
  "@aws-cdk/aws-apigatewayv2-alpha",
  "@aws-cdk/aws-redshift-alpha",
  "@aws-cdk/aws-synthetics-alpha",
].forEach((dep) => {
  project.deps.addDependency(
    `${dep}@^${CDK_VERSION}-alpha.0`,
    DependencyType.PEER
  );
  project.deps.addDependency(
    `${dep}@${CDK_VERSION}-alpha.0`,
    DependencyType.DEVENV
  );
});
["@aws-cdk/aws-appsync-alpha"].forEach((dep) => {
  project.deps.addDependency(
    `${dep}@${CDK_VERSION}-alpha.0`,
    DependencyType.DEVENV
  );
});
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
      // TODO: https://github.com/cdklabs/cdk-monitoring-constructs/issues/21
      // "release_golang",
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
