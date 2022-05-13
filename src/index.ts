import { cac } from 'cac';
import { subscribeCommands } from '@/commands';

const main = async () => {
  const cli = subscribeCommands(cac('project_kicker'));

  cli.parse();
  cli.help();
};

main();
