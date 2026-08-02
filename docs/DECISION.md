# DECISION — 設計決策與原因(ADR)

記錄「為什麼這樣做」。每條:決策、原因、影響/取捨。架構或技術決策變更時新增一條(最新在上),必要時同步 `ARCHITECTURE.md`。

---

## D18 — Notion 產品文件使用 manifest v2 與獨立審核閘門 · 2026-08-03
- **決策**：Website Docs Catalog 增加 `Product Key`、`Chapter Slug`、`Document Type`、`Review Status`、`Parent Slug`；manifest 升為 schema v2。同步輸出除了 `Status=published`、Publish Mode 非 hidden，還必須是 `Review Status=approved`。同步器驗證 standalone／hub／chapter 欄位組合與產品路由唯一性。
- **原因**：一般文件 slug 無法可靠表達 `/products/<product>/<chapter>` 階層，而 `Status=published` 也不能取代內容是否適合放進公開靜態站的安全審核。若兩者混用，仍在產品流程審核中的文件可能意外進入 Firebase 靜態產物。
- **取捨**：Notion Catalog 需新增五個欄位並為既有資料補預設值，舊 manifest 也需升版；換取清楚的產品路由映射、可測試的發布條件與未核准內容不輸出的硬性保護。正式 Notion database 修改仍由有權限的人員完成，不改變本機手動同步與純靜態架構。

## D17 — Three.js 增強需先通過 Hero 可見暖機，不只依賴 browser idle · 2026-08-03
- **決策**：`DeferredImmersiveTreeHero` 只有在 Hero 持續可見 1.6 秒且使用者未啟用 reduced-motion 時，才排入 idle dynamic import；暖機完成前離開 Hero 會取消，直接進入下方 hash 不下載 Three.js。啟用後仍由場景本身負責離屏／分頁隱藏的 render-loop pause。
- **原因**：`requestIdleCallback` 在快速裝置可能於 hydration 後立即執行，仍會讓約 136.5 KB gzip 的 async chunks 與 381.2 KB 貼圖加入首屏網路競爭。靜態 AVIF 已完整承擔首屏內容，WebGL 是可稍後出現的視覺增強。
- **取捨**：Three.js 淡入會比原先晚約 1.6 秒，但首屏不會空白或失去操作；快速略過 Hero 的使用者不支付 WebGL 程式碼成本。若未來要調整暖機時間，需同時量測首屏網路、canvas 出現節奏、深連結與 reduced-motion。

## D16 — 產品地圖只承載摘要，長篇 Know-how 進產品 Hub · 2026-08-03
- **決策**：`/product-map` 只呈現技術類型、環境、核心說明、短 QA 提示與產品頁入口；Moor／Web 的完整 2026 流程與 QA 章節分別放在 `/products/moor`、`/products/web` 及其靜態子頁。畫卷外框固定，只有內層內容區可捲動。
- **原因**：世界地圖的工作是快速建立產品全貌與導覽，不適合承載長篇規格。詳細內容塞入畫卷會讓 CTA 與底部裝飾條交疊，也讓 Web 無法像 Moor 一樣形成可查找、可分享的章節路徑。
- **取捨**：增加 Web Hub 與章節路由、需要維護產品摘要及章節內容兩層資料；換取地圖閱讀負擔降低、固定安全邊界、獨立 URL 與更清楚的產品知識架構。仍維持純靜態輸出，未新增 runtime 服務。

## D15 — Figma 只作唯讀人工策展來源，2026 正式 Mockup 優先 · 2026-08-02
- **決策**：MOOR／SWAG Master Design File 用來確認產品功能範圍；同功能若有 2026 專案檔，採綠色 Mockup 或 Ready for dev 頁作目前規格。較舊 Mockup、Wireframe、Sandbox、遺棄版本、未決留言與 Enhancement 不直接發布。Figma 內容只經人工安全整理後寫入本機型別資料，不建立 runtime 連線，也不回寫 Figma。
- **原因**：Master File 適合建立全貌，但專案檔包含較新的登入、訪客、支付、直播與導覽決策。網站是無權限控管的公開靜態站，不能把內部 URL、ticket、人名、討論、帳號或敏感設定原樣輸出。
- **取捨**：可把最新設計意圖轉成可讀的產品範圍與 QA 重點，同時維持純靜態與唯讀安全邊界；代價是內容更新需重新人工盤點與審核，且不能把討論中項目宣稱為已上線功能。

## D14 — 只提前載入首屏生命樹 AVIF，不提升其他場景優先級 · 2026-08-02
- **決策**：root layout 以 React 19 `preload()` 對 `/rpg-life-tree.avif` 發出單一 `as=image`、高優先級提示；不 preload WebP fallback、Three.js 貼圖、sprite 或首屏以下場景。
- **原因**：生命樹是 CSS `image-set()` 背景，原本須等 CSS 解析後才會被發現，且佔據完整首屏，是明確 LCP 圖片候選。其他資產不是首次視口的主要內容，提前載入反而會與關鍵 CSS、圖片及 JavaScript 競爭頻寬。
- **取捨**：不支援 AVIF 的瀏覽器仍要在 CSS 解析後才發現 WebP／PNG，但主流支援瀏覽器可更早取得最小的 AVIF。React API 比手寫 `<head>` 更能避免 Next／React 資源提升造成重複 preload；實際 LCP 數值仍應在可用 Lighthouse／RUM 的環境持續量測。

