# 計算機アプリ

JavaScript / Node.js / React（Vite）で作ったシンプルな計算機です。

## 機能

- 四則演算（+, −, ×, ÷）
- 小数点入力
- 符号反転（±）
- パーセント（%）
- クリア（C）
- ゼロ除算時は `Error` を表示

## ローカルで実行

```bash
npm install
npm run dev
```

ブラウザで http://localhost:5173 を開いてください。

## Docker で実行

```bash
docker build -t calculator-app .
docker run --rm -p 5173:5173 calculator-app
```

ブラウザで http://localhost:5173 を開いてください。

## 本番ビルド（任意）

```bash
npm run build
npm run preview
```
