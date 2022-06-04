import { askUseTypeScript } from '@/questions/useTypeScript';
import { askLinterAndFormatter } from '@/questions/linterAndFormatter';
import { askWhichPackageManager } from '@/questions/packageManager';
import { PackageInstaller } from '@/repositories/packageInstaller';
import { TSConfigJson } from '@/repositories/tsconfig';
import { askUsingGitHubActions } from '@/questions/githubActions';
import { PkgScript, writeScripts } from '@/helper/pkgScripts';

/**
 * パラメータなどの引数なしで実行したときの挙動を実行する
 */
export const runGeneralCommandJob = async () => {
  const packageManager = await askWhichPackageManager();
  const environment = await askUseTypeScript();
  const linterAndFormatter = await askLinterAndFormatter();
  const shouldUseGitHubActions = await askUsingGitHubActions();

  //------------------------------------------------------------------------------
  // Package Installation
  //------------------------------------------------------------------------------
  const packageInstaller = new PackageInstaller(packageManager);
  // package.json scripts に追加するスクリプト
  const pkgScripts: PkgScript[] = [];

  if (linterAndFormatter.ESLint) {
    // 必須パッケージを追加
    packageInstaller.addInstallPackage('eslint');
    // scripts 追加
    pkgScripts.push('eslint');

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
    pkgScripts.push('prettier');
  }

  if (environment.shouldUseTypeScriptFeatures) {
    // scripts 追加
    pkgScripts.push('typeCheck');
  }

  // パッケージのインストールを開始
  await packageInstaller.install();

  // package.json へ書き込み
  await writeScripts(pkgScripts);

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
