import inquirer, { QuestionCollection } from 'inquirer';
import { ESLintRcRepository } from '@/repositories/eslint';
import { PrettierRcRepository } from '@/repositories/prettier';

interface PromptAnswer {
  LinterAndFormatter: Array<'eslint' | 'prettier'>;
}

interface ReturnObject {
  ESLint: ESLintRcRepository | undefined;
  Prettier: PrettierRcRepository | undefined;
}
/**
 * Linter や Formatter を使うかどうか質問する
 * @return ESLint や Prettier のどれを使うか, 使う場合はインスタンスが内包される
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

  const userResponse = (await inquirer.prompt<PromptAnswer>(question))
    .LinterAndFormatter;

  // ESLint の選択が有効であれば eslintrc の設定クラスを生成
  const eslintrc = userResponse.includes('eslint')
    ? new ESLintRcRepository()
    : undefined;

  // Prettier の選択が有効であれば prettierrc の設定クラスを生成
  const prettierrc = userResponse.includes('prettier')
    ? new PrettierRcRepository()
    : undefined;

  return {
    ESLint: eslintrc,
    Prettier: prettierrc,
  };
};
