# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```
# Supabase Passkey (WebAuthn) Local Development Guide

React (Vite) と Supabase を用いて、パスキー（WebAuthn）による生体認証ログインをローカル環境で実装・テストするための手順書です。

---

## 1. Supabase ダッシュボードの設定

### ① メール認証プロバイダーの設定
1. Supabaseダッシュボードを開き、**Authentication > Providers > Email** に移動します。
2. **Enable Email provider** を **ON** にします。
3. 開発をスムーズに進めるため、**Confirm email** を **OFF** にします。
4. **Save** をクリックします。

### ② パスキー (WebAuthn) の設定
1. **Authentication > Providers > WebAuthn** (または Passkeys) に移動します。
2. **Enable WebAuthn** を **ON** にします。
3. 以下の項目を設定します：
   * **Relying Party ID:** `localhost`
   * **Relying Party Display Name:** 適当なアプリ名（例: `Passkey Demo`）
   * **Relying Party Origins:** `http://localhost:5173` **(※ポート番号の不一致を防ぐため重要)**
4. **Save** をクリックします。

---

## 2. 環境変数 (.env) の設定

プロジェクトのルートに `.env` ファイルを作成し、Supabaseのクレデンシャルを設定します。

```env
VITE_SUPABASE_URL=[https://あなたのプロジェクトID.supabase.co](https://あなたのプロジェクトID.supabase.co)
VITE_SUPABASE_ANON_KEY=あなたの公開anonキー