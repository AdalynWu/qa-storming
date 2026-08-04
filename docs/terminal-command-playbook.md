# QA Storming Terminal 指令操作手冊

這份文件整理日常最常用的 Terminal 流程。所有指令都要在專案根目錄執行：

```bash
cd /Users/adalynwu/swag/qa-storming
```

## 最常用的三組指令

### Regression Sheet 更新後

```bash
npm run sync:regression
npm run test:regression
npm run lint
```

只驗證、不發布：

```bash
npm run build
```

若確認要發布，改用：

```bash
npm run deploy
```

### Notion 文件更新後，同時更新 AI Bot

```bash
npm run sync:notion -- --preview
npm run refresh:notion
npm run test:notion
npm run test:chatbot
npm run lint
```

只驗證、不發布：

```bash
npm run build
```

若確認要發布，改用：

```bash
npm run deploy
```

### 只重建 AI Bot 搜尋索引

```bash
npm run build:chat-index
npm run test:chatbot
```

接著依需求選擇 `npm run build`（只驗證）或 `npm run deploy`（建置並發布）。

## 第一次開啟專案

確認 Node.js 版本；專案要求 `22.13.0` 以上：

```bash
node --version
```

安裝套件：

```bash
npm install
```

只有第一次取得專案，或 `package.json`／`package-lock.json` 改變時需要重新安裝。

確認 `.env.local` 存在：

```bash
test -f .env.local && echo ".env.local exists" || echo ".env.local missing"
```

安全查看「哪些設定鍵已存在」，不輸出實際值：

```bash
sed -n '/^[[:space:]]*#/d; /^[[:space:]]*$/d; s/[[:space:]]*=.*$//p' .env.local | sort
```

不要用 `cat .env.local` 分享終端畫面或截圖，避免洩漏 Token、憑證路徑或其他設定值。

## Regression Google Sheet 同步

### 什麼時候執行

- `Suites` 或 `Cases` 分頁有新增、修改、封存或排序變更。
- 分享或部署前，要把最近一次 Sheet 內容更新到網站。

### Sheet 編輯原則

- `draft` 案例可以修改 ID、刪除或調整順序。
- `active` 案例不再使用時，先改為 `archived` 並同步，不要直接刪除。
- 若要永久移除案例，先完成一次 `archived` 同步，再從 Sheet 刪除並再次同步。
- 網站生成檔 `src/content/generated/regression.json` 不要手動修改。

### 正式同步

```bash
npm run sync:regression
```

成功時會看到類似：

```text
Regression 同步完成：新增 0、修改 2、封存 0、移除 0、順序變更 否
```

同步會更新：

```text
src/content/generated/regression.json
```

### 驗證

```bash
npm run test:regression
npm run lint
npx tsc --noEmit
npm run build
```

`npm run build` 成功後，靜態網站會輸出到 `out/`。

### 現在不要再使用的指令

```bash
npm run sync:regression -- --replace-sample-baseline
```

這個參數只供第一次用正式 Sheet 取代內建 sample baseline。專案已完成正式 Sheet 串接，日常同步不要再加這個參數，它也不能用來略過 active 案例刪除保護。

### 常見錯誤

`請在 .env.local 設定 REGRESSION_SHEET_ID`

- `.env.local` 缺少 Sheet ID，或指令不是在 repo root 執行。

`無法讀取 Suites 或 Cases 分頁`

- 確認分頁名稱必須完全是 `Suites`、`Cases`。
- 確認 Sheet 已分享給 service account 的 `client_email`，權限至少為檢視者。

`下列 active 案例從 Sheet 消失`

- 把案例加回 Sheet。
- 先將 `lifecycleStatus` 改成 `archived`，執行同步。
- 確認 archived 已進站後，才從 Sheet 永久移除並再次同步。

## Notion 文件同步

### 什麼時候執行

- Notion 來源頁內容有修改。
- `Website Docs Catalog` 有新增文件或調整發布狀態。
- 要更新 Moor、Web、工具手冊、錯誤代碼等 generated Markdown。

### 正式發布條件

文件必須同時符合：

```text
Status = published
Review Status = approved
Publish Mode = full 或 link-only
```

`hidden`、未 published 或未 approved 的內容不會輸出。

