import { PackageJson } from 'pkg-types';
import { isFileExists } from './isFileExist';
import { promises } from 'fs';

interface PackageJsonWithScripts extends PackageJson {
  scripts?: Record<string, string>;
}

async function readPackageJSON(path: string) {
  const blob = await promises.readFile(path, 'utf-8');
  return JSON.parse(blob);
}

async function writePackageJSON(path: string, pkg: PackageJson) {
  await promises.writeFile(path, JSON.stringify(pkg, null, 2) + '\n');
}

export type PkgScript = 'typeCheck' | 'eslint' | 'prettier';

export const writeScripts = async (scripts: PkgScript[]) => {
  let pkg: PackageJson;
  if (await isFileExists('./package.json')) {
    pkg = await readPackageJSON('./package.json');
  } else {
    pkg = {};
  }
  if (scripts.includes('typeCheck')) {
    addTypeCheckScript(pkg);
  }
  if (scripts.includes('eslint')) {
    addEslintScript(pkg);
  }
  if (scripts.includes('prettier')) {
    addPrettierScript(pkg);
  }
  addLintScript(pkg);
  addLintFixScript(pkg);
  writePackageJSON('./package.json', pkg);
};

export const addTypeCheckScript = (pkg: PackageJsonWithScripts) => {
  if (!pkg.scripts) {
    pkg.scripts = {};
  }
  pkg.scripts.typeCheck = 'tsc --noEmit';
};

export const addEslintScript = (pkg: PackageJsonWithScripts) => {
  if (!pkg.scripts) {
    pkg.scripts = {};
  }
  pkg.scripts['lint:js'] = 'eslint --ext .js,.ts .';
  pkg.scripts['lint:js:fix'] = 'eslint --fix --ext .js,.ts .';
};

export const addPrettierScript = (pkg: PackageJsonWithScripts) => {
  if (!pkg.scripts) {
    pkg.scripts = {};
  }
  pkg.scripts['lint:code'] = 'prettier .';
  pkg.scripts['lint:code:fix'] = 'prettier --write .';
};

export const addLintScript = (pkg: PackageJsonWithScripts) => {
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

export const addLintFixScript = (pkg: PackageJsonWithScripts) => {
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
