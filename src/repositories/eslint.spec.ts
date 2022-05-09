import fs from 'fs/promises';
import yaml from 'yaml';
import { ESLintRcRepository } from '@/repositories/eslint';
import { Stats } from 'fs';

describe('🚓 ESLintRcRepository', () => {
  describe('🚓 addRules', () => {
    it('👮 単体追加', () => {
      const eslintrc = new ESLintRcRepository();
      eslintrc.addRules({ 'no-var': 'error' });

      expect(eslintrc.config.rules).toStrictEqual({ 'no-var': 'error' });
    });

    it('👮 複数追加', () => {
      const eslintrc = new ESLintRcRepository();
      eslintrc.addRules([{ 'no-var': 'error' }, { eqeqeq: 'error' }]);

      expect(eslintrc.config.rules).toStrictEqual({
        'no-var': 'error',
        eqeqeq: 'error',
      });
    });
  });

  describe('🚓 addRules', () => {
    it('👮 ファイルが存在しない場合は yaml にパース, 改行文字を付加して出力', async () => {
      jest.spyOn(fs, 'lstat').mockImplementation(() => Promise.reject());

      const spyOfWriteFile = jest
        .spyOn(fs, 'writeFile')
        .mockImplementation(() => Promise.resolve());

      const eslintrc = new ESLintRcRepository();
      await eslintrc.save();

      const expectedYaml = yaml.stringify(eslintrc.config) + '\n';
      expect(spyOfWriteFile).toHaveBeenCalledWith(
        '.eslintrc.yaml',
        expectedYaml,
        { encoding: 'utf8' }
      );
    });

    it('👮 ファイルが存在する場合はエラーを返す', async () => {
      jest
        .spyOn(fs, 'lstat')
        .mockImplementation(() => Promise.resolve({} as Stats));

      const eslintrc = new ESLintRcRepository();

      await expect(eslintrc.save()).rejects.toThrowError(
        new Error('.eslintrc file already exist!')
      );
    });
  });
});
