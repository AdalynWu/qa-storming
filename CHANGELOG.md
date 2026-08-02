# Changelog

本檔記錄專案的顯著變更。格式參考 [Keep a Changelog](https://keepachangelog.com/);最新在上。
本專案尚未正式版號化,暫以 `Unreleased` + 日期記錄。

## [Unreleased]

### Added
- Moor Know-how POC：`/products/moor` 創作者聖域 Hub、`quick-start`／`live` 章節閱讀器、八章狀態導覽，以及產品地圖／賢者書庫雙入口。(2026-08-01)
- Notion 文件同步第一階段:`QA Storming Sync Lab` 私人 POC、`Website Docs Catalog`、`sync:notion` preview/正式同步、Zod manifest、圖片本地化、原子替換與 fixture tests。(2026-07-26)
- 前端設計治理文件 `DESIGN.md`:記錄圖片主導的溫暖奇幻 RPG 風格、各場景規範、偽 3D 書環、試煉石台、動畫、sprite、RWD 與 accessibility 準則。(2026-07-19)
- 文件治理系統:root 的 `AGENTS.md`、`CHANGELOG.md` 與 `docs/` 的 `PLAN`/`PROGRESS`/`DECISION`/`TASK`/`MEMORY`/`ARCHITECTURE`。(2026-07-19)
- 試煉之森(`/regression` 前的傳送門區)新增 `sprite-lol-dragon` 巨龍雪碧圖動畫 + scroll parallax。
- Regression 知識庫:`/regression` 頁(可搜尋/篩選)、`TrialForestPortal` 轉盤、Google Sheet → `scripts/sync-regression.ts` 同步管線、`src/content/regression.ts`(zod 型別 + 衍生統計)。
- Critter 動畫:`sprite-wolf`(賢者書庫,左→右)、`sprite-bat`(新手村,左下→右上),皆為橫向 6 格雪碧圖。
- 產品世界地圖 `/product-map`、quest book 輪播、`sprite-jelly` 史萊姆嚮導。

### Changed
- 公開 Moor 內容採安全整理版，排除 Notion 原始頁中的內部 Spec／Figma 連結與敏感設定；Google Fonts 改為系統 font stack，讓靜態建置不依賴外部下載。(2026-08-01)
- 非 Regression 文件管線收斂為 Notion `Website Docs Catalog` allowlist:逐份選擇 `full`、`link-only` 或 `hidden`,第一階段採本機手動同步且維持零後端費用。(2026-07-19)
- 治理文件修正為 `src/` 重構後路徑,並統一 Claude/Codex 共同維護 `DESIGN.md`。(2026-07-19)
- **目錄重構**:`app/`、`components/`、`content/` 移入 `src/`;路徑別名 `@/*` 由 `./*` 改為 `./src/*`;`scripts/` 相對路徑與 `OUTPUT_PATH` 同步更新。(2026-07-19)
- 所有 sprite sheet 在使用前重排為等距格,避免動畫裁切。

### Removed
- 汰換舊 critter:`sprite-deer`(→ wolf)、`sprite-owl`(→ bat)及其相關 code/資產。
- 清理空的 stray 目錄(`_sites-preview`、`work`、`outputs`、`.openai`)。
