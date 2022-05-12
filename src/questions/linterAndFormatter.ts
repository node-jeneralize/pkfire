import inquirer, { QuestionCollection } from 'inquirer';

interface PromptAnswer {
  LinterAndFormatter: Array<'eslint' | 'prettier'>;
}

interface ReturnObject {
  ESLint: boolean;
  Prettier: boolean;
}
/**
 * Linter や Formatter を使うかどうか質問する
 * @return ESLint や Prettier のどれを使うか
 */
export const askLinterAndFormatter = async (): Promise<ReturnObject> => {
  const question: QuestionCollection = [
    {
      type: 'checkbox',
      name: 'LinterAndFormatter',
      message: 'What do you want to use?',
      choices: [
        {
          name: 'ESLint',
          value: 'eslint',
        },
        {
          name: 'Prettier',
          value: 'prettier',
        },
      ],
    },
  ];

  const res = (await inquirer.prompt<PromptAnswer>(question))
    .LinterAndFormatter;

  return {
    ESLint: res.includes('eslint'),
    Prettier: res.includes('prettier'),
  };
};
