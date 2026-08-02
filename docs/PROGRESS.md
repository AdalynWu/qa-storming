# PROGRESS — 進度紀錄

dated 進度日誌,**最新在上**。每次完成工作附加一條(日期、做了什麼、影響的檔案、驗證結果)。勿改寫他人既有條目。

---

## 2026-08-02 — Three.js 生命樹 Hero 實作與跨尺寸驗收

- 新增 `three`、`@types/three` 與 `ImmersiveTreeHero`：沿用 `rpg-life-tree.png` 建立 WebGL 全景 shader、樹心柔光、三層空間光塵及游標／捲動差速，語意化文案、導航與 CTA 仍維持 DOM。
- WebGL 貼圖成功後才淡入，建立失敗或 `prefers-reduced-motion` 時保留原 CSS 場景；限制 DPR、離開 viewport／頁面隱藏時暫停繪製，卸載時釋放 texture、geometry、material 與 renderer。
- 未改動 Regression、Notion 同步、Firebase Hosting 或純靜態輸出架構。
- **驗證**：ESLint、`tsc --noEmit`、`next build --webpack` 通過；本地靜態輸出以 1440×900、390×844 實機瀏覽器驗證 canvas 正常、主文案與三個入口無遮擋、無水平溢位，並清除 Three.js runtime warning。預設 Turbopack build 在 sandbox 長時間無輸出後中止，改用專案既有的 webpack 驗證路徑。未執行 Git 或部署。

## 2026-08-02 — 手機導覽、任務書與透明傳送門收尾

- 產品世界地圖手機 header 改為兩列結構，標題與 44px 高的返回／全圖操作分列，避免控制項貼住地圖邊界；地圖可用高度同步扣除新版 header。
- 新手村手機上緣改為 24–36px 的場景節奏，偽 3D 任務書縮至最多 232px 寬並降低前推深度，左右箭頭各保留獨立觸控空間。
- 手機漢堡選單點擊任一區段連結後會立即收合，保留原生 `details` 的無 JavaScript 導覽能力。
- 使用 ImageGen 依原始構圖產生桌機／手機傳送門版本，再以色鍵遮罩建立 `rpg-trial-portal-alpha.png` 與 `rpg-trial-portal-mobile-alpha.png`；門洞透明、外圍場景保留，Regression 領域景色改為鋪在前景石門下方。
- **驗證**：ESLint、`tsc --noEmit` 與 `next build --webpack` 通過，靜態輸出路由完整。Codex sandbox 禁止綁定本機 port，無法在本次工作內啟動 live preview；已完成透明度、尺寸與靜態建置檢查。未執行 Git 或部署。

## 2026-08-02 — 手機核心操作漸進式增強與文件版面修復

- 首頁品牌、桌機導覽、手機漢堡、三顆魔法果實、「開始冒險」與向下提示改用原生 anchor／`details`，即使 React 尚未 hydration 仍能完成區段導覽；固定 navbar 由既有 `scroll-margin-top` 對齊。
- 任務書取消「JavaScript 啟動前預設透明」狀態，手機可直接看見中央書；桌機書寬、3D 前推量與文字安全區縮小，避免底部裁切及文案碰到封面裝飾。
- 試煉之森方向控制改為具目標 URL 的 Link：JavaScript 正常時保留逐格旋轉，未啟動時仍可直接進入上一／下一 Regression module。
- `/regression` 新增伺服器輸出的原生手機案例典藏，以巢狀 `details` 展開完整前置條件、測試資料、步驟與預期結果；不再把案例閱讀完全綁在 client state。
- Moor 章節閱讀器補上 grid/flex 子元素 `min-width: 0`、shell 橫向邊界與手機內容寬度；章節地圖標題增加內距，修正 `/products/moor/live` 橫向目錄撐破 viewport 與文字貼邊。
- **驗證**：ESLint、`tsc --noEmit`、Regression tests 14/14、`next build --webpack` 皆通過；靜態輸出包含首頁原生導覽、Regression fallback 與 Moor live 路由。Impeccable 本次變更檔掃描僅回報 `regression.css` 兩項既有粗邊框規則，與本次新增區塊無關。未執行 Git、部署或新增依賴。

## 2026-08-02 — 首頁場景一屏化與手機垂直節奏修正

