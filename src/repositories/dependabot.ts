import { stringify } from 'yaml';
import mkdirp from 'mkdirp';
import fs from 'fs/promises';
import { isFileExists } from '@/helper/isFileExist';

interface Update {
  'package-ecosystem': 'npm';
  directory: string;
  schedule: {
    interval: 'daily' | 'weekly' | 'monthly';
  };
}

interface DependabotConfig {
  version: number;
  updates: Update[];
}

/**
 * dependabot.yaml の情報を管轄する
 * @see https://docs.github.com/ja/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file
 */
export class Dependabot {
  config: DependabotConfig;

  constructor(config: DependabotConfig) {
    this.config = config;
  }

  /**
   * 設定ファイルの保存をする
   * @param fileName ファイル名 基本は `dependabot.yml` を入れる
   */
  async save(fileName: 'dependabot.yml' | string) {
    const stringifyYaml = stringify(this.config, { singleQuote: true });

    await mkdirp('.github');

    if (!(await isFileExists(`.github/${fileName}`))) {
      await fs.writeFile(`.github/${fileName}`, stringifyYaml);
    } else {
      // TODO: prompt で上書きしていいか確認
      // 上書きしてOKなら writeFile で書き込み
      throw new Error(`.github/${fileName} already exists!`);
    }
  }
}
