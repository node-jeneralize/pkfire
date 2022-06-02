import { GitHubActionsConfig } from '@/repositories/gha';
import mkdirp from 'mkdirp';
import fs from 'fs/promises';
import { stringify } from 'yaml';
describe('🚓 GitHubActionsConfig', () => {
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

  describe('🚓 constructor', () => {
    it('👮 引数に設定した値が config にセットされる', () => {
      const gha = new GitHubActionsConfig(config);
      expect(gha.config).toStrictEqual(config);
    });
  });

  describe('🚓 save', () => {
    jest.fn(mkdirp).mockReturnValue(Promise.resolve(''));

    it('👮 yaml にして指定のファイルで保存する', async () => {
      jest.spyOn(fs, 'writeFile').mockReturnValue(Promise.reject());
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
  });
});
