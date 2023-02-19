import fs from 'fs/promises';
import yaml from 'yaml';
import { ESLintRc } from '@/repositories/eslint';
import { Stats } from 'fs';

describe('🚓 ESLintRc', () => {
  describe('🚓 enableTypeScriptFeatures', () => {
    it('👮 実行したら extends と plugins, parser が設定される', () => {
      const eslintrc = new ESLintRc();
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

  describe('🚓 enableNuxtFeatures', () => {
    it('👮‍ 実行すると env.browser と extends が設定される', () => {
      const eslintrc = new ESLintRc();
      eslintrc.enableNuxtFeatures();

      const expectResults = {
        env: {
          es6: true,
          node: true,
          browser: true,
        },
        extends: ['eslint:recommended', 'plugin:nuxt/recommended'],
      };

      expect(eslintrc.config.env).toStrictEqual(expectResults.env);
      expect(eslintrc.config.extends).toStrictEqual(expectResults.extends);
    });
  });

  describe('🚓 enableNuxtAndTypeScriptFeatures', () => {
    it('👮‍ 実行すると extends が設定される. parser は 空になる', () => {
      const eslintrc = new ESLintRc();
      eslintrc.enableNuxtAndTypeScriptFeatures();

      const expectResults = {
        extends: ['eslint:recommended', '@nuxtjs/eslint-config-typescript'],
      };

      expect(eslintrc.config.extends).toStrictEqual(expectResults.extends);
      expect(eslintrc.config.parser).toBe(undefined);
    });
  });

  describe('🚓 enablePrettierFeature', () => {
    it('👮 有効にして save() を実行すると extends の末尾に prettier が存在する', async () => {
      jest.spyOn(fs, 'lstat').mockImplementation(() => Promise.reject());

      const spyOfWriteFile = jest
        .spyOn(fs, 'writeFile')
        .mockImplementation(() => Promise.resolve());

      const eslintrc = new ESLintRc();
      eslintrc.enablePrettierFeature();
      await eslintrc.save();

      const expectedYaml = yaml.stringify({
        ...eslintrc.config,
        extends: ['eslint:recommended', 'prettier'], // extends 設定だけここで上書きして yaml を吐き出させる
      });

      expect(spyOfWriteFile).toHaveBeenCalledWith(
        '.eslintrc.yaml',
        expectedYaml,
        { encoding: 'utf8' }
      );
    });
  });

  describe('🚓 addRules', () => {
    it('👮 単体追加', () => {
      const eslintrc = new ESLintRc();
      eslintrc.addRules({ 'no-var': 'error' });

      expect(eslintrc.config.rules).toStrictEqual({ 'no-var': 'error' });
    });

    it('👮 複数追加', () => {
      const eslintrc = new ESLintRc();
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

      const eslintrc = new ESLintRc();
      await eslintrc.save();

      const expectedYaml = yaml.stringify(eslintrc.config);
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

      const eslintrc = new ESLintRc();

      await expect(eslintrc.save()).rejects.toThrowError(
        new Error('.eslintrc file already exist!')
      );
    });
  });
});
