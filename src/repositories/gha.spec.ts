import fs from 'fs/promises';
import { stringify } from 'yaml';
import { GitHubActionsConfig } from '@/repositories/gha';
import { Stats } from 'fs';
jest.mock('mkdirp');

describe('๐ GitHubActionsConfig', () => {
  const config = {
    name: 'hoge',
    on: {
      pull_request: {
        paths: ['src/**/*'],
      },
    },
    jobs: {
      hogeAction: {
        name: 'hoge',
        'runs-on': 'ubuntu-latest',
        steps: [
          {
            run: 'hogeCommand',
          },
        ],
      },
    },
  };

  describe('๐ constructor', () => {
    it('๐ฎ ๅผๆฐใซ่จญๅฎใใๅคใ config ใซใปใใใใใ', () => {
      const gha = new GitHubActionsConfig(config);
      expect(gha.config).toStrictEqual(config);
    });
  });

  describe('๐ save', () => {
    it('๐ฎ yaml ใซใใฆๆๅฎใฎใใกใคใซใงไฟๅญใใ', async () => {
      jest.spyOn(fs, 'lstat').mockReturnValue(Promise.reject());
      const expectYaml = stringify(config, { singleQuote: true });

      const spyOfWriteFile = jest
        .spyOn(fs, 'writeFile')
        .mockReturnValue(Promise.resolve());

      const gha = new GitHubActionsConfig(config);
      await gha.save('hoge.yaml');

      expect(spyOfWriteFile).toBeCalledWith(
        '.github/workflows/hoge.yaml',
        expectYaml
      );
    });

    it('๐ฎใใกใคใซใๅญๅจใใๅ ดๅใฏ Error ใๅใ', async () => {
      jest.spyOn(fs, 'lstat').mockReturnValue(Promise.resolve({} as Stats));

      const gha = new GitHubActionsConfig(config);
      await expect(gha.save('hoge.yaml')).rejects.toThrowError();
    });
  });
});
