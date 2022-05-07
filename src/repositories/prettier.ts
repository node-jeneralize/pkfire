import type { Options } from 'prettier';
import fs from 'fs/promises';

/**
 * ファイルの存在を確認する
 * @param filepath 確認対象のファイルパス 実行時の環境の相対パスであることに注意
 * @return 存在すれば true それ以外が false
 */
const isFileExists = async (filepath: string): Promise<boolean> => {
  try {
    return Boolean(await fs.lstat(filepath));
  } catch (_) {
    return false;
  }
};

export class PrettierRcRepository {
  public option: Options = {
    semi: true,
    singleQuote: true,
    tabWidth: 2,
    bracketSpacing: true,
    arrowParens: 'always',
    endOfLine: 'lf',
  };

  async save() {
    const stringifyJson = String(this.option) + '\n';
    try {
      await fs.writeFile('.prettierrc', stringifyJson);
    } catch (_) {
      console.log(_);
    }
  }
}
