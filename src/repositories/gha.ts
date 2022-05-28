interface Step {
  uses?: string;
  name?: string;
  run?: string;
  with?: {
    [key: string]: string;
  };
}

interface Trigger {
  pull_request?: {
    paths: string[];
  };

  push?: {
    branches: string[];
    paths: string[];
  };
}

interface Jobs {
  [key: string]: {
    name: string;
    'runs-on': string;
    steps: Step[];
  };
}

interface Config {
  name: string;
  on: Trigger;
  jobs: Jobs;
}

export class GitHubActionsConfig {
  config: Config = {
    name: 'lint',
    on: {
      pull_request: {
        paths: ['src/**/*'],
      },
    },
    jobs: {
      lint: {
        name: 'lint',
        'runs-on': 'ubuntu-latest',
        steps: [
          {
            uses: 'actions/checkout@v1',
          },
          {
            name: 'using node',
            uses: 'actions/setup-node@v2',
            with: {
              'node-version': 'BEFORE USE, INSERT NODE VERSION HERE',
            },
          },
          {
            name: 'install',
            run: 'npm ci',
          },
          {
            name: 'lint check',
            uses: 'reviewdog/actions-eslint@v1',
            with: {
              repoter: 'github-check',
              eslint_flags: '--ext .js,.ts src',
            },
          },
        ],
      },
    },
  };
}
