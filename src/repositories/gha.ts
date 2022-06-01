import { stringify } from 'yaml';
import fs from 'fs/promises';
import { isFileExists } from '@/helper/isFileExist';

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

  async save(fileName: string) {
    const stringifyYaml = stringify(this.config, { singleQuote: true });

    // ファイルがなければ writeFile で生成
    if (!(await isFileExists(fileName))) {
      await fs.writeFile(fileName, stringifyYaml);
    } else {
      // TODO: prompt で上書きしていいか確認
      // 上書きしてOKなら writeFile で書き込み
      throw new Error(`${fileName} already exists!`);
    }
  }
}
