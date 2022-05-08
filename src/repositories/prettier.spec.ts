import { PrettierRcRepository } from '@/repositories/prettier';
import fs from 'fs/promises';

describe('🚓 PrettierRcRepository', () => {
  describe('🚓 save', () => {
    it('👮 改行文字を加えてファイルに出力する', async () => {
      const spyOfWriteFile = jest
        .spyOn(fs, 'writeFile')
        .mockImplementation(() => Promise.resolve());

      const prettierrc = new PrettierRcRepository();
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
  });
});
