import { execa } from 'execa';

export class PackageInstaller {
  private installPackages: string[] = [];

  /**
   * @param userSelectedPackageManager packageManager としてどれを使うのかを指定
   */
  constructor(
    private readonly userSelectedPackageManager: 'npm' | 'yarn' | 'pnpm'
  ) {}

  /**
   * インストールする必要があるパッケージを追加する
   * @param installingPackages
   */
  addInstallPackage(installingPackages: string | string[]) {
    if (Array.isArray(installingPackages)) {
      installingPackages.forEach((installPackage) =>
        this.installPackages.push(installPackage)
      );
    } else {
      this.installPackages.push(installingPackages);
    }
  }

  /**
   * パッケージのインストールを実行
   */
  async install() {
    if (this.installPackages.length === 0) {
      return;
    }

    const installCommands = {
      npm: ['install', '-D', ...this.installPackages],
      yarn: ['add', '-D', ...this.installPackages],
      pnpm: ['add', '-D', ...this.installPackages],
    };

    return execa(
      this.userSelectedPackageManager,
      installCommands[this.userSelectedPackageManager],
      {
        encoding: 'utf8',
        stdio: 'inherit',
      }
    );
  }
}
