import inquirer, { QuestionCollection } from 'inquirer';
import { Dependabot } from '@/repositories/dependabot';

interface UserResponse {
  usingCITools: Array<'GitHubActions' | 'dependabot'>;
}

interface ReturnObject {
  GitHubActions: boolean;
  dependabot: Dependabot | undefined;
}

const dependabotConfig: ConstructorParameters<typeof Dependabot>[0] = {
  version: 2,
  updates: {
    'package-ecosystem': 'npm',
    directory: '/',
    schedule: {
      interval: 'weekly',
    },
  },
};

/**
 * CITools でどれを使うかを質問する
 * @returns GitHubActions は boolean, dependabot はインスタンスを返す
 */
export const askUsingCITools = async (): Promise<ReturnObject> => {
  const question: QuestionCollection = [
    {
      type: 'list',
      name: 'usingCITools',
      message: 'What do you want to use CI tools?',
      choices: [
        {
          name: 'GitHubActions',
          value: 'GitHubActions',
        },
        {
          name: 'dependabot',
          value: 'dependabot',
        },
      ],
    },
  ];

  const userResponse = (await inquirer.prompt<UserResponse>(question))
    .usingCITools;

  return {
    GitHubActions: userResponse.includes('GitHubActions'),
    dependabot: userResponse.includes('dependabot')
      ? new Dependabot(dependabotConfig)
      : undefined,
  };
};
