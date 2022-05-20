import type { Options } from 'prettier';
import fs from 'fs/promises';
import { isFileExists } from '@/helper/isFileExist';

/**
 * .prettierrc にまつわるものを管理する class
 */
export class PrettierRc {
  public option: Options = {
    semi: true,
    singleQuote: true,
    tabWidth: 2,
    bracketSpacing: true,
    arrowParens: 'always',
    endOfLine: 'lf',
  };

  /**
   * コンフィグ情報を .prettierrc に書き出す
   */
  async save() {
    // 第3引数が pretty にする設定, 2 を渡すとスペース2つで見やすくなる
    const stringifyOptions = JSON.stringify(this.option, null, 2) + '\n';
    const isPrettierRcExist = await isFileExists('.prettierrc');

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
