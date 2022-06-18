/**
 * 依存ツールを管轄するクラスの interface
 */
export interface Toolchain {
  // 依存プラグインの定義
  // always というキーは最低限必須,あとは子のクラスによる
  dependencies: { [key: 'always' | string]: string | string[] };

  // 設定のデータ
  config?: unknown;
}
