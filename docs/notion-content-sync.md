# Notion 文件同步計畫與操作指南

> 狀態：POC 與同步器已完成；待建立唯讀 Internal Connection 並執行首次 preview  
> 目標：保留 Notion 作為文件維護來源，選擇性同步到 QA Storming，同時維持 Next.js 靜態輸出、Firebase Hosting Spark 與零後端費用。

## 1. 結論

公司現有 Notion 文件可以套用同步機制，但不適合從 Teamspace 根頁自動遞迴抓取，也不能把所有文件原封不動放進目前的 Firebase 靜態網站。

建議採用：

1. 原始文件繼續留在目前的 Notion 位置，不搬動。
2. 新增一個獨立的 `Website Docs Catalog` 資料庫。
3. 只有明確加入 Catalog 並核准發布的文件才會出現在網站。
4. 每份文件可以選擇同步全文、只顯示 Notion 連結，或完全隱藏。
5. 第一階段使用本機手動同步，不啟用 Webhook、Cloud Functions、Cloud Run 或 Google Cloud Billing。

```text
既有 Notion 文件
       │
       ├── 未加入 Catalog ───────────────→ 不出現在網站
       │
       └── 加入 Website Docs Catalog
                    │
                    ├── full ────────────→ 同步 Markdown 全文
                    ├── link-only ───────→ 只同步核准的標題、摘要與 Notion 連結
                    └── hidden ──────────→ 不出現在網站
```

## 2. 現有 Notion 適用性檢查

已使用唯讀方式抽查 SWAG 工作區中的代表性內容，包括：

- Teamspace Home
- QA 測試規範
- 產品介紹
- 測試相關工具

目前文件主要是「散落頁面＋多層子頁」結構，內容可能包含：

- 一般段落、標題與清單
- 表格
- 圖片與附件
- Callout
- Mermaid 圖表
- Columns
- Toggle
- 子頁面與子資料庫
- 自訂 emoji
- Notion、Slack、Google Drive、GitHub 等內部連結

Notion 官方 Markdown API 可以轉換多數常見區塊，但網站端仍需處理 Notion enhanced Markdown 與一般 Markdown 的差異。圖片網址是短效簽名網址，不能直接永久保存，必須在同步時下載到本地資源並改寫連結。

部分文件包含只適合公司內部使用的操作方式、識別資料、測試帳號資訊或內部系統連結。這類文件不可同步全文到目前的公開靜態網站，應使用 `link-only` 或 `hidden`。

### 初步分類建議

| 文件類型 | 建議模式 | 說明 |
| --- | --- | --- |
| 經核准可公開的 onboarding／QA 基礎教材 | `full` | 可同步全文並在網站閱讀 |
| 含內部操作流程或公司系統連結的文件 | `link-only` | 網站顯示核准摘要，內容留在 Notion |
| 測試帳號、Working Board、日常測試紀錄 | `hidden` | 不應出現在靜態網站 |
| 產品介紹索引頁 | `link-only` 或拆分多筆 | 本身多為子頁導覽，適合逐頁決定 |

實際發布模式仍需由文件 owner 或 QA 人工確認。

## 3. 重要安全限制

目前網站使用 Next.js `output: "export"`，生成內容會被放進 Firebase Hosting 的靜態檔案。

這代表：

- 知道檔案網址的人可能直接下載生成的 Markdown、JSON 或 JavaScript。
- 只在 React 前端加入 Firebase Auth，無法真正保護已打包的靜態內容。
- `robots noindex` 只能降低搜尋引擎收錄，不是存取控制。
- 禁止把帳密、token、測試帳號、內部 API、未公開產品資訊或個資同步成全文。

若未來需要直接在網站閱讀機密文件，必須另行規劃具備伺服器端授權的內容服務；這不在本次零成本靜態方案中。

## 4. Website Docs Catalog

### 目前 POC 位置

