import { PkgScriptWriter, pkgIO } from '@/helper/pkgScripts';

describe('pkgScripts', () => {
  const spyOnIsFileExist = jest.spyOn(pkgIO, 'isFileExists');
  spyOnIsFileExist.mockImplementation(async () => true);

  const spyOnReadPkg = jest.spyOn(pkgIO, 'readPackageJSON');
  spyOnReadPkg.mockImplementation(async () => {
    return { name: 'test' };
  });

  const spyOnWritePkg = jest.spyOn(pkgIO, 'writePackageJSON');
  spyOnWritePkg.mockImplementation(async () => {
    return;
  });

  it('add typeCheck script', async () => {
    const pkg = new PkgScriptWriter();
    pkg.addScript('typeCheck');
    await pkg.writeScripts();
    expect(spyOnWritePkg).toBeCalledWith('./package.json', {
      name: 'test',
      scripts: {
        typeCheck: 'tsc --noEmit',
      },
    });
  });

  it('add eslint script', async () => {
    const pkg = new PkgScriptWriter();
    pkg.addScript('eslint');
    await pkg.writeScripts();
    expect(spyOnWritePkg).toBeCalledWith('./package.json', {
      name: 'test',
      scripts: {
        lint: 'npm run lint:js',
        'lint:fix': 'npm run lint:js:fix',
        'lint:js': 'eslint --ext .js,.ts .',
        'lint:js:fix': 'eslint --fix --ext .js,.ts .',
      },
    });
  });

  it('add prettier script', async () => {
    const pkg = new PkgScriptWriter();
    pkg.addScript('prettier');
    await pkg.writeScripts();
    expect(spyOnWritePkg).toBeCalledWith('./package.json', {
      name: 'test',
      scripts: {
        lint: 'npm run lint:code',
        'lint:fix': 'npm run lint:code:fix',
        'lint:code': 'prettier .',
        'lint:code:fix': 'prettier --write .',
      },
    });
  });

  it('add eslint prettier script', async () => {
    const pkg = new PkgScriptWriter();
    pkg.addScript('eslint');
    pkg.addScript('prettier');
    await pkg.writeScripts();
    expect(spyOnWritePkg).toBeCalledWith('./package.json', {
      name: 'test',
      scripts: {
        lint: 'npm run lint:js && npm run lint:code',
        'lint:code': 'prettier .',
        'lint:code:fix': 'prettier --write .',
        'lint:fix': 'npm run lint:js:fix && npm run lint:code:fix',
        'lint:js': 'eslint --ext .js,.ts .',
        'lint:js:fix': 'eslint --fix --ext .js,.ts .',
      },
    });
  });
});
