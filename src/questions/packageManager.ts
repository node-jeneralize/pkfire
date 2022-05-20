import inquirer from 'inquirer';

interface PromptAnswer {
  packageManager: 'npm' | 'yarn';
}

/**
 * どのパッケージマネージャを使うかを質問する
 * @return npm か yarn のどっちか
 */
export const askWhichPackageManager = async (): Promise<'npm' | 'yarn'> => {
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
      ],
    },
  ]);

  return packageManager;
};
