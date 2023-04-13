import { GHAConfigDetails } from '@/repositories/gha';
import { supportPackageManagers } from '@/repositories/packageInstaller';

type PackageManager = keyof typeof supportPackageManagers;

/**
 * モジュールのインストールコマンドを出力する
 * @param usePackageManager 使うパッケージマネージャ
 */
const generateModuleInstallCommand = (
  usePackageManager: PackageManager
): string => {
  const staticInstallCommands: Record<PackageManager, string> = {
    npm: 'npm ci',
    yarn: 'yarn --frozen-lockfile',
    pnpm: 'pnpm i --frozen-lockfile',
  };

  return staticInstallCommands[usePackageManager];
};

/**
 * scripts の実行コマンドを出力する
 * @param usePackageManager 使うパッケージマネージャ
 * @param target 動かすスクリプト
 */
const generateScriptRunnerCommand = (
  usePackageManager: PackageManager,
  target: string
): string => {
  const runningCommands: Record<PackageManager, string> = {
    npm: `npm run ${target}`,
    yarn: `yarn ${target}`,
    pnpm: `pnpm run ${target}`,
  };

  return runningCommands[usePackageManager];
};

/**
 * ESLint を GitHub Actions で動かす用途のコンフィグ情報を吐き出す
 * @param usePackageManager 使うパッケージマネージャ
 */
export const generateESLintActionsConfig = (
  usePackageManager: PackageManager
): GHAConfigDetails => ({
  name: 'lint',
  on: {
    pull_request: {
      paths: ['src/**/*'],
    },
  },
  jobs: {
    lint: {
      name: 'lint',
      'runs-on': 'ubuntu-latest',
      steps: [
        {
          uses: 'actions/checkout@v1',
        },
        {
          name: 'using node 16.13.0',
          uses: 'actions/setup-node@v2',
          with: {
            'node-version': process.versions.node,
          },
        },
        {
          name: 'module install',
          run: generateModuleInstallCommand(usePackageManager),
        },
        {
          name: 'lint check',
          uses: 'reviewdog/action-eslint@v1',
          with: {
            repoter: 'github-pr-review',
            'eslint-flags': '--ext .js,.ts src',
          },
        },
      ],
    },
  },
});

/**
 * Jest を GitHub Actions で動かす用途のコンフィグ情報を吐き出す
 * @param usePackageManager 使うパッケージマネージャ
 */
export const generateJestActionsConfig = (
  usePackageManager: PackageManager
): GHAConfigDetails => ({
  name: 'test',
  on: {
    pull_request: {
      paths: ['src/**/*'],
    },
  },
  jobs: {
    test: {
      name: 'test',
      'runs-on': 'ubuntu-latest',
      steps: [
        {
          uses: 'actions/checkout@v1',
        },
        {
          name: 'using node',
          uses: 'actions/setup-node@v2',
          with: {
            'node-version': process.versions.node,
          },
        },
        {
          name: 'module install',
          run: generateModuleInstallCommand(usePackageManager),
        },
        {
          name: 'running test',
          run: usePackageManager === 'npm' ? 'npm run test' : 'yarn test',
        },
      ],
    },
  },
});

/**
 * typeCheck を GitHub Actions で動かす用途のコンフィグ情報を吐き出す
 * @param usePackageManager 使うパッケージマネージャ
 */
export const generateTypeCheckActionsConfig = (
  usePackageManager: PackageManager
): GHAConfigDetails => ({
  name: 'typeCheck',
  on: {
    pull_request: {
      paths: ['src/**/*'],
    },
  },
  jobs: {
    typeCheck: {
      name: 'typeCheck',
      'runs-on': 'ubuntu-latest',
      steps: [
        {
          uses: 'actions/checkout@v1',
        },
        {
          name: 'using node',
          uses: 'actions/setup-node@v2',
          with: {
            'node-version': process.versions.node,
          },
        },
        {
          name: 'module install',
          run: generateModuleInstallCommand(usePackageManager),
        },
        {
          name: 'run typeChecking',
          run: generateScriptRunnerCommand(usePackageManager, 'typeCheck'),
        },
      ],
    },
  },
});
