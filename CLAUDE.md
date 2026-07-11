# CLAUDE.md

給 Claude Code 在此 repo 工作時的指引。請先讀本檔再動手。

## 這是什麼

`qa-storming` 是由 `site-creator-vinext-starter` 範本客製化而成的 **QA Mission Control 知識中心**單頁登陸站(太空艙 / mission-control 視覺主題,繁體中文內容)。

技術上是一個 **vinext**(Next.js 16 App Router + Vite + Cloudflare Workers）網站:

- **框架/執行環境:** Next.js 16(App Router, React 19)跑在 [vinext](https://github.com/cloudflare/vinext),部署到 Cloudflare Workers,透過 OpenAI Sites 平台(`.openai/hosting.json`)。
- **樣式:** Tailwind CSS v4(`@import "tailwindcss"`)+ `app/globals.css` 手寫太空主題。
- **資料層(休眠中):** Drizzle ORM + Cloudflare D1,目前未啟用。
- **語系:** 繁體中文(`lang="zh-Hant"`)+ 英文 mission-control 標籤。

## 常用指令

- 需求:Node `>=22.13.0`。
- `npm run dev` — 本地開發(HMR)。
- `npm run build` — 產出 production build 到 `dist/`。
- `npm run start` — 服務已建置的版本。
- `npm run lint` — ESLint(忽略 `dist`、`.next`)。
- `npm run db:generate` — `drizzle-kit generate`,改 schema 後產生 D1 migration。
- `npm test` — **目前會失敗**(見下方地雷)。
- 所有 vinext 指令的 wrangler log 會導到 `.wrangler/`。

## 架構重點

- `app/` — 網站本體(App Router)。
  - `page.tsx` — QA Mission Control 首頁,`"use client"` client 元件。
  - `layout.tsx` — root layout、metadata、字型(`lang="zh-Hant"`)。
  - `globals.css` — 完整太空主題(壓縮單行 CSS + CSS 變數調色盤 + pointer-parallax `--mx/--my`)。
  - `chatgpt-auth.ts` — Sign-in-with-ChatGPT(SIWC)helper。
- `worker/index.ts` — Cloudflare Worker 進入點(vinext handler + 圖片最佳化)。
- `db/`(`index.ts` = Drizzle D1 client factory `getDb`;`schema.ts` = 刻意留空)+ `drizzle/` migration 目錄 — **休眠中的資料層**。
- `examples/d1/` — opt-in 的 D1 範例(`/api/notes` route),未接進 app。
- `.openai/hosting.json` — Sites 平台綁定(`project_id`、`d1`、`r2`,目前皆 `null`)。
- `build/sites-vite-plugin.ts` — build 收尾時把 hosting config + migration 打包進 `dist/.openai`。
- 路徑別名:`@/*` → 專案根目錄(見 tsconfig)。

## 重要地雷(先看這段)

- **首頁文件卡片是寫死的靜態陣列。** `app/page.tsx` 內的 `documents` 陣列是硬寫在檔案裡的 mock 資料,並**不是**從 Markdown 或 DB 載入(即使頁面的 architecture 段落宣稱 Markdown-driven,尚未實作)。要改文件內容 → 改 `app/page.tsx`。
- **不要為平台保留路由建 route。** `/signin-with-chatgpt`、`/signout-with-chatgpt`、`/callback` 由 Sites 平台擁有。需身分的頁面請用 `app/chatgpt-auth.ts` 的 helper(`getChatGPTUser` / `requireChatGPTUser` / `chatGPTSignInPath` / `chatGPTSignOutPath`),並在受保護頁面加 `export const dynamic = "force-dynamic"`。
- **DB 休眠中。** `db/schema.ts` 為空、`hosting.json` 的 `d1: null`。要啟用資料層 → 參照 `examples/d1/` 的模式,填 `db/schema.ts`,設定 `hosting.json` 綁定(D1 binding 慣例名為 `DB`),再跑 `npm run db:generate`。
- **`npm test` 目前會失敗。** `tests/rendered-html.test.mjs` 仍在測舊 starter 的 loading skeleton(斷言 "Your site is taking shape"、`react-loading-skeleton`、`app/_sites-preview/SkeletonPreview.tsx` 等),這些在現行 QA 版本都已不存在。動測試或把 test 納入流程前,先知道這點。
- **README.md 尚未更新。** 目前仍是範本原本的 `vinext-starter` 說明,不代表這個 QA 站的現況。

## 慣例

- 文案:繁體中文為主 + 英文 mission-control 大寫標籤(EXPLORE / VERIFY / DELIVER、ONBOARDING / REGRESSION / KNOW-HOW)。
- 樣式:`globals.css` 用壓縮單行 CSS 規則、CSS 自訂屬性調色盤(`--cyan #47e7ff`、`--violet #9a78ff`、`--amber #ffbf69`,深色背景 `#03070c`),互動靠 pointer-parallax(`--mx/--my`)。
- TypeScript strict、`noEmit`、`moduleResolution: bundler`、ESM(`"type": "module"`)。
