export type Dependencies = {
  [key: 'always' | string]: string | string[];
};

/**
 * 依存ツールを管轄するクラスの interface
 */
export interface Toolchain {
  // 依存プラグインの定義
  // always というキーは最低限必須,あとは子のクラスによる
  dependencies: Dependencies;

  // 設定のデータ
  config?: unknown;
}
