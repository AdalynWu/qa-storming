# TASK — 待辦事項與優先級

狀態:🔴 高 / 🟡 中 / 🟢 低 / ⏸️ 暫緩。領取/完成/新增時更新本檔;完成的任務移到底部「已完成」並附日期。

## 待辦

- 🔴 **完成 Notion Internal Connection 實機驗證** — 程式與私人 POC 已完成;待 Workspace Owner 建立/確認唯讀 `QA Storming Docs Reader`、將 Sync Lab 分享給它、填入 `NOTION_TOKEN`,再跑 preview 並手動加入一張安全測試圖片。
- 🟡 **在 Website Docs Catalog 實際新增產品階層欄位** — 程式端 schema v2、同步器與 fixtures 已完成；待有 Notion 編輯權限的人員在 `QA Storming Sync Lab` Catalog 新增 `Product Key`、`Chapter Slug`、`Document Type`、`Review Status`、`Parent Slug`，並為既有項目補預設值。
- 🟡 **完成 Moor 剩餘六章全文與 Catalog 映射** — 已用 MOOR Master 補齊 Creator Hub、貼文、聊天、我的頁面、數據分析、其他功能的安全摘要；仍需補產品 key／章節 slug 映射並逐章完成可公開全文審核。
- 🔴 **接上正式 Regression Google Sheet** — 目前為內建 sample baseline;需設定 `.env.local`(`REGRESSION_SHEET_ID`、`GOOGLE_APPLICATION_CREDENTIALS`)並以 `--replace-sample-baseline` 首次替換。
- 🟡 **自動部署(CI)** — 評估 GitHub Actions(排程 cron + 手動觸發),讓內容/Sheet 更新自動 build+deploy。牽涉導入 Firebase 部署憑證。
- 🟢 **robots noindex** — `layout.tsx` 目前 `noindex`;正式對外收錄前記得改。
- 🟢 **清理未使用便利 helper** — `getCasesForSuite`(`regression.ts`)目前無人使用;確定不需要再移除(非必要)。

## 暫緩

- ⏸️ **站內 AI bot / RAG** — 需 serverless key proxy,離開純靜態;待文件管線與 CI 定案後再議。

## 已完成

- ✅ Moor／Web Hero 卡片、徽章與統計的六尺寸 padding／overflow 邊界驗證(2026-08-03)
- ✅ Notion Catalog 產品階層程式支援：manifest schema v2、approved 發布閘門、欄位組合／路由唯一驗證與 fixtures（2026-08-03）
- ✅ `.env.example` 已提供 Regression 與唯讀 Notion 所需環境變數範本（確認於 2026-08-03）
- ✅ 任務書 CTA 單行 RWD 字級與箭頭間距修正(2026-08-03)
- ✅ Web 獨立 `web-*` namespace、Moor／Web Hub 首屏精準 100svh 與手機內容收口(2026-08-03)
- ✅ Three.js 可見暖機：Hero 持續可見後才 idle 載入、離開／深連結時跳過 WebGL async chunks(2026-08-03)
- ✅ 產品地圖摘要化、Moor 詳細內容歸位、Web Hub＋五個 2026 子頁與畫卷底框安全區修正(2026-08-03)
- ✅ 任務書移除進度／獎勵列與失效 CSS(2026-08-03)
- ✅ 任務書桌機／手機文字安全區與進度列對齊修正(2026-08-03)
- ✅ 唯讀盤點 MOOR／SWAG Master 與 Web 2026 專案，依綠色 Mockup／Ready for dev 優先規則整合產品範圍與 QA 重點(2026-08-02)
- ✅ 首屏 LCP 資源優先級：生命樹 AVIF 單一 preload、冷啟動請求提前與重複下載驗證(2026-08-02)
- ✅ 圖片效能管線：PNG 母檔產生 AVIF／WebP、CSS fallback、prebuild 體積預算與跨尺寸實機驗證(2026-08-02)
- ✅ UI 效能基準：Three.js idle dynamic import、離屏／隱藏分頁停止 render loop、bundle 與 fallback 驗證(2026-08-02)
- ✅ Three.js 生命樹 Hero：全景 shader、空間光塵、游標／捲動差速與漸進式 fallback(2026-08-02)
- ✅ 手機地圖 header／任務書間距、漢堡自動收合與透明門洞傳送門資產(2026-08-02)
- ✅ 手機核心操作漸進式增強、任務書 fallback／尺寸、Regression 原生案例典藏與 Moor live 橫向溢出修正(2026-08-02)
- ✅ 首頁場景一屏化：桌機新手村／試煉之森 viewport composition、手機巨龍與底部 HUD、書庫垂直節奏與標題對齊(2026-08-02)
- ✅ 手機首屏果實標籤、史萊姆方向、試煉之森直式資產／門洞／巨龍平台、方向按鈕回饋與 navbar 錨點修正(2026-08-02)
- ✅ 次要場景第二輪視覺驗收：375px／768px／1440px live visual QA、閱讀器單頁化與觸控尺寸收尾(2026-08-02)
- ✅ 次要場景視覺升級第一輪：新手村林間舞台、Moor 世界地圖路徑、實體典籍閱讀器(2026-08-02)
- ✅ Impeccable project-scoped 安裝完成，`.codex/hooks.json` 設計檢查 hook 已建立(2026-08-02)
- ✅ `ui-ux-pro-max` 全域安裝完成，Codex 可讀且 Claude Code symlink 正常(2026-08-02)
- ✅ Moor 產品 Hub＋快速入門／直播功能閱讀 POC，產品地圖與賢者書庫雙入口(2026-08-01)
- ✅ Notion 私人 POC、Catalog、手動同步器、preview 與 fixture tests(2026-07-26)
- ✅ 非 Regression 文件維護方向定案:Notion Catalog allowlist＋第一階段本機手動同步(2026-07-19)
- ✅ 新增並校對跨 agent 前端設計規範 `DESIGN.md`(2026-07-19)
- ✅ 目錄重構進 `src/` + 文件治理系統(2026-07-19)
- ✅ Critter 雪碧圖 wolf/bat/lol-dragon(重排等距格)
- ✅ Regression 知識庫 + Sheet 同步管線 + TrialForestPortal
