import { execa } from 'execa';
import { isFileExists } from '@/helper/isFileExist';

export const packageInstallerIO = {
  execa: execa,
  isFileExists: isFileExists,
} as const;

export class PackageInstaller {
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
   * パッケージのイニシャライズを実行
   * @returns ExecaChildProcess<string> | undefined
   */
  async initialize() {
    if (await packageInstallerIO.isFileExists('./package.json')) {
      return;
    }

    const initializeCommands = {
      npm: ['init', '-y'],
      yarn: ['init', '-y'],
    };

    return packageInstallerIO.execa(
      this.userSelectedPackageManager,
      initializeCommands[this.userSelectedPackageManager],
      {
        encoding: 'utf8',
        stdio: 'inherit',
      }
    );
  }

  /**
   * パッケージのインストールを実行
   * @returns ExecaChildProcess<string>
   */
  async install() {
    if (this.installPackages.length === 0) {
      return;
    }

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