- 新手村任務書移除元件內寫死的 315px／3D 位移 inline style，改由 CSS class 與 viewport 高度完整接管；桌機使用 `100dvh - 82px navbar`，書本尺寸、標題與軌道間距會隨可用高度縮放，主要元素不再落到首屏之外。
- 試煉之森在桌機、平板與手機皆改為 `100dvh - navbar` 的完整場景；`realm-info-panel` 維持場景內 HUD，手機縮減次要提示但保留 44px 方向鍵與 CTA，巨龍上移至石台位置。
- 手機新手村與賢者書庫統一標題置中與 section 上緣節奏；書庫移除過大的桌機式頂部留白，典藏條目改為穩定的兩欄內容結構。
- 同步更新 `DESIGN.md` 的一屏場景、手機 HUD 與標題對齊規範；未新增前台套件。
- **驗證**：ESLint、`tsc --noEmit` 與 `next build --webpack` 通過，所有靜態路由成功輸出。預設 `npm run build` 的 Turbopack 因 Codex sandbox 禁止綁定內部 port 失敗，屬既有環境限制而非程式錯誤。未執行 Git 或部署。

## 2026-08-02 — 手機首屏與試煉之森互動修正

- 首屏三顆魔法果實在手機版恢復 `ONBOARDING／REGRESSION／KNOW-HOW` 與中文名稱，改採果實下方的小型實體標籤，保留 3 個清楚可辨識的導航入口。
- 史萊姆的 scroll parallax 改為隨向下捲動由左往右移動；實測 bounding box X 座標由 `37.5` 增至 `87.06`。
- 以現有桌機插畫為參考新增 `public/rpg-trial-portal-mobile.png`（941×1672）直式場景；手機門洞重新校準為獨立座標，動態 `realm-landscape-image` 完整填滿開口。
- 移除試煉石台符文盤、拖曳與相關 state／CSS；守護巨龍移至場景元件內並固定站在石台中央。領域改由左右方向按鈕循環切換，加入按壓、確認閃光、切換鎖定與 CTA 暫時停用回饋。
- 首頁區段跳轉改為依 `.rpg-nav` 實際高度計算 scroll top，同時保留 `scroll-margin-top` fallback；實測手機目標距頂 `68.19px`／navbar `68px`，桌機目標距頂 `81.9px`／navbar `82px`。
- 601–900px 改採「完整橫幅場景＋下方資訊組」，並縮放巨龍避免平板場景裁切；手機維持「直式場景＋下方資訊組」，桌機維持右下疊層。
- **驗證**：375px 與 1440px live visual QA 無水平溢出；魔法果實文字、手機直式傳送門、門洞景色、巨龍平台與資訊面板均正常。ESLint、`tsc --noEmit`、Impeccable detector 0 findings、Regression tests 14/14、`next build --webpack` 全數通過。未執行 Git 或部署。

## 2026-08-02 — 次要場景視覺升級第二輪驗收

- 依 `ui-ux-pro-max` 的 mobile-first／touch target 建議與 Impeccable 的適配、craft floor 規範，實看驗證 375px 手機、768px 平板與 1440px 桌機的 `quest-zone`、`moor-journey`、`moor-reader-layout`。
- Moor 手機閱讀器改為真正的單頁羊皮紙：移除穿越正文的中央頁縫、保留頁邊裝訂痕跡，加入 safe-area padding、44px 點擊高度、觸控最佳化及橫向目錄的 overscroll 控制。
- 新手村輪播手機箭頭由 39px 提升至 44px，維持偽 3D 書環、拖曳與左右切換；375px 實看確認書本仍是主要焦點，頁面無水平溢出。
- 保留試煉石台刻意的卡榫回彈曲線，並以單行 Impeccable 例外註解記錄其物理感設計原因，未停用其他設計檢查。
- **驗證**：ESLint、`tsc --noEmit`、Impeccable detector 0 findings、Regression tests 14/14、`next build --webpack` 靜態輸出成功；375px／768px 均無 body 水平溢出。`npm run test:regression` 在 Codex sandbox 因 `tsx` IPC socket 權限失敗，改用等價的 `node --import tsx --test` 通過。未執行 Git、部署或新增 runtime 依賴。

## 2026-08-02 — 次要場景視覺升級第一輪

- 使用 `ui-ux-pro-max` 的本地設計資料庫與 Impeccable 對 `quest-zone`、`moor-journey`、`moor-reader-layout` 進行分析；保留專案既有森林綠、羊皮紙、古金、插畫與語意化 DOM，捨棄工具產出的通用 Bento／藍色 SaaS 建議。
- `quest-zone` 從抽象單色山形改為生命樹林間空地：以現有插畫作場景、加入中央聚光、地面景深、邊緣暗角與標題光紋；書環仍是唯一主要焦點，未增加 runtime 套件。
- `moor-journey` 改為產品世界地圖上的探索路徑：地圖承擔地貌，符文節點與光路為互動層，右側保留高對比羊皮紙章節詳情；CTA 從通用 pill 改為書扣式輪廓。
- `moor-reader-layout` 改為木製章節路標＋展開典籍＋冒險札記的實體材質組合；新增書頁中縫與背景世界地圖，移除 callout 粗側邊色條及 detector 判定的粗弧線 border。
- Impeccable 安裝目錄造成 ESLint 掃入第三方工具碼，已在 `eslint.config.mjs` 排除 `.agents/`、`.claude/`、`.codex/`，維持應用程式 lint 訊號乾淨。
- **驗證**：ESLint 零警告、`tsc --noEmit`、Impeccable detector 0 findings、`next build --webpack` 成功；桌機實看已驗證新手村與 Moor 探索地圖。Moor 閱讀器與手機視覺第二輪因本機預覽服務中途停止而待補，功能與靜態輸出已通過。未執行 Git 或部署。

