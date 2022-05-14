import fs from 'fs/promises';
import yaml from 'yaml';
import { ESLintRcRepository } from '@/repositories/eslint';
import { Stats } from 'fs';

describe('🚓 ESLintRcRepository', () => {
  describe('🚓 enableTypeScriptFeatures', () => {
    it('👮 実行したら extends と plugins, parser が設定される', () => {
      const eslintrc = new ESLintRcRepository();
      eslintrc.enableTypeScriptFeatures();

      const expectResults = {
        extends: [
          'eslint:recommended',
          'plugin:@typescript-eslint/recommended',
        ],
        plugins: ['@typescript-eslint'],
        parser: '@typescript-eslint/parser',
      };

      expect(eslintrc.config.extends).toStrictEqual(expectResults.extends);
      expect(eslintrc.config.plugins).toStrictEqual(expectResults.plugins);
      expect(eslintrc.config.parser).toBe(expectResults.parser);
    });
  });

  describe('🚓 enablePrettierFeature', () => {
    it('👮 有効にして save() を実行すると extends の末尾に prettier が存在する', async () => {
      jest.spyOn(fs, 'lstat').mockImplementation(() => Promise.reject());

      const spyOfWriteFile = jest
        .spyOn(fs, 'writeFile')
        .mockImplementation(() => Promise.resolve());

      const eslintrc = new ESLintRcRepository();
      eslintrc.enablePrettierFeature();
      await eslintrc.save();

      const expectedYaml =
        yaml.stringify({
          ...eslintrc.config,
          extends: ['eslint:recommended', 'prettier'], // extends 設定だけここで上書きして yaml を吐き出させる
        }) + '\n';

      expect(spyOfWriteFile).toHaveBeenCalledWith(
        '.eslintrc.yaml',
        expectedYaml,
        { encoding: 'utf8' }
      );
    });
  });

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

  describe('🚓 save', () => {
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
