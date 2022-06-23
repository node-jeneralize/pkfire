import inquirer from 'inquirer';

interface PromptAnswers {
  shouldUseTypeScriptFeatures: boolean;
  shouldWriteTSConfigJson: boolean;
  shouldInstallTypeScript: boolean;
}

// 質問1つ目で得られる Object の型定義
// name に指定したものがそのままキー名に使われる
type ShouldUseTypeScriptFeatures = Pick<
  PromptAnswers,
  'shouldUseTypeScriptFeatures'
>;

type ShouldWriteTSConfigJson = Pick<PromptAnswers, 'shouldWriteTSConfigJson'>;

type ShouldInstallPackage = Pick<PromptAnswers, 'shouldInstallTypeScript'>;

interface PromptOptions {
  skipGenerate: boolean;
  skipInstall: boolean;
}

/**
 * TypeScript を使用するかどうかを聞く
 * @return TS を使用するか, tsconfig.json を生成するか
 */
export const askUseTypeScript = async (
  options?: PromptOptions
): Promise<PromptAnswers> => {
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
      shouldInstallTypeScript: false,
    };
  }

  // true だった場合は tsconfig の生成をするか質問
  // Next などはフレームワーク側で tsconfig.json を管理しているので N と答えるよう促す
  // また、スキップオプションが有効な場合は false を入れる
  const { shouldWriteTSConfigJson } = (options ?? { skipGenerate: false })
    .skipGenerate
    ? { shouldWriteTSConfigJson: false }
    : await inquirer.prompt<ShouldWriteTSConfigJson>([
        {
          type: 'confirm',
          name: 'shouldWriteTSConfigJson',
          message:
            'Should generate tsconfig.json? (If you use to Next, Nuxt etc... Answer "N")',
        },
      ]);

  // typescript のパッケージをインストールするかどうか質問
  // スキップオプションが有効な場合は false を入れる
  const { shouldInstallTypeScript } = (options ?? { skipInstall: false })
    .skipInstall
    ? { shouldInstallTypeScript: false }
    : await inquirer.prompt<ShouldInstallPackage>([
        {
          type: 'confirm',
          name: 'shouldInstallTypeScript',
          message: 'Should install Typescript package?',
        },
      ]);

  return {
    shouldUseTypeScriptFeatures,
    shouldWriteTSConfigJson,
    shouldInstallTypeScript,
  };
};
