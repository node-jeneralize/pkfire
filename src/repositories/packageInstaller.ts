import { execa } from 'execa';

export class PackageInstallerRepository {
  private readonly userSelectedPackageManager: 'npm' | 'yarn' = 'npm';

  private installPackages: string[] = [];

  /**
   * @param packageManager npm を通すのか yarn を通すのかを指定
   */
  constructor(packageManager: 'npm' | 'yarn') {
    this.userSelectedPackageManager = packageManager;
  }

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
    const installCommands = {
      npm: ['install', '-D', ...this.installPackages],
      yarn: ['add', '-D', ...this.installPackages],
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
