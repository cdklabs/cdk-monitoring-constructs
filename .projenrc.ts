import * as cdklabs from "cdklabs-projen-project-types";
import { DependencyType, github, javascript, ReleasableCommits } from "projen";

const CDK_VERSION = "2.160.0";

const project = new cdklabs.CdklabsConstructLibrary({
  name: "cdk-monitoring-constructs",
  private: false,
  projenrcTs: true,
  repositoryUrl: "https://github.com/cdklabs/cdk-monitoring-constructs",
  author: "CDK Monitoring Constructs Team",
  authorAddress: "monitoring-cdk-constructs@amazon.com",
  keywords: ["cloudwatch", "monitoring"],

  defaultReleaseBranch: "main",
  majorVersion: 9,
  stability: "experimental",
  setNodeEngineVersion: false,

  cdkVersion: CDK_VERSION,
  jsiiVersion: "5.9",

  srcdir: "lib",
  testdir: "test",

  // To reduce the noisy release frequency we only release features and fixes
  releasableCommits: ReleasableCommits.featuresAndFixes(),

  // Don't release for go, see below
  jsiiTargetLanguages: [
    cdklabs.JsiiLanguage.PYTHON,
    cdklabs.JsiiLanguage.DOTNET,
    cdklabs.JsiiLanguage.JAVA,
  ],

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
    mavenServerId: "central-ossrh",
  },
  // TODO: https://github.com/cdklabs/cdk-monitoring-constructs/issues/21
  // Artifact config: Go
  // publishToGo: {
  //   moduleName: "github.com/cdklabs/cdk-monitoring-constructs",
  // },

  // Auto approval config
  enablePRAutoMerge: true,
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

  jestOptions: {
    jestConfig: {
      setupFilesAfterEnv: ["./test/setup/setup.ts"],
    },
  },

  // Code linting config
  prettier: true,
  prettierOptions: {
    settings: {
      trailingComma: javascript.TrailingComma.ALL,
    },
  },

  // Documentation options
  rosettaOptions: {
    strict: false, // @todo disabled since there were many failures for me to fix
  },
});

// Experimental modules
["@aws-cdk/aws-redshift-alpha"].forEach((dep) => {
  project.deps.addDependency(
    `${dep}@${CDK_VERSION}-alpha.0`,
    DependencyType.DEVENV,
  );
});

// newer types don't work with our ts and jsii version
project.addDevDeps("@types/node@^16 <= 16.18.78");
project.package.addField("resolutions", {
  "@types/babel__traverse": "7.18.2",
});

// Add some other eslint rules followed across this project
project.eslint?.addRules({
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

project.release?.addJobs({
  notify_slack: {
    name: "Send Slack notification",
    runsOn: ["ubuntu-latest"],
    permissions: {
      actions: github.workflows.JobPermission.READ,
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
        uses: "slackapi/slack-github-action@v1.27.0",
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
