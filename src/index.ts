import { cac } from 'cac';
import { isNodeOrFront } from '@/questions/isNodeOrFront';

const main = async () => {
  const cli = cac('project_kicker');

  cli
    .command('', 'generate node toolChain files, install modules')
    .action(async () => {
      console.log(await isNodeOrFront());
    });

  cli.parse();
  cli.help();
};

main();
