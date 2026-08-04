# ARCHITECTURE — 系統架構與設計說明

## 總覽

單頁(+ 幾個子路由）靜態網站。**建置期**把內容與 Chatbot 搜尋索引輸出到純靜態 `out/`,由 Firebase Hosting 直接 serve。專案沒有自建 server／API route／DB；Chatbot 執行期先在瀏覽器本地檢索，再透過 Firebase AI Logic 受管 gateway 呼叫 Gemini。

```
Google Sheet ──(手動 npm run sync:regression)──> scripts/sync-regression.ts
                                                   │  (googleapis + zod 驗證)
                                                   ▼
                              src/content/generated/regression.json  (committed)
                                                   │  import + zod parse
                                                   ▼
Figma Master／2026 正式 Mockup ──(唯讀人工安全策展)──> src/content/moor.ts／web.ts／products.ts
                                                   │
                                                   ▼
        src/content/*.ts  ──import──>  src/components/*  ──>  src/app/*/page.tsx
                                                   │  next build (output: export)
                                                   ▼
                                                 out/  ──(firebase deploy)──> Firebase Hosting

Notion generated manifest + approved Markdown ──(prebuild)──> public/chatbot-search-index.json
                                                                    │ 瀏覽器關鍵字檢索（最多 5 chunks）
                                                                    ▼
                                                          Firebase AI Logic + App Check
                                                                    │
                                                                    ▼
                                                        Gemini structured answer + citations
```

## 技術棧

- **Next.js 16** App Router、**React 19**、`output: "export"`(純靜態)、`images.unoptimized: true`。
- **Tailwind CSS v4**(`@import "tailwindcss"`)+ `src/app/globals.css` 手寫 RPG 主題。
- **TypeScript** strict、ESM。**zod** 做內容與 Chatbot index／model response 驗證。**Swiper** 做輪播。**Three.js** 僅作少數沉浸式視覺增強，WebGL 不承載正文或必要操作。
- **Firebase Web SDK** 使用 AI Logic、Gemini Developer API backend 與 reCAPTCHA Enterprise App Check；不在瀏覽器保存 Gemini Developer API Key。
- **googleapis** / **@notionhq/client** / **tsx**(devDeps)給同步腳本；**sharp**(devDep)由 PNG 母檔產生 AVIF／WebP；**Firebase Hosting** 部署。

## 目錄結構

- `src/app/` — App Router:`layout.tsx`(metadata、字型、robots noindex)、`page.tsx`(首頁,client、scroll parallax)、`globals.css`;子路由包含 `product-map/`、`regression/`、`products/`、`library/` 與 `rpg/`(3D 教學遊戲外框＋scoped `rpg.css`)。
- `src/components/` — `KnowledgeChatbot` 全站問答櫃台，以及 `DeferredImmersiveTreeHero`／`ImmersiveTreeHero`、`DeferredLibraryStarfield`／`LibraryStarfield`、`QuestBookCarousel`、`TrialForestPortal`、`LibraryCatalog`、`ErrorCodeExplorer`、`NotionMarkdown`、`MistyForestGate`(迷霧測試林 iframe 閘門)與產品 Know-how 元件。
- `src/hooks/` — `useIsComputerDevice`(以 `useSyncExternalStore` 判斷桌機能力,三態 `null`／`true`／`false`,供 `/rpg` 閘門使用)。
- `src/lib/`／`src/types/` — Chatbot 關鍵字檢索、Firebase／App Check 初始化、AI 問答流程、公開索引與 structured response schema。
- `src/content/` — `quests.ts`、`products.ts`、`library.ts`、`regression.ts`、`moor.ts`／`web.ts`(產品章節資料)、`docs.ts`(Notion manifest schema)、`generated-docs.ts`(build-time 檔案讀取)與 `notion-markdown.ts`(安全 parser);generated 內容位於 `generated/regression.json`、`generated/docs/`。
- `scripts/` — `sync-regression.ts`、`sync-notion.ts`、`build-chat-index.ts`、各自測試／fixtures，以及可重現的 `optimize-images.mjs`。**留在 root。**
- `public/` — 靜態資產；PNG 為 RPG 場景／sprite 母檔，AVIF／WebP 為 `optimize:images` 產生的瀏覽器版本，另含 favicon；`public/rpg/misty-test-forest.html` 為自帶 three.js r128、零外部依賴的完整教學遊戲(由 `/rpg` iframe 載入)。**必須在 root。**
- `docs/` — 治理文件 + `regression-authoring.md`、`notion-content-sync.md`。
- root config:`next.config.ts`、`tsconfig.json`(`@/*`→`src/*`)、`firebase.json`/`.firebaserc`、`eslint.config.mjs`、`postcss.config.mjs`、`package.json`。
- root product truth:`PRODUCT.md`，保存使用者、核心工作流、內容安全邊界與長期限制，供 UI／資訊架構工作共用。

## 路由

- `/` — hero(世界樹)+ fruit 導航 + 新手村 quest 輪播 + 試煉之森傳送門 + 賢者書庫(lore)+ camp。critter:六隻 bat 編隊與 lol-dragon(試煉之森)、wolf(書庫)；jelly 僅作全站固定 Chatbot 入口。
- `/product-map` — 互動產品世界地圖(`continents`)；畫卷只承載產品摘要與產品 Hub 入口，外框固定、內層內容捲動。
- `/products/moor` — Moor 創作者聖域產品 Hub；八章冒險路徑與章節預覽，八章皆已發布。
- `/products/moor/[chapter]` — Moor Know-how 靜態閱讀頁；`quick-start`、`live`、`creator-hub`、`posts`、`chat`、`profile`、`analytics`、`other` 八章皆由 `generateStaticParams` 輸出並採用 approved Notion generated 正文。
- `/products/web` — Web 瀏覽者海岸產品 Hub；八章冒險路徑、發布／待審核狀態與章節預覽。
- `/products/web/[chapter]` — Web Know-how 靜態閱讀頁；八個章節皆由 `generateStaticParams` 輸出並採用 approved Notion generated 正文；`web.ts` 保留為同步產物異常或未來新增章節時的過渡 fallback。
- `/regression` — regression test case 瀏覽(可搜尋/篩選,來自 `regressionSuites`/`regressionCases`)。
- `/library` — 賢者知識書庫；以 client-side 搜尋與書架分類整合產品手冊、QA 參考資料與工具文件。
- `/library/error-codes` — Error Code V2 互動索引；build 時從 approved standalone generated Markdown 表格轉為可搜尋資料，不另存第二份代碼清單。
- `/library/[slug]` — approved standalone Notion 文件閱讀器；目前靜態輸出 `testing-tools`、`maestro`、`appium-mcp`。
- `/rpg` — 迷霧測試林 3D 測試教學副本；站內品牌 topbar ＋ `MistyForestGate` client 閘門，以同源 `<iframe>` 載入 `public/rpg/misty-test-forest.html`(自帶 three.js r128 的完整遊戲)。桌機專屬:首頁入口採 CSS 能力 gate，`/rpg` 內另有三態裝置判斷＋鍵盤/按鈕確認才載入 iframe，手機／觸控顯示擋頁並保留覆寫入口(見 DECISION D25)。

## 資料流與型別

- Regression:Sheet → 腳本(header 對映、list 拆分、唯一/參照完整性檢查、zod parse、`_meta` contentHash、原子寫檔、刪除保護)→ generated JSON → `regression.ts` 於 build 時 parse 並衍生統計。schema 由腳本與 app 共用單一來源(`src/content/regression.ts`)。
- 其他內容(quests/products/lore)目前硬編。Moor／Web 以 `src/content/moor.ts`、`src/content/web.ts` 保存經安全整理的章節 fallback，`products.ts` 只保留地圖摘要。內容可由 Figma Master 與 2026 綠色 Mockup／Ready for dev 人工唯讀盤點後更新；Figma 不在 build 或 runtime 連線，也不把 URL、ticket、留言或敏感設定輸出。已核准且完成 Catalog 映射的產品章節由 generated docs 優先消費。

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

第一階段只在本機手動同步,不由 React runtime 呼叫 Notion,也不建立 Webhook/Functions。Moor／Web 現有八章皆使用 approved generated Markdown；章節 build 時仍先依 manifest 讀取本地 generated Markdown，若未來新增章節尚未完成同步，可分別回退 `moor.ts`／`web.ts`；詳見 `DECISION.md` D20。

`documentType=standalone` 且 `full + published + approved` 的文件可由 `/library/[slug]` 直接閱讀；Error Code 使用同一份 generated Markdown，在 Server Component build 階段解析表格並傳給 client explorer，因此搜尋互動不需要 runtime API，也不會與 Notion 來源分叉。

Notion manifest schema v2 會保存 `Document Type`、`Review Status` 與可選的產品階層欄位。同步器只有在 `Status=published`、`Publish Mode` 非 hidden 且 `Review Status=approved` 時輸出，並拒絕無效的 standalone／hub／chapter 欄位組合、重複產品 hub 與重複產品章節路由。

### Chatbot 文件流

`build-chat-index.ts` 只消費 manifest 中 `publishMode=full`、`reviewStatus=approved` 且有 `markdownPath` 的文件，沿用安全 Notion parser 保留標題、表格、程式碼、API 名稱與錯誤訊息，再輸出 public JSON。問題通過長度驗證後，先以正規化後的精準字串比對人工核准趣味題；命中時直接回傳本地隨機答案，不載入索引、不呼叫 Gemini。未命中才以中文 2–3 字 n-gram、英文／技術詞、標題／章節加權及最低分數門檻取回最多 5 chunks；無結果不呼叫模型。Gemini structured output 必須提供有效 `usedChunkIds`，來源才由前端 allowlist 反查為公開網站連結。模型端 `429`／`5xx` 暫時錯誤會以 400ms、1000ms 退避重試兩次；權限、App Check、模型設定或解析錯誤立即失敗，錯誤訊息不回傳 provider 細節。

`npm run sync:notion -- --preview` 寫入 gitignored 的 `work/notion-preview/`;正式 `npm run sync:notion` 才原子替換 `src/content/generated/docs/`。同步器使用唯讀 Internal Connection 查詢 Catalog,只對 `full` 取得 Markdown 並本地化圖片;`link-only` 不讀正文,`hidden` 不輸出。Notion API 不會在 render、`next build` 或瀏覽器執行。

## 部署與限制

- `npm run deploy` = `npm run build && firebase deploy --only hosting`(手動,無 CI)；`prebuild` 執行圖片預算與 Chatbot 索引重建，不在 deploy 時重新轉圖或連線 Notion。
- **無自建 server**：route handler／server action／DB 仍不可行。Firebase AI Logic 是唯一新增的受管 runtime 服務；正式使用需在 Console enforcement App Check、設定 Web App／reCAPTCHA Enterprise、限制 quota，並將公開 Firebase config 寫入 `.env.local`。App Check 不是登入，未來若索引內部文件仍須另行決定 Authentication／存取控制。
- **視覺漸進增強**:Three.js canvas 只能疊加在靜態圖片／DOM 基礎之上；WebGL 初始化失敗、降低動態或低能力裝置仍須看到完整內容與可用操作。Hero 需持續可見 1.6 秒後再 idle dynamic import；書庫星群則在自身 section 接近 viewport 後才排入 idle 載入。兩者啟用後皆於離屏／隱藏分頁停止 render loop、限制 DPR 並在卸載時釋放 GPU 資源。新增 3D 依賴前先比較 bundle 與手機效能。
- **迷霧測試林遊戲例外**:`/rpg` 是 opt-in、桌機專屬、以同源 iframe 隔離嵌入、**自帶一份 three.js r128**(不共用站上 `three`,也不套用上述裝飾層 idle／離屏規範);只在按鈕/鍵盤確認後才載入 iframe、離開路由才完整停止,`prefers-reduced-motion` 下遊戲僅降低裝飾動態而非完全靜止(第一版取捨,見 DECISION D25)。`public/rpg/*.html` 為公開靜態資產,`noindex`／裝置 gate／隱藏導覽皆非權限控制,上線前須確認遊戲內容不含內部 URL、帳密、Token 或真實缺陷資料。
- **圖片輸出**：編輯 PNG 母檔後執行 `npm run optimize:images`；CSS 場景使用 AVIF → WebP → PNG 的 `image-set()`，JS 動態貼圖優先使用 WebP。`npm run check:images` 的首選 payload 預算為來源 PNG 總量的 35%。
- **首屏資源提示**：root layout 透過 React 19 `preload()` 只提前發現生命樹 AVIF；不可把首屏以下場景或 Three.js idle 貼圖一併設為高優先級。
