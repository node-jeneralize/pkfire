import { askUseTypeScript } from '@/questions/useTypeScript';
import { askToolchains } from '@/questions/toolchains';
import { askWhichPackageManager } from '@/questions/packageManager';
import { PackageInstaller } from '@/repositories/packageInstaller';
import { TSConfigJson } from '@/repositories/tsconfig';
import { askUsingGitHubActions } from '@/questions/githubActions';
import { PkgScriptWriter } from '@/helper/pkgScripts';
import { checkObjectContainTrue } from '@/helper/checkObjectContainTrue';
import { detectFrontConfigFile } from '@/questions/detectFrontConfigFile';

/**
 * パラメータなどの引数なしで実行したときの挙動を実行する
 */
export const runGeneralCommandJob = async () => {
  const packageManager = await askWhichPackageManager();
  const frontend = await detectFrontConfigFile();

  // フロントエンドの設定ファイルが1つでもあればいくつかの質問をスキップする
  const tsPromptOption: Parameters<typeof askUseTypeScript>[0] | undefined =
    checkObjectContainTrue(frontend)
      ? { skipGenerate: true, skipInstall: true }
      : undefined;
  const environment = await askUseTypeScript(tsPromptOption);

  const toolchains = await askToolchains();
  const shouldUseGitHubActions = await askUsingGitHubActions();

  //------------------------------------------------------------------------------
  // Package Installation
  //------------------------------------------------------------------------------
  const packageInstaller = new PackageInstaller(packageManager);
  // package.json scripts のライター
  const pkg = new PkgScriptWriter();

  if (toolchains.ESLint) {
    // 必須パッケージを追加
    packageInstaller.addInstallPackage(toolchains.ESLint.dependencies.always);
    // scripts 追加
    pkg.addScript('eslint');

    // Prettier もいっしょに使う場合はルール競合回避のパッケージを追加, ESLint のコンフィグに追記
    if (toolchains.Prettier) {
      packageInstaller.addInstallPackage(
        toolchains.ESLint.dependencies.useWithPrettier
      );
      toolchains.ESLint.enablePrettierFeature();
    }

    // TS といっしょに使う場合は追加, ESLint のコンフィグに追記
    if (environment.shouldUseTypeScriptFeatures) {
      packageInstaller.addInstallPackage(
        toolchains.ESLint.dependencies.useWithTypeScript
      );
      toolchains.ESLint.enableTypeScriptFeatures();
    }

    // Nuxt と併用する場合は ESLint に設定を追加する
    if (frontend.nuxt) {
      toolchains.ESLint.enableNuxtFeatures();
      packageInstaller.addInstallPackage(
        toolchains.ESLint.dependencies.useWithNuxtJs
      );

      if (environment.shouldUseTypeScriptFeatures) {
        toolchains.ESLint.enableNuxtAndTypeScriptFeatures();
        packageInstaller.addInstallPackage(
          toolchains.ESLint.dependencies.useWithNuxtAndTS
        );
      }
    }
  }

  if (toolchains.Prettier) {
    packageInstaller.addInstallPackage(toolchains.Prettier.dependencies.always);
    // scripts 追加
    pkg.addScript('prettier');
  }

  if (environment.shouldUseTypeScriptFeatures) {
    // scripts 追加
    pkg.addScript('typeCheck');
  }

  if (environment.shouldInstallTypeScript) {
    packageInstaller.addInstallPackage(new TSConfigJson().dependencies.always);
  }

  if (toolchains.Jest) {
    packageInstaller.addInstallPackage(toolchains.Jest.dependencies.always);
    pkg.addScript('test');

    if (environment.shouldUseTypeScriptFeatures) {
      toolchains.Jest.enableTypeScript();
      packageInstaller.addInstallPackage(
        toolchains.Jest.dependencies.useWithTypeScript
      );
    }
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

  // フロントエンドは tsconfig.json を出さずに GitHub Actions のみ出力
  if (
    checkObjectContainTrue(frontend) &&
    environment.shouldUseTypeScriptFeatures &&
    shouldUseGitHubActions
  ) {
    await new TSConfigJson().generateGitHubActionsConfig(packageManager);
  }

  if (toolchains.ESLint) {
    if (shouldUseGitHubActions) {
      await Promise.all([
        toolchains.ESLint.generateGitHubActions(packageManager),
        toolchains.ESLint.save(),
      ]);
    } else {
      await toolchains.ESLint.save();
    }
  }

  if (toolchains.Prettier) {
    await toolchains.Prettier.save();
  }

  if (toolchains.Jest) {
    if (shouldUseGitHubActions) {
      await Promise.all([
        toolchains.Jest.generateGitHubActions(packageManager),
        toolchains.Jest.save(),
      ]);
    } else {
      await toolchains.Jest.save();
    }
  }

  console.log('Done All settings!');
};
