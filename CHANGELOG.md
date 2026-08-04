# Changelog

本檔記錄專案的顯著變更。格式參考 [Keep a Changelog](https://keepachangelog.com/);最新在上。
本專案尚未正式版號化,暫以 `Unreleased` + 日期記錄。

## [Unreleased]

### Added
- 迷霧測試林 3D 測試教學副本：`/rpg` 路由以同源 iframe 隔離嵌入一份自帶 three.js 的完整遊戲(vibe coding 自測練習)；首頁新增桌機專屬入口(CSS 能力 gate),進入前有複合裝置判斷＋鍵盤／按鈕確認與 iframe 焦點交接,手機／觸控顯示擋頁並保留「我有鍵盤,仍要進入」覆寫入口。(2026-08-04)
- 賢者書庫新增延遲載入的原生 Three.js 互動星群：游標低幅度牽引、手機減量、DPR 限制、離屏／隱藏暫停與 reduced-motion 靜態降級。(2026-08-04)
- Moor Creator Hub、貼文、聊天、我的頁面、數據分析與其他功能六篇公開安全版 Notion QA 指引；Moor 八章現已全部提供 generated 靜態閱讀頁。(2026-08-04)
- 全站「賢者問答櫃台」Chatbot：approved Markdown build-time 索引、中英關鍵字檢索、Firebase AI Logic／Gemini structured answer、有效引用來源、App Check、本地拒答與響應式 RPG UI。(2026-08-04)
- 賢者知識書庫：`/library` 查詢櫃台與三座分類書架、`/library/error-codes` 可搜尋 Error Code V2，以及測試工具、Maestro、Appium MCP 三份 Notion generated 閱讀頁。(2026-08-03)
- 首頁新手村任務書加入錯誤碼、工具工坊與 Mobile Automation 路徑；賢者書庫 CTA 與四份展示卷冊全數成為有效連結。(2026-08-03)
- root `PRODUCT.md` 保存產品目的、核心工作流、內容安全邊界與耐久限制，作為後續資訊架構與 UI 工作的共同產品真相。(2026-08-03)
- `QA Storming Sync Lab` 建立 Web 八章來源與 Catalog 映射：六篇核准章節正式同步，兩篇保留為不公開待審草稿。(2026-08-03)
- Web「個人檔案與內容」與「影音與聊天」閱讀頁：依 SWAG Master 完整 sitemap 收錄角色／內容管理、Video／Short／Story／Chat 與跨裝置 QA；Web 八章全數可閱讀。(2026-08-03)
- `QA Storming Sync Lab` 建立完整 Moor 八章來源與 Catalog 映射：快速入門／直播功能為正式同步文件，其餘六章為不公開待審核草稿。(2026-08-03)
- Moor Notion 文件消費層：安全 Markdown parser／renderer、build-time generated 檔案讀取，以及 `quick-start` 同步內容前台呈現。(2026-08-03)
- Web「個人中心與設定」閱讀頁：聯盟夥伴入口、設定密碼、VIP 1–100 與 Lv.0 徽章邊界案例；Web 可閱讀章節增至六章。(2026-08-03)
- Web 2026 Know-how：`/products/web` 瀏覽者海岸 Hub、八章狀態導覽，以及帳號、直播、支付、探索、Landing／SEO 五個靜態閱讀頁。(2026-08-03)
- 圖片資產管線：`optimize:images` 由 PNG 母檔產生 AVIF／WebP，`check:images` 與 `prebuild` 驗證缺檔、壓縮成效及 35% 首選 payload 預算。(2026-08-02)
- Three.js 生命樹 Hero：全景 shader、樹心柔光、三層空間光塵、游標／捲動差速，以及 WebGL／reduced-motion 漸進式 fallback。(2026-08-02)
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
- Firebase AI Logic 模型呼叫遇到 `429`／暫時性 `5xx` 時會以 400ms、1000ms 有限退避重試；持續過載顯示安全繁中提示，權限與設定錯誤則不重試。(2026-08-04)
- Quest 超寬桌機比例與控制材質重整：中央卡與五格軌道在 `≥2000px` 放大，左右鍵與 CTA 改為深森林琺瑯／黃銅書扣；Web／Moor 閱讀頁採完整可返回麵包屑並移除重複前言／callout，書庫閱讀器的徽章、目錄與相關札記補齊窄版重排。(2026-08-04)
- Chatbot 新增本地「史萊姆閒聊」趣味題庫：精準命中人工核准問題時隨機回覆，不載入知識索引、不呼叫 Gemini，並以獨立標籤與訊息材質區隔正式 QA 回答。(2026-08-04)
- 首屏無底色的「向下探索」提示恢復米白／金色高對比前景；箭頭與文字增加間距，並與整組控制器精準共用 viewport 水平中心，補齊 hover／鍵盤 focus 回饋。(2026-08-04)
- 首頁賢者書庫由單色綠色漸層改為桌機／手機獨立的星穹典藏殿插畫，並移除 Unicode 星點與直條裝飾；狼降至卷冊內容層後方。(2026-08-04)
- 試煉之森蝙蝠編隊由四隻增為六隻並整群右移；任務卡配合使用者裁切後的 811×1318 母檔，重校卡片比例、羊皮紙文字安全區與 hover glow 邊界。(2026-08-04)
- 試煉之森四個 `realm-window` 由共用生命樹／產品地圖取景改為晨光瀑布谷、月光水晶峽谷、暮色熔岩原與沉沒庭園四張純風景；以 `<picture>` 提供 AVIF／WebP／PNG 格式選擇與 fallback。(2026-08-04)
- 四隻蝙蝠編隊由新手村製圖工坊移至試煉之森，保留原隊形、尺寸差與拍翼相位，捲動路徑改為以水平移動為主、只微幅往右上升。(2026-08-04)
- 首頁 Quest Zone 由生命樹覆用場景改為室內公會製圖工坊，桌機／手機各有獨立構圖並納入 AVIF／WebP 圖片管線；移除舊森林丘陵視差，保留既有任務卡輪播與 glow 互動。(2026-08-04)
- 全站 Chatbot 改固定於左下角，首頁移除「開始冒險」主 CTA；新手村單隻蝙蝠改為四隻不同尺寸與拍翼相位的右上飛行編隊，任務卡 hover 光暈收斂至實際非透明卡面範圍。(2026-08-04)
- 試煉之森「內容秘藏地」改用產品世界地圖取景，移除舊 `rpg-quest-book` 三格式資產、圖片最佳化項目與已隱藏的厚書頁／書脊／護角節點。(2026-08-04)
- 首頁新手村輪播保留既有五格偽 3D 軌道、方向與進場動畫，視覺物件由厚書封替換為透明薄型魔法任務卡；中央卡新增 hover／鍵盤 focus 金綠光暈，圖片管線同步提供 AVIF／WebP／PNG fallback。(2026-08-04)
- 首頁移除重複的史萊姆角色，只保留 Chatbot 史萊姆入口；邀請泡泡改為會從角色端短促冒出的深森林／黃銅對話框。(2026-08-04)
- 全站 Chatbot 入口由書庫徽章改為固定角落的六幀史萊姆嚮導，未展開時以對話泡泡提示可提問，點擊角色後展開既有問答櫃台。(2026-08-04)
- Moor 六筆 Catalog 完成 `full + published + approved` 審核；章節靜態輸出以 published 狀態為準，正文由 generated Notion Markdown 提供，不再要求重複維護 TypeScript sections。Chatbot 索引增為 20 份核准文件、29 個段落。(2026-08-04)
- `prebuild` 會在圖片預算後重建 `public/chatbot-search-index.json`；Notion 同步仍維持手動，另以 `refresh:notion` 明確執行同步後索引，不讓一般 build 依賴 Notion API。(2026-08-04)
- Notion generated 文件讀取器支援 approved standalone 文件；Error Code 查詢直接由同步 Markdown 表格衍生，不維護重複的前端代碼清單。(2026-08-03)
- Web「個人檔案與內容」與「影音與聊天」完成 Notion 正文及公開安全審核；Web 八章全數切換為 approved generated Markdown，不再使用 fallback 正文。(2026-08-03)
- Web 閱讀器改為 approved Notion generated Markdown 優先、`web.ts` fallback；Moor／Web 共用安全 Markdown renderer 並保留各自 CSS namespace。(2026-08-03)
- Moor 章節改為 approved Notion generated Markdown 優先，無對應同步資料時回退 `src/content/moor.ts`；仍維持純靜態輸出與零 runtime Notion request。(2026-08-03)
- 依 Design Merged 現行 Mockup 整合 11 份新增 Figma 來源：Web 補語音直播、Shop Detail／First Pay、信用卡結帳與錯誤頁；Moor 補創作者本人同意、語音直播、直播 AI 助理與 Lv.0 摘要；Ramen 補下載 App 的 MDM／fallback 路徑。(2026-08-03)
- 新手村場景標題移出置中的書環內容容器，桌機與試煉之森共用 `6vw` 左側文字基準；試煉標題 class 由 `portal-copy` 更名為語意清楚的 `portal-title`。(2026-08-03)
- `Website Docs Catalog` 已在 Notion 實際建立五個產品階層欄位，四筆既有 POC 資料完成 standalone／review status 安全回填與查詢驗證。(2026-08-03)
- Moor／Web 產品 Hub 新增共用 viewport 邊界契約：Hero 卡片取消內層 scrollbar，徽章受 padding 可用高度限制，統計改為可收縮三欄並針對短橫式、平板及手機縮放。(2026-08-03)
- Notion 文件 manifest 升為 schema v2，支援產品 hub／chapter 階層欄位；同步器新增 `approved` 發布閘門、欄位組合與產品路由唯一驗證，未審核文件不會進入靜態輸出。(2026-08-03)
- 任務書 CTA 改為依書本寬度縮放字級與箭頭間距，並強制文案維持單行，避免窄尺寸下斷行。(2026-08-03)
- Web Hub／閱讀器改用獨立 `web-*` CSS namespace；Moor 與 Web Hub 的 Topbar＋Hero 合計固定為 `100svh`，桌機及手機的文案、統計、徽章與提示完整收在首屏內。(2026-08-03)
- Three.js Hero 加入 1.6 秒持續可見暖機閘門；暖機前離屏或直接進入下方 hash 會取消 async import，靜態 AVIF／DOM 首屏維持立即可用。(2026-08-03)
- 產品世界地圖的 Moor／Web 畫卷收斂為摘要與產品 Hub 入口；畫卷改為固定裝飾外框＋內層內容捲動，避免 CTA 穿越 `.product-scroll:after`。(2026-08-03)
- 任務書移除進度／獎勵 `book-meta` 列，讓書封只保留任務說明與主要 CTA，並清除所有失效樣式。(2026-08-03)
- 任務書封面的分類、標題、說明、進度與獎勵改依插畫羊皮紙的實際 44% 安全寬度排列；手機長標題同步縮排與調整行高。(2026-08-03)
- Moor 直播章與產品世界地圖整合 MOOR／SWAG Master 及 2026 正式 Figma Mockup：補齊產品範圍、來源優先序與登入／訪客、快速支付、直播、搜尋、FAQ、客服 CTA、活動入口等 QA 重點；不公開內部連結、ticket、留言或敏感設定。(2026-08-02)
- 首屏生命樹 AVIF 改由 React 19 資源提示提前載入；production HTML 僅輸出一筆高優先級 preload，冷啟動請求移到首頁 JavaScript 前。(2026-08-02)
- RPG 場景背景與 sprite 改用 AVIF／WebP／PNG fallback，Three.js／動態領域圖使用 WebP；首選圖片 payload 由 22,623.9 KB 降至 2,201.5 KB。(2026-08-02)
- Three.js Hero 改為 idle dynamic import，從首頁初始 scripts 移除 WebGL runtime；離屏／隱藏分頁會停止 animation loop，並補強非同步貼圖卸載清理。(2026-08-02)
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