## 2026-08-02 — UI 工具鏈確認＋沉浸式技術邊界定案

- 確認 project-scoped Impeccable 已安裝於 `.agents/skills/impeccable/`，並新增 `.codex/hooks.json` 於 UI 編輯後執行設計檢查；它與全域 `ui-ux-pro-max` 都是 agent 開發工具，不會進入網站 runtime bundle。
- 比對現有依賴與 `ImmersiveTreeHero`：專案已使用原生 Three.js，包含 WebGL fallback、DPR 上限、viewport 暫停、資源清理與 reduced-motion 跳過；目前不新增 React Three Fiber、Drei、GSAP 或其他 3D runtime 依賴。
- 定案採漸進式混合架構：圖片／HTML／CSS 承擔文件與主要場景，Three.js 僅用於少數沉浸式背景、粒子及深度過場；文字、CTA、表單與長篇閱讀不得放入 canvas。
- 檢查 VS Code 顯示的 root `app/`、`components/`、`content/` 刪除項目：13 個舊路徑皆有 `src/` 對應檔，為 2026-07-19 目錄重構的正常結果；`.codex/hooks.json` 為 Impeccable 新增檔案。
- Codex 內建 shell 的 npm registry 失敗來自 sandbox 對外網路／DNS 限制，不是 npm、Notion 或本機檔案權限問題。未執行 Git、程式碼改動、建置或部署。

## 2026-08-02 — ui-ux-pro-max 全域安裝完成

- 使用者已完成 `ui-ux-pro-max` 全域安裝；skill 位於 `~/.agents/skills/ui-ux-pro-max`，`SKILL.md` 完整存在。
- Codex 可直接使用 universal skill，Claude Code 已建立 `~/.claude/skills/ui-ux-pro-max` symlink；後續 UI 設計與 review 可啟用本地設計資料庫。
- 安裝輸出的 PromptScript global integration 失敗不影響本專案，因 QA Storming 使用 Codex 與 Claude Code。
- Impeccable 尚未確認安裝，保留為後續 UI audit 工具待辦。未執行 Git、程式碼改動、建置或部署。

## 2026-08-02 — UI 設計輔助工具評估＋Notion Catalog 定位

- 確認 `QA Storming Sync Lab` 為 SWAG Notion 工作區根層的私人 POC 頁面，`Website Docs Catalog` database 位於其下；Catalog 目前維持 `Title`、`Source Page URL`、`Slug`、`Category`、`Order`、`Summary`、`Publish Mode`、`Status`、`Owner`、`Last edited time`，尚未加入產品／章節階層欄位。
- 評估 `ui-ux-pro-max` 與 `impeccable` 作為設計系統建議、反模式掃描與 accessibility review 輔助；它們不得取代專案 `DESIGN.md`、既有插畫語言或人工視覺判斷。
- 將次要場景的視覺品質基準補入 `DESIGN.md`：`quest-zone`、`moor-journey`、`moor-reader-layout` 應採敘事型場景與實體材質介面，降低通用漸層面板、制式膠囊按鈕與抽象幾何背景的比例。
- 嘗試安裝兩項工具，但目前 Codex sandbox 無法解析 `registry.npmjs.org`，指令以 `ENOTFOUND` 中止，專案與全域 skill 目錄均未被修改；待使用者本機 Terminal 具網路環境時完成。
- 未執行 Git、程式碼改動、建置或部署。

## 2026-08-01 — Moor 產品 Hub＋兩章 Know-how POC

- 以既有 Notion「Moor App 使用手冊」為來源，建立安全整理版 `src/content/moor.ts`；八章皆有導覽資料，「快速入門」與「直播功能」提供完整閱讀內容，其餘六章標記待審核。
- 新增 `/products/moor` 創作者聖域 Hub 與 `/products/moor/[chapter]` 靜態章節閱讀器；支援章節選取、封印狀態、章內錨點、前後章導覽、手機版與 `prefers-reduced-motion`。
- 產品世界地圖的 Moor 詳情與首頁賢者書庫新增入口；未將 Notion 的內部 Spec／Figma 連結、帳號或敏感設定打包進公開網站。
- 移除 `next/font/google` runtime build fetch，改用系統 font stack，避免離線或受限網路建置因 Google Fonts 失敗。
- **驗證**：ESLint 零警告、`tsc --noEmit`、Notion tests 8/8、Regression tests 14/14、`next build --webpack` 成功；靜態輸出包含 `/products/moor`、`quick-start`、`live`。預設 Turbopack 在 sandbox 因無法綁定內部 port 而失敗，屬執行環境限制。未執行 Git 或部署。