- 獨立 Workspace：`QA Storming Demo Lab`
- Notion 私人根頁：[`QA Storming Sync Lab`](https://app.notion.com/p/3b14769bed6a8094972fcd7b26233860)
- 根頁下方的 database：[`Website Docs Catalog`](https://app.notion.com/p/f661c7d6e24446d698c0c8b261bf8616)
- Data source ID：`16d3010e-3844-405e-8fbc-4c2fb447d8b9`
- 同步示範來源：[`Moor 快速入門｜同步 Demo`](https://app.notion.com/p/3b14769bed6a81798427ecb26bde5f90)

`QA Storming Sync Lab` 位於隔離的單人 Demo Workspace，不是 SWAG Teamspace，也不會因建立頁面而自動分享給 SWAG 成員。Catalog 是該私人頁面底下的 database；其實際可見範圍仍由 Notion 分享與 Connection 設定決定。原 SWAG 私人頁面的 Catalog 保留為早期 POC，不再作為下週 Demo 的同步來源。

建立一個獨立的 Notion database，名稱建議為：

```text
Website Docs Catalog
```

Catalog 只管理網站同步設定，不取代或搬動原始文件。

### 欄位

| 欄位 | Notion 型別 | 必填 | 說明 |
| --- | --- | --- | --- |
| `Title` | Title | 是 | 網站顯示名稱，不必與原頁標題完全相同 |
| `Source Page URL` | URL | 是 | 既有 Notion 文件網址 |
| `Slug` | Rich text | 是 | 穩定且唯一，例如 `qa-testing-guideline` |
| `Category` | Select | 是 | 文件分類 |
| `Order` | Number | 是 | 同分類內排序，數字小的在前 |
| `Summary` | Rich text | 否 | 網站顯示的人工核准摘要 |
| `Publish Mode` | Select | 是 | `full`、`link-only`、`hidden` |
| `Status` | Select | 是 | `draft`、`published`、`archived` |
| `Owner` | Person | 否 | 文件負責人 |
| `Last edited time` | Last edited time | 自動 | Catalog 項目的最後修改時間 |

### 產品 Know-how 階層擴充

為支援 `/products/moor/<chapter>` 與未來其他產品文件，預計在同一個 `Website Docs Catalog` database 增加：

| 欄位 | Notion 型別 | 必填 | 說明 |
| --- | --- | --- | --- |
| `Product Key` | Select 或 Rich text | 產品文件必填 | 穩定產品識別，例如 `moor` |
| `Chapter Slug` | Rich text | 章節必填 | 產品內章節網址，例如 `live` |
| `Document Type` | Select | 是 | `hub`、`chapter`、`standalone` |
| `Review Status` | Select | 是 | `draft`、`in-review`、`approved` |
| `Parent Slug` | Rich text | 否 | 未來子章節或群組的父層識別 |

程式端已由 manifest schema v2、同步器與 fixtures 支援這些欄位；Notion POC database 已於 2026-08-03 實際新增欄位並完成既有資料回填。

欄位組合規則：

- `standalone`：不設定 `Product Key`、`Chapter Slug`、`Parent Slug`。
- `hub`：必須設定 `Product Key`，不設定章節階層欄位；同一產品只能有一個 hub。
- `chapter`：必須設定 `Product Key` 與 `Chapter Slug`；同一產品內章節 slug 必須唯一，`Parent Slug` 不可等於自身章節 slug。
- `Product Key`、`Chapter Slug`、`Parent Slug` 與一般 `Slug` 都使用小寫 kebab-case。

### Category 初始選項

```text
onboarding
product
qa-know-how
tool
process
```

需要新分類時先更新同步器允許值，再新增 Notion 選項，避免拼字差異產生多個分類。

### 預設值

新增 Catalog 項目時必須預設：

```text
Status = draft
Publish Mode = hidden
Document Type = standalone
Review Status = draft
```

這能避免新項目在尚未審核時被同步到網站。

### 同步判斷

| Status | Publish Mode | Review Status | 結果 |
| --- | --- | --- | --- |
| 非 `published` | 任意 | 任意 | 不輸出 |
| `published` | `hidden` | 任意 | 不輸出 |
| `published` | `link-only`／`full` | 非 `approved` | 不輸出 |
| `published` | `link-only` | `approved` | 輸出核准 metadata 與 Notion 連結 |
| `published` | `full` | `approved` | 下載來源頁全文、圖片並生成 Markdown |

沒有加入 Catalog 的 Notion 文件一律不會被同步。

## 5. 預計資料輸出

```text
src/content/generated/docs/
├── manifest.json
├── onboarding/
│   └── qa-testing-guideline.md
├── product/
│   └── product-overview.md
└── assets/
    ├── 3f91a2c8.png
    └── a21b8d30.webp
```

### `manifest.json`

每份文件保存：

- Notion page ID
- title
- slug
- category
- order
- summary
- publish mode
- document type
- review status（輸出時固定為 `approved`）
- product key／chapter slug／parent slug（依文件類型）
- source URL
- owner（若有）
- Notion last edited time
- content hash
- 本地 Markdown 路徑（僅 `full`）

Manifest 不加入每次執行都會改變的生成時間，避免內容沒有變更時產生 Git diff。

### Markdown

- 一份 Notion 文件生成一個 `.md`，不將所有全文塞進單一 JSON。
- 保留標題、清單、表格、程式碼與可支援的 Mermaid。
- 圖片下載到 `assets/`，依內容 hash 命名。
- Notion 短效圖片網址改寫為本地相對路徑。
- 不修改 generated Markdown；正式修改必須回到 Notion。

## 6. 預計同步指令

實作完成後使用：

```bash
npm run sync:notion
```

同步與網站部署維持分離：

```bash
# 1. 從 Notion 同步
npm run sync:notion

# 2. 檢查產物
git diff -- src/content/generated/docs

# 3. 驗證專案
npm run lint
npm run build

# 4. 確認後才由人員部署
npm run deploy
```

`sync:notion` 不自動執行 build、deploy、git add、commit 或 push。

## 7. Notion Integration 設定

網站同步程式不使用 React 前端，也不使用目前 Codex 的 Notion 連接。正式同步需建立專案專用、唯讀的 Notion internal integration。

### 預計步驟

1. 在 Notion Integrations 建立專用 integration。
2. 權限只開啟 Read content，不提供更新或刪除權限。
3. 將 `Website Docs Catalog` 分享給 integration。
4. 只將允許全文同步的來源頁分享給 integration。
5. 將 token 與 Catalog data source ID 寫入本機 `.env.local`。

```dotenv
NOTION_TOKEN=secret_xxxxxxxxx
NOTION_DOCS_DATA_SOURCE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

`.env.local` 已在 Git ignore 範圍，不得 commit。專案只提供不含真實值的 `.env.example`。

## 8. 同步器行為

預計新增：

```text
scripts/sync-notion.ts
```

同步流程：

1. 載入 `.env.local`。
2. 使用官方 `@notionhq/client` 查詢 Catalog。
3. 驗證 Catalog schema 與每筆欄位。
4. 過濾非 `published`、`hidden` 或未 `approved` 項目。
5. 驗證文件 slug、產品 hub 與產品章節路由唯一，並檢查階層欄位組合、分類及來源 URL。
6. `link-only` 只生成 metadata。
7. `full` 使用 Notion Markdown API 取得全文。
8. 下載圖片並重寫 Markdown 連結。
9. 對 generated content 計算 hash。
10. 寫入暫存目錄。
11. 所有項目成功後才原子替換正式輸出。
12. 印出新增、修改、封存、移除與未變更摘要。

### 失敗保護

下列狀況必須以非零狀態結束，且不可覆寫上一版：

- Notion API 或網路失敗
- Catalog 欄位缺失
- slug 重複或格式錯誤
- Category、Status、Publish Mode、Document Type 或 Review Status 不在允許值
- 產品階層欄位組合錯誤，或 hub／章節路由重複
- `full` 文件未分享給 integration
- Notion 回傳截斷或無法存取的區塊
- 圖片下載失敗
- 輸出 JSON／Markdown 驗證失敗
- 先前 published 文件無預警消失

正常移除文件的流程：

1. 在 Catalog 將 `Status` 設為 `archived`，或將 `Publish Mode` 改為 `hidden`。
2. 執行同步。
3. 檢查移除摘要與 Git diff。

## 9. 特殊 Notion 區塊處理

| Notion 內容 | 預計處理 |
| --- | --- |
| Heading、paragraph、list | 轉為標準 Markdown |
| Table | 保留可解析表格，前台提供橫向捲動 |
| Image | 下載並改寫為本地資源 |
| Callout | 轉為專案可渲染的提示區塊 |
| Mermaid | 保留 fenced code block；前台是否渲染另案處理 |
| Toggle | 轉為 details／summary 或相容 Markdown |
| Columns | 依由左到右順序攤平成單欄 |
| Child page | 只建立連結；不因父頁被選取就自動同步子頁 |
| Child database | 只建立連結或提示，不自動匯出整個 database |
| Embed／bookmark／link preview | 降級為一般連結並記錄 warning |
| Custom emoji | 保留可用文字或降級為一般圖示 |
| Slack／內部 app 連結 | 僅保留於已核准的內容；不得在 `full` 文件中意外公開 |

## 10. 測試計畫

### Fixture

使用本地 fixture 測試，不依賴真實 Notion：

- `full`、`link-only`、`hidden`
- draft、published、archived
- 分類與排序
- 重複 slug
- 缺少必要欄位
- 圖片與附件
- 表格、Callout、Mermaid、Columns、Toggle
- 子頁與子資料庫
- 不支援 block
- API、權限與下載失敗

### 驗收

1. 同一份內容重跑不產生 diff。
2. 失敗時舊資料完全保留。
3. `link-only` 不包含來源頁正文。
4. `hidden` 與未加入 Catalog 的頁面不出現在輸出。
5. 圖片不依賴 Notion 短效網址。
6. `npm run lint` 成功。
7. `npm run build` 成功。
8. 不執行 git add、commit、push 或部署。

## 11. 零成本與未來自動化

第一階段：

- 本機手動執行 `npm run sync:notion`
- Firebase 維持 Spark
- 不連結 Google Cloud Billing
- 不建立 Webhook 接收端

第二階段穩定後可另外評估：

- GitHub Actions `workflow_dispatch` 手動觸發
- 每 6 小時定時同步
- 內容無變更時跳過 build 與 deploy
- 使用標準 Ubuntu runner
- 設定 Actions 超額停止，避免費用

第二階段不在目前實作範圍，也不預設允許自動 commit 或自動部署。

## 12. 後續實作順序

1. ✅ 在 Private 區域建立 `QA Storming Sync Lab`、Catalog 與四種 POC。
2. ✅ 實作型別、schema、preview、同步器、圖片本地化與 fixture tests。
3. ✅ 程式端支援 Product Key／Chapter Slug／Document Type／Review Status／Parent Slug 與 manifest schema v2。
4. ✅ 在 POC Catalog 實際新增五個階層欄位，並為既有項目補 `Document Type`／`Review Status`。
5. 建立唯讀 `QA Storming Docs Reader`,將 Sync Lab 分享給它。
6. 將 token 寫入 `.env.local` 後執行 `npm run sync:notion -- --preview`。
7. 在「API 測試魔法書」手動加入一張安全圖片,重跑 preview 驗證本地化。
8. 人工檢查兩篇 full、link-only 無正文、hidden／未 approved 不輸出。
9. 核准後執行 `npm run sync:notion`,檢查 generated files。
10. 另行設計 library-zone 與文件閱讀介面。
11. 累積數次穩定手動同步後,再決定 GitHub Actions。

## 參考資料

- [Notion：Retrieve a page as Markdown](https://developers.notion.com/reference/retrieve-page-markdown)
- [Notion：Working with Markdown content](https://developers.notion.com/guides/data-apis/working-with-markdown-content)
- [Notion API request limits](https://developers.notion.com/reference/request-limits)
- [Firebase Spark pricing plan](https://firebase.google.com/docs/projects/billing/firebase-pricing-plans)
- [Firebase Hosting quotas and pricing](https://firebase.google.com/docs/hosting/usage-quotas-pricing)
- [GitHub Actions billing](https://docs.github.com/en/billing/concepts/product-billing/github-actions)
