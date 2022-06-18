import { TSConfig } from 'pkg-types';
import fs from 'fs/promises';
import { isFileExists } from '@/helper/isFileExist';
import { generateTypeCheckActionsConfig } from '@/helper/ghaConfigs';
import { GitHubActionsConfig } from '@/repositories/gha';
import { Toolchain } from '@/repositories/core/toolchain';

/**
 * tsconfig.json にまつわるものを管轄する class
 */
export class TSConfigJson implements Toolchain {
  dependencies = {
    always: 'typescript',
  };

  config: TSConfig = {
    compilerOptions: {
      module: 'commonjs',
      target: 'ES2018',
      sourceMap: true,
      strict: true,
      esModuleInterop: true,
      forceConsistentCasingInFileNames: true,
      rootDir: './',
      baseUrl: './src',
      paths: {
        '@/*': ['./*'],
      },
      types: ['@types/jest', '@types/node'],
    },
    include: ['src/**/*'],
    exclude: ['node_modules'],
  };

  /**
   * コンフィグ情報を tsconfig.json に書き出す
   */
  async save() {
    const stringifyConfigJson = JSON.stringify(this.config, null, 2) + '\n';
    const isTSConfigExist = await isFileExists('tsconfig.json');

    if (!isTSConfigExist) {
      await fs.writeFile('tsconfig.json', stringifyConfigJson, {
        encoding: 'utf8',
      });
    } else {
      throw new Error('tsconfig.json file already exist!');
    }
  }

  /**
   * typeCheck を GitHub Actions で実行するためのコンフィグを出力する
   * @param packageManager 使用するパッケージマネージャ
   */
  async generateGitHubActionsConfig(packageManager: 'npm' | 'yarn') {
    const config = generateTypeCheckActionsConfig(packageManager);
    const { save: saveActionsConfig } = new GitHubActionsConfig(config);
    await saveActionsConfig('typeCheck.yaml');
  }
}
