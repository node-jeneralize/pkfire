import { cac } from 'cac';
import { askUseTypeScript } from '@/questions/useTypeScript';
import { askLinterAndFormatter } from '@/questions/linterAndFormatter';

const main = async () => {
  const cli = cac('project_kicker');

  cli
    .command('', 'generate node toolChain files, install modules')
    .action(async () => {
      const environment = await askUseTypeScript();
      const linterAndFormatter = await askLinterAndFormatter();
      console.log('environment: ', environment);
      console.log('linterAndFormatter', linterAndFormatter);
    });

  cli.parse();
  cli.help();
};

main();
