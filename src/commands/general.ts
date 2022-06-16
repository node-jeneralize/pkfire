import { askUseTypeScript } from '@/questions/useTypeScript';
import { askToolchains } from '@/questions/toolchains';
import { askWhichPackageManager } from '@/questions/packageManager';
import { PackageInstaller } from '@/repositories/packageInstaller';
import { TSConfigJson } from '@/repositories/tsconfig';
import { askUsingGitHubActions } from '@/questions/githubActions';
import { PkgScriptWriter } from '@/helper/pkgScripts';

/**
 * パラメータなどの引数なしで実行したときの挙動を実行する
 */
export const runGeneralCommandJob = async () => {
  const packageManager = await askWhichPackageManager();
  const environment = await askUseTypeScript();
  const linterAndFormatter = await askToolchains();
  const shouldUseGitHubActions = await askUsingGitHubActions();

  //------------------------------------------------------------------------------
  // Package Installation
  //------------------------------------------------------------------------------
  const packageInstaller = new PackageInstaller(packageManager);
  // package.json scripts のライター
  const pkg = new PkgScriptWriter();

  if (linterAndFormatter.ESLint) {
    // 必須パッケージを追加
    packageInstaller.addInstallPackage('eslint');
    // scripts 追加
    pkg.addScript('eslint');

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
    // scripts 追加
    pkg.addScript('prettier');
  }

  if (environment.shouldUseTypeScriptFeatures) {
    // scripts 追加
    pkg.addScript('typeCheck');
  }

  if (environment.shouldInstallTypeScript) {
    packageInstaller.addInstallPackage('typescript');
  }

  // パッケージのインストールを開始
  await packageInstaller.install();

  // package.json へ書き込み
  await pkg.writeScripts();

  //------------------------------------------------------------------------------
  // Config files generating
  //------------------------------------------------------------------------------

  if (environment.shouldWriteTSConfigJson) {
    const tsconfig = new TSConfigJson();

    if (shouldUseGitHubActions) {
      await Promise.all([
        tsconfig.generateGitHubActionsConfig(packageManager),
        tsconfig.save(),
      ]);
    } else {
      await tsconfig.save();
    }
  }

  if (linterAndFormatter.ESLint) {
    if (shouldUseGitHubActions) {
      await Promise.all([
        linterAndFormatter.ESLint.generateGitHubActions(packageManager),
        linterAndFormatter.ESLint.save(),
      ]);
    } else {
      await linterAndFormatter.ESLint.save();
    }
  }

  if (linterAndFormatter.Prettier) {
    await linterAndFormatter.Prettier.save();
  }

  console.log('Done All settings!');
};
