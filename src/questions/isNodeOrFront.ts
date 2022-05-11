import inquirer, { Answers, QuestionCollection } from 'inquirer';

/**
 * node の環境か front の環境で使うかどっちかを質問する
 * @return {Answers} inquirer の Answer class
 */
export const isNodeOrFront = async (): Promise<Answers> => {
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

  return inquirer.prompt(questionInterfaces);
};