## D13 — 場景圖片採 PNG 母檔＋可重現 AVIF／WebP 衍生檔 · 2026-08-02
- **決策**：保留 `public/` 的 PNG 作可編輯母檔，以 `scripts/optimize-images.mjs` 固定參數產生 AVIF／WebP。CSS 背景透過 `image-set()` 依 AVIF、WebP、PNG 順序 fallback，Three.js 與動態 `<img>` 使用 WebP；`prebuild` 僅驗證衍生檔與 35% 體積預算，不在每次建置重新編碼。
- **原因**：核心場景與 sprite 原始 PNG 合計超過 22 MB，直接下載會顯著拖慢首次進場；同時仍需保留高相容母檔、透明通道與可重現的資產流程。把轉檔與 build 分離，可避免每次部署耗時編碼，也能讓產物變更明確可檢查。
- **取捨**：Firebase 靜態輸出會同時包含母檔與衍生檔，儲存體積增加，但支援瀏覽器的實際網路 payload 降至原 PNG 的 9.7%。修改母檔後必須主動執行 `npm run optimize:images`；build guard 能抓缺檔與體積退化，但視覺內容同步仍需人工 QA。

## D12 — 核心導覽與文件閱讀採 progressive enhancement · 2026-08-02
- **決策**：首頁區段導覽、手機選單、試煉入口與 Regression 案例閱讀必須先有可用的原生 HTML link／`details`；React state、拖曳、篩選與場景轉場只作增強。CSS 動畫的初始狀態不得在 JavaScript 未啟動時隱藏主要內容。
- **原因**：手機透過區網預覽開發站時，script 載入、hydration 或 WebGL 初始化可能較桌機慢或失敗。若所有控制都只存在 `onClick`，會同時造成選單、錨點、Carousel、試煉方向與案例詳細內容失效。
- **取捨**：靜態 HTML 會多一份精簡案例典藏，輸出體積略增；換取純靜態站在 JavaScript／動畫層異常時仍可導覽與閱讀，並符合 D11 的 DOM 主體原則。

## D11 — 沉浸式介面採圖片／DOM 主體＋選擇性 Three.js 增強 · 2026-08-02
- **決策**：延續圖片主導的場景與語意化 HTML／CSS 文件介面；Three.js 只用於 Hero 等少數需要即時粒子、景深或鏡頭感的裝飾層。WebGL 視為 Three.js 的底層繪圖能力，不另寫 raw WebGL。現階段不加入 React Three Fiber、Drei、GSAP 等 runtime 依賴。
- **原因**：QA Storming 的主要價值仍是可搜尋、可複製、可維護的知識文件。全站 canvas 會增加 bundle、GPU／電池負擔、手機相容性、無障礙與內容維護成本；完全不用 3D 又會削弱首頁探索感。漸進式增強能保留奇幻世界的沉浸感，同時讓文件和互動在 WebGL 不可用時仍完整可用。
- **取捨**：需要同時維護靜態 fallback 與少量 WebGL 增強，並為 canvas 設定 DPR 上限、離屏暫停、資源 dispose 與 reduced-motion。只有在場景狀態、模型或鏡頭編排明顯超出原生 Three.js 元件可維護範圍時，才另案評估更高階依賴。

## D10 — 外部 UI skills 僅作審核輔助，專案設計規範仍為最高準則 · 2026-08-02
- **決策**：可導入 `ui-ux-pro-max` 與 `impeccable` 協助產生設計系統建議、檢查 UI 反模式與 accessibility；實際畫面仍以 `DESIGN.md`、既有圖片資產、內容可讀性與人工 review 為準。
- **原因**：通用 UI skill 能補足構圖、層級、互動與檢查清單，但不了解 QA Storming 的完整世界觀、既有美術資產與內容安全限制；直接套用容易把網站收斂成通用 landing page 或 SaaS 元件風格。
- **取捨**：多一道設計稽核與衝突判斷；換取較穩定的視覺品質與可及性，同時避免外部工具改寫既有設計語言。工具輸出的任何建議若與 `DESIGN.md` 衝突，以專案規範為準。

## D9 — 產品 Know-how 採 Hub＋章節閱讀器，公開版先經安全整理 · 2026-08-01
- **決策**：Moor 以 `/products/moor` 冒險路徑作產品 Hub，已審核章節輸出到 `/products/moor/[chapter]`；未完成內容顯示待審核且不建立正文頁。POC 使用由 Notion 原始頁整理出的型別內容，僅保留適合網站公開的操作與 QA 重點。
- **原因**：世界地圖適合產品概覽，不適合承載長篇文件；原始 Notion 同時包含內部 Spec、Figma、流程與可能敏感的實作資訊，不能未審核就打包進目前無 Auth 的公開靜態站。
- **取捨**：POC 內容更新仍需人工整理；完成 Internal Connection 與 Catalog 的產品階層映射後，再把安全審核內容改由 `sync:notion` 生成。文件頁優先可讀性，遊戲化動畫集中在 Hub 與導覽層。

