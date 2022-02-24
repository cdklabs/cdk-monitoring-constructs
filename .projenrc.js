const { awscdk, DependencyType } = require("projen");
const CDK_VERSION = "1.123.0";
const CONSTRUCTS_VERSION = "3.3.69";
const project = new awscdk.AwsCdkConstructLibrary({
  author: "CDK Monitoring Constructs Team",
  authorAddress: "monitoring-cdk-constructs@amazon.com",
  cdkVersion: CDK_VERSION,
  cdkVersionPinning: true,
  defaultReleaseBranch: "main",
  name: "cdk-monitoring-constructs",
  repositoryUrl: "git@github.com:cdklabs/cdk-monitoring-constructs.git",
  cdkDependencies: ["monocdk"],
  cdkTestDependencies: ["@monocdk-experiment/assert"],
  prettier: true,
  prettierOptions: {
    arrowParens: "always",
    bracketSpacing: false,
    printWidth: 140,
    semi: true,
    tabWidth: 4,
    trailingComma: "all",
  },
  eslint: true,
  eslintOptions: {
    env: {
      es2021: true,
    },
    extends: [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:prettier/recommended",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
      ecmaVersion: 2018,
      sourceType: "module",
    },
    plugins: ["@typescript-eslint", "unused-imports"],
    rules: {
      "unused-imports/no-unused-imports": "error",
      "no-case-declarations": "off",
      "no-bitwise": "off",
      "no-shadow": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-shadow": "off",
      "@typescript-eslint/member-ordering": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "prettier/prettier": "error",
    },
  },
  srcdir: "lib",
  testdir: "test",
  publishToPypi: {
    distName: "cdk-monitoring-constructs",
    module: "cdk_monitoring_constructs",
  },
});
// these deps are still coming up, removing them manually
project.deps.removeDependency("@aws-cdk/core", DependencyType.PEER);
project.deps.removeDependency("@aws-cdk/core", DependencyType.RUNTIME);
project.deps.removeDependency("@aws-cdk/assert");
project.deps.removeDependency("@aws-cdk/assertions");
project.deps.removeDependency("monocdk", DependencyType.RUNTIME);
project.deps.removeDependency("constructs", DependencyType.RUNTIME);
project.deps.addDependency("monocdk@" + monocdkVersion, DependencyType.DEVENV);
project.deps.addDependency(
  "constructs@" + constructsVersion,
  DependencyType.DEVENV
);
project.deps.addDependency("monocdk@^" + monocdkVersion, DependencyType.PEER);
project.deps.addDependency(
  "constructs@^" + constructsVersion,
  DependencyType.PEER
);
project.synth();
