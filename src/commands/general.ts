import { askUseTypeScript } from '@/questions/useTypeScript';
import { askLinterAndFormatter } from '@/questions/linterAndFormatter';
import { askWhichPackageManager } from '@/questions/packageManager';

/**
 * パラメータなどの引数なしで実行したときの挙動を実行する
 */
export const runGeneralCommandJob = async () => {
  const packageManager = await askWhichPackageManager();
  const environment = await askUseTypeScript();
  const linterAndFormatter = await askLinterAndFormatter();
};
