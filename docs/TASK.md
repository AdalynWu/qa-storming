# TASK — 待辦事項與優先級

狀態:🔴 高 / 🟡 中 / 🟢 低 / ⏸️ 暫緩。領取/完成/新增時更新本檔;完成的任務移到底部「已完成」並附日期。

## 待辦

- 🟡 **建立 UI 效能基準** — 視覺升級前後比較 production bundle、桌機／手機流暢度與 reduced-motion fallback；若現有原生 Three.js 足夠，不新增 React Three Fiber、Drei 或 GSAP。
- 🔴 **完成 Notion Internal Connection 實機驗證** — 程式與私人 POC 已完成;待 Workspace Owner 建立/確認唯讀 `QA Storming Docs Reader`、將 Sync Lab 分享給它、填入 `NOTION_TOKEN`,再跑 preview 並手動加入一張安全測試圖片。
- 🟡 **擴充 Website Docs Catalog 產品階層欄位** — 在 `QA Storming Sync Lab` 內的 Catalog 新增 `Product Key`、`Chapter Slug`、`Document Type`、`Review Status`、`Parent Slug`，並同步更新 schema、同步器與 fixtures。
- 🟡 **完成 Moor 剩餘六章與 Catalog 映射** — Creator Hub、貼文、聊天、我的頁面、數據分析、其他功能目前只顯示待審核；需補產品 key／章節 slug 映射並逐章安全整理。
- 🔴 **接上正式 Regression Google Sheet** — 目前為內建 sample baseline;需設定 `.env.local`(`REGRESSION_SHEET_ID`、`GOOGLE_APPLICATION_CREDENTIALS`)並以 `--replace-sample-baseline` 首次替換。
- 🟡 **自動部署(CI)** — 評估 GitHub Actions(排程 cron + 手動觸發),讓內容/Sheet 更新自動 build+deploy。牽涉導入 Firebase 部署憑證。
- 🟡 **`.env.example` 範本** — 目前只有 gitignored 的 `.env.local`;補一份範本說明必要環境變數。
- 🟢 **robots noindex** — `layout.tsx` 目前 `noindex`;正式對外收錄前記得改。
- 🟢 **清理未使用便利 helper** — `getCasesForSuite`(`regression.ts`)目前無人使用;確定不需要再移除(非必要)。

## 暫緩

- ⏸️ **站內 AI bot / RAG** — 需 serverless key proxy,離開純靜態;待文件管線與 CI 定案後再議。

## 已完成

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
