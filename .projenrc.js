const { awscdk } = require('projen');
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'CDK Monitoring Constructs Team',
  authorAddress: 'monitoring-cdk-constructs@amazon.com',
  cdkVersion: '1.123.0',
  defaultReleaseBranch: 'main',
  name: 'cdk-monitoring-constructs',
  repositoryUrl: 'git@github.com:cdklabs/cdk-monitoring-constructs.git',
  cdkDependencies: ['monocdk'],
  cdkTestDependencies: ['@monocdk-experiment/assert'],
  eslint: true,
  eslintOptions: {
    env: {
      es2021: true,
    },
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 2018,
      sourceType: 'module',
    },
    plugins: ['@typescript-eslint', 'unused-imports'],
    rules: {
      'unused-imports/no-unused-imports': 'error',
      'no-case-declarations': 'off',
      'no-bitwise': 'off',
      'no-shadow': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-shadow': 'off',
      '@typescript-eslint/member-ordering': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'prettier/prettier': [
        'error',
        {
          arrowParens: 'always',
          bracketSpacing: false,
          printWidth: 140,
          semi: true,
          tabWidth: 4,
          trailingComma: 'all',
        },
      ],
    },
  },
  srcdir: 'lib',
  testdir: 'test',
  publishToPypi: {
    distName: 'cdk-monitoring-constructs',
    module: 'cdk_monitoring_constructs',
  },
});
project.synth();