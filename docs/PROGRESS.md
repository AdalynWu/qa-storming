# PROGRESS — 進度紀錄

dated 進度日誌,**最新在上**。每次完成工作附加一條(日期、做了什麼、影響的檔案、驗證結果)。勿改寫他人既有條目。

---

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
