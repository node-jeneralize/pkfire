import { isFileExists } from '@/helper/isFileExist';

interface DetectedFrontendConfig {
  nuxt: boolean;
}

/**
 * フロントエンドのコンフィグファイルが存在するかどうかを検査する
 * @returns それぞれのフレームワークのコンフィグが存在するかどうかを名前付きで返す
 */
export const detectFrontConfigFile =
  async (): Promise<DetectedFrontendConfig> => {
    const nuxtConfigFileCheckingResults = await Promise.all([
      isFileExists('nuxt.config.js'),
      isFileExists('nuxt.config.ts'),
    ]);

    return {
      nuxt: nuxtConfigFileCheckingResults.includes(true),
    };
  };
