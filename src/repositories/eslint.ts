import { Linter } from 'eslint';
import { stringify } from 'yaml';
import fs from 'fs/promises';
import { isFileExists } from '@/helper/isFileExist';
import { generateESLintActionsConfig } from '@/helper/ghaConfigs';
import { GitHubActionsConfig } from '@/repositories/gha';

type RulesRecord = Linter.RulesRecord;
type BaseConfig = Linter.Config;

export class ESLintRc {
  config: BaseConfig = {
    root: true,
    env: {
      es6: true,
      node: true,
    },

    extends: ['eslint:recommended'],
  };

  // Prettier の設定をファイル出力する手前で後付けするために
  // bool の値を内部で持たせて情報を持っておく
  private isEnablePrettierFeature = false;

  /**
   * `prettier` を extends の末尾に入れる
   * @private 最後に書き出すための省略用メソッド
   */
  private addPrettierToExtends() {
    if (Array.isArray(this.config.extends)) {
      this.config.extends.push('prettier');
    }
  }

  /**
   * TypeScript まわりの設定を追加する
   */
  enableTypeScriptFeatures() {
    // extends が string だったり undefined だったりするケースも定義上あるので
    // Array であることを確定させている
    if (Array.isArray(this.config.extends)) {
      this.config.extends.push('plugin:@typescript-eslint/recommended');
    }

    // すでに どこかしらのメソッド定義で plugins が Array になってる場合はただ追加するだけ
    if (Array.isArray(this.config.plugins)) {
      this.config.plugins.push('@typescript-eslint');
    } else {
      // まだArrayとして定義されていない場合は Array をそのまま代入してやる
      this.config.plugins = ['@typescript-eslint'];
    }

    this.config.parser = '@typescript-eslint/parser';
  }

  /**
   * Prettier の設定を有効化する
   */
  enablePrettierFeature() {
    this.isEnablePrettierFeature = true;
  }

  /**
   * rules に渡したルールをコンフィグに追加する
   * @param rules ルールのオブジェクト単体, もしくは複数追加の場合 Array
   */
  addRules(rules: RulesRecord | RulesRecord[]) {
    if (!Array.isArray(rules)) {
      this.config.rules = {
        ...this.config.rules,
        ...rules,
      };
    } else {
      // Array で受けるパターン
      rules.forEach((rule) => {
        this.config.rules = {
          ...this.config.rules,
          ...rule,
        };
      });
    }
  }

  /**
   * コンフィグ情報を .eslintrc.yaml に書き出す
   */
  async save() {
    // Prettier の設定が最後に設定に適用される
    if (this.isEnablePrettierFeature) {
      this.addPrettierToExtends();
    }

    const stringifyYaml = stringify(this.config);
    // 設定ファイルの存在を確認
    const isESLintRcExistChecks = await Promise.all([
      isFileExists('.eslintrc'),
      isFileExists('.eslintrc.json'),
      isFileExists('.eslintrc.js'),
      isFileExists('.eslintrc.yaml'),
      isFileExists('.eslintrc.yml'),
    ]);

    if (!isESLintRcExistChecks.includes(true)) {
      await fs.writeFile('.eslintrc.yaml', stringifyYaml, { encoding: 'utf8' });
    } else {
      // TODO: prompt で上書きしていいか確認
      // 上書きしてOKなら writeFile で書き込み
      throw new Error('.eslintrc file already exist!');
    }
  }

  /**
   * ESLint の GitHub Actions の設定を生成する
   * @param packageManager 使用するパッケージマネージャ
   */
  async generateGitHubActions(packageManager: 'npm' | 'yarn') {
    const config = generateESLintActionsConfig(packageManager);
    const { save: saveActionsConfig } = new GitHubActionsConfig(config);
    await saveActionsConfig('lint.yaml');
  }
}
