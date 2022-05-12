import inquirer, { QuestionCollection } from 'inquirer';

interface PromptAnswer {
  environment: 'node' | 'front';
}

/**
 * node の環境か front の環境で使うかどっちかを質問する
 * @return 'node' か 'front'
 */
export const isNodeOrFront = async (): Promise<'node' | 'front'> => {
  const questionInterfaces: QuestionCollection = [
    {
      type: 'list',
      name: 'environment',
      message: 'Which environment do you use it?',
      choices: [
        {
          name: 'node',
          value: 'node',
        },
        {
          name: 'front',
          value: 'front',
        },
      ],
    },
  ];
  const answer = await inquirer.prompt<PromptAnswer>(questionInterfaces);
  return answer.environment;
};
