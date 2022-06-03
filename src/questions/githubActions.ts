import inquirer, { QuestionCollection } from 'inquirer';

/**
 * GitHub Actions を使うかどうか質問する
 * @return 使うならtrue
 */
export const askUsingGitHubActions = async (): Promise<boolean> => {
  const question: QuestionCollection = [
    {
      type: 'confirm',
      name: 'useGHA',
      message: 'Do you use GitHub Actions?',
    },
  ];

  const { useGHA } = await inquirer.prompt<{ useGHA: boolean }>(question);
  return useGHA;
};
