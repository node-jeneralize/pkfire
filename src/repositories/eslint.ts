import { Linter } from 'eslint';
import { stringify } from 'yaml';
import fs from 'fs/promises';
import { isFileExists } from '@/helper/isFileExist';

type RulesRecord = Linter.RulesRecord;
type BaseConfig = Linter.Config;

export class ESLintRcRepository {
  config: BaseConfig = {
    root: true,
    env: {
      es6: true,
      node: true,
    },

    extends: ['eslint:recommended'],
  };

  /**
   * TypeScript まわりの設定を追加する
   */
  enableTypeScriptFeatures() {
    // extends が string だったり undefined だったりするケースも定義上あるので
    // Array であることを確定させている
    if (Array.isArray(this.config.extends)) {
      this.config.extends.push('plugin:@typescript-eslint/recommended');
    }

    this.config.parser = '@typescript-eslint';
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
    const stringifyYaml = stringify(this.config) + '\n';
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
}
