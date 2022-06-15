import fs from 'fs/promises';
import path from 'path';
import { execa } from 'execa';
import { generateJestActionsConfig } from '@/helper/ghaConfigs';
import { GitHubActionsConfig } from '@/repositories/gha';

/**
 * Jest の設定や GitHubActions の情報を管轄するクラス
 */
export class Jest {
  private shouldUseTypeScript = false;

  /**
   * jest.config.ts を実行時のカレントディレクトリにコピーする
   * @private
   */
  private static copyJestConfigTs(): Promise<void> {
    // build 後のファイルからの相対パスのため1つ後ろでOK
    const jestConfigTsPath = path.resolve(__dirname, '../jest.config.ts');
    return fs.copyFile(jestConfigTsPath, 'jest.config.ts');
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
      await Jest.copyJestConfigTs();
    } else {
      // jest --init で出来合いの config を生成させる。
      // 今後ちゃんと jest.config.js を書いてコピーさせるのはあり
      await execa('npx', ['jest', '--init']);
    }
  }

  /**
   * GitHubActions の設定を吐き出す
   * @param packageManager npm を使うのか yarn を使うのか
   */
  async generateGitHubActions(packageManager: 'npm' | 'yarn') {
    const config = generateJestActionsConfig(packageManager);
    const { save: saveActionsConfig } = new GitHubActionsConfig(config);
    await saveActionsConfig('test.yaml');
  }
}
