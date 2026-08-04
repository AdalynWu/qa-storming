# MEMORY — 長期知識與專案慣例

不常變、但每次都該記得的事。踩雷/發現新慣例時附加。

## 慣例

- **Chatbot 知識邊界**：`build-chat-index.ts` 只能依 generated manifest 索引 `full + approved + markdownPath`，不可遞迴抓 repo 所有 Markdown。`prebuild` 從現有 generated 內容重建索引，但不執行 `sync:notion`；需要更新來源時使用 `npm run refresh:notion`。公開來源由有效 `usedChunkIds` 反查網站路由，不信任模型提供的任意 URL。
- **文案**:繁體中文為主 + 英文 RPG 大寫標籤(ONBOARDING / REGRESSION / KNOW-HOW;新手村 / 試煉之森 / 賢者書庫)。
- **內容資料**:硬編在 `src/content/*.ts`(型別 + 陣列)。regression 例外:由 `generated/regression.json` 經 zod parse 載入。要改卡片/文案 → 改對應 `src/content/*` 或 `src/app/*/page.tsx`。
- **樣式**:`src/app/globals.css` 手寫 RPG 主題(CSS 變數調色盤;景深/互動靠 `scrollY` 位移)。critter parallax 都是 `translate(...(scrollY - base) * factor...)` 形式,base/factor 可調。
- **路徑別名**:`@/*` → `src/`。新 import 用 `@/content`、`@/components`。`scripts/` 在 root,用相對路徑 `../src/content/...`。
- **TypeScript**:strict、`noEmit`、`moduleResolution: bundler`、ESM(`"type": "module"`)。
- **Node** `>=22.13`。
- **UI 任務**:開工前讀 root `DESIGN.md`;場景與主要物件以一致畫風圖片主導,CSS 做排版/光影/動畫,JSX 管狀態。完成時驗證桌機、手機、鍵盤與 `prefers-reduced-motion`。
- **非 Regression 文件**:使用 Notion `Website Docs Catalog` allowlist＋`npm run sync:notion`。`full` 只用於核准公開內容;內部文件用 `link-only` 回 Notion;未加入 Catalog 或 `hidden` 不輸出。第一次先加 `-- --preview`,輸出到 `work/notion-preview/`。
- **Notion 章節消費順序**:產品閱讀器在 build time 先找 `src/content/generated/docs/` 的 approved `Product Key + Chapter Slug`；沒有 generated 項目時，Moor／Web 分別使用 `moor.ts`／`web.ts`。不要在元件 render 時 fetch Notion；manifest 指到缺失／越界 Markdown 應讓 build 失敗，不可靜默吞掉產物損壞。
- **Notion standalone 消費**:`full + published + approved + standalone` 可由 `/library/[slug]` 在 build time 讀取 generated Markdown。需要互動索引時，優先從同一份 generated 內容解析結構化資料，不另手抄第二份清單；Error Code V2 即採此模式。
- **產品 Know-how 路由**:世界地圖只做產品概覽；長篇內容使用 `/products/<product>` Hub＋`/products/<product>/<chapter>` 閱讀器。原始 Notion 若含內部 Spec、Figma、帳號或設定，不可直接複製到公開靜態頁，須先做安全整理與 QA 審核。
- **外部 UI skills**:`ui-ux-pro-max`、`impeccable` 等工具只用於設計建議、反模式與 accessibility audit；不得覆蓋 `DESIGN.md` 或把既有奇幻插畫場景改成通用 SaaS UI。
- **ui-ux-pro-max 安裝位置**:全域 skill 位於 `~/.agents/skills/ui-ux-pro-max`，Claude Code 經 `~/.claude/skills/ui-ux-pro-max` symlink 共用；新 UI 任務先依其 workflow 產生建議，再以 `DESIGN.md` 做衝突裁決。
- **Impeccable 安裝位置**:project-scoped skill 位於 `.agents/skills/impeccable/`；`.codex/hooks.json` 會在 UI 編輯後執行檢查。這些是開發工具，不是 `package.json` runtime dependency，也不會傳給網站訪客。
- **沉浸式技術邊界**:WebGL 是瀏覽器繪圖 API，Three.js 是目前採用的抽象層。場景插畫、文件、CTA 與導覽維持圖片＋語意化 DOM；Three.js 只作少數漸進式視覺增強，不用 raw WebGL 重寫，也不在沒有量測需求前加入 R3F／Drei／GSAP。
- **Three.js 載入／迴圈**：用 `DeferredImmersiveTreeHero` 在 Hero 持續可見 1.6 秒後再進入 idle dynamic import；暖機前離屏或直接進入下方 hash 不下載，reduced-motion 也不下載場景。renderer 使用 `setAnimationLoop`，viewport 離屏或 `document.hidden` 時傳入 `null`，不可只在持續排程的 RAF 內 early return。
- **首屏以下 Three.js**：以場景自身 Intersection Observer 作 dynamic import 閘門；書庫使用 `DeferredLibraryStarfield`，接近 viewport 才 idle 載入，手機降低粒子數且 reduced-motion 不掛 canvas。靜態背景必須先完整成立，canvas 只加裝飾層。
- **遊戲類 Three.js（非裝飾層）**：像 `/rpg` 迷霧測試林這種**完整互動遊戲**用**同源 `<iframe>` 執行/樣式隔離**嵌入 `public/rpg/*.html`（自帶自己的 three build，不共用站上 `three`、不套裝飾層 idle/離屏規範），與 Deferred 裝飾層模式區分。桌機能力判斷用 `src/hooks/useIsComputerDevice`（`useSyncExternalStore` 三態 `null/true/false`：`min 1024×600` 且非 `(hover:none) and (pointer:coarse)`；刻意不偵測滑鼠，因核心是鍵盤）。導覽入口用純 CSS gate 避免 hydration 位移；`/rpg` 內用按鈕/鍵盤確認 + `onLoad` 同源交接焦點到遊戲 `#start`。iframe 未加 sandbox＝只做執行/樣式隔離、非安全邊界，且 `public/` 為公開資產，內容須確認不含機密（見 DECISION D25）。
- **圖片母檔與衍生檔**：`public/*.png` 是可編輯母檔；AVIF／WebP 由 `npm run optimize:images` 重現產生，不手改衍生檔。CSS 場景使用 `image-set()`，Three.js 等 JS 貼圖使用 WebP；`prebuild` 的 `check:images` 會檢查缺檔、是否確實縮小與 35% 首選 payload 預算。
- **圖片 preload**：只 preload 首次視口真正的 LCP 候選，目前是 `rpg-life-tree.avif`。在 Next／React 19 使用 `react-dom` 的 `preload()`；直接在 root layout 手寫 `<head><link rel="preload">` 會因資源提升產生重複提示。每次 build 後確認 `out/index.html` 僅一筆且實際請求不重複。
- **響應式場景資產**:核心場景若包含必須完整保留的門框、平台或角色舞台，手機版應使用獨立直式 art direction 圖，不以桌機 16:9 圖過度放大裁切；desktop／mobile 門洞或熱點座標需分開校準。
- **固定導覽錨點**:首頁區段跳轉需依 `.rpg-nav` 實際高度扣除，並以 `scroll-margin-top` 作直接 hash navigation fallback。
- **一屏場景尺寸**:`quest-zone`、`trial-forest-zone` 等沉浸式主要場景以 `100dvh - navbar` 計算可視高度；內容必須依高度流動縮放，禁止只靠 `overflow: hidden` 裁掉標題、控制器或資訊面板。手機重要 HUD 留在場景內時，優先精簡次要提示並保留 44px 操作區。
- **核心操作 fallback**：固定導覽、手機選單、區段入口與文件詳細內容必須有原生 anchor／`details` 路徑；不要只提供 React `onClick`。進場動畫的 CSS 初始狀態預設可見，僅在增強狀態 class 出現後播放隱藏→顯示過場。
- **行動版 grid 溢出**：`grid-template-columns: 1fr` 不代表子項一定能縮小；文件閱讀器、橫向目錄與長文容器需在 grid item 設 `min-width: 0`，橫向捲動只留在明確的內層 scroll container。
- **`content-visibility` 與 hash**：不要直接套在首頁 `#onboarding`／`#regression`／`#knowhow` section。2026-08-03 實測 `content-visibility: auto` 會讓冷啟動 `#knowhow` 錨點落錯位置；若要延後場景，優先延後純裝飾資源或 client 增強，不改變 hash target 的 layout relevance。

