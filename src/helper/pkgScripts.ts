import { PackageJson } from 'pkg-types';
import { isFileExists } from '@/helper/isFileExist';
import { promises } from 'fs';

interface PackageJsonModified extends PackageJson {
  scripts?: Record<string, string>;
  license?: string;
}

async function readPackageJSON(path: string) {
  const blob = await promises.readFile(path, 'utf-8');
  return JSON.parse(blob);
}

async function writePackageJSON(path: string, pkg: PackageJson) {
  await promises.writeFile(path, JSON.stringify(pkg, null, 2) + '\n');
}

export const pkgIO = {
  isFileExists,
  readPackageJSON,
  writePackageJSON,
} as const;

export type PkgScriptKind = 'typeCheck' | 'eslint' | 'prettier' | 'test';

export class PkgScriptWriter {
  scripts: PkgScriptKind[] = [];

  /**
   * writeScriptsで書き出すためのスクリプトを追加する。
   * @param kind PkgScriptKind 対応スクリプトをユニオン型で表現している。
   */
  addScript(kind: PkgScriptKind) {
    this.scripts.push(kind);
  }

  /**
   * package.jsonにscriptsを書き出す。
   */
  async writeScripts() {
    if (!(await pkgIO.isFileExists('./package.json'))) {
      throw new Error('package.json not found');
    }

    const pkg = await pkgIO.readPackageJSON('./package.json');
    if (this.scripts.includes('typeCheck')) {
      addTypeCheckScript(pkg);
    }
    if (this.scripts.includes('eslint')) {
      addEslintScript(pkg);
    }
    if (this.scripts.includes('prettier')) {
      addPrettierScript(pkg);
    }
    if (this.scripts.includes('test')) {
      addJestScript(pkg);
    }

    addLintScript(pkg);
    addLintFixScript(pkg);
    await pkgIO.writePackageJSON('./package.json', pkg);
  }
}

export const addTypeCheckScript = (pkg: PackageJsonModified) => {
  if (!pkg.scripts) {
    pkg.scripts = {};
  }
  pkg.scripts.typeCheck = 'tsc --noEmit';
};

export const addJestScript = (pkg: PackageJsonModified) => {
  if (!pkg.scripts) {
    pkg.scripts = {};
  }
  pkg.scripts.test = 'jest';
};

export const addEslintScript = (pkg: PackageJsonModified) => {
  if (!pkg.scripts) {
    pkg.scripts = {};
  }
  pkg.scripts['lint:js'] = 'eslint --ext .js,.ts .';
  pkg.scripts['lint:js:fix'] = 'eslint --fix --ext .js,.ts .';
};

export const addPrettierScript = (pkg: PackageJsonModified) => {
  if (!pkg.scripts) {
    pkg.scripts = {};
  }
  pkg.scripts['lint:code'] = 'prettier .';
  pkg.scripts['lint:code:fix'] = 'prettier --write .';
};

/**
 * lint:js lint:codeの組み合わせからコマンドを生成する。
 * @param pkg PackageJsonModified
 */
export const addLintScript = (pkg: PackageJsonModified) => {
  if (!pkg.scripts) {
    return;
  }
  const keys = Object.keys(pkg.scripts);
  if (keys.includes('lint:js') && keys.includes('lint:code')) {
    pkg.scripts.lint = 'npm run lint:js && npm run lint:code';
  } else if (keys.includes('lint:js')) {
    pkg.scripts.lint = 'npm run lint:js';
  } else if (keys.includes('lint:code')) {
    pkg.scripts.lint = 'npm run lint:code';
  }
};

/**
 * lint:js:fix lint:code:fixの組み合わせからコマンドを生成する。
 * @param pkg PackageJsonModified
 */
export const addLintFixScript = (pkg: PackageJsonModified) => {
  if (!pkg.scripts) {
    return;
  }
  const keys = Object.keys(pkg.scripts);
  if (keys.includes('lint:js:fix') && keys.includes('lint:code:fix')) {
    pkg.scripts['lint:fix'] = 'npm run lint:js:fix && npm run lint:code:fix';
  } else if (keys.includes('lint:js:fix')) {
    pkg.scripts['lint:fix'] = 'npm run lint:js:fix';
  } else if (keys.includes('lint:code:fix')) {
    pkg.scripts['lint:fix'] = 'npm run lint:code:fix';
  }
};
