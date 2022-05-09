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

    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
    parser: '@typescript-eslint',
  };

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
