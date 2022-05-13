import { CAC } from 'cac';
import { runGeneralCommandJob } from '@/commands/general';

/**
 * CAC のインスタンスに対してコマンド、及び実行内容を登録する
 * @param cli 生の CAC インスタンス
 * @return コマンドを登録した CAC インスタンス
 */
export const subscribeCommands = (cli: CAC): CAC => {
  cli
    .command('', 'generate node toolChain files, install modules')
    .action(async () => {
      await runGeneralCommandJob();
    });
  return cli;
};
