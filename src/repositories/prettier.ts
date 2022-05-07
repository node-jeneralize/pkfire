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
    const stringifyOptions = String(this.option) + '\n';
    const isPrettierRcExist = await isFileExists('./prettierrc');

    // ファイルが存在しなければ writeFile で生成
    if (!isPrettierRcExist) {
      await fs.writeFile('.prettierrc', stringifyOptions);
    } else {
      // TODO: prompt で上書きしていいか確認
      // 上書きしてOKなら writeFile で書き込み
      throw new Error('.prettierrc file exist!');
    }
  }
}
