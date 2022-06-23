import inquirer from 'inquirer';
import { isFileExists } from '@/helper/isFileExist';

interface DetectedFrontendConfig {
  nuxt: boolean;
}

type AskUseNuxtFeaturesResponse = Pick<DetectedFrontendConfig, 'nuxt'>;

/**
 * フロントエンドのコンフィグファイルが存在するかどうかを検査、質問する
 * @returns それぞれのフレームワークのサポートを入れるかどうかを返す
 */
export const detectFrontConfigFile =
  async (): Promise<DetectedFrontendConfig> => {
    const nuxtConfigFileCheckingResults = await Promise.all([
      isFileExists('nuxt.config.js'),
      isFileExists('nuxt.config.ts'),
    ]);

    // コンフィグが存在しなければ全部 false で返す
    if (!nuxtConfigFileCheckingResults.includes(true)) {
      return {
        nuxt: false,
      };
    }

    // Nuxt のツールサポートを使うかどうか質問
    const { nuxt } = await inquirer.prompt<AskUseNuxtFeaturesResponse>([
      {
        type: 'confirm',
        name: 'nuxt',
        message:
          'Detected Nuxt.js configuration file. Do you use toolchains support for it?',
      },
    ]);

    return {
      nuxt,
    };
  };
