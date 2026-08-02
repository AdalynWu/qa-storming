# DECISION — 設計決策與原因(ADR)

記錄「為什麼這樣做」。每條:決策、原因、影響/取捨。架構或技術決策變更時新增一條(最新在上),必要時同步 `ARCHITECTURE.md`。

---

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
