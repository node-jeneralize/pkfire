import { askUseTypeScript } from '@/questions/useTypeScript';
import { askLinterAndFormatter } from '@/questions/linterAndFormatter';
import { askWhichPackageManager } from '@/questions/packageManager';
import { PackageInstallerRepository } from '@/repositories/packageInstaller';
import { TSConfigRepository } from '@/repositories/tsconfig';

/**
 * パラメータなどの引数なしで実行したときの挙動を実行する
 */
export const runGeneralCommandJob = async () => {
  const packageManager = await askWhichPackageManager();
  const environment = await askUseTypeScript();
  const linterAndFormatter = await askLinterAndFormatter();

  //------------------------------------------------------------------------------
  // Package Installation
  //------------------------------------------------------------------------------
  const packageInstaller = new PackageInstallerRepository(packageManager);

  if (linterAndFormatter.ESLint) {
    // 必須パッケージを追加
    packageInstaller.addInstallPackage('eslint');

    // Prettier もいっしょに使う場合はルール競合回避のパッケージを追加, ESLint のコンフィグに追記
    if (linterAndFormatter.Prettier) {
      packageInstaller.addInstallPackage('eslint-config-prettier');
      linterAndFormatter.ESLint.enablePrettierFeature();
    }

    // TS といっしょに使う場合は追加, ESLint のコンフィグに追記
    if (environment.shouldUseTypeScriptFeatures) {
      packageInstaller.addInstallPackage([
        '@typescript-eslint/eslint-plugin',
        '@typescript-eslint/parser',
      ]);
      linterAndFormatter.ESLint.enableTypeScriptFeatures();
    }
  }

  if (linterAndFormatter.Prettier) {
    packageInstaller.addInstallPackage('prettier');
  }

  // パッケージのインストールを開始
  await packageInstaller.install();

  //------------------------------------------------------------------------------
  // Config files generating
  //------------------------------------------------------------------------------

  if (environment.shouldWriteTSConfigJson) {
    const tsconfig = new TSConfigRepository();
    await tsconfig.save();
  }

  if (linterAndFormatter.ESLint) {
    await linterAndFormatter.ESLint.save();
  }

  if (linterAndFormatter.Prettier) {
    await linterAndFormatter.Prettier.save();
  }

  console.log('Done All settings!');
};
