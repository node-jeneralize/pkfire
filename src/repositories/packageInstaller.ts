export class PackageInstallerRepository {
  private userSelectedPackageManager: 'npm' | 'yarn' = 'npm';

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
  install() {
    // TODO: cross-spawn を使用して npm install などのコマンドを実行する
  }
}
