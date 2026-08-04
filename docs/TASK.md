# TASK — 待辦事項與優先級

狀態:🔴 高 / 🟡 中 / 🟢 低 / ⏸️ 暫緩。領取/完成/新增時更新本檔;完成的任務移到底部「已完成」並附日期。

## 待辦

- 🟢 **Notion 圖片本地化實機樣本** — Internal Connection、Catalog、正式同步與 Moor quick-start 前台消費已完成；若 Demo 要展示圖片同步，再於來源頁手動加入一張無機密資訊的測試圖片並重跑 preview。
- 🟡 **自動部署(CI)** — 評估 GitHub Actions(排程 cron + 手動觸發),讓內容/Sheet 更新自動 build+deploy。牽涉導入 Firebase 部署憑證。
- 🟢 **robots noindex** — `layout.tsx` 目前 `noindex`;正式對外收錄前記得改。
- 🟢 **清理未使用便利 helper** — `getCasesForSuite`(`regression.ts`)目前無人使用;確定不需要再移除(非必要)。

## 已完成

- ✅ 迷霧測試林 3D 教學遊戲整合：`/rpg` 同源 iframe 隔離嵌入、首頁桌機專屬 CSS 能力 gate 入口、`useIsComputerDevice` 三態判斷＋鍵盤/按鈕確認＋iframe 焦點交接、手機擋頁與覆寫入口（2026-08-04）
- ✅ Chatbot 對 Firebase AI Logic `429`／暫時性 `5xx` 加入兩次有限退避重試與安全忙碌提示（2026-08-04）
- ✅ 正式 Regression Google Sheet 已設定 Sheet ID 與唯讀憑證，完成首次 sample baseline 替換；目前 generated 資料為 Web Production 1 Suite／71 Cases，可使用 `npm run sync:regression` 手動同步（確認於 2026-08-04）
- ✅ Chatbot 新增人工核准的本地趣味題庫、隨機回答與「史萊姆閒聊」視覺區隔，命中時不使用索引或 Gemini（2026-08-04）
- ✅ 首屏「向下探索」提示提高對比，並將箭頭、文字與控制器精準置中（2026-08-04）
- ✅ 賢者書庫改為桌機／手機獨立星穹典藏殿背景，並加入延遲載入、離屏暫停、reduced-motion 降級的 Three.js 互動星群（2026-08-04）
- ✅ 試煉之森四個 realm 改用各自生成的純奇幻風景，並以 AVIF／WebP／PNG `<picture>` 接入既有圖片效能管線（2026-08-04）
- ✅ Quest Zone 改用室內公會製圖工坊桌機／手機獨立背景，移除生命樹覆用與森林丘陵視差，並接入圖片效能管線（2026-08-04）
- ✅ Moor 剩餘六章完成公開安全正文與審核，八章全部切換為 `full + published + approved` 並輸出靜態閱讀頁（2026-08-04）
- ✅ 站內 AI Chatbot 第一版：approved Markdown 關鍵字索引、Firebase AI Logic／Gemini、App Check、引用驗證與全站賢者問答 UI；Firebase Console 正式設定與真實模型 smoke test 由使用者完成（2026-08-04）
- ✅ 建立賢者知識書庫、Error Code V2 查詢、測試工具／Maestro／Appium MCP 網站與 Notion 對應文件，並補滿首頁 Quest Books（2026-08-03）
- ✅ Web 八章 Notion 正文全部完成審核並切換為 `full + published + approved`，網站不再使用 Web fallback 正文（2026-08-03）
- ✅ Web 八章建立 Notion 來源與 Catalog 映射；六篇核准章節使用 generated Markdown，兩篇待審章節安全回退 `web.ts`（2026-08-03）
- ✅ 依 SWAG Master 完整 sitemap 補齊 Web「個人檔案與內容」及「影音與聊天」，八章全部成為可閱讀靜態頁（2026-08-03）
- ✅ Moor 八章建立 Notion 來源與 Catalog 映射；快速入門／直播正式同步，其餘六章安全保留為待審核草稿（2026-08-03）
- ✅ Moor quick-start 優先讀取 Notion generated Markdown，無同步資料時回退 `moor.ts`，並完成 parser／build 驗證（2026-08-03）
- ✅ 獨立 Demo Workspace、唯讀 Internal Connection、schema v2 Catalog、Moor 快速入門樣本與正式同步實機驗證（2026-08-03）
- ✅ 唯讀核對第二批 11 份 Design Merged Figma，整合 Web 設定第六章、直播／交易／錯誤頁、Moor 合規／語音／AI 與 Ramen 下載分流（2026-08-03）
- ✅ 新手村標題脫離置中書環容器、與試煉標題共用桌機左緣，並將 `portal-copy` 語意化為 `portal-title`(2026-08-03)
- ✅ Website Docs Catalog 實際新增五個產品階層欄位，並完成四筆既有資料回填與查詢驗證（2026-08-03）
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