### 第一步：預覽同步

```bash
npm run sync:notion -- --preview
```

預覽結果會放在：

```text
work/notion-preview
```

預覽不會更新網站正式內容，也不會更新 AI Bot 索引。適合在正式同步前確認文件數量、Markdown 與圖片結果。

### 第二步：正式同步

只更新 Notion generated 文件：

```bash
npm run sync:notion
```

正式輸出位置：

```text
src/content/generated/docs
```

成功時會看到類似：

```text
Notion 正式同步完成：全文 20、連結 0、輸出 .../src/content/generated/docs
```

### 推薦：同步 Notion 並立即更新 AI Bot

```bash
npm run refresh:notion
```

這一行等同依序執行：

```bash
npm run sync:notion
npm run build:chat-index
```

如果修改的 Notion 文件會被 AI Bot 使用，日常操作優先使用 `refresh:notion`。

### 驗證

```bash
npm run test:notion
npm run test:chatbot
npm run lint
npx tsc --noEmit
npm run build
```

### 常見錯誤

`請在 .env.local 設定 NOTION_TOKEN`

- 缺少唯讀 Internal Connection Token。
- Token 不可使用 `NEXT_PUBLIC_*` 名稱。

`請在 .env.local 設定 NOTION_DOCS_DATA_SOURCE_ID`

- 缺少 Website Docs Catalog 的 data source ID。

Catalog schema 不正確

- 檢查 Catalog 欄位名稱與型別是否符合 `docs/notion-content-sync.md`。

`full` 文件無法讀取

- 除了 Catalog，來源頁本身也必須分享給同一個 Notion Integration。

文件沒有出現在網站

- 依序檢查 `Status`、`Publish Mode`、`Review Status`。
- 檢查文件是否真的加入 Website Docs Catalog。
- `full` 文件需要有效來源頁，`link-only` 只輸出摘要與連結。

## AI Bot 知識索引

### 先理解「同步 AI Bot」是什麼

專案不會把整個 Notion 傳給 Gemini，也沒有一個遠端的 AI 知識庫需要同步。

AI Bot 使用的是網站內的本地搜尋索引：

```text
核准的 Notion generated Markdown
    → build:chat-index
    → public/chatbot-search-index.json
    → 使用者提問時先搜尋相關段落
    → 再請模型依找到的內容回答
```

只有 `full + approved + markdownPath` 的文件會進入索引。

### Notion 已同步，只想重建 Bot 索引

```bash
npm run build:chat-index
```

成功時會看到類似：

```text
Chatbot 索引完成：20 份核准文件、29 個段落 → public/chatbot-search-index.json
```

### Notion 和 Bot 都要更新

```bash
npm run refresh:notion
```

### 測試 Bot 搜尋與回答規則

```bash
npm run test:chatbot
```

### 查看目前索引數量

```bash
node -e "const d=require('./public/chatbot-search-index.json'); console.log(d._meta)"
```

這只顯示 schema、內容 hash、文件數與段落數，不會呼叫 Gemini。

### Bot 內容仍是舊的

如果 Notion 內容已改但尚未同步：

```bash
npm run refresh:notion
```

如果 generated Markdown 已經是新的，只缺索引：

```bash
npm run build:chat-index
```

接著重新 build 或重新啟動開發伺服器：

```bash
npm run build
```

### 只修改 Firebase 或模型設定

若只修改 `.env.local` 中的 Firebase Web config、App Check site key 或模型名稱，不需要同步 Notion，但需要重新建置與部署：

```bash
npm run test:chatbot
npm run build
npm run deploy
```

注意：`NEXT_PUBLIC_*` 會進入瀏覽器 bundle。只能放 Firebase Web App 公開設定、App Check site key 與非機密模型名稱，不能放 Gemini Developer API Key、Notion Token 或 Google service-account 內容。

### Bot 回傳 `500`／`503` high demand

這代表 Markdown 檢索已完成，但 Gemini 當下容量尖峰。前端會自動等待 400ms、1000ms 重試兩次；仍失敗才顯示「目前詢問人數較多」。不需要重新同步 Notion、重建索引或更換 App Check 設定，稍候重新提問即可。若長時間持續發生，再到 Firebase AI Logic monitoring 檢查錯誤率與 quota，並確認 `.env.local` 使用 Firebase AI Logic 官方仍支援的穩定模型名稱。

