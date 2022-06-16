import inquirer, { QuestionCollection, Separator } from 'inquirer';
import { ESLintRc } from '@/repositories/eslint';
import { PrettierRc } from '@/repositories/prettier';
import { Jest } from '@/repositories/jest';

interface PromptAnswer {
  LinterAndFormatter: Array<'eslint' | 'prettier' | 'jest'>;
}

interface ReturnObject {
  ESLint: ESLintRc | undefined;
  Prettier: PrettierRc | undefined;
  Jest: Jest | undefined;
}
/**
 * Linter や Formatter を使うかどうか質問する
 * @return ESLint や Prettier のどれを使うか, 使う場合はインスタンスが内包される
 */
export const askToolchains = async (): Promise<ReturnObject> => {
  const question: QuestionCollection = [
    {
      type: 'checkbox',
      name: 'LinterAndFormatter',
      message: 'What do you want to use?',
      choices: [
        new Separator(' == Code Styles, Linting'),
        {
          name: 'ESLint',
          value: 'eslint',
        },
        {
          name: 'Prettier',
          value: 'prettier',
        },
        new Separator(' == Unit(E2E) Testing'),
        {
          name: 'Jest',
          value: 'jest',
        },
      ],
    },
  ];

  const userResponse = (await inquirer.prompt<PromptAnswer>(question))
    .LinterAndFormatter;

  // ESLint の選択が有効であれば eslintrc の設定クラスを生成
  const eslintrc = userResponse.includes('eslint') ? new ESLintRc() : undefined;

  // Prettier の選択が有効であれば prettierrc の設定クラスを生成
  const prettierrc = userResponse.includes('prettier')
    ? new PrettierRc()
    : undefined;

  // Jest の選択肢が有効であれば jest の設定クラスを生成
  const jest = userResponse.includes('jest') ? new Jest() : undefined;

  return {
    ESLint: eslintrc,
    Prettier: prettierrc,
    Jest: jest,
  };
};
