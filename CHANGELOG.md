# Changelog

本檔記錄專案的顯著變更。格式參考 [Keep a Changelog](https://keepachangelog.com/);最新在上。
本專案尚未正式版號化,暫以 `Unreleased` + 日期記錄。

## [Unreleased]

### Added
- 試煉之森新增桌機／手機透明門洞前景資產 `rpg-trial-portal-alpha.png` 與 `rpg-trial-portal-mobile-alpha.png`，讓領域景色自然位於石門後方。(2026-08-02)
- 試煉之森新增 941×1672 手機直式場景 `rpg-trial-portal-mobile.png`，提供獨立的傳送門與石台 art direction。(2026-08-02)
- Moor Know-how POC：`/products/moor` 創作者聖域 Hub、`quick-start`／`live` 章節閱讀器、八章狀態導覽，以及產品地圖／賢者書庫雙入口。(2026-08-01)
- Notion 文件同步第一階段:`QA Storming Sync Lab` 私人 POC、`Website Docs Catalog`、`sync:notion` preview/正式同步、Zod manifest、圖片本地化、原子替換與 fixture tests。(2026-07-26)
- 前端設計治理文件 `DESIGN.md`:記錄圖片主導的溫暖奇幻 RPG 風格、各場景規範、偽 3D 書環、試煉石台、動畫、sprite、RWD 與 accessibility 準則。(2026-07-19)
- 文件治理系統:root 的 `AGENTS.md`、`CHANGELOG.md` 與 `docs/` 的 `PLAN`/`PROGRESS`/`DECISION`/`TASK`/`MEMORY`/`ARCHITECTURE`。(2026-07-19)
- 試煉之森(`/regression` 前的傳送門區)新增 `sprite-lol-dragon` 巨龍雪碧圖動畫 + scroll parallax。
- Regression 知識庫:`/regression` 頁(可搜尋/篩選)、`TrialForestPortal` 轉盤、Google Sheet → `scripts/sync-regression.ts` 同步管線、`src/content/regression.ts`(zod 型別 + 衍生統計)。
- Critter 動畫:`sprite-wolf`(賢者書庫,左→右)、`sprite-bat`(新手村,左下→右上),皆為橫向 6 格雪碧圖。
- 產品世界地圖 `/product-map`、quest book 輪播、`sprite-jelly` 史萊姆嚮導。

### Changed
- 手機產品地圖將返回／全圖操作移入獨立 header 操作列；新手村縮短上緣、縮小偽 3D 任務書並增加箭頭間距，手機漢堡點選區段後自動收合。(2026-08-02)
- 首頁與 Regression 文件介面加入 progressive enhancement：手機導覽／果實／CTA 使用原生 link，案例具無 hydration 也能展開的原生典藏；任務書預設可見並縮小桌機尺寸，試煉方向鍵提供 URL fallback，Moor live 修正手機橫向溢出與標題內距。(2026-08-02)
- 首頁主要場景完成 viewport composition：桌機新手村任務書與試煉之森皆在扣除 navbar 後的一屏內完整呈現；手機試煉改為場景內緊湊 HUD、巨龍回到石台，賢者書庫統一標題與垂直間距。(2026-08-02)
- 手機首屏補回三顆魔法果實的區域標籤，史萊姆改為隨下捲由左往右移動；試煉石台輪盤改為巨龍舞台，領域切換集中到具按壓／確認／鎖定回饋的方向按鈕，首頁錨點依 navbar 高度精準對齊。(2026-08-02)
- `quest-zone`、Moor 章節地圖與文件閱讀器完成兩輪場景化改版與響應式驗收：以現有插畫承擔地貌，導入林間任務舞台、地圖光路、木製路標與札記材質；手機閱讀器採單頁羊皮紙並補齊 safe area、44px 觸控尺寸，未增加前台套件。(2026-08-02)
- ESLint 排除 project-scoped agent skill／hook 目錄，避免第三方工具腳本污染應用程式 lint 結果。(2026-08-02)
- 公開 Moor 內容採安全整理版，排除 Notion 原始頁中的內部 Spec／Figma 連結與敏感設定；Google Fonts 改為系統 font stack，讓靜態建置不依賴外部下載。(2026-08-01)
- 非 Regression 文件管線收斂為 Notion `Website Docs Catalog` allowlist:逐份選擇 `full`、`link-only` 或 `hidden`,第一階段採本機手動同步且維持零後端費用。(2026-07-19)
- 治理文件修正為 `src/` 重構後路徑,並統一 Claude/Codex 共同維護 `DESIGN.md`。(2026-07-19)
- **目錄重構**:`app/`、`components/`、`content/` 移入 `src/`;路徑別名 `@/*` 由 `./*` 改為 `./src/*`;`scripts/` 相對路徑與 `OUTPUT_PATH` 同步更新。(2026-07-19)
- 所有 sprite sheet 在使用前重排為等距格,避免動畫裁切。

### Removed
- 汰換舊 critter:`sprite-deer`(→ wolf)、`sprite-owl`(→ bat)及其相關 code/資產。
- 清理空的 stray 目錄(`_sites-preview`、`work`、`outputs`、`.openai`)。
