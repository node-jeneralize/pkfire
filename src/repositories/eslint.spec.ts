import fs from 'fs/promises';
import yaml from 'yaml';
import { ESLintRc } from '@/repositories/eslint';
import { Stats } from 'fs';

describe('๐ ESLintRc', () => {
  describe('๐ enableTypeScriptFeatures', () => {
    it('๐ฎ ๅฎ่กใใใ extends ใจ plugins, parser ใ่จญๅฎใใใ', () => {
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

  describe('๐ enableNuxtFeatures', () => {
    it('๐ฎโ ๅฎ่กใใใจ env.browser ใจ extends ใ่จญๅฎใใใ', () => {
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

  describe('๐ enableNuxtAndTypeScriptFeatures', () => {
    it('๐ฎโ ๅฎ่กใใใจ extends ใ่จญๅฎใใใ', () => {
      const eslintrc = new ESLintRc();
      eslintrc.enableNuxtAndTypeScriptFeatures();

      const expectResults = {
        extends: ['eslint:recommended', '@nuxtjs/eslint-config-typescript'],
      };

      expect(eslintrc.config.extends).toStrictEqual(expectResults.extends);
    });
  });

  describe('๐ enablePrettierFeature', () => {
    it('๐ฎ ๆๅนใซใใฆ save() ใๅฎ่กใใใจ extends ใฎๆซๅฐพใซ prettier ใๅญๅจใใ', async () => {
      jest.spyOn(fs, 'lstat').mockImplementation(() => Promise.reject());

      const spyOfWriteFile = jest
        .spyOn(fs, 'writeFile')
        .mockImplementation(() => Promise.resolve());

      const eslintrc = new ESLintRc();
      eslintrc.enablePrettierFeature();
      await eslintrc.save();

      const expectedYaml = yaml.stringify({
        ...eslintrc.config,
        extends: ['eslint:recommended', 'prettier'], // extends ่จญๅฎใ?ใใใใงไธๆธใใใฆ yaml ใๅใๅบใใใ
      });

      expect(spyOfWriteFile).toHaveBeenCalledWith(
        '.eslintrc.yaml',
        expectedYaml,
        { encoding: 'utf8' }
      );
    });
  });

  describe('๐ addRules', () => {
    it('๐ฎ ๅไฝ่ฟฝๅ?', () => {
      const eslintrc = new ESLintRc();
      eslintrc.addRules({ 'no-var': 'error' });

      expect(eslintrc.config.rules).toStrictEqual({ 'no-var': 'error' });
    });

    it('๐ฎ ่คๆฐ่ฟฝๅ?', () => {
      const eslintrc = new ESLintRc();
      eslintrc.addRules([{ 'no-var': 'error' }, { eqeqeq: 'error' }]);

      expect(eslintrc.config.rules).toStrictEqual({
        'no-var': 'error',
        eqeqeq: 'error',
      });
    });
  });

  describe('๐ save', () => {
    it('๐ฎ ใใกใคใซใๅญๅจใใชใๅ?ดๅใฏ yaml ใซใใผใน, ๆน่กๆๅญใไปๅ?ใใฆๅบๅ', async () => {
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

    it('๐ฎ ใใกใคใซใๅญๅจใใๅ?ดๅใฏใจใฉใผใ่ฟใ', async () => {
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
