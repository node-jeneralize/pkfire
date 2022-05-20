import { PrettierRc } from '@/repositories/prettier';
import fs from 'fs/promises';
import { Stats } from 'fs';

describe('🚓 PrettierRc', () => {
  describe('🚓 save', () => {
    it('👮 改行文字を加えてファイルに出力する', async () => {
      // lstat がファイルが存在しないと解釈するように reject させる挙動でモック
      jest.spyOn(fs, 'lstat').mockImplementation(() => Promise.reject());

      const spyOfWriteFile = jest
        .spyOn(fs, 'writeFile')
        .mockImplementation(() => Promise.resolve());

      const prettierrc = new PrettierRc();
      await prettierrc.save();

      const expectedJSON =
        JSON.stringify(
          {
            semi: true,
            singleQuote: true,
            tabWidth: 2,
            bracketSpacing: true,
            arrowParens: 'always',
            endOfLine: 'lf',
          },
          null,
          2
        ) + '\n';

      expect(spyOfWriteFile).toHaveBeenCalledWith('.prettierrc', expectedJSON);
    });

    it('👮 ファイルが存在する場合はエラーを返す', async () => {
      // lstat がファイルが存在すると解釈するようにモック
      jest
        .spyOn(fs, 'lstat')
        .mockImplementation(() => Promise.resolve({} as Stats));

      const prettierrc = new PrettierRc();

      await expect(prettierrc.save()).rejects.toThrowError(
        new Error('.prettierrc file exist!')
      );
    });
  });
});
