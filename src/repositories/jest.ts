import fs from 'fs/promises';
import path from 'path';
import { generateJestActionsConfig } from '@/helper/ghaConfigs';
import { GitHubActionsConfig } from '@/repositories/gha';
import { Dependencies, Toolchain } from '@/repositories/core/toolchain';
import { supportPackageManagers } from '@/repositories/packageInstaller';

/**
 * Jest の設定や GitHubActions の情報を管轄するクラス
 */
export class Jest implements Toolchain {
  dependencies: Readonly<Dependencies> = {
    always: 'jest',
    useWithTypeScript: ['@types/jest', 'ts-node', 'ts-jest'],
  };

  private shouldUseTypeScript = false;

  /**
   * jest.config.ts を実行時のカレントディレクトリにコピーする
   * @private
   */
  private static copyJestConfig(shouldUseTS: boolean): Promise<void> {
    if (shouldUseTS) {
      // build 後のファイルからの相対パスのため1つ後ろでOK
      const jestConfigTsPath = path.resolve(__dirname, '../jest.config.ts');
      return fs.copyFile(jestConfigTsPath, 'jest.config.ts');
    } else {
      const jestConfigJsPath = path.resolve(
        __dirname,
        '../jest.config.js.template'
      );
      return fs.copyFile(jestConfigJsPath, 'jest.config.js');
    }
  }

  /**
   * ts-jest を使う場合はこれを実行することで jest.config.ts を生成させる
   */
  enableTypeScript() {
    this.shouldUseTypeScript = true;
  }

  /**
   * 設定ファイルを吐き出す
   */
  async save() {
    if (this.shouldUseTypeScript) {
      await Jest.copyJestConfig(true);
    } else {
      await Jest.copyJestConfig(false);
    }
  }

  /**
   * GitHubActions の設定を吐き出す
   * @param packageManager npm を使うのか yarn を使うのか
   */
  async generateGitHubActions(
    packageManager: keyof typeof supportPackageManagers
  ) {
    const config = generateJestActionsConfig(packageManager);
    const { save: saveActionsConfig } = new GitHubActionsConfig(config);
    await saveActionsConfig('test.yaml');
  }
}
