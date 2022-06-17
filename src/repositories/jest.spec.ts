import fs from 'fs/promises';
import path from 'path';
import { Jest } from '@/repositories/jest';

describe('🚓 Jest', () => {
  describe('🚓 save', () => {
    it('👮 TypeScript を使う場合は jest.config.ts をコピーして使わせる', async () => {
      const spyOfCopyFile = jest
        .spyOn(fs, 'copyFile')
        .mockReturnValue(Promise.resolve());

      const jestConfig = new Jest();
      jestConfig.enableTypeScript();
      const configTemplatePath = path.resolve(__dirname, '../jest.config.ts');

      await jestConfig.save();

      expect(spyOfCopyFile).toBeCalledWith(
        configTemplatePath,
        'jest.config.ts'
      );
    });

    it('👮 生の JS を使う場合は jest.config.js.template をコピーして使わせる', async () => {
      const spyOfCopyFile = jest
        .spyOn(fs, 'copyFile')
        .mockReturnValue(Promise.resolve());

      const jestConfig = new Jest();
      const configTemplatePath = path.resolve(
        __dirname,
        '../jest.config.js.template'
      );

      await jestConfig.save();

      expect(spyOfCopyFile).toBeCalledWith(
        configTemplatePath,
        'jest.config.js'
      );
    });
  });
});
