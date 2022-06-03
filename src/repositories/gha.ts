import { stringify } from 'yaml';
import fs from 'fs/promises';
import { isFileExists } from '@/helper/isFileExist';
import mkdirp from 'mkdirp';

interface Step {
  uses?: string;
  name?: string;
  run?: string;
  with?: {
    [key: string]: string;
  };
}

interface Trigger {
  pull_request?: {
    paths: string[];
  };

  push?: {
    branches: string[];
    paths: string[];
  };
}

interface Jobs {
  [key: string]: {
    name: string;
    'runs-on': string;
    steps: Step[];
  };
}

export interface GHAConfigDetails {
  name: string;
  on: Trigger;
  jobs: Jobs;
}

export class GitHubActionsConfig {
  config: GHAConfigDetails = {
    name: '',
    on: {},
    jobs: {},
  };

  constructor(config: GHAConfigDetails) {
    // save() の中で `this.config` が undefined と言われるので明示拘束
    this.save = this.save.bind(this);
    this.config = config;
  }

 /**
   * GitHub Actions の設定を `.github/workflows` の下に保存する
   */
   async save(fileName: string) {
    const stringifyYaml = stringify(this.config, { singleQuote: true });

    await mkdirp('.github/workflows');

    // ファイルがなければ writeFile で生成
    if (!(await isFileExists(`.github/workflows/${fileName}`))) {
      await fs.writeFile(`.github/workflows/${fileName}`, stringifyYaml);
    } else {
      // TODO: prompt で上書きしていいか確認
      // 上書きしてOKなら writeFile で書き込み
      throw new Error(`.github/workflows/${fileName} already exists!`);
    }
  }
}
