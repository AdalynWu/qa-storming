# ARCHITECTURE — 系統架構與設計說明

## 總覽

單頁(+ 幾個子路由）靜態網站。**建置期**把所有資料嵌入,產出純靜態 `out/`,由 Firebase Hosting 直接 serve。**執行期無任何後端。**

```
Google Sheet ──(手動 npm run sync:regression)──> scripts/sync-regression.ts
                                                   │  (googleapis + zod 驗證)
                                                   ▼
                              src/content/generated/regression.json  (committed)
                                                   │  import + zod parse
                                                   ▼
        src/content/*.ts  ──import──>  src/components/*  ──>  src/app/*/page.tsx
                                                   │  next build (output: export)
                                                   ▼
                                                 out/  ──(firebase deploy)──> Firebase Hosting
```

## 技術棧

- **Next.js 16** App Router、**React 19**、`output: "export"`(純靜態)、`images.unoptimized: true`。
- **Tailwind CSS v4**(`@import "tailwindcss"`)+ `src/app/globals.css` 手寫 RPG 主題。
- **TypeScript** strict、ESM。**zod** 做內容驗證。**Swiper** 做輪播。**Three.js** 僅作少數沉浸式視覺增強，WebGL 不承載正文或必要操作。
- **googleapis** / **@notionhq/client** / **tsx**(devDeps)給同步腳本;**Firebase Hosting** 部署。

## 目錄結構

- `src/app/` — App Router:`layout.tsx`(metadata、字型、robots noindex)、`page.tsx`(首頁,client、scroll parallax)、`globals.css`;子路由 `product-map/`、`regression/`(各自 `page.tsx` + `*.css`)。
- `src/components/` — `ImmersiveTreeHero`(可選 WebGL 背景／粒子，具有靜態 fallback)、`QuestBookCarousel`(Swiper,接受 `quests` prop)、`TrialForestPortal`(regression 轉盤)與產品 Know-how 元件。
- `src/content/` — `quests.ts`、`products.ts`、`regression.ts`、`moor.ts`(Moor POC 章節資料)與 `docs.ts`(Notion manifest schema/helper);generated 內容位於 `generated/regression.json`、`generated/docs/`。
- `scripts/` — `sync-regression.ts`、`sync-notion.ts` 與各自的 `.test.ts`、`fixtures/`。**留在 root。**
- `public/` — 靜態資產(RPG 背景圖、sprite sheets、favicon)。**必須在 root。**
- `docs/` — 治理文件 + `regression-authoring.md`、`notion-content-sync.md`。
- root config:`next.config.ts`、`tsconfig.json`(`@/*`→`src/*`)、`firebase.json`/`.firebaserc`、`eslint.config.mjs`、`postcss.config.mjs`、`package.json`。

## 路由

- `/` — hero(世界樹)+ fruit 導航 + 新手村 quest 輪播 + 試煉之森傳送門 + 賢者書庫(lore)+ camp。critter:jelly(hero)、bat(新手村)、wolf(書庫)、lol-dragon(試煉之森)。
- `/product-map` — 互動產品世界地圖(`continents`)。
- `/products/moor` — Moor 創作者聖域產品 Hub；八章冒險路徑、發布／待審核狀態與章節預覽。
- `/products/moor/[chapter]` — Moor Know-how 靜態閱讀頁；目前輸出 `quick-start`、`live`，由 `generateStaticParams` 產生。
- `/regression` — regression test case 瀏覽(可搜尋/篩選,來自 `regressionSuites`/`regressionCases`)。

## 資料流與型別

- Regression:Sheet → 腳本(header 對映、list 拆分、唯一/參照完整性檢查、zod parse、`_meta` contentHash、原子寫檔、刪除保護)→ generated JSON → `regression.ts` 於 build 時 parse 並衍生統計。schema 由腳本與 app 共用單一來源(`src/content/regression.ts`)。
- 其他內容(quests/products/lore)目前硬編。Moor POC 以 `src/content/moor.ts` 保存經安全整理的內容；正式 Notion Catalog 映射完成後改由 generated docs 消費。

### Notion 文件流

```text
既有 Notion pages ← Website Docs Catalog allowlist
                           │
                           ├─ full ──────> generated Markdown + local assets
                           ├─ link-only ─> approved metadata + Notion URL
                           └─ hidden ────> no output
                                             │
                                             ▼
                              src/content/generated/docs/
```

第一階段只在本機手動同步,不由 React runtime 呼叫 Notion,也不建立 Webhook/Functions。詳見 `DECISION.md` D7 與 `notion-content-sync.md`。

`npm run sync:notion -- --preview` 寫入 gitignored 的 `work/notion-preview/`;正式 `npm run sync:notion` 才原子替換 `src/content/generated/docs/`。同步器使用唯讀 Internal Connection 查詢 Catalog,只對 `full` 取得 Markdown 並本地化圖片;`link-only` 不讀正文,`hidden` 不輸出。Notion API 不會在 render、`next build` 或瀏覽器執行。

## 部署與限制

- `npm run deploy` = `next build && firebase deploy --only hosting`(手動,無 CI)。
- **無 server**:route handler / server action / DB / runtime fetch 都不可行。需要後端(如 AI bot)必須先改部署模型——見 `DECISION.md` D1。
- **視覺漸進增強**:Three.js canvas 只能疊加在靜態圖片／DOM 基礎之上；WebGL 初始化失敗、降低動態或低能力裝置仍須看到完整內容與可用操作。新增 3D 依賴前先比較 bundle 與手機效能。
