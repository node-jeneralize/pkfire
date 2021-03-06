import { PrettierRc } from '@/repositories/prettier';
import fs from 'fs/promises';
import { Stats } from 'fs';

describe('๐ PrettierRc', () => {
  describe('๐ save', () => {
    it('๐ฎ ๆน่กๆๅญใๅ ใใฆใใกใคใซใซๅบๅใใ', async () => {
      // lstat ใใใกใคใซใๅญๅจใใชใใจ่งฃ้ใใใใใซ reject ใใใๆๅใงใขใใฏ
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

    it('๐ฎ ใใกใคใซใๅญๅจใใๅ ดๅใฏใจใฉใผใ่ฟใ', async () => {
      // lstat ใใใกใคใซใๅญๅจใใใจ่งฃ้ใใใใใซใขใใฏ
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
