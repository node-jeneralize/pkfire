import fs from 'fs/promises';

/**
 * ファイルの存在を確認する
 * @param filepath 確認対象のファイルパス 実行時の環境の相対パスであることに注意
 * @return 存在すれば true それ以外が false
 */
export const isFileExists = async (filepath: string): Promise<boolean> => {
  try {
    return Boolean(await fs.lstat(filepath));
  } catch (_) {
    return false;
  }
};
