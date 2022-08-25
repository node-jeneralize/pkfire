import fs from 'fs/promises';
import { Dependabot } from '@/repositories/dependabot';
import { stringify } from 'yaml';

describe('🚓 Dependabot', () => {
  const config: ConstructorParameters<typeof Dependabot>[0] = {
    version: 3,
    updates: {
      'package-ecosystem': 'npm',
      directory: '/',
      schedule: {
        interval: 'weekly',
      },
    },
  };

  describe('🚓 constructor', () => {
    it('👮 constructor の引数が config に渡される', () => {
      const dependabot = new Dependabot(config);

      expect(dependabot.config).toStrictEqual(config);
    });
  });

  describe('🚓 save', () => {
    it('👮 ファイルが存在しないときは yaml にパース, 改行文字を付加して出力', async () => {
      jest.spyOn(fs, 'lstat').mockImplementation(() => Promise.reject());
      const spyOnWriteFile = jest
        .spyOn(fs, 'writeFile')
        .mockImplementation(() => Promise.resolve());

      const dependabot = new Dependabot(config);
      await dependabot.save('dependabot.yml');

      const expectedYaml = stringify(dependabot.config, { singleQuote: true });
      expect(spyOnWriteFile).toHaveBeenCalledWith(
        '.github/dependabot.yml',
        expectedYaml
      );
    });
  });
});