## 本機開發與預覽

### 開發模式

```bash
npm run dev
```

依 Terminal 顯示的網址開啟，通常是：

```text
http://localhost:3000
```

停止伺服器：

```text
Control + C
```

修改 `.env.local` 後，建議停止再重新執行 `npm run dev`。

### Production build

```bash
npm run build
```

Build 前會自動執行：

1. `npm run check:images`
2. `npm run build:chat-index`
3. Next.js production build

Build 不會自動連線 Notion，也不會同步 Google Sheet。它只使用當下已存在的 generated 檔案。

### 預覽 production 靜態輸出

先 build：

```bash
npm run build
```

再啟動 Firebase Hosting Emulator：

```bash
firebase emulators:start --only hosting
```

依 Terminal 顯示的 Hosting 網址開啟。停止方式同樣是 `Control + C`。

不要使用 `npm run start` 預覽；本專案是 `output: "export"` 靜態輸出，應預覽 `out/`。

## 測試與檢查

### ESLint

```bash
npm run lint
```

### TypeScript

```bash
npx tsc --noEmit
```

### Regression 同步器測試

```bash
npm run test:regression
```

### Notion 同步與 Markdown 測試

```bash
npm run test:notion
```

### AI Bot 測試

```bash
npm run test:chatbot
```

### 圖片體積與衍生檔檢查

```bash
npm run check:images
```

### 完整 production build

```bash
npm run build
```

`npm test` 目前等同 `npm run build`，日常直接使用 `npm run build` 較清楚。

## 圖片更新

只有在新增或修改 `public/` 裡的 PNG 母檔時，才需要執行：

```bash
npm run optimize:images
```

它會重新產生 AVIF／WebP。完成後檢查：

```bash
npm run check:images
npm run lint
npm run build
```

不要直接修改 AVIF／WebP，也不要只更新 PNG 而忘記重新產生衍生檔。

## 部署 Firebase Hosting

### 第一次在這台電腦部署

```bash
firebase login
```

帳號必須有 `qa-storming` Firebase 專案權限。`.firebaserc` 已把預設專案設為 `qa-storming`。

### 正式部署

```bash
npm run deploy
```

這一行已經包含：

```text
npm run build
firebase deploy --only hosting
```

不要為了部署而特別先執行一次 `npm run build`，接著立刻又執行 `npm run deploy`；這樣會重複 build。若先前是為了本機驗收或 Emulator 預覽而 build，之後執行 deploy 時再自動 build 一次則是正常的。

部署不會自動同步 Google Sheet 或 Notion。要先完成對應的同步，再執行 deploy。

## 依情境選指令

| 今天改了什麼 | 應執行 |
| --- | --- |
| Regression Sheet | `sync:regression` → `test:regression` → `lint` → `build` |
| Notion 文件，而且 Bot 也要讀到 | `sync:notion -- --preview` → `refresh:notion` → `test:notion` → `test:chatbot` → `lint` → `build` |
| Notion 文件，但只想先看同步結果 | `sync:notion -- --preview` |
| generated 文件沒變，只想重建 Bot 索引 | `build:chat-index` → `test:chatbot` |
| Bot 的 Firebase／模型環境設定 | `test:chatbot` → `build` |
| React、CSS 或一般網站程式 | `lint` → `npx tsc --noEmit` → `build` |
| PNG 場景或 sprite | `optimize:images` → `check:images` → `lint` → `build` |
| 確認後正式上線 | `deploy` |

## 分享會前推薦流程

若明天前 Google Sheet 與 Notion 都可能有更新：

```bash
npm run sync:regression
npm run sync:notion -- --preview
npm run refresh:notion
npm run test:regression
npm run test:notion
npm run test:chatbot
npm run lint
npx tsc --noEmit
npm run build
```

先用 Firebase Emulator 實際走一次 Demo：

```bash
firebase emulators:start --only hosting
```

確認沒問題並決定發布時：

```bash
npm run deploy
```

本文件刻意不列 Git 指令；依專案規範，Git staging、commit、push、pull 與 branch 由使用者本人處理。
