import type { Options } from 'prettier';
import fs from 'fs/promises';

export class PrettierRcRepository {
  public option: Options = {
    semi: true,
    singleQuote: true,
    tabWidth: 2,
    bracketSpacing: true,
    arrowParens: 'always',
    endOfLine: 'lf',
  };

  async save() {
    const stringifyJson = String(this.option) + '\n';
    try {
      await fs.writeFile('.prettierrc', stringifyJson);
    } catch (_) {
      console.log(_);
    }
  }
}
