# CLAUDE.md

給 Claude Code 在此 repo 工作時的指引。請先讀本檔再動手。

## 這是什麼

`qa-storming` 是一個 **QA 團隊知識中心**的單頁登陸站,目前的視覺是**溫暖奇幻 RPG 風格**(世界樹 / 公會知識庫,「QA Storming — Guild Knowledge Archive」,繁體中文內容)。

技術上是一個 **Next.js 靜態網站**,部署在 **Firebase Hosting**:

- **框架:** Next.js 16(App Router, React 19),以 `output: "export"` 產生**純靜態站**(`next build` → `out/`)。
- **部署:** Firebase Hosting,serve `out/`(見 `firebase.json`、`.firebaserc`,專案名 `qa-storming`,網址 `https://qa-storming.web.app`)。
- **樣式:** Tailwind CSS v4(`@import "tailwindcss"`)+ `app/globals.css` 手寫的 RPG 主題。
- **語系:** 繁體中文(`lang="zh-Hant"`)+ 英文 RPG 大寫標籤。

> ⚠️ **這是靜態匯出站,沒有 server、沒有 API route、沒有資料庫。** 任何需要後端執行的功能(route handlers、runtime server actions、DB 連線)在目前的部署方式下都跑不起來。

## 常用指令

- 需求:Node `>=22.13.0`。
- `npm run dev` — 本地開發(`next dev`,HMR)。
- `npm run build` — production build,產出靜態站到 `out/`。
- `npm run start` — 本地服務已建置的版本。
- `npm run lint` — ESLint(忽略 `out`、`.next`)。
- `npm run deploy` — **一步完成部署**:`next build` 後 `firebase deploy --only hosting`。**不需要**另外先跑 `npm run build`。

## 架構重點

- `app/` — 網站本體(App Router)。
  - `page.tsx` — 首頁,`"use client"` client 元件(scroll parallax 全靠 `scrollY` state 驅動)。
  - `layout.tsx` — root layout、metadata(OG 用 `/rpg-life-tree.png`、favicon、`robots: noindex`)、Geist 字型。
  - `globals.css` — 完整 RPG 主題(壓縮單行 CSS + CSS 變數 + scroll-driven transform)。
- `next.config.ts` — `output: "export"` + `images.unoptimized: true`(靜態站不能用 Next 的 image optimization)。
- `firebase.json` / `.firebaserc` — Firebase Hosting 設定(public = `out`、cleanUrls、cache headers)。
- `public/` — 靜態資產:`rpg-life-tree.png`(hero 背景 + OG 圖)、favicon。
- 路徑別名:`@/*` → 專案根目錄(見 tsconfig)。

## 重要地雷(先看這段)

- **首頁內容是寫死的靜態陣列。** `app/page.tsx` 內的 `fruits` / `quests` / `lore` 三個陣列是硬寫在檔案裡的資料,並**不是**從 Markdown 或 DB 載入(即使頁面文案宣稱「以 Markdown 保存」,尚未實作)。要改文件卡片內容 → 改 `app/page.tsx`。
- **靜態匯出的限制。** `output: "export"` 下不能有 server 功能;要加後端就得改部署方式(例如換 Firebase 的 SSR / Functions 方案,或改回有 server 的 host)。
- **部署只要一行。** `npm run deploy` 已包含 build;不要再手動 `npm run build && npm run deploy`(會 build 兩次)。首次部署需先 `firebase login` 且對 `qa-storming` 專案有權限。
- **`robots` 目前為 noindex。** `layout.tsx` 設了 `robots: { index: false, follow: false }`;要上正式搜尋收錄前記得改。

## 慣例

- 文案:繁體中文為主 + 英文 RPG 大寫標籤(ONBOARDING / REGRESSION / KNOW-HOW、新手村 / 試煉之森 / 賢者書庫)。
- 樣式:`globals.css` 用壓縮單行 CSS 規則、CSS 自訂屬性調色盤,互動與景深靠 scroll 位移(`scrollY`)。
- TypeScript strict、`noEmit`、`moduleResolution: bundler`、ESM(`"type": "module"`)。
- Git:目前在 `feature/rpg-skin` 分支開發,主線為 `main`。
