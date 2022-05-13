import { askUseTypeScript } from '@/questions/useTypeScript';
import { askLinterAndFormatter } from '@/questions/linterAndFormatter';

/**
 * パラメータなどの引数なしで実行したときの挙動を実行する
 */
export const runGeneralCommandJob = async () => {
  const environment = await askUseTypeScript();
  const linterAndFormatter = await askLinterAndFormatter();
  console.log('environment: ', environment);
  console.log('linterAndFormatter', linterAndFormatter);
};
