import { cac } from 'cac';
import { subscribeCommands } from '@/commands';

const main = async () => {
  const cli = subscribeCommands(cac('pkfire'));

  cli.parse();
  cli.help();
};

main();
