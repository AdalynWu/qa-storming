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
- ✅ **次要場景視覺升級** — `quest-zone` 林間任務舞台、`moor-journey` 世界地圖路徑與 `moor-reader-layout` 實體典籍材質；完成 375px／768px／1440px live visual QA 與觸控收尾。(2026-08-02)
- ✅ **Three.js 生命樹 Hero** — 以原生 Three.js 建立全景 shader、空間光塵與鏡頭差速，保留圖片／DOM fallback、reduced-motion 與純靜態輸出。(2026-08-02)

## 進行中 / 待決(見 `docs/TASK.md` 優先級)

- 🔲 **Moor Notion 正式同步** — POC 已建立；待完成 Internal Connection 實機驗證、為 Catalog 補產品／章節映射，並逐章完成安全審核後取代暫時的 curated TypeScript 內容。
- 🔲 **自動部署(CI)** — 目前 deploy 全手動;是否導入 GitHub Actions(排程/手動觸發)使內容更新自動上線。
- 🔲 **填入正式 Regression Sheet** — 目前為 sample baseline,待接上團隊實際 Google Sheet。

## 之後(暫不做)

- ⏸️ **站內 AI bot / RAG** — 從知識庫回答;需引入 key-holding serverless 端點,會離開純靜態,延後。

## 里程碑更新規範

完成一個 milestone 時,把它從「進行中」移到「已完成」並加日期;重大方向調整時更新本檔並在 `DECISION.md` 記錄原因。
