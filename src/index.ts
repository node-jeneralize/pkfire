import { cac } from 'cac';
import { askNodeOrFront } from '@/questions/isNodeOrFront';
import { askLinterAndFormatter } from '@/questions/linterAndFormatter';

const main = async () => {
  const cli = cac('project_kicker');

  cli
    .command('', 'generate node toolChain files, install modules')
    .action(async () => {
      const environment = await askNodeOrFront();
      const linterAndFormatter = await askLinterAndFormatter();
      console.log('environment: ', environment);
      console.log('linterAndFormatter', linterAndFormatter);
    });

  cli.parse();
  cli.help();
};

main();
