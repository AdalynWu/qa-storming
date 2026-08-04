# PLAN — 專案計劃與 Roadmap

`qa-storming`:QA 團隊知識中心單頁站(RPG 風、靜態、Firebase)。目標是把團隊的測試知識(onboarding、regression、know-how)以沉浸式介面呈現,並讓文件易於維護。

## 已完成 Milestone

- ✅ **RPG 視覺皮膚** — 世界樹 hero、fruit 導航、視差景深(scroll-driven)。
- ✅ **產品世界地圖** — `/product-map` 互動大陸/產品瀏覽。
- ✅ **Quest 輪播** — 首頁 `QuestBookCarousel`(Swiper),新手村任務書。
- ✅ **Regression 知識庫** — `/regression`(可搜尋/篩選)+ `TrialForestPortal` 轉盤 + Google Sheet 同步管線(`sync-regression.ts` → generated JSON → zod 模組)。
- ✅ **Critter 動畫** — jelly / wolf / bat / lol-dragon 雪碧圖(皆重排成等距格避免裁切)。
- ✅ **目錄重構 + 文件治理系統** — 原始碼進 `src/`;新增 AGENTS/CHANGELOG/PLAN/PROGRESS/DECISION/TASK/MEMORY/ARCHITECTURE/DESIGN。(2026-07-19)
- ✅ **Moor Know-how POC** — `/products/moor` 產品 Hub＋「快速入門／直播功能」章節閱讀器，產品地圖與賢者書庫雙入口。(2026-08-01)
- ✅ **Web 2026 Know-how** — `/products/web` 產品 Hub＋八個已整理章節；SWAG Master sitemap 的 14 個主域已映射到公開 QA 路徑，產品地圖收斂為摘要入口。(2026-08-03)
- ✅ **次要場景視覺升級** — `quest-zone` 林間任務舞台、`moor-journey` 世界地圖路徑與 `moor-reader-layout` 實體典籍材質；完成 375px／768px／1440px live visual QA 與觸控收尾。(2026-08-02)
- ✅ **Three.js 生命樹 Hero** — 以原生 Three.js 建立全景 shader、空間光塵與鏡頭差速，保留圖片／DOM fallback、reduced-motion 與純靜態輸出。(2026-08-02)
- ✅ **圖片效能管線** — PNG 母檔可重現產生 AVIF／WebP，場景與 sprite 使用現代格式 fallback，prebuild 以體積預算防止回退。(2026-08-02)
- ✅ **Notion 手動同步前台 POC** — 獨立 Workspace／Connection／Catalog、Moor quick-start 正式同步，以及 generated Markdown 優先／`moor.ts` fallback 的靜態閱讀流程。(2026-08-03)
- ✅ **Web Notion 八章遷移** — Web 八章來源頁與 Catalog 映射全部完成，皆為 `full + published + approved`，網站閱讀器全數使用 generated Markdown。(2026-08-03)
- ✅ **賢者知識書庫第一版** — `/library` 查詢櫃台＋分類書架、Error Code V2 互動索引、測試工具／Maestro／Appium MCP generated 文件閱讀器，以及首頁 Quest Books／書庫入口補齊。(2026-08-03)
- ✅ **站內 AI 知識 Chatbot 第一版** — approved Markdown build-time 索引、中文／英文關鍵字檢索、Firebase AI Logic＋Gemini structured answer、來源驗證、App Check 與全站賢者問答 UI；Console 正式設定待使用者完成。(2026-08-04)
- ✅ **Moor Notion 八章遷移** — Moor 八篇來源與 Catalog 映射全部完成，皆為 `full + published + approved`；八個靜態章節閱讀器全數使用 generated Markdown，並納入 Chatbot 文件索引。(2026-08-04)
- ✅ **正式 Regression Google Sheet 串接** — `.env.local` 已設定正式 Sheet 與唯讀 Google 憑證，手動同步管線可更新 generated JSON；目前產出為 Web Production 1 個 Suite、71 個 Cases。(2026-08-04)
- ✅ **迷霧測試林 3D 教學副本整合** — `/rpg` 以同源 iframe 隔離嵌入自帶 three.js 的完整教學遊戲，首頁桌機專屬入口(CSS 能力 gate)＋`/rpg` 三態裝置判斷、鍵盤確認與 iframe 焦點交接，手機擋頁＋覆寫入口；決策見 `DECISION.md` D25。後續加關卡/調整另議。(2026-08-04)

## 進行中 / 待決(見 `docs/TASK.md` 優先級)

- 🔲 **自動部署(CI)** — 目前 deploy 全手動;是否導入 GitHub Actions(排程/手動觸發)使內容更新自動上線。

## 里程碑更新規範

完成一個 milestone 時,把它從「進行中」移到「已完成」並加日期;重大方向調整時更新本檔並在 `DECISION.md` 記錄原因。