## 地雷

- **App Check 不是 Auth**：Firebase AI Logic Web SDK 可在純靜態站使用且不暴露 Gemini Developer API Key，但 App Check 只證明請求來自核准 app，不限制使用者身分。現階段索引只能放公開安全版內容；內部文件仍需 Authentication／存取控制。
- **純靜態**:`output: "export"`——無 server / API route / DB。加後端要先改部署模型。
- **`public/` 必須在 repo root**(Next 要求),不可移進 `src/`。
- **Sprite sheet 必須等距格**:原始素材各格常非等距且內容溢出格線,直接用固定 stride 的 CSS `steps()` 會裁切到鄰格。**使用前先用 PIL 重排**:抓每格內容 bbox → 置中進等距方格(留白 ≥ 數十 px)→ 驗證接縫無內容。橫向片 用 `background-size: auto var(--sprite-size)` + `*Cycle` 走 X;直向片(如 jelly/dragon)用共享 `animalCycle` 走 Y。
- **圖片更新順序**：先完成場景／sprite PNG 母檔與等距格檢查，再執行 `npm run optimize:images`。不可只替換 PNG 而留下舊 AVIF／WebP，否則瀏覽器仍會顯示舊衍生檔，且 build 只會驗體積、無法判斷畫面內容是否同步。
- **部署一步到位**:`npm run deploy` 已含 `next build`,別再手動 `build && deploy`(會 build 兩次)。首次需 `firebase login` 且有 `qa-storming` 專案權限。
- **靜態輸出預覽**:`next start` 不適用 `output: "export"`;build 後用 Firebase Hosting Emulator 或一般靜態伺服器開 `out/`。
- **Secrets**:放 gitignored `.env.local`,由 `process.loadEnvFile` 載入;Google 用唯讀 service-account JSON(`GOOGLE_APPLICATION_CREDENTIALS` 指向路徑),不用 inline key。私有 Sheet 需分享給 service account 的 `client_email`。
- **Notion secrets**:`NOTION_TOKEN` 只能是專案專用的唯讀 Internal Connection token,不可使用 `NEXT_PUBLIC_*`、React runtime 或 Hosted MCP OAuth 取代。`NOTION_DOCS_DATA_SOURCE_ID` 是 Catalog 的 data source ID;Catalog 與 full 來源頁都需分享給 connection。
- **regression 同步刪除保護**:`active` case 從 Sheet 消失會報錯,須先在 Sheet 標 `archived`;僅替換內建 sample 才用 `--replace-sample-baseline`。
- **robots noindex** 目前開著(`layout.tsx`)。
- **Git 由使用者本人操作**,agent 不跑 git 指令。
- **離線建置字型**:不要用 `next/font/google` 讓 production build 即時抓字型；目前使用系統 sans／mono stack，避免受限網路建置失敗。
- **並行**:Claude 與 Codex 同時開發,dated 文件條目採附加/最新在上/勿改寫。
- **Codex sandbox 網路**:工具 shell 可能無法解析 `registry.npmjs.org`；這是執行環境的 outbound DNS／network 限制，不代表套件不存在或使用者帳號無權限。需下載 npm 套件時可由使用者在本機 Terminal 執行，再由 agent 驗證結果。