## D8 — Notion MCP 僅建 POC，正式同步使用 Internal Connection · 2026-07-26
- **決策**:Notion MCP 只協助在私人區域建立與整理 `QA Storming Sync Lab`;`npm run sync:notion` 一律使用 `@notionhq/client`＋唯讀 Internal Connection。第一次以 `--preview` 寫入 `work/`,不直接替換正式 generated 內容。
- **原因**:Hosted MCP 是使用者 OAuth 互動流程,不適合未來無人值守的 GitHub Actions;Internal Connection 靜態 token 可限制頁面與 read-only 權限,也不會進入 React 或靜態輸出。
- **取捨**:需由 Workspace Owner 建立或核准 connection 並手動分享頁面;但同步可重現、可測試且維持零 runtime 後端。

## D7 — 非 Regression 文件採 Notion Catalog allowlist · 2026-07-19
- **決策**:原始文件保留在既有 Notion 位置,另建 `Website Docs Catalog` 明確選取網站文件;每筆以 `full`、`link-only`、`hidden` 控制輸出。第一階段只做本機 build-time 手動同步,不啟用 Webhook 或付費後端。
- **原因**:公司文件目前為散落頁面與多層子頁,且混有可公開教材、內部操作資訊與敏感內容。直接遞迴抓 Teamspace 容易誤收;搬動全部文件又會破壞既有工作習慣。
- **取捨**:`full` 內容會進公開靜態檔,只允許核准公開的文件;內部內容使用 `link-only` 回到 Notion 權限。更新需手動 sync + build + deploy,換取 Firebase Spark、無 runtime API 與零後端費用。完整規格見 `docs/notion-content-sync.md`。

## D6 — 文件治理系統(Claude + Codex 並行) · 2026-07-19
- **決策**:建立固定的 markdown 治理檔(AGENTS/CHANGELOG/PLAN/PROGRESS/DECISION/TASK/MEMORY/ARCHITECTURE + Codex 的 DESIGN),規範「開工前先讀、完成後更新」。
- **原因**:兩個 AI agent 並行開發,需共享狀態與慣例、降低失衡與重工。
- **取捨**:需紀律維護;dated 條目採「附加、最新在上、勿改寫」以降低並行衝突。Git 操作一律由使用者本人執行。

## D5 — 原始碼收進 `src/` · 2026-07-19
- **決策**:`app`/`components`/`content` 移入 `src/`;`@/*` 別名指向 `./src/*`。`public`/`scripts`/config 留 root。
- **原因**:標準 Next 佈局、root 更乾淨。
- **取捨**:`@/` import 全數不受影響;僅 `scripts/` 相對路徑需微調。`public/` 因 Next 限制不可移。

## D4 — Sprite sheet 一律重排成等距格 · 2026-07(critter 系列)
- **決策**:所有雪碧圖在使用前用 PIL 重排成等距格(橫向 1:6 或直向 1:6 square-frame),每格內容置中留白。
- **原因**:原始美術素材各格非等距、且內容溢出格線;CSS `steps()` 以固定 stride 取樣會裁切到鄰格。
- **取捨**:多一道離線前處理,但換得乾淨的 frame 循環、可重用共享 `animalCycle`/`wolfCycle`/`batCycle` 系統。詳見 `MEMORY.md`。

## D3 — 內容管線:build-time 外部同步 → generated JSON → zod 型別模組 · (regression)
- **決策**:regression 以 Google Sheet 為 SSOT,`scripts/sync-regression.ts`(googleapis)抓取 → zod 驗證 → 原子寫入 `src/content/generated/regression.json`(committed)→ `src/content/regression.ts` 消費。
- **原因**:團隊在熟悉工具撰寫、無需 server、內容以 generated JSON 進 git 版控;schema 由 script 與 app 共用單一來源。
- **取捨**:更新需重跑 sync + 重新部署(目前手動);含刪除保護(active case 消失須先標 archived)。

## D2 — 首頁/內容資料為硬編型別模組 · (既有)
- **決策**:`src/content/*.ts` 以型別 + 陣列硬編(quests/products),非 runtime 載入。
- **原因**:純靜態站,build 時嵌入、零 runtime 後端。

## D1 — 純靜態匯出 + Firebase Hosting · (既有)
- **決策**:`output: "export"` → `out/` → `firebase deploy --only hosting`。
- **原因**:簡單、低成本、無維運。
- **取捨**:**無 server / API route / DB**;任何後端功能(如 AI bot)須先改部署模型(Functions/SSR 或換 host)。

## 待決
- Notion Catalog 同步穩定後,是否加入每 6 小時 GitHub Actions、允許自動部署或自動 commit;目前均不啟用。
