import inquirer from 'inquirer';
import { supportPackageManagers } from '@/repositories/packageInstaller';

interface PromptAnswer {
  packageManager: keyof typeof supportPackageManagers;
}

/**
 * どのパッケージマネージャを使うかを質問する
 * @return npm か yarn のどっちか
 */
export const askWhichPackageManager = async (): Promise<
  keyof typeof supportPackageManagers
> => {
  const { packageManager } = await inquirer.prompt<PromptAnswer>([
    {
      type: 'list',
      name: 'packageManager',
      message: 'Which package manager do you use?',
      choices: [
        {
          name: 'npm',
        },
        {
          name: 'yarn',
        },
        {
          name: 'pnpm',
        },
      ],
    },
  ]);

  return packageManager;
};
