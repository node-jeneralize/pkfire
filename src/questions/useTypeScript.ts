import inquirer from 'inquirer';

interface PromptAnswers {
  shouldUseTypeScriptFeatures: boolean;
  shouldWriteTSConfigJson: boolean;
}

// 質問1つ目で得られる Object の型定義
// name に指定したものがそのままキー名に使われる
type ShouldUseTypeScriptFeatures = Pick<
  PromptAnswers,
  'shouldUseTypeScriptFeatures'
>;

type ShouldWriteTSConfigJson = Pick<PromptAnswers, 'shouldWriteTSConfigJson'>;

/**
 * TypeScript を使用するかどうかを聞く
 * @return TS を使用するか, tsconfig.json を生成するか
 */
export const askUseTypeScript = async (): Promise<PromptAnswers> => {
  // TypeScriptの機能自体を使用するか質問
  const { shouldUseTypeScriptFeatures } =
    await inquirer.prompt<ShouldUseTypeScriptFeatures>([
      {
        type: 'confirm',
        name: 'shouldUseTypeScriptFeatures',
        message: 'Do you use typescript?',
      },
    ]);

  // TS を使用しないのであればすべて false で返却
  if (!shouldUseTypeScriptFeatures) {
    return {
      shouldUseTypeScriptFeatures: false,
      shouldWriteTSConfigJson: false,
    };
  }

  // true だった場合は tsconfig の生成をするか質問
  // Next などはフレームワーク側で tsconfig.json を管理しているので N と答えるよう促す
  const { shouldWriteTSConfigJson } =
    await inquirer.prompt<ShouldWriteTSConfigJson>([
      {
        type: 'confirm',
        name: 'shouldWriteTSConfigJson',
        message:
          'Should generate tsconfig.json? (If you use to Next, Nuxt etc... Answer "N")',
      },
    ]);

  return {
    shouldUseTypeScriptFeatures,
    shouldWriteTSConfigJson,
  };
};
