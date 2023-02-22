import inquirer from 'inquirer';
import { isFileExists } from '@/helper/isFileExist';

interface DetectedFrontendConfig {
  nuxt: boolean;
  next: boolean;
}

type AskUseResponse<K extends keyof DetectedFrontendConfig> = Pick<
  DetectedFrontendConfig,
  K
>;

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

    const nextConfigFileCheckingResults = await isFileExists('next.config.js');

    const isUses = {
      nuxt: nuxtConfigFileCheckingResults.includes(true),
      next: nextConfigFileCheckingResults,
    };

    if (isUses.nuxt) {
      // Nuxt のツールサポートを使うかどうか質問
      const { nuxt } = await inquirer.prompt<AskUseResponse<'nuxt'>>([
        {
          type: 'confirm',
          name: 'nuxt',
          message:
            'Detected Nuxt.js configuration file. Do you use toolchains support for it?',
        },
      ]);

      return {
        nuxt,
        next: false,
      };
    }

    if (isUses.next) {
      // Next のツールサポートを使うかどうか質問
      const { next } = await inquirer.prompt<AskUseResponse<'next'>>([
        {
          type: 'confirm',
          name: 'next',
          message:
            'Detected Next.js configuration file. Do you use toolchains support for it?',
        },
      ]);

      return {
        nuxt: false,
        next,
      };
    }

    // コンフィグが存在しなければ全部 false で返す
    return {
      nuxt: false,
      next: false,
    };
  };