## 2026-07-26 — Notion 私人 POC＋手動同步器

- 透過 Notion MCP 在 SWAG 工作區 Private 區域建立 `QA Storming Sync Lab`、`Website Docs Catalog` 與四種 POC:兩篇 `full + published`、一篇 `link-only + published`、一篇 `hidden + draft`。
- 新增 `@notionhq/client`、`scripts/sync-notion.ts`、`src/content/docs.ts`、空白 generated manifest、fixture 與 `test:notion`;支援 Catalog schema 驗證、固定排序、Markdown、圖片本地化、preview、原子替換與已發布文件移除保護。
- 新增 `.env.example`;`.env.local` 預填非機密 data source ID,保留 `NOTION_TOKEN` 空值等待唯讀 Internal Connection。
- 驗證 Catalog 四筆資料排序與狀態正確;缺 token 時 `sync:notion -- --preview` 以非零碼安全結束且不產生輸出。
- **驗證**:`test:notion` 8/8、`test:regression` 14/14、ESLint、`tsc --noEmit`、`next build` 全數通過。未執行 Git、部署或 GitHub Actions。

## 2026-07-19 — 治理文件校對 + DESIGN 規範

- 完整閱讀 Claude 建立的治理文件,並以實際 `src/`、元件、CSS、圖片資產與 repository metadata 交叉核對。
- 新增 root `DESIGN.md`:定義圖片主導的溫暖奇幻 RPG 設計語言、色彩/字體、首頁與子頁場景、偽 3D 書環、試煉石台、動畫、sprite、RWD、accessibility 與變更流程。
- 修正 `AGENTS.md` / `CLAUDE.md` 的 DESIGN 路徑、共同維護責任與目前 `main` 分支說明。
- 修正 `CLAUDE.md` / `MEMORY.md` 對靜態輸出的預覽說明:`next start` 不適用 `output: "export"`,應使用 Firebase Hosting Emulator 或靜態伺服器開 `out/`。
- 將非 Regression 文件方向從「未定」更新為 Notion Catalog allowlist＋第一階段本機手動同步;同步調整 PLAN、TASK、DECISION、ARCHITECTURE、MEMORY 與 CHANGELOG。
- 修正 `notion-content-sync.md`、`regression-authoring.md` 內重構前的 `content/...` 路徑為 `src/content/...`。
- **驗證**:僅修改 Markdown 文件;檢查治理文件互相連結、路徑與目前專案結構一致。未執行 Git 指令、程式 build、部署或功能修改。

## 2026-07-19 — 目錄重構 + 文件治理系統

- **目錄重構**:`app/`→`src/app/`、`components/`→`src/components/`、`content/`→`src/content/`(純 `mv`,git 由使用者處理)。
  - `tsconfig.json`:`@/*` 由 `./*` → `./src/*`(所有 `@/` import 不需改)。
  - `scripts/sync-regression.ts`:import `../content/regression`→`../src/content/regression`;`OUTPUT_PATH`→`src/content/generated/regression.json`。
  - `scripts/sync-regression.test.ts`:import 路徑同步更新。
  - `CLAUDE.md`:架構段路徑與別名說明更新為 `src/`,並加治理文件指引。
- **文件治理系統**:新增 `AGENTS.md`、`CHANGELOG.md`(root)與 `docs/{PLAN,PROGRESS,DECISION,TASK,MEMORY,ARCHITECTURE}.md`。`DESIGN.md` 由 Codex 另建。
- **Dead-code/檔案檢查**:無孤兒檔;無有意義的死碼(`getCasesForSuite` 為未使用但保留的便利 helper;其餘「未使用 export」皆為模組內部使用的型別,屬誤報)。`.critter` CSS 仍由 bat 使用,無 owl/deer 殘留。
- **驗證**:`npm run build` 綠燈(`/`、`/product-map`、`/regression`);`npm run lint` 乾淨;`npm run test:regression` 14/14 通過。

## 在此之前(重構前的既有成果摘要)

- Regression 知識庫(`/regression` + `TrialForestPortal` + Sheet 同步管線)、產品世界地圖、quest 輪播、critter 動畫(jelly/wolf/bat/lol-dragon,雪碧圖重排成等距格)已完成。詳見 `PLAN.md` 已完成 milestone 與 `CHANGELOG.md`。
