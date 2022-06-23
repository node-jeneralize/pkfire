import { ResolvedPromiseType } from 'pkfire';
import { detectFrontConfigFile } from '@/questions/detectFrontConfigFile';

/**
 * 引数のオブジェクトの値に一つでも true の値が入っているかどうかを返す
 * @param param 原則としてはフロントエンド環境のチェックをする関数の返り値を入力として期待
 * @returns true が入っていれば true を返す
 */
export const checkObjectContainTrue = (
  param: ResolvedPromiseType<ReturnType<typeof detectFrontConfigFile>>
): boolean => {
  return Object.values(param).some((value) => value === true);
};
