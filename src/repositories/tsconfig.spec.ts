import fs from 'fs/promises';
import { Stats } from 'fs';
import { TSConfigJson } from '@/repositories/tsconfig';

describe('๐ TSConfigRepository', () => {
  describe('๐ save', () => {
    it('๐ฎ ๆน่กๆๅญใๅ ใใฆใใกใคใซใซๅบๅใใ', async () => {
      // lstat ใใใกใคใซใๅญๅจใใชใใจ่งฃ้ใใใใใซ reject ใใใๆๅใงใขใใฏ
      jest.spyOn(fs, 'lstat').mockImplementation(() => Promise.reject());

      const spyOfWriteFile = jest
        .spyOn(fs, 'writeFile')
        .mockImplementation(() => Promise.resolve());

      const tsconfig = new TSConfigJson();
      await tsconfig.save();

      const expectedJSON =
        JSON.stringify(
          {
            compilerOptions: {
              module: 'commonjs',
              target: 'ES2018',
              sourceMap: true,
              strict: true,
              esModuleInterop: true,
              forceConsistentCasingInFileNames: true,
              rootDir: './',
              baseUrl: './src',
              paths: {
                '@/*': ['./*'],
              },
              types: ['@types/jest', '@types/node'],
            },
            include: ['src/**/*'],
            exclude: ['node_modules'],
          },
          null,
          2
        ) + '\n';

      expect(spyOfWriteFile).toHaveBeenCalledWith(
        'tsconfig.json',
        expectedJSON,
        {
          encoding: 'utf8',
        }
      );
    });

    it('๐ฎ ใใกใคใซใๅญๅจใใๅ ดๅใฏใจใฉใผใ่ฟใ', async () => {
      // lstat ใใใกใคใซใๅญๅจใใใจ่งฃ้ใใใใใซใขใใฏ
      jest
        .spyOn(fs, 'lstat')
        .mockImplementation(() => Promise.resolve({} as Stats));

      const tsconfig = new TSConfigJson();

      await expect(tsconfig.save()).rejects.toThrowError(
        new Error('tsconfig.json file already exist!')
      );
    });
  });
});
